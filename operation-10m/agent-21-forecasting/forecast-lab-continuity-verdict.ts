/**
 * Agent 21 — lab continuity verdict across remediation + origin gate (read-only round 15).
 */

import { attestAg21OriginGateReadiness } from './forecast-origin-gate-attestation';
import { buildAg21GovernanceRemediationPlan } from './forecast-governance-remediation-plan';
import { rollupAg21ArchiveAuditSummary } from './forecast-archive-audit-rollup';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21LabContinuityVerdict = 'continuous' | 'watch' | 'broken';

export interface Ag21LabContinuityReport {
  reportId: string;
  verdict: Ag21LabContinuityVerdict;
  rollupId: string;
  originGateStatus: ReturnType<typeof attestAg21OriginGateReadiness>['status'];
  remediationStatus: ReturnType<typeof buildAg21GovernanceRemediationPlan>['status'];
  summary: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Resolve forecast lab continuity for wave-15 origin gate (round 15). */
export function resolveAg21LabContinuityVerdict(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabContinuityReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.6),
      actorDebt: baseCtx.actorDebt + 335
    } satisfies Ag21ForecastContext);

  const rollup = rollupAg21ArchiveAuditSummary(baseCtx, candidate);
  const remediation = buildAg21GovernanceRemediationPlan(baseCtx, candidate);
  const origin = attestAg21OriginGateReadiness(baseCtx, candidate);

  let verdict: Ag21LabContinuityVerdict = 'continuous';
  if (origin.status === 'held' || remediation.status === 'blocked' || rollup.sealStatus === 'void') {
    verdict = 'broken';
  } else if (origin.status === 'conditional' || remediation.status === 'planned') {
    verdict = 'watch';
  }

  const reportId = `ag21_cont_${baseCtx.turn}_${baseCtx.seed}_${verdict}`;
  const summary = `continuity ${verdict} · rollup ${rollup.complianceStatus} · gate ${origin.status}`;

  return {
    reportId,
    verdict,
    rollupId: rollup.rollupId,
    originGateStatus: origin.status,
    remediationStatus: remediation.status,
    summary,
    disclaimer: '(Non-authoritative forecast.) Continuity verdict for operator dashboards only.',
    overallUncertainty: ag21LabelUncertainty(
      verdict === 'continuous' ? 'low' : verdict === 'watch' ? 'moderate' : 'high',
      [`continuity=${verdict}`, `rollup=${rollup.rollupId}`]
    ),
    authoritative: false
  };
}

export function runAg21LabContinuityVerdictSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 35, seed: 22, actorCash: 990, actorDebt: 88, regionsControlled: 3 };
  const report = resolveAg21LabContinuityVerdict(ctx);

  push('cont_id', report.reportId.startsWith('ag21_cont_'), report.reportId);
  push('cont_verdict', ['continuous', 'watch', 'broken'].includes(report.verdict), report.verdict);
  push('cont_summary', report.summary.includes('gate'), report.summary.slice(0, 40));
  push('cont_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}
