/**
 * Agent 21 — integration handoff readiness gate (read-only round 10).
 */

import { buildAg21LabIntegrationHandoff } from './forecast-lab-integration-handoff';
import { resolveAg21OperatorEscalation } from './forecast-operator-escalation';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21HandoffReadinessStatus = 'ready' | 'hold' | 'blocked';

export interface Ag21HandoffReadinessReport {
  status: Ag21HandoffReadinessStatus;
  blockers: string[];
  handoffId: string;
  escalationTier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  coherenceStatus: ReturnType<typeof buildAg21LabIntegrationHandoff>['coherenceStatus'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21ReadinessFromSignals(
  validationStatus: ReturnType<typeof buildAg21LabIntegrationHandoff>['validationStatus'],
  coherenceStatus: Ag21HandoffReadinessReport['coherenceStatus'],
  tier: Ag21HandoffReadinessReport['escalationTier']
): { status: Ag21HandoffReadinessStatus; blockers: string[] } {
  const blockers: string[] = [];
  if (validationStatus === 'blocked') blockers.push('crosslink validation blocked');
  if (coherenceStatus === 'broken') blockers.push('replay coherence broken');
  if (tier === 'incident') blockers.push('operator escalation incident');

  if (blockers.length > 0) return { status: 'blocked', blockers };
  if (validationStatus === 'drift' || coherenceStatus === 'partial' || tier === 'review') {
    blockers.push('await operator review before staging');
    return { status: 'hold', blockers };
  }
  if (tier === 'watch') {
    return { status: 'hold', blockers: ['escalation watch — defer staging promotion'] };
  }
  return { status: 'ready', blockers: [] };
}

/** Evaluate whether round 9 integration handoff may enter assembly staging (round 10). */
export function evaluateAg21HandoffReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21HandoffReadinessReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.78),
      actorDebt: baseCtx.actorDebt + 165
    } satisfies Ag21ForecastContext);

  const handoff = buildAg21LabIntegrationHandoff(baseCtx, candidate);
  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);
  const { status, blockers } = ag21ReadinessFromSignals(
    handoff.validationStatus,
    handoff.coherenceStatus,
    escalation.tier
  );

  return {
    status,
    blockers,
    handoffId: handoff.handoffId,
    escalationTier: escalation.tier,
    coherenceStatus: handoff.coherenceStatus,
    disclaimer: '(Non-authoritative forecast.) Handoff readiness for modular staging only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'hold' ? 'moderate' : 'high',
      [`readiness=${status}`, `blockers=${blockers.length}`]
    ),
    authoritative: false
  };
}

export function runAg21HandoffReadinessSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 16, seed: 71, actorCash: 1010, actorDebt: 90, regionsControlled: 3 };
  const report = evaluateAg21HandoffReadiness(ctx);

  push('readiness_status', ['ready', 'hold', 'blocked'].includes(report.status), report.status);
  push('readiness_handoff', report.handoffId.startsWith('ag21_handoff_'), report.handoffId);
  push('readiness_blockers', Array.isArray(report.blockers), String(report.blockers.length));
  push('readiness_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}
