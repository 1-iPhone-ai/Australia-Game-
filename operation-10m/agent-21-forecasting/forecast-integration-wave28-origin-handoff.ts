/**
 * Agent 21 — integration wave-28 origin handoff for O10-188 (read-only round 28).
 */

import { syncAg21Wave28ProjectionBaseline } from './forecast-wave28-projection-sync';
import { handoffAg21IntegrationWave27OriginGate } from './forecast-integration-wave27-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave28OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave28OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave28OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave28ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave27OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-187 origin gate handoff for Agent 25 O10-188 dry-run (round 28). */
export function handoffAg21IntegrationWave28OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave28OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.3),
      actorDebt: baseCtx.actorDebt + 805
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave27OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave28ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave28OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw28_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-28 origin handoff ready — Agent 21 unblocks O10-188 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-28 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-28 origin handoff blocked — resolve drift before O10-188';

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
      [`handoff=${handoffId}`, `iw28=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave28OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 63, seed: 55, actorCash: 610, actorDebt: 156, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave28OriginGate(ctx);

  push('iw28_id', handoff.handoffId.startsWith('ag21_iw28_'), handoff.handoffId);
  push('iw28_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw28_copy', handoff.handoffCopy.includes('O10-188'), handoff.handoffCopy.slice(0, 40));
  push('iw28_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
