/**
 * Agent 21 — wave 43 projection baseline sync tags (read-only round 43 / O10-216 → O10-217).
 */

import { handoffAg21IntegrationWave42OriginGate } from './forecast-integration-wave42-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE43_PROJECTION_BASELINE_SHA = '641d7d16';
export const AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL = 2_253_960;

export type Ag21Wave43ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave43ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave43ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave42OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave43ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE43_PROJECTION_BASELINE_SHA
): Ag21Wave43ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.1),
      actorDebt: baseCtx.actorDebt + 1240
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave42OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE43_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave43ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w43_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE43_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:43`,
    `ticket:O10-217`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE43_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-43 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE43_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave43ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 92, seed: 58, actorCash: 660, actorDebt: 199, regionsControlled: 4 };
  const sync = syncAg21Wave43ProjectionBaseline(ctx);

  push('w43_id', sync.syncId.startsWith('ag21_w43_'), sync.syncId);
  push('w43_baseline', sync.baselineSha === AG21_WAVE43_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w43_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w43_projected', sync.projectedFunctionalLoc === AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
