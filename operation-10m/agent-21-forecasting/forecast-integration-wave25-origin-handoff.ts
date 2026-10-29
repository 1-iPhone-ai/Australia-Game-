/**
 * Agent 21 — integration wave-25 origin handoff for O10-182 (read-only round 25).
 */

import { syncAg21Wave25ProjectionBaseline } from './forecast-wave25-projection-sync';
import { handoffAg21IntegrationWave24OriginGate } from './forecast-integration-wave24-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave25OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave25OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave25OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave25ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave24OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-181 origin gate handoff for Agent 25 O10-182 dry-run (round 25). */
export function handoffAg21IntegrationWave25OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave25OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.36),
      actorDebt: baseCtx.actorDebt + 715
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave24OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave25ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave25OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw25_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-25 origin handoff ready — Agent 21 unblocks O10-182 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-25 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-25 origin handoff blocked — resolve drift before O10-182';

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
      [`handoff=${handoffId}`, `iw25=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave25OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 57, seed: 49, actorCash: 670, actorDebt: 138, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave25OriginGate(ctx);

  push('iw25_id', handoff.handoffId.startsWith('ag21_iw25_'), handoff.handoffId);
  push('iw25_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw25_copy', handoff.handoffCopy.includes('O10-182'), handoff.handoffCopy.slice(0, 40));
  push('iw25_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
