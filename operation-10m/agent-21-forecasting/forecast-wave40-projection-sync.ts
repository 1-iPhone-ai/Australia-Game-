/**
 * Agent 21 — wave 40 projection baseline sync tags (read-only round 40 / O10-210 → O10-211).
 */

import { handoffAg21IntegrationWave39OriginGate } from './forecast-integration-wave39-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE40_PROJECTION_BASELINE_SHA = '6f7fa49';
export const AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL = 2_121_263;

export type Ag21Wave40ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave40ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave40ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave39OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave40ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE40_PROJECTION_BASELINE_SHA
): Ag21Wave40ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.13),
      actorDebt: baseCtx.actorDebt + 1150
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave39OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE40_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave40ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w40_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE40_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:40`,
    `ticket:O10-211`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE40_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-40 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE40_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave40ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 86, seed: 55, actorCash: 630, actorDebt: 190, regionsControlled: 4 };
  const sync = syncAg21Wave40ProjectionBaseline(ctx);

  push('w40_id', sync.syncId.startsWith('ag21_w40_'), sync.syncId);
  push('w40_baseline', sync.baselineSha === AG21_WAVE40_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w40_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w40_projected', sync.projectedFunctionalLoc === AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
