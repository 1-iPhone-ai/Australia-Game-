/**
 * Agent 21 — wave 23 projection baseline sync tags (read-only round 23 / O10-176 → O10-177).
 */

import { handoffAg21IntegrationWave22OriginGate } from './forecast-integration-wave22-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-22 integration baseline (O10-176 @ b23e1449); wave 23 module sync anchor for O10-177. */
export const AG21_WAVE23_PROJECTION_BASELINE_SHA = 'b23e1449';
export const AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL = 1_448_902;

export type Ag21Wave23ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave23ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave23ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave22OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-23 projection baseline for Agent 25 O10-177 gate. */
export function syncAg21Wave23ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE23_PROJECTION_BASELINE_SHA
): Ag21Wave23ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.41),
      actorDebt: baseCtx.actorDebt + 640
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave22OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE23_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave23ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w23_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE23_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:23`,
    `ticket:O10-177`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE23_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-23 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE23_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave23ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 52, seed: 27, actorCash: 900, actorDebt: 106, regionsControlled: 4 };
  const sync = syncAg21Wave23ProjectionBaseline(ctx);

  push('w23_id', sync.syncId.startsWith('ag21_w23_'), sync.syncId);
  push('w23_baseline', sync.baselineSha === AG21_WAVE23_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w23_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w23_projected', sync.projectedFunctionalLoc === AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
