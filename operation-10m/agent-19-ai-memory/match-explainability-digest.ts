import { computeMemoryHealthScorecard } from './memory-health-scorecard.ts';
import { auditExplainabilityIntegrity } from './memory-explainability-integrity.ts';
import { buildSessionExplainabilityRollup } from './session-explainability-rollup.ts';
import type { AiActorMemory } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export const AGENT19_MATCH_DIGEST_LINE_CAP = 12;

export interface MatchExplainabilityDigest {
  turnCount: number;
  healthBand: ReturnType<typeof computeMemoryHealthScorecard>['band'];
  integrityOk: boolean;
  session: ReturnType<typeof buildSessionExplainabilityRollup>;
  narrativeLines: string[];
}

/** Checkpoint / match-end rollup combining session influence, integrity, and health scorecard. */
export function buildMatchExplainabilityDigest(params: {
  packs: TurnExplainabilityPack[];
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  persistentMemoryEnabled?: boolean;
}): MatchExplainabilityDigest {
  const session = buildSessionExplainabilityRollup(params.packs);
  const integrity = auditExplainabilityIntegrity(params.memory, params.currentTurn);
  const health = computeMemoryHealthScorecard(params.memory, {
    persistentMemoryEnabled: params.persistentMemoryEnabled,
  });
  const integrityOk = integrity.boundsOk && integrity.stalenessOk;
  const narrativeLines = [
    `Match explainability digest @ turn ${params.currentTurn} (${params.packs.length} turn pack(s)).`,
    health.summaryLine,
    session.narrativeLines[0],
    integrity.narrativeLines[0],
  ];
  if (session.dominantHorizon) {
    narrativeLines.push(`Session dominant horizon: ${session.dominantHorizon}.`);
  }
  params.packs.slice(-1).forEach(p => {
    if (p.counterfactual.influencedCount > 0) {
      narrativeLines.push(
        `Latest counterfactual: ${p.counterfactual.influencedCount} decision(s) would score differently without memory on turn ${p.turn}.`,
      );
    }
  });
  return {
    turnCount: params.packs.length,
    healthBand: health.band,
    integrityOk,
    session,
    narrativeLines: narrativeLines.slice(0, AGENT19_MATCH_DIGEST_LINE_CAP),
  };
}
