import {
  buildSessionDominionExportBundle,
  type SessionDominionExportBundle,
} from './session-dominion-export-bundle.ts';
import {
  buildMatchExplainabilityHegemonyBundle,
  matchExplainabilityHegemonyReady,
} from './match-explainability-hegemony-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionHegemonyExportBundle extends SessionDominionExportBundle {
  hegemonyReady: boolean;
  hegemonySchema: string;
}

/** Hegemony export wraps dominion export when hegemony bundle is ready. */
export function buildSessionHegemonyExportBundle(
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
): SessionHegemonyExportBundle {
  const base = buildSessionDominionExportBundle(packs, params);
  const hegemony = buildMatchExplainabilityHegemonyBundle(packs, params);
  const hegemonyReady = matchExplainabilityHegemonyReady(hegemony);
  const exports = hegemonyReady ? base.exports : [];
  return {
    ...base,
    exports,
    hegemonyReady,
    hegemonySchema: 'agent19.hegemony.v1',
    releaseReady: hegemonyReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Hegemony export: ${hegemonyReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionHegemonyExportShipped(bundle: SessionHegemonyExportBundle): boolean {
  return (
    bundle.hegemonyReady &&
    bundle.exports.length > 0 &&
    bundle.hegemonySchema === 'agent19.hegemony.v1'
  );
}
