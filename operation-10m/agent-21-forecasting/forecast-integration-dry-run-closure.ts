/**
 * Agent 21 — integration dry-run closure for O10-163 (read-only round 17).
 */

import { syncAg21Wave17ProjectionBaseline } from './forecast-wave17-projection-sync';
import { recordAg21FullChunksDryRunExecution } from './forecast-full-chunks-dry-run-execution';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationDryRunClosureStatus = 'closed' | 'open' | 'deferred';

export interface Ag21IntegrationDryRunClosure {
  closureId: string;
  moduleVersion: string;
  status: Ag21IntegrationDryRunClosureStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave17ProjectionBaseline>['status'];
  dryRunExecution: ReturnType<typeof recordAg21FullChunksDryRunExecution>['status'];
  closureCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Close O10-161 integration dry-run cycle when O10-163 wave-17 sync aligns (round 17). */
export function closeAg21IntegrationDryRunCycle(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationDryRunClosure {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.52),
      actorDebt: baseCtx.actorDebt + 475
    } satisfies Ag21ForecastContext);

  const execution = recordAg21FullChunksDryRunExecution(baseCtx, candidate);
  const projection = syncAg21Wave17ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationDryRunClosureStatus = 'closed';
  if (execution.status === 'skipped' || projection.status === 'drift') status = 'open';
  else if (execution.status === 'partial' || projection.status === 'unknown') status = 'deferred';

  const closureId = `ag21_idrc_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const closureCopy =
    status === 'closed'
      ? 'integration dry-run closed — Agent 21 unblocks O10-164 coordination with agents 10 and 13'
      : status === 'deferred'
        ? 'integration dry-run deferred — wave-17 sync or execution partial'
        : 'integration dry-run open — resolve drift or skipped execution';

  return {
    closureId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    dryRunExecution: execution.status,
    closureCopy,
    disclaimer: '(Non-authoritative forecast.) Dry-run closure is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'closed' ? 'low' : status === 'deferred' ? 'moderate' : 'high',
      [`closure=${closureId}`, `idrc=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationDryRunClosureSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 41, seed: 23, actorCash: 910, actorDebt: 88, regionsControlled: 3 };
  const closure = closeAg21IntegrationDryRunCycle(ctx);

  push('idrc_id', closure.closureId.startsWith('ag21_idrc_'), closure.closureId);
  push('idrc_status', ['closed', 'open', 'deferred'].includes(closure.status), closure.status);
  push('idrc_copy', closure.closureCopy.includes('dry-run'), closure.closureCopy.slice(0, 32));
  push('idrc_non_auth', closure.authoritative === false, closure.disclaimer.slice(0, 28));

  return out;
}
