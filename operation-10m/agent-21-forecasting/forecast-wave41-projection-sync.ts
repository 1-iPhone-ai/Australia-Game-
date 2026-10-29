/**
 * Agent 21 — wave 41 projection baseline sync tags (read-only round 41 / O10-212 → O10-213).
 */

import { handoffAg21IntegrationWave40OriginGate } from './forecast-integration-wave40-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE41_PROJECTION_BASELINE_SHA = '875d6f3';
export const AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL = 2_165_132;

export type Ag21Wave41ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave41ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave41ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave40OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave41ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE41_PROJECTION_BASELINE_SHA
): Ag21Wave41ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.12),
      actorDebt: baseCtx.actorDebt + 1180
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave40OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE41_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave41ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w41_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE41_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:41`,
    `ticket:O10-213`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE41_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-41 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE41_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave41ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 88, seed: 56, actorCash: 640, actorDebt: 193, regionsControlled: 4 };
  const sync = syncAg21Wave41ProjectionBaseline(ctx);

  push('w41_id', sync.syncId.startsWith('ag21_w41_'), sync.syncId);
  push('w41_baseline', sync.baselineSha === AG21_WAVE41_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w41_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w41_projected', sync.projectedFunctionalLoc === AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
