import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachDissolutionSessionToState,
  attachLiquidationDepthSessionToState,
  attachLiquidationSessionToState,
  buildLiquidationDepthScenarioStartOverrides,
  createDissolutionSession,
  createLiquidationDepthSession,
  createLiquidationSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  liquidationDepthScoreFromRun,
  unlockTokenForLiquidationDepthId,
  type O10mChallengeModeId,
} from '../src/index.js';

const liquidationDepthRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_liquidation_depth_filing_docket',
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

describe('save format round 55 liquidation depth schema', () => {
  it('migrates schema v54 blob to v55 with liquidation depth defaults', () => {
    const v54 = {
      schemaVersion: 54,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_dissolution_filing_docket',
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
      dissolutionSession: null,
      liquidationDepthSession: null,
    };
    const v55 = migrateO10mModesPersistedState(v54);
    assert.equal(v55.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v55.liquidationDepthSession, null);
  });

  it('attaches liquidation depth and planner prefers liquidation_depth_step with score hint', () => {
    const { session } = createLiquidationDepthSession({
      liquidationDepthId: 'o10m_liquidation_depth_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_liquidation_depth_filing_docket',
        'o10m_liquidation_depth_review_chamber',
        'o10m_liquidation_depth_estate_finale',
      ],
    });
    assert.ok(session);
    const state = attachLiquidationDepthSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'liquidation_depth_step');
    assert.equal(plan.scenarioId, 'o10m_liquidation_depth_filing_docket');
    assert.equal(plan.liquidationDepthPhase, 'filing');
    assert.equal(plan.liquidationDepthScore, 0);
  });

  it('advances liquidation depth phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createLiquidationDepthSession({
      liquidationDepthId: 'o10m_liquidation_depth_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_liquidation_depth_filing_docket',
        'o10m_liquidation_depth_review_chamber',
        'o10m_liquidation_depth_estate_finale',
      ],
    });
    assert.ok(session);
    const score = liquidationDepthScoreFromRun(liquidationDepthRunBase);
    assert.ok(score > 0);

    let state = attachLiquidationDepthSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...liquidationDepthRunBase, scenarioId: 'o10m_liquidation_depth_filing_docket' },
      4,
    );
    assert.equal(state.liquidationDepthSession?.cursor, 1);
    assert.equal(state.liquidationDepthSession?.phaseTag, 'review');
    assert.ok((state.liquidationDepthSession?.liquidationDepthScore ?? 0) >= score);

    const overrides = buildLiquidationDepthScenarioStartOverrides(state.liquidationDepthSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveLiquidationDepthPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...liquidationDepthRunBase, scenarioId: 'o10m_liquidation_depth_review_chamber' },
      5,
    );
    assert.equal(state.liquidationDepthSession?.cursor, 2);
    assert.equal(state.liquidationDepthSession?.phaseTag, 'depth');

    state = applyPostRunPersistedUpdates(
      state,
      { ...liquidationDepthRunBase, scenarioId: 'o10m_liquidation_depth_estate_finale' },
      6,
    );
    assert.equal(state.liquidationDepthSession?.active, false);
    const token = unlockTokenForLiquidationDepthId('o10m_liquidation_depth_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('liquidation depth attach clears an active dissolution session', () => {
    const { session: dissolution } = createDissolutionSession({
      dissolutionId: 'o10m_dissolution_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_dissolution_filing_docket'],
    });
    const { session: depth } = createLiquidationDepthSession({
      liquidationDepthId: 'o10m_liquidation_depth_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_liquidation_depth_filing_docket'],
    });
    let state = attachDissolutionSessionToState(createEmptyO10mModesPersistedState(), dissolution!);
    state = attachLiquidationDepthSessionToState(state, depth!);
    assert.equal(state.dissolutionSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'liquidation_depth_step');
  });

  it('importO10mModesProgressJson round-trips liquidation depth session', () => {
    const { session } = createLiquidationDepthSession({
      liquidationDepthId: 'o10m_liquidation_depth_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_liquidation_depth_filing_docket', 'o10m_liquidation_depth_review_chamber'],
    });
    const attached = attachLiquidationDepthSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.liquidationDepthSession?.liquidationDepthId, 'o10m_liquidation_depth_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
