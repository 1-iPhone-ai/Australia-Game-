import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveRoundtripVerificationReport } from './archive-roundtrip-verification.ts';
import type { Agent24AttestationChainSeal } from './attestation-chain-seal.ts';
import type { Agent24ExportLedgerReconciliationReport } from './export-ledger-reconciliation.ts';

export interface Agent24ArchiveHandoffLink {
  linkId: string;
  segment: 'roundtrip_verified' | 'ledger_reconciled' | 'chain_sealed';
  ready: boolean;
  fingerprint: string;
}

export interface Agent24ArchiveHandoffSeal {
  sealId: string;
  matchId: string;
  handoffReady: boolean;
  linkCount: number;
  readyLinkCount: number;
  links: Agent24ArchiveHandoffLink[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveHandoffSealInput {
  matchId: string;
  attestationChainSeal: Agent24AttestationChainSeal;
  archiveRoundtripVerification: Agent24ArchiveRoundtripVerificationReport;
  exportLedgerReconciliation: Agent24ExportLedgerReconciliationReport;
}

export function buildAgent24ArchiveHandoffSeal(input: Agent24ArchiveHandoffSealInput): Agent24ArchiveHandoffSeal {
  const links: Agent24ArchiveHandoffLink[] = [
    {
      linkId: o6kAgent24Fingerprint('handoff_link', { seg: 'roundtrip_verified' }),
      segment: 'roundtrip_verified',
      ready: input.archiveRoundtripVerification.verified,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('handoff_link', { seg: 'ledger_reconciled' }),
      segment: 'ledger_reconciled',
      ready: input.exportLedgerReconciliation.reconciled,
      fingerprint: '',
    },
    {
      linkId: o6kAgent24Fingerprint('handoff_link', { seg: 'chain_sealed' }),
      segment: 'chain_sealed',
      ready: input.attestationChainSeal.chainSealed,
      fingerprint: '',
    },
  ];

  for (const link of links) {
    link.fingerprint = o6kAgent24Fingerprint('handoff_link_body', {
      segment: link.segment,
      ready: link.ready,
    });
  }

  const readyLinkCount = links.filter(l => l.ready).length;

  let handoffScore = 100;
  handoffScore -= (links.length - readyLinkCount) * 18;
  handoffScore = Math.max(0, Math.min(100, handoffScore));

  const handoffReady = readyLinkCount === links.length && links.length > 0;

  return {
    sealId: o6kAgent24Fingerprint('archive_handoff_seal', { matchId: input.matchId }),
    matchId: input.matchId,
    handoffReady,
    linkCount: links.length,
    readyLinkCount,
    links,
    handoffScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_handoff_seal_body', {
      links: links.map(l => l.fingerprint),
      handoffReady,
      handoffScore,
    }),
  };
}

export function runAgent24ArchiveHandoffSealSelfTests(): Array<{ name: string; passed: boolean }> {
  const chainSeal = {
    sealId: 'c',
    matchId: 'self',
    chainSealed: true,
    linkCount: 4,
    alignedLinkCount: 4,
    links: [],
    chainScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('acs_hs', { v: 1 }),
  };
  const roundtripVerification = {
    reportId: 'rv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rtv_hs', { v: 1 }),
  };
  const reconciliation = {
    reportId: 'rec',
    matchId: 'self',
    reconciled: true,
    gapCount: 0,
    gaps: [],
    receiptEntryCount: 1,
    exportLedgerEntryCount: 1,
    reconciliationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('elr_hs', { v: 1 }),
  };

  const seal = buildAgent24ArchiveHandoffSeal({
    matchId: 'self',
    attestationChainSeal: chainSeal,
    archiveRoundtripVerification: roundtripVerification,
    exportLedgerReconciliation: reconciliation,
  });

  return [
    { name: 'handoff_ready_when_all_links_ready', passed: seal.handoffReady && seal.readyLinkCount === 3 },
    {
      name: 'deterministic_fingerprint',
      passed:
        seal.deterministicFingerprint ===
        buildAgent24ArchiveHandoffSeal({
          matchId: 'self',
          attestationChainSeal: chainSeal,
          archiveRoundtripVerification: roundtripVerification,
          exportLedgerReconciliation: reconciliation,
        }).deterministicFingerprint,
    },
  ];
}
