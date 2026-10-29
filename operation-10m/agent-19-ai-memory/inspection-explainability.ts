import { buildAiMemoryHorizonSnapshot, createEmptyAiActorMemory } from './horizon.ts';
import type {
  AiActorMemory,
  AiMemoryEvent,
  AiMemoryHorizonSnapshot,
  AiMemoryInspectionView,
  AiOpponentModel,
  AiRelationship,
} from './types.ts';

/** Inspection respects authority: rivals' private beliefs stay hidden without Full Inspection. */
export function getFilteredAiMemoryInspectionView(
  memory: AiActorMemory | null | undefined,
  opts: {
    viewerId?: string;
    viewerTeamId?: string | null;
    ownerTeamId?: string | null;
    teammateIds?: string[];
    fullInspection?: boolean;
    persistentMemoryEnabled?: boolean;
  },
): AiMemoryInspectionView {
  const m = memory || createEmptyAiActorMemory('');
  const ally =
    Boolean(opts.fullInspection) ||
    Boolean(opts.viewerTeamId && opts.ownerTeamId && opts.viewerTeamId === opts.ownerTeamId);
  const redacted = !ally;
  const rels = Object.values(m.relationships).sort((a, b) => a.actorId.localeCompare(b.actorId));
  const profiles = Object.values(m.opponentModels).map(om => ({
    actorId: om.actorId,
    aggressionPreference: om.beliefs.aggressive?.value ?? 0,
    expansionPreference: om.beliefs.expansion?.value ?? 0,
    economicPreference: om.beliefs.economic?.value ?? 0,
    cooperationPreference: om.beliefs.cooperative?.value ?? 0,
    confidence: Math.max(0, ...Object.values(om.beliefs).map(b => b.confidence)),
    observationCount: om.totalOpportunities,
  }));
  const strongest = rels.slice().sort((a, b) => b.rivalry + b.grievance - (a.rivalry + a.grievance))[0];
  const horizonSnapshot = buildAiMemoryHorizonSnapshot(m, { persistentMemoryEnabled: opts.persistentMemoryEnabled });
  return {
    ownerActorId: m.ownerActorId,
    isRedacted: redacted,
    eventCount: m.events.length,
    horizonSnapshot,
    influenceSummary:
      strongest && strongest.rivalry + strongest.grievance > 10
        ? `Most wary of ${strongest.actorId} (rivalry ${strongest.rivalry}, grievance ${strongest.grievance}).`
        : m.events.length
          ? 'Memory is shaping choices only lightly so far.'
          : null,
    recentEvents: (redacted ? m.events.filter(e => Math.abs(e.valence) >= 0.3) : m.events).slice(-8).reverse(),
    relationships: redacted
      ? rels.filter(r => (opts.teammateIds || []).includes(r.actorId) || r.actorId === opts.viewerId)
      : rels,
    majorGrievances: m.events.filter(e => e.valence <= -0.6).slice(-4).reverse(),
    majorGratitude: m.events.filter(e => e.valence >= 0.6).slice(-4).reverse(),
    strategicProfiles: redacted ? [] : profiles,
    opponentModels: redacted ? [] : Object.values(m.opponentModels),
    adaptivePlan: redacted ? null : m.adaptivePlan,
  };
}

export function describeRelationshipForInspection(rel: AiRelationship): string {
  const tone =
    rel.grievance > rel.gratitude + 15
      ? 'wary'
      : rel.gratitude > rel.grievance + 15
        ? 'warm'
        : 'mixed';
  return `${rel.actorId}: trust ${rel.trust.toFixed(0)}, rivalry ${rel.rivalry.toFixed(0)}, grievance ${rel.grievance.toFixed(0)}, gratitude ${rel.gratitude.toFixed(0)} (${tone}).`;
}

export function buildInspectionExplainabilityNarrative(view: AiMemoryInspectionView): string[] {
  const lines: string[] = [];
  lines.push(describeHorizonLine(view.horizonSnapshot));
  if (view.isRedacted) {
    lines.push('Rival private beliefs are hidden — only high-signal events and safe relationship rows are shown.');
  }
  if (view.influenceSummary) lines.push(view.influenceSummary);
  view.relationships.slice(0, 6).forEach(r => lines.push(describeRelationshipForInspection(r)));
  if (view.majorGrievances?.length) {
    lines.push(`Notable grievances (${view.majorGrievances.length}): ${view.majorGrievances.map(e => e.summary).slice(0, 2).join('; ')}`);
  }
  if (view.majorGratitude?.length) {
    lines.push(`Notable gratitude (${view.majorGratitude.length}): ${view.majorGratitude.map(e => e.summary).slice(0, 2).join('; ')}`);
  }
  if (!view.isRedacted && view.strategicProfiles.length) {
    const top = view.strategicProfiles[0];
    lines.push(
      `Learned tendency toward ${top.actorId}: aggression ${(top.aggressionPreference * 100).toFixed(0)}%, expansion ${(top.expansionPreference * 100).toFixed(0)}% (${top.observationCount} observations).`,
    );
  }
  if (view.adaptivePlan && !view.isRedacted) {
    lines.push(`Adaptive plan: ${view.adaptivePlan.objectiveId.replace(/_/g, ' ')} (${view.adaptivePlan.status}).`);
  }
  lines.push(view.horizonSnapshot.explainabilityDisclaimer);
  return lines;
}

function describeHorizonLine(snapshot: AiMemoryHorizonSnapshot): string {
  if (snapshot.longTermPriorActive) {
    return `Memory mixes ${snapshot.shortTermEventCount} match event(s) with ${snapshot.longTermPriorBeliefCount} cross-match prior belief(s).`;
  }
  return snapshot.qualityNote;
}

export function summarizeRecentEventsForAskTheGame(events: AiMemoryEvent[], limit = 4): string[] {
  return events.slice(0, limit).map(e => `Turn ${e.turn}: ${e.summary} (${e.valence >= 0 ? 'helpful' : e.valence <= 0 ? 'hostile' : 'neutral'} signal).`);
}
