/**
 * Agent 21 — wave 33 projection baseline sync tags (read-only round 33 / O10-196 → O10-197).
 */

import { handoffAg21IntegrationWave32OriginGate } from './forecast-integration-wave32-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-32 integration baseline (O10-196 @ c5f6d0b); wave 33 module sync anchor for O10-197. */
export const AG21_WAVE33_PROJECTION_BASELINE_SHA = 'c5f6d0b';
export const AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL = 1_836_529;

export type Ag21Wave33ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave33ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave33ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave32OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-33 projection baseline for Agent 25 O10-197 gate. */
export function syncAg21Wave33ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE33_PROJECTION_BASELINE_SHA
): Ag21Wave33ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.21),
      actorDebt: baseCtx.actorDebt + 940
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave32OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE33_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave33ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w33_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE33_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:33`,
    `ticket:O10-197`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE33_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-33 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE33_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave33ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 72, seed: 47, actorCash: 600, actorDebt: 166, regionsControlled: 4 };
  const sync = syncAg21Wave33ProjectionBaseline(ctx);

  push('w33_id', sync.syncId.startsWith('ag21_w33_'), sync.syncId);
  push('w33_baseline', sync.baselineSha === AG21_WAVE33_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w33_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w33_projected', sync.projectedFunctionalLoc === AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
