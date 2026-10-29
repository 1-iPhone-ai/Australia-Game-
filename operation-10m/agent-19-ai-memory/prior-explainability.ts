import type { AiActorMemory, AiBelief, AiOpponentModel } from './types.ts';

export interface PersistentPriorExplainLine {
  subjectActorId: string;
  beliefKey: string;
  value: number;
  confidence: number;
  line: string;
}

export function listPersistentPriorBeliefs(memory: AiActorMemory | null | undefined): PersistentPriorExplainLine[] {
  const out: PersistentPriorExplainLine[] = [];
  Object.values(memory?.opponentModels || {}).forEach((om: AiOpponentModel) => {
    Object.values(om.beliefs || {}).forEach((b: AiBelief) => {
      if (b.source !== 'persistent_prior' || b.confidence <= 0.05) return;
      out.push({
        subjectActorId: om.actorId,
        beliefKey: b.key,
        value: b.value,
        confidence: b.confidence,
        line: `Saved prior: ${om.actorId} tends toward ${b.key} (${(b.value * 100).toFixed(0)}% estimate, confidence ${(b.confidence * 100).toFixed(0)}%).`,
      });
    });
  });
  return out.sort((a, b) => b.confidence - a.confidence || a.subjectActorId.localeCompare(b.subjectActorId));
}

export function buildPersistentPriorExplainabilityBrief(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean },
): string[] {
  if (!opts?.persistentMemoryEnabled) {
    return ['Cross-match priors are off — only this match’s observations affect expectations.'];
  }
  const priors = listPersistentPriorBeliefs(memory);
  if (!priors.length) {
    return ['Persistent memory is on, but no cross-match prior beliefs are active yet in this match.'];
  }
  return [
    `${priors.length} cross-match prior belief(s) nudge expectations until this match observes more:`,
    ...priors.slice(0, 4).map(p => `• ${p.line}`),
    'Priors are capped and never override committed events or legal actions.',
  ];
}
