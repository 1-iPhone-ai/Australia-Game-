import { buildSessionConfidenceRollup, sessionConfidenceAtLeast } from './session-confidence-rollup.ts';
import { auditExplainabilityExportGate, explainabilityExportAllowed } from './explainability-export-gate.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ConfidenceExportBridgeReport {
  exportAllowed: boolean;
  confidenceOk: boolean;
  minBand: ExplainabilityConfidenceBand;
  narrativeLines: string[];
}

/** Export gate plus explicit session confidence band check. */
export function auditConfidenceExportBridge(
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
): ConfidenceExportBridgeReport {
  const minBand = params.minConfidenceBand ?? 'medium';
  const confidence = buildSessionConfidenceRollup(packs, {
    memory: params.memory,
    decisionsByTurn: params.decisionsByTurn,
  });
  const confidenceOk = sessionConfidenceAtLeast(confidence, minBand);
  const exportGate = auditExplainabilityExportGate(packs, params);
  const exportAllowed = confidenceOk && explainabilityExportAllowed(exportGate);
  const narrativeLines = [
    `Confidence+export bridge: ${exportAllowed ? 'ALLOWED' : 'BLOCKED'} (confidence min ${minBand}, actual min ${confidence.minBand}).`,
    ...confidence.narrativeLines,
    ...exportGate.narrativeLines.slice(0, 1),
  ];
  return { exportAllowed, confidenceOk, minBand, narrativeLines };
}

export function confidenceExportBridgeAllowed(report: ConfidenceExportBridgeReport): boolean {
  return report.exportAllowed;
}
