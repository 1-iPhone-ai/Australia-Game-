import {
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
import {
  buildSessionSovereignExportBundle,
  sessionSovereignExportShipped,
} from './session-sovereign-export-bundle.ts';
import { auditRealmSovereignBridge, realmSovereignBridgeHealthy } from './realm-sovereign-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityImperialGateReport {
  imperialAllowed: boolean;
  sovereignReady: boolean;
  sovereignExportShipped: boolean;
  realmSovereignHealthy: boolean;
  narrativeLines: string[];
}

/** Imperial gate: sovereign bundle + sovereign export + realm/sovereign bridge. */
export function auditMatchExplainabilityImperialGate(
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
): MatchExplainabilityImperialGateReport {
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const sovereignExport = buildSessionSovereignExportBundle(packs, params);
  const bridge = auditRealmSovereignBridge(packs, params);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const sovereignExportShipped = sessionSovereignExportShipped(sovereignExport);
  const realmSovereignHealthy = realmSovereignBridgeHealthy(bridge);
  const imperialAllowed = sovereignReady && sovereignExportShipped && realmSovereignHealthy;
  const narrativeLines = [
    `Match explainability imperial: ${imperialAllowed ? 'ALLOWED' : 'DENIED'} (sovereign ${sovereignReady ? 'ok' : 'fail'}, export ${sovereignExportShipped ? 'ok' : 'fail'}).`,
    ...sovereign.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    imperialAllowed,
    sovereignReady,
    sovereignExportShipped,
    realmSovereignHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityImperialAllowed(report: MatchExplainabilityImperialGateReport): boolean {
  return report.imperialAllowed;
}
