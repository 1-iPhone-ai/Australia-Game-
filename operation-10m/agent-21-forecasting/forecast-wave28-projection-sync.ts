/**
 * Agent 21 — wave 28 projection baseline sync tags (read-only round 28 / O10-186 → O10-187).
 */

import { handoffAg21IntegrationWave27OriginGate } from './forecast-integration-wave27-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-27 integration baseline (O10-186 @ b9e129bd); wave 28 module sync anchor for O10-187. */
export const AG21_WAVE28_PROJECTION_BASELINE_SHA = 'b9e129bd';
export const AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL = 1_645_538;

export type Ag21Wave28ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave28ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave28ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave27OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-28 projection baseline for Agent 25 O10-187 gate. */
export function syncAg21Wave28ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE28_PROJECTION_BASELINE_SHA
): Ag21Wave28ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.31),
      actorDebt: baseCtx.actorDebt + 790
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave27OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE28_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave28ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w28_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE28_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:28`,
    `ticket:O10-187`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE28_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-28 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE28_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave28ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 62, seed: 37, actorCash: 750, actorDebt: 136, regionsControlled: 4 };
  const sync = syncAg21Wave28ProjectionBaseline(ctx);

  push('w28_id', sync.syncId.startsWith('ag21_w28_'), sync.syncId);
  push('w28_baseline', sync.baselineSha === AG21_WAVE28_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w28_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w28_projected', sync.projectedFunctionalLoc === AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
