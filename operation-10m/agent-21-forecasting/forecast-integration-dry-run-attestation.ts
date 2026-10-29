/**
 * Agent 21 — integration dry-run attestation for O10-161 (read-only round 16).
 */

import { syncAg21Wave16ProjectionBaseline } from './forecast-wave16-projection-sync';
import { evaluateAg21FullChunksDryRunReadiness } from './forecast-full-chunks-dry-run-readiness';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21IntegrationDryRunAttestationStatus = 'cleared' | 'review' | 'held';

export interface Ag21IntegrationDryRunAttestation {
  attestationId: string;
  moduleVersion: string;
  status: Ag21IntegrationDryRunAttestationStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave16ProjectionBaseline>['status'];
  dryRunReadiness: ReturnType<typeof evaluateAg21FullChunksDryRunReadiness>['status'];
  attestationCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Attest Agent 21 module for post–wave-16 integration dry-run (O10-161 trigger). */
export function attestAg21IntegrationDryRunReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationDryRunAttestation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.56),
      actorDebt: baseCtx.actorDebt + 420
    } satisfies Ag21ForecastContext);

  const readiness = evaluateAg21FullChunksDryRunReadiness(baseCtx, candidate);
  const projection = syncAg21Wave16ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationDryRunAttestationStatus = 'cleared';
  if (readiness.status === 'blocked' || projection.status === 'drift') status = 'held';
  else if (readiness.status === 'conditional' || projection.status === 'unknown') status = 'review';

  const attestationId = `ag21_idra_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const attestationCopy =
    status === 'cleared'
      ? 'integration dry-run attested — Agent 25 may wire chunk in O10-161'
      : status === 'review'
        ? 'integration dry-run review — projection or readiness conditional'
        : 'integration dry-run held — blocked readiness or projection drift';

  return {
    attestationId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    dryRunReadiness: readiness.status,
    attestationCopy,
    disclaimer: '(Non-authoritative forecast.) Integration attestation is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'cleared' ? 'low' : status === 'review' ? 'moderate' : 'high',
      [`attest=${attestationId}`, `idra=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationDryRunAttestationSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 38, seed: 29, actorCash: 880, actorDebt: 95, regionsControlled: 3 };
  const attestation = attestAg21IntegrationDryRunReadiness(ctx);

  push('idra_id', attestation.attestationId.startsWith('ag21_idra_'), attestation.attestationId);
  push('idra_status', ['cleared', 'review', 'held'].includes(attestation.status), attestation.status);
  push('idra_copy', attestation.attestationCopy.includes('dry-run'), attestation.attestationCopy.slice(0, 32));
  push('idra_non_auth', attestation.authoritative === false, attestation.disclaimer.slice(0, 28));

  return out;
}
