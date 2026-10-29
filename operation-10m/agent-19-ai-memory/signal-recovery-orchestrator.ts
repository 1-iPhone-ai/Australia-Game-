import {
  auditMatchExplainabilitySignalGate,
  matchExplainabilitySignalAllowed,
} from './match-explainability-signal-gate.ts';
import { buildBeaconRecoveryOrchestrator } from './beacon-recovery-orchestrator.ts';
import { buildMatchExplainabilityBeaconBundle } from './match-explainability-beacon-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SIGNAL_RECOVERY_CAP = 10;

export interface SignalRecoveryOrchestratorReport {
  signalBlocked: boolean;
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

/** Recovery path when signal gate blocks uplink rollout. */
export function buildSignalRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SignalRecoveryOrchestratorReport {
  const signal = auditMatchExplainabilitySignalGate(packs, params);
  const signalBlocked = !matchExplainabilitySignalAllowed(signal);
  const steps: string[] = [];
  if (signalBlocked) {
    if (!signal.beaconReady) {
      steps.push('Restore beacon bundle: relay and beacon export must pass.');
    }
    if (!signal.beaconExportShipped) {
      steps.push('Emit session beacon export before signal clearance.');
    }
    if (!signal.relayBeaconHealthy) {
      steps.push('Reconcile relay/beacon bridge before signal.');
    }
    steps.push(...buildBeaconRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
    if (!beacon.beaconReady) {
      steps.push('Re-run beacon readiness checklist on turn packs.');
    }
  } else {
    steps.push('Signal gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SIGNAL_RECOVERY_CAP);
  return {
    signalBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Signal recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function signalRecoveryOrchestratorWithinCap(report: SignalRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SIGNAL_RECOVERY_CAP;
}
