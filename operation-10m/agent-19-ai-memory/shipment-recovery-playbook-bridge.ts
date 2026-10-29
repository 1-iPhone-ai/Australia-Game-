import {
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from './match-explainability-shipment-gate.ts';
import { buildFinalGateRecoveryHints } from './final-gate-recovery-bridge.ts';
import { auditMatchExplainabilityFinalGate } from './match-explainability-final-gate.ts';
import { buildMatchRecoveryPlaybook } from './match-recovery-playbook.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SHIPMENT_RECOVERY_CAP = 8;

export interface ShipmentRecoveryPlaybookBridge {
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

/** When shipment is blocked, merge final-gate hints and match recovery playbook steps. */
export function buildShipmentRecoveryPlaybookBridge(
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
): ShipmentRecoveryPlaybookBridge {
  const shipment = auditMatchExplainabilityShipmentGate(packs, params);
  const steps: string[] = [];
  if (!matchExplainabilityShipmentAllowed(shipment)) {
    if (!shipment.finalGateOpen) {
      steps.push(...buildFinalGateRecoveryHints(auditMatchExplainabilityFinalGate(packs, params)));
    }
    if (!shipment.confidenceExportOk) {
      steps.push('Raise session confidence or reopen export gate before shipment.');
    }
    if (!shipment.negotiationAligned) {
      steps.push('Align negotiation threshold shifts with relationship influence slices.');
    }
    steps.push(...buildMatchRecoveryPlaybook(packs, params).steps);
  } else {
    steps.push('Shipment gate open — no recovery steps required.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SHIPMENT_RECOVERY_CAP);
  return {
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Shipment recovery bridge: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function shipmentRecoveryNeeded(
  packs: TurnExplainabilityPack[],
  params: Parameters<typeof buildShipmentRecoveryPlaybookBridge>[1],
): boolean {
  return !matchExplainabilityShipmentAllowed(auditMatchExplainabilityShipmentGate(packs, params));
}
