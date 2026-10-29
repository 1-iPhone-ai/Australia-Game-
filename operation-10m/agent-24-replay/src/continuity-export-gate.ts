import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveContinuityAttestation } from './archive-continuity-attestation.ts';
import type { Agent24ExportReadinessReport } from './export-readiness.ts';
import type { Agent24ReplayTransferGateReport } from './replay-transfer-gate.ts';

export interface Agent24ContinuityExportBlocker {
  kind: 'attestation_failed' | 'attestation_partial' | 'export_not_ready' | 'transfer_blocked';
  detail: string;
  fingerprint: string;
}

export interface Agent24ContinuityExportGateReport {
  reportId: string;
  matchId: string;
  exportAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ContinuityExportBlocker[];
  exportGateScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ContinuityExportGateInput {
  matchId: string;
  archiveContinuityAttestation: Agent24ArchiveContinuityAttestation;
  exportReadiness: Agent24ExportReadinessReport;
  replayTransferGate: Agent24ReplayTransferGateReport;
  requireVerifiedAttestation?: boolean;
}

export function buildAgent24ContinuityExportGateReport(
  input: Agent24ContinuityExportGateInput,
): Agent24ContinuityExportGateReport {
  const requireVerified = input.requireVerifiedAttestation ?? true;
  const blockers: Agent24ContinuityExportBlocker[] = [];

  if (input.archiveContinuityAttestation.status === 'failed') {
    blockers.push({
      kind: 'attestation_failed',
      detail: 'Archive continuity attestation failed',
      fingerprint: o6kAgent24Fingerprint('cex_att_failed', { status: 'failed' }),
    });
  } else if (requireVerified && input.archiveContinuityAttestation.status !== 'verified') {
    blockers.push({
      kind: 'attestation_partial',
      detail: `Attestation status ${input.archiveContinuityAttestation.status}`,
      fingerprint: o6kAgent24Fingerprint('cex_att_partial', {
        status: input.archiveContinuityAttestation.status,
      }),
    });
  }
  if (!input.exportReadiness.ready) {
    blockers.push({
      kind: 'export_not_ready',
      detail: `Export readiness score ${input.exportReadiness.readinessScore}`,
      fingerprint: o6kAgent24Fingerprint('cex_export', { ready: false }),
    });
  }
  if (!input.replayTransferGate.transferAllowed) {
    blockers.push({
      kind: 'transfer_blocked',
      detail: `Transfer gate blocked (${input.replayTransferGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('cex_transfer', {
        blockers: input.replayTransferGate.blockerCount,
      }),
    });
  }

  let exportGateScore = 100;
  exportGateScore -= blockers.length * 20;
  exportGateScore -= Math.max(0, 100 - input.archiveContinuityAttestation.attestationScore) * 0.2;
  exportGateScore = Math.max(0, Math.min(100, Math.round(exportGateScore)));

  const exportAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('continuity_export_gate', { matchId: input.matchId }),
    matchId: input.matchId,
    exportAllowed,
    blockerCount: blockers.length,
    blockers,
    exportGateScore,
    deterministicFingerprint: o6kAgent24Fingerprint('continuity_export_gate_body', {
      blockers: blockers.map(b => b.fingerprint),
      exportAllowed,
      exportGateScore,
    }),
  };
}

export function runAgent24ContinuityExportGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const attestation = {
    attestationId: 'a',
    matchId: 'self',
    status: 'verified' as const,
    restoreCommitOk: true,
    fulfillmentBridgeOk: true,
    ledgerContinuityOk: true,
    attestationScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('att_cex', { v: 1 }),
  };
  const exportReady = {
    reportId: 'er',
    matchId: 'self',
    ready: true,
    readinessScore: 95,
    blockers: [],
    deterministicFingerprint: o6kAgent24Fingerprint('er_cex', { v: 1 }),
  };
  const transfer = {
    reportId: 'tg',
    matchId: 'self',
    transferAllowed: true,
    blockerCount: 0,
    blockers: [],
    transferScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('tg_cex', { v: 1 }),
  };

  const report = buildAgent24ContinuityExportGateReport({
    matchId: 'self',
    archiveContinuityAttestation: attestation,
    exportReadiness: exportReady,
    replayTransferGate: transfer,
  });

  return [
    { name: 'export_allowed_when_verified', passed: report.exportAllowed && report.blockerCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ContinuityExportGateReport({
          matchId: 'self',
          archiveContinuityAttestation: attestation,
          exportReadiness: exportReady,
          replayTransferGate: transfer,
        }).deterministicFingerprint,
    },
  ];
}
