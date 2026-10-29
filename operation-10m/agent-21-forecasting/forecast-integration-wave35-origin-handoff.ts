/**
 * Agent 21 — integration wave-35 origin handoff for O10-202 (read-only round 35).
 */

import { syncAg21Wave35ProjectionBaseline } from './forecast-wave35-projection-sync';
import { handoffAg21IntegrationWave34OriginGate } from './forecast-integration-wave34-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave35OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave35OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave35OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave35ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave34OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave35OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave35OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.17),
      actorDebt: baseCtx.actorDebt + 1015
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave34OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave35ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave35OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw35_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-35 origin handoff ready — Agent 21 unblocks O10-202 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-35 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-35 origin handoff blocked — resolve drift before O10-202';

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
      [`handoff=${handoffId}`, `iw35=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave35OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 77, seed: 68, actorCash: 500, actorDebt: 195, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave35OriginGate(ctx);

  push('iw35_id', handoff.handoffId.startsWith('ag21_iw35_'), handoff.handoffId);
  push('iw35_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw35_copy', handoff.handoffCopy.includes('O10-202'), handoff.handoffCopy.slice(0, 40));
  push('iw35_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
