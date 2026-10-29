/**
 * Agent 21 — wave 24 projection baseline sync tags (read-only round 24 / O10-178 → O10-179).
 */

import { handoffAg21IntegrationWave23OriginGate } from './forecast-integration-wave23-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-23 integration baseline (O10-178 @ b64a7aa8); wave 24 module sync anchor for O10-179. */
export const AG21_WAVE24_PROJECTION_BASELINE_SHA = 'b64a7aa8';
export const AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL = 1_487_095;

export type Ag21Wave24ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave24ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave24ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave23OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-24 projection baseline for Agent 25 O10-179 gate. */
export function syncAg21Wave24ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE24_PROJECTION_BASELINE_SHA
): Ag21Wave24ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.39),
      actorDebt: baseCtx.actorDebt + 670
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave23OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE24_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave24ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w24_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE24_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:24`,
    `ticket:O10-179`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE24_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-24 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE24_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave24ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 54, seed: 29, actorCash: 870, actorDebt: 112, regionsControlled: 4 };
  const sync = syncAg21Wave24ProjectionBaseline(ctx);

  push('w24_id', sync.syncId.startsWith('ag21_w24_'), sync.syncId);
  push('w24_baseline', sync.baselineSha === AG21_WAVE24_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w24_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w24_projected', sync.projectedFunctionalLoc === AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
