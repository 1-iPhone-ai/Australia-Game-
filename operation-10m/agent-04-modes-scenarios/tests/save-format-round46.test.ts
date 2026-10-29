import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCertiorariSessionToState,
  attachInjunctionSessionToState,
  buildInjunctionScenarioStartOverrides,
  createCertiorariSession,
  createInjunctionSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  injunctionScoreFromRun,
  unlockTokenForInjunctionId,
  type O10mChallengeModeId,
} from '../src/index.js';

const injunctionRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_injunction_filing_docket',
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

describe('save format round 46 injunction schema', () => {
  it('migrates schema v45 blob to v46 with injunction defaults', () => {
    const v45 = {
      schemaVersion: 45,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_quowarranto_filing_docket',
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
      habeasSession: null,
      prohibitionSession: null,
      quowarrantoSession: null,
      mandamusSession: null,
    };
    const v46 = migrateO10mModesPersistedState(v45);
    assert.equal(v46.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v46.injunctionSession, null);
  });

  it('attaches injunction and planner prefers injunction_step with score hint', () => {
    const { session } = createInjunctionSession({
      injunctionId: 'o10m_injunction_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_injunction_filing_docket',
        'o10m_injunction_review_chamber',
        'o10m_injunction_relief_finale',
      ],
    });
    assert.ok(session);
    const state = attachInjunctionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'injunction_step');
    assert.equal(plan.scenarioId, 'o10m_injunction_filing_docket');
    assert.equal(plan.injunctionPhase, 'filing');
    assert.equal(plan.injunctionScore, 0);
  });

  it('advances injunction phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createInjunctionSession({
      injunctionId: 'o10m_injunction_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_injunction_filing_docket',
        'o10m_injunction_review_chamber',
        'o10m_injunction_relief_finale',
      ],
    });
    assert.ok(session);
    const score = injunctionScoreFromRun(injunctionRunBase);
    assert.ok(score > 0);

    let state = attachInjunctionSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...injunctionRunBase, scenarioId: 'o10m_injunction_filing_docket' },
      4,
    );
    assert.equal(state.injunctionSession?.cursor, 1);
    assert.equal(state.injunctionSession?.phaseTag, 'review');
    assert.ok((state.injunctionSession?.injunctionScore ?? 0) >= score);

    const overrides = buildInjunctionScenarioStartOverrides(state.injunctionSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveInjunctionPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...injunctionRunBase, scenarioId: 'o10m_injunction_review_chamber' },
      5,
    );
    assert.equal(state.injunctionSession?.cursor, 2);
    assert.equal(state.injunctionSession?.phaseTag, 'injunction');

    state = applyPostRunPersistedUpdates(
      state,
      { ...injunctionRunBase, scenarioId: 'o10m_injunction_relief_finale' },
      6,
    );
    assert.equal(state.injunctionSession?.active, false);
    const token = unlockTokenForInjunctionId('o10m_injunction_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('injunction attach clears an active certiorari session', () => {
    const { session: certiorari } = createCertiorariSession({
      certiorariId: 'o10m_certiorari_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_certiorari_filing_docket'],
    });
    const { session: injunction } = createInjunctionSession({
      injunctionId: 'o10m_injunction_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_injunction_filing_docket'],
    });
    let state = attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), certiorari!);
    state = attachInjunctionSessionToState(state, injunction!);
    assert.equal(state.certiorariSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'injunction_step');
  });

  it('importO10mModesProgressJson round-trips injunction session', () => {
    const { session } = createInjunctionSession({
      injunctionId: 'o10m_injunction_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_injunction_filing_docket', 'o10m_injunction_review_chamber'],
    });
    const attached = attachInjunctionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.injunctionSession?.injunctionId, 'o10m_injunction_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
