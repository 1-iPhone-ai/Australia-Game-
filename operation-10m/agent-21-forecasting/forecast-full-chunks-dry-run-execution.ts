/**
 * Agent 21 — full-chunks dry-run execution record (read-only round 17 / O10-163).
 */

import { attestAg21IntegrationDryRunReadiness } from './forecast-integration-dry-run-attestation';
import { evaluateAg21FullChunksDryRunReadiness } from './forecast-full-chunks-dry-run-readiness';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21FullChunksDryRunExecutionStatus = 'executed' | 'partial' | 'skipped';

export interface Ag21FullChunksDryRunExecution {
  executionId: string;
  moduleVersion: string;
  status: Ag21FullChunksDryRunExecutionStatus;
  attestationStatus: ReturnType<typeof attestAg21IntegrationDryRunReadiness>['status'];
  dryRunReadiness: ReturnType<typeof evaluateAg21FullChunksDryRunReadiness>['status'];
  operatorCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Record modular full-chunks dry-run execution after O10-161 attestation (round 17 / O10-163). */
export function recordAg21FullChunksDryRunExecution(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21FullChunksDryRunExecution {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.54),
      actorDebt: baseCtx.actorDebt + 445
    } satisfies Ag21ForecastContext);

  const attestation = attestAg21IntegrationDryRunReadiness(baseCtx, candidate);
  const readiness = evaluateAg21FullChunksDryRunReadiness(baseCtx, candidate);

  let status: Ag21FullChunksDryRunExecutionStatus = 'executed';
  if (attestation.status === 'held' || readiness.status === 'blocked') status = 'skipped';
  else if (attestation.status === 'review' || readiness.status === 'conditional') status = 'partial';

  const executionId = `ag21_fcde_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const operatorCopy =
    status === 'executed'
      ? 'full-chunks dry-run executed — O10-163 checkpoint recorded for Agent 25'
      : status === 'partial'
        ? 'full-chunks dry-run partial — conditional attestation or readiness'
        : 'full-chunks dry-run skipped — resolve held attestation before O10-164';

  return {
    executionId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    attestationStatus: attestation.status,
    dryRunReadiness: readiness.status,
    operatorCopy,
    disclaimer: '(Non-authoritative forecast.) Dry-run execution record does not mutate canonical state.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'executed' ? 'low' : status === 'partial' ? 'moderate' : 'high',
      [`execution=${executionId}`, `fcde=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21FullChunksDryRunExecutionSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 39, seed: 17, actorCash: 1420, actorDebt: 52, regionsControlled: 5 };
  const execution = recordAg21FullChunksDryRunExecution(ctx);

  push('fcde_id', execution.executionId.startsWith('ag21_fcde_'), execution.executionId);
  push('fcde_status', ['executed', 'partial', 'skipped'].includes(execution.status), execution.status);
  push('fcde_version', execution.moduleVersion === O10M_AGENT21_MODULE_VERSION, execution.moduleVersion);
  push('fcde_non_auth', execution.authoritative === false, execution.disclaimer.slice(0, 28));

  return out;
}
