import {
  buildMatchExplainabilityAcmeBundle,
  matchExplainabilityAcmeReady,
} from './match-explainability-acme-bundle.ts';
import {
  buildSessionAcmeExportBundle,
  sessionAcmeExportShipped,
} from './session-acme-export-bundle.ts';
import { auditSummitAcmeBridge, summitAcmeBridgeHealthy } from './summit-acme-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityCrestGateReport {
  crestAllowed: boolean;
  acmeReady: boolean;
  acmeExportShipped: boolean;
  summitAcmeHealthy: boolean;
  narrativeLines: string[];
}

/** Crest gate: acme bundle + acme export + summit/acme bridge. */
export function auditMatchExplainabilityCrestGate(
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
): MatchExplainabilityCrestGateReport {
  const acme = buildMatchExplainabilityAcmeBundle(packs, params);
  const acmeExport = buildSessionAcmeExportBundle(packs, params);
  const bridge = auditSummitAcmeBridge(packs, params);
  const acmeReady = matchExplainabilityAcmeReady(acme);
  const acmeExportShipped = sessionAcmeExportShipped(acmeExport);
  const summitAcmeHealthy = summitAcmeBridgeHealthy(bridge);
  const crestAllowed = acmeReady && acmeExportShipped && summitAcmeHealthy;
  const narrativeLines = [
    `Match explainability crest: ${crestAllowed ? 'ALLOWED' : 'DENIED'} (acme ${acmeReady ? 'ok' : 'fail'}, export ${acmeExportShipped ? 'ok' : 'fail'}).`,
    ...acme.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    crestAllowed,
    acmeReady,
    acmeExportShipped,
    summitAcmeHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityCrestAllowed(report: MatchExplainabilityCrestGateReport): boolean {
  return report.crestAllowed;
}
