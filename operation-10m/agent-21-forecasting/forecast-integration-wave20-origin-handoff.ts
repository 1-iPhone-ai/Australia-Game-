/**
 * Agent 21 — integration wave-20 origin handoff for O10-171 (read-only round 20).
 */

import { syncAg21Wave20ProjectionBaseline } from './forecast-wave20-projection-sync';
import { handoffAg21IntegrationWave19OriginGate } from './forecast-integration-wave19-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave20OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave20OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave20OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave20ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave19OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-170 origin gate handoff for Agent 25 O10-171 dry-run (round 20). */
export function handoffAg21IntegrationWave20OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave20OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.46),
      actorDebt: baseCtx.actorDebt + 565
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave19OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave20ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave20OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw20_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-20 origin handoff ready — Agent 21 unblocks O10-171 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-20 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-20 origin handoff blocked — resolve drift before O10-171';

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
      [`handoff=${handoffId}`, `iw20=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave20OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 47, seed: 37, actorCash: 790, actorDebt: 108, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave20OriginGate(ctx);

  push('iw20_id', handoff.handoffId.startsWith('ag21_iw20_'), handoff.handoffId);
  push('iw20_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw20_copy', handoff.handoffCopy.includes('O10-171'), handoff.handoffCopy.slice(0, 40));
  push('iw20_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
