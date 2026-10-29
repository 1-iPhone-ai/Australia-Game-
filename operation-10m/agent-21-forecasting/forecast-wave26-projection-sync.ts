/**
 * Agent 21 — wave 26 projection baseline sync tags (read-only round 26 / O10-182 → O10-183).
 */

import { handoffAg21IntegrationWave25OriginGate } from './forecast-integration-wave25-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-25 integration baseline (O10-182 @ de3079f9); wave 26 module sync anchor for O10-183. */
export const AG21_WAVE26_PROJECTION_BASELINE_SHA = 'de3079f9';
export const AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL = 1_563_481;

export type Ag21Wave26ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave26ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave26ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave25OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-26 projection baseline for Agent 25 O10-183 gate. */
export function syncAg21Wave26ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE26_PROJECTION_BASELINE_SHA
): Ag21Wave26ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.35),
      actorDebt: baseCtx.actorDebt + 730
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave25OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE26_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave26ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w26_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE26_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:26`,
    `ticket:O10-183`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE26_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-26 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE26_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave26ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 58, seed: 33, actorCash: 810, actorDebt: 124, regionsControlled: 4 };
  const sync = syncAg21Wave26ProjectionBaseline(ctx);

  push('w26_id', sync.syncId.startsWith('ag21_w26_'), sync.syncId);
  push('w26_baseline', sync.baselineSha === AG21_WAVE26_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w26_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w26_projected', sync.projectedFunctionalLoc === AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
