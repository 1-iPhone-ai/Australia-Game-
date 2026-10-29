/**
 * Agent 21 — integration wave-46 origin handoff for O10-224 (read-only round 46).
 */

import { syncAg21Wave46ProjectionBaseline } from './forecast-wave46-projection-sync';
import { handoffAg21IntegrationWave45OriginGate } from './forecast-integration-wave45-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave46OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave46OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave46OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave46ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave45OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave46OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave46OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.06),
      actorDebt: baseCtx.actorDebt + 1345
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave45OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave46ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave46OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw46_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-46 origin handoff ready — Agent 21 unblocks O10-224 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-46 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-46 origin handoff blocked — resolve drift before O10-224';

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
      [`handoff=${handoffId}`, `iw46=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave46OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 99, seed: 79, actorCash: 610, actorDebt: 228, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave46OriginGate(ctx);

  push('iw46_id', handoff.handoffId.startsWith('ag21_iw46_'), handoff.handoffId);
  push('iw46_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw46_copy', handoff.handoffCopy.includes('O10-224'), handoff.handoffCopy.slice(0, 40));
  push('iw46_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
