/**
 * Agent 21 — wave 30 projection baseline sync tags (read-only round 30 / O10-190 → O10-191).
 */

import { handoffAg21IntegrationWave29OriginGate } from './forecast-integration-wave29-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-29 integration baseline (O10-190 @ 88fa570); wave 30 module sync anchor for O10-191. */
export const AG21_WAVE30_PROJECTION_BASELINE_SHA = '88fa570';
export const AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL = 1_721_932;

export type Ag21Wave30ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave30ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave30ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave29OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-30 projection baseline for Agent 25 O10-191 gate. */
export function syncAg21Wave30ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE30_PROJECTION_BASELINE_SHA
): Ag21Wave30ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.27),
      actorDebt: baseCtx.actorDebt + 850
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave29OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE30_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave30ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w30_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE30_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:30`,
    `ticket:O10-191`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE30_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-30 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE30_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave30ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 66, seed: 41, actorCash: 690, actorDebt: 148, regionsControlled: 4 };
  const sync = syncAg21Wave30ProjectionBaseline(ctx);

  push('w30_id', sync.syncId.startsWith('ag21_w30_'), sync.syncId);
  push('w30_baseline', sync.baselineSha === AG21_WAVE30_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w30_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w30_projected', sync.projectedFunctionalLoc === AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
