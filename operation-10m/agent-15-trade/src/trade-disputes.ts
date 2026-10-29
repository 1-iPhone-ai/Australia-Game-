import { GTEL_PARTNER_DEFS } from './constants.ts';
import type { GTELPartnerId, GTELPersisted, SanctionTier, TradeDisputeCase, TradeDisputeStatus } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export function openTradeDispute(
  persisted: GTELPersisted,
  partnerId: GTELPartnerId,
  turn: number,
  subject: string,
  requestedRelief: TradeDisputeCase['requestedRelief'] = 'sanction_step_down',
  severity = 0.5,
): { persisted: GTELPersisted; dispute: TradeDisputeCase | null } {
  if (!GTEL_PARTNER_DEFS.some(p => p.id === partnerId)) return { persisted, dispute: null };
  const open = (persisted.tradeDisputes || []).filter(d => d.status === 'open' || d.status === 'mediation');
  if (open.some(d => d.partnerId === partnerId)) return { persisted, dispute: null };
  const dispute: TradeDisputeCase = {
    id: `td_${partnerId}_${turn}`,
    partnerId,
    status: 'open',
    openedTurn: turn,
    resolvedTurn: null,
    subject: subject.slice(0, 160),
    requestedRelief,
    severity: gtelClamp(severity, 0.1, 1),
  };
  return {
    persisted: { ...persisted, tradeDisputes: [...(persisted.tradeDisputes || []), dispute].slice(-12) },
    dispute,
  };
}

export function advanceTradeDisputes(
  persisted: GTELPersisted,
  turn: number,
  sanctionTiers: Partial<Record<GTELPartnerId, SanctionTier>>,
): {
  persisted: GTELPersisted;
  events: Array<{ id: string; turn: number; kind: 'trade'; title: string; summary: string; regionIds: string[] }>;
} {
  const events: Array<{ id: string; turn: number; kind: 'trade'; title: string; summary: string; regionIds: string[] }> = [];
  const tradeDisputes = (persisted.tradeDisputes || []).map(d => {
    if (d.status !== 'open' && d.status !== 'mediation') return d;
    const age = turn - d.openedTurn;
    const tier = sanctionTiers[d.partnerId] || 'none';
    let status: TradeDisputeStatus = d.status;
    if (age >= 2 && tier !== 'none') status = 'mediation';
    if (age >= 6 && tier === 'comprehensive') status = 'escalated';
    if (age >= 5 && tier === 'none') status = 'resolved';
    if (status === 'resolved' && d.status !== 'resolved') {
      events.push({
        id: `gtel_dispute_res_${d.id}`,
        turn,
        kind: 'trade',
        title: 'Trade dispute closed',
        summary: `${d.subject} — partners returned to normal compliance window.`,
        regionIds: ['NSW', 'VIC'],
      });
    }
    if (status === 'escalated' && d.status !== 'escalated') {
      events.push({
        id: `gtel_dispute_esc_${d.id}`,
        turn,
        kind: 'trade',
        title: 'Trade dispute escalated',
        summary: `${d.subject} — mediation failed; market access remains constrained.`,
        regionIds: ['WA', 'QLD', 'NSW'],
      });
    }
    return {
      ...d,
      status,
      resolvedTurn: status === 'resolved' ? turn : d.resolvedTurn,
    };
  });

  let next = { ...persisted, tradeDisputes };
  tradeDisputes.forEach(d => {
    if (d.status !== 'resolved' || d.resolvedTurn !== turn) return;
    if (d.requestedRelief !== 'sanction_step_down') return;
    const regime = next.partnerSanctions?.[d.partnerId];
    if (!regime || regime.tier === 'none') return;
    const down: SanctionTier =
      regime.tier === 'comprehensive' ? 'sectoral' : regime.tier === 'sectoral' ? 'watchlist' : 'none';
    next = {
      ...next,
      partnerSanctions: {
        ...next.partnerSanctions,
        [d.partnerId]: {
          ...regime,
          tier: down,
          reason: `Dispute ${d.id} resolution stepped sanctions down to ${down}.`,
          complianceStreak: regime.complianceStreak + 1,
        },
      },
    };
  });

  return { persisted: next, events: events.slice(0, 4) };
}

export function countOpenTradeDisputes(persisted: GTELPersisted): number {
  return (persisted.tradeDisputes || []).filter(d => d.status === 'open' || d.status === 'mediation').length;
}

export function autoOpenDisputesFromSanctions(
  persisted: GTELPersisted,
  turn: number,
  sanctionTiers: Partial<Record<GTELPartnerId, SanctionTier>>,
): GTELPersisted {
  let next = persisted;
  Object.entries(sanctionTiers).forEach(([pid, tier]) => {
    if (tier !== 'sectoral' && tier !== 'comprehensive') return;
    const partnerId = pid as GTELPartnerId;
    const r = openTradeDispute(
      next,
      partnerId,
      turn,
      `Automatic dispute: ${tier} sanctions on ${GTEL_PARTNER_DEFS.find(p => p.id === partnerId)?.label || partnerId}`,
      'sanction_step_down',
      tier === 'comprehensive' ? 0.85 : 0.55,
    );
    next = r.persisted;
  });
  return next;
}
