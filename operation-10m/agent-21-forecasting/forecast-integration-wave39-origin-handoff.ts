/**
 * Agent 21 — integration wave-39 origin handoff for O10-210 (read-only round 39).
 */

import { syncAg21Wave39ProjectionBaseline } from './forecast-wave39-projection-sync';
import { handoffAg21IntegrationWave38OriginGate } from './forecast-integration-wave38-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave39OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave39OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave39OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave39ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave38OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave39OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave39OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.13),
      actorDebt: baseCtx.actorDebt + 1135
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave38OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave39ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave39OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw39_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-39 origin handoff ready — Agent 21 unblocks O10-210 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-39 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-39 origin handoff blocked — resolve drift before O10-210';

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
      [`handoff=${handoffId}`, `iw39=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave39OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 85, seed: 72, actorCash: 540, actorDebt: 207, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave39OriginGate(ctx);

  push('iw39_id', handoff.handoffId.startsWith('ag21_iw39_'), handoff.handoffId);
  push('iw39_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw39_copy', handoff.handoffCopy.includes('O10-210'), handoff.handoffCopy.slice(0, 40));
  push('iw39_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
