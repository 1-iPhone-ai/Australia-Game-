import {
  auditMatchExplainabilityNexusGate,
  matchExplainabilityNexusAllowed,
} from './match-explainability-nexus-gate.ts';
import { buildVertexRecoveryOrchestrator } from './vertex-recovery-orchestrator.ts';
import { buildMatchExplainabilityVertexBundle } from './match-explainability-vertex-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_NEXUS_RECOVERY_CAP = 10;

export interface NexusRecoveryOrchestratorReport {
  nexusBlocked: boolean;
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

/** Recovery path when nexus gate blocks convergence rollout. */
export function buildNexusRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): NexusRecoveryOrchestratorReport {
  const nexus = auditMatchExplainabilityNexusGate(packs, params);
  const nexusBlocked = !matchExplainabilityNexusAllowed(nexus);
  const steps: string[] = [];
  if (nexusBlocked) {
    if (!nexus.vertexReady) {
      steps.push('Restore vertex bundle: crest and vertex export must pass.');
    }
    if (!nexus.vertexExportShipped) {
      steps.push('Emit session vertex export before nexus clearance.');
    }
    if (!nexus.crestVertexHealthy) {
      steps.push('Reconcile crest/vertex bridge before nexus.');
    }
    steps.push(...buildVertexRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const vertex = buildMatchExplainabilityVertexBundle(packs, params);
    if (!vertex.vertexReady) {
      steps.push('Re-run vertex readiness checklist on turn packs.');
    }
  } else {
    steps.push('Nexus gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_NEXUS_RECOVERY_CAP);
  return {
    nexusBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Nexus recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function nexusRecoveryOrchestratorWithinCap(report: NexusRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_NEXUS_RECOVERY_CAP;
}
