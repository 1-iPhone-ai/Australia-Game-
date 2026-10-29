/**
 * Agent 21 — integration wave-36 origin handoff for O10-204 (read-only round 36).
 */

import { syncAg21Wave36ProjectionBaseline } from './forecast-wave36-projection-sync';
import { handoffAg21IntegrationWave35OriginGate } from './forecast-integration-wave35-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave36OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave36OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave36OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave36ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave35OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave36OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave36OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.16),
      actorDebt: baseCtx.actorDebt + 1045
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave35OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave36ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave36OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw36_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-36 origin handoff ready — Agent 21 unblocks O10-204 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-36 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-36 origin handoff blocked — resolve drift before O10-204';

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
      [`handoff=${handoffId}`, `iw36=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave36OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 79, seed: 69, actorCash: 510, actorDebt: 198, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave36OriginGate(ctx);

  push('iw36_id', handoff.handoffId.startsWith('ag21_iw36_'), handoff.handoffId);
  push('iw36_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw36_copy', handoff.handoffCopy.includes('O10-204'), handoff.handoffCopy.slice(0, 40));
  push('iw36_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
