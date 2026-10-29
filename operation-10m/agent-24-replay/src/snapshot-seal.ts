import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveCompactionPlan } from './archive-compaction.ts';
import type { Agent24ExportManifest } from './export-manifest.ts';
import type { Agent24ImportValidationReport } from './import-validation.ts';
import type { Agent24ReplayTransferGateReport } from './replay-transfer-gate.ts';

export interface Agent24SnapshotSealLink {
  label: string;
  fingerprint: string;
}

export interface Agent24SnapshotSeal {
  sealId: string;
  matchId: string;
  turn: number;
  sealed: boolean;
  linkCount: number;
  links: Agent24SnapshotSealLink[];
  compositeBundleFingerprint: string;
  sealFingerprint: string;
  deterministicFingerprint: string;
}

export interface Agent24SnapshotSealInput {
  matchId: string;
  turn: number;
  compositeBundleFingerprint: string;
  manifest: Agent24ExportManifest;
  importValidation: Agent24ImportValidationReport;
  transferGate: Agent24ReplayTransferGateReport;
  archiveCompaction: Agent24ArchiveCompactionPlan;
}

export function buildAgent24SnapshotSeal(input: Agent24SnapshotSealInput): Agent24SnapshotSeal {
  const links: Agent24SnapshotSealLink[] = [
    { label: 'composite_bundle', fingerprint: input.compositeBundleFingerprint },
    { label: 'export_manifest', fingerprint: input.manifest.deterministicFingerprint },
    { label: 'import_validation', fingerprint: input.importValidation.deterministicFingerprint },
    { label: 'transfer_gate', fingerprint: input.transferGate.deterministicFingerprint },
    { label: 'archive_compaction', fingerprint: input.archiveCompaction.deterministicFingerprint },
  ];
  links.sort((a, b) => a.label.localeCompare(b.label));

  const sealed =
    input.importValidation.valid &&
    input.manifest.complete &&
    input.transferGate.transferAllowed &&
    input.archiveCompaction.compactionSafe;

  const sealFingerprint = o6kAgent24Fingerprint('snapshot_seal_chain', {
    links: links.map(l => ({ label: l.label, fp: l.fingerprint })),
    sealed,
  });

  return {
    sealId: o6kAgent24Fingerprint('snapshot_seal', { matchId: input.matchId, turn: input.turn }),
    matchId: input.matchId,
    turn: input.turn,
    sealed,
    linkCount: links.length,
    links,
    compositeBundleFingerprint: input.compositeBundleFingerprint,
    sealFingerprint,
    deterministicFingerprint: o6kAgent24Fingerprint('snapshot_seal_body', {
      sealFingerprint,
      sealed,
      linkCount: links.length,
    }),
  };
}

export function runAgent24SnapshotSealSelfTests(): Array<{ name: string; passed: boolean }> {
  const composite = o6kAgent24Fingerprint('composite_self', { v: 1 });
  const manifest = {
    manifestId: 'm',
    matchId: 'self',
    sectionCount: 1,
    requiredSectionCount: 1,
    sections: [],
    compositeBundleFingerprint: composite,
    complete: true,
    deterministicFingerprint: o6kAgent24Fingerprint('man_self', { v: 1 }),
  };
  const importOk = {
    reportId: 'i',
    matchId: 'self',
    valid: true,
    issueCount: 0,
    issues: [],
    validationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('imp_self', { v: 1 }),
  };
  const transfer = {
    reportId: 't',
    matchId: 'self',
    transferAllowed: true,
    blockerCount: 0,
    blockers: [],
    transferScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('tg_self', { v: 1 }),
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
    deterministicFingerprint: o6kAgent24Fingerprint('ac_self', { v: 1 }),
  };
  const seal = buildAgent24SnapshotSeal({
    matchId: 'self',
    turn: 10,
    compositeBundleFingerprint: composite,
    manifest,
    importValidation: importOk,
    transferGate: transfer,
    archiveCompaction: compaction,
  });
  return [
    { name: 'sealed_when_gates_pass', passed: seal.sealed && seal.linkCount === 5 },
    {
      name: 'deterministic_fingerprint',
      passed:
        seal.deterministicFingerprint ===
        buildAgent24SnapshotSeal({
          matchId: 'self',
          turn: 10,
          compositeBundleFingerprint: composite,
          manifest,
          importValidation: importOk,
          transferGate: transfer,
          archiveCompaction: compaction,
        }).deterministicFingerprint,
    },
  ];
}
