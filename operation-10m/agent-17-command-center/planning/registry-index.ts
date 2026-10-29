import type {
  Agent17AttestationAccordSnapshot,
  Agent17AuditIndexSnapshot,
  Agent17ComplianceAccordSnapshot,
  Agent17RegistryIndexSnapshot,
} from '../types/command-center-types.ts';
import { attestationAccordBlocksRegistry } from './attestation-accord.ts';
import { auditIndexBlocksAttestation } from './audit-index.ts';
import { complianceAccordBlocksAudit } from './compliance-accord.ts';

export interface Agent17RegistryIndexInputs {
  attestationAccord: Agent17AttestationAccordSnapshot;
  auditIndex: Agent17AuditIndexSnapshot;
  complianceAccord: Agent17ComplianceAccordSnapshot;
}

export function buildAgent17RegistryIndex(
  inputs: Agent17RegistryIndexInputs
): Agent17RegistryIndexSnapshot {
  const entries: Agent17RegistryIndexSnapshot['entries'] = [];

  entries.push({
    id: 'attestation_sealed',
    label: 'Attestation accord sealed',
    indexed:
      inputs.attestationAccord.attestationSealed &&
      !attestationAccordBlocksRegistry(inputs.attestationAccord),
    weight: 30,
  });

  entries.push({
    id: 'attestation_band',
    label: 'Attestation sealed or provisional',
    indexed:
      inputs.attestationAccord.band === 'sealed' ||
      inputs.attestationAccord.band === 'provisional',
    weight: 25,
  });

  entries.push({
    id: 'audit_passed',
    label: 'Audit index audit-passed',
    indexed:
      inputs.auditIndex.auditPassed && !auditIndexBlocksAttestation(inputs.auditIndex),
    weight: 20,
  });

  entries.push({
    id: 'compliance_clear',
    label: 'Compliance accord not blocking audit',
    indexed: !complianceAccordBlocksAudit(inputs.complianceAccord),
    weight: 15,
  });

  entries.push({
    id: 'attestation_score',
    label: 'Attestation score headroom',
    indexed: inputs.attestationAccord.attestationScore >= 30,
    weight: 10,
  });

  const weighted = entries.reduce(
    (n, e) => n + (e.indexed ? 100 : 6) * (e.weight / 100),
    0
  );
  const totalWeight = entries.reduce((n, e) => n + e.weight, 0);
  const registryScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const corruptSignals =
    attestationAccordBlocksRegistry(inputs.attestationAccord) ||
    auditIndexBlocksAttestation(inputs.auditIndex) ||
    complianceAccordBlocksAudit(inputs.complianceAccord);

  const band: Agent17RegistryIndexSnapshot['band'] = corruptSignals
    ? 'corrupt'
    : registryScore >= 57 &&
        inputs.attestationAccord.band === 'sealed' &&
        inputs.auditIndex.band === 'passed'
      ? 'canonical'
      : 'provisional';

  const registryCanonical =
    band === 'canonical' &&
    inputs.attestationAccord.attestationSealed &&
    !attestationAccordBlocksRegistry(inputs.attestationAccord);

  return {
    registryScore,
    band,
    entries,
    attestationBand: inputs.attestationAccord.band,
    auditBand: inputs.auditIndex.band,
    registryCanonical,
    headline: `Registry ${band} (${registryScore}/100) · ${entries.filter(e => e.indexed).length}/${entries.length} entries`,
  };
}

export function registryIndexBlocksCredential(snapshot: Agent17RegistryIndexSnapshot): boolean {
  return snapshot.band === 'corrupt' || !snapshot.registryCanonical;
}
