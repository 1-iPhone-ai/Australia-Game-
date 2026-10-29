/**
 * Agent 21 — wave 47 projection baseline sync tags (read-only round 47 / O10-224 → O10-225).
 */

import { handoffAg21IntegrationWave46OriginGate } from './forecast-integration-wave46-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE47_PROJECTION_BASELINE_SHA = '456efb9';
export const AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL = 2_637_258;

export type Ag21Wave47ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave47ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave47ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave46OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave47ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE47_PROJECTION_BASELINE_SHA
): Ag21Wave47ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.07),
      actorDebt: baseCtx.actorDebt + 1360
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave46OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE47_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave47ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w47_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE47_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:47`,
    `ticket:O10-225`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE47_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-47 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE47_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave47ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 100, seed: 62, actorCash: 700, actorDebt: 210, regionsControlled: 4 };
  const sync = syncAg21Wave47ProjectionBaseline(ctx);

  push('w47_id', sync.syncId.startsWith('ag21_w47_'), sync.syncId);
  push('w47_baseline', sync.baselineSha === AG21_WAVE47_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w47_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w47_projected', sync.projectedFunctionalLoc === AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
