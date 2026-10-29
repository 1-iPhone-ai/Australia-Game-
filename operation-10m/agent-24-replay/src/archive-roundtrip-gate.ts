import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ContinuityExportLedger } from './continuity-export-ledger.ts';
import type { Agent24ImportValidationReport } from './import-validation.ts';
import type { Agent24ReplayTransferGateReport } from './replay-transfer-gate.ts';

export type Agent24ArchiveRoundtripBlockerKind =
  | 'ledger_incomplete'
  | 'import_invalid'
  | 'transfer_blocked';

export interface Agent24ArchiveRoundtripBlocker {
  kind: Agent24ArchiveRoundtripBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveRoundtripGateReport {
  reportId: string;
  matchId: string;
  roundtripAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveRoundtripBlocker[];
  roundtripScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveRoundtripGateInput {
  matchId: string;
  continuityExportLedger: Agent24ContinuityExportLedger;
  importValidation: Agent24ImportValidationReport;
  replayTransferGate: Agent24ReplayTransferGateReport;
}

export function buildAgent24ArchiveRoundtripGateReport(
  input: Agent24ArchiveRoundtripGateInput,
): Agent24ArchiveRoundtripGateReport {
  const blockers: Agent24ArchiveRoundtripBlocker[] = [];

  if (!input.continuityExportLedger.ledgerComplete) {
    blockers.push({
      kind: 'ledger_incomplete',
      detail: `Export ledger incomplete (${input.continuityExportLedger.recordedEntryCount}/${input.continuityExportLedger.entryCount} recorded)`,
      fingerprint: o6kAgent24Fingerprint('rt_ledger', {
        recorded: input.continuityExportLedger.recordedEntryCount,
      }),
    });
  }
  if (!input.importValidation.valid) {
    blockers.push({
      kind: 'import_invalid',
      detail: `Import validation failed (${input.importValidation.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rt_import', { issues: input.importValidation.issueCount }),
    });
  }
  if (!input.replayTransferGate.transferAllowed) {
    blockers.push({
      kind: 'transfer_blocked',
      detail: 'Replay transfer gate blocked',
      fingerprint: o6kAgent24Fingerprint('rt_transfer', { allowed: false }),
    });
  }

  let roundtripScore = 100;
  roundtripScore -= blockers.length * 22;
  roundtripScore -= Math.max(0, 100 - input.continuityExportLedger.ledgerScore) * 0.15;
  roundtripScore = Math.max(0, Math.min(100, Math.round(roundtripScore)));

  const roundtripAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_roundtrip_gate', { matchId: input.matchId }),
    matchId: input.matchId,
    roundtripAllowed,
    blockerCount: blockers.length,
    blockers,
    roundtripScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_roundtrip_gate_body', {
      blockers: blockers.map(b => b.fingerprint),
      roundtripAllowed,
      roundtripScore,
    }),
  };
}

export function runAgent24ArchiveRoundtripGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const ledger = {
    ledgerId: 'l',
    matchId: 'self',
    entryCount: 1,
    recordedEntryCount: 1,
    ledgerComplete: true,
    entries: [],
    ledgerScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('cel_rt', { v: 1 }),
  };
  const importValidation = {
    reportId: 'iv',
    matchId: 'self',
    valid: true,
    issueCount: 0,
    issues: [],
    deterministicFingerprint: o6kAgent24Fingerprint('iv_rt', { v: 1 }),
  };
  const transfer = {
    reportId: 'tg',
    matchId: 'self',
    transferAllowed: true,
    blockerCount: 0,
    blockers: [],
    transferScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('tg_rt', { v: 1 }),
  };

  const report = buildAgent24ArchiveRoundtripGateReport({
    matchId: 'self',
    continuityExportLedger: ledger,
    importValidation,
    replayTransferGate: transfer,
  });

  return [
    { name: 'roundtrip_allowed_when_aligned', passed: report.roundtripAllowed && report.blockerCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveRoundtripGateReport({
          matchId: 'self',
          continuityExportLedger: ledger,
          importValidation,
          replayTransferGate: transfer,
        }).deterministicFingerprint,
    },
  ];
}
