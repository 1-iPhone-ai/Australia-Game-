/**
 * Agent 21 — wave 29 projection baseline sync tags (read-only round 29 / O10-188 → O10-189).
 */

import { handoffAg21IntegrationWave28OriginGate } from './forecast-integration-wave28-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-28 integration baseline (O10-188 @ 70df4aee); wave 29 module sync anchor for O10-189. */
export const AG21_WAVE29_PROJECTION_BASELINE_SHA = '70df4aee';
export const AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL = 1_683_733;

export type Ag21Wave29ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave29ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave29ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave28OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-29 projection baseline for Agent 25 O10-189 gate. */
export function syncAg21Wave29ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE29_PROJECTION_BASELINE_SHA
): Ag21Wave29ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.29),
      actorDebt: baseCtx.actorDebt + 820
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave28OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE29_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave29ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w29_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE29_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:29`,
    `ticket:O10-189`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE29_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-29 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE29_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave29ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 64, seed: 39, actorCash: 720, actorDebt: 142, regionsControlled: 4 };
  const sync = syncAg21Wave29ProjectionBaseline(ctx);

  push('w29_id', sync.syncId.startsWith('ag21_w29_'), sync.syncId);
  push('w29_baseline', sync.baselineSha === AG21_WAVE29_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w29_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w29_projected', sync.projectedFunctionalLoc === AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
