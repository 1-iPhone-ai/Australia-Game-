/**
 * Agent 21 — integration wave-27 origin handoff for O10-186 (read-only round 27).
 */

import { syncAg21Wave27ProjectionBaseline } from './forecast-wave27-projection-sync';
import { handoffAg21IntegrationWave26OriginGate } from './forecast-integration-wave26-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave27OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave27OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave27OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave27ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave26OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-185 origin gate handoff for Agent 25 O10-186 dry-run (round 27). */
export function handoffAg21IntegrationWave27OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave27OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.32),
      actorDebt: baseCtx.actorDebt + 775
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave26OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave27ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave27OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw27_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-27 origin handoff ready — Agent 21 unblocks O10-186 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-27 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-27 origin handoff blocked — resolve drift before O10-186';

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
      [`handoff=${handoffId}`, `iw27=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave27OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 61, seed: 53, actorCash: 630, actorDebt: 150, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave27OriginGate(ctx);

  push('iw27_id', handoff.handoffId.startsWith('ag21_iw27_'), handoff.handoffId);
  push('iw27_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw27_copy', handoff.handoffCopy.includes('O10-186'), handoff.handoffCopy.slice(0, 40));
  push('iw27_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
