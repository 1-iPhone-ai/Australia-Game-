import type {
  GTELPartnerId,
  GTELPersisted,
  GTELSanctionsSpilloverSnapshot,
  GTELTradeEnforcementSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
  SanctionTier,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELSanctionsSpilloverBand = GTELSanctionsSpilloverSnapshot['band'];

function spilloverBand(intensity: number): GTELSanctionsSpilloverBand {
  if (intensity >= 0.68) return 'pervasive';
  if (intensity >= 0.44) return 'broad';
  if (intensity >= 0.24) return 'localized';
  return 'contained';
}

export function sanitizeSanctionsSpilloverSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.24), 0.08, 0.88);
}

export function createEmptySanctionsSpilloverSnapshot(): GTELSanctionsSpilloverSnapshot {
  return {
    intensity: 0.24,
    band: 'localized',
    activeTierCount: 0,
    spilloverPartnerIds: [],
    summary: 'Sanctions spillover remains localized to directly targeted partners.',
  };
}

export function advanceSanctionsSpilloverSmoothing(
  persisted: GTELPersisted,
  rawIntensity: number,
): GTELPersisted {
  const prev = sanitizeSanctionsSpilloverSmoothing(persisted.sanctionsSpilloverSmoothing);
  const next = gtelClamp(prev * 0.7 + gtelClamp(rawIntensity, 0.08, 0.88) * 0.3, 0.08, 0.88);
  return { ...persisted, sanctionsSpilloverSmoothing: Math.round(next * 1000) / 1000 };
}

function tierWeight(tier: SanctionTier | undefined): number {
  if (!tier || tier === 'none') return 0;
  if (tier === 'comprehensive') return 0.28;
  if (tier === 'sectoral') return 0.16;
  return 0.08;
}

export function computeSanctionsSpilloverSnapshot(input: {
  activeTiers: Partial<Record<GTELPartnerId, SanctionTier>>;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  tradeEnforcement: GTELTradeEnforcementSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELSanctionsSpilloverSnapshot; persisted: GTELPersisted } {
  const tiers = Object.entries(input.activeTiers || {}) as Array<[GTELPartnerId, SanctionTier]>;
  const activeTierCount = tiers.filter(([, t]) => t && t !== 'none').length;
  const tierIntensity = tiers.reduce((acc, [, t]) => acc + tierWeight(t), 0);
  const retaliationLoad =
    input.tradeRetaliation.band === 'escalating'
      ? 0.18
      : input.tradeRetaliation.band === 'active'
        ? 0.12
        : 0.05;
  const enforcementLoad = gtelClamp(input.tradeEnforcement.intensity * 0.14, 0, 0.16);
  const rawIntensity = gtelClamp(tierIntensity + retaliationLoad + enforcementLoad, 0.08, 0.88);
  const persisted = advanceSanctionsSpilloverSmoothing(input.persisted, rawIntensity);
  const intensity = sanitizeSanctionsSpilloverSmoothing(persisted.sanctionsSpilloverSmoothing);
  const band = spilloverBand(intensity);

  const spilloverPartnerIds: GTELPartnerId[] = [];
  tiers.forEach(([id, t]) => {
    if (t && t !== 'none' && id !== 'domestic_premium') spilloverPartnerIds.push(id);
  });
  input.tradeRetaliation.targetedPartnerIds.forEach(id => {
    if (!spilloverPartnerIds.includes(id)) spilloverPartnerIds.push(id);
  });

  const summary =
    band === 'pervasive'
      ? 'Sanctions spillover is pervasive — secondary partners are tightening compliance on Australian exports.'
      : band === 'broad'
        ? 'Sanctions are spilling into adjacent partner markets beyond the primary targets.'
        : band === 'contained'
          ? 'Sanctions spillover remains contained to directly targeted partners.'
          : 'Localized sanctions spillover is elevating scrutiny on a handful of partner lanes.';

  return {
    snapshot: {
      intensity: Math.round(intensity * 1000) / 1000,
      band,
      activeTierCount,
      spilloverPartnerIds: spilloverPartnerIds.slice(0, 5),
      summary,
    },
    persisted,
  };
}

export function deriveSanctionsSpilloverPartnerModifiers(snapshot: GTELSanctionsSpilloverSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'contained') {
    return { partnerDeltas, domesticStress: 0 };
  }
  const penalty =
    snapshot.band === 'pervasive' ? -0.07 : snapshot.band === 'broad' ? -0.05 : -0.03;
  snapshot.spilloverPartnerIds.forEach(id => {
    partnerDeltas[id] = gtelNum(partnerDeltas[id], 0) + penalty;
  });
  const domesticStress =
    snapshot.band === 'pervasive'
      ? gtelClamp(snapshot.intensity * 0.1, 0.04, 0.09)
      : snapshot.band === 'broad'
        ? gtelClamp(snapshot.intensity * 0.07, 0.02, 0.06)
        : gtelClamp(snapshot.intensity * 0.04, 0, 0.04);
  return { partnerDeltas, domesticStress };
}

export function sanctionsSpilloverExportScale(snapshot: GTELSanctionsSpilloverSnapshot): number {
  if (snapshot.band === 'contained') return gtelClamp(1 - snapshot.intensity * 0.02, 0.97, 1);
  if (snapshot.band === 'pervasive') return gtelClamp(0.84 + (1 - snapshot.intensity) * 0.06, 0.8, 0.9);
  if (snapshot.band === 'broad') return gtelClamp(0.9 + (1 - snapshot.intensity) * 0.05, 0.86, 0.95);
  return gtelClamp(0.94 + (1 - snapshot.intensity) * 0.04, 0.9, 0.98);
}

export function sanctionsSpilloverWorldEvent(
  snapshot: GTELSanctionsSpilloverSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broad' && snapshot.band !== 'pervasive') return null;
  if (snapshot.activeTierCount < 1) return null;
  return {
    id: `gtel_sanctions_spill_${turn}`,
    turn,
    kind: 'sanction',
    title: 'Sanctions spillover widening',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function sanctionsSpilloverGiNotes(
  spillover: GTELSanctionsSpilloverSnapshot | null | undefined,
): string[] {
  if (!spillover) return [];
  return [
    `Sanctions spillover: ${spillover.band} (${Math.round(spillover.intensity * 100)}% intensity).`,
    spillover.summary,
  ];
}
