import type { AiActorMemory, AiBelief, AiOpponentModel } from './types.ts';

export interface OpponentBeliefExplainLine {
  actorId: string;
  beliefKey: string;
  value: number;
  confidence: number;
  source: AiBelief['source'];
  line: string;
}

export function listOpponentBeliefExplainLines(
  memory: AiActorMemory | null | undefined,
  subjectActorId: string,
  opts?: { minConfidence?: number; limit?: number },
): OpponentBeliefExplainLine[] {
  const minConf = opts?.minConfidence ?? 0.15;
  const limit = opts?.limit ?? 5;
  const om: AiOpponentModel | undefined = memory?.opponentModels?.[subjectActorId];
  if (!om) return [];
  const lines: OpponentBeliefExplainLine[] = [];
  Object.values(om.beliefs || {}).forEach(b => {
    if (b.confidence < minConf) return;
    lines.push({
      actorId: subjectActorId,
      beliefKey: b.key,
      value: b.value,
      confidence: b.confidence,
      source: b.source,
      line: `${b.key} estimate ${(b.value * 100).toFixed(0)}% (${b.source === 'persistent_prior' ? 'cross-match prior' : 'this match'}, conf ${(b.confidence * 100).toFixed(0)}%).`,
    });
  });
  return lines.sort((a, b) => b.confidence - a.confidence).slice(0, limit);
}

/** Player-facing brief for a tracked opponent model (non-redacted inspection contexts only). */
export function buildOpponentModelExplainabilityBrief(
  memory: AiActorMemory | null | undefined,
  subjectActorId: string,
): string[] {
  const om = memory?.opponentModels?.[subjectActorId];
  if (!om) {
    return [`No opponent model tracked yet for ${subjectActorId} — beliefs appear after observed opportunities.`];
  }
  const beliefs = listOpponentBeliefExplainLines(memory, subjectActorId);
  const lines = [
    `Opponent model for ${subjectActorId} (${om.totalOpportunities} observation slot(s)):`,
  ];
  if (!beliefs.length) {
    lines.push('No confident beliefs yet — memory influence stays neutral until patterns emerge.');
    return lines;
  }
  beliefs.forEach(b => lines.push(`• ${b.line}`));
  if (om.predictedObjectives?.length) {
    const top = [...om.predictedObjectives].sort((a, b) => b.probability - a.probability)[0];
    if (top && top.probability >= 0.35) {
      lines.push(
        `Predicted objective ${top.objectiveId} at ${(top.probability * 100).toFixed(0)}% — adaptive plans may reference this.`,
      );
    }
  }
  return lines;
}
