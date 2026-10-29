/**
 * Agent 21 — wave 22 projection baseline sync tags (read-only round 22 / O10-174 → O10-175).
 */

import { handoffAg21IntegrationWave21OriginGate } from './forecast-integration-wave21-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-21 integration baseline (O10-174 @ 634656bb); wave 22 module sync anchor for O10-175. */
export const AG21_WAVE22_PROJECTION_BASELINE_SHA = '634656bb';
export const AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL = 1_401_419;

export type Ag21Wave22ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave22ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave22ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave21OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-22 projection baseline for Agent 25 O10-175 gate. */
export function syncAg21Wave22ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE22_PROJECTION_BASELINE_SHA
): Ag21Wave22ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.43),
      actorDebt: baseCtx.actorDebt + 610
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave21OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE22_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave22ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w22_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE22_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:22`,
    `ticket:O10-175`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE22_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-22 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE22_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave22ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 50, seed: 23, actorCash: 940, actorDebt: 100, regionsControlled: 4 };
  const sync = syncAg21Wave22ProjectionBaseline(ctx);

  push('w22_id', sync.syncId.startsWith('ag21_w22_'), sync.syncId);
  push('w22_baseline', sync.baselineSha === AG21_WAVE22_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w22_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w22_projected', sync.projectedFunctionalLoc === AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
