import { GTEL_PARTNER_DEFS } from './constants.ts';
import { gtelRecentViolations } from './diplomacy-linkage.ts';
import type {
  GTELCommodityId,
  GTELDiplomacyState,
  GTELPartnerId,
  GTELPersisted,
  PartnerSanctionRegime,
  SanctionTier,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

const TIER_RANK: Record<SanctionTier, number> = {
  none: 0,
  watchlist: 1,
  sectoral: 2,
  comprehensive: 3,
};

const TIER_PARTNER_PENALTY: Record<SanctionTier, number> = {
  none: 0,
  watchlist: -0.04,
  sectoral: -0.12,
  comprehensive: -0.22,
};

const TIER_DOMESTIC_STRESS: Record<SanctionTier, number> = {
  none: 0,
  watchlist: 0.02,
  sectoral: 0.06,
  comprehensive: 0.11,
};

/** Default commodity scopes when a partner market is sectorally sanctioned. */
export const PARTNER_SANCTION_COMMODITY_SCOPE: Partial<Record<GTELPartnerId, GTELCommodityId[]>> = {
  asia_pacific: ['iron_ore', 'coal', 'lng'],
  india_ocean: ['wheat', 'beef', 'coal'],
  north_america: ['lng', 'services', 'manufacturing'],
  europe: ['services', 'aluminium', 'manufacturing'],
  domestic_premium: [],
};

function emptyRegime(partnerId: GTELPartnerId): PartnerSanctionRegime {
  return {
    partnerId,
    tier: 'none',
    escalatedTurn: 0,
    cooldownUntilTurn: null,
    violationStreak: 0,
    complianceStreak: 0,
    scopedCommodities: [],
    reason: 'No active sanctions.',
  };
}

function escalateTier(current: SanctionTier, violations: number): SanctionTier {
  if (violations >= 4) return 'comprehensive';
  if (violations >= 2) return 'sectoral';
  if (violations >= 1) return 'watchlist';
  return current === 'none' ? 'none' : current;
}

function deescalateTier(current: SanctionTier, complianceStreak: number): SanctionTier {
  if (current === 'comprehensive' && complianceStreak >= 3) return 'sectoral';
  if (current === 'sectoral' && complianceStreak >= 2) return 'watchlist';
  if (current === 'watchlist' && complianceStreak >= 2) return 'none';
  return current;
}

export function sanitizePartnerSanctionRegime(raw: unknown, partnerId: GTELPartnerId): PartnerSanctionRegime {
  const base = emptyRegime(partnerId);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const tier = ['none', 'watchlist', 'sectoral', 'comprehensive'].includes(String(r.tier))
    ? (r.tier as SanctionTier)
    : 'none';
  return {
    partnerId,
    tier,
    escalatedTurn: Math.max(0, Math.floor(gtelNum(r.escalatedTurn, 0))),
    cooldownUntilTurn: r.cooldownUntilTurn == null ? null : Math.max(1, Math.floor(gtelNum(r.cooldownUntilTurn, 1))),
    violationStreak: Math.max(0, Math.floor(gtelNum(r.violationStreak, 0))),
    complianceStreak: Math.max(0, Math.floor(gtelNum(r.complianceStreak, 0))),
    scopedCommodities: (Array.isArray(r.scopedCommodities) ? r.scopedCommodities : [])
      .map(String)
      .filter((c): c is GTELCommodityId => (PARTNER_SANCTION_COMMODITY_SCOPE[partnerId] || []).includes(c as GTELCommodityId))
      .slice(0, 6),
    reason: String(r.reason || base.reason).slice(0, 200),
  };
}

/** Map diplomatic actors to partner markets for sanction attribution. */
function violationsByPartner(diplomacy: GTELDiplomacyState | null, turn: number): Partial<Record<GTELPartnerId, number>> {
  const out: Partial<Record<GTELPartnerId, number>> = {};
  if (!diplomacy) return out;
  const bump = (pid: GTELPartnerId, n = 1) => {
    out[pid] = (out[pid] || 0) + n;
  };
  (diplomacy.deals || []).forEach(d => {
    if (d.status !== 'violated' && d.compliance !== 'violated') return;
    d.participants.forEach(actorId => {
      const def = GTEL_PARTNER_DEFS.find(p => p.diplomaticActorIds.includes(actorId));
      if (def && def.id !== 'domestic_premium') bump(def.id);
    });
  });
  (diplomacy.events || []).forEach(ev => {
    if (turn - ev.turn > 8) return;
    if (!/violation|sanction|embargo|breach/i.test(`${ev.kind} ${ev.text || ''}`)) return;
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id === 'domestic_premium') return;
      if (new RegExp(p.id.replace('_', '[_\\s]?'), 'i').test(ev.text || '')) bump(p.id);
      else if (/embargo|sanction/i.test(ev.text || '')) bump(p.id, 0.5);
    });
  });
  return out;
}

