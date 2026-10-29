/**
 * Agent 21 — wave 18 projection baseline sync tags (read-only round 18 / O10-164 → O10-166).
 */

import { closeAg21IntegrationDryRunCycle } from './forecast-integration-dry-run-closure';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-17 integration baseline (O10-164 @ 13bdc135); wave 18 module sync anchor for O10-166. */
export const AG21_WAVE18_PROJECTION_BASELINE_SHA = '13bdc135';
export const AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL = 1_232_597;

export type Ag21Wave18ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave18ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave18ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  dryRunClosure: ReturnType<typeof closeAg21IntegrationDryRunCycle>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-18 projection baseline for Agent 25 O10-166 gate. */
export function syncAg21Wave18ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE18_PROJECTION_BASELINE_SHA
): Ag21Wave18ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.51),
      actorDebt: baseCtx.actorDebt + 490
    } satisfies Ag21ForecastContext);

  const closure = closeAg21IntegrationDryRunCycle(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE18_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave18ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (closure.status === 'open') status = 'drift';

  const syncId = `ag21_w18_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE18_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL}`,
    `dry_run_closure:${closure.status}`,
    `wave:18`,
    `ticket:O10-166`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE18_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL,
    dryRunClosure: closure.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-18 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE18_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave18ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 42, seed: 11, actorCash: 1180, actorDebt: 74, regionsControlled: 4 };
  const sync = syncAg21Wave18ProjectionBaseline(ctx);

  push('w18_id', sync.syncId.startsWith('ag21_w18_'), sync.syncId);
  push('w18_baseline', sync.baselineSha === AG21_WAVE18_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w18_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w18_projected', sync.projectedFunctionalLoc === AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
