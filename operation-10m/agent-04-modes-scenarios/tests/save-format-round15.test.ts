import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachConvoySessionToState,
  attachSiegeSessionToState,
  buildConvoyScenarioStartOverrides,
  convoyHaulFromRun,
  createConvoySession,
  createEmptyO10mModesPersistedState,
  createSiegeSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  unlockTokenForConvoyId,
  type O10mChallengeModeId,
} from '../src/index.js';

const convoyRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_convoy_staging_depot',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4000,
  playerNetWorth: 4200,
  regionsControlled: 2,
  maxRegionalStanding: 57,
  rivalNetWorth: 2100,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 15 convoy schema', () => {
  it('migrates schema v14 blob to v15 with convoy defaults', () => {
    const v14 = {
      schemaVersion: 14,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_siege_mustering_yard',
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
      siegeSession: null,
    };
    const v15 = migrateO10mModesPersistedState(v14);
    assert.equal(v15.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v15.convoySession, null);
  });

  it('attaches convoy and planner prefers convoy_step with haul hint', () => {
    const { session } = createConvoySession({
      convoyId: 'o10m_convoy_outback_line',
      label: 'Outback line',
      scenarioIds: [
        'o10m_convoy_staging_depot',
        'o10m_convoy_transit_corridor',
        'o10m_convoy_delivery_finale',
      ],
    });
    assert.ok(session);
    const state = attachConvoySessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.siegeSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'convoy_step');
    assert.equal(plan.scenarioId, 'o10m_convoy_staging_depot');
    assert.equal(plan.convoyStage, 'staging');
    assert.equal(plan.convoyHaul, 0);
  });

  it('advances convoy stages, accrues haul, and grants unlock token on completion', () => {
    const { session } = createConvoySession({
      convoyId: 'o10m_convoy_outback_line',
      label: 'Outback line',
      scenarioIds: [
        'o10m_convoy_staging_depot',
        'o10m_convoy_transit_corridor',
        'o10m_convoy_delivery_finale',
      ],
    });
    let state = attachConvoySessionToState(createEmptyO10mModesPersistedState(), session!);
    const haul = convoyHaulFromRun(convoyRunBase);
    assert.ok(haul > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...convoyRunBase, scenarioId: 'o10m_convoy_staging_depot' },
      4,
    );
    assert.equal(state.convoySession?.cursor, 1);
    assert.equal(state.convoySession?.stageTag, 'transit');
    assert.ok((state.convoySession?.haulScore ?? 0) >= haul);

    const overrides = buildConvoyScenarioStartOverrides(state.convoySession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveConvoyStage, 'transit');

    state = applyPostRunPersistedUpdates(
      state,
      { ...convoyRunBase, scenarioId: 'o10m_convoy_transit_corridor' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...convoyRunBase, scenarioId: 'o10m_convoy_delivery_finale' },
      6,
    );
    assert.equal(state.convoySession?.active, false);
    const token = unlockTokenForConvoyId('o10m_convoy_outback_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('convoy attach clears an active siege session', () => {
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_siege_mustering_yard'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_convoy_staging_depot'],
    });
    let state = attachSiegeSessionToState(createEmptyO10mModesPersistedState(), siege!);
    state = attachConvoySessionToState(state, convoy!);
    assert.equal(state.siegeSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'convoy_step');
  });

  it('importO10mModesProgressJson round-trips convoy session', () => {
    const { session } = createConvoySession({
      convoyId: 'o10m_convoy_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const attached = attachConvoySessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.convoySession?.convoyId, 'o10m_convoy_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
