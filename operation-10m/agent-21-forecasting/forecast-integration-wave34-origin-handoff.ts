/**
 * Agent 21 — integration wave-34 origin handoff for O10-200 (read-only round 34).
 */

import { syncAg21Wave34ProjectionBaseline } from './forecast-wave34-projection-sync';
import { handoffAg21IntegrationWave33OriginGate } from './forecast-integration-wave33-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave34OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave34OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave34OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave34ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave33OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave34OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave34OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.18),
      actorDebt: baseCtx.actorDebt + 985
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave33OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave34ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave34OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw34_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-34 origin handoff ready — Agent 21 unblocks O10-200 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-34 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-34 origin handoff blocked — resolve drift before O10-200';

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
      [`handoff=${handoffId}`, `iw34=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave34OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 75, seed: 67, actorCash: 490, actorDebt: 192, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave34OriginGate(ctx);

  push('iw34_id', handoff.handoffId.startsWith('ag21_iw34_'), handoff.handoffId);
  push('iw34_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw34_copy', handoff.handoffCopy.includes('O10-200'), handoff.handoffCopy.slice(0, 40));
  push('iw34_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
