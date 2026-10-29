import {
  buildMatchExplainabilityCrestBundle,
  matchExplainabilityCrestReady,
} from './match-explainability-crest-bundle.ts';
import {
  buildSessionCrestExportBundle,
  sessionCrestExportShipped,
} from './session-crest-export-bundle.ts';
import { auditAcmeCrestBridge, acmeCrestBridgeHealthy } from './acme-crest-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityVertexGateReport {
  vertexAllowed: boolean;
  crestReady: boolean;
  crestExportShipped: boolean;
  acmeCrestHealthy: boolean;
  narrativeLines: string[];
}

/** Vertex gate: crest bundle + crest export + acme/crest bridge. */
export function auditMatchExplainabilityVertexGate(
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
): MatchExplainabilityVertexGateReport {
  const crest = buildMatchExplainabilityCrestBundle(packs, params);
  const crestExport = buildSessionCrestExportBundle(packs, params);
  const bridge = auditAcmeCrestBridge(packs, params);
  const crestReady = matchExplainabilityCrestReady(crest);
  const crestExportShipped = sessionCrestExportShipped(crestExport);
  const acmeCrestHealthy = acmeCrestBridgeHealthy(bridge);
  const vertexAllowed = crestReady && crestExportShipped && acmeCrestHealthy;
  const narrativeLines = [
    `Match explainability vertex: ${vertexAllowed ? 'ALLOWED' : 'DENIED'} (crest ${crestReady ? 'ok' : 'fail'}, export ${crestExportShipped ? 'ok' : 'fail'}).`,
    ...crest.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    vertexAllowed,
    crestReady,
    crestExportShipped,
    acmeCrestHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityVertexAllowed(report: MatchExplainabilityVertexGateReport): boolean {
  return report.vertexAllowed;
}
