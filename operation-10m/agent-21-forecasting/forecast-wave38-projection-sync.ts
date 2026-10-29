/**
 * Agent 21 — wave 38 projection baseline sync tags (read-only round 38 / O10-206 → O10-207).
 */

import { handoffAg21IntegrationWave37OriginGate } from './forecast-integration-wave37-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE38_PROJECTION_BASELINE_SHA = 'b44b36f';
export const AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL = 2_039_227;

export type Ag21Wave38ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave38ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave38ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave37OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave38ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE38_PROJECTION_BASELINE_SHA
): Ag21Wave38ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.15),
      actorDebt: baseCtx.actorDebt + 1090
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave37OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE38_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave38ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w38_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE38_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:38`,
    `ticket:O10-207`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE38_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-38 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE38_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave38ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 82, seed: 53, actorCash: 610, actorDebt: 184, regionsControlled: 4 };
  const sync = syncAg21Wave38ProjectionBaseline(ctx);

  push('w38_id', sync.syncId.startsWith('ag21_w38_'), sync.syncId);
  push('w38_baseline', sync.baselineSha === AG21_WAVE38_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w38_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w38_projected', sync.projectedFunctionalLoc === AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
