import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ExportManifest } from './export-manifest.ts';
import type { Agent24HistoryRetentionReport } from './history-retention.ts';
import type { Agent24ImportValidationReport } from './import-validation.ts';

export type Agent24ReplayTransferBlockerKind =
  | 'import_invalid'
  | 'manifest_incomplete'
  | 'retention_below_threshold'
  | 'no_prune_anchor';

export interface Agent24ReplayTransferBlocker {
  kind: Agent24ReplayTransferBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayTransferGateReport {
  reportId: string;
  matchId: string;
  transferAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ReplayTransferBlocker[];
  transferScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayTransferGateInput {
  matchId: string;
  manifest: Agent24ExportManifest;
  importValidation: Agent24ImportValidationReport;
  historyRetention: Agent24HistoryRetentionReport;
  minRetentionScore?: number;
}

export function buildAgent24ReplayTransferGateReport(
  input: Agent24ReplayTransferGateInput,
): Agent24ReplayTransferGateReport {
  const minRetention = input.minRetentionScore ?? 55;
  const blockers: Agent24ReplayTransferBlocker[] = [];

  if (!input.importValidation.valid) {
    blockers.push({
      kind: 'import_invalid',
      detail: `Import validation failed (${input.importValidation.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('transfer_import', { issues: input.importValidation.issueCount }),
    });
  }
  if (!input.manifest.complete) {
    blockers.push({
      kind: 'manifest_incomplete',
      detail: 'Export manifest incomplete for transfer',
      fingerprint: o6kAgent24Fingerprint('transfer_manifest', { complete: false }),
    });
  }
  if (input.historyRetention.retentionScore < minRetention) {
    blockers.push({
      kind: 'retention_below_threshold',
      detail: `Retention score ${input.historyRetention.retentionScore} below ${minRetention}`,
      fingerprint: o6kAgent24Fingerprint('transfer_retention', {
        score: input.historyRetention.retentionScore,
        min: minRetention,
      }),
    });
  }
  if (input.historyRetention.pruneSafeCutoffTurn <= 0) {
    blockers.push({
      kind: 'no_prune_anchor',
      detail: 'No prune-safe cutoff turn established',
      fingerprint: o6kAgent24Fingerprint('transfer_prune_anchor', { cutoff: 0 }),
    });
  }

  blockers.sort((a, b) => a.kind.localeCompare(b.kind));
  let transferScore = 100;
  transferScore -= blockers.length * 24;
  transferScore = Math.max(0, Math.min(100, transferScore));
  const transferAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('replay_transfer_gate', { matchId: input.matchId, transferAllowed }),
    matchId: input.matchId,
    transferAllowed,
    blockerCount: blockers.length,
    blockers,
    transferScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_transfer_gate_body', {
      blockers: blockers.map(b => b.fingerprint),
      transferAllowed,
      transferScore,
    }),
  };
}

export function runAgent24ReplayTransferGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const manifest = {
    manifestId: 'm',
    matchId: 'self',
    sectionCount: 4,
    requiredSectionCount: 3,
    sections: [{ kind: 'composite_bundle' as const, label: 'c', fingerprint: 'fp', required: true }],
    compositeBundleFingerprint: 'live',
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
  const retention = {
    reportId: 'r',
    matchId: 'self',
    currentTurn: 12,
    retentionWindowTurns: 12,
    pruneSafeCutoffTurn: 8,
    bands: [],
    bandCount: 0,
    retentionScore: 75,
    deterministicFingerprint: o6kAgent24Fingerprint('ret_self', { v: 1 }),
  };
  const gate = buildAgent24ReplayTransferGateReport({
    matchId: 'self',
    manifest,
    importValidation: importOk,
    historyRetention: retention,
  });
  return [
    { name: 'allows_clean_bundle', passed: gate.transferAllowed && gate.blockerCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        gate.deterministicFingerprint ===
        buildAgent24ReplayTransferGateReport({
          matchId: 'self',
          manifest,
          importValidation: importOk,
          historyRetention: retention,
        }).deterministicFingerprint,
    },
  ];
}
