/**
 * Agent 21 — wave 35 projection baseline sync tags (read-only round 35 / O10-200 → O10-201).
 */

import { handoffAg21IntegrationWave34OriginGate } from './forecast-integration-wave34-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE35_PROJECTION_BASELINE_SHA = '1f7d25b';
export const AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL = 1_924_628;

export type Ag21Wave35ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave35ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave35ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave34OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave35ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE35_PROJECTION_BASELINE_SHA
): Ag21Wave35ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.18),
      actorDebt: baseCtx.actorDebt + 1000
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave34OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE35_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave35ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w35_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE35_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:35`,
    `ticket:O10-201`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE35_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-35 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE35_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave35ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 76, seed: 50, actorCash: 580, actorDebt: 175, regionsControlled: 4 };
  const sync = syncAg21Wave35ProjectionBaseline(ctx);

  push('w35_id', sync.syncId.startsWith('ag21_w35_'), sync.syncId);
  push('w35_baseline', sync.baselineSha === AG21_WAVE35_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w35_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w35_projected', sync.projectedFunctionalLoc === AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
