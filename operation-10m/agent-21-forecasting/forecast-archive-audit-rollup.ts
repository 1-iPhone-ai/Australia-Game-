/**
 * Agent 21 — archive audit rollup for governance dashboards (read-only round 14).
 */

import { buildAg21ArchiveAuditTrail } from './forecast-archive-audit-trail';
import { assessAg21RetentionCompliance } from './forecast-retention-compliance';
import { sealAg21LabArchiveRecord } from './forecast-lab-archive-seal';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21ArchiveAuditRollup {
  rollupId: string;
  eventCount: number;
  sealStatus: ReturnType<typeof sealAg21LabArchiveRecord>['status'];
  complianceStatus: ReturnType<typeof assessAg21RetentionCompliance>['status'];
  headline: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Roll up audit trail + retention compliance into a single headline (round 14). */
export function rollupAg21ArchiveAuditSummary(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ArchiveAuditRollup {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.65),
      actorDebt: baseCtx.actorDebt + 295
    } satisfies Ag21ForecastContext);

  const trail = buildAg21ArchiveAuditTrail(baseCtx, candidate);
  const compliance = assessAg21RetentionCompliance(baseCtx, candidate);
  const seal = sealAg21LabArchiveRecord(baseCtx, candidate);

  const headline = `audit ${trail.eventCount} events · seal ${seal.status} · compliance ${compliance.status}`;
  const rollupId = `ag21_rollup_${baseCtx.turn}_${baseCtx.seed}_${compliance.status}`;

  return {
    rollupId,
    eventCount: trail.eventCount,
    sealStatus: seal.status,
    complianceStatus: compliance.status,
    headline,
    disclaimer: '(Non-authoritative forecast.) Audit rollup for operator dashboards only.',
    overallUncertainty: ag21LabelUncertainty(
      compliance.status === 'compliant' && seal.status !== 'void' ? 'low' : 'moderate',
      [`rollup=${rollupId}`, `seal=${seal.status}`]
    ),
    authoritative: false
  };
}

export function runAg21ArchiveAuditRollupSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 23, seed: 11, actorCash: 1250, actorDebt: 68, regionsControlled: 4 };
  const rollup = rollupAg21ArchiveAuditSummary(ctx);

  push('rollup_id', rollup.rollupId.startsWith('ag21_rollup_'), rollup.rollupId);
  push('rollup_events', rollup.eventCount === 3, String(rollup.eventCount));
  push('rollup_headline', rollup.headline.includes('compliance'), rollup.headline.slice(0, 40));
  push('rollup_non_auth', rollup.authoritative === false, rollup.disclaimer.slice(0, 28));

  return out;
}
