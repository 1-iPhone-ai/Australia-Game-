/**
 * Agent 21 — wave 37 projection baseline sync tags (read-only round 37 / O10-204 → O10-205).
 */

import { handoffAg21IntegrationWave36OriginGate } from './forecast-integration-wave36-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE37_PROJECTION_BASELINE_SHA = 'cfb4603';
export const AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL = 2_001_028;

export type Ag21Wave37ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave37ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave37ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave36OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave37ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE37_PROJECTION_BASELINE_SHA
): Ag21Wave37ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.16),
      actorDebt: baseCtx.actorDebt + 1060
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave36OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE37_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave37ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w37_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE37_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:37`,
    `ticket:O10-205`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE37_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-37 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE37_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave37ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 80, seed: 52, actorCash: 600, actorDebt: 181, regionsControlled: 4 };
  const sync = syncAg21Wave37ProjectionBaseline(ctx);

  push('w37_id', sync.syncId.startsWith('ag21_w37_'), sync.syncId);
  push('w37_baseline', sync.baselineSha === AG21_WAVE37_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w37_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w37_projected', sync.projectedFunctionalLoc === AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
