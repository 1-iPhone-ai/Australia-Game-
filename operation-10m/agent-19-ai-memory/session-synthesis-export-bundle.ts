import {
  buildSessionNexusExportBundle,
  type SessionNexusExportBundle,
} from './session-nexus-export-bundle.ts';
import {
  buildMatchExplainabilitySynthesisBundle,
  matchExplainabilitySynthesisReady,
} from './match-explainability-synthesis-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionSynthesisExportBundle extends SessionNexusExportBundle {
  synthesisReady: boolean;
  synthesisSchema: string;
}

/** Synthesis export wraps nexus export when synthesis bundle is ready. */
export function buildSessionSynthesisExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionSynthesisExportBundle {
  const base = buildSessionNexusExportBundle(packs, params);
  const synthesis = buildMatchExplainabilitySynthesisBundle(packs, params);
  const synthesisReady = matchExplainabilitySynthesisReady(synthesis);
  const exports = synthesisReady ? base.exports : [];
  return {
    ...base,
    exports,
    synthesisReady,
    synthesisSchema: 'agent19.synthesis.v1',
    releaseReady: synthesisReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Synthesis export: ${synthesisReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSynthesisExportShipped(bundle: SessionSynthesisExportBundle): boolean {
  return bundle.synthesisReady && bundle.exports.length > 0 && bundle.synthesisSchema === 'agent19.synthesis.v1';
}
