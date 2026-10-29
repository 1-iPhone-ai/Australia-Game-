import {
  buildMatchExplainabilityDeliveryBundle,
  matchExplainabilityDeliveryShippable,
} from './match-explainability-delivery-bundle.ts';
import {
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from './match-explainability-shipment-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface DeliveryShipmentBridgeReport {
  aligned: boolean;
  deliveryShippable: boolean;
  shipmentAllowed: boolean;
  narrativeLines: string[];
}

/** Documents whether delivery and shipment gates agree (both must pass for aligned release). */
export function auditDeliveryShipmentBridge(
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
): DeliveryShipmentBridgeReport {
  const delivery = buildMatchExplainabilityDeliveryBundle(packs, params);
  const shipment = auditMatchExplainabilityShipmentGate(packs, params);
  const deliveryShippable = matchExplainabilityDeliveryShippable(delivery);
  const shipmentAllowed = matchExplainabilityShipmentAllowed(shipment);
  const aligned = deliveryShippable === shipmentAllowed;
  const narrativeLines = [
    `Delivery/shipment bridge: ${aligned ? 'ALIGNED' : 'DIVERGED'} (delivery ${deliveryShippable ? 'ship' : 'block'}, shipment ${shipmentAllowed ? 'allow' : 'deny'}).`,
  ];
  return { aligned, deliveryShippable, shipmentAllowed, narrativeLines };
}

export function deliveryShipmentBridgeAligned(report: DeliveryShipmentBridgeReport): boolean {
  return report.aligned;
}
