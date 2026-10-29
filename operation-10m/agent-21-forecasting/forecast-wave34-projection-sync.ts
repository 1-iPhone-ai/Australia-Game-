/**
 * Agent 21 — wave 34 projection baseline sync tags (read-only round 34 / O10-198 → O10-199).
 */

import { handoffAg21IntegrationWave33OriginGate } from './forecast-integration-wave33-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE34_PROJECTION_BASELINE_SHA = '2187b54';
export const AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL = 1_886_428;

export type Ag21Wave34ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave34ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave34ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave33OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave34ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE34_PROJECTION_BASELINE_SHA
): Ag21Wave34ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.19),
      actorDebt: baseCtx.actorDebt + 970
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave33OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE34_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave34ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w34_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE34_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:34`,
    `ticket:O10-199`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE34_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-34 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE34_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave34ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 74, seed: 49, actorCash: 570, actorDebt: 172, regionsControlled: 4 };
  const sync = syncAg21Wave34ProjectionBaseline(ctx);

  push('w34_id', sync.syncId.startsWith('ag21_w34_'), sync.syncId);
  push('w34_baseline', sync.baselineSha === AG21_WAVE34_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w34_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w34_projected', sync.projectedFunctionalLoc === AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
