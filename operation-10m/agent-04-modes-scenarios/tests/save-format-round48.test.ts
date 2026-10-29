import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachContemptSessionToState,
  attachSequestrationSessionToState,
  buildSequestrationScenarioStartOverrides,
  createContemptSession,
  createSequestrationSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  sequestrationScoreFromRun,
  unlockTokenForSequestrationId,
  type O10mChallengeModeId,
} from '../src/index.js';

const sequestrationRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_sequestration_filing_docket',
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

describe('save format round 48 sequestration schema', () => {
  it('migrates schema v47 blob to v48 with sequestration defaults', () => {
    const v47 = {
      schemaVersion: 47,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_contempt_filing_docket',
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
    };
    const v48 = migrateO10mModesPersistedState(v47);
    assert.equal(v48.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v48.sequestrationSession, null);
  });

  it('attaches sequestration and planner prefers sequestration_step with score hint', () => {
    const { session } = createSequestrationSession({
      sequestrationId: 'o10m_sequestration_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_sequestration_filing_docket',
        'o10m_sequestration_review_chamber',
        'o10m_sequestration_asset_finale',
      ],
    });
    assert.ok(session);
    const state = attachSequestrationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'sequestration_step');
    assert.equal(plan.scenarioId, 'o10m_sequestration_filing_docket');
    assert.equal(plan.sequestrationPhase, 'filing');
    assert.equal(plan.sequestrationScore, 0);
  });

  it('advances sequestration phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createSequestrationSession({
      sequestrationId: 'o10m_sequestration_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_sequestration_filing_docket',
        'o10m_sequestration_review_chamber',
        'o10m_sequestration_asset_finale',
      ],
    });
    assert.ok(session);
    const score = sequestrationScoreFromRun(sequestrationRunBase);
    assert.ok(score > 0);

    let state = attachSequestrationSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...sequestrationRunBase, scenarioId: 'o10m_sequestration_filing_docket' },
      4,
    );
    assert.equal(state.sequestrationSession?.cursor, 1);
    assert.equal(state.sequestrationSession?.phaseTag, 'review');
    assert.ok((state.sequestrationSession?.sequestrationScore ?? 0) >= score);

    const overrides = buildSequestrationScenarioStartOverrides(state.sequestrationSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveSequestrationPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...sequestrationRunBase, scenarioId: 'o10m_sequestration_review_chamber' },
      5,
    );
    assert.equal(state.sequestrationSession?.cursor, 2);
    assert.equal(state.sequestrationSession?.phaseTag, 'sequestration');

    state = applyPostRunPersistedUpdates(
      state,
      { ...sequestrationRunBase, scenarioId: 'o10m_sequestration_asset_finale' },
      6,
    );
    assert.equal(state.sequestrationSession?.active, false);
    const token = unlockTokenForSequestrationId('o10m_sequestration_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('sequestration attach clears an active contempt session', () => {
    const { session: contempt } = createContemptSession({
      contemptId: 'o10m_contempt_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_contempt_filing_docket'],
    });
    const { session: sequestration } = createSequestrationSession({
      sequestrationId: 'o10m_sequestration_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_sequestration_filing_docket'],
    });
    let state = attachContemptSessionToState(createEmptyO10mModesPersistedState(), contempt!);
    state = attachSequestrationSessionToState(state, sequestration!);
    assert.equal(state.contemptSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'sequestration_step');
  });

  it('importO10mModesProgressJson round-trips sequestration session', () => {
    const { session } = createSequestrationSession({
      sequestrationId: 'o10m_sequestration_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_sequestration_filing_docket', 'o10m_sequestration_review_chamber'],
    });
    const attached = attachSequestrationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.sequestrationSession?.sequestrationId, 'o10m_sequestration_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
