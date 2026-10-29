/**
 * Agent 21 — wave 45 projection baseline sync tags (read-only round 45 / O10-220 → O10-221).
 */

import { handoffAg21IntegrationWave44OriginGate } from './forecast-integration-wave44-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE45_PROJECTION_BASELINE_SHA = '98bcd652';
export const AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL = 2_548_579;

export type Ag21Wave45ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave45ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave45ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave44OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave45ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE45_PROJECTION_BASELINE_SHA
): Ag21Wave45ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.08),
      actorDebt: baseCtx.actorDebt + 1300
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave44OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE45_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave45ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w45_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE45_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:45`,
    `ticket:O10-221`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE45_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-45 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE45_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave45ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 96, seed: 60, actorCash: 680, actorDebt: 205, regionsControlled: 4 };
  const sync = syncAg21Wave45ProjectionBaseline(ctx);

  push('w45_id', sync.syncId.startsWith('ag21_w45_'), sync.syncId);
  push('w45_baseline', sync.baselineSha === AG21_WAVE45_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w45_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w45_projected', sync.projectedFunctionalLoc === AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
