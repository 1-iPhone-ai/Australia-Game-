import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCaravanSessionToState,
  attachVoyageSessionToState,
  buildVoyageScenarioStartOverrides,
  createCaravanSession,
  createEmptyO10mModesPersistedState,
  createVoyageSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  voyageChartFromRun,
  unlockTokenForVoyageId,
  type O10mChallengeModeId,
} from '../src/index.js';

const voyageRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_voyage_embark_pier',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 3800,
  playerNetWorth: 4000,
  regionsControlled: 2,
  maxRegionalStanding: 55,
  rivalNetWorth: 1900,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 13 voyage schema', () => {
  it('migrates schema v12 blob to v13 with voyage defaults', () => {
    const v12 = {
      schemaVersion: 12,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_caravan_assembly_yard',
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
    };
    const v13 = migrateO10mModesPersistedState(v12);
    assert.equal(v13.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v13.voyageSession, null);
  });

  it('attaches voyage and planner prefers voyage_step with chart hint', () => {
    const { session } = createVoyageSession({
      voyageId: 'o10m_voyage_coastal_arc',
      label: 'Coastal arc',
      scenarioIds: [
        'o10m_voyage_embark_pier',
        'o10m_voyage_open_sea_passage',
        'o10m_voyage_port_call_finale',
      ],
    });
    assert.ok(session);
    const state = attachVoyageSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.caravanSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'voyage_step');
    assert.equal(plan.scenarioId, 'o10m_voyage_embark_pier');
    assert.equal(plan.voyageSegment, 'embark');
    assert.equal(plan.voyageChart, 0);
  });

  it('advances voyage segments, accrues chart, and grants unlock token on completion', () => {
    const { session } = createVoyageSession({
      voyageId: 'o10m_voyage_coastal_arc',
      label: 'Coastal arc',
      scenarioIds: [
        'o10m_voyage_embark_pier',
        'o10m_voyage_open_sea_passage',
        'o10m_voyage_port_call_finale',
      ],
    });
    let state = attachVoyageSessionToState(createEmptyO10mModesPersistedState(), session!);
    const chart = voyageChartFromRun(voyageRunBase);
    assert.ok(chart > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...voyageRunBase, scenarioId: 'o10m_voyage_embark_pier' },
      4,
    );
    assert.equal(state.voyageSession?.cursor, 1);
    assert.equal(state.voyageSession?.segmentTag, 'open_sea');
    assert.ok((state.voyageSession?.chartScore ?? 0) >= chart);

    const overrides = buildVoyageScenarioStartOverrides(state.voyageSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveVoyageSegment, 'open_sea');

    state = applyPostRunPersistedUpdates(
      state,
      { ...voyageRunBase, scenarioId: 'o10m_voyage_open_sea_passage' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...voyageRunBase, scenarioId: 'o10m_voyage_port_call_finale' },
      6,
    );
    assert.equal(state.voyageSession?.active, false);
    const token = unlockTokenForVoyageId('o10m_voyage_coastal_arc');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('voyage attach clears an active caravan session', () => {
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_caravan_assembly_yard'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_voyage_embark_pier'],
    });
    let state = attachCaravanSessionToState(createEmptyO10mModesPersistedState(), caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    assert.equal(state.caravanSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'voyage_step');
  });

  it('importO10mModesProgressJson round-trips voyage session', () => {
    const { session } = createVoyageSession({
      voyageId: 'o10m_voyage_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const attached = attachVoyageSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.voyageSession?.voyageId, 'o10m_voyage_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
