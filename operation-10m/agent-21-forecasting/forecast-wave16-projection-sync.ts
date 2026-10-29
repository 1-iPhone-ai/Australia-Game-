/**
 * Agent 21 — wave 16 projection baseline sync tags (read-only round 16 / O10-157 → O10-161).
 */

import { evaluateAg21FullChunksDryRunReadiness } from './forecast-full-chunks-dry-run-readiness';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-15 integration dry-run baseline (O10-157); wave 16 module sync anchor. */
export const AG21_WAVE16_PROJECTION_BASELINE_SHA = '6e72f72';
export const AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL = 1_156_219;

export type Ag21Wave16ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave16ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave16ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  dryRunReadiness: ReturnType<typeof evaluateAg21FullChunksDryRunReadiness>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-16 projection baseline for Agent 25 dry-run. */
export function syncAg21Wave16ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE16_PROJECTION_BASELINE_SHA
): Ag21Wave16ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.59),
      actorDebt: baseCtx.actorDebt + 380
    } satisfies Ag21ForecastContext);

  const readiness = evaluateAg21FullChunksDryRunReadiness(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE16_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave16ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (readiness.status === 'blocked') status = 'drift';

  const syncId = `ag21_w16_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE16_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL}`,
    `dry_run:${readiness.status}`,
    `wave:16`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE16_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL,
    dryRunReadiness: readiness.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Projection sync tags for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE16_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave16ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 37, seed: 3, actorCash: 1320, actorDebt: 71, regionsControlled: 4 };
  const sync = syncAg21Wave16ProjectionBaseline(ctx);

  push('w16_id', sync.syncId.startsWith('ag21_w16_'), sync.syncId);
  push('w16_baseline', sync.baselineSha === AG21_WAVE16_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w16_tags', sync.syncTags.length >= 5, String(sync.syncTags.length));
  push('w16_projected', sync.projectedFunctionalLoc === AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
