import {
  buildSessionVertexExportBundle,
  type SessionVertexExportBundle,
} from './session-vertex-export-bundle.ts';
import {
  buildMatchExplainabilityNexusBundle,
  matchExplainabilityNexusReady,
} from './match-explainability-nexus-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionNexusExportBundle extends SessionVertexExportBundle {
  nexusReady: boolean;
  nexusSchema: string;
}

/** Nexus export wraps vertex export when nexus bundle is ready. */
export function buildSessionNexusExportBundle(
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
): SessionNexusExportBundle {
  const base = buildSessionVertexExportBundle(packs, params);
  const nexus = buildMatchExplainabilityNexusBundle(packs, params);
  const nexusReady = matchExplainabilityNexusReady(nexus);
  const exports = nexusReady ? base.exports : [];
  return {
    ...base,
    exports,
    nexusReady,
    nexusSchema: 'agent19.nexus.v1',
    releaseReady: nexusReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Nexus export: ${nexusReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionNexusExportShipped(bundle: SessionNexusExportBundle): boolean {
  return bundle.nexusReady && bundle.exports.length > 0 && bundle.nexusSchema === 'agent19.nexus.v1';
}
