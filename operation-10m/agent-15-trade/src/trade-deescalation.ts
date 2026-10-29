import type {
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTradeDeescalationSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { GTEL_PARTNER_DEFS } from './constants.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeDeescalationBand = GTELTradeDeescalationSnapshot['band'];

function deescalationBand(momentum: number): GTELTradeDeescalationBand {
  if (momentum >= 0.72) return 'breakthrough';
  if (momentum >= 0.52) return 'warming';
  if (momentum >= 0.32) return 'thawing';
  return 'stalled';
}

export function sanitizeDeescalationMomentumSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.28), 0.08, 0.92);
}

export function createEmptyTradeDeescalationSnapshot(): GTELTradeDeescalationSnapshot {
  return {
    momentum: 0.28,
    band: 'stalled',
    coolingPartnerIds: [],
    retaliationAttenuation: 0,
    summary: 'Diplomatic cooling lanes are not yet absorbing retaliation pressure.',
  };
}

export function advanceDeescalationMomentumSmoothing(
  persisted: GTELPersisted,
  rawMomentum: number,
): GTELPersisted {
  const prev = sanitizeDeescalationMomentumSmoothing(persisted.deescalationMomentumSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawMomentum, 0.08, 0.92) * 0.28, 0.08, 0.92);
  return { ...persisted, deescalationMomentumSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeDeescalationSnapshot(input: {
  openDisputeCount: number;
  engagement: GTELDiplomaticEngagementState;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  complianceScore: number;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeDeescalationSnapshot; persisted: GTELPersisted } {
  const breakthroughTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'breakthrough' || t.momentum >= 0.72),
  ).length;
  const activeTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'active' || t.momentum >= 0.45),
  ).length;
  const summitLift = gtelClamp(input.engagement.summitPulse * 0.22, 0, 0.18);
  const engagementLift = gtelClamp(breakthroughTracks * 0.14 + activeTracks * 0.06, 0, 0.32);
  const disputeDrag = gtelClamp(input.openDisputeCount * 0.11, 0, 0.38);
  const retaliationDrag =
    input.tradeRetaliation.band === 'escalating'
      ? 0.12
      : input.tradeRetaliation.band === 'active'
        ? 0.08
        : 0.03;
  const complianceLift = gtelClamp((input.complianceScore - 0.55) * 0.18, -0.06, 0.12);
  const rawMomentum = gtelClamp(
    0.22 + summitLift + engagementLift + complianceLift - disputeDrag - retaliationDrag,
    0.08,
    0.92,
  );
  const persisted = advanceDeescalationMomentumSmoothing(input.persisted, rawMomentum);
  const momentum = sanitizeDeescalationMomentumSmoothing(persisted.deescalationMomentumSmoothing);
  const band = deescalationBand(momentum);
  const coolingPartnerIds: GTELPartnerId[] = [];
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const track = input.engagement.tracks?.[p.id];
    if (track && (track.band === 'breakthrough' || track.band === 'active') && momentum > 0.38) {
      coolingPartnerIds.push(p.id);
    }
  });
  const retaliationAttenuation =
    band === 'breakthrough'
      ? gtelClamp(input.tradeRetaliation.intensity * 0.35, 0, 0.22)
      : band === 'warming'
        ? gtelClamp(input.tradeRetaliation.intensity * 0.22, 0, 0.14)
        : band === 'thawing'
          ? gtelClamp(input.tradeRetaliation.intensity * 0.12, 0, 0.08)
          : 0;

  const summary =
    band === 'breakthrough'
      ? 'Summit momentum is unwinding retaliation — partner gates are reopening on priority lanes.'
      : band === 'warming'
        ? 'Confidence-building measures are offsetting part of the counter-tariff stack.'
        : band === 'thawing'
          ? 'Quiet diplomacy is easing rhetoric, but retaliation measures remain on the books.'
          : 'Retaliation and disputes dominate; de-escalation tracks have not gained traction.';

  return {
    snapshot: {
      momentum: Math.round(momentum * 1000) / 1000,
      band,
      coolingPartnerIds: coolingPartnerIds.slice(0, 4),
      retaliationAttenuation: Math.round(retaliationAttenuation * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function deriveDeescalationPartnerModifiers(snapshot: GTELTradeDeescalationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStressRelief: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'stalled') {
    return { partnerDeltas, domesticStressRelief: 0 };
  }
  const delta =
    snapshot.band === 'breakthrough' ? 0.07 : snapshot.band === 'warming' ? 0.045 : 0.025;
  snapshot.coolingPartnerIds.forEach(id => {
    partnerDeltas[id] = delta;
  });
  if (snapshot.band === 'breakthrough' && snapshot.coolingPartnerIds.length === 0) {
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id !== 'domestic_premium') partnerDeltas[p.id] = delta * 0.55;
    });
  }
  return {
    partnerDeltas,
    domesticStressRelief: gtelClamp(snapshot.retaliationAttenuation * 0.45 + snapshot.momentum * 0.04, 0, 0.12),
  };
}

export function tradeDeescalationWorldEvent(
  snapshot: GTELTradeDeescalationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'breakthrough' || snapshot.coolingPartnerIds.length < 1) return null;
  return {
    id: `gtel_deescalation_${turn}`,
    turn,
    kind: 'diplomacy',
    title: 'Trade tensions cooling',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function tradeDeescalationGiNotes(
  deescalation: GTELTradeDeescalationSnapshot | null | undefined,
): string[] {
  if (!deescalation) return [];
  return [
    `Trade de-escalation: ${deescalation.band.replace(/_/g, ' ')} (momentum ${Math.round(deescalation.momentum * 100)}%).`,
    deescalation.summary,
  ];
}
