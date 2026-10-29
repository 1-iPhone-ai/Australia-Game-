/**
 * Agent 21 — integration wave-45 origin handoff for O10-222 (read-only round 45).
 */

import { syncAg21Wave45ProjectionBaseline } from './forecast-wave45-projection-sync';
import { handoffAg21IntegrationWave44OriginGate } from './forecast-integration-wave44-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave45OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave45OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave45OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave45ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave44OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave45OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave45OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.07),
      actorDebt: baseCtx.actorDebt + 1315
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave44OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave45ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave45OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw45_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-45 origin handoff ready — Agent 21 unblocks O10-222 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-45 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-45 origin handoff blocked — resolve drift before O10-222';

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
      [`handoff=${handoffId}`, `iw45=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave45OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 97, seed: 78, actorCash: 600, actorDebt: 225, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave45OriginGate(ctx);

  push('iw45_id', handoff.handoffId.startsWith('ag21_iw45_'), handoff.handoffId);
  push('iw45_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw45_copy', handoff.handoffCopy.includes('O10-222'), handoff.handoffCopy.slice(0, 40));
  push('iw45_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
