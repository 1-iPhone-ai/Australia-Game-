import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24AttestationChainVerificationReport } from './attestation-chain-verification.ts';
import type { Agent24ContinuityExportGateReport } from './continuity-export-gate.ts';
import type { Agent24RestoreCommitAuditReport } from './restore-commit-audit.ts';

export interface Agent24ContinuityExportLedgerEntry {
  entryId: string;
  exportAllowed: boolean;
  commitAuditPassed: boolean;
  chainVerified: boolean;
  recorded: boolean;
  fingerprint: string;
}

export interface Agent24ContinuityExportLedger {
  ledgerId: string;
  matchId: string;
  entryCount: number;
  recordedEntryCount: number;
  ledgerComplete: boolean;
  entries: Agent24ContinuityExportLedgerEntry[];
  ledgerScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ContinuityExportLedgerInput {
  matchId: string;
  currentTurn: number;
  continuityExportGate: Agent24ContinuityExportGateReport;
  restoreCommitAudit: Agent24RestoreCommitAuditReport;
  attestationChainVerification: Agent24AttestationChainVerificationReport;
}

export function buildAgent24ContinuityExportLedger(
  input: Agent24ContinuityExportLedgerInput,
): Agent24ContinuityExportLedger {
  const recorded =
    input.continuityExportGate.exportAllowed &&
    input.restoreCommitAudit.auditPassed &&
    input.attestationChainVerification.verified;

  const entries: Agent24ContinuityExportLedgerEntry[] = [
    {
      entryId: o6kAgent24Fingerprint('continuity_export_ledger_entry', {
        matchId: input.matchId,
        turn: input.currentTurn,
      }),
      exportAllowed: input.continuityExportGate.exportAllowed,
      commitAuditPassed: input.restoreCommitAudit.auditPassed,
      chainVerified: input.attestationChainVerification.verified,
      recorded,
      fingerprint: o6kAgent24Fingerprint('continuity_export_ledger_entry_body', {
        turn: input.currentTurn,
        recorded,
        export: input.continuityExportGate.exportAllowed,
      }),
    },
  ];

  const recordedEntryCount = entries.filter(e => e.recorded).length;

  let ledgerScore = 100;
  if (!input.continuityExportGate.exportAllowed) ledgerScore -= 30;
  if (!input.restoreCommitAudit.auditPassed) ledgerScore -= 25;
  if (!input.attestationChainVerification.verified) ledgerScore -= 25;
  ledgerScore = Math.max(0, Math.min(100, ledgerScore));

  const ledgerComplete = recordedEntryCount === entries.length && recordedEntryCount > 0;

  return {
    ledgerId: o6kAgent24Fingerprint('continuity_export_ledger', { matchId: input.matchId }),
    matchId: input.matchId,
    entryCount: entries.length,
    recordedEntryCount,
    ledgerComplete,
    entries,
    ledgerScore,
    deterministicFingerprint: o6kAgent24Fingerprint('continuity_export_ledger_body', {
      entries: entries.map(e => e.fingerprint),
      ledgerComplete,
      ledgerScore,
    }),
  };
}

export function runAgent24ContinuityExportLedgerSelfTests(): Array<{ name: string; passed: boolean }> {
  const exportGate = {
    reportId: 'g',
    matchId: 'self',
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportGateScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('ceg_led', { v: 1 }),
  };
  const commitAudit = {
    reportId: 'a',
    matchId: 'self',
    auditPassed: true,
    findingCount: 0,
    findings: [],
    auditScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rca_led', { v: 1 }),
  };
  const chainVerification = {
    reportId: 'v',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    alignedLinkCount: 4,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('acv_led', { v: 1 }),
  };

  const ledger = buildAgent24ContinuityExportLedger({
    matchId: 'self',
    currentTurn: 20,
    continuityExportGate: exportGate,
    restoreCommitAudit: commitAudit,
    attestationChainVerification: chainVerification,
  });

  return [
    { name: 'ledger_complete_when_all_gates_pass', passed: ledger.ledgerComplete && ledger.recordedEntryCount === 1 },
    {
      name: 'deterministic_fingerprint',
      passed:
        ledger.deterministicFingerprint ===
        buildAgent24ContinuityExportLedger({
          matchId: 'self',
          currentTurn: 20,
          continuityExportGate: exportGate,
          restoreCommitAudit: commitAudit,
          attestationChainVerification: chainVerification,
        }).deterministicFingerprint,
    },
  ];
}
