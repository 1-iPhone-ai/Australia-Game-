import type {
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTradeDeescalationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { GTEL_PARTNER_DEFS } from './constants.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeReconciliationBand = GTELTradeReconciliationSnapshot['band'];

function reconciliationBand(progress: number): GTELTradeReconciliationBand {
  if (progress >= 0.78) return 'settled';
  if (progress >= 0.52) return 'substantive';
  if (progress >= 0.28) return 'procedural';
  return 'stalled';
}

export function sanitizeReconciliationProgressSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.24), 0.06, 0.92);
}

export function createEmptyTradeReconciliationSnapshot(): GTELTradeReconciliationSnapshot {
  return {
    progress: 0.24,
    band: 'stalled',
    disputeReliefCount: 0,
    reconciledPartnerIds: [],
    summary: 'Dispute panels have not yet produced a reconciliation track.',
  };
}

export function advanceReconciliationProgressSmoothing(
  persisted: GTELPersisted,
  rawProgress: number,
): GTELPersisted {
  const prev = sanitizeReconciliationProgressSmoothing(persisted.reconciliationProgressSmoothing);
  const next = gtelClamp(prev * 0.74 + gtelClamp(rawProgress, 0.06, 0.92) * 0.26, 0.06, 0.92);
  return { ...persisted, reconciliationProgressSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeReconciliationSnapshot(input: {
  openDisputeCount: number;
  complianceScore: number;
  tradeDeescalation: GTELTradeDeescalationSnapshot;
  engagement: GTELDiplomaticEngagementState;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeReconciliationSnapshot; persisted: GTELPersisted } {
  const deescalationLift =
    input.tradeDeescalation.band === 'breakthrough'
      ? 0.28
      : input.tradeDeescalation.band === 'warming'
        ? 0.18
        : input.tradeDeescalation.band === 'thawing'
          ? 0.1
          : 0.02;
  const complianceLift = gtelClamp((input.complianceScore - 0.58) * 0.22, -0.05, 0.14);
  const breakthroughTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'breakthrough' || t.momentum >= 0.7),
  ).length;
  const engagementLift = gtelClamp(breakthroughTracks * 0.08 + input.engagement.summitPulse * 0.12, 0, 0.22);
  const disputeDrag =
    input.openDisputeCount === 0 ? 0 : gtelClamp(0.12 + input.openDisputeCount * 0.09, 0.08, 0.42);
  const rawProgress = gtelClamp(
    0.18 + deescalationLift + complianceLift + engagementLift - disputeDrag,
    0.06,
    0.92,
  );
  const persisted = advanceReconciliationProgressSmoothing(input.persisted, rawProgress);
  const progress = sanitizeReconciliationProgressSmoothing(persisted.reconciliationProgressSmoothing);
  const band = reconciliationBand(progress);
  const disputeReliefCount =
    input.openDisputeCount === 0
      ? 0
      : band === 'settled'
        ? Math.min(input.openDisputeCount, 2)
        : band === 'substantive'
          ? Math.min(input.openDisputeCount, 1)
          : 0;
  const reconciledPartnerIds: GTELPartnerId[] = [];
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const track = input.engagement.tracks?.[p.id];
    if (
      progress > 0.42 &&
      (input.tradeDeescalation.coolingPartnerIds.includes(p.id) ||
        (track && (track.band === 'active' || track.band === 'breakthrough')))
    ) {
      reconciledPartnerIds.push(p.id);
    }
  });

  const summary =
    band === 'settled'
      ? 'Panel findings are closing disputes — compliance monitors are signing off staged relief.'
      : band === 'substantive'
        ? 'Negotiators are exchanging concrete remedies; dispute counts should ease next window.'
        : band === 'procedural'
          ? 'Procedural reconciliation is underway but remedies remain thin.'
          : 'Disputes remain entrenched; reconciliation tracks have not cleared procedural hurdles.';

  return {
    snapshot: {
      progress: Math.round(progress * 1000) / 1000,
      band,
      disputeReliefCount,
      reconciledPartnerIds: reconciledPartnerIds.slice(0, 4),
      summary,
    },
    persisted,
  };
}

export function deriveReconciliationPartnerModifiers(snapshot: GTELTradeReconciliationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStressRelief: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'stalled') {
    return { partnerDeltas, domesticStressRelief: 0 };
  }
  const lift =
    snapshot.band === 'settled' ? 0.08 : snapshot.band === 'substantive' ? 0.05 : 0.03;
  snapshot.reconciledPartnerIds.forEach(id => {
    partnerDeltas[id] = gtelNum(partnerDeltas[id], 0) + lift;
  });
  const domesticStressRelief =
    snapshot.band === 'settled'
      ? gtelClamp(snapshot.progress * 0.06, 0, 0.05)
      : snapshot.band === 'substantive'
        ? gtelClamp(snapshot.progress * 0.04, 0, 0.035)
        : gtelClamp(snapshot.progress * 0.02, 0, 0.02);
  return { partnerDeltas, domesticStressRelief };
}

export function reconciliationEffectiveDisputeCount(
  openDisputeCount: number,
  snapshot: GTELTradeReconciliationSnapshot,
): number {
  return Math.max(0, openDisputeCount - snapshot.disputeReliefCount);
}

export function tradeReconciliationWorldEvent(
  snapshot: GTELTradeReconciliationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'settled' && snapshot.band !== 'substantive') return null;
  if (snapshot.progress < 0.55) return null;
  return {
    id: `gtel_reconciliation_${turn}`,
    turn,
    kind: 'diplomacy',
    title: 'Trade dispute reconciliation advancing',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function tradeReconciliationGiNotes(
  reconciliation: GTELTradeReconciliationSnapshot | null | undefined,
): string[] {
  if (!reconciliation) return [];
  return [
    `Trade reconciliation: ${reconciliation.band.replace(/_/g, ' ')} (${Math.round(reconciliation.progress * 100)}% progress).`,
    reconciliation.summary,
  ];
}
