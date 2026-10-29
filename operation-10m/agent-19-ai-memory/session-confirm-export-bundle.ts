import {
  buildSessionAckExportBundle,
  type SessionAckExportBundle,
} from './session-ack-export-bundle.ts';
import {
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionConfirmExportBundle extends SessionAckExportBundle {
  confirmReady: boolean;
  confirmSchema: string;
}

/** Confirm export wraps ack export when confirm bundle is ready. */
export function buildSessionConfirmExportBundle(
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
): SessionConfirmExportBundle {
  const base = buildSessionAckExportBundle(packs, params);
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const exports = confirmReady ? base.exports : [];
  return {
    ...base,
    exports,
    confirmReady,
    confirmSchema: 'agent19.confirm.v1',
    releaseReady: confirmReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Confirm export: ${confirmReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionConfirmExportShipped(bundle: SessionConfirmExportBundle): boolean {
  return (
    bundle.confirmReady &&
    bundle.exports.length > 0 &&
    bundle.confirmSchema === 'agent19.confirm.v1'
  );
}
