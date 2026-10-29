import type {
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Agent17GameStateSlice,
  Agent17PlanningSuggestion,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
import { buildAgent17DelegationAnalytics } from './delegation-analytics.ts';
import {
  buildAgent17DelegationLadder,
  delegationLadderHasCapacity,
} from './delegation-ladder.ts';
import { summarizeAgent17PlanLedger, planLedgerIndicatesInstability } from './plan-ledger.ts';
import { assessAgent17PlanHealth } from './plan-health.ts';

export function refineAgent17DelegationSuggestion(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  baseSuggestion: Agent17PlanningSuggestion,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningSuggestion {
  if (baseSuggestion.kind !== 'delegate' && baseSuggestion.kind !== 'hold') {
    return baseSuggestion;
  }
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const ladder = buildAgent17DelegationLadder(analytics, settings, recommendedDelegateKind);
  const ledger = summarizeAgent17PlanLedger(ops, state);
  const health = assessAgent17PlanHealth(ops.activePlan, state, actorId);

  if (planLedgerIndicatesInstability(ledger) && ladder.recommendedKind !== recommendedDelegateKind) {
    return {
      kind: 'delegate',
      delegateKind: ladder.recommendedKind,
      headline: `Ladder reroute → ${ladder.recommendedKind}`,
      rationale: `${ladder.headline}; ledger instability detected.`,
      confidence: 0.78,
    };
  }

  const targetKind = baseSuggestion.delegateKind ?? recommendedDelegateKind;
  if (!delegationLadderHasCapacity(ladder, targetKind)) {
    const alt = ladder.rungs.find(r => r.slotsRemaining > 0);
    if (alt) {
      return {
        kind: 'delegate',
        delegateKind: alt.delegateKind,
        headline: `Capacity reroute → ${alt.delegateKind}`,
        rationale: `${targetKind} at capacity; ${alt.slotsRemaining} slot(s) on ${alt.delegateKind}.`,
        confidence: 0.71,
      };
    }
  }

  if (health.band === 'at_risk' && baseSuggestion.kind === 'hold') {
    return {
      kind: 'delegate',
      delegateKind: ladder.recommendedKind,
      headline: `Proactive delegate ${ladder.recommendedKind}`,
      rationale: 'Plan health at risk; ladder recommends early delegation.',
      confidence: 0.66,
    };
  }

  return baseSuggestion;
}

export function computeAgent17DelegationDepthScore(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice,
  recommendedDelegateKind: Acc17DelegateTargetKind
): number {
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const ladder = buildAgent17DelegationLadder(analytics, settings, recommendedDelegateKind);
  let score = 50;
  score += ladder.rungs.filter(r => r.slotsRemaining > 0).length * 5;
  score -= ladder.totalActiveLoad * 4;
  if (ladder.imbalanceFlag) score -= 15;
  else score += 10;
  return Math.max(0, Math.min(100, score));
}
