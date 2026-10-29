/**
 * Agent 21 — origin gate attestation for Operation 10M scale wave (read-only round 15).
 */

import { runAg21LabGovernanceCheckpoint } from './forecast-lab-governance-checkpoint';
import { buildAg21GovernanceRemediationPlan } from './forecast-governance-remediation-plan';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21OriginGateAttestationStatus = 'ready' | 'conditional' | 'held';

export interface Ag21OriginGateAttestation {
  attestationId: string;
  moduleVersion: string;
  status: Ag21OriginGateAttestationStatus;
  governanceVerdict: ReturnType<typeof runAg21LabGovernanceCheckpoint>['verdict'];
  remediationStatus: ReturnType<typeof buildAg21GovernanceRemediationPlan>['status'];
  originGateCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Attest forecast lab readiness for origin gate push (round 15 / O10-158). */
export function attestAg21OriginGateReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21OriginGateAttestation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.61),
      actorDebt: baseCtx.actorDebt + 325
    } satisfies Ag21ForecastContext);

  const governance = runAg21LabGovernanceCheckpoint(baseCtx, candidate);
  const remediation = buildAg21GovernanceRemediationPlan(baseCtx, candidate);

  let status: Ag21OriginGateAttestationStatus = 'ready';
  if (governance.verdict === 'fail' || remediation.status === 'blocked') status = 'held';
  else if (governance.verdict === 'conditional' || remediation.status === 'planned') {
    status = 'conditional';
  }

  const attestationId = `ag21_origin_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const originGateCopy =
    status === 'ready'
      ? 'origin gate clear — module chunk may publish'
      : status === 'conditional'
        ? 'origin gate conditional — review remediation before push'
        : 'origin gate held — governance or remediation blocked';

  return {
    attestationId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    governanceVerdict: governance.verdict,
    remediationStatus: remediation.status,
    originGateCopy,
    disclaimer: '(Non-authoritative forecast.) Origin gate attestation does not authorize canonical edits.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'conditional' ? 'moderate' : 'high',
      [`attest=${attestationId}`, `gate=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21OriginGateAttestationSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 33, seed: 7, actorCash: 1680, actorDebt: 41, regionsControlled: 5 };
  const attestation = attestAg21OriginGateReadiness(ctx);

  push('origin_id', attestation.attestationId.startsWith('ag21_origin_'), attestation.attestationId);
  push('origin_status', ['ready', 'conditional', 'held'].includes(attestation.status), attestation.status);
  push('origin_version', attestation.moduleVersion === O10M_AGENT21_MODULE_VERSION, attestation.moduleVersion);
  push('origin_non_auth', attestation.authoritative === false, attestation.disclaimer.slice(0, 28));

  return out;
}
