import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCertiorariSessionToState,
  attachProhibitionSessionToState,
  buildProhibitionScenarioStartOverrides,
  createCertiorariSession,
  createProhibitionSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  prohibitionScoreFromRun,
  unlockTokenForProhibitionId,
  type O10mChallengeModeId,
} from '../src/index.js';

const prohibitionRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_prohibition_filing_docket',
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

describe('save format round 43 prohibition schema', () => {
  it('migrates schema v42 blob to v43 with prohibition defaults', () => {
    const v42 = {
      schemaVersion: 42,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_mandamus_filing_docket',
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
    };
    const v43 = migrateO10mModesPersistedState(v42);
    assert.equal(v43.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v43.prohibitionSession, null);
  });

  it('attaches prohibition and planner prefers prohibition_step with score hint', () => {
    const { session } = createProhibitionSession({
      prohibitionId: 'o10m_prohibition_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_prohibition_filing_docket',
        'o10m_prohibition_review_chamber',
        'o10m_prohibition_order_finale',
      ],
    });
    assert.ok(session);
    const state = attachProhibitionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'prohibition_step');
    assert.equal(plan.scenarioId, 'o10m_prohibition_filing_docket');
    assert.equal(plan.prohibitionPhase, 'filing');
    assert.equal(plan.prohibitionScore, 0);
  });

  it('advances prohibition phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createProhibitionSession({
      prohibitionId: 'o10m_prohibition_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_prohibition_filing_docket',
        'o10m_prohibition_review_chamber',
        'o10m_prohibition_order_finale',
      ],
    });
    assert.ok(session);
    const score = prohibitionScoreFromRun(prohibitionRunBase);
    assert.ok(score > 0);

    let state = attachProhibitionSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...prohibitionRunBase, scenarioId: 'o10m_prohibition_filing_docket' },
      4,
    );
    assert.equal(state.prohibitionSession?.cursor, 1);
    assert.equal(state.prohibitionSession?.phaseTag, 'review');
    assert.ok((state.prohibitionSession?.prohibitionScore ?? 0) >= score);

    const overrides = buildProhibitionScenarioStartOverrides(state.prohibitionSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveProhibitionPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...prohibitionRunBase, scenarioId: 'o10m_prohibition_review_chamber' },
      5,
    );
    assert.equal(state.prohibitionSession?.cursor, 2);
    assert.equal(state.prohibitionSession?.phaseTag, 'prohibition');

    state = applyPostRunPersistedUpdates(
      state,
      { ...prohibitionRunBase, scenarioId: 'o10m_prohibition_order_finale' },
      6,
    );
    assert.equal(state.prohibitionSession?.active, false);
    const token = unlockTokenForProhibitionId('o10m_prohibition_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('prohibition attach clears an active certiorari session', () => {
    const { session: certiorari } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_certiorari_filing_docket'],
    });
    const { session: prohibition } = createProhibitionSession({
      prohibitionId: 'o10m_prohibition_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_prohibition_filing_docket'],
    });
    let state = attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), certiorari!);
    state = attachProhibitionSessionToState(state, prohibition!);
    assert.equal(state.certiorariSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'prohibition_step');
  });

  it('importO10mModesProgressJson round-trips prohibition session', () => {
    const { session } = createProhibitionSession({
      prohibitionId: 'o10m_prohibition_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_prohibition_filing_docket', 'o10m_prohibition_review_chamber'],
    });
    const attached = attachProhibitionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.prohibitionSession?.prohibitionId, 'o10m_prohibition_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
