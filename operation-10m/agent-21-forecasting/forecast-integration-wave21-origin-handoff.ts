/**
 * Agent 21 — integration wave-21 origin handoff for O10-174 (read-only round 21).
 */

import { syncAg21Wave21ProjectionBaseline } from './forecast-wave21-projection-sync';
import { handoffAg21IntegrationWave20OriginGate } from './forecast-integration-wave20-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave21OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave21OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave21OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave21ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave20OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-173 origin gate handoff for Agent 25 O10-174 dry-run (round 21). */
export function handoffAg21IntegrationWave21OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave21OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.44),
      actorDebt: baseCtx.actorDebt + 595
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave20OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave21ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave21OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw21_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-21 origin handoff ready — Agent 21 unblocks O10-174 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-21 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-21 origin handoff blocked — resolve drift before O10-174';

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
      [`handoff=${handoffId}`, `iw21=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave21OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 49, seed: 41, actorCash: 760, actorDebt: 114, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave21OriginGate(ctx);

  push('iw21_id', handoff.handoffId.startsWith('ag21_iw21_'), handoff.handoffId);
  push('iw21_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw21_copy', handoff.handoffCopy.includes('O10-174'), handoff.handoffCopy.slice(0, 40));
  push('iw21_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
