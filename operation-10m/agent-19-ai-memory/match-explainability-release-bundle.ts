import {
  buildMatchExplainabilityDeliveryBundle,
  matchExplainabilityDeliveryShippable,
} from './match-explainability-delivery-bundle.ts';
import {
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from './match-explainability-shipment-gate.ts';
import { buildSessionGiDeliveryBundle, sessionGiDeliveryReady } from './session-gi-delivery-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_RELEASE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityReleaseBundle {
  releaseReady: boolean;
  deliveryShippable: boolean;
  shipmentAllowed: boolean;
  giDeliveryReady: boolean;
  narrativeLines: string[];
}

type ReleaseParams = {
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

/** Release bundle: delivery + shipment + GI delivery must all agree before player launch. */
export function buildMatchExplainabilityReleaseBundle(
  packs: TurnExplainabilityPack[],
  params: ReleaseParams,
): MatchExplainabilityReleaseBundle {
  const delivery = buildMatchExplainabilityDeliveryBundle(packs, params);
  const shipment = auditMatchExplainabilityShipmentGate(packs, params);
  const giDelivery = buildSessionGiDeliveryBundle(packs, params);
  const deliveryShippable = matchExplainabilityDeliveryShippable(delivery);
  const shipmentAllowed = matchExplainabilityShipmentAllowed(shipment);
  const giDeliveryReady = sessionGiDeliveryReady(giDelivery);
  const releaseReady = deliveryShippable && shipmentAllowed && giDeliveryReady;
  const narrativeLines = [
    `Match explainability release: ${releaseReady ? 'READY' : 'HELD'} (delivery ${deliveryShippable ? 'ok' : 'fail'}, shipment ${shipmentAllowed ? 'ok' : 'fail'}, GI ${giDeliveryReady ? 'ok' : 'fail'}).`,
    ...delivery.narrativeLines.slice(0, 2),
    ...shipment.narrativeLines.slice(0, 1),
    ...giDelivery.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_RELEASE_NARRATIVE_CAP);
  return {
    releaseReady,
    deliveryShippable,
    shipmentAllowed,
    giDeliveryReady,
    narrativeLines,
  };
}

export function matchExplainabilityReleaseReady(bundle: MatchExplainabilityReleaseBundle): boolean {
  return bundle.releaseReady;
}
