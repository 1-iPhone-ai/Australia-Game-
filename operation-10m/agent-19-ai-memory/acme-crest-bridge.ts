import {
  buildMatchExplainabilityCrestBundle,
  matchExplainabilityCrestReady,
} from './match-explainability-crest-bundle.ts';
import {
  buildMatchExplainabilityAcmeBundle,
  matchExplainabilityAcmeReady,
} from './match-explainability-acme-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface AcmeCrestBridgeReport {
  aligned: boolean;
  crestReady: boolean;
  acmeReady: boolean;
  narrativeLines: string[];
}

/** Crest-ready should match acme-ready when acme export stack passes. */
export function auditAcmeCrestBridge(
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
): AcmeCrestBridgeReport {
  const crest = buildMatchExplainabilityCrestBundle(packs, params);
  const acme = buildMatchExplainabilityAcmeBundle(packs, params);
  const crestReady = matchExplainabilityCrestReady(crest);
  const acmeReady = matchExplainabilityAcmeReady(acme);
  const aligned = crestReady === acmeReady;
  const narrativeLines = [
    `Acme/crest bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (crest ${crestReady ? 'ok' : 'fail'}, acme ${acmeReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, crestReady, acmeReady, narrativeLines };
}

export function acmeCrestBridgeHealthy(report: AcmeCrestBridgeReport): boolean {
  return report.crestReady && report.acmeReady && report.aligned;
}
