import { GTEL_PARTNER_DEFS } from './constants.ts';
import { gtelRecentViolations } from './diplomacy-linkage.ts';
import type {
  GTELDiplomacyState,
  GTELPartnerId,
  GTELPersisted,
  PartnerTrustScore,
  SanctionTier,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

function trustBand(score: number): PartnerTrustScore['band'] {
  if (score < 0.35) return 'critical';
  if (score < 0.55) return 'fragile';
  if (score < 0.75) return 'steady';
  return 'strong';
}

function emptyTrust(partnerId: GTELPartnerId, turn: number): PartnerTrustScore {
  const def = GTEL_PARTNER_DEFS.find(p => p.id === partnerId);
  const base = def?.baseOpenness ?? 0.7;
  return {
    partnerId,
    score: gtelClamp(base * 0.65 + 0.2, 0.25, 0.85),
    band: 'steady',
    lastUpdatedTurn: turn,
    drivers: ['Baseline partner openness.'],
  };
}

export function sanitizePartnerTrustScore(raw: unknown, partnerId: GTELPartnerId, turn: number): PartnerTrustScore {
  const base = emptyTrust(partnerId, turn);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const score = gtelClamp(gtelNum(r.score, base.score), 0.05, 0.99);
  return {
    partnerId,
    score,
    band: trustBand(score),
    lastUpdatedTurn: Math.max(1, Math.floor(gtelNum(r.lastUpdatedTurn, turn))),
    drivers: (Array.isArray(r.drivers) ? r.drivers : base.drivers).map(String).slice(0, 6),
  };
}

export function advancePartnerTrustScores(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
  sanctionTiers: Partial<Record<GTELPartnerId, SanctionTier>>,
): GTELPersisted {
  const partnerTrust: Partial<Record<GTELPartnerId, PartnerTrustScore>> = { ...persisted.partnerTrust };
  const violations = gtelRecentViolations(diplomacy, turn);
  const ratified = persisted.agreements.filter(a => a.status === 'ratified').length;

  GTEL_PARTNER_DEFS.forEach(def => {
    if (def.id === 'domestic_premium') return;
    const prev = partnerTrust[def.id] || emptyTrust(def.id, turn);
    let score = prev.score;
    const drivers: string[] = [];

    const tier = sanctionTiers[def.id] || 'none';
    if (tier === 'comprehensive') {
      score -= 0.08;
      drivers.push('Comprehensive sanctions erode trust.');
    } else if (tier === 'sectoral') {
      score -= 0.04;
      drivers.push('Sectoral sanctions weigh on confidence.');
    } else if (tier === 'watchlist') {
      score -= 0.02;
      drivers.push('Watchlist status adds friction.');
    }

    const partnerAgreements = persisted.agreements.filter(a => a.partnerId === def.id && a.status === 'ratified').length;
    if (partnerAgreements > 0) {
      score += 0.03 * Math.min(3, partnerAgreements);
      drivers.push(`${partnerAgreements} ratified agreement(s) support trust.`);
    }

    if (violations > 0 && def.id !== 'domestic_premium') {
      score -= 0.015 * violations;
      drivers.push('Recent diplomatic violations reduce trust.');
    }

    if (ratified >= 2) {
      score += 0.02;
      drivers.push('Broad agreement portfolio signals reliability.');
    }

    score = gtelClamp(score, 0.08, 0.96);
    partnerTrust[def.id] = {
      partnerId: def.id,
      score: Math.round(score * 1000) / 1000,
      band: trustBand(score),
      lastUpdatedTurn: turn,
      drivers: drivers.length ? drivers.slice(0, 5) : prev.drivers,
    };
  });

  return { ...persisted, partnerTrust };
}

export function deriveTrustAccessModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const notes: string[] = [];
  Object.values(persisted.partnerTrust || {}).forEach(t => {
    if (!t) return;
    const delta = gtelClamp((t.score - 0.55) * 0.12, -0.08, 0.1);
    if (Math.abs(delta) < 0.005) return;
    partnerDeltas[t.partnerId] = (partnerDeltas[t.partnerId] || 0) + delta;
    notes.push(`${GTEL_PARTNER_DEFS.find(p => p.id === t.partnerId)?.label || t.partnerId} trust ${t.band} (${Math.round(t.score * 100)}%).`);
  });
  return { partnerDeltas, notes };
}

export function summarizePartnerTrust(persisted: GTELPersisted): PartnerTrustScore[] {
  return GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium')
    .map(p => persisted.partnerTrust?.[p.id] || emptyTrust(p.id, 1))
    .sort((a, b) => b.score - a.score);
}
