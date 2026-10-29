/**
 * Agent 21 — integration wave-29 origin handoff for O10-190 (read-only round 29).
 */

import { syncAg21Wave29ProjectionBaseline } from './forecast-wave29-projection-sync';
import { handoffAg21IntegrationWave28OriginGate } from './forecast-integration-wave28-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave29OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave29OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave29OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave29ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave28OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-189 origin gate handoff for Agent 25 O10-190 dry-run (round 29). */
export function handoffAg21IntegrationWave29OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave29OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.28),
      actorDebt: baseCtx.actorDebt + 835
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave28OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave29ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave29OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw29_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-29 origin handoff ready — Agent 21 unblocks O10-190 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-29 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-29 origin handoff blocked — resolve drift before O10-190';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw29=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave29OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 65, seed: 57, actorCash: 590, actorDebt: 162, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave29OriginGate(ctx);

  push('iw29_id', handoff.handoffId.startsWith('ag21_iw29_'), handoff.handoffId);
  push('iw29_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw29_copy', handoff.handoffCopy.includes('O10-190'), handoff.handoffCopy.slice(0, 40));
  push('iw29_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
