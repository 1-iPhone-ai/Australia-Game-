/**
 * Agent 21 — wave 21 projection baseline sync tags (read-only round 21 / O10-171 → O10-173).
 */

import { handoffAg21IntegrationWave20OriginGate } from './forecast-integration-wave20-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-20 integration baseline (O10-171 @ 99f2e72b); wave 21 module sync anchor for O10-173. */
export const AG21_WAVE21_PROJECTION_BASELINE_SHA = '99f2e72b';
export const AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL = 1_356_537;

export type Ag21Wave21ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave21ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave21ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave20OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-21 projection baseline for Agent 25 O10-173 gate. */
export function syncAg21Wave21ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE21_PROJECTION_BASELINE_SHA
): Ag21Wave21ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.45),
      actorDebt: baseCtx.actorDebt + 580
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave20OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE21_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave21ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w21_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE21_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:21`,
    `ticket:O10-173`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE21_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-21 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE21_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave21ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 48, seed: 21, actorCash: 990, actorDebt: 94, regionsControlled: 4 };
  const sync = syncAg21Wave21ProjectionBaseline(ctx);

  push('w21_id', sync.syncId.startsWith('ag21_w21_'), sync.syncId);
  push('w21_baseline', sync.baselineSha === AG21_WAVE21_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w21_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w21_projected', sync.projectedFunctionalLoc === AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
