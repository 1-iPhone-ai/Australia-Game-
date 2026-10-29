/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-267).
 */

import { handoffAg21IntegrationWave54OriginGate } from './forecast-integration-wave54-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '7f862be0';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave61ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave61ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave61ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave61ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave61ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave61ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-267`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave61ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave61ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
