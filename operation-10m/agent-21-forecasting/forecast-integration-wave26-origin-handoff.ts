/**
 * Agent 21 — integration wave-26 origin handoff for O10-184 (read-only round 26).
 */

import { syncAg21Wave26ProjectionBaseline } from './forecast-wave26-projection-sync';
import { handoffAg21IntegrationWave25OriginGate } from './forecast-integration-wave25-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave26OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave26OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave26OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave26ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave25OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-183 origin gate handoff for Agent 25 O10-184 dry-run (round 26). */
export function handoffAg21IntegrationWave26OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave26OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.34),
      actorDebt: baseCtx.actorDebt + 745
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave25OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave26ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave26OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw26_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-26 origin handoff ready — Agent 21 unblocks O10-184 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-26 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-26 origin handoff blocked — resolve drift before O10-184';

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
      [`handoff=${handoffId}`, `iw26=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave26OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 59, seed: 51, actorCash: 650, actorDebt: 144, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave26OriginGate(ctx);

  push('iw26_id', handoff.handoffId.startsWith('ag21_iw26_'), handoff.handoffId);
  push('iw26_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw26_copy', handoff.handoffCopy.includes('O10-184'), handoff.handoffCopy.slice(0, 40));
  push('iw26_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
