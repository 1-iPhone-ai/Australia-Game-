/**
 * Agent 21 — integration wave-32 origin handoff for O10-196 (read-only round 32).
 */

import { syncAg21Wave32ProjectionBaseline } from './forecast-wave32-projection-sync';
import { handoffAg21IntegrationWave31OriginGate } from './forecast-integration-wave31-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave32OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave32OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave32OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave32ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave31OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-195 origin gate handoff for Agent 25 O10-196 dry-run (round 32). */
export function handoffAg21IntegrationWave32OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave32OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.22),
      actorDebt: baseCtx.actorDebt + 925
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave31OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave32ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave32OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw32_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-32 origin handoff ready — Agent 21 unblocks O10-196 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-32 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-32 origin handoff blocked — resolve drift before O10-196';

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
      [`handoff=${handoffId}`, `iw32=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave32OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 71, seed: 63, actorCash: 530, actorDebt: 180, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave32OriginGate(ctx);

  push('iw32_id', handoff.handoffId.startsWith('ag21_iw32_'), handoff.handoffId);
  push('iw32_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw32_copy', handoff.handoffCopy.includes('O10-196'), handoff.handoffCopy.slice(0, 40));
  push('iw32_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
