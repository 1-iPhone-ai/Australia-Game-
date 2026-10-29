import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachExonerationSessionToState,
  attachExpungementSessionToState,
  buildExpungementScenarioStartOverrides,
  createExonerationSession,
  createExpungementSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  expungementSealScoreFromRun,
  unlockTokenForExpungementId,
  type O10mChallengeModeId,
} from '../src/index.js';

const expungementRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_expungement_filing_docket',
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

describe('save format round 32 expungement schema', () => {
  it('migrates schema v31 blob to v32 with expungement defaults', () => {
    const v31 = {
      schemaVersion: 31,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_exoneration_claim_docket',
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
    };
    const v32 = migrateO10mModesPersistedState(v31);
    assert.equal(v32.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v32.expungementSession, null);
  });

  it('attaches expungement and planner prefers expungement_step with seal hint', () => {
    const { session } = createExpungementSession({
      expungementId: 'o10m_expungement_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_expungement_filing_docket',
        'o10m_expungement_review_chamber',
        'o10m_expungement_seal_finale',
      ],
    });
    assert.ok(session);
    const state = attachExpungementSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'expungement_step');
    assert.equal(plan.scenarioId, 'o10m_expungement_filing_docket');
    assert.equal(plan.expungementPhase, 'filing');
    assert.equal(plan.expungementSeal, 0);
  });

  it('advances expungement phases, accrues seal score, and grants unlock token on completion', () => {
    const { session } = createExpungementSession({
      expungementId: 'o10m_expungement_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_expungement_filing_docket',
        'o10m_expungement_review_chamber',
        'o10m_expungement_seal_finale',
      ],
    });
    assert.ok(session);
    const seal = expungementSealScoreFromRun(expungementRunBase);
    assert.ok(seal > 0);

    let state = attachExpungementSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...expungementRunBase, scenarioId: 'o10m_expungement_filing_docket' },
      4,
    );
    assert.equal(state.expungementSession?.cursor, 1);
    assert.equal(state.expungementSession?.phaseTag, 'review');
    assert.ok((state.expungementSession?.sealScore ?? 0) >= seal);

    const overrides = buildExpungementScenarioStartOverrides(state.expungementSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveExpungementPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...expungementRunBase, scenarioId: 'o10m_expungement_review_chamber' },
      5,
    );
    assert.equal(state.expungementSession?.cursor, 2);
    assert.equal(state.expungementSession?.phaseTag, 'expungement');

    state = applyPostRunPersistedUpdates(
      state,
      { ...expungementRunBase, scenarioId: 'o10m_expungement_seal_finale' },
      6,
    );
    assert.equal(state.expungementSession?.active, false);
    const token = unlockTokenForExpungementId('o10m_expungement_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('expungement attach clears an active exoneration session', () => {
    const { session: exoneration } = createExonerationSession({
      exonerationId: 'o10m_exoneration_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_exoneration_claim_docket'],
    });
    const { session: expungement } = createExpungementSession({
      expungementId: 'o10m_expungement_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_expungement_filing_docket'],
    });
    let state = attachExonerationSessionToState(createEmptyO10mModesPersistedState(), exoneration!);
    state = attachExpungementSessionToState(state, expungement!);
    assert.equal(state.exonerationSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'expungement_step');
  });

  it('importO10mModesProgressJson round-trips expungement session', () => {
    const { session } = createExpungementSession({
      expungementId: 'o10m_expungement_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_expungement_filing_docket', 'o10m_expungement_review_chamber'],
    });
    const attached = attachExpungementSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.expungementSession?.expungementId, 'o10m_expungement_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
