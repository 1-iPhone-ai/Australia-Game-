/**
 * Agent 21 — integration wave-24 origin handoff for O10-180 (read-only round 24).
 */

import { syncAg21Wave24ProjectionBaseline } from './forecast-wave24-projection-sync';
import { handoffAg21IntegrationWave23OriginGate } from './forecast-integration-wave23-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave24OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave24OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave24OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave24ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave23OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-179 origin gate handoff for Agent 25 O10-180 dry-run (round 24). */
export function handoffAg21IntegrationWave24OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave24OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.38),
      actorDebt: baseCtx.actorDebt + 685
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave23OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave24ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave24OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw24_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-24 origin handoff ready — Agent 21 unblocks O10-180 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-24 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-24 origin handoff blocked — resolve drift before O10-180';

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
      [`handoff=${handoffId}`, `iw24=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave24OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 55, seed: 47, actorCash: 690, actorDebt: 132, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave24OriginGate(ctx);

  push('iw24_id', handoff.handoffId.startsWith('ag21_iw24_'), handoff.handoffId);
  push('iw24_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw24_copy', handoff.handoffCopy.includes('O10-180'), handoff.handoffCopy.slice(0, 40));
  push('iw24_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
