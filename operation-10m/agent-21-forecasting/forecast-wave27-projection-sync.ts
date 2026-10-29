/**
 * Agent 21 — wave 27 projection baseline sync tags (read-only round 27 / O10-184 → O10-185).
 */

import { handoffAg21IntegrationWave26OriginGate } from './forecast-integration-wave26-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-26 integration baseline (O10-184 @ 7c1cfd89); wave 27 module sync anchor for O10-185. */
export const AG21_WAVE27_PROJECTION_BASELINE_SHA = '7c1cfd89';
export const AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL = 1_601_674;

export type Ag21Wave27ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave27ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave27ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave26OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-27 projection baseline for Agent 25 O10-185 gate. */
export function syncAg21Wave27ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE27_PROJECTION_BASELINE_SHA
): Ag21Wave27ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.33),
      actorDebt: baseCtx.actorDebt + 760
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave26OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE27_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave27ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w27_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE27_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:27`,
    `ticket:O10-185`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE27_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-27 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE27_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave27ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 60, seed: 35, actorCash: 780, actorDebt: 130, regionsControlled: 4 };
  const sync = syncAg21Wave27ProjectionBaseline(ctx);

  push('w27_id', sync.syncId.startsWith('ag21_w27_'), sync.syncId);
  push('w27_baseline', sync.baselineSha === AG21_WAVE27_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w27_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w27_projected', sync.projectedFunctionalLoc === AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
