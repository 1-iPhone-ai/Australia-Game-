/**
 * Agent 21 — wave 46 projection baseline sync tags (read-only round 46 / O10-222 → O10-223).
 */

import { handoffAg21IntegrationWave45OriginGate } from './forecast-integration-wave45-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE46_PROJECTION_BASELINE_SHA = 'a9bb07e5';
export const AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL = 2_593_189;

export type Ag21Wave46ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave46ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave46ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave45OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave46ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE46_PROJECTION_BASELINE_SHA
): Ag21Wave46ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.07),
      actorDebt: baseCtx.actorDebt + 1330
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave45OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE46_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave46ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w46_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE46_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:46`,
    `ticket:O10-223`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE46_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-46 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE46_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave46ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 98, seed: 61, actorCash: 690, actorDebt: 208, regionsControlled: 4 };
  const sync = syncAg21Wave46ProjectionBaseline(ctx);

  push('w46_id', sync.syncId.startsWith('ag21_w46_'), sync.syncId);
  push('w46_baseline', sync.baselineSha === AG21_WAVE46_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w46_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w46_projected', sync.projectedFunctionalLoc === AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
