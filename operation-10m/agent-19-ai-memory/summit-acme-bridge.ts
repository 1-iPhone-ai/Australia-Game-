import {
  buildMatchExplainabilityAcmeBundle,
  matchExplainabilityAcmeReady,
} from './match-explainability-acme-bundle.ts';
import {
  buildMatchExplainabilitySummitBundle,
  matchExplainabilitySummitReady,
} from './match-explainability-summit-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SummitAcmeBridgeReport {
  aligned: boolean;
  acmeReady: boolean;
  summitReady: boolean;
  narrativeLines: string[];
}

/** Acme-ready should match summit-ready when summit export stack passes. */
export function auditSummitAcmeBridge(
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
): SummitAcmeBridgeReport {
  const acme = buildMatchExplainabilityAcmeBundle(packs, params);
  const summit = buildMatchExplainabilitySummitBundle(packs, params);
  const acmeReady = matchExplainabilityAcmeReady(acme);
  const summitReady = matchExplainabilitySummitReady(summit);
  const aligned = acmeReady === summitReady;
  const narrativeLines = [
    `Summit/acme bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (acme ${acmeReady ? 'ok' : 'fail'}, summit ${summitReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, acmeReady, summitReady, narrativeLines };
}

export function summitAcmeBridgeHealthy(report: SummitAcmeBridgeReport): boolean {
  return report.acmeReady && report.summitReady && report.aligned;
}
