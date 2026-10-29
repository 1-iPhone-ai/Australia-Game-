/**
 * Agent 21 — integration wave-18 origin handoff for O10-167 (read-only round 18).
 */

import { syncAg21Wave18ProjectionBaseline } from './forecast-wave18-projection-sync';
import { recordAg21FullChunksDryRunExecution } from './forecast-full-chunks-dry-run-execution';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationWave18OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave18OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave18OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave18ProjectionBaseline>['status'];
  dryRunExecution: ReturnType<typeof recordAg21FullChunksDryRunExecution>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-166 origin gate handoff for Agent 25 O10-167 dry-run (round 18). */
export function handoffAg21IntegrationWave18OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave18OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.5),
      actorDebt: baseCtx.actorDebt + 505
    } satisfies Ag21ForecastContext);

  const execution = recordAg21FullChunksDryRunExecution(baseCtx, candidate);
  const projection = syncAg21Wave18ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave18OriginHandoffStatus = 'ready';
  if (execution.status === 'skipped' || projection.status === 'drift') status = 'blocked';
  else if (execution.status === 'partial' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iwoh_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-18 origin handoff ready — Agent 21 unblocks O10-167 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-18 origin handoff pending — projection sync or execution partial'
        : 'wave-18 origin handoff blocked — resolve drift or skipped execution before O10-167';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    dryRunExecution: execution.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iwoh=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave18OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 43, seed: 29, actorCash: 860, actorDebt: 96, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave18OriginGate(ctx);

  push('iwoh_id', handoff.handoffId.startsWith('ag21_iwoh_'), handoff.handoffId);
  push('iwoh_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iwoh_copy', handoff.handoffCopy.includes('O10-167'), handoff.handoffCopy.slice(0, 40));
  push('iwoh_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
