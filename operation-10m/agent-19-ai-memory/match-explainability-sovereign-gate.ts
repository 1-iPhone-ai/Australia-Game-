import {
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
import {
  buildSessionRealmExportBundle,
  sessionRealmExportShipped,
} from './session-realm-export-bundle.ts';
import { auditCommonwealthRealmBridge, commonwealthRealmBridgeHealthy } from './commonwealth-realm-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilitySovereignGateReport {
  sovereignAllowed: boolean;
  realmReady: boolean;
  realmExportShipped: boolean;
  commonwealthRealmHealthy: boolean;
  narrativeLines: string[];
}

/** Sovereign gate: realm bundle + realm export + commonwealth/realm bridge. */
export function auditMatchExplainabilitySovereignGate(
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
): MatchExplainabilitySovereignGateReport {
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const realmExport = buildSessionRealmExportBundle(packs, params);
  const bridge = auditCommonwealthRealmBridge(packs, params);
  const realmReady = matchExplainabilityRealmReady(realm);
  const realmExportShipped = sessionRealmExportShipped(realmExport);
  const commonwealthRealmHealthy = commonwealthRealmBridgeHealthy(bridge);
  const sovereignAllowed = realmReady && realmExportShipped && commonwealthRealmHealthy;
  const narrativeLines = [
    `Match explainability sovereign: ${sovereignAllowed ? 'ALLOWED' : 'DENIED'} (realm ${realmReady ? 'ok' : 'fail'}, export ${realmExportShipped ? 'ok' : 'fail'}).`,
    ...realm.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    sovereignAllowed,
    realmReady,
    realmExportShipped,
    commonwealthRealmHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySovereignAllowed(report: MatchExplainabilitySovereignGateReport): boolean {
  return report.sovereignAllowed;
}
