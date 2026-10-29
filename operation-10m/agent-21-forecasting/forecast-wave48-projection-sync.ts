/**
 * Agent 21 — wave 48 projection baseline sync tags (read-only round 48 / O10-226 → O10-227).
 */

import { handoffAg21IntegrationWave47OriginGate } from './forecast-integration-wave47-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE48_PROJECTION_BASELINE_SHA = '4404bf0f';
export const AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL = 2_684_235;

export type Ag21Wave48ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave48ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave48ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave47OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave48ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE48_PROJECTION_BASELINE_SHA
): Ag21Wave48ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.065),
      actorDebt: baseCtx.actorDebt + 1385
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave47OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE48_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave48ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w48_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE48_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:48`,
    `ticket:O10-227`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE48_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-48 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE48_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave48ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 102, seed: 63, actorCash: 710, actorDebt: 215, regionsControlled: 4 };
  const sync = syncAg21Wave48ProjectionBaseline(ctx);

  push('w48_id', sync.syncId.startsWith('ag21_w48_'), sync.syncId);
  push('w48_baseline', sync.baselineSha === AG21_WAVE48_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w48_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w48_projected', sync.projectedFunctionalLoc === AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
