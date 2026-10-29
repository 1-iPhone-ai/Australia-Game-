/**
 * Agent 21 — wave 49 projection baseline sync tags (read-only round 49 / O10-228 → O10-229).
 */

import { handoffAg21IntegrationWave48OriginGate } from './forecast-integration-wave48-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE49_PROJECTION_BASELINE_SHA = '73e5e01';
export const AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL = 2_727_364;

export type Ag21Wave49ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave49ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave49ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave48OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave49ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE49_PROJECTION_BASELINE_SHA
): Ag21Wave49ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.064),
      actorDebt: baseCtx.actorDebt + 1395
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave48OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE49_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave49ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w49_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE49_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:49`,
    `ticket:O10-229`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE49_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-49 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE49_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave49ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 104, seed: 64, actorCash: 720, actorDebt: 220, regionsControlled: 4 };
  const sync = syncAg21Wave49ProjectionBaseline(ctx);

  push('w49_id', sync.syncId.startsWith('ag21_w49_'), sync.syncId);
  push('w49_baseline', sync.baselineSha === AG21_WAVE49_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w49_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w49_projected', sync.projectedFunctionalLoc === AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
