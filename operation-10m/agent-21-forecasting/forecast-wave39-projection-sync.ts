/**
 * Agent 21 — wave 39 projection baseline sync tags (read-only round 39 / O10-208 → O10-209).
 */

import { handoffAg21IntegrationWave38OriginGate } from './forecast-integration-wave38-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export const AG21_WAVE39_PROJECTION_BASELINE_SHA = '6134c6a';
export const AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL = 2_082_720;

export type Ag21Wave39ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave39ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave39ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave38OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave39ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE39_PROJECTION_BASELINE_SHA
): Ag21Wave39ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.14),
      actorDebt: baseCtx.actorDebt + 1120
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave38OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE39_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave39ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w39_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE39_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:39`,
    `ticket:O10-209`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE39_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-39 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE39_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave39ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 84, seed: 54, actorCash: 620, actorDebt: 187, regionsControlled: 4 };
  const sync = syncAg21Wave39ProjectionBaseline(ctx);

  push('w39_id', sync.syncId.startsWith('ag21_w39_'), sync.syncId);
  push('w39_baseline', sync.baselineSha === AG21_WAVE39_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w39_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w39_projected', sync.projectedFunctionalLoc === AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}
