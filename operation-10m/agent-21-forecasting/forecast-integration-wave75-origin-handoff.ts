/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */

import { syncAg21Wave75ProjectionBaseline } from './forecast-wave75-projection-sync';
import { handoffAg21IntegrationWave54OriginGate } from './forecast-integration-wave54-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave75OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave75OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave75OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave75ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave75OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave75OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave75ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave75OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

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
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave75OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave75OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
