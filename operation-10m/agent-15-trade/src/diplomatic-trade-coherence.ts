import type {
  GTELDiplomaticEngagementState,
  GTELPartnerAccessRestorationSnapshot,
  GTELPersisted,
  GTELDiplomaticTradeCoherenceSnapshot,
  GTELTradeDeescalationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELDiplomaticTradeCoherenceBand = GTELDiplomaticTradeCoherenceSnapshot['band'];

function coherenceBand(score: number): GTELDiplomaticTradeCoherenceBand {
  if (score >= 0.74) return 'aligned';
  if (score >= 0.52) return 'coordinated';
  if (score >= 0.34) return 'fragmented';
  return 'divergent';
}

export function sanitizeDiplomaticTradeCoherenceSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.48), 0.16, 0.92);
}

export function createEmptyDiplomaticTradeCoherenceSnapshot(): GTELDiplomaticTradeCoherenceSnapshot {
  return {
    score: 0.48,
    band: 'coordinated',
    trackAlignment: 0.52,
    narrativeConsistency: 0.5,
    summary: 'Diplomatic and trade tracks are moderately coordinated.',
  };
}

export function advanceDiplomaticTradeCoherenceSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeDiplomaticTradeCoherenceSmoothing(persisted.diplomaticTradeCoherenceSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawScore, 0.16, 0.92) * 0.28, 0.16, 0.92);
  return { ...persisted, diplomaticTradeCoherenceSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeDiplomaticTradeCoherenceSnapshot(input: {
  engagement: GTELDiplomaticEngagementState;
  tradeDeescalation: GTELTradeDeescalationSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  partnerAccessRestoration: GTELPartnerAccessRestorationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELDiplomaticTradeCoherenceSnapshot; persisted: GTELPersisted } {
  const activeTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'active' || t.band === 'breakthrough'),
  ).length;
  const engagementLift = gtelClamp(activeTracks * 0.08 + input.engagement.summitPulse * 0.14, 0, 0.28);
  const deescalationLift =
    input.tradeDeescalation.band === 'breakthrough'
      ? 0.16
      : input.tradeDeescalation.band === 'warming'
        ? 0.1
        : 0.04;
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.14
      : input.tradeReconciliation.band === 'substantive'
        ? 0.08
        : 0.03;
  const restorationLift =
    input.partnerAccessRestoration.band === 'reopened'
      ? 0.12
      : input.partnerAccessRestoration.band === 'recovering'
        ? 0.07
        : 0.02;
  const rawScore = gtelClamp(0.32 + engagementLift + deescalationLift + reconciliationLift + restorationLift, 0.16, 0.92);
  const persisted = advanceDiplomaticTradeCoherenceSmoothing(input.persisted, rawScore);
  const score = sanitizeDiplomaticTradeCoherenceSmoothing(persisted.diplomaticTradeCoherenceSmoothing);
  const band = coherenceBand(score);
  const trackAlignment = gtelClamp(score * 0.55 + activeTracks * 0.06, 0.2, 0.88);
  const narrativeConsistency = gtelClamp(
    score * 0.5 + deescalationLift + reconciliationLift,
    0.18,
    0.9,
  );

  const summary =
    band === 'aligned'
      ? 'Diplomatic messaging and trade measures are aligned — partners see a single coherent story.'
      : band === 'divergent'
        ? 'Trade retaliation and diplomatic outreach are sending mixed signals to partners.'
        : band === 'fragmented'
          ? 'Diplomatic tracks and trade enforcement are pulling in different directions.'
          : 'Diplomatic and trade tracks are moderately coordinated.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      trackAlignment: Math.round(trackAlignment * 1000) / 1000,
      narrativeConsistency: Math.round(narrativeConsistency * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function diplomaticTradeCoherenceDomesticStressRelief(snapshot: GTELDiplomaticTradeCoherenceSnapshot): number {
  if (snapshot.band === 'aligned') return gtelClamp(snapshot.score * 0.05, 0.02, 0.045);
  if (snapshot.band === 'coordinated') return gtelClamp(snapshot.score * 0.03, 0, 0.03);
  return 0;
}

export function diplomaticTradeCoherenceExportScale(snapshot: GTELDiplomaticTradeCoherenceSnapshot): number {
  if (snapshot.band === 'aligned') return gtelClamp(1 + snapshot.trackAlignment * 0.025, 1, 1.03);
  if (snapshot.band === 'divergent') return gtelClamp(0.93 + snapshot.score * 0.05, 0.9, 0.97);
  if (snapshot.band === 'fragmented') return gtelClamp(0.96 + snapshot.score * 0.03, 0.93, 0.99);
  return gtelClamp(0.98 + snapshot.score * 0.02, 0.96, 1.02);
}

export function diplomaticTradeCoherenceWorldEvent(
  snapshot: GTELDiplomaticTradeCoherenceSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'aligned' && snapshot.band !== 'divergent') return null;
  if (snapshot.band === 'aligned' && snapshot.score < 0.72) return null;
  return {
    id: `gtel_dipl_coherence_${turn}`,
    turn,
    kind: 'diplomacy',
    title: snapshot.band === 'aligned' ? 'Diplomatic trade alignment' : 'Diplomatic trade divergence',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function diplomaticTradeCoherenceGiNotes(
  coherence: GTELDiplomaticTradeCoherenceSnapshot | null | undefined,
): string[] {
  if (!coherence) return [];
  return [
    `Diplomatic trade coherence: ${coherence.band} (${Math.round(coherence.score * 100)}% score).`,
    coherence.summary,
  ];
}
