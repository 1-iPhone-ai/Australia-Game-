/**
 * Agent 21 — operator escalation ladder from validation + telemetry (read-only round 8).
 */

import { validateAg21CrosslinkHandoff } from './forecast-packet-validation';
import { collectAg21LabTelemetry } from './forecast-lab-telemetry';
import { buildAg21LabPlaybook } from './forecast-lab-playbook';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21OperatorEscalationTier = 'none' | 'watch' | 'review' | 'incident';

export interface Ag21OperatorEscalation {
  tier: Ag21OperatorEscalationTier;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  operatorMode: ReturnType<typeof buildAg21LabPlaybook>['operatorMode'];
  actionHint: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TierFromSignals(
  validationStatus: Ag21OperatorEscalation['validationStatus'],
  health: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'],
  decision: ReturnType<typeof collectAg21LabTelemetry>['surfaceDecision'],
  highPriorityHints: number
): Ag21OperatorEscalationTier {
  if (validationStatus === 'blocked' || health === 'critical' || decision === 'suppress') return 'incident';
  if (validationStatus === 'drift' || health === 'degraded' || decision === 'hold' || highPriorityHints >= 2) {
    return 'review';
  }
  if (decision === 'hold' || highPriorityHints >= 1) return 'watch';
  return 'none';
}

/** Resolve operator escalation tier for lab dashboards (round 8). */
export function resolveAg21OperatorEscalation(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21OperatorEscalation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.8),
      actorDebt: baseCtx.actorDebt + 140
    } satisfies Ag21ForecastContext);

  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);
  const playbook = buildAg21LabPlaybook(baseCtx, candidate);
  const highPriorityHints = playbook.hints.filter(h => h.priority === 'high').length;

  const tier = ag21TierFromSignals(
    validation.status,
    telemetry.telemetryHealth,
    telemetry.surfaceDecision,
    highPriorityHints
  );

  const actionHint =
    tier === 'incident'
      ? 'Pause surfacing; reconcile crosslink packet with telemetry before next turn.'
      : tier === 'review'
        ? 'Schedule operator review; confirm playbook hints against validation drift.'
        : tier === 'watch'
          ? 'Monitor gates and convergence; no dashboard promotion yet.'
          : 'No escalation; lab outputs may follow round 7 surface decision.';

  return {
    tier,
    validationStatus: validation.status,
    operatorMode: playbook.operatorMode,
    actionHint,
    overallUncertainty: ag21LabelUncertainty(
      tier === 'none' ? 'low' : tier === 'watch' ? 'moderate' : 'high',
      [`tier=${tier}`, `validation=${validation.status}`]
    ),
    authoritative: false
  };
}

export function runAg21OperatorEscalationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 11, seed: 52, actorCash: 880, actorDebt: 160, regionsControlled: 2 };
  const escalation = resolveAg21OperatorEscalation(ctx);

  push('escalation_tier', ['none', 'watch', 'review', 'incident'].includes(escalation.tier), escalation.tier);
  push('escalation_hint', escalation.actionHint.length > 10, escalation.actionHint.slice(0, 40));
  push('escalation_validation', ['aligned', 'drift', 'blocked'].includes(escalation.validationStatus), escalation.validationStatus);
  push('escalation_non_auth', escalation.authoritative === false, escalation.operatorMode);

  return out;
}
