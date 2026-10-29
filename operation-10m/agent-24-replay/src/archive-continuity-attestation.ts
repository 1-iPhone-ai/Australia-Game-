import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24FulfillmentSealBridgeReport } from './fulfillment-seal-bridge.ts';
import type { Agent24LedgerSealContinuityReport } from './ledger-seal-continuity.ts';
import type { Agent24RestoreCommitRecord } from './restore-commit-record.ts';

export type Agent24ArchiveContinuityAttestationStatus = 'verified' | 'partial' | 'failed';

export interface Agent24ArchiveContinuityAttestation {
  attestationId: string;
  matchId: string;
  status: Agent24ArchiveContinuityAttestationStatus;
  restoreCommitOk: boolean;
  fulfillmentBridgeOk: boolean;
  ledgerContinuityOk: boolean;
  attestationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveContinuityAttestationInput {
  matchId: string;
  restoreCommitRecord: Agent24RestoreCommitRecord;
  fulfillmentSealBridge: Agent24FulfillmentSealBridgeReport;
  ledgerSealContinuity: Agent24LedgerSealContinuityReport;
  minContinuityScore?: number;
}

export function buildAgent24ArchiveContinuityAttestation(
  input: Agent24ArchiveContinuityAttestationInput,
): Agent24ArchiveContinuityAttestation {
  const minScore = input.minContinuityScore ?? 70;

  const restoreCommitOk = input.restoreCommitRecord.commitAllowed && input.restoreCommitRecord.commitScore >= minScore;
  const fulfillmentBridgeOk = input.fulfillmentSealBridge.bridgeReady && input.fulfillmentSealBridge.bridgeScore >= minScore;
  const ledgerContinuityOk =
    input.ledgerSealContinuity.continuityIntact && input.ledgerSealContinuity.continuityScore >= minScore;

  let attestationScore = 100;
  if (!restoreCommitOk) attestationScore -= 25;
  if (!fulfillmentBridgeOk) attestationScore -= 35;
  if (!ledgerContinuityOk) attestationScore -= 25;
  attestationScore = Math.max(0, Math.min(100, attestationScore));

  let status: Agent24ArchiveContinuityAttestationStatus = 'failed';
  if (restoreCommitOk && fulfillmentBridgeOk && ledgerContinuityOk) status = 'verified';
  else if (attestationScore >= minScore) status = 'partial';

  return {
    attestationId: o6kAgent24Fingerprint('archive_continuity_attestation', { matchId: input.matchId }),
    matchId: input.matchId,
    status,
    restoreCommitOk,
    fulfillmentBridgeOk,
    ledgerContinuityOk,
    attestationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_continuity_attestation_body', {
      status,
      restoreCommitOk,
      fulfillmentBridgeOk,
      ledgerContinuityOk,
      attestationScore,
    }),
  };
}

export function runAgent24ArchiveContinuityAttestationSelfTests(): Array<{ name: string; passed: boolean }> {
  const restoreCommit = {
    recordId: 'rc',
    matchId: 'self',
    currentTurn: 16,
    commitAllowed: true,
    anchorTurn: 10,
    committedStepCount: 3,
    steps: [],
    commitScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('rc_att', { v: 1 }),
  };
  const bridge = {
    reportId: 'b',
    matchId: 'self',
    bridgeCount: 1,
    bridgedCount: 1,
    bridgeReady: true,
    links: [],
    bridgeScore: 92,
    deterministicFingerprint: o6kAgent24Fingerprint('br_att', { v: 1 }),
  };
  const continuity = {
    reportId: 'lc',
    matchId: 'self',
    linkCount: 1,
    verifiedLinkCount: 1,
    continuityIntact: true,
    links: [],
    continuityScore: 90,
    deterministicFingerprint: o6kAgent24Fingerprint('lc_att', { v: 1 }),
  };

  const att = buildAgent24ArchiveContinuityAttestation({
    matchId: 'self',
    restoreCommitRecord: restoreCommit,
    fulfillmentSealBridge: bridge,
    ledgerSealContinuity: continuity,
  });

  return [
    { name: 'verified_when_all_ok', passed: att.status === 'verified' && att.attestationScore >= 90 },
    {
      name: 'deterministic_fingerprint',
      passed:
        att.deterministicFingerprint ===
        buildAgent24ArchiveContinuityAttestation({
          matchId: 'self',
          restoreCommitRecord: restoreCommit,
          fulfillmentSealBridge: bridge,
          ledgerSealContinuity: continuity,
        }).deterministicFingerprint,
    },
  ];
}
