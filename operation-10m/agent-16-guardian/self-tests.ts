import { ADVISORY_OPS_POLICY } from './policy.js';
import { assertAdvisoryRecommendationOnly, verifyAdvisoryGrounding } from './grounding.js';
import { ADVISORY_MONITOR_RULES } from './monitor-rules.js';
import {
  advisoryRecommendationsFromCoPilotEvaluation,
  createAdvisoryOpsFixtureSnapshot,
  evaluateAdvisoryScenario,
  materializeAdvisoryAlerts,
  runGuardianCoPilotAdvisoryCycle,
} from './advisory-cycle.js';
import {
  evaluateSuggestedActionGate,
  markSuggestedAction,
  partitionSuggestionFromExecution,
  stripExecutionFromCoPilotCandidate,
} from './suggestion-gate.js';
import { ADVISORY_SCENARIO_CATALOG } from './scenarios.js';
import {
  buildObjectiveAwareAdviceHints,
  parseObjectiveContextFromGame,
} from './objective-context.js';
import { buildGuardianCoPilotMonitorSnapshot } from './snapshot.js';
import {
  buildGuardianDepthAdviceLines,
  buildGuardianDepthCouplingReport,
  buildGuardianDepthInterlockReport,
  buildGuardianDepthStabilityReport,
  buildGuardianDepthResilienceReport,
  buildGuardianDepthContinuityReport,
  buildGuardianDepthStewardshipReport,
  buildGuardianDepthAccountabilityReport,
  buildGuardianDepthFiduciaryReport,
  runGuardianDepthUnitSelfTests,
} from './guardian-depth.js';
import type { AdvisoryRecommendation, Agent16SelfTestResult, AiSuggestedAction } from './types.js';

function check(
  results: Agent16SelfTestResult[],
  id: string,
  name: string,
  fn: () => boolean | string
): void {
  try {
    const out = fn();
    results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
  } catch (e) {
    results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
  }
}

