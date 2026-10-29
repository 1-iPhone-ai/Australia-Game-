import {
  auditMatchExplainabilityHandshakeGate,
  matchExplainabilityHandshakeAllowed,
} from './match-explainability-handshake-gate.ts';
import { buildUplinkRecoveryOrchestrator } from './uplink-recovery-orchestrator.ts';
import { buildMatchExplainabilityUplinkBundle } from './match-explainability-uplink-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_HANDSHAKE_RECOVERY_CAP = 10;

export interface HandshakeRecoveryOrchestratorReport {
  handshakeBlocked: boolean;
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

/** Recovery path when handshake gate blocks ack rollout. */
export function buildHandshakeRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): HandshakeRecoveryOrchestratorReport {
  const handshake = auditMatchExplainabilityHandshakeGate(packs, params);
  const handshakeBlocked = !matchExplainabilityHandshakeAllowed(handshake);
  const steps: string[] = [];
  if (handshakeBlocked) {
    if (!handshake.uplinkReady) {
      steps.push('Restore uplink bundle: signal and uplink export must pass.');
    }
    if (!handshake.uplinkExportShipped) {
      steps.push('Emit session uplink export before handshake clearance.');
    }
    if (!handshake.signalUplinkHealthy) {
      steps.push('Reconcile signal/uplink bridge before handshake.');
    }
    steps.push(...buildUplinkRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
    if (!uplink.uplinkReady) {
      steps.push('Re-run uplink readiness checklist on turn packs.');
    }
  } else {
    steps.push('Handshake gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_HANDSHAKE_RECOVERY_CAP);
  return {
    handshakeBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Handshake recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function handshakeRecoveryOrchestratorWithinCap(report: HandshakeRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_HANDSHAKE_RECOVERY_CAP;
}
