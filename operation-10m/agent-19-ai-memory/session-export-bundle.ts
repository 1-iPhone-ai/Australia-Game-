import { auditExplainabilityExportGate, explainabilityExportAllowed } from './explainability-export-gate.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SESSION_EXPORT_TURN_CAP = 12;

export interface SessionExportBundle {
  turnCount: number;
  exports: Record<string, unknown>[];
  narrativeLines: string[];
}

/** Builds capped per-turn debug exports when session export gate allows. */
export function buildSessionExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionExportBundle {
  const exports: Record<string, unknown>[] = [];
  packs.slice(0, AGENT19_SESSION_EXPORT_TURN_CAP).forEach((pack, i) => {
    const gate = auditExplainabilityExportGate(packs, {
      ...params,
      exportTurnIndex: i,
    });
    if (explainabilityExportAllowed(gate) && gate.exportPayload) {
      exports.push({ turn: pack.turn, ...gate.exportPayload });
    }
  });
  const narrativeLines = [
    `Session export bundle: ${exports.length}/${Math.min(packs.length, AGENT19_SESSION_EXPORT_TURN_CAP)} turn export(s) materialized.`,
  ];
  return { turnCount: packs.length, exports, narrativeLines };
}

export function sessionExportBundleWithinCap(bundle: SessionExportBundle): boolean {
  return bundle.exports.length <= AGENT19_SESSION_EXPORT_TURN_CAP;
}
