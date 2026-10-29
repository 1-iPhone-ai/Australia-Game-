import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachGauntletSessionToState,
  attachMarathonQueueToState,
  createEmptyO10mModesPersistedState,
  createGauntletSession,
  createMarathonQueue,
  importO10mModesProgressJson,
  mergeO10mModesPersistedStates,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  sealO10mModesPersistedState,
  unlockTokenForGauntletId,
  verifyO10mModesIntegrity,
} from '../src/index.js';

const gauntletRunBase = {
  baseMode: 'scenario' as const,
  challengeModeIds: ['o10m_ironman'] as ('o10m_ironman')[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 8,
  playerMoney: 4000,
  playerNetWorth: 4200,
  regionsControlled: 2,
  maxRegionalStanding: 55,
  rivalNetWorth: 2000,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 6 gauntlet schema', () => {
  it('migrates schema v5 blob to v6 with gauntlet defaults', () => {
    const v5 = {
      schemaVersion: 5,
      updatedAtTurn: 2,
      baseMode: 'scenario',
      scenarioId: 'o10m_marathon_pace_setter',
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
    };
    const v6 = migrateO10mModesPersistedState(v5);
    assert.equal(v6.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v6.gauntletSession, null);
    assert.deepEqual(v6.catalogUnlockTokens, []);
  });

  it('attaches gauntlet with ironman lock-in and planner prefers gauntlet_step', () => {
    const { session } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_iron_lab',
      label: 'Iron lab',
      scenarioIds: [
        'o10m_gauntlet_opening_gate',
        'o10m_gauntlet_midfield_press',
        'o10m_gauntlet_iron_finish',
      ],
      livesRemaining: 2,
      requiredChallengeId: 'o10m_ironman',
    });
    assert.ok(session);
    let state = attachGauntletSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.deepEqual(state.challengeModeIds, ['o10m_ironman']);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'gauntlet_step');
    assert.equal(plan.scenarioId, 'o10m_gauntlet_opening_gate');
    assert.equal(plan.gauntletLives, 2);
  });

  it('prefers gauntlet over marathon queue in planner', () => {
    const { session } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_under',
      label: 'Under',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = attachMarathonQueueToState(createEmptyO10mModesPersistedState(), queue!);
    state = attachGauntletSessionToState(state, session!);
    assert.equal(planNextCampaignAction(state).kind, 'gauntlet_step');
  });

  it('advances gauntlet on primary victory and grants unlock token on completion', () => {
    const { session } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_finale_only',
      label: 'Finale',
      scenarioIds: ['o10m_gauntlet_iron_finish'],
      requiredChallengeId: 'o10m_ironman',
    });
    let state = attachGauntletSessionToState(createEmptyO10mModesPersistedState(), session!);
    const token = unlockTokenForGauntletId('o10m_gauntlet_finale_only');
    assert.equal(token, 'o10m_unlock_finale_only');
    state = applyPostRunPersistedUpdates(
      state,
      { ...gauntletRunBase, scenarioId: 'o10m_gauntlet_iron_finish' },
      12,
    );
    assert.equal(state.gauntletSession?.active, false);
    assert.ok((state.catalogUnlockTokens ?? []).includes('o10m_unlock_finale_only'));
  });

  it('consumes a life on failed primary without advancing cursor', () => {
    const { session } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_lives_test',
      label: 'Lives',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
      livesRemaining: 2,
      requiredChallengeId: 'o10m_ironman',
    });
    let state = attachGauntletSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      {
        ...gauntletRunBase,
        scenarioId: 'o10m_gauntlet_opening_gate',
        primaryVictory: false,
        challengeModeIds: ['o10m_ironman'],
      },
      3,
    );
    assert.equal(state.gauntletSession?.cursor, 0);
    assert.equal(state.gauntletSession?.livesRemaining, 1);
    assert.equal(state.gauntletSession?.active, true);
  });

  it('round-trips sealed v6 through import and union merge unlock tokens', () => {
    let state = sealO10mModesPersistedState(createEmptyO10mModesPersistedState());
    state = {
      ...state,
      catalogUnlockTokens: ['o10m_unlock_finale_only'],
    };
    state = sealO10mModesPersistedState(state);
    assert.equal(verifyO10mModesIntegrity(state), true);

    const imported = importO10mModesProgressJson(JSON.stringify(state));
    assert.equal(imported.errors.length, 0);
    assert.equal(imported.state!.schemaVersion, 6);

    const other = {
      ...createEmptyO10mModesPersistedState(),
      catalogUnlockTokens: ['o10m_unlock_other_path'],
    };
    const merged = mergeO10mModesPersistedStates(state, other, 'union_milestones');
    assert.ok((merged.merged.catalogUnlockTokens ?? []).includes('o10m_unlock_finale_only'));
    assert.ok((merged.merged.catalogUnlockTokens ?? []).includes('o10m_unlock_other_path'));
  });
});
