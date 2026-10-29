import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveCompactionPlan } from './archive-compaction.ts';
import type { Agent24ExportManifest } from './export-manifest.ts';
import type { Agent24ImportValidationReport } from './import-validation.ts';
import type { Agent24ReplayTransferGateReport } from './replay-transfer-gate.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export type Agent24SealVerificationIssueKind =
  | 'seal_not_sealed'
  | 'link_mismatch'
  | 'missing_link';

export interface Agent24SealVerificationIssue {
  kind: Agent24SealVerificationIssueKind;
  label: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24SealVerificationReport {
  reportId: string;
  matchId: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24SealVerificationIssue[];
  linkMatchCount: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24SealVerificationInput {
  matchId: string;
  compositeBundleFingerprint: string;
  snapshotSeal: Agent24SnapshotSeal;
  manifest: Agent24ExportManifest;
  importValidation: Agent24ImportValidationReport;
  transferGate: Agent24ReplayTransferGateReport;
  archiveCompaction: Agent24ArchiveCompactionPlan;
}

const LIVE_LINKS: Array<{
  label: string;
  resolve: (input: Agent24SealVerificationInput) => string;
}> = [
  { label: 'composite_bundle', resolve: i => i.compositeBundleFingerprint },
  { label: 'export_manifest', resolve: i => i.manifest.deterministicFingerprint },
  { label: 'import_validation', resolve: i => i.importValidation.deterministicFingerprint },
  { label: 'transfer_gate', resolve: i => i.transferGate.deterministicFingerprint },
  { label: 'archive_compaction', resolve: i => i.archiveCompaction.deterministicFingerprint },
];

export function buildAgent24SealVerificationReport(
  input: Agent24SealVerificationInput,
): Agent24SealVerificationReport {
  const issues: Agent24SealVerificationIssue[] = [];
  let linkMatchCount = 0;

  if (!input.snapshotSeal.sealed) {
    issues.push({
      kind: 'seal_not_sealed',
      label: 'snapshot_seal',
      detail: 'Snapshot seal is not marked sealed',
      fingerprint: o6kAgent24Fingerprint('seal_verify_unsealed', { sealed: false }),
    });
  }

  const sealByLabel = new Map(input.snapshotSeal.links.map(l => [l.label, l.fingerprint]));
  for (const live of LIVE_LINKS) {
    const sealedFp = sealByLabel.get(live.label);
    const liveFp = live.resolve(input);
    if (sealedFp === undefined) {
      issues.push({
        kind: 'missing_link',
        label: live.label,
        detail: `Seal missing link for ${live.label}`,
        fingerprint: o6kAgent24Fingerprint('seal_verify_missing', { label: live.label }),
      });
      continue;
    }
    if (sealedFp !== liveFp) {
      issues.push({
        kind: 'link_mismatch',
        label: live.label,
        detail: `Seal link ${live.label} does not match live fingerprint`,
        fingerprint: o6kAgent24Fingerprint('seal_verify_mismatch', { label: live.label }),
      });
    } else {
      linkMatchCount += 1;
    }
  }

  issues.sort((a, b) => a.label.localeCompare(b.label) || a.kind.localeCompare(b.kind));

  let verificationScore = 100;
  verificationScore -= issues.length * 16;
  if (linkMatchCount < LIVE_LINKS.length) verificationScore -= (LIVE_LINKS.length - linkMatchCount) * 4;
  verificationScore = Math.max(0, Math.min(100, verificationScore));
  const verified = issues.length === 0 && input.snapshotSeal.sealed;

  return {
    reportId: o6kAgent24Fingerprint('seal_verification', { matchId: input.matchId, verified }),
    matchId: input.matchId,
    verified,
    issueCount: issues.length,
    issues,
    linkMatchCount,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('seal_verification_body', {
      issues: issues.map(i => i.fingerprint),
      verified,
      linkMatchCount,
      verificationScore,
    }),
  };
}

export function runAgent24SealVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const composite = o6kAgent24Fingerprint('composite_self', { v: 2 });
  const manifest = {
    manifestId: 'm',
    matchId: 'self',
    sectionCount: 1,
    requiredSectionCount: 1,
    sections: [],
    compositeBundleFingerprint: composite,
    complete: true,
    deterministicFingerprint: o6kAgent24Fingerprint('man_self', { v: 2 }),
  };
  const importOk = {
    reportId: 'i',
    matchId: 'self',
    valid: true,
    issueCount: 0,
    issues: [],
    validationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('imp_self', { v: 2 }),
  };
  const transfer = {
    reportId: 't',
    matchId: 'self',
    transferAllowed: true,
    blockerCount: 0,
    blockers: [],
    transferScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('tg_self', { v: 2 }),
  };
  const compaction = {
    planId: 'c',
    matchId: 'self',
    currentTurn: 10,
    eligibleBandCount: 1,
    protectedBandCount: 1,
    estimatedSlotsReclaimed: 5,
    compactionSafe: true,
    bands: [],
    compactionScore: 90,
    deterministicFingerprint: o6kAgent24Fingerprint('ac_self', { v: 2 }),
  };
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 10,
    sealed: true,
    linkCount: 5,
    links: [
      { label: 'archive_compaction', fingerprint: compaction.deterministicFingerprint },
      { label: 'composite_bundle', fingerprint: composite },
      { label: 'export_manifest', fingerprint: manifest.deterministicFingerprint },
      { label: 'import_validation', fingerprint: importOk.deterministicFingerprint },
      { label: 'transfer_gate', fingerprint: transfer.deterministicFingerprint },
    ],
    compositeBundleFingerprint: composite,
    sealFingerprint: o6kAgent24Fingerprint('chain', { v: 1 }),
    deterministicFingerprint: o6kAgent24Fingerprint('seal_body', { v: 1 }),
  };
  const report = buildAgent24SealVerificationReport({
    matchId: 'self',
    compositeBundleFingerprint: composite,
    snapshotSeal: seal,
    manifest,
    importValidation: importOk,
    transferGate: transfer,
    archiveCompaction: compaction,
  });
  return [
    { name: 'verified_when_links_align', passed: report.verified && report.linkMatchCount === 5 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24SealVerificationReport({
          matchId: 'self',
          compositeBundleFingerprint: composite,
          snapshotSeal: seal,
          manifest,
          importValidation: importOk,
          transferGate: transfer,
          archiveCompaction: compaction,
        }).deterministicFingerprint,
    },
  ];
}
