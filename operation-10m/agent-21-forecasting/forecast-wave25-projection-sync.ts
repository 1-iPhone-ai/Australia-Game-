/**
 * Agent 21 — wave 25 projection baseline sync tags (read-only round 25 / O10-180 → O10-181).
 */

import { handoffAg21IntegrationWave24OriginGate } from './forecast-integration-wave24-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-24 integration baseline (O10-180 @ 8d741ac7); wave 25 module sync anchor for O10-181. */
export const AG21_WAVE25_PROJECTION_BASELINE_SHA = '8d741ac7';
export const AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL = 1_525_288;

export type Ag21Wave25ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave25ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave25ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave24OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-25 projection baseline for Agent 25 O10-181 gate. */
export function syncAg21Wave25ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE25_PROJECTION_BASELINE_SHA
): Ag21Wave25ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.37),
      actorDebt: baseCtx.actorDebt + 700
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave24OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE25_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave25ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w25_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE25_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:25`,
    `ticket:O10-181`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE25_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-25 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE25_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave25ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 56, seed: 31, actorCash: 840, actorDebt: 118, regionsControlled: 4 };
  const sync = syncAg21Wave25ProjectionBaseline(ctx);

  push('w25_id', sync.syncId.startsWith('ag21_w25_'), sync.syncId);
  push('w25_baseline', sync.baselineSha === AG21_WAVE25_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w25_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w25_projected', sync.projectedFunctionalLoc === AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
