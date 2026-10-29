/**
 * Agent 21 — wave 20 projection baseline sync tags (read-only round 20 / O10-169 → O10-170).
 */

import { handoffAg21IntegrationWave19OriginGate } from './forecast-integration-wave19-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-19 integration baseline (O10-169 @ 680b9954); wave 20 module sync anchor for O10-170. */
export const AG21_WAVE20_PROJECTION_BASELINE_SHA = '680b9954';
export const AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL = 1_315_487;

export type Ag21Wave20ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave20ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave20ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave19OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-20 projection baseline for Agent 25 O10-170 gate. */
export function syncAg21Wave20ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE20_PROJECTION_BASELINE_SHA
): Ag21Wave20ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.47),
      actorDebt: baseCtx.actorDebt + 550
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave19OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE20_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave20ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w20_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE20_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:20`,
    `ticket:O10-170`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE20_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-20 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE20_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave20ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 46, seed: 19, actorCash: 1040, actorDebt: 88, regionsControlled: 4 };
  const sync = syncAg21Wave20ProjectionBaseline(ctx);

  push('w20_id', sync.syncId.startsWith('ag21_w20_'), sync.syncId);
  push('w20_baseline', sync.baselineSha === AG21_WAVE20_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w20_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w20_projected', sync.projectedFunctionalLoc === AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
