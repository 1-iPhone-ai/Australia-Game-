/**
 * Agent 21 — wave 36 projection baseline sync tags (read-only round 36 / O10-202 → O10-203).
 */

import { handoffAg21IntegrationWave35OriginGate } from './forecast-integration-wave35-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE36_PROJECTION_BASELINE_SHA = 'ea2bb03';
export const AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL = 1_962_828;

export type Ag21Wave36ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave36ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave36ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave35OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave36ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE36_PROJECTION_BASELINE_SHA
): Ag21Wave36ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.17),
      actorDebt: baseCtx.actorDebt + 1030
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave35OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE36_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave36ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w36_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE36_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:36`,
    `ticket:O10-203`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE36_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-36 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE36_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave36ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 78, seed: 51, actorCash: 590, actorDebt: 178, regionsControlled: 4 };
  const sync = syncAg21Wave36ProjectionBaseline(ctx);

  push('w36_id', sync.syncId.startsWith('ag21_w36_'), sync.syncId);
  push('w36_baseline', sync.baselineSha === AG21_WAVE36_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w36_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w36_projected', sync.projectedFunctionalLoc === AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
