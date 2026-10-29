/**
 * Agent 21 — integration wave-23 origin handoff for O10-178 (read-only round 23).
 */

import { syncAg21Wave23ProjectionBaseline } from './forecast-wave23-projection-sync';
import { handoffAg21IntegrationWave22OriginGate } from './forecast-integration-wave22-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave23OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave23OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave23OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave23ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave22OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-177 origin gate handoff for Agent 25 O10-178 dry-run (round 23). */
export function handoffAg21IntegrationWave23OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave23OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.4),
      actorDebt: baseCtx.actorDebt + 655
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave22OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave23ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave23OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw23_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-23 origin handoff ready — Agent 21 unblocks O10-178 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-23 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-23 origin handoff blocked — resolve drift before O10-178';

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
      [`handoff=${handoffId}`, `iw23=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave23OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 53, seed: 45, actorCash: 710, actorDebt: 126, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave23OriginGate(ctx);

  push('iw23_id', handoff.handoffId.startsWith('ag21_iw23_'), handoff.handoffId);
  push('iw23_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw23_copy', handoff.handoffCopy.includes('O10-178'), handoff.handoffCopy.slice(0, 40));
  push('iw23_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
