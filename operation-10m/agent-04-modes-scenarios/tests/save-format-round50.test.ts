import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachReceivershipSessionToState,
  attachLiquidationSessionToState,
  attachSequestrationSessionToState,
  buildLiquidationScenarioStartOverrides,
  createLiquidationSession,
  createReceivershipSession,
  createSequestrationSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  liquidationScoreFromRun,
  unlockTokenForLiquidationId,
  type O10mChallengeModeId,
} from '../src/index.js';

const liquidationRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_liquidation_filing_docket',
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

describe('save format round 50 liquidation schema', () => {
  it('migrates schema v49 blob to v50 with liquidation defaults', () => {
    const v49 = {
      schemaVersion: 49,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_receivership_filing_docket',
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
    };
    const v50 = migrateO10mModesPersistedState(v49);
    assert.equal(v50.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v50.liquidationSession, null);
  });

  it('attaches liquidation and planner prefers liquidation_step with score hint', () => {
    const { session } = createLiquidationSession({
      liquidationId: 'o10m_liquidation_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_liquidation_filing_docket',
        'o10m_liquidation_review_chamber',
        'o10m_liquidation_estate_finale',
      ],
    });
    assert.ok(session);
    const state = attachLiquidationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'liquidation_step');
    assert.equal(plan.scenarioId, 'o10m_liquidation_filing_docket');
    assert.equal(plan.liquidationPhase, 'filing');
    assert.equal(plan.liquidationScore, 0);
  });

  it('advances liquidation phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createLiquidationSession({
      liquidationId: 'o10m_liquidation_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_liquidation_filing_docket',
        'o10m_liquidation_review_chamber',
        'o10m_liquidation_estate_finale',
      ],
    });
    assert.ok(session);
    const score = liquidationScoreFromRun(liquidationRunBase);
    assert.ok(score > 0);

    let state = attachLiquidationSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...liquidationRunBase, scenarioId: 'o10m_liquidation_filing_docket' },
      4,
    );
    assert.equal(state.liquidationSession?.cursor, 1);
    assert.equal(state.liquidationSession?.phaseTag, 'review');
    assert.ok((state.liquidationSession?.liquidationScore ?? 0) >= score);

    const overrides = buildLiquidationScenarioStartOverrides(state.liquidationSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveLiquidationPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...liquidationRunBase, scenarioId: 'o10m_liquidation_review_chamber' },
      5,
    );
    assert.equal(state.liquidationSession?.cursor, 2);
    assert.equal(state.liquidationSession?.phaseTag, 'liquidation');

    state = applyPostRunPersistedUpdates(
      state,
      { ...liquidationRunBase, scenarioId: 'o10m_liquidation_estate_finale' },
      6,
    );
    assert.equal(state.liquidationSession?.active, false);
    const token = unlockTokenForLiquidationId('o10m_liquidation_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('liquidation attach clears an active receivership session', () => {
    const { session: receivership } = createReceivershipSession({
      receivershipId: 'o10m_receivership_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_receivership_filing_docket'],
    });
    const { session: liquidation } = createLiquidationSession({
      liquidationId: 'o10m_liquidation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_liquidation_filing_docket'],
    });
    let state = attachReceivershipSessionToState(createEmptyO10mModesPersistedState(), receivership!);
    state = attachLiquidationSessionToState(state, liquidation!);
    assert.equal(state.receivershipSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'liquidation_step');
  });

  it('importO10mModesProgressJson round-trips liquidation session', () => {
    const { session } = createLiquidationSession({
      liquidationId: 'o10m_liquidation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_liquidation_filing_docket', 'o10m_liquidation_review_chamber'],
    });
    const attached = attachLiquidationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.liquidationSession?.liquidationId, 'o10m_liquidation_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
