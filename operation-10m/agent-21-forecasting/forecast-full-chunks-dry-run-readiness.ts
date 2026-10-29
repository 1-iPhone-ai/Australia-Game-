/**
 * Agent 21 — full-chunks dry-run readiness (read-only round 16 / O10-161 prep).
 */

import { buildAg21LabStagingPacket } from './forecast-lab-staging-packet';
import { resolveAg21LabContinuityVerdict } from './forecast-lab-continuity-verdict';
import { attestAg21OriginGateReadiness } from './forecast-origin-gate-attestation';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21FullChunksDryRunReadinessStatus = 'ready' | 'conditional' | 'blocked';

export interface Ag21FullChunksDryRunReadiness {
  readinessId: string;
  moduleVersion: string;
  status: Ag21FullChunksDryRunReadinessStatus;
  continuityVerdict: ReturnType<typeof resolveAg21LabContinuityVerdict>['verdict'];
  originGateStatus: ReturnType<typeof attestAg21OriginGateReadiness>['status'];
  stagingPhase: ReturnType<typeof buildAg21LabStagingPacket>['phase'];
  operatorCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Evaluate whether Agent 21 chunk may enter O10-161 full-chunks dry-run (round 16). */
export function evaluateAg21FullChunksDryRunReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21FullChunksDryRunReadiness {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.58),
      actorDebt: baseCtx.actorDebt + 395
    } satisfies Ag21ForecastContext);

  const continuity = resolveAg21LabContinuityVerdict(baseCtx, candidate);
  const origin = attestAg21OriginGateReadiness(baseCtx, candidate);
  const staging = buildAg21LabStagingPacket(baseCtx, candidate);

  let status: Ag21FullChunksDryRunReadinessStatus = 'ready';
  if (
    continuity.verdict === 'broken' ||
    origin.status === 'held' ||
    staging.phase === 'rejected'
  ) {
    status = 'blocked';
  } else if (
    continuity.verdict === 'watch' ||
    origin.status === 'conditional' ||
    staging.phase === 'draft'
  ) {
    status = 'conditional';
  }

  const readinessId = `ag21_fcdr_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const operatorCopy =
    status === 'ready'
      ? 'full-chunks dry-run clear — chunk eligible for O10-161 wiring'
      : status === 'conditional'
        ? 'full-chunks dry-run conditional — review continuity and staging'
        : 'full-chunks dry-run blocked — resolve governance before assembly';

  return {
    readinessId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    continuityVerdict: continuity.verdict,
    originGateStatus: origin.status,
    stagingPhase: staging.phase,
    operatorCopy,
    disclaimer: '(Non-authoritative forecast.) Dry-run readiness does not authorize canonical edits.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'conditional' ? 'moderate' : 'high',
      [`readiness=${readinessId}`, `dry_run=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21FullChunksDryRunReadinessSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 36, seed: 11, actorCash: 1510, actorDebt: 47, regionsControlled: 5 };
  const readiness = evaluateAg21FullChunksDryRunReadiness(ctx);

  push('fcdr_id', readiness.readinessId.startsWith('ag21_fcdr_'), readiness.readinessId);
  push('fcdr_status', ['ready', 'conditional', 'blocked'].includes(readiness.status), readiness.status);
  push('fcdr_version', readiness.moduleVersion === O10M_AGENT21_MODULE_VERSION, readiness.moduleVersion);
  push('fcdr_non_auth', readiness.authoritative === false, readiness.disclaimer.slice(0, 28));

  return out;
}
