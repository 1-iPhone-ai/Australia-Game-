/**
 * Agent 21 — wave 31 projection baseline sync tags (read-only round 31 / O10-192 → O10-193).
 */

import { handoffAg21IntegrationWave30OriginGate } from './forecast-integration-wave30-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-30 integration baseline (O10-192 @ 81b50b8); wave 31 module sync anchor for O10-193. */
export const AG21_WAVE31_PROJECTION_BASELINE_SHA = '81b50b8';
export const AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL = 1_760_131;

export type Ag21Wave31ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave31ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave31ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave30OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-31 projection baseline for Agent 25 O10-193 gate. */
export function syncAg21Wave31ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE31_PROJECTION_BASELINE_SHA
): Ag21Wave31ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.25),
      actorDebt: baseCtx.actorDebt + 880
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave30OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE31_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave31ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w31_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE31_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:31`,
    `ticket:O10-193`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE31_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-31 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE31_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave31ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 68, seed: 43, actorCash: 660, actorDebt: 154, regionsControlled: 4 };
  const sync = syncAg21Wave31ProjectionBaseline(ctx);

  push('w31_id', sync.syncId.startsWith('ag21_w31_'), sync.syncId);
  push('w31_baseline', sync.baselineSha === AG21_WAVE31_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w31_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w31_projected', sync.projectedFunctionalLoc === AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
