import {
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
import {
  buildSessionUnionExportBundle,
  sessionUnionExportShipped,
} from './session-union-export-bundle.ts';
import { auditFederationUnionBridge, federationUnionBridgeHealthy } from './federation-union-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityCommonwealthGateReport {
  commonwealthAllowed: boolean;
  unionReady: boolean;
  unionExportShipped: boolean;
  federationUnionHealthy: boolean;
  narrativeLines: string[];
}

/** Commonwealth gate: union bundle + union export + federation/union bridge. */
export function auditMatchExplainabilityCommonwealthGate(
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
): MatchExplainabilityCommonwealthGateReport {
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const unionExport = buildSessionUnionExportBundle(packs, params);
  const bridge = auditFederationUnionBridge(packs, params);
  const unionReady = matchExplainabilityUnionReady(union);
  const unionExportShipped = sessionUnionExportShipped(unionExport);
  const federationUnionHealthy = federationUnionBridgeHealthy(bridge);
  const commonwealthAllowed = unionReady && unionExportShipped && federationUnionHealthy;
  const narrativeLines = [
    `Match explainability commonwealth: ${commonwealthAllowed ? 'ALLOWED' : 'DENIED'} (union ${unionReady ? 'ok' : 'fail'}, export ${unionExportShipped ? 'ok' : 'fail'}).`,
    ...union.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    commonwealthAllowed,
    unionReady,
    unionExportShipped,
    federationUnionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityCommonwealthAllowed(report: MatchExplainabilityCommonwealthGateReport): boolean {
  return report.commonwealthAllowed;
}
