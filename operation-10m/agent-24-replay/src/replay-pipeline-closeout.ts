import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveContinuityAttestation } from './archive-continuity-attestation.ts';
import type { Agent24ArchiveHandoffVerificationReport } from './archive-handoff-verification.ts';
import type { Agent24ExportLedgerReconciliationReport } from './export-ledger-reconciliation.ts';

export interface Agent24ReplayPipelineCloseoutCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayPipelineCloseoutReport {
  reportId: string;
  matchId: string;
  currentTurn: number;
  closeoutComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayPipelineCloseoutCheckpoint[];
  closeoutScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayPipelineCloseoutInput {
  matchId: string;
  currentTurn: number;
  archiveContinuityAttestation: Agent24ArchiveContinuityAttestation;
  archiveHandoffVerification: Agent24ArchiveHandoffVerificationReport;
  exportLedgerReconciliation: Agent24ExportLedgerReconciliationReport;
}

export function buildAgent24ReplayPipelineCloseoutReport(
  input: Agent24ReplayPipelineCloseoutInput,
): Agent24ReplayPipelineCloseoutReport {
  const checkpoints: Agent24ReplayPipelineCloseoutCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('closeout_cp', { id: 'continuity_attestation' }),
      label: 'Archive continuity attestation',
      satisfied: input.archiveContinuityAttestation.status === 'verified',
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('closeout_cp', { id: 'handoff_verification' }),
      label: 'Archive handoff verification',
      satisfied: input.archiveHandoffVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('closeout_cp', { id: 'ledger_reconciliation' }),
      label: 'Export ledger reconciliation',
      satisfied: input.exportLedgerReconciliation.reconciled,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('closeout_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let closeoutScore = 100;
  closeoutScore -= (checkpoints.length - satisfiedCheckpointCount) * 22;
  closeoutScore = Math.max(0, Math.min(100, closeoutScore));

  const closeoutComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_pipeline_closeout', {
      matchId: input.matchId,
      turn: input.currentTurn,
    }),
    matchId: input.matchId,
    currentTurn: input.currentTurn,
    closeoutComplete,
    checkpointCount: checkpoints.length,
    satisfiedCheckpointCount,
    checkpoints,
    closeoutScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_pipeline_closeout_body', {
      checkpoints: checkpoints.map(c => c.fingerprint),
      closeoutComplete,
      closeoutScore,
    }),
  };
}

export function runAgent24ReplayPipelineCloseoutSelfTests(): Array<{ name: string; passed: boolean }> {
  const attestation = {
    attestationId: 'a',
    matchId: 'self',
    status: 'verified' as const,
    restoreCommitOk: true,
    fulfillmentBridgeOk: true,
    ledgerContinuityOk: true,
    attestationScore: 98,
    deterministicFingerprint: o6kAgent24Fingerprint('aca_co', { v: 1 }),
  };
  const handoffVerification = {
    reportId: 'hv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    readyLinkCount: 3,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('ahv_co', { v: 1 }),
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
    deterministicFingerprint: o6kAgent24Fingerprint('elr_co', { v: 1 }),
  };

  const report = buildAgent24ReplayPipelineCloseoutReport({
    matchId: 'self',
    currentTurn: 40,
    archiveContinuityAttestation: attestation,
    archiveHandoffVerification: handoffVerification,
    exportLedgerReconciliation: reconciliation,
  });

  return [
    { name: 'closeout_complete_when_checkpoints_satisfied', passed: report.closeoutComplete },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayPipelineCloseoutReport({
          matchId: 'self',
          currentTurn: 40,
          archiveContinuityAttestation: attestation,
          archiveHandoffVerification: handoffVerification,
          exportLedgerReconciliation: reconciliation,
        }).deterministicFingerprint,
    },
  ];
}
