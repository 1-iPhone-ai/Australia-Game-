/**
 * Agent 21 — retention policy compliance vs confirmation (read-only round 14).
 */

import { resolveAg21LabRetentionPolicy } from './forecast-lab-retention-policy';
import { confirmAg21ExportManifest } from './forecast-manifest-confirmation';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21RetentionComplianceStatus = 'compliant' | 'gap' | 'violation';

export interface Ag21RetentionComplianceReport {
  status: Ag21RetentionComplianceStatus;
  policyId: string;
  disposition: ReturnType<typeof resolveAg21LabRetentionPolicy>['disposition'];
  confirmationStatus: ReturnType<typeof confirmAg21ExportManifest>['status'];
  findings: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Assess retention policy against manifest confirmation signals (round 14). */
export function assessAg21RetentionCompliance(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21RetentionComplianceReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.66),
      actorDebt: baseCtx.actorDebt + 285
    } satisfies Ag21ForecastContext);

  const policy = resolveAg21LabRetentionPolicy(baseCtx, candidate);
  const confirmation = confirmAg21ExportManifest(baseCtx, candidate);

  const findings: string[] = [];
  if (policy.disposition === 'retain' && confirmation.status !== 'confirmed') {
    findings.push('retain disposition but manifest not confirmed');
  }
  if (policy.disposition === 'purge_candidate' && confirmation.status === 'confirmed') {
    findings.push('purge candidate while manifest confirmed');
  }
  if (policy.disposition === 'hold' && confirmation.status === 'revoked') {
    findings.push('hold disposition with revoked confirmation');
  }

  let status: Ag21RetentionComplianceStatus = 'compliant';
  if (findings.length >= 2) status = 'violation';
  else if (findings.length === 1) status = 'gap';

  return {
    status,
    policyId: policy.policyId,
    disposition: policy.disposition,
    confirmationStatus: confirmation.status,
    findings,
    disclaimer: '(Non-authoritative forecast.) Retention compliance for checkpoint review only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'compliant' ? 'low' : status === 'gap' ? 'moderate' : 'high',
      [`compliance=${status}`, `findings=${findings.length}`]
    ),
    authoritative: false
  };
}

export function runAg21RetentionComplianceSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 13, seed: 41, actorCash: 810, actorDebt: 175, regionsControlled: 2 };
  const report = assessAg21RetentionCompliance(ctx);

  push('compliance_status', ['compliant', 'gap', 'violation'].includes(report.status), report.status);
  push('compliance_policy', report.policyId.startsWith('ag21_retention_'), report.policyId);
  push('compliance_findings', Array.isArray(report.findings), String(report.findings.length));
  push('compliance_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}
