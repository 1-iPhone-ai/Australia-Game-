import { auditExplainabilityIntegrity } from './memory-explainability-integrity.ts';
import { auditTurnPackComposite } from './turn-pack-composite-audit.ts';
import {
  computeExplainabilityConfidence,
  type ExplainabilityConfidenceBand,
} from './explainability-confidence-band.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface SessionConfidenceRollup {
  turnCount: number;
  minBand: ExplainabilityConfidenceBand;
  averageScore: number;
  narrativeLines: string[];
}

/** Rolls up per-turn confidence (integrity + optional composite) across a session. */
export function buildSessionConfidenceRollup(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
  },
): SessionConfidenceRollup {
  const bands: ExplainabilityConfidenceBand[] = ['low', 'medium', 'high'];
  let scoreSum = 0;
  let minIdx = bands.length - 1;
  packs.forEach((pack, i) => {
    const integrity = auditExplainabilityIntegrity(params.memory, pack.turn);
    const composite = auditTurnPackComposite(pack, {
      decisionsBefore: params.decisionsByTurn[i]?.before ?? [],
      decisionsAfter: params.decisionsByTurn[i]?.after ?? [],
    });
    const conf = computeExplainabilityConfidence({ integrity, composite });
    scoreSum += conf.score;
    const idx = bands.indexOf(conf.band);
    if (idx >= 0 && idx < minIdx) minIdx = idx;
  });
  const turnCount = packs.length;
  const averageScore = turnCount ? Math.round(scoreSum / turnCount) : 100;
  const minBand = bands[minIdx] ?? 'high';
  const narrativeLines = [
    `Session confidence rollup (${turnCount} turn(s)): min band ${minBand}, avg score ${averageScore}/100.`,
  ];
  return { turnCount, minBand, averageScore, narrativeLines };
}

export function sessionConfidenceAtLeast(rollup: SessionConfidenceRollup, minBand: ExplainabilityConfidenceBand): boolean {
  const order: ExplainabilityConfidenceBand[] = ['low', 'medium', 'high'];
  return order.indexOf(rollup.minBand) >= order.indexOf(minBand);
}
