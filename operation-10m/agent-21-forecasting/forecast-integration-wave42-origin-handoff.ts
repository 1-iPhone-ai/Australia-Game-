/**
 * Agent 21 — integration wave-42 origin handoff for O10-216 (read-only round 42).
 */

import { syncAg21Wave42ProjectionBaseline } from './forecast-wave42-projection-sync';
import { handoffAg21IntegrationWave41OriginGate } from './forecast-integration-wave41-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave42OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave42OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave42OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave42ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave41OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave42OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave42OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.1),
      actorDebt: baseCtx.actorDebt + 1225
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave41OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave42ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave42OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw42_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-42 origin handoff ready — Agent 21 unblocks O10-216 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-42 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-42 origin handoff blocked — resolve drift before O10-216';

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
      [`handoff=${handoffId}`, `iw42=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave42OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 91, seed: 75, actorCash: 570, actorDebt: 216, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave42OriginGate(ctx);

  push('iw42_id', handoff.handoffId.startsWith('ag21_iw42_'), handoff.handoffId);
  push('iw42_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw42_copy', handoff.handoffCopy.includes('O10-216'), handoff.handoffCopy.slice(0, 40));
  push('iw42_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
