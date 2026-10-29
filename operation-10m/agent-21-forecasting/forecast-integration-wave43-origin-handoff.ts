/**
 * Agent 21 — integration wave-43 origin handoff for O10-218 (read-only round 43).
 */

import { syncAg21Wave43ProjectionBaseline } from './forecast-wave43-projection-sync';
import { handoffAg21IntegrationWave42OriginGate } from './forecast-integration-wave42-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave43OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave43OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave43OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave43ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave42OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave43OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave43OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.09),
      actorDebt: baseCtx.actorDebt + 1255
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave42OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave43ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave43OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw43_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-43 origin handoff ready — Agent 21 unblocks O10-218 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-43 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-43 origin handoff blocked — resolve drift before O10-218';

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
      [`handoff=${handoffId}`, `iw43=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave43OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 93, seed: 76, actorCash: 580, actorDebt: 219, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave43OriginGate(ctx);

  push('iw43_id', handoff.handoffId.startsWith('ag21_iw43_'), handoff.handoffId);
  push('iw43_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw43_copy', handoff.handoffCopy.includes('O10-218'), handoff.handoffCopy.slice(0, 40));
  push('iw43_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
