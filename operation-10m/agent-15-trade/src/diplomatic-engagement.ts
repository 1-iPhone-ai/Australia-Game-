import { GTEL_PARTNER_DEFS } from './constants.ts';
import { gtelActiveDeals, gtelRecentViolations } from './diplomacy-linkage.ts';
import { countOpenTradeDisputes } from './trade-disputes.ts';
import type {
  DiplomaticEngagementTrack,
  GTELDiplomacyState,
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type EngagementBand = DiplomaticEngagementTrack['band'];

function engagementBand(momentum: number): EngagementBand {
  if (momentum >= 0.78) return 'breakthrough';
  if (momentum >= 0.55) return 'active';
  if (momentum >= 0.32) return 'cautious';
  return 'stalled';
}

function sanitizeTrack(raw: unknown, partnerId: GTELPartnerId, turn: number): DiplomaticEngagementTrack {
  const base: DiplomaticEngagementTrack = {
    partnerId,
    momentum: 0.45,
    band: 'cautious',
    lastEventTurn: turn,
    highlights: [],
  };
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const momentum = gtelClamp(gtelNum(r.momentum, base.momentum), 0.08, 0.98);
  return {
    partnerId,
    momentum: Math.round(momentum * 1000) / 1000,
    band: engagementBand(momentum),
    lastEventTurn: Math.max(1, Math.floor(gtelNum(r.lastEventTurn, turn))),
    highlights: (Array.isArray(r.highlights) ? r.highlights : []).map(String).slice(0, 4),
  };
}

export function advanceDiplomaticEngagement(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
): { persisted: GTELPersisted; state: GTELDiplomaticEngagementState; events: GTELTurnResult['worldEvents'] } {
  const events: GTELTurnResult['worldEvents'] = [];
  const tracks: Partial<Record<GTELPartnerId, DiplomaticEngagementTrack>> = {};
  const violations = gtelRecentViolations(diplomacy, turn);
  const openDisputes = countOpenTradeDisputes(persisted);
  const activeDeals = gtelActiveDeals(diplomacy);
  const prevMemory = persisted.diplomaticEngagement || {};

  GTEL_PARTNER_DEFS.forEach(def => {
    if (def.id === 'domestic_premium') return;
    const prev = sanitizeTrack(prevMemory[def.id], def.id, turn);
    let momentum = prev.momentum;
    const highlights: string[] = [];

    const partnerDeals = activeDeals.filter(d =>
      d.participants.some(pid => def.diplomaticActorIds.includes(pid)),
    );
    if (partnerDeals.length > 0) {
      momentum += 0.04 * Math.min(3, partnerDeals.length);
      highlights.push(`${partnerDeals.length} active trade-linked deal(s) with ${def.label}.`);
    }

    const ratified = persisted.agreements.filter(a => a.status === 'ratified' && a.partnerId === def.id).length;
    if (ratified > 0) {
      momentum += 0.03 * ratified;
      highlights.push('Ratified agreement supports engagement.');
    }

    const sanction = persisted.partnerSanctions?.[def.id];
    if (sanction && sanction.tier !== 'none') {
      momentum -= sanction.tier === 'comprehensive' ? 0.12 : sanction.tier === 'sectoral' ? 0.07 : 0.04;
      highlights.push(`${sanction.tier} sanctions dampen engagement.`);
    }

    const partnerDisputes = (persisted.tradeDisputes || []).filter(
      d => d.partnerId === def.id && (d.status === 'open' || d.status === 'mediation'),
    );
    if (partnerDisputes.length > 0) {
      momentum -= 0.05 * partnerDisputes.length;
      highlights.push(`${partnerDisputes.length} open dispute(s) need mediation.`);
    }

    if (violations > 0) momentum -= 0.025 * violations;

    momentum = gtelClamp(momentum * 0.92 + 0.04, 0.1, 0.95);
    const band = engagementBand(momentum);
    const track: DiplomaticEngagementTrack = {
      partnerId: def.id,
      momentum: Math.round(momentum * 1000) / 1000,
      band,
      lastEventTurn: turn,
      highlights: highlights.slice(0, 3),
    };
    tracks[def.id] = track;

    if (band === 'breakthrough' && prev.band !== 'breakthrough') {
      events.push({
        id: `gtel_engagement_breakthrough_${def.id}_${turn}`,
        turn,
        kind: 'diplomacy',
        title: `Engagement breakthrough — ${def.label}`,
        summary: `Diplomatic momentum with ${def.label} opens room for dispute de-escalation and market confidence.`,
        regionIds: ['ACT', 'NSW'],
      });
    }
  });

  const momentumValues = Object.values(tracks).map(t => t?.momentum || 0);
  const summitPulse =
    momentumValues.length > 0 ? momentumValues.reduce((a, b) => a + b, 0) / momentumValues.length : 0.4;
  const stalled = Object.values(tracks).filter(t => t?.band === 'stalled').length;
  const summary =
    stalled >= 3
      ? 'Multiple partner engagement tracks are stalled; trade diplomacy needs active outreach.'
      : summitPulse >= 0.62
        ? 'Cross-partner engagement pulse is constructive for trade normalization.'
        : 'Engagement is mixed — selective partner outreach recommended.';

  if (openDisputes >= 2 && summitPulse < 0.45 && turn % 5 === 0) {
    events.push({
      id: `gtel_engagement_summit_${turn}`,
      turn,
      kind: 'diplomacy',
      title: 'Trade diplomacy summit window',
      summary: 'Low engagement momentum coincides with open disputes — a coordinated outreach push could unlock mediation.',
      regionIds: ['ACT'],
    });
  }

  const memory: GTELPersisted['diplomaticEngagement'] = {};
  Object.entries(tracks).forEach(([k, v]) => {
    if (!v) return;
    memory[k as GTELPartnerId] = { momentum: v.momentum, lastEventTurn: v.lastEventTurn, highlights: v.highlights };
  });

  return {
    persisted: { ...persisted, diplomaticEngagement: memory },
    state: { tracks, summitPulse: Math.round(summitPulse * 1000) / 1000, summary },
    events,
  };
}

export function deriveEngagementPartnerModifiers(
  engagement: GTELDiplomaticEngagementState | null | undefined,
): { partnerDeltas: Partial<Record<GTELPartnerId, number>>; notes: string[] } {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const notes: string[] = [];
  if (!engagement?.tracks) return { partnerDeltas, notes };

  Object.values(engagement.tracks).forEach(track => {
    if (!track) return;
    if (track.band === 'breakthrough') partnerDeltas[track.partnerId] = (partnerDeltas[track.partnerId] || 0) + 0.05;
    else if (track.band === 'active') partnerDeltas[track.partnerId] = (partnerDeltas[track.partnerId] || 0) + 0.025;
    else if (track.band === 'stalled') partnerDeltas[track.partnerId] = (partnerDeltas[track.partnerId] || 0) - 0.04;
  });

  if (engagement.summitPulse >= 0.65) notes.push('Strong engagement pulse supports partner access normalization.');
  else if (engagement.summitPulse < 0.38) notes.push('Stalled engagement tracks are weighing on trade diplomacy.');

  return { partnerDeltas, notes };
}

export function engagementTrustRecoveryBonus(engagement: GTELDiplomaticEngagementState | null | undefined): number {
  if (!engagement) return 0;
  return gtelClamp((engagement.summitPulse - 0.45) * 0.08, -0.02, 0.04);
}

export function diplomaticEngagementGiNotes(engagement: GTELDiplomaticEngagementState | null | undefined): string[] {
  if (!engagement) return [];
  const lines = [engagement.summary];
  const active = Object.values(engagement.tracks || {}).filter(t => t?.band === 'active' || t?.band === 'breakthrough');
  if (active.length >= 2) {
    lines.push(`Active engagement: ${active.map(t => GTEL_PARTNER_DEFS.find(p => p.id === t!.partnerId)?.label || t!.partnerId).join(', ')}.`);
  }
  return lines;
}
