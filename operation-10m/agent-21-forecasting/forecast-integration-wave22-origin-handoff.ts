/**
 * Agent 21 — integration wave-22 origin handoff for O10-176 (read-only round 22).
 */

import { syncAg21Wave22ProjectionBaseline } from './forecast-wave22-projection-sync';
import { handoffAg21IntegrationWave21OriginGate } from './forecast-integration-wave21-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave22OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave22OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave22OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave22ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave21OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-175 origin gate handoff for Agent 25 O10-176 dry-run (round 22). */
export function handoffAg21IntegrationWave22OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave22OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.42),
      actorDebt: baseCtx.actorDebt + 625
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave21OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave22ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave22OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw22_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-22 origin handoff ready — Agent 21 unblocks O10-176 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-22 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-22 origin handoff blocked — resolve drift before O10-176';

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
      [`handoff=${handoffId}`, `iw22=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave22OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 51, seed: 43, actorCash: 730, actorDebt: 120, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave22OriginGate(ctx);

  push('iw22_id', handoff.handoffId.startsWith('ag21_iw22_'), handoff.handoffId);
  push('iw22_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw22_copy', handoff.handoffCopy.includes('O10-176'), handoff.handoffCopy.slice(0, 40));
  push('iw22_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
