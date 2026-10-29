import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachSiegeSessionToState,
  attachVoyageSessionToState,
  buildSiegeScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createSiegeSession,
  createVoyageSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  siegeMoraleFromRun,
  unlockTokenForSiegeId,
  type O10mChallengeModeId,
} from '../src/index.js';

const siegeRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_siege_mustering_yard',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 3900,
  playerNetWorth: 4100,
  regionsControlled: 2,
  maxRegionalStanding: 56,
  rivalNetWorth: 2000,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 14 siege schema', () => {
  it('migrates schema v13 blob to v14 with siege defaults', () => {
    const v13 = {
      schemaVersion: 13,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_voyage_embark_pier',
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
      caravanSession: null,
      voyageSession: null,
    };
    const v14 = migrateO10mModesPersistedState(v13);
    assert.equal(v14.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v14.siegeSession, null);
  });

  it('attaches siege and planner prefers siege_step with morale hint', () => {
    const { session } = createSiegeSession({
      siegeId: 'o10m_siege_fortress_arc',
      label: 'Fortress arc',
      scenarioIds: [
        'o10m_siege_mustering_yard',
        'o10m_siege_breach_wall',
        'o10m_siege_relief_finale',
      ],
    });
    assert.ok(session);
    const state = attachSiegeSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.voyageSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'siege_step');
    assert.equal(plan.scenarioId, 'o10m_siege_mustering_yard');
    assert.equal(plan.siegePhase, 'mustering');
    assert.equal(plan.siegeMorale, 0);
  });

  it('advances siege phases, accrues morale, and grants unlock token on completion', () => {
    const { session } = createSiegeSession({
      siegeId: 'o10m_siege_fortress_arc',
      label: 'Fortress arc',
      scenarioIds: [
        'o10m_siege_mustering_yard',
        'o10m_siege_breach_wall',
        'o10m_siege_relief_finale',
      ],
    });
    let state = attachSiegeSessionToState(createEmptyO10mModesPersistedState(), session!);
    const morale = siegeMoraleFromRun(siegeRunBase);
    assert.ok(morale > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...siegeRunBase, scenarioId: 'o10m_siege_mustering_yard' },
      4,
    );
    assert.equal(state.siegeSession?.cursor, 1);
    assert.equal(state.siegeSession?.phaseTag, 'breach');
    assert.ok((state.siegeSession?.moraleScore ?? 0) >= morale);

    const overrides = buildSiegeScenarioStartOverrides(state.siegeSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveSiegePhase, 'breach');

    state = applyPostRunPersistedUpdates(
      state,
      { ...siegeRunBase, scenarioId: 'o10m_siege_breach_wall' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...siegeRunBase, scenarioId: 'o10m_siege_relief_finale' },
      6,
    );
    assert.equal(state.siegeSession?.active, false);
    const token = unlockTokenForSiegeId('o10m_siege_fortress_arc');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('siege attach clears an active voyage session', () => {
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_voyage_embark_pier'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_siege_mustering_yard'],
    });
    let state = attachVoyageSessionToState(createEmptyO10mModesPersistedState(), voyage!);
    state = attachSiegeSessionToState(state, siege!);
    assert.equal(state.voyageSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'siege_step');
  });

  it('importO10mModesProgressJson round-trips siege session', () => {
    const { session } = createSiegeSession({
      siegeId: 'o10m_siege_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const attached = attachSiegeSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.siegeSession?.siegeId, 'o10m_siege_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
