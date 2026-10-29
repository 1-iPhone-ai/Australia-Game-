import {
  buildSessionSupremacyExportBundle,
  type SessionSupremacyExportBundle,
} from './session-supremacy-export-bundle.ts';
import {
  buildMatchExplainabilityAscendancyBundle,
  matchExplainabilityAscendancyReady,
} from './match-explainability-ascendancy-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionAscendancyExportBundle extends SessionSupremacyExportBundle {
  ascendancyReady: boolean;
  ascendancySchema: string;
}

/** Ascendancy export wraps supremacy export when ascendancy bundle is ready. */
export function buildSessionAscendancyExportBundle(
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
): SessionAscendancyExportBundle {
  const base = buildSessionSupremacyExportBundle(packs, params);
  const ascendancy = buildMatchExplainabilityAscendancyBundle(packs, params);
  const ascendancyReady = matchExplainabilityAscendancyReady(ascendancy);
  const exports = ascendancyReady ? base.exports : [];
  return {
    ...base,
    exports,
    ascendancyReady,
    ascendancySchema: 'agent19.ascendancy.v1',
    releaseReady: ascendancyReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Ascendancy export: ${ascendancyReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionAscendancyExportShipped(bundle: SessionAscendancyExportBundle): boolean {
  return (
    bundle.ascendancyReady &&
    bundle.exports.length > 0 &&
    bundle.ascendancySchema === 'agent19.ascendancy.v1'
  );
}
