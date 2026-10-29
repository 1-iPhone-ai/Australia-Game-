import { GTEL_COMMODITIES, GTEL_PARTNER_DEFS } from './constants.ts';
import type { GTELCommodityId, GTELDiplomacyState, GTELDiplomaticDeal, GTELPartnerId } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export function gtelActiveDeals(st: GTELDiplomacyState | null): GTELDiplomaticDeal[] {
  if (!st || !Array.isArray(st.deals)) return [];
  return st.deals.filter(d => d && (d.status === 'active' || d.compliance === 'compliant' || d.compliance === 'at_risk'));
}

export function gtelRecentViolations(st: GTELDiplomacyState | null, turn: number, window = 6): number {
  if (!st) return 0;
  let n = 0;
  (st.deals || []).forEach(d => {
    if (d.status === 'violated' || d.compliance === 'violated') n += 1;
  });
  (st.events || []).forEach(ev => {
    if (turn - ev.turn <= window && /violation|embargo|breach/i.test(String(ev.kind) + ev.text)) n += 1;
  });
  return n;
}

export function deriveDiplomaticTradeModifiers(
  diplomacyState: GTELDiplomacyState | null,
  turn: number,
  actorNames: Record<string, string> = {},
): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  const notes: string[] = [];
  const deals = gtelActiveDeals(diplomacyState);
  const actorPartner = (actorId: string): GTELPartnerId | null => {
    const def = GTEL_PARTNER_DEFS.find(p => p.diplomaticActorIds.includes(actorId));
    return def ? def.id : null;
  };

  deals.forEach(deal => {
    const isTrade = deal.type === 'resource_trade' || (deal.terms || []).some(t => t.kind === 'transfer_resource');
    if (!isTrade) return;
    deal.participants.forEach(pid => {
      const partner = actorPartner(pid);
      if (partner) partnerDeltas[partner] = (partnerDeltas[partner] || 0) + 0.08;
    });
    (deal.terms || []).forEach(term => {
      if (term.kind !== 'transfer_resource') return;
      const res = String(term.resourceId || 'iron_ore').toLowerCase();
      const commodity = GTEL_COMMODITIES.find(c => res.includes(c.replace('_', '')) || res.includes(c)) || 'iron_ore';
      commodityDeltas[commodity] = (commodityDeltas[commodity] || 0) + gtelClamp(gtelNum(term.amount, 500) / 5000, 0.02, 0.12);
    });
    const who = deal.participants.map(p => actorNames[p] || p).join(' ↔ ');
    notes.push(`Active trade arrangement (${who}) supports partner access.`);
  });

  const violations = gtelRecentViolations(diplomacyState, turn);
  if (violations > 0) {
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id === 'domestic_premium') return;
      partnerDeltas[p.id] = (partnerDeltas[p.id] || 0) - 0.06 * violations;
    });
    notes.push(`Recent diplomatic friction (${violations} signal${violations > 1 ? 's' : ''}) tightens external market access.`);
  }

  return { partnerDeltas, commodityDeltas, notes };
}

export function gtelNetworkModifier(national: import('./types.ts').GTELNationalSystemsSlice | null): {
  networkMod: number;
  condition: string;
  throughput: number;
} {
  const trade = national?.national?.trade;
  const condition = String(trade?.condition || 'healthy');
  const rank: Record<string, number> = { surplus: 0.08, healthy: 0.03, strained: -0.04, bottlenecked: -0.1, critical: -0.18 };
  const networkMod = rank[condition] ?? 0;
  let exported = gtelNum(trade?.exportedCapacity, 0);
  if (!exported && national?.regions) {
    exported = Object.values(national.regions).reduce((acc, r) => acc + gtelNum(r?.networks?.trade?.exportedCapacity, 0), 0);
  }
  return { networkMod, condition, throughput: exported };
}

export function gtelAccessBandFromScore(score: number): import('./types.ts').GTELAccessBand {
  if (score < 0.25) return 'blocked';
  if (score < 0.45) return 'restricted';
  if (score < 0.65) return 'normal';
  if (score < 0.85) return 'preferred';
  return 'strategic';
}
