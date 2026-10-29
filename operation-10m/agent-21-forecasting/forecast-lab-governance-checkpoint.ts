/**
 * Agent 21 — governance checkpoint across rollup + compliance (read-only round 14).
 */

import { rollupAg21ArchiveAuditSummary } from './forecast-archive-audit-rollup';
import { assessAg21RetentionCompliance } from './forecast-retention-compliance';
import { buildAg21ExportManifest } from './forecast-export-manifest';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21GovernanceCheckpointVerdict = 'pass' | 'conditional' | 'fail';

export interface Ag21LabGovernanceCheckpoint {
  checkpointId: string;
  moduleVersion: string;
  verdict: Ag21GovernanceCheckpointVerdict;
  rollupId: string;
  manifestMayPublish: boolean;
  actionItems: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Run scale-wave governance checkpoint on archive + retention path (round 14). */
export function runAg21LabGovernanceCheckpoint(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabGovernanceCheckpoint {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.64),
      actorDebt: baseCtx.actorDebt + 305
    } satisfies Ag21ForecastContext);

  const rollup = rollupAg21ArchiveAuditSummary(baseCtx, candidate);
  const compliance = assessAg21RetentionCompliance(baseCtx, candidate);
  const manifest = buildAg21ExportManifest(baseCtx, candidate);

  const actionItems: string[] = [];
  if (rollup.sealStatus === 'void') actionItems.push('void archive seal — rebuild export path');
  if (compliance.status === 'violation') actionItems.push('retention compliance violation — operator review');
  if (compliance.status === 'gap') actionItems.push('retention gap — reconcile disposition vs confirmation');
  if (!manifest.mayPublish && rollup.sealStatus === 'sealed') {
    actionItems.push('sealed archive without publishable manifest');
  }

  let verdict: Ag21GovernanceCheckpointVerdict = 'pass';
  if (compliance.status === 'violation' || rollup.sealStatus === 'void') verdict = 'fail';
  else if (actionItems.length > 0 || compliance.status === 'gap') verdict = 'conditional';

  const checkpointId = `ag21_gov_${baseCtx.turn}_${baseCtx.seed}_${verdict}`;

  return {
    checkpointId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    verdict,
    rollupId: rollup.rollupId,
    manifestMayPublish: manifest.mayPublish,
    actionItems,
    disclaimer: '(Non-authoritative forecast.) Governance checkpoint for Operation 10M scale waves only.',
    overallUncertainty: ag21LabelUncertainty(
      verdict === 'pass' ? 'low' : verdict === 'conditional' ? 'moderate' : 'high',
      [`checkpoint=${checkpointId}`, `verdict=${verdict}`]
    ),
    authoritative: false
  };
}

export function runAg21LabGovernanceCheckpointSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 29, seed: 4, actorCash: 1550, actorDebt: 35, regionsControlled: 5 };
  const checkpoint = runAg21LabGovernanceCheckpoint(ctx);

  push('gov_id', checkpoint.checkpointId.startsWith('ag21_gov_'), checkpoint.checkpointId);
  push('gov_verdict', ['pass', 'conditional', 'fail'].includes(checkpoint.verdict), checkpoint.verdict);
  push('gov_version', checkpoint.moduleVersion === O10M_AGENT21_MODULE_VERSION, checkpoint.moduleVersion);
  push('gov_non_auth', checkpoint.authoritative === false, checkpoint.disclaimer.slice(0, 28));

  return out;
}
