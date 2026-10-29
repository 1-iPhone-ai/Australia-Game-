/**
 * Agent 21 — integration wave-30 origin handoff for O10-192 (read-only round 30).
 */

import { syncAg21Wave30ProjectionBaseline } from './forecast-wave30-projection-sync';
import { handoffAg21IntegrationWave29OriginGate } from './forecast-integration-wave29-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave30OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave30OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave30OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave30ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave29OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-191 origin gate handoff for Agent 25 O10-192 dry-run (round 30). */
export function handoffAg21IntegrationWave30OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave30OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.26),
      actorDebt: baseCtx.actorDebt + 865
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave29OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave30ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave30OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw30_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-30 origin handoff ready — Agent 21 unblocks O10-192 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-30 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-30 origin handoff blocked — resolve drift before O10-192';

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
      [`handoff=${handoffId}`, `iw30=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave30OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 67, seed: 59, actorCash: 570, actorDebt: 168, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave30OriginGate(ctx);

  push('iw30_id', handoff.handoffId.startsWith('ag21_iw30_'), handoff.handoffId);
  push('iw30_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw30_copy', handoff.handoffCopy.includes('O10-192'), handoff.handoffCopy.slice(0, 40));
  push('iw30_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
