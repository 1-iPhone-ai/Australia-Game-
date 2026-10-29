import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCertiorariSessionToState,
  attachContemptSessionToState,
  buildContemptScenarioStartOverrides,
  createCertiorariSession,
  createContemptSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  contemptScoreFromRun,
  unlockTokenForContemptId,
  type O10mChallengeModeId,
} from '../src/index.js';

const contemptRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_contempt_filing_docket',
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

describe('save format round 47 contempt schema', () => {
  it('migrates schema v46 blob to v47 with contempt defaults', () => {
    const v46 = {
      schemaVersion: 46,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_injunction_filing_docket',
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
    };
    const v47 = migrateO10mModesPersistedState(v46);
    assert.equal(v47.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v47.contemptSession, null);
  });

  it('attaches contempt and planner prefers contempt_step with score hint', () => {
    const { session } = createContemptSession({
      contemptId: 'o10m_contempt_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_contempt_filing_docket',
        'o10m_contempt_review_chamber',
        'o10m_contempt_sanction_finale',
      ],
    });
    assert.ok(session);
    const state = attachContemptSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'contempt_step');
    assert.equal(plan.scenarioId, 'o10m_contempt_filing_docket');
    assert.equal(plan.contemptPhase, 'filing');
    assert.equal(plan.contemptScore, 0);
  });

  it('advances contempt phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createContemptSession({
      contemptId: 'o10m_contempt_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_contempt_filing_docket',
        'o10m_contempt_review_chamber',
        'o10m_contempt_sanction_finale',
      ],
    });
    assert.ok(session);
    const score = contemptScoreFromRun(contemptRunBase);
    assert.ok(score > 0);

    let state = attachContemptSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...contemptRunBase, scenarioId: 'o10m_contempt_filing_docket' },
      4,
    );
    assert.equal(state.contemptSession?.cursor, 1);
    assert.equal(state.contemptSession?.phaseTag, 'review');
    assert.ok((state.contemptSession?.contemptScore ?? 0) >= score);

    const overrides = buildContemptScenarioStartOverrides(state.contemptSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveContemptPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...contemptRunBase, scenarioId: 'o10m_contempt_review_chamber' },
      5,
    );
    assert.equal(state.contemptSession?.cursor, 2);
    assert.equal(state.contemptSession?.phaseTag, 'contempt');

    state = applyPostRunPersistedUpdates(
      state,
      { ...contemptRunBase, scenarioId: 'o10m_contempt_sanction_finale' },
      6,
    );
    assert.equal(state.contemptSession?.active, false);
    const token = unlockTokenForContemptId('o10m_contempt_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('contempt attach clears an active certiorari session', () => {
    const { session: certiorari } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_certiorari_filing_docket'],
    });
    const { session: contempt } = createContemptSession({
      contemptId: 'o10m_contempt_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_contempt_filing_docket'],
    });
    let state = attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), certiorari!);
    state = attachContemptSessionToState(state, contempt!);
    assert.equal(state.certiorariSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'contempt_step');
  });

  it('importO10mModesProgressJson round-trips contempt session', () => {
    const { session } = createContemptSession({
      contemptId: 'o10m_contempt_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_contempt_filing_docket', 'o10m_contempt_review_chamber'],
    });
    const attached = attachContemptSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.contemptSession?.contemptId, 'o10m_contempt_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
