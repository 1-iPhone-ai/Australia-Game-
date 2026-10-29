import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCertiorariSessionToState,
  attachMandamusSessionToState,
  buildMandamusScenarioStartOverrides,
  createCertiorariSession,
  createMandamusSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  mandamusScoreFromRun,
  unlockTokenForMandamusId,
  type O10mChallengeModeId,
} from '../src/index.js';

const mandamusRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_mandamus_filing_docket',
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

describe('save format round 42 mandamus schema', () => {
  it('migrates schema v41 blob to v42 with mandamus defaults', () => {
    const v41 = {
      schemaVersion: 41,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_certiorari_filing_docket',
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
    };
    const v42 = migrateO10mModesPersistedState(v41);
    assert.equal(v42.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v42.mandamusSession, null);
  });

  it('attaches mandamus and planner prefers mandamus_step with score hint', () => {
    const { session } = createMandamusSession({
      mandamusId: 'o10m_mandamus_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_mandamus_filing_docket',
        'o10m_mandamus_review_chamber',
        'o10m_mandamus_writ_finale',
      ],
    });
    assert.ok(session);
    const state = attachMandamusSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'mandamus_step');
    assert.equal(plan.scenarioId, 'o10m_mandamus_filing_docket');
    assert.equal(plan.mandamusPhase, 'filing');
    assert.equal(plan.mandamusScore, 0);
  });

  it('advances mandamus phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createMandamusSession({
      mandamusId: 'o10m_mandamus_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_mandamus_filing_docket',
        'o10m_mandamus_review_chamber',
        'o10m_mandamus_writ_finale',
      ],
    });
    assert.ok(session);
    const score = mandamusScoreFromRun(mandamusRunBase);
    assert.ok(score > 0);

    let state = attachMandamusSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...mandamusRunBase, scenarioId: 'o10m_mandamus_filing_docket' },
      4,
    );
    assert.equal(state.mandamusSession?.cursor, 1);
    assert.equal(state.mandamusSession?.phaseTag, 'review');
    assert.ok((state.mandamusSession?.mandamusScore ?? 0) >= score);

    const overrides = buildMandamusScenarioStartOverrides(state.mandamusSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveMandamusPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...mandamusRunBase, scenarioId: 'o10m_mandamus_review_chamber' },
      5,
    );
    assert.equal(state.mandamusSession?.cursor, 2);
    assert.equal(state.mandamusSession?.phaseTag, 'mandamus');

    state = applyPostRunPersistedUpdates(
      state,
      { ...mandamusRunBase, scenarioId: 'o10m_mandamus_writ_finale' },
      6,
    );
    assert.equal(state.mandamusSession?.active, false);
    const token = unlockTokenForMandamusId('o10m_mandamus_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('mandamus attach clears an active certiorari session', () => {
    const { session: certiorari } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_certiorari_filing_docket'],
    });
    const { session: mandamus } = createMandamusSession({
      mandamusId: 'o10m_mandamus_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_mandamus_filing_docket'],
    });
    let state = attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), certiorari!);
    state = attachMandamusSessionToState(state, mandamus!);
    assert.equal(state.certiorariSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'mandamus_step');
  });

  it('importO10mModesProgressJson round-trips mandamus session', () => {
    const { session } = createMandamusSession({
      mandamusId: 'o10m_mandamus_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_mandamus_filing_docket', 'o10m_mandamus_review_chamber'],
    });
    const attached = attachMandamusSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.mandamusSession?.mandamusId, 'o10m_mandamus_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
