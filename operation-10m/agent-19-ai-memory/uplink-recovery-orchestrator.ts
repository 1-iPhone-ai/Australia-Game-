import {
  auditMatchExplainabilityUplinkGate,
  matchExplainabilityUplinkAllowed,
} from './match-explainability-uplink-gate.ts';
import { buildSignalRecoveryOrchestrator } from './signal-recovery-orchestrator.ts';
import { buildMatchExplainabilitySignalBundle } from './match-explainability-signal-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_UPLINK_RECOVERY_CAP = 10;

export interface UplinkRecoveryOrchestratorReport {
  uplinkBlocked: boolean;
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

/** Recovery path when uplink gate blocks handshake rollout. */
export function buildUplinkRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): UplinkRecoveryOrchestratorReport {
  const uplink = auditMatchExplainabilityUplinkGate(packs, params);
  const uplinkBlocked = !matchExplainabilityUplinkAllowed(uplink);
  const steps: string[] = [];
  if (uplinkBlocked) {
    if (!uplink.signalReady) {
      steps.push('Restore signal bundle: beacon and signal export must pass.');
    }
    if (!uplink.signalExportShipped) {
      steps.push('Emit session signal export before uplink clearance.');
    }
    if (!uplink.beaconSignalHealthy) {
      steps.push('Reconcile beacon/signal bridge before uplink.');
    }
    steps.push(...buildSignalRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const signal = buildMatchExplainabilitySignalBundle(packs, params);
    if (!signal.signalReady) {
      steps.push('Re-run signal readiness checklist on turn packs.');
    }
  } else {
    steps.push('Uplink gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_UPLINK_RECOVERY_CAP);
  return {
    uplinkBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Uplink recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function uplinkRecoveryOrchestratorWithinCap(report: UplinkRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_UPLINK_RECOVERY_CAP;
}
