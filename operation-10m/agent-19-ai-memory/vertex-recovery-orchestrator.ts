import {
  auditMatchExplainabilityVertexGate,
  matchExplainabilityVertexAllowed,
} from './match-explainability-vertex-gate.ts';
import { buildCrestRecoveryOrchestrator } from './crest-recovery-orchestrator.ts';
import { buildMatchExplainabilityCrestBundle } from './match-explainability-crest-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_VERTEX_RECOVERY_CAP = 10;

export interface VertexRecoveryOrchestratorReport {
  vertexBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when vertex gate blocks nexus rollout. */
export function buildVertexRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): VertexRecoveryOrchestratorReport {
  const vertex = auditMatchExplainabilityVertexGate(packs, params);
  const vertexBlocked = !matchExplainabilityVertexAllowed(vertex);
  const steps: string[] = [];
  if (vertexBlocked) {
    if (!vertex.crestReady) {
      steps.push('Restore crest bundle: acme and crest export must pass.');
    }
    if (!vertex.crestExportShipped) {
      steps.push('Emit session crest export before vertex clearance.');
    }
    if (!vertex.acmeCrestHealthy) {
      steps.push('Reconcile acme/crest bridge before vertex.');
    }
    steps.push(...buildCrestRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const crest = buildMatchExplainabilityCrestBundle(packs, params);
    if (!crest.crestReady) {
      steps.push('Re-run crest readiness checklist on turn packs.');
    }
  } else {
    steps.push('Vertex gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_VERTEX_RECOVERY_CAP);
  return {
    vertexBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Vertex recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function vertexRecoveryOrchestratorWithinCap(report: VertexRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_VERTEX_RECOVERY_CAP;
}
