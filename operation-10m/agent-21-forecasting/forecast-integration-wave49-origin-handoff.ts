/**
 * Agent 21 — integration wave-49 origin handoff for O10-230 (read-only round 49).
 */

import { syncAg21Wave49ProjectionBaseline } from './forecast-wave49-projection-sync';
import { handoffAg21IntegrationWave48OriginGate } from './forecast-integration-wave48-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave49OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave49OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave49OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave49ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave48OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave49OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave49OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.054),
      actorDebt: baseCtx.actorDebt + 1400
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave48OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave49ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave49OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw49_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-49 origin handoff ready — Agent 21 unblocks O10-230 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-49 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-49 origin handoff blocked — resolve drift before O10-230';

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
      [`handoff=${handoffId}`, `iw49=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave49OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 105, seed: 82, actorCash: 640, actorDebt: 240, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave49OriginGate(ctx);

  push('iw49_id', handoff.handoffId.startsWith('ag21_iw49_'), handoff.handoffId);
  push('iw49_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw49_copy', handoff.handoffCopy.includes('O10-230'), handoff.handoffCopy.slice(0, 40));
  push('iw49_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
