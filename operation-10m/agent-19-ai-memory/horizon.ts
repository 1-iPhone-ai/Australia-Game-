import {
  AGENT19_EXPLAINABILITY_DISCLAIMER,
  type AiActorMemory,
  type AiMemoryHorizonSnapshot,
} from './types.ts';

export function createEmptyAiActorMemory(ownerActorId: string): AiActorMemory {
  return {
    ownerActorId,
    events: [],
    relationships: {},
    opponentModels: {},
    adaptivePlan: null,
    seenKeys: [],
    lastDecayTurn: 0,
  };
}

/** Summarize match-local vs cross-match prior (mirrors V9.4 `buildAiMemoryHorizonSnapshot`). */
export function buildAiMemoryHorizonSnapshot(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean },
): AiMemoryHorizonSnapshot {
  const m = memory || createEmptyAiActorMemory('');
  let longTermPriorBeliefCount = 0;
  let matchLearnedObservationCount = 0;
  Object.values(m.opponentModels || {}).forEach(om => {
    matchLearnedObservationCount += om.totalOpportunities || 0;
    Object.values(om.beliefs || {}).forEach(b => {
      if (b.source === 'persistent_prior' && b.confidence > 0.05) longTermPriorBeliefCount += 1;
    });
  });
  const persistentOn = opts?.persistentMemoryEnabled === true;
  const qualityNote =
    longTermPriorBeliefCount > 0 && persistentOn
      ? 'Cross-match priors (saved on this device) nudge expectations; committed actions in this match still update relationships and observed tendencies.'
      : matchLearnedObservationCount > 0 || m.events.length > 0
        ? "Only this match's committed events, relationship scores, and observed actions feed memory influence right now."
        : 'Memory influence is idle until committed actions are recorded this match.';
  return {
    shortTermEventCount: m.events.length,
    shortTermRelationshipCount: Object.keys(m.relationships || {}).length,
    matchLearnedObservationCount,
    longTermPriorBeliefCount,
    longTermPriorActive: persistentOn && longTermPriorBeliefCount > 0,
    qualityNote,
    explainabilityDisclaimer: AGENT19_EXPLAINABILITY_DISCLAIMER,
  };
}
