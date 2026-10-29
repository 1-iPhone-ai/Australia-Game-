/**
 * Turn orchestrator — V1027 disaster resilience (SECTION 20BX), post–§11A.
 */
import type { V1028DresPersisted, V1028DresRegionId, V1028DresTurnInput, V1028DresTurnResult } from '../types/core';
import {
  V1028_DRES_clamp,
  V1028_DRES_hash,
  V1028_DRES_mixSeed,
  V1028_DRES_resilienceBandFromScore,
  V1028_DRES_weightedMean,
} from './disaster-resilience-utils';
import { createEmptyV1028DresPersisted, sanitizeV1028DresPersisted } from '../persistence/migrations';
import { buildV1028DresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1028DresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1028DresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1028DresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1028DresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1028_DRES_evacuationCapacityGraphHash, V1028_DRES_evacuationCapacityPressure } from '../evacuation-capacity-stacks/graph-utils';
import { V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES } from '../generated/evacuation-capacity-bundle';
import {
  V1028_DRES_evaluateHazardBatch,
  V1028_DRES_listActiveHazardScenarioIds,
} from '../generated/hazard-registry';
import { V1028_DRES_EMERGENCY_RESPONSE_00_buffer } from '../emergency-response-nodes/emergency-response-00';

const REGIONS: V1028DresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1028DresInputHash(input: V1028DresTurnInput): string {
  return V1028_DRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeHazardScenarioIds.slice(0, 12),
    nodes: input.activeEmergencyResponseIds.slice(0, 12),
  });
}

export function runV1028DresTurn(input: V1028DresTurnInput): V1028DresTurnResult {
  const persisted = sanitizeV1028DresPersisted(input.persisted ?? createEmptyV1028DresPersisted(), input.turn);

  const mix = V1028_DRES_mixSeed(input.seed, input.turn, 'v1028_disaster_resilience');
  const scenarioIds =
    input.activeHazardScenarioIds.length > 0
      ? input.activeHazardScenarioIds
      : V1028_DRES_listActiveHazardScenarioIds(input.turn);
  const hazardBatch = V1028_DRES_evaluateHazardBatch(input.turn, scenarioIds);

  let aggregateDisasterRisk = V1028_DRES_clamp(
    hazardBatch.meanDisasterRisk * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1028_DRES_evacuationCapacityPressure(
    V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES,
    input.turn,
    aggregateDisasterRisk,
  );

  const supplyBridge = computeV1028DresSupply20bbBridge(input, aggregateDisasterRisk);
  const tradeBridge = computeV1028DresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1028DresEnergy20bcBridge(input, aggregateDisasterRisk);
  const workforceBridge = computeV1028DresWorkforce20bfBridge(input, aggregateDisasterRisk);

  const nodeBuffer = V1028_DRES_EMERGENCY_RESPONSE_00_buffer(input.turn);
  const aggregateResilience = V1028_DRES_clamp(
    hazardBatch.meanResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.emergencyPolicyFocus * 0.05 -
      aggregateDisasterRisk * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1028_DRES_clamp(
    aggregateResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const evacuationCapacityGraphHash = V1028_DRES_evacuationCapacityGraphHash(V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES);
  const inputHash = v1028DresInputHash(input);
  const briefing = buildV1028DresBriefing(input, aggregateDisasterRisk, aggregateResilience);

  const regionalEvacuationCapacity = { ...persisted.regionalEvacuationCapacity };
  REGIONS.forEach((region, idx) => {
    const prior = regionalEvacuationCapacity[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = hazardBatch.byRegion[region];
    const compositeCapacity = V1028_DRES_clamp(
      V1028_DRES_weightedMean([
        { weight: 1.1, value: aggregateResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.resilienceScore ?? aggregateResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalEvacuationCapacity[region] = {
      bufferIndex: V1028_DRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateDisasterRisk * 0.03, 0, 100),
      rerouteStress: V1028_DRES_clamp(
        prior.rerouteStress + (regionalTransfer?.disasterRiskIndex ?? aggregateDisasterRisk) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1028_DRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const hazardSnapshots = { ...persisted.hazardSnapshots };
  hazardBatch.snapshots.forEach((snap) => {
    hazardSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1028DresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    evacuationCapacityGraphRevision: persisted.evacuationCapacityGraphRevision + 1,
    hazardSnapshots,
    regionalEvacuationCapacity,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateDisasterRisk },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateDisasterRisk > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateDisasterRisk.toFixed(1)}; emergency_response ${aggregateResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1028_DRES_resilienceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'emergency_response',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; evacuationCapacity ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateDisasterRiskIndex: aggregateDisasterRisk,
      aggregateResilienceScore: aggregateResilience,
      disasterClimateHarmonyScore: fiscalFederalism,
      evacuationCapacityPressure: heatStressPressure,
      evacuationCapacityGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1028DresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1028DresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      evacuationCapacityIndex: 0.42,
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
      cascadeRiskStress: 33,
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
    shelterHeadroom: 55,
    emergencyPolicyFocus: 48,
    activeHazardScenarioIds: V1028_DRES_listActiveHazardScenarioIds(turn).slice(0, 10),
    activeEmergencyResponseIds: ['emergency_response_00', 'emergency_response_01'],
    persisted: null,
  };
}

export { createEmptyV1028DresPersisted, sanitizeV1028DresPersisted };