export function advancePartnerSanctions(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
): {
  persisted: GTELPersisted;
  events: Array<{ id: string; turn: number; kind: 'sanction'; title: string; summary: string; regionIds: string[] }>;
} {
  const partnerSanctions: Partial<Record<GTELPartnerId, PartnerSanctionRegime>> = { ...persisted.partnerSanctions };
  const events: Array<{ id: string; turn: number; kind: 'sanction'; title: string; summary: string; regionIds: string[] }> =
    [];
  const violByPartner = violationsByPartner(diplomacy, turn);
  const totalViolations = gtelRecentViolations(diplomacy, turn);

  GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium').forEach(def => {
    const prev = partnerSanctions[def.id] || emptyRegime(def.id);
    let regime = { ...prev };
    if (regime.cooldownUntilTurn != null && turn < regime.cooldownUntilTurn) {
      partnerSanctions[def.id] = regime;
      return;
    }
    const partnerViol = gtelNum(violByPartner[def.id], 0);
    if (partnerViol > 0) {
      regime.violationStreak = Math.min(8, regime.violationStreak + Math.ceil(partnerViol));
      regime.complianceStreak = 0;
    } else if (totalViolations === 0) {
      regime.complianceStreak = Math.min(6, regime.complianceStreak + 1);
      regime.violationStreak = Math.max(0, regime.violationStreak - 1);
    }
    const targetTier = partnerViol > 0 ? escalateTier(regime.tier, regime.violationStreak) : deescalateTier(regime.tier, regime.complianceStreak);
    if (TIER_RANK[targetTier] > TIER_RANK[regime.tier]) {
      regime = {
        ...regime,
        tier: targetTier,
        escalatedTurn: turn,
        cooldownUntilTurn: turn + 6,
        scopedCommodities: PARTNER_SANCTION_COMMODITY_SCOPE[def.id] || [],
        reason: `Escalated to ${targetTier} after diplomatic/trade breaches involving ${def.label}.`,
      };
      events.push({
        id: `gtel_sanction_up_${def.id}_${turn}`,
        turn,
        kind: 'sanction',
        title: `${def.label}: sanctions intensify`,
        summary: regime.reason,
        regionIds: ['NSW', 'WA', 'VIC'],
      });
    } else if (TIER_RANK[targetTier] < TIER_RANK[regime.tier]) {
      regime = {
        ...regime,
        tier: targetTier,
        escalatedTurn: turn,
        reason: targetTier === 'none' ? 'Sanctions lifted after compliance window.' : `De-escalated to ${targetTier}.`,
        scopedCommodities: targetTier === 'sectoral' ? PARTNER_SANCTION_COMMODITY_SCOPE[def.id] || [] : [],
      };
      if (targetTier === 'none') regime.cooldownUntilTurn = null;
    }
    partnerSanctions[def.id] = regime;
  });

  return { persisted: { ...persisted, partnerSanctions }, events: events.slice(0, 4) };
}

export function deriveSanctionModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  domesticStress: number;
  notes: string[];
  activeTiers: Partial<Record<GTELPartnerId, SanctionTier>>;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  let domesticStress = 0;
  const notes: string[] = [];
  const activeTiers: Partial<Record<GTELPartnerId, SanctionTier>> = {};

  Object.entries(persisted.partnerSanctions || {}).forEach(([k, regime]) => {
    if (!regime || regime.tier === 'none') return;
    const partnerId = k as GTELPartnerId;
    activeTiers[partnerId] = regime.tier;
    const penalty = TIER_PARTNER_PENALTY[regime.tier];
    partnerDeltas[partnerId] = (partnerDeltas[partnerId] || 0) + penalty;
    domesticStress += TIER_DOMESTIC_STRESS[regime.tier];
    const commodityPenalty =
      regime.tier === 'comprehensive' ? -0.08 : regime.tier === 'sectoral' ? -0.05 : -0.02;
    (regime.scopedCommodities.length ? regime.scopedCommodities : PARTNER_SANCTION_COMMODITY_SCOPE[partnerId] || []).forEach(c => {
      commodityDeltas[c] = (commodityDeltas[c] || 0) + commodityPenalty;
    });
    notes.push(`${regime.tier} sanctions on ${GTEL_PARTNER_DEFS.find(p => p.id === partnerId)?.label || partnerId}.`);
  });

  return {
    partnerDeltas,
    commodityDeltas,
    domesticStress: gtelClamp(domesticStress, 0, 0.35),
    notes,
    activeTiers,
  };
}
