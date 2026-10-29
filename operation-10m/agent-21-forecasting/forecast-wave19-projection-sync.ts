/**
 * Agent 21 — wave 19 projection baseline sync tags (read-only round 19 / O10-167 → O10-168).
 */

import { handoffAg21IntegrationWave18OriginGate } from './forecast-integration-wave18-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

/** Post–wave-18 integration baseline (O10-167 @ 7bd7b1f3); wave 19 module sync anchor for O10-168. */
export const AG21_WAVE19_PROJECTION_BASELINE_SHA = '7bd7b1f3';
export const AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL = 1_274_425;

export type Ag21Wave19ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave19ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave19ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave18OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-19 projection baseline for Agent 25 O10-168 gate. */
export function syncAg21Wave19ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE19_PROJECTION_BASELINE_SHA
): Ag21Wave19ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.49),
      actorDebt: baseCtx.actorDebt + 520
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave18OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE19_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave19ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w19_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE19_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:19`,
    `ticket:O10-168`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE19_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-19 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE19_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave19ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 44, seed: 13, actorCash: 1090, actorDebt: 82, regionsControlled: 4 };
  const sync = syncAg21Wave19ProjectionBaseline(ctx);

  push('w19_id', sync.syncId.startsWith('ag21_w19_'), sync.syncId);
  push('w19_baseline', sync.baselineSha === AG21_WAVE19_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w19_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w19_projected', sync.projectedFunctionalLoc === AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
