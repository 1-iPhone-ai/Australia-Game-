import {
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
import {
  buildSessionCovenantExportBundle,
  sessionCovenantExportShipped,
} from './session-covenant-export-bundle.ts';
import { auditSealCovenantBridge, sealCovenantBridgeHealthy } from './seal-covenant-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityCharterGateReport {
  charterAllowed: boolean;
  covenantReady: boolean;
  covenantExportShipped: boolean;
  sealCovenantHealthy: boolean;
  narrativeLines: string[];
}

/** Charter gate: covenant bundle + covenant export + seal/covenant bridge. */
export function auditMatchExplainabilityCharterGate(
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
): MatchExplainabilityCharterGateReport {
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const covenantExport = buildSessionCovenantExportBundle(packs, params);
  const bridge = auditSealCovenantBridge(packs, params);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const covenantExportShipped = sessionCovenantExportShipped(covenantExport);
  const sealCovenantHealthy = sealCovenantBridgeHealthy(bridge);
  const charterAllowed = covenantReady && covenantExportShipped && sealCovenantHealthy;
  const narrativeLines = [
    `Match explainability charter: ${charterAllowed ? 'ALLOWED' : 'DENIED'} (covenant ${covenantReady ? 'ok' : 'fail'}, export ${covenantExportShipped ? 'ok' : 'fail'}).`,
    ...covenant.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    charterAllowed,
    covenantReady,
    covenantExportShipped,
    sealCovenantHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityCharterAllowed(report: MatchExplainabilityCharterGateReport): boolean {
  return report.charterAllowed;
}
