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

  check(results, 'a16_expansion_count', 'Expansion adds guardian and objective monitor rules', () => {
    return ADVISORY_MONITOR_RULES.length >= 33;
  });

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
