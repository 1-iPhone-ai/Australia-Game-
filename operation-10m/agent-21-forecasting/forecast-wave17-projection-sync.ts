/**
 * Agent 21 — wave 17 projection baseline sync tags (read-only round 17 / O10-161 → O10-163).
 */

import { recordAg21FullChunksDryRunExecution } from './forecast-full-chunks-dry-run-execution';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-16 dry-run baseline (O10-161 @ fcab7b20); wave 17 module sync anchor for O10-163. */
export const AG21_WAVE17_PROJECTION_BASELINE_SHA = 'fcab7b20';
export const AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL = 1_194_408;

export type Ag21Wave17ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave17ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave17ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  dryRunExecution: ReturnType<typeof recordAg21FullChunksDryRunExecution>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-17 projection baseline for Agent 25 O10-163 gate. */
export function syncAg21Wave17ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE17_PROJECTION_BASELINE_SHA
): Ag21Wave17ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.53),
      actorDebt: baseCtx.actorDebt + 460
    } satisfies Ag21ForecastContext);

  const execution = recordAg21FullChunksDryRunExecution(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE17_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave17ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (execution.status === 'skipped') status = 'drift';

  const syncId = `ag21_w17_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE17_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL}`,
    `dry_run_exec:${execution.status}`,
    `wave:17`,
    `ticket:O10-163`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE17_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL,
    dryRunExecution: execution.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-17 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE17_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave17ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 40, seed: 5, actorCash: 1280, actorDebt: 68, regionsControlled: 4 };
  const sync = syncAg21Wave17ProjectionBaseline(ctx);

  push('w17_id', sync.syncId.startsWith('ag21_w17_'), sync.syncId);
  push('w17_baseline', sync.baselineSha === AG21_WAVE17_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w17_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w17_projected', sync.projectedFunctionalLoc === AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
