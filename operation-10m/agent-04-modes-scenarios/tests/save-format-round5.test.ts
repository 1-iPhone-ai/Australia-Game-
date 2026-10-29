import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  attachMarathonQueueToState,
  createEmptyO10mModesPersistedState,
  createMarathonQueue,
  importO10mModesProgressJson,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  applyPostRunPersistedUpdates,
  replayLedgerSummary,
  sealO10mModesPersistedState,
  verifyO10mModesIntegrity,
  mergeO10mModesPersistedStates,
} from '../src/index.js';

const sampleRun = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_marathon_pace_setter',
  challengeModeIds: [] as [],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 6,
  playerMoney: 3000,
  playerNetWorth: 3200,
  regionsControlled: 1,
  maxRegionalStanding: 55,
  rivalNetWorth: 2000,
  optionalObjectivesCompleted: 0,
  totalObjectives: 2,
};

describe('save format round 5 marathon schema', () => {
  it('migrates schema v4 blob to v5 with marathon defaults', () => {
    const v4 = {
      schemaVersion: 4,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_slot_rotation_lab',
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
    };
    const v5 = migrateO10mModesPersistedState(v4);
    assert.equal(v5.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v5.marathonQueue, null);
    assert.deepEqual(v5.replayLedger, []);
  });

  it('attaches marathon queue and planner prefers marathon_step', () => {
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_sprint_lab',
      label: 'Sprint lab',
      scenarioIds: [
        'o10m_marathon_pace_setter',
        'o10m_marathon_rhythm_hold',
        'o10m_marathon_sprint_close',
      ],
    });
    assert.ok(queue);
    let state = attachMarathonQueueToState(createEmptyO10mModesPersistedState(), queue!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'marathon_step');
    assert.equal(plan.scenarioId, 'o10m_marathon_pace_setter');
    assert.equal(plan.marathonCursor, 0);

    state = applyPostRunPersistedUpdates(state, sampleRun, 10);
    assert.equal(state.marathonQueue?.cursor, 1);
    assert.equal(state.scenarioId, 'o10m_marathon_rhythm_hold');
    const ledger = replayLedgerSummary(state);
    assert.equal(ledger.trackedScenarios, 1);
    assert.equal(ledger.totalPlays, 1);
  });

  it('deactivates marathon queue after final primary victory when not looping', () => {
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_finale_only',
      label: 'Finale',
      scenarioIds: ['o10m_marathon_sprint_close'],
      loopOnComplete: false,
    });
    let state = attachMarathonQueueToState(createEmptyO10mModesPersistedState(), queue!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...sampleRun, scenarioId: 'o10m_marathon_sprint_close' },
      20,
    );
    assert.equal(state.marathonQueue?.active, false);
    assert.equal(planNextCampaignAction(state).kind, 'free_play');
  });

  it('round-trips sealed v5 through import and union merge replay ledger', () => {
    let state = sealO10mModesPersistedState(createEmptyO10mModesPersistedState());
    state = applyPostRunPersistedUpdates(state, sampleRun, 5);
    state = sealO10mModesPersistedState(state);
    assert.equal(verifyO10mModesIntegrity(state), true);

    const imported = importO10mModesProgressJson(JSON.stringify(state));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.schemaVersion, 5);

    const other = applyPostRunPersistedUpdates(createEmptyO10mModesPersistedState(), sampleRun, 8);
    const merged = mergeO10mModesPersistedStates(state, other, 'union_milestones');
    assert.ok((merged.merged.replayLedger ?? []).some(r => r.scenarioId === 'o10m_marathon_pace_setter'));
  });
});
