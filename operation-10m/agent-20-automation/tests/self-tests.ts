import assert from 'node:assert/strict';
import {
  evaluateConditionalAutomationAction,
  evaluateHumanAutomationExecutionEligibility,
  checkHumanAutomationSafetyLimits,
  appendAutomationRunHistory,
  buildAutomationDailyDigest,
  formatDailyDigestMarkdown,
  evaluateSafeTimeAdvance,
  canAdvanceDay,
  canEndTurn,
  runO10Agent20ModuleSelfTests,
  createDefaultAutonomousIdleNationalPersisted,
  buildNationalStewardEvaluationContext,
  evaluateNationalStewardSafeguards,
  runO10Agent20IdleDepthSelfTests,
  classifyIdleAutomationBand,
  selectHumanAutomationCandidate,
} from '../src/index.js';
import type { SafeTimeAdvanceContext } from '../src/types.js';

function testConditionalActions() {
  const ctx = {
    actor: { money: 500, inventory: [], currentRegion: 'NSW', actionPoints: 2 },
    currentDay: 3,
    currentTurn: 10,
    isNewDayForActor: false,
    extendedTriggersEnabled: true,
    settingsFlags: { teamCashVaultEnabled: true },
  };
  const lowCash = evaluateConditionalAutomationAction({
    trigger: { type: 'cash_below_threshold', thresholdAmount: 1000 },
    conditions: {
      mode: 'all_must_pass',
      items: [
        { id: 'ap', enabled: true, strictness: 'hard', kind: 'ap_at_least', value: 1 },
        {
          id: 'vault',
          enabled: true,
          strictness: 'soft',
          kind: 'flag_enabled',
          value: 'teamCashVaultEnabled',
        },
      ],
    },
    ctx,
  });
  assert.equal(lowCash.wouldRun, true, 'conditional should pass');

  const failRegion = evaluateConditionalAutomationAction({
    trigger: { type: 'turn_start' },
    conditions: {
      mode: 'all_must_pass',
      items: [{ id: 'r', enabled: true, kind: 'region_equals', value: 'VIC' }],
    },
    ctx,
  });
  assert.equal(failRegion.wouldRun, false, 'region condition should fail');
}

function testLimits() {
  const limits = { maxRunsPerDay: 1, maxRunsTotal: null, cooldownTurns: 2 };
  const safety = { maxCostPerRun: 100, minCashRemainingAfterRun: 200, stopIfNoStateChangeCount: 3 };
  const stats = {
    totalRuns: 0,
    totalSuccesses: 0,
    totalSkipped: 0,
    totalFailed: 0,
    lastRunDay: 1,
    lastRunTurn: 8,
    runsToday: 1,
    runsTodayDay: 2,
    consecutiveNoChangeCount: 0,
    lastResultSummary: '',
  };
  const elig = evaluateHumanAutomationExecutionEligibility(
    true,
    false,
    0,
    999,
    limits,
    safety,
    stats,
    2,
    9
  );
  assert.equal(elig.eligible, false, 'max runs per day');
  const safetyCheck = checkHumanAutomationSafetyLimits(safety, 250, 100);
  assert.equal(safetyCheck.ok, false, 'min cash reserve');

  const def = createDefaultAutonomousIdleNationalPersisted();
  const ctx = buildNationalStewardEvaluationContext({}, { playerControlMode: 'manual' }, def, 'fiscal', -5000);
  const sg = evaluateNationalStewardSafeguards(ctx);
  assert.equal(sg.blocked, true, 'large steward spend blocked');
}

function testLogs() {
  const entry = {
    id: 'r1',
    timestamp: 1,
    day: 2,
    turn: 3,
    ruleId: 'ha1',
    ruleName: 'Sell',
    triggerType: 'cash_below_threshold' as const,
    actionType: 'sell',
    status: 'success' as const,
    resultMessage: 'ok',
  };
  const hist = appendAutomationRunHistory([], entry);
  assert.equal(hist.length, 1);
  const digest = buildAutomationDailyDigest(
    [
      entry,
      { ...entry, id: 'r2', status: 'failed', resultMessage: 'no' },
    ],
    2
  );
  assert.equal(digest[0].successCount, 1);
  assert.equal(digest[0].failedCount, 1);
  const md = formatDailyDigestMarkdown(2, digest);
  assert.match(md, /Automation digest/);
}

function testSafeTimeAdvance() {
  const base: SafeTimeAdvanceContext = {
    gameMode: 'game',
    matchEnded: false,
    currentActorId: 'player',
    humanAutomationEnabled: true,
    humanAutomationExecuting: false,
    pendingHumanAutomationApprovals: 0,
    pendingGenericApprovals: 0,
    copilotTakeoverActive: false,
    copilotStepInFlight: false,
    playerInTransit: false,
    nationalStewardPlanBlocked: false,
    nationalStewardPaused: false,
    autoModeReplayRecording: false,
    dialogBlockingTime: false,
  };
  assert.equal(canEndTurn(base).allowed, true);
  assert.equal(
    canAdvanceDay({ ...base, pendingGenericApprovals: 2 }).allowed,
    false,
    'block day with approvals'
  );
  assert.equal(
    evaluateSafeTimeAdvance({ ...base, humanAutomationExecuting: true }, 'end_turn').allowed,
    false
  );
  assert.equal(
    evaluateSafeTimeAdvance({ ...base, playerInTransit: true }, 'advance_day').allowed,
    false
  );
}

function testIdleDepth() {
  const depth = runO10Agent20IdleDepthSelfTests();
  const failed = depth.filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
  assert.equal(classifyIdleAutomationBand({ idleMs: 200_000, consecutiveIdleTurns: 4, stewardEnabled: true, playerPaused: false }), 'steward_tick');
  const sel = selectHumanAutomationCandidate(
    [
      {
        id: 'x',
        name: 'X',
        enabled: true,
        authorityDisabled: false,
        priority: 1,
        activeFromDay: 0,
        activeUntilDay: 999,
        trigger: { type: 'turn_start' },
        conditions: null,
        limits: { maxRunsPerDay: 1, maxRunsTotal: null, cooldownTurns: 0 },
        safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 3 },
        stats: {
          totalRuns: 0,
          totalSuccesses: 0,
          totalSkipped: 0,
          totalFailed: 0,
          lastRunDay: null,
          lastRunTurn: null,
          runsToday: 0,
          runsTodayDay: -1,
          consecutiveNoChangeCount: 0,
          lastResultSummary: '',
        },
        actionType: 'wait',
        resolvedCost: 0,
        spendableCash: 500,
      },
    ],
    {
      actor: { money: 500, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 1,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      settingsFlags: {},
    }
  );
  assert.equal(sel.selected?.id, 'x');
}

function main() {
  testConditionalActions();
  testLimits();
  testLogs();
  testSafeTimeAdvance();
  testIdleDepth();
  const suite = runO10Agent20ModuleSelfTests();
  if (!suite.allPassed) {
    console.error('Module self-tests failed:', suite.results.filter(r => !r.passed));
    process.exit(1);
  }
  console.log(`Agent 20 O10 tests OK (${suite.passed}/${suite.total} module cases + unit blocks)`);
}

main();
