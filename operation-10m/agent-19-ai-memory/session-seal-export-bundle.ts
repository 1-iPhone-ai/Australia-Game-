import {
  buildSessionConfirmExportBundle,
  type SessionConfirmExportBundle,
} from './session-confirm-export-bundle.ts';
import {
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionSealExportBundle extends SessionConfirmExportBundle {
  sealReady: boolean;
  sealSchema: string;
}

/** Seal export wraps confirm export when seal bundle is ready. */
export function buildSessionSealExportBundle(
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
): SessionSealExportBundle {
  const base = buildSessionConfirmExportBundle(packs, params);
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const sealReady = matchExplainabilitySealReady(seal);
  const exports = sealReady ? base.exports : [];
  return {
    ...base,
    exports,
    sealReady,
    sealSchema: 'agent19.seal.v1',
    releaseReady: sealReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Seal export: ${sealReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSealExportShipped(bundle: SessionSealExportBundle): boolean {
  return (
    bundle.sealReady &&
    bundle.exports.length > 0 &&
    bundle.sealSchema === 'agent19.seal.v1'
  );
}
