/**
 * Agent 21 — integration wave-44 origin handoff for O10-220 (read-only round 44).
 */

import { syncAg21Wave44ProjectionBaseline } from './forecast-wave44-projection-sync';
import { handoffAg21IntegrationWave43OriginGate } from './forecast-integration-wave43-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave44OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave44OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave44OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave44ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave43OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave44OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave44OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.08),
      actorDebt: baseCtx.actorDebt + 1285
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave43OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave44ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave44OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw44_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-44 origin handoff ready — Agent 21 unblocks O10-220 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-44 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-44 origin handoff blocked — resolve drift before O10-220';

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
      [`handoff=${handoffId}`, `iw44=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave44OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 95, seed: 77, actorCash: 590, actorDebt: 222, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave44OriginGate(ctx);

  push('iw44_id', handoff.handoffId.startsWith('ag21_iw44_'), handoff.handoffId);
  push('iw44_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw44_copy', handoff.handoffCopy.includes('O10-220'), handoff.handoffCopy.slice(0, 40));
  push('iw44_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