export function runAgent16GuardianCoPilotSelfTests(): Agent16SelfTestResult[] {
  const results: Agent16SelfTestResult[] = [];
  const J = (v: unknown) => JSON.stringify(v);

  check(results, 'a16_policy', 'Advisory ops policy forbids execution and mutation', () =>
    ADVISORY_OPS_POLICY.mayExecuteActions === false &&
    ADVISORY_OPS_POLICY.mayMutateGameState === false &&
    ADVISORY_OPS_POLICY.mandate === 'recommendations_only'
  );

  check(results, 'a16_recommendation_flags', 'Every emitted recommendation is grounded and state-verified', () => {
    const cycle = runGuardianCoPilotAdvisoryCycle({
      gameState: {
        turnCounter: 4,
        day: 4,
        player: { id: 'player_1', money: 100 },
        gameSettings: { coPilotSettings: { enabled: true, spendingCaps: { minimumCashReserve: 250 } } },
      },
    });
    return (
      cycle.recommendations.length > 0 &&
      cycle.recommendations.every(r => assertAdvisoryRecommendationOnly(r) && verifyAdvisoryGrounding(r, cycle.snapshot))
    );
  });

  check(results, 'a16_deterministic', 'Same snapshot inputs → same advisory ordering', () => {
    const gs = {
      turnCounter: 7,
      day: 7,
      player: { id: 'p', money: 50, actionsUsedThisTurn: 3 },
      gameSettings: {
        playerActionsPerDay: 3,
        coPilotSettings: {
          enabled: true,
          authorityMode: 'autonomous',
          spendingCaps: { minimumCashReserve: 500, maximumSpendPerAction: 100 },
        },
      },
      coPilotBlockedContinueCount: 3,
    };
    const a = runGuardianCoPilotAdvisoryCycle({ gameState: gs });
    const b = runGuardianCoPilotAdvisoryCycle({ gameState: gs });
    return J(a.recommendations.map(r => r.id)) === J(b.recommendations.map(r => r.id));
  });

  check(results, 'a16_dedupe', 'materializeAdvisoryAlerts dedupes by dedupeKey', () => {
    const snap = createAdvisoryOpsFixtureSnapshot();
    const dup: AdvisoryRecommendation = {
      id: 'a',
      kind: 'alert',
      severity: 'high',
      category: 'x',
      title: 't',
      detail: 'd',
      recommendationOnly: true,
      mayExecute: false,
      grounding: [{ field: 'cash', label: 'Cash', value: snap.cash }],
      stateVerified: true,
      dedupeKey: 'k',
      turn: 1,
      day: 1,
      actorId: 'p',
      ruleId: 'test',
    };
    const out = materializeAdvisoryAlerts([dup, { ...dup, id: 'b', severity: 'low' }]);
    return out.length === 1 && out[0].severity === 'high';
  });

  check(results, 'a16_strip_execute', 'stripExecutionFromCoPilotCandidate removes execution hooks', () => {
    const s = stripExecutionFromCoPilotCandidate({
      label: 'Buy',
      execute: () => {},
      dispatch: () => {},
      autoApply: true,
    });
    return s.mayExecute === false && s.recommendationOnly === true && !('execute' in s) && !('dispatch' in s);
  });

  check(results, 'a16_partition', 'partitionSuggestionFromExecution never returns executable payload', () => {
    const { suggestion, executable } = partitionSuggestionFromExecution({
      label: 'Travel',
      mayExecute: true,
      execute: () => {},
    });
    return suggestion.mayExecute === false && executable === null;
  });

  check(results, 'a16_advisory_gate', 'Advisory autonomy never executes a suggestion', () => {
    const g = evaluateSuggestedActionGate({
      autonomy: 'advisory',
      copilotEnabled: true,
      action: { id: 'a', type: 'reserve_region', label: 'x', status: 'proposed' },
      alreadyCommittedIds: [],
    });
    return !g.allowed || 'advisory allowed execution';
  });

  check(results, 'a16_once', 'A suggested action executes at most once', () => {
    const a: AiSuggestedAction = { id: 'a', type: 'reserve_region', label: 'x', status: 'proposed' };
    const first = markSuggestedAction(a, 'executed', []);
    const second = markSuggestedAction(first.action, 'executed', first.committedIds);
    return first.executed && !second.executed || 'executed twice';
  });

  check(results, 'a16_copilot_advice', 'Co-Pilot evaluation maps to advisory copy only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot();
    const recs = advisoryRecommendationsFromCoPilotEvaluation(
      { topRecommendation: { id: 'c1', label: 'Travel', actionType: 'travel', execute: () => {} }, candidates: [] },
      snap
    );
    return (
      recs.length === 1 &&
      recs[0].mayExecute === false &&
      (/approval required/i.test(recs[0].title) || /without your confirmation/i.test(recs[0].detail))
    );
  });

  check(results, 'a16_objective_parse', 'Mission objectives parse into snapshot fields', () => {
    const gs = {
      turnCounter: 9,
      activeMission: {
        objectives: [
          {
            description: 'Deliver wheat to NSW',
            targetRegion: 'NSW',
            targetValue: 100,
            currentProgress: 20,
            isMandatory: true,
          },
        ],
      },
      player: { id: 'p1', money: 500, currentRegion: 'VIC' },
    };
    const snap = buildGuardianCoPilotMonitorSnapshot({ gameState: gs });
    return (
      snap.objectiveActive &&
      snap.objectiveProgressPct === 20 &&
      snap.objectiveTargetRegion === 'NSW' &&
      !snap.playerInObjectiveRegion
    );
  });

  check(results, 'a16_objective_hints', 'Objective-aware hints cite live snapshot fields only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      objectiveActive: true,
      objectivePrimaryLabel: 'Hold VIC',
      objectiveTargetRegion: 'VIC',
      region: 'NSW',
      playerInObjectiveRegion: false,
      apRemaining: 2,
      objectiveProgressPct: 15,
    });
    const hints = buildObjectiveAwareAdviceHints(snap);
    return hints.length >= 2 && hints.some(h => /VIC/.test(h)) && hints.every(h => !/execute/i.test(h));
  });

  check(results, 'a16_expansion_count', 'Round 10 scale wave brings monitor catalog to 154+ rules', () => {
    return ADVISORY_MONITOR_RULES.length >= 154;
  });

  check(results, 'a16_coupling_report', 'Guardian depth coupling report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 400,
      debt: 600,
      maxSpendPerAction: 8000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      objectiveActive: true,
      objectiveProgressPct: 12,
      objectiveTurnsRemaining: 2,
    });
    const report = buildGuardianDepthCouplingReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round4_metrics', 'Round 4 interlock metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 40,
      minCashReserve: 500,
      debt: 800,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
    });
    return snap.compositePressureIndex >= 40 && snap.automationReadinessScore <= 100 && snap.actionBurnPressure >= 0;
  });

  check(results, 'a16_stability_report', 'Guardian depth stability report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
    });
    const report = buildGuardianDepthStabilityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round5_metrics', 'Round 5 stability lattice metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 500,
      debt: 900,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
    });
    return (
      snap.advisorySaturationIndex >= 40 &&
      snap.escalationLatchScore >= 30 &&
      snap.governanceCoherenceScore <= 100
    );
  });

  check(results, 'a16_round6_metrics', 'Round 6 resilience envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
    });
    return (
      snap.containmentBurdenIndex >= 40 &&
      snap.humanRelayPressure >= 35 &&
      snap.recoveryHeadroomScore <= 100
    );
  });

  check(results, 'a16_resilience_report', 'Guardian depth resilience report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
    });
    const report = buildGuardianDepthResilienceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round7_metrics', 'Round 7 continuity envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 20,
      minCashReserve: 500,
      debt: 1100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.advisoryDepletionIndex >= 40 &&
      snap.operatorBandwidthScore <= 100 &&
      snap.continuityMarginScore <= 100
    );
  });

  check(results, 'a16_continuity_report', 'Guardian depth continuity report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 20,
      minCashReserve: 500,
      debt: 1100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthContinuityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round8_metrics', 'Round 8 stewardship envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.stewardshipLoadIndex >= 40 &&
      snap.oversightCommitmentScore <= 100 &&
      snap.sustainabilityMarginScore <= 100
    );
  });

  check(results, 'a16_stewardship_report', 'Guardian depth stewardship report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthStewardshipReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round9_metrics', 'Round 9 accountability envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.accountabilityLoadIndex >= 40 &&
      snap.delegationFidelityScore <= 100 &&
      snap.governanceEnduranceScore <= 100
    );
  });

  check(results, 'a16_accountability_report', 'Guardian depth accountability report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAccountabilityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round10_metrics', 'Round 10 fiduciary envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.fiduciaryBurdenIndex >= 40 &&
      snap.trustAssuranceScore <= 100 &&
      snap.governanceDurabilityScore <= 100
    );
  });

  check(results, 'a16_fiduciary_report', 'Guardian depth fiduciary report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthFiduciaryReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_interlock_report', 'Guardian depth interlock report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 500,
      debt: 900,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      copilotEnabled: true,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
    });
    const report = buildGuardianDepthInterlockReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round3_metrics', 'Round 3 depth metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({ cash: 50, minCashReserve: 400, debt: 700 });
    return snap.liquidityStressIndex >= 40 && snap.copilotSpendingHeadroom >= 0;
  });

  check(results, 'a16_depth_advice_lines', 'Guardian depth advice lines are non-executable strings', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      guardianEnabled: true,
      cash: 50,
      minCashReserve: 500,
      copilotHoldsControl: true,
    });
    const lines = buildGuardianDepthAdviceLines(snap);
    return lines.length > 0 && lines.every(l => typeof l === 'string' && !/\bexecute\b/i.test(l));
  });

  check(results, 'a16_snapshot_depth_enrich', 'Snapshot builder enriches Guardian depth flags', () => {
    const snap = buildGuardianCoPilotMonitorSnapshot({
      gameState: {
        player: { money: 50, currentRegion: 'NSW' },
        gameSettings: {
          guardianAiSettings: { enabled: true, protectionLevel: 'maximum_protection', responseMode: 'require_confirmation' },
          coPilotSettings: { enabled: true, autonomousSessionActive: true, authorityMode: 'autonomous', spendingCaps: { minimumCashReserve: 500 } },
        },
      },
    });
    return snap.guardianAutomationLikelyBlocked === true;
  });

  for (const t of runGuardianDepthUnitSelfTests()) {
    check(results, `a16_${t.id}`, `Guardian depth ${t.id}`, () => t.passed);
  }

  for (const rule of ADVISORY_MONITOR_RULES) {
    check(results, `a16_rule_${rule.id}`, `Rule ${rule.id} evaluates without throw on fixture`, () => {
      rule.evaluate(createAdvisoryOpsFixtureSnapshot());
      return true;
    });
  }

  for (const sc of ADVISORY_SCENARIO_CATALOG) {
    check(results, `a16_sc_${sc.id}`, `Scenario ${sc.id} fires expected rules`, () => {
      const out = evaluateAdvisoryScenario(sc);
      if (!out.recommendations.every(assertAdvisoryRecommendationOnly)) return 'recommendation flags';
      const missing = sc.expectRuleIds.filter(id => !out.fired.includes(id));
      if (missing.length) return `missing rules: ${missing.join(', ')}`;
      if (sc.expectRuleIds.length === 0 && out.fired.includes('cash_below_reserve')) return 'unexpected cash alert on healthy baseline';
      return true;
    });
  }

  return results;
}

export function summarizeAgent16SelfTests(results: Agent16SelfTestResult[]): { passed: number; failed: number; ok: boolean } {
  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, ok: failed === 0 };
}
