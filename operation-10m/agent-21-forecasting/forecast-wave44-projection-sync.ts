/**
 * Agent 21 — wave 44 projection baseline sync tags (read-only round 44 / O10-218 → O10-219).
 */

import { handoffAg21IntegrationWave43OriginGate } from './forecast-integration-wave43-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE44_PROJECTION_BASELINE_SHA = 'bca7e0a3';
export const AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL = 2_503_353;

export type Ag21Wave44ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave44ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave44ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave43OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave44ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE44_PROJECTION_BASELINE_SHA
): Ag21Wave44ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.09),
      actorDebt: baseCtx.actorDebt + 1270
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave43OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE44_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave44ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w44_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE44_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:44`,
    `ticket:O10-219`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE44_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-44 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE44_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave44ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 94, seed: 59, actorCash: 670, actorDebt: 202, regionsControlled: 4 };
  const sync = syncAg21Wave44ProjectionBaseline(ctx);

  push('w44_id', sync.syncId.startsWith('ag21_w44_'), sync.syncId);
  push('w44_baseline', sync.baselineSha === AG21_WAVE44_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w44_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w44_projected', sync.projectedFunctionalLoc === AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
