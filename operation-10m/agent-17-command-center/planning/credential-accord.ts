import type {
  Agent17AttestationAccordSnapshot,
  Agent17AuditIndexSnapshot,
  Agent17CredentialAccordSnapshot,
  Agent17RegistryIndexSnapshot,
} from '../types/command-center-types.ts';
import { attestationAccordBlocksRegistry } from './attestation-accord.ts';
import { auditIndexBlocksAttestation } from './audit-index.ts';
import { registryIndexBlocksCredential } from './registry-index.ts';

export interface Agent17CredentialAccordInputs {
  registryIndex: Agent17RegistryIndexSnapshot;
  attestationAccord: Agent17AttestationAccordSnapshot;
  auditIndex: Agent17AuditIndexSnapshot;
}

export function buildAgent17CredentialAccord(
  inputs: Agent17CredentialAccordInputs
): Agent17CredentialAccordSnapshot {
  const marks: Agent17CredentialAccordSnapshot['marks'] = [];

  marks.push({
    id: 'registry_canonical',
    label: 'Registry index registry-canonical',
    issued:
      inputs.registryIndex.registryCanonical &&
      !registryIndexBlocksCredential(inputs.registryIndex),
    weight: 30,
  });

  marks.push({
    id: 'registry_band',
    label: 'Registry canonical or provisional',
    issued:
      inputs.registryIndex.band === 'canonical' ||
      inputs.registryIndex.band === 'provisional',
    weight: 25,
  });

  marks.push({
    id: 'attestation_sealed',
    label: 'Attestation accord sealed-ready',
    issued:
      inputs.attestationAccord.attestationSealed &&
      !attestationAccordBlocksRegistry(inputs.attestationAccord),
    weight: 20,
  });

  marks.push({
    id: 'audit_clear',
    label: 'Audit index not blocking attestation',
    issued: !auditIndexBlocksAttestation(inputs.auditIndex),
    weight: 15,
  });

  marks.push({
    id: 'registry_score',
    label: 'Registry score headroom',
    issued: inputs.registryIndex.registryScore >= 29,
    weight: 10,
  });

  const weighted = marks.reduce(
    (n, m) => n + (m.issued ? 100 : 5) * (m.weight / 100),
    0
  );
  const totalWeight = marks.reduce((n, m) => n + m.weight, 0);
  const credentialScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    registryIndexBlocksCredential(inputs.registryIndex) ||
    attestationAccordBlocksRegistry(inputs.attestationAccord) ||
    auditIndexBlocksAttestation(inputs.auditIndex);

  const band: Agent17CredentialAccordSnapshot['band'] = voidSignals
    ? 'void'
    : credentialScore >= 54 &&
        inputs.registryIndex.band === 'canonical' &&
        inputs.attestationAccord.band === 'sealed'
      ? 'issued'
      : 'pending';

  const credentialIssued =
    band === 'issued' &&
    inputs.registryIndex.registryCanonical &&
    !auditIndexBlocksAttestation(inputs.auditIndex);

  return {
    credentialScore,
    band,
    marks,
    registryBand: inputs.registryIndex.band,
    attestationBand: inputs.attestationAccord.band,
    credentialIssued,
    headline: `Credential ${band} (${credentialScore}/100) · ${marks.filter(m => m.issued).length}/${marks.length} marks`,
  };
}

export function credentialAccordBlocksRegistry(snapshot: Agent17CredentialAccordSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.credentialIssued;
}

export function credentialAccordBlocksLedger(snapshot: Agent17CredentialAccordSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.credentialIssued;
}
