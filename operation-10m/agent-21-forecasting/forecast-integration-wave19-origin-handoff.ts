/**
 * Agent 21 — integration wave-19 origin handoff for O10-169 (read-only round 19).
 */

import { syncAg21Wave19ProjectionBaseline } from './forecast-wave19-projection-sync';
import { handoffAg21IntegrationWave18OriginGate } from './forecast-integration-wave18-origin-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave19OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave19OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave19OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave19ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave18OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-168 origin gate handoff for Agent 25 O10-169 dry-run (round 19). */
export function handoffAg21IntegrationWave19OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave19OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.48),
      actorDebt: baseCtx.actorDebt + 535
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave18OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave19ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave19OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw19_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-19 origin handoff ready — Agent 21 unblocks O10-169 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-19 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-19 origin handoff blocked — resolve drift before O10-169';

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
      [`handoff=${handoffId}`, `iw19=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave19OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 45, seed: 31, actorCash: 820, actorDebt: 102, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave19OriginGate(ctx);

  push('iw19_id', handoff.handoffId.startsWith('ag21_iw19_'), handoff.handoffId);
  push('iw19_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw19_copy', handoff.handoffCopy.includes('O10-169'), handoff.handoffCopy.slice(0, 40));
  push('iw19_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
