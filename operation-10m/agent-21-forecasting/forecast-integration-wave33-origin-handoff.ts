/**
 * Agent 21 — integration wave-33 origin handoff for O10-198 (read-only round 33).
 */

import { syncAg21Wave33ProjectionBaseline } from './forecast-wave33-projection-sync';
import { handoffAg21IntegrationWave32OriginGate } from './forecast-integration-wave32-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave33OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave33OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave33OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave33ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave32OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-197 origin gate handoff for Agent 25 O10-198 dry-run (round 33). */
export function handoffAg21IntegrationWave33OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave33OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.2),
      actorDebt: baseCtx.actorDebt + 955
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave32OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave33ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave33OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw33_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-33 origin handoff ready — Agent 21 unblocks O10-198 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-33 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-33 origin handoff blocked — resolve drift before O10-198';

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
      [`handoff=${handoffId}`, `iw33=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave33OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 73, seed: 65, actorCash: 510, actorDebt: 186, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave33OriginGate(ctx);

  push('iw33_id', handoff.handoffId.startsWith('ag21_iw33_'), handoff.handoffId);
  push('iw33_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw33_copy', handoff.handoffCopy.includes('O10-198'), handoff.handoffCopy.slice(0, 40));
  push('iw33_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
