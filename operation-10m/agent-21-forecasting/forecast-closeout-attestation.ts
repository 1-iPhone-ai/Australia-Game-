/**
 * Agent 21 — closeout attestation from export clearance (read-only round 12).
 */

import { summarizeAg21LabCycleCloseout } from './forecast-lab-cycle-closeout';
import { buildAg21ExportClearance } from './forecast-export-clearance';
import { verifyAg21StagingIntegrity } from './forecast-staging-verification';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21CloseoutAttestationVerdict = 'accepted' | 'qualified' | 'rejected';

export interface Ag21CloseoutAttestation {
  attestationId: string;
  verdict: Ag21CloseoutAttestationVerdict;
  closeoutId: string;
  exportLevel: ReturnType<typeof buildAg21ExportClearance>['level'];
  verificationStatus: ReturnType<typeof verifyAg21StagingIntegrity>['status'];
  rationale: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Attest lab cycle closeout against export + verification gates (round 12). */
export function attestAg21LabCloseout(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21CloseoutAttestation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.72),
      actorDebt: baseCtx.actorDebt + 225
    } satisfies Ag21ForecastContext);

  const closeout = summarizeAg21LabCycleCloseout(baseCtx, candidate);
  const clearance = buildAg21ExportClearance(baseCtx, candidate);
  const verification = verifyAg21StagingIntegrity(baseCtx, candidate);

  let verdict: Ag21CloseoutAttestationVerdict = 'accepted';
  if (clearance.level === 'denied' || verification.status === 'failed') verdict = 'rejected';
  else if (clearance.level === 'conditional' || verification.status === 'warning') verdict = 'qualified';

  const rationale =
    verdict === 'accepted'
      ? 'Closeout aligns with cleared export and verified staging.'
      : verdict === 'qualified'
        ? 'Closeout recorded with conditional export or staging warnings.'
        : 'Closeout rejected — resolve export denial or staging failure first.';

  const attestationId = `ag21_attest_${baseCtx.turn}_${baseCtx.seed}_${verdict}`;

  return {
    attestationId,
    verdict,
    closeoutId: closeout.closeoutId,
    exportLevel: clearance.level,
    verificationStatus: verification.status,
    rationale,
    disclaimer: '(Non-authoritative forecast.) Closeout attestation for operator logs only.',
    overallUncertainty: ag21LabelUncertainty(
      verdict === 'accepted' ? 'low' : verdict === 'qualified' ? 'moderate' : 'high',
      [`verdict=${verdict}`, `export=${clearance.level}`]
    ),
    authoritative: false
  };
}

export function runAg21CloseoutAttestationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 15, seed: 64, actorCash: 920, actorDebt: 115, regionsControlled: 3 };
  const attestation = attestAg21LabCloseout(ctx);

  push('attest_id', attestation.attestationId.startsWith('ag21_attest_'), attestation.attestationId);
  push('attest_verdict', ['accepted', 'qualified', 'rejected'].includes(attestation.verdict), attestation.verdict);
  push('attest_closeout', attestation.closeoutId.startsWith('ag21_closeout_'), attestation.closeoutId);
  push('attest_non_auth', attestation.authoritative === false, attestation.disclaimer.slice(0, 28));

  return out;
}
