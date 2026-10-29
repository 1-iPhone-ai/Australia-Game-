import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCaravanSessionToState,
  attachPilgrimageSessionToState,
  buildCaravanScenarioStartOverrides,
  createCaravanSession,
  createEmptyO10mModesPersistedState,
  createPilgrimageSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  caravanCargoFromRun,
  unlockTokenForCaravanId,
  type O10mChallengeModeId,
} from '../src/index.js';

const caravanRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_caravan_assembly_yard',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 3700,
  playerNetWorth: 3900,
  regionsControlled: 2,
  maxRegionalStanding: 50,
  rivalNetWorth: 1900,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 12 caravan schema', () => {
  it('migrates schema v11 blob to v12 with caravan defaults', () => {
    const v11 = {
      schemaVersion: 11,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_pilgrimage_setting_out',
      challengeModeIds: [],
      sandboxProfileId: null,
      sandboxKnobs: {},
      milestones: [],
      completedChainIds: [],
      recentRuns: [],
      chainProgress: null,
      objectiveProgress: [],
      campaignSlots: [],
      activeCampaignSlotId: null,
      challengeStreak: { current: 0, best: 0, lastScenarioId: null },
      marathonQueue: null,
      replayLedger: [],
      gauntletSession: null,
      catalogUnlockTokens: [],
      relaySession: null,
      circuitSession: null,
      expeditionSession: null,
      odysseySession: null,
      pilgrimageSession: null,
    };
    const v12 = migrateO10mModesPersistedState(v11);
    assert.equal(v12.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v12.caravanSession, null);
  });

  it('attaches caravan and planner prefers caravan_step with cargo hint', () => {
    const { session } = createCaravanSession({
      caravanId: 'o10m_caravan_spice_line',
      label: 'Spice line',
      scenarioIds: [
        'o10m_caravan_assembly_yard',
        'o10m_caravan_dune_crossing',
        'o10m_caravan_bazaar_finale',
      ],
    });
    assert.ok(session);
    const state = attachCaravanSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.pilgrimageSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'caravan_step');
    assert.equal(plan.scenarioId, 'o10m_caravan_assembly_yard');
    assert.equal(plan.caravanLeg, 'assembly');
    assert.equal(plan.caravanCargo, 0);
  });

  it('advances caravan legs, accrues cargo, and grants unlock token on completion', () => {
    const { session } = createCaravanSession({
      caravanId: 'o10m_caravan_spice_line',
      label: 'Spice line',
      scenarioIds: [
        'o10m_caravan_assembly_yard',
        'o10m_caravan_dune_crossing',
        'o10m_caravan_bazaar_finale',
      ],
    });
    let state = attachCaravanSessionToState(createEmptyO10mModesPersistedState(), session!);
    const cargo = caravanCargoFromRun(caravanRunBase);
    assert.ok(cargo > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...caravanRunBase, scenarioId: 'o10m_caravan_assembly_yard' },
      4,
    );
    assert.equal(state.caravanSession?.cursor, 1);
    assert.equal(state.caravanSession?.legTag, 'crossing');
    assert.ok((state.caravanSession?.cargoScore ?? 0) >= cargo);

    const overrides = buildCaravanScenarioStartOverrides(state.caravanSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveCaravanLeg, 'crossing');

    state = applyPostRunPersistedUpdates(
      state,
      { ...caravanRunBase, scenarioId: 'o10m_caravan_dune_crossing' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...caravanRunBase, scenarioId: 'o10m_caravan_bazaar_finale' },
      6,
    );
    assert.equal(state.caravanSession?.active, false);
    const token = unlockTokenForCaravanId('o10m_caravan_spice_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('caravan attach clears an active pilgrimage session', () => {
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_pilgrimage_setting_out'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_caravan_assembly_yard'],
    });
    let state = attachPilgrimageSessionToState(createEmptyO10mModesPersistedState(), pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    assert.equal(state.pilgrimageSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'caravan_step');
  });

  it('importO10mModesProgressJson round-trips caravan session', () => {
    const { session } = createCaravanSession({
      caravanId: 'o10m_caravan_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const attached = attachCaravanSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.caravanSession?.caravanId, 'o10m_caravan_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
