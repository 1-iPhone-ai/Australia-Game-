import type {
  Agent17AttestationAccordSnapshot,
  Agent17AuditIndexSnapshot,
  Agent17ComplianceAccordSnapshot,
  Agent17StatuteIndexSnapshot,
} from '../types/command-center-types.ts';
import { auditIndexBlocksAttestation } from './audit-index.ts';
import { complianceAccordBlocksAudit } from './compliance-accord.ts';
import { statuteIndexBlocksCompliance } from './statute-index.ts';

export interface Agent17AttestationAccordInputs {
  auditIndex: Agent17AuditIndexSnapshot;
  complianceAccord: Agent17ComplianceAccordSnapshot;
  statuteIndex: Agent17StatuteIndexSnapshot;
}

export function buildAgent17AttestationAccord(
  inputs: Agent17AttestationAccordInputs
): Agent17AttestationAccordSnapshot {
  const seals: Agent17AttestationAccordSnapshot['seals'] = [];

  seals.push({
    id: 'audit_passed',
    label: 'Audit index audit-passed',
    attested:
      inputs.auditIndex.auditPassed && !auditIndexBlocksAttestation(inputs.auditIndex),
    weight: 30,
  });

  seals.push({
    id: 'audit_band',
    label: 'Audit passed or open',
    attested:
      inputs.auditIndex.band === 'passed' || inputs.auditIndex.band === 'open',
    weight: 25,
  });

  seals.push({
    id: 'compliance_verified',
    label: 'Compliance accord verified-ready',
    attested:
      inputs.complianceAccord.complianceVerified &&
      !complianceAccordBlocksAudit(inputs.complianceAccord),
    weight: 20,
  });

  seals.push({
    id: 'statute_clear',
    label: 'Statute index not blocking compliance',
    attested: !statuteIndexBlocksCompliance(inputs.statuteIndex),
    weight: 15,
  });

  seals.push({
    id: 'audit_score',
    label: 'Audit score headroom',
    attested: inputs.auditIndex.auditScore >= 31,
    weight: 10,
  });

  const weighted = seals.reduce(
    (n, s) => n + (s.attested ? 100 : 5) * (s.weight / 100),
    0
  );
  const totalWeight = seals.reduce((n, s) => n + s.weight, 0);
  const attestationScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    auditIndexBlocksAttestation(inputs.auditIndex) ||
    complianceAccordBlocksAudit(inputs.complianceAccord) ||
    statuteIndexBlocksCompliance(inputs.statuteIndex);

  const band: Agent17AttestationAccordSnapshot['band'] = revokedSignals
    ? 'revoked'
    : attestationScore >= 55 &&
        inputs.auditIndex.band === 'passed' &&
        inputs.complianceAccord.band === 'verified'
      ? 'sealed'
      : 'provisional';

  const attestationSealed =
    band === 'sealed' &&
    inputs.auditIndex.auditPassed &&
    !statuteIndexBlocksCompliance(inputs.statuteIndex);

  return {
    attestationScore,
    band,
    seals,
    auditBand: inputs.auditIndex.band,
    complianceBand: inputs.complianceAccord.band,
    attestationSealed,
    headline: `Attestation ${band} (${attestationScore}/100) · ${seals.filter(s => s.attested).length}/${seals.length} seals`,
  };
}

export function attestationAccordBlocksAudit(snapshot: Agent17AttestationAccordSnapshot): boolean {
  return snapshot.band === 'revoked' || !snapshot.attestationSealed;
}
