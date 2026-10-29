import { buildFinalGateRecoveryHints } from './final-gate-recovery-bridge.ts';
import { auditMatchExplainabilityFinalGate } from './match-explainability-final-gate.ts';
import { buildShipmentRecoveryPlaybookBridge } from './shipment-recovery-playbook-bridge.ts';
import { buildMatchRecoveryPlaybook } from './match-recovery-playbook.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP = 10;

export interface LaunchRecoveryOrchestratorReport {
  launchBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

/** Ordered recovery when launch is blocked — merges shipment, final-gate, and match playbooks. */
export function buildLaunchRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
  launchAllowed: boolean,
): LaunchRecoveryOrchestratorReport {
  const steps: string[] = [];
  if (launchAllowed) {
    steps.push('Launch gate GO — orchestrator idle.');
  } else {
    steps.push(...buildShipmentRecoveryPlaybookBridge(packs, params).steps);
    steps.push(...buildFinalGateRecoveryHints(auditMatchExplainabilityFinalGate(packs, params)));
    steps.push(...buildMatchRecoveryPlaybook(packs, params).steps.slice(0, 3));
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP);
  return {
    launchBlocked: !launchAllowed,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Launch recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 4)],
  };
}

export function launchRecoveryOrchestratorWithinCap(report: LaunchRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP;
}
