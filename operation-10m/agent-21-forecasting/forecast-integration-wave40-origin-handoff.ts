/**
 * Agent 21 — integration wave-40 origin handoff for O10-212 (read-only round 40).
 */

import { syncAg21Wave40ProjectionBaseline } from './forecast-wave40-projection-sync';
import { handoffAg21IntegrationWave39OriginGate } from './forecast-integration-wave39-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave40OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave40OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave40OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave40ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave39OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave40OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave40OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.12),
      actorDebt: baseCtx.actorDebt + 1165
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave39OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave40ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave40OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw40_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-40 origin handoff ready — Agent 21 unblocks O10-212 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-40 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-40 origin handoff blocked — resolve drift before O10-212';

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
      [`handoff=${handoffId}`, `iw40=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave40OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 87, seed: 73, actorCash: 550, actorDebt: 210, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave40OriginGate(ctx);

  push('iw40_id', handoff.handoffId.startsWith('ag21_iw40_'), handoff.handoffId);
  push('iw40_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw40_copy', handoff.handoffCopy.includes('O10-212'), handoff.handoffCopy.slice(0, 40));
  push('iw40_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
