import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ExportManifest } from './export-manifest.ts';
import type { Agent24ImportValidationReport } from './import-validation.ts';
import type { Agent24ReplayScaleWaveDryrunVerificationReport } from './replay-scale-wave-dryrun-verification.ts';

export type Agent24ArchiveScaleWaveFullChunksBlockerKind =
  | 'dryrun_not_verified'
  | 'manifest_incomplete'
  | 'import_not_valid';

export interface Agent24ArchiveScaleWaveFullChunksBlocker {
  kind: Agent24ArchiveScaleWaveFullChunksBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveFullChunksGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  chunksGateOpen: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveFullChunksBlocker[];
  gateScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveFullChunksGateInput {
  matchId: string;
  replayScaleWaveDryrunVerification: Agent24ReplayScaleWaveDryrunVerificationReport;
  exportManifest: Agent24ExportManifest;
  importValidation: Agent24ImportValidationReport;
}

export function buildAgent24ArchiveScaleWaveFullChunksGateReport(
  input: Agent24ArchiveScaleWaveFullChunksGateInput,
): Agent24ArchiveScaleWaveFullChunksGateReport {
  const waveRound = input.replayScaleWaveDryrunVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveFullChunksBlocker[] = [];

  if (!input.replayScaleWaveDryrunVerification.verified) {
    blockers.push({
      kind: 'dryrun_not_verified',
      detail: `Dry-run verification open (${input.replayScaleWaveDryrunVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('aswfc_dryrun', {
        issues: input.replayScaleWaveDryrunVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.exportManifest.complete) {
    blockers.push({
      kind: 'manifest_incomplete',
      detail: `Export manifest incomplete (${input.exportManifest.requiredSectionCount - input.exportManifest.sectionCount} missing)`,
      fingerprint: o6kAgent24Fingerprint('aswfc_manifest', {
        sections: input.exportManifest.sectionCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.importValidation.valid) {
    blockers.push({
      kind: 'import_not_valid',
      detail: `Import validation failed (${input.importValidation.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('aswfc_import', {
        issues: input.importValidation.issueCount,
        wave: waveRound,
      }),
    });
  }

  let gateScore = 100;
  gateScore -= blockers.length * 18;
  gateScore -= Math.max(0, 100 - input.replayScaleWaveDryrunVerification.verificationScore) * 0.08;
  gateScore = Math.max(0, Math.min(100, Math.round(gateScore)));

  const chunksGateOpen = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_full_chunks_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    chunksGateOpen,
    blockerCount: blockers.length,
    blockers,
    gateScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_full_chunks_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      chunksGateOpen,
      gateScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveFullChunksGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const dryrunVerification = {
    reportId: 'dv',
    matchId: 'self',
    waveRound: 27,
    dryrunBaselineSha: '634656bb',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswdv_t22', { v: 2 }),
  };
  const exportManifest = {
    manifestId: 'em',
    matchId: 'self',
    sectionCount: 4,
    requiredSectionCount: 4,
    sections: [],
    compositeBundleFingerprint: o6kAgent24Fingerprint('em_comp', { v: 1 }),
    complete: true,
    deterministicFingerprint: o6kAgent24Fingerprint('em_t22', { v: 1 }),
  };
  const importValidation = {
    reportId: 'iv',
    matchId: 'self',
    valid: true,
    issueCount: 0,
    issues: [],
    validationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('imv_t22', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveFullChunksGateReport({
    matchId: 'self',
    replayScaleWaveDryrunVerification: dryrunVerification,
    exportManifest,
    importValidation,
  });

  return [
    { name: 'chunks_gate_open_when_full_chunks_stack_ready', passed: report.chunksGateOpen && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 27 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveFullChunksGateReport({
          matchId: 'self',
          replayScaleWaveDryrunVerification: dryrunVerification,
          exportManifest,
          importValidation,
        }).deterministicFingerprint,
    },
  ];
}
