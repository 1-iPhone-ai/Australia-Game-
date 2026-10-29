/**
 * Agent 21 — integration wave-31 origin handoff for O10-194 (read-only round 31).
 */

import { syncAg21Wave31ProjectionBaseline } from './forecast-wave31-projection-sync';
import { handoffAg21IntegrationWave30OriginGate } from './forecast-integration-wave30-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave31OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave31OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave31OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave31ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave30OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-193 origin gate handoff for Agent 25 O10-194 dry-run (round 31). */
export function handoffAg21IntegrationWave31OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave31OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.24),
      actorDebt: baseCtx.actorDebt + 895
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave30OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave31ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave31OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw31_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-31 origin handoff ready — Agent 21 unblocks O10-194 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-31 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-31 origin handoff blocked — resolve drift before O10-194';

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
      [`handoff=${handoffId}`, `iw31=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave31OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 69, seed: 61, actorCash: 550, actorDebt: 174, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave31OriginGate(ctx);

  push('iw31_id', handoff.handoffId.startsWith('ag21_iw31_'), handoff.handoffId);
  push('iw31_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw31_copy', handoff.handoffCopy.includes('O10-194'), handoff.handoffCopy.slice(0, 40));
  push('iw31_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
