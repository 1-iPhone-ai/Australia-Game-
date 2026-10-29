/**
 * Agent 21 — integration wave-47 origin handoff for O10-226 (read-only round 47).
 */

import { syncAg21Wave47ProjectionBaseline } from './forecast-wave47-projection-sync';
import { handoffAg21IntegrationWave46OriginGate } from './forecast-integration-wave46-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave47OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave47OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave47OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave47ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave46OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave47OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave47OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.06),
      actorDebt: baseCtx.actorDebt + 1375
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave46OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave47ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave47OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw47_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-47 origin handoff ready — Agent 21 unblocks O10-226 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-47 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-47 origin handoff blocked — resolve drift before O10-226';

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
      [`handoff=${handoffId}`, `iw47=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave47OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 101, seed: 80, actorCash: 620, actorDebt: 230, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave47OriginGate(ctx);

  push('iw47_id', handoff.handoffId.startsWith('ag21_iw47_'), handoff.handoffId);
  push('iw47_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw47_copy', handoff.handoffCopy.includes('O10-226'), handoff.handoffCopy.slice(0, 40));
  push('iw47_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
