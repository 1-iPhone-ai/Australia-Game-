import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachDissolutionSessionToState,
  attachLiquidationSessionToState,
  attachReceivershipSessionToState,
  buildDissolutionScenarioStartOverrides,
  createDissolutionSession,
  createLiquidationSession,
  createReceivershipSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  dissolutionScoreFromRun,
  unlockTokenForDissolutionId,
  type O10mChallengeModeId,
} from '../src/index.js';

const dissolutionRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_dissolution_filing_docket',
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

describe('save format round 51 dissolution schema', () => {
  it('migrates schema v50 blob to v51 with dissolution defaults', () => {
    const v50 = {
      schemaVersion: 50,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_liquidation_filing_docket',
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
      receivershipSession: null,
      liquidationSession: null,
    };
    const v51 = migrateO10mModesPersistedState(v50);
    assert.equal(v51.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v51.dissolutionSession, null);
  });

  it('attaches dissolution and planner prefers dissolution_step with score hint', () => {
    const { session } = createDissolutionSession({
      dissolutionId: 'o10m_dissolution_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_dissolution_filing_docket',
        'o10m_dissolution_review_chamber',
        'o10m_dissolution_estate_finale',
      ],
    });
    assert.ok(session);
    const state = attachDissolutionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'dissolution_step');
    assert.equal(plan.scenarioId, 'o10m_dissolution_filing_docket');
    assert.equal(plan.dissolutionPhase, 'filing');
    assert.equal(plan.dissolutionScore, 0);
  });

  it('advances dissolution phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createDissolutionSession({
      dissolutionId: 'o10m_dissolution_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_dissolution_filing_docket',
        'o10m_dissolution_review_chamber',
        'o10m_dissolution_estate_finale',
      ],
    });
    assert.ok(session);
    const score = dissolutionScoreFromRun(dissolutionRunBase);
    assert.ok(score > 0);

    let state = attachDissolutionSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...dissolutionRunBase, scenarioId: 'o10m_dissolution_filing_docket' },
      4,
    );
    assert.equal(state.dissolutionSession?.cursor, 1);
    assert.equal(state.dissolutionSession?.phaseTag, 'review');
    assert.ok((state.dissolutionSession?.dissolutionScore ?? 0) >= score);

    const overrides = buildDissolutionScenarioStartOverrides(state.dissolutionSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveDissolutionPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...dissolutionRunBase, scenarioId: 'o10m_dissolution_review_chamber' },
      5,
    );
    assert.equal(state.dissolutionSession?.cursor, 2);
    assert.equal(state.dissolutionSession?.phaseTag, 'dissolution');

    state = applyPostRunPersistedUpdates(
      state,
      { ...dissolutionRunBase, scenarioId: 'o10m_dissolution_estate_finale' },
      6,
    );
    assert.equal(state.dissolutionSession?.active, false);
    const token = unlockTokenForDissolutionId('o10m_dissolution_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('dissolution attach clears an active liquidation session', () => {
    const { session: liquidation } = createLiquidationSession({
      liquidationId: 'o10m_liquidation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_liquidation_filing_docket'],
    });
    const { session: dissolution } = createDissolutionSession({
      dissolutionId: 'o10m_dissolution_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_dissolution_filing_docket'],
    });
    let state = attachLiquidationSessionToState(createEmptyO10mModesPersistedState(), liquidation!);
    state = attachDissolutionSessionToState(state, dissolution!);
    assert.equal(state.liquidationSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'dissolution_step');
  });

  it('importO10mModesProgressJson round-trips dissolution session', () => {
    const { session } = createDissolutionSession({
      dissolutionId: 'o10m_dissolution_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_dissolution_filing_docket', 'o10m_dissolution_review_chamber'],
    });
    const attached = attachDissolutionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.dissolutionSession?.dissolutionId, 'o10m_dissolution_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
