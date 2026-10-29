import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachAnnulmentSessionToState,
  attachReinstatementSessionToState,
  buildReinstatementScenarioStartOverrides,
  createAnnulmentSession,
  createReinstatementSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  reinstatementScoreFromRun,
  unlockTokenForReinstatementId,
  type O10mChallengeModeId,
} from '../src/index.js';

const reinstatementRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_reinstatement_filing_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5300,
  playerNetWorth: 5500,
  regionsControlled: 2,
  maxRegionalStanding: 74,
  rivalNetWorth: 2500,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 37 reinstatement schema', () => {
  it('migrates schema v36 blob to v37 with reinstatement defaults', () => {
    const v36 = {
      schemaVersion: 36,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_annulment_filing_docket',
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
    };
    const v37 = migrateO10mModesPersistedState(v36);
    assert.equal(v37.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v37.reinstatementSession, null);
  });

  it('attaches reinstatement and planner prefers reinstatement_step with score hint', () => {
    const { session } = createReinstatementSession({
      reinstatementId: 'o10m_reinstatement_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_reinstatement_filing_docket',
        'o10m_reinstatement_review_chamber',
        'o10m_reinstatement_restoration_finale',
      ],
    });
    assert.ok(session);
    const state = attachReinstatementSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'reinstatement_step');
    assert.equal(plan.scenarioId, 'o10m_reinstatement_filing_docket');
    assert.equal(plan.reinstatementPhase, 'filing');
    assert.equal(plan.reinstatementScore, 0);
  });

  it('advances reinstatement phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createReinstatementSession({
      reinstatementId: 'o10m_reinstatement_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_reinstatement_filing_docket',
        'o10m_reinstatement_review_chamber',
        'o10m_reinstatement_restoration_finale',
      ],
    });
    assert.ok(session);
    const score = reinstatementScoreFromRun(reinstatementRunBase);
    assert.ok(score > 0);

    let state = attachReinstatementSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...reinstatementRunBase, scenarioId: 'o10m_reinstatement_filing_docket' },
      4,
    );
    assert.equal(state.reinstatementSession?.cursor, 1);
    assert.equal(state.reinstatementSession?.phaseTag, 'review');
    assert.ok((state.reinstatementSession?.reinstatementScore ?? 0) >= score);

    const overrides = buildReinstatementScenarioStartOverrides(state.reinstatementSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveReinstatementPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...reinstatementRunBase, scenarioId: 'o10m_reinstatement_review_chamber' },
      5,
    );
    assert.equal(state.reinstatementSession?.cursor, 2);
    assert.equal(state.reinstatementSession?.phaseTag, 'reinstatement');

    state = applyPostRunPersistedUpdates(
      state,
      { ...reinstatementRunBase, scenarioId: 'o10m_reinstatement_restoration_finale' },
      6,
    );
    assert.equal(state.reinstatementSession?.active, false);
    const token = unlockTokenForReinstatementId('o10m_reinstatement_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('reinstatement attach clears an active annulment session', () => {
    const { session: annulment } = createAnnulmentSession({
      annulmentId: 'o10m_annulment_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_annulment_filing_docket'],
    });
    const { session: reinstatement } = createReinstatementSession({
      reinstatementId: 'o10m_reinstatement_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reinstatement_filing_docket'],
    });
    let state = attachAnnulmentSessionToState(createEmptyO10mModesPersistedState(), annulment!);
    state = attachReinstatementSessionToState(state, reinstatement!);
    assert.equal(state.annulmentSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'reinstatement_step');
  });

  it('importO10mModesProgressJson round-trips reinstatement session', () => {
    const { session } = createReinstatementSession({
      reinstatementId: 'o10m_reinstatement_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reinstatement_filing_docket', 'o10m_reinstatement_review_chamber'],
    });
    const attached = attachReinstatementSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.reinstatementSession?.reinstatementId, 'o10m_reinstatement_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
