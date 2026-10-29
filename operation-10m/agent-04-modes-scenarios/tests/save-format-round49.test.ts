import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachReceivershipSessionToState,
  attachSequestrationSessionToState,
  buildReceivershipScenarioStartOverrides,
  createReceivershipSession,
  createSequestrationSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  receivershipScoreFromRun,
  unlockTokenForReceivershipId,
  type O10mChallengeModeId,
} from '../src/index.js';

const receivershipRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_receivership_filing_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5700,
  playerNetWorth: 5900,
  regionsControlled: 2,
  maxRegionalStanding: 82,
  rivalNetWorth: 2500,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 49 receivership schema', () => {
  it('migrates schema v48 blob to v49 with receivership defaults', () => {
    const v48 = {
      schemaVersion: 48,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_sequestration_filing_docket',
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
      reversalSession: null,
      annulmentSession: null,
      reinstatementSession: null,
      setAsideSession: null,
      quashSession: null,
      supersedeSession: null,
      certiorariSession: null,
      mandamusSession: null,
      prohibitionSession: null,
      habeasSession: null,
      quowarrantoSession: null,
      injunctionSession: null,
      contemptSession: null,
      sequestrationSession: null,
    };
    const v49 = migrateO10mModesPersistedState(v48);
    assert.equal(v49.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v49.receivershipSession, null);
  });

  it('attaches receivership and planner prefers receivership_step with score hint', () => {
    const { session } = createReceivershipSession({
      receivershipId: 'o10m_receivership_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_receivership_filing_docket',
        'o10m_receivership_review_chamber',
        'o10m_receivership_estate_finale',
      ],
    });
    assert.ok(session);
    const state = attachReceivershipSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'receivership_step');
    assert.equal(plan.scenarioId, 'o10m_receivership_filing_docket');
    assert.equal(plan.receivershipPhase, 'filing');
    assert.equal(plan.receivershipScore, 0);
  });

  it('advances receivership phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createReceivershipSession({
      receivershipId: 'o10m_receivership_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_receivership_filing_docket',
        'o10m_receivership_review_chamber',
        'o10m_receivership_estate_finale',
      ],
    });
    assert.ok(session);
    const score = receivershipScoreFromRun(receivershipRunBase);
    assert.ok(score > 0);

    let state = attachReceivershipSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...receivershipRunBase, scenarioId: 'o10m_receivership_filing_docket' },
      4,
    );
    assert.equal(state.receivershipSession?.cursor, 1);
    assert.equal(state.receivershipSession?.phaseTag, 'review');
    assert.ok((state.receivershipSession?.receivershipScore ?? 0) >= score);

    const overrides = buildReceivershipScenarioStartOverrides(state.receivershipSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveReceivershipPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...receivershipRunBase, scenarioId: 'o10m_receivership_review_chamber' },
      5,
    );
    assert.equal(state.receivershipSession?.cursor, 2);
    assert.equal(state.receivershipSession?.phaseTag, 'receivership');

    state = applyPostRunPersistedUpdates(
      state,
      { ...receivershipRunBase, scenarioId: 'o10m_receivership_estate_finale' },
      6,
    );
    assert.equal(state.receivershipSession?.active, false);
    const token = unlockTokenForReceivershipId('o10m_receivership_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('receivership attach clears an active sequestration session', () => {
    const { session: sequestration } = createSequestrationSession({
      sequestrationId: 'o10m_sequestration_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_sequestration_filing_docket'],
    });
    const { session: receivership } = createReceivershipSession({
      receivershipId: 'o10m_receivership_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_receivership_filing_docket'],
    });
    let state = attachSequestrationSessionToState(createEmptyO10mModesPersistedState(), sequestration!);
    state = attachReceivershipSessionToState(state, receivership!);
    assert.equal(state.sequestrationSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'receivership_step');
  });

  it('importO10mModesProgressJson round-trips receivership session', () => {
    const { session } = createReceivershipSession({
      receivershipId: 'o10m_receivership_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_receivership_filing_docket', 'o10m_receivership_review_chamber'],
    });
    const attached = attachReceivershipSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.receivershipSession?.receivershipId, 'o10m_receivership_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
