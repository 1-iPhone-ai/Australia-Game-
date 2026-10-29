import {
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
import {
  buildSessionCommonwealthExportBundle,
  sessionCommonwealthExportShipped,
} from './session-commonwealth-export-bundle.ts';
import { auditUnionCommonwealthBridge, unionCommonwealthBridgeHealthy } from './union-commonwealth-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityRealmGateReport {
  realmAllowed: boolean;
  commonwealthReady: boolean;
  commonwealthExportShipped: boolean;
  unionCommonwealthHealthy: boolean;
  narrativeLines: string[];
}

/** Realm gate: commonwealth bundle + commonwealth export + union/commonwealth bridge. */
export function auditMatchExplainabilityRealmGate(
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
): MatchExplainabilityRealmGateReport {
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const commonwealthExport = buildSessionCommonwealthExportBundle(packs, params);
  const bridge = auditUnionCommonwealthBridge(packs, params);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const commonwealthExportShipped = sessionCommonwealthExportShipped(commonwealthExport);
  const unionCommonwealthHealthy = unionCommonwealthBridgeHealthy(bridge);
  const realmAllowed = commonwealthReady && commonwealthExportShipped && unionCommonwealthHealthy;
  const narrativeLines = [
    `Match explainability realm: ${realmAllowed ? 'ALLOWED' : 'DENIED'} (commonwealth ${commonwealthReady ? 'ok' : 'fail'}, export ${commonwealthExportShipped ? 'ok' : 'fail'}).`,
    ...commonwealth.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    realmAllowed,
    commonwealthReady,
    commonwealthExportShipped,
    unionCommonwealthHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityRealmAllowed(report: MatchExplainabilityRealmGateReport): boolean {
  return report.realmAllowed;
}
