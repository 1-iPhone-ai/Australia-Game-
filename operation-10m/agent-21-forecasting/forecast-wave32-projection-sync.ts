/**
 * Agent 21 — wave 32 projection baseline sync tags (read-only round 32 / O10-194 → O10-195).
 */

import { handoffAg21IntegrationWave31OriginGate } from './forecast-integration-wave31-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-31 integration baseline (O10-194 @ aa70dac); wave 32 module sync anchor for O10-195. */
export const AG21_WAVE32_PROJECTION_BASELINE_SHA = 'aa70dac';
export const AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL = 1_798_330;

export type Ag21Wave32ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave32ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave32ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave31OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-32 projection baseline for Agent 25 O10-195 gate. */
export function syncAg21Wave32ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE32_PROJECTION_BASELINE_SHA
): Ag21Wave32ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.23),
      actorDebt: baseCtx.actorDebt + 910
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave31OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE32_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave32ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w32_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE32_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:32`,
    `ticket:O10-195`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE32_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-32 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE32_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave32ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 70, seed: 45, actorCash: 630, actorDebt: 160, regionsControlled: 4 };
  const sync = syncAg21Wave32ProjectionBaseline(ctx);

  push('w32_id', sync.syncId.startsWith('ag21_w32_'), sync.syncId);
  push('w32_baseline', sync.baselineSha === AG21_WAVE32_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w32_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w32_projected', sync.projectedFunctionalLoc === AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
