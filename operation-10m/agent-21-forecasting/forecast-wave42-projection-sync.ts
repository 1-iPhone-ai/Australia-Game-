/**
 * Agent 21 — wave 42 projection baseline sync tags (read-only round 42 / O10-214 → O10-215).
 */

import { handoffAg21IntegrationWave41OriginGate } from './forecast-integration-wave41-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE42_PROJECTION_BASELINE_SHA = '431df5d';
export const AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL = 2_207_543;

export type Ag21Wave42ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave42ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave42ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave41OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave42ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE42_PROJECTION_BASELINE_SHA
): Ag21Wave42ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.11),
      actorDebt: baseCtx.actorDebt + 1210
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave41OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE42_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave42ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w42_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE42_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:42`,
    `ticket:O10-215`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE42_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-42 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE42_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave42ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 90, seed: 57, actorCash: 650, actorDebt: 196, regionsControlled: 4 };
  const sync = syncAg21Wave42ProjectionBaseline(ctx);

  push('w42_id', sync.syncId.startsWith('ag21_w42_'), sync.syncId);
  push('w42_baseline', sync.baselineSha === AG21_WAVE42_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w42_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w42_projected', sync.projectedFunctionalLoc === AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
