import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ExportReadinessReport } from './export-readiness.ts';
import type { Agent24ReplayScaleWaveIntegrationCloseoutReport } from './replay-scale-wave-integration-closeout.ts';
import type { Agent24ReplayScaleWaveIntegrationVerificationReport } from './replay-scale-wave-integration-verification.ts';

export type Agent24ArchiveScaleWaveExportBlockerKind =
  | 'integration_not_verified'
  | 'export_not_ready'
  | 'integration_closeout_open';

export interface Agent24ArchiveScaleWaveExportBlocker {
  kind: Agent24ArchiveScaleWaveExportBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveExportGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveExportBlocker[];
  exportScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveExportGateInput {
  matchId: string;
  replayScaleWaveIntegrationVerification: Agent24ReplayScaleWaveIntegrationVerificationReport;
  exportReadiness: Agent24ExportReadinessReport;
  replayScaleWaveIntegrationCloseout: Agent24ReplayScaleWaveIntegrationCloseoutReport;
}

export function buildAgent24ArchiveScaleWaveExportGateReport(
  input: Agent24ArchiveScaleWaveExportGateInput,
): Agent24ArchiveScaleWaveExportGateReport {
  const waveRound = input.replayScaleWaveIntegrationVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveExportBlocker[] = [];

  if (!input.replayScaleWaveIntegrationVerification.verified) {
    blockers.push({
      kind: 'integration_not_verified',
      detail: `Integration verification open (${input.replayScaleWaveIntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('asweg_int', {
        issues: input.replayScaleWaveIntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.exportReadiness.ready) {
    blockers.push({
      kind: 'export_not_ready',
      detail: `Export readiness blocked (${input.exportReadiness.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('asweg_export', {
        blockers: input.exportReadiness.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveIntegrationCloseout.closeoutComplete) {
    blockers.push({
      kind: 'integration_closeout_open',
      detail: `Integration closeout incomplete (${input.replayScaleWaveIntegrationCloseout.satisfiedCheckpointCount}/${input.replayScaleWaveIntegrationCloseout.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('asweg_closeout', {
        satisfied: input.replayScaleWaveIntegrationCloseout.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }

  let exportScore = 100;
  exportScore -= blockers.length * 18;
  exportScore -= Math.max(0, 100 - input.exportReadiness.readinessScore) * 0.08;
  exportScore = Math.max(0, Math.min(100, Math.round(exportScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_export_gate', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_export_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const integrationCloseout = {
    reportId: 'ic',
    matchId: 'self',
    waveRound: 25,
    integrationBaselineSha: '680b9954',
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswic_t20', { v: 2 }),
  };
  const integrationVerification = {
    reportId: 'iv',
    matchId: 'self',
    waveRound: 25,
    integrationBaselineSha: '680b9954',
    verified: true,
    issueCount: 0,
    issues: [],
    closeoutScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswiv_t20', { v: 1 }),
  };
  const exportReadiness = {
    reportId: 'er',
    matchId: 'self',
    ready: true,
    blockerCount: 0,
    blockers: [],
    readinessScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('er_t20', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveExportGateReport({
    matchId: 'self',
    replayScaleWaveIntegrationVerification: integrationVerification,
    exportReadiness,
    replayScaleWaveIntegrationCloseout: integrationCloseout,
  });

  return [
    { name: 'export_allowed_when_wave_export_stack_ready', passed: report.exportAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 25 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveExportGateReport({
          matchId: 'self',
          replayScaleWaveIntegrationVerification: integrationVerification,
          exportReadiness,
          replayScaleWaveIntegrationCloseout: integrationCloseout,
        }).deterministicFingerprint,
    },
  ];
}
