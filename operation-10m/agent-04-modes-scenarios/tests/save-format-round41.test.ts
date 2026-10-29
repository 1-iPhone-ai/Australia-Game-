import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachSupersedeSessionToState,
  attachCertiorariSessionToState,
  buildCertiorariScenarioStartOverrides,
  createSupersedeSession,
  createCertiorariSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  certiorariScoreFromRun,
  unlockTokenForCertiorariId,
  type O10mChallengeModeId,
} from '../src/index.js';

const certiorariRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_certiorari_filing_docket',
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

describe('save format round 41 certiorari schema', () => {
  it('migrates schema v40 blob to v41 with certiorari defaults', () => {
    const v40 = {
      schemaVersion: 40,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_supersede_filing_docket',
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
    };
    const v41 = migrateO10mModesPersistedState(v40);
    assert.equal(v41.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v41.certiorariSession, null);
  });

  it('attaches certiorari and planner prefers certiorari_step with score hint', () => {
    const { session } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_certiorari_filing_docket',
        'o10m_certiorari_review_chamber',
        'o10m_certiorari_mandate_finale',
      ],
    });
    assert.ok(session);
    const state = attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'certiorari_step');
    assert.equal(plan.scenarioId, 'o10m_certiorari_filing_docket');
    assert.equal(plan.certiorariPhase, 'filing');
    assert.equal(plan.certiorariScore, 0);
  });

  it('advances certiorari phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_certiorari_filing_docket',
        'o10m_certiorari_review_chamber',
        'o10m_certiorari_mandate_finale',
      ],
    });
    assert.ok(session);
    const score = certiorariScoreFromRun(certiorariRunBase);
    assert.ok(score > 0);

    let state = attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...certiorariRunBase, scenarioId: 'o10m_certiorari_filing_docket' },
      4,
    );
    assert.equal(state.certiorariSession?.cursor, 1);
    assert.equal(state.certiorariSession?.phaseTag, 'review');
    assert.ok((state.certiorariSession?.certiorariScore ?? 0) >= score);

    const overrides = buildCertiorariScenarioStartOverrides(state.certiorariSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveCertiorariPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...certiorariRunBase, scenarioId: 'o10m_certiorari_review_chamber' },
      5,
    );
    assert.equal(state.certiorariSession?.cursor, 2);
    assert.equal(state.certiorariSession?.phaseTag, 'certiorari');

    state = applyPostRunPersistedUpdates(
      state,
      { ...certiorariRunBase, scenarioId: 'o10m_certiorari_mandate_finale' },
      6,
    );
    assert.equal(state.certiorariSession?.active, false);
    const token = unlockTokenForCertiorariId('o10m_certiorari_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('certiorari attach clears an active supersede session', () => {
    const { session: supersede } = createSupersedeSession({
      supersedeId: 'o10m_supersede_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_supersede_filing_docket'],
    });
    const { session: certiorari } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_certiorari_filing_docket'],
    });
    let state = attachSupersedeSessionToState(createEmptyO10mModesPersistedState(), supersede!);
    state = attachCertiorariSessionToState(state, certiorari!);
    assert.equal(state.supersedeSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'certiorari_step');
  });

  it('importO10mModesProgressJson round-trips certiorari session', () => {
    const { session } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_certiorari_filing_docket', 'o10m_certiorari_review_chamber'],
    });
    const attached = attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.certiorariSession?.certiorariId, 'o10m_certiorari_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
