/**
 * Agent 21 — integration wave-37 origin handoff for O10-206 (read-only round 37).
 */

import { syncAg21Wave37ProjectionBaseline } from './forecast-wave37-projection-sync';
import { handoffAg21IntegrationWave36OriginGate } from './forecast-integration-wave36-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave37OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave37OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave37OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave37ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave36OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave37OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave37OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.15),
      actorDebt: baseCtx.actorDebt + 1075
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave36OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave37ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave37OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw37_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-37 origin handoff ready — Agent 21 unblocks O10-206 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-37 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-37 origin handoff blocked — resolve drift before O10-206';

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
      [`handoff=${handoffId}`, `iw37=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave37OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 81, seed: 70, actorCash: 520, actorDebt: 201, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave37OriginGate(ctx);

  push('iw37_id', handoff.handoffId.startsWith('ag21_iw37_'), handoff.handoffId);
  push('iw37_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw37_copy', handoff.handoffCopy.includes('O10-206'), handoff.handoffCopy.slice(0, 40));
  push('iw37_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
