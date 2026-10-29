/**
 * Turn orchestrator — V1027 supply chain network resilience (SECTION 20CD), post–§11A.
 */
import type { V1033ScresPersisted, V1033ScresRegionId, V1033ScresTurnInput, V1033ScresTurnResult } from '../types/core';
import {
  V1033_SCRES_clamp,
  V1033_SCRES_hash,
  V1033_SCRES_mixSeed,
  V1033_SCRES_supplyChainResilienceBandFromScore,
  V1033_SCRES_weightedMean,
} from './supply-chain-resilience-utils';
import { createEmptyV1033ScresPersisted, sanitizeV1033ScresPersisted } from '../persistence/migrations';
import { buildV1033ScresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1033ScresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1033ScresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1033ScresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1033ScresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1033_SCRES_corridorBufferGraphHash, V1033_SCRES_corridorBufferPressure } from '../corridor-buffer-stacks/graph-utils';
import { V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES } from '../generated/corridor-buffer-bundle';
import {
  V1033_SCRES_evaluateDisruptionBatch,
  V1033_SCRES_listActiveDisruptionScenarioIds,
} from '../generated/disruption-registry';
import { V1033_SCRES_HUB_ZONE_00_buffer } from '../hub-zone-nodes/hub-zone-00';

const REGIONS: V1033ScresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1033ScresInputHash(input: V1033ScresTurnInput): string {
  return V1033_SCRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeDisruptionScenarioIds.slice(0, 12),
    nodes: input.activeHubZoneIds.slice(0, 12),
  });
}

export function runV1033ScresTurn(input: V1033ScresTurnInput): V1033ScresTurnResult {
  const persisted = sanitizeV1033ScresPersisted(input.persisted ?? createEmptyV1033ScresPersisted(), input.turn);

  const mix = V1033_SCRES_mixSeed(input.seed, input.turn, 'v1033_supply_chain_resilience');
  const scenarioIds =
    input.activeDisruptionScenarioIds.length > 0
      ? input.activeDisruptionScenarioIds
      : V1033_SCRES_listActiveDisruptionScenarioIds(input.turn);
  const disruptionBatch = V1033_SCRES_evaluateDisruptionBatch(input.turn, scenarioIds);

  let aggregateLogisticsStressExposure = V1033_SCRES_clamp(
    disruptionBatch.meanLogisticsStressExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1033_SCRES_corridorBufferPressure(
    V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES,
    input.turn,
    aggregateLogisticsStressExposure,
  );

  const supplyBridge = computeV1033ScresSupply20bbBridge(input, aggregateLogisticsStressExposure);
  const tradeBridge = computeV1033ScresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1033ScresEnergy20bcBridge(input, aggregateLogisticsStressExposure);
  const workforceBridge = computeV1033ScresWorkforce20bfBridge(input, aggregateLogisticsStressExposure);

  const nodeBuffer = V1033_SCRES_HUB_ZONE_00_buffer(input.turn);
  const aggregateSupplyChainResilience = V1033_SCRES_clamp(
    disruptionBatch.meanTelecomResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.supplyChainResiliencePolicyFocus * 0.05 -
      aggregateLogisticsStressExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1033_SCRES_clamp(
    aggregateSupplyChainResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const corridorBufferGraphHash = V1033_SCRES_corridorBufferGraphHash(V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES);
  const inputHash = v1033ScresInputHash(input);
  const briefing = buildV1033ScresBriefing(input, aggregateLogisticsStressExposure, aggregateSupplyChainResilience);

  const regionalCorridorBuffer = { ...persisted.regionalCorridorBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalCorridorBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = disruptionBatch.byRegion[region];
    const compositeCapacity = V1033_SCRES_clamp(
      V1033_SCRES_weightedMean([
        { weight: 1.1, value: aggregateSupplyChainResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.supplyChainResilienceScore ?? aggregateSupplyChainResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalCorridorBuffer[region] = {
      bufferIndex: V1033_SCRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateLogisticsStressExposure * 0.03, 0, 100),
      rerouteStress: V1033_SCRES_clamp(
        prior.rerouteStress + (regionalTransfer?.logisticsStressExposureIndex ?? aggregateLogisticsStressExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1033_SCRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const disruptionSnapshots = { ...persisted.disruptionSnapshots };
  disruptionBatch.snapshots.forEach((snap) => {
    disruptionSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1033ScresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    corridorBufferGraphRevision: persisted.corridorBufferGraphRevision + 1,
    disruptionSnapshots,
    regionalCorridorBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateLogisticsStressExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateLogisticsStressExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateLogisticsStressExposure.toFixed(1)}; hub_zone ${aggregateSupplyChainResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1033_SCRES_supplyChainResilienceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'hub_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; corridorBuffer ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateLogisticsStressExposureIndex: aggregateLogisticsStressExposure,
      aggregateSupplyChainResilienceScore: aggregateSupplyChainResilience,
      logisticsNetworkHarmonyScore: fiscalFederalism,
      corridorBufferPressure: heatStressPressure,
      corridorBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1033ScresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1033ScresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      corridorBufferIndex: 0.42,
    },
    trade20ba: {
      turn,
      sanctionsPressure: 22,
      importDependencyRatio: 0.38,
      exportLaneStability: 56,
    },
    energy20bc: {
      turn,
      gridStability: 61,
      reserveMarginPct: 14,
      routingCascadeRisk: 33,
    },
    workforce20bf: {
      turn,
      specialistGap: 29,
      nationalReadiness: 57,
      mismatchIndex: 41,
    },
    publicServices20az: {
      turn,
      clinicCapacityScore: 64,
      digitalServiceCoverage: 0.39,
      serviceDeliveryReadiness: 51,
    },
    climateAdaptation20br: {
      turn,
      heatStressPressure: 34,
      grantStackLoad: 0.31,
      resilienceDriftTurns: 19,
    },
    digitalGovernance20bt: {
      turn,
      modelGovernancePressure: 26,
      grantStackLoad: 0.27,
      alignmentDriftTurns: 15,
    },
    regionalHealthSystems20bv: {
      turn,
      hospitalSurgePressure: 30,
      grantStackLoad: 0.24,
      bedCapacityDriftTurns: 13,
    },
    reserveHeadroom: 55,
    supplyChainResiliencePolicyFocus: 48,
    activeDisruptionScenarioIds: V1033_SCRES_listActiveDisruptionScenarioIds(turn).slice(0, 10),
    activeHubZoneIds: ['hub_zone_00', 'hub_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1033ScresPersisted, sanitizeV1033ScresPersisted };
