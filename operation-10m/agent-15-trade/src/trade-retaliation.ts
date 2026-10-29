import type {
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { GTEL_PARTNER_DEFS } from './constants.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeRetaliationBand = GTELTradeRetaliationSnapshot['band'];

function retaliationBand(intensity: number): GTELTradeRetaliationBand {
  if (intensity >= 0.62) return 'escalating';
  if (intensity >= 0.38) return 'active';
  if (intensity >= 0.18) return 'watch';
  return 'dormant';
}

export function sanitizeRetaliationPressureSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.22), 0.05, 0.88);
}

export function createEmptyTradeRetaliationSnapshot(): GTELTradeRetaliationSnapshot {
  return {
    intensity: 0.22,
    band: 'watch',
    activeMeasureCount: 0,
    targetedPartnerIds: [],
    summary: 'No coordinated trade retaliation is in force.',
  };
}

export function advanceRetaliationPressureSmoothing(
  persisted: GTELPersisted,
  rawIntensity: number,
): GTELPersisted {
  const prev = sanitizeRetaliationPressureSmoothing(persisted.retaliationPressureSmoothing);
  const next = gtelClamp(prev * 0.7 + gtelClamp(rawIntensity, 0.05, 0.9) * 0.3, 0.05, 0.88);
  return { ...persisted, retaliationPressureSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeRetaliationSnapshot(input: {
  openDisputeCount: number;
  activeSanctionCount: number;
  engagement: GTELDiplomaticEngagementState;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeRetaliationSnapshot; persisted: GTELPersisted } {
  const stalledTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'stalled' || t.momentum < 0.25),
  ).length;
  const disputeIntensity = gtelClamp(input.openDisputeCount * 0.14, 0, 0.42);
  const sanctionIntensity = gtelClamp(input.activeSanctionCount * 0.11, 0, 0.35);
  const engagementIntensity = gtelClamp(stalledTracks * 0.08 + (1 - input.engagement.summitPulse) * 0.06, 0, 0.22);
  const rawIntensity = gtelClamp(disputeIntensity + sanctionIntensity + engagementIntensity, 0.05, 0.88);
  const persisted = advanceRetaliationPressureSmoothing(input.persisted, rawIntensity);
  const intensity = sanitizeRetaliationPressureSmoothing(persisted.retaliationPressureSmoothing);
  const band = retaliationBand(intensity);
  const activeMeasureCount =
    Math.min(6, input.openDisputeCount + input.activeSanctionCount + (band === 'escalating' ? 1 : 0));
  const targetedPartnerIds: GTELPartnerId[] = [];
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const track = input.engagement.tracks?.[p.id];
    if (input.openDisputeCount > 0 || (track && track.band === 'stalled')) {
      if (intensity > 0.28) targetedPartnerIds.push(p.id);
    }
  });

  const summary =
    band === 'escalating'
      ? 'Partners are stacking counter-tariffs and compliance probes across multiple lanes.'
      : band === 'active'
        ? 'Retaliatory trade measures are live — expect tighter partner gates until diplomacy cools.'
        : band === 'dormant'
          ? 'Retaliation risk is low; disputes have not yet triggered counter-measures.'
          : 'Retaliation risk is elevated but still mostly rhetorical.';

  return {
    snapshot: {
      intensity: Math.round(intensity * 1000) / 1000,
      band,
      activeMeasureCount,
      targetedPartnerIds: targetedPartnerIds.slice(0, 4),
      summary,
    },
    persisted,
  };
}

export function deriveRetaliationPartnerModifiers(snapshot: GTELTradeRetaliationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'dormant' || snapshot.band === 'watch') {
    return { partnerDeltas, domesticStress: snapshot.intensity * 0.04 };
  }
  const delta = snapshot.band === 'escalating' ? -0.09 : -0.05;
  snapshot.targetedPartnerIds.forEach(id => {
    partnerDeltas[id] = delta;
  });
  if (snapshot.band === 'escalating' && snapshot.targetedPartnerIds.length === 0) {
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id !== 'domestic_premium') partnerDeltas[p.id] = delta * 0.6;
    });
  }
  return {
    partnerDeltas,
    domesticStress: gtelClamp(snapshot.intensity * 0.12, 0, 0.1),
  };
}

export function tradeRetaliationWorldEvent(
  snapshot: GTELTradeRetaliationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'escalating' || snapshot.activeMeasureCount < 2) return null;
  return {
    id: `gtel_retaliation_${turn}`,
    turn,
    kind: 'sanction',
    title: 'Coordinated trade retaliation',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'ACT'],
  };
}

export function tradeRetaliationGiNotes(
  retaliation: GTELTradeRetaliationSnapshot | null | undefined,
): string[] {
  if (!retaliation) return [];
  return [
    `Trade retaliation: ${retaliation.band.replace(/_/g, ' ')} (intensity ${Math.round(retaliation.intensity * 100)}%).`,
    retaliation.summary,
  ];
}
