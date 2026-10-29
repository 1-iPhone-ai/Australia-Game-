import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachRemandSessionToState,
  attachReversalSessionToState,
  buildReversalScenarioStartOverrides,
  createRemandSession,
  createReversalSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  reversalScoreFromRun,
  unlockTokenForReversalId,
  type O10mChallengeModeId,
} from '../src/index.js';

const reversalRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_reversal_motion_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5200,
  playerNetWorth: 5400,
  regionsControlled: 2,
  maxRegionalStanding: 72,
  rivalNetWorth: 2500,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 35 reversal schema', () => {
  it('migrates schema v34 blob to v35 with reversal defaults', () => {
    const v34 = {
      schemaVersion: 34,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_remand_order_docket',
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
      convoySession: null,
      escortSession: null,
      extractionSession: null,
      subjectSession: null,
      witnessSession: null,
      tribunalSession: null,
      indictmentSession: null,
      appealSession: null,
      clemencySession: null,
      pardonSession: null,
      amnestySession: null,
      reprieveSession: null,
      paroleSession: null,
      probationSession: null,
      commutationSession: null,
      acquittalSession: null,
      exonerationSession: null,
      expungementSession: null,
      vacaturSession: null,
      remandSession: null,
    };
    const v35 = migrateO10mModesPersistedState(v34);
    assert.equal(v35.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v35.reversalSession, null);
  });

  it('attaches reversal and planner prefers reversal_step with score hint', () => {
    const { session } = createReversalSession({
      reversalId: 'o10m_reversal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_reversal_motion_docket',
        'o10m_reversal_review_chamber',
        'o10m_reversal_score_finale',
      ],
    });
    assert.ok(session);
    const state = attachReversalSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'reversal_step');
    assert.equal(plan.scenarioId, 'o10m_reversal_motion_docket');
    assert.equal(plan.reversalPhase, 'motion');
    assert.equal(plan.reversalScore, 0);
  });

  it('advances reversal phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createReversalSession({
      reversalId: 'o10m_reversal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_reversal_motion_docket',
        'o10m_reversal_review_chamber',
        'o10m_reversal_score_finale',
      ],
    });
    assert.ok(session);
    const score = reversalScoreFromRun(reversalRunBase);
    assert.ok(score > 0);

    let state = attachReversalSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...reversalRunBase, scenarioId: 'o10m_reversal_motion_docket' },
      4,
    );
    assert.equal(state.reversalSession?.cursor, 1);
    assert.equal(state.reversalSession?.phaseTag, 'review');
    assert.ok((state.reversalSession?.reversalScore ?? 0) >= score);

    const overrides = buildReversalScenarioStartOverrides(state.reversalSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveReversalPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...reversalRunBase, scenarioId: 'o10m_reversal_review_chamber' },
      5,
    );
    assert.equal(state.reversalSession?.cursor, 2);
    assert.equal(state.reversalSession?.phaseTag, 'reversal');

    state = applyPostRunPersistedUpdates(
      state,
      { ...reversalRunBase, scenarioId: 'o10m_reversal_score_finale' },
      6,
    );
    assert.equal(state.reversalSession?.active, false);
    const token = unlockTokenForReversalId('o10m_reversal_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('reversal attach clears an active remand session', () => {
    const { session: remand } = createRemandSession({
      remandId: 'o10m_remand_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_remand_order_docket'],
    });
    const { session: reversal } = createReversalSession({
      reversalId: 'o10m_reversal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reversal_motion_docket'],
    });
    let state = attachRemandSessionToState(createEmptyO10mModesPersistedState(), remand!);
    state = attachReversalSessionToState(state, reversal!);
    assert.equal(state.remandSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'reversal_step');
  });

  it('importO10mModesProgressJson round-trips reversal session', () => {
    const { session } = createReversalSession({
      reversalId: 'o10m_reversal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reversal_motion_docket', 'o10m_reversal_review_chamber'],
    });
    const attached = attachReversalSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.reversalSession?.reversalId, 'o10m_reversal_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
