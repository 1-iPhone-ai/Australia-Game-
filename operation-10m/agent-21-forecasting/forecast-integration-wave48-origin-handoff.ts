/**
 * Agent 21 — integration wave-48 origin handoff for O10-228 (read-only round 48).
 */

import { syncAg21Wave48ProjectionBaseline } from './forecast-wave48-projection-sync';
import { handoffAg21IntegrationWave47OriginGate } from './forecast-integration-wave47-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave48OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave48OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave48OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave48ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave47OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave48OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave48OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.055),
      actorDebt: baseCtx.actorDebt + 1390
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave47OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave48ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave48OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw48_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-48 origin handoff ready — Agent 21 unblocks O10-228 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-48 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-48 origin handoff blocked — resolve drift before O10-228';

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
      [`handoff=${handoffId}`, `iw48=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave48OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 103, seed: 81, actorCash: 630, actorDebt: 235, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave48OriginGate(ctx);

  push('iw48_id', handoff.handoffId.startsWith('ag21_iw48_'), handoff.handoffId);
  push('iw48_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw48_copy', handoff.handoffCopy.includes('O10-228'), handoff.handoffCopy.slice(0, 40));
  push('iw48_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
