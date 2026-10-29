/**
 * Agent 21 — retention policy from confirmation + audit trail (read-only round 13).
 */

import { buildAg21ArchiveAuditTrail } from './forecast-archive-audit-trail';
import { confirmAg21ExportManifest } from './forecast-manifest-confirmation';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21RetentionDisposition = 'retain' | 'purge_candidate' | 'hold';

export interface Ag21LabRetentionPolicy {
  policyId: string;
  disposition: Ag21RetentionDisposition;
  retentionDaysHint: number;
  confirmationStatus: ReturnType<typeof confirmAg21ExportManifest>['status'];
  auditTrailId: string;
  rationale: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Resolve lab artifact retention disposition for checkpoint logs (round 13). */
export function resolveAg21LabRetentionPolicy(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabRetentionPolicy {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.67),
      actorDebt: baseCtx.actorDebt + 275
    } satisfies Ag21ForecastContext);

  const confirmation = confirmAg21ExportManifest(baseCtx, candidate);
  const trail = buildAg21ArchiveAuditTrail(baseCtx, candidate);

  let disposition: Ag21RetentionDisposition = 'hold';
  let retentionDaysHint = 14;
  if (confirmation.status === 'confirmed') {
    disposition = 'retain';
    retentionDaysHint = 90;
  } else if (confirmation.status === 'revoked') {
    disposition = 'purge_candidate';
    retentionDaysHint = 7;
  }

  const rationale =
    disposition === 'retain'
      ? 'Confirmed manifest — retain audit trail for history module sync.'
      : disposition === 'purge_candidate'
        ? 'Revoked confirmation — mark lab artifacts for purge review.'
        : 'Pending confirmation — hold retention until operator sign-off.';

  const policyId = `ag21_retention_${baseCtx.turn}_${baseCtx.seed}_${disposition}_v${O10M_AGENT21_MODULE_VERSION.replace(/\./g, '')}`;

  return {
    policyId,
    disposition,
    retentionDaysHint,
    confirmationStatus: confirmation.status,
    auditTrailId: trail.trailId,
    rationale,
    disclaimer: '(Non-authoritative forecast.) Retention policy for lab checkpoints only.',
    overallUncertainty: ag21LabelUncertainty(
      disposition === 'retain' ? 'low' : disposition === 'purge_candidate' ? 'high' : 'moderate',
      [`disposition=${disposition}`, `days=${retentionDaysHint}`]
    ),
    authoritative: false
  };
}

export function runAg21LabRetentionPolicySelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 27, seed: 6, actorCash: 1380, actorDebt: 52, regionsControlled: 5 };
  const policy = resolveAg21LabRetentionPolicy(ctx);

  push('retention_id', policy.policyId.startsWith('ag21_retention_'), policy.policyId);
  push('retention_disposition', ['retain', 'purge_candidate', 'hold'].includes(policy.disposition), policy.disposition);
  push('retention_days', policy.retentionDaysHint > 0, String(policy.retentionDaysHint));
  push('retention_non_auth', policy.authoritative === false, policy.disclaimer.slice(0, 28));

  return out;
}
