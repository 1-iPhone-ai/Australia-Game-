import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveFulfillmentAuditReport } from './archive-fulfillment-audit.ts';
import type { Agent24LedgerSealContinuityReport } from './ledger-seal-continuity.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export interface Agent24FulfillmentSealBridgeLink {
  bridgeId: string;
  fulfillmentComplete: boolean;
  continuityIntact: boolean;
  sealSealed: boolean;
  bridged: boolean;
  fingerprint: string;
}

export interface Agent24FulfillmentSealBridgeReport {
  reportId: string;
  matchId: string;
  bridgeCount: number;
  bridgedCount: number;
  bridgeReady: boolean;
  links: Agent24FulfillmentSealBridgeLink[];
  bridgeScore: number;
  deterministicFingerprint: string;
}

export interface Agent24FulfillmentSealBridgeInput {
  matchId: string;
  snapshotSeal: Agent24SnapshotSeal;
  fulfillmentAudit: Agent24ArchiveFulfillmentAuditReport;
  ledgerSealContinuity: Agent24LedgerSealContinuityReport;
}

export function buildAgent24FulfillmentSealBridgeReport(
  input: Agent24FulfillmentSealBridgeInput,
): Agent24FulfillmentSealBridgeReport {
  const links: Agent24FulfillmentSealBridgeLink[] = [
    {
      bridgeId: o6kAgent24Fingerprint('fulfillment_seal_bridge', { matchId: input.matchId, idx: 0 }),
      fulfillmentComplete: input.fulfillmentAudit.fulfillmentComplete,
      continuityIntact: input.ledgerSealContinuity.continuityIntact,
      sealSealed: input.snapshotSeal.sealed,
      bridged: false,
      fingerprint: '',
    },
  ];

  for (const link of links) {
    link.bridged =
      link.fulfillmentComplete && link.continuityIntact && link.sealSealed && input.fulfillmentAudit.mismatchCount === 0;
    link.fingerprint = o6kAgent24Fingerprint('fulfillment_seal_bridge_body', {
      fulfillment: link.fulfillmentComplete,
      continuity: link.continuityIntact,
      sealed: link.sealSealed,
      bridged: link.bridged,
    });
  }

  const bridgedCount = links.filter(l => l.bridged).length;

  let bridgeScore = 100;
  if (!input.snapshotSeal.sealed) bridgeScore -= 30;
  if (!input.fulfillmentAudit.fulfillmentComplete) bridgeScore -= 25;
  if (!input.ledgerSealContinuity.continuityIntact) bridgeScore -= 25;
  bridgeScore = Math.max(0, Math.min(100, bridgeScore));

  const bridgeReady = bridgedCount === links.length && links.length > 0;

  return {
    reportId: o6kAgent24Fingerprint('fulfillment_seal_bridge_report', { matchId: input.matchId }),
    matchId: input.matchId,
    bridgeCount: links.length,
    bridgedCount,
    bridgeReady,
    links,
    bridgeScore,
    deterministicFingerprint: o6kAgent24Fingerprint('fulfillment_seal_bridge_report_body', {
      links: links.map(l => l.fingerprint),
      bridgeReady,
      bridgeScore,
    }),
  };
}

export function runAgent24FulfillmentSealBridgeSelfTests(): Array<{ name: string; passed: boolean }> {
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 12,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'c',
    sealFingerprint: 'sf',
    deterministicFingerprint: o6kAgent24Fingerprint('seal_brg', { v: 1 }),
  };
  const fulfillment = {
    reportId: 'fa',
    matchId: 'self',
    dispatchedJobCount: 1,
    ledgerEntryCount: 1,
    alignedPairCount: 1,
    mismatchCount: 0,
    mismatches: [],
    fulfillmentComplete: true,
    fulfillmentScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('fa_brg', { v: 1 }),
  };
  const continuity = {
    reportId: 'lc',
    matchId: 'self',
    linkCount: 1,
    verifiedLinkCount: 1,
    continuityIntact: true,
    links: [],
    continuityScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('lc_brg', { v: 1 }),
  };

  const report = buildAgent24FulfillmentSealBridgeReport({
    matchId: 'self',
    snapshotSeal: seal,
    fulfillmentAudit: fulfillment,
    ledgerSealContinuity: continuity,
  });

  return [
    { name: 'bridge_ready_when_aligned', passed: report.bridgeReady && report.bridgedCount === 1 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24FulfillmentSealBridgeReport({
          matchId: 'self',
          snapshotSeal: seal,
          fulfillmentAudit: fulfillment,
          ledgerSealContinuity: continuity,
        }).deterministicFingerprint,
    },
  ];
}
