/**
 * Agent 21 — integration wave-51 origin handoff for O10-234 (read-only round 51).
 */

import { syncAg21Wave51ProjectionBaseline } from './forecast-wave51-projection-sync';
import { handoffAg21IntegrationWave50OriginGate } from './forecast-integration-wave50-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave51OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave51OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave51OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave51ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave50OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave51OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave51OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave50OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave51ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave51OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw51_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-51 origin handoff ready — Agent 21 unblocks O10-234 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-51 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-51 origin handoff blocked — resolve drift before O10-234';

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
      [`handoff=${handoffId}`, `iw51=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave51OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave51OriginGate(ctx);

  push('iw51_id', handoff.handoffId.startsWith('ag21_iw51_'), handoff.handoffId);
  push('iw51_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw51_copy', handoff.handoffCopy.includes('O10-234'), handoff.handoffCopy.slice(0, 40));
  push('iw51_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
