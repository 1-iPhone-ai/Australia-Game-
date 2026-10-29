import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveContinuityAttestation } from './archive-continuity-attestation.ts';
import type { Agent24ContinuityExportGateReport } from './continuity-export-gate.ts';
import type { Agent24ExportManifest } from './export-manifest.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export interface Agent24AttestationChainLink {
  linkId: string;
  segment: 'continuity_attestation' | 'export_gate' | 'manifest' | 'snapshot_seal';
  aligned: boolean;
  fingerprint: string;
}

export interface Agent24AttestationChainSeal {
  sealId: string;
  matchId: string;
  chainSealed: boolean;
  linkCount: number;
  alignedLinkCount: number;
  links: Agent24AttestationChainLink[];
  chainScore: number;
  deterministicFingerprint: string;
}

export interface Agent24AttestationChainSealInput {
  matchId: string;
  snapshotSeal: Agent24SnapshotSeal;
  exportManifest: Agent24ExportManifest;
  archiveContinuityAttestation: Agent24ArchiveContinuityAttestation;
  continuityExportGate: Agent24ContinuityExportGateReport;
}

export function buildAgent24AttestationChainSeal(input: Agent24AttestationChainSealInput): Agent24AttestationChainSeal {
  const links: Agent24AttestationChainLink[] = [
    {
      linkId: o6kAgent24Fingerprint('att_chain', { seg: 'continuity_attestation' }),
      segment: 'continuity_attestation',
      aligned: input.archiveContinuityAttestation.status === 'verified',
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('att_chain', { seg: 'export_gate' }),
      segment: 'export_gate',
      aligned: input.continuityExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('att_chain', { seg: 'manifest' }),
      segment: 'manifest',
      aligned:
        input.exportManifest.complete &&
        input.exportManifest.compositeBundleFingerprint === input.snapshotSeal.compositeBundleFingerprint,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('att_chain', { seg: 'snapshot_seal' }),
      segment: 'snapshot_seal',
      aligned: input.snapshotSeal.sealed,
      fingerprint: '',
    },
  ];

  for (const link of links) {
    link.fingerprint = o6kAgent24Fingerprint('att_chain_link', {
      segment: link.segment,
      aligned: link.aligned,
    });
  }

  const alignedLinkCount = links.filter(l => l.aligned).length;

  let chainScore = 100;
  chainScore -= (links.length - alignedLinkCount) * 15;
  if (!input.snapshotSeal.sealed) chainScore -= 10;
  chainScore = Math.max(0, Math.min(100, chainScore));

  const chainSealed =
    input.snapshotSeal.sealed &&
    alignedLinkCount === links.length &&
    input.archiveContinuityAttestation.status === 'verified';

  return {
    sealId: o6kAgent24Fingerprint('attestation_chain_seal', { matchId: input.matchId }),
    matchId: input.matchId,
    chainSealed,
    linkCount: links.length,
    alignedLinkCount,
    links,
    chainScore,
    deterministicFingerprint: o6kAgent24Fingerprint('attestation_chain_seal_body', {
      links: links.map(l => l.fingerprint),
      chainSealed,
      chainScore,
    }),
  };
}

export function runAgent24AttestationChainSealSelfTests(): Array<{ name: string; passed: boolean }> {
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 12,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'comp',
    sealFingerprint: 'sf',
    deterministicFingerprint: o6kAgent24Fingerprint('ss_acs', { v: 1 }),
  };
  const manifest = {
    manifestId: 'm',
    matchId: 'self',
    complete: true,
    compositeBundleFingerprint: 'comp',
    sectionCount: 4,
    sections: [],
    deterministicFingerprint: o6kAgent24Fingerprint('em_acs', { v: 1 }),
  };
  const attestation = {
    attestationId: 'a',
    matchId: 'self',
    status: 'verified' as const,
    restoreCommitOk: true,
    fulfillmentBridgeOk: true,
    ledgerContinuityOk: true,
    attestationScore: 98,
    deterministicFingerprint: o6kAgent24Fingerprint('aca_acs', { v: 1 }),
  };
  const exportGate = {
    reportId: 'g',
    matchId: 'self',
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportGateScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('ceg_acs', { v: 1 }),
  };

  const chain = buildAgent24AttestationChainSeal({
    matchId: 'self',
    snapshotSeal: seal,
    exportManifest: manifest,
    archiveContinuityAttestation: attestation,
    continuityExportGate: exportGate,
  });

  return [
    { name: 'chain_sealed_when_all_links_aligned', passed: chain.chainSealed && chain.alignedLinkCount === 4 },
    {
      name: 'deterministic_fingerprint',
      passed:
        chain.deterministicFingerprint ===
        buildAgent24AttestationChainSeal({
          matchId: 'self',
          snapshotSeal: seal,
          exportManifest: manifest,
          archiveContinuityAttestation: attestation,
          continuityExportGate: exportGate,
        }).deterministicFingerprint,
    },
  ];
}
