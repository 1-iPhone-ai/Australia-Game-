/**
 * Turn orchestrator — V1027 provenance chain network resilience (SECTION 20CK), post–§11A.
 */
import type { V1037PcresPersisted, V1037PcresRegionId, V1037PcresTurnInput, V1037PcresTurnResult } from '../types/core';
import {
  V1037_PCRS_clamp,
  V1037_PCRS_hash,
  V1037_PCRS_mixSeed,
  V1037_PCRS_provenanceChainResilienceBandFromScore,
  V1037_PCRS_weightedMean,
} from './provenance-chain-resilience-utils';
import { createEmptyV1037PcresPersisted, sanitizeV1037PcresPersisted } from '../persistence/migrations';
import { buildV1037PcresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1037PcresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1037PcresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1037PcresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1037PcresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1037_PCRS_custodyChainMeshGraphHash, V1037_PCRS_custodyChainMeshPressure } from '../custody-chain-mesh-stacks/graph-utils';
import { V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES } from '../generated/custody-chain-mesh-bundle';
import {
  V1037_PCRS_evaluateCustodyBatch,
  V1037_PCRS_listActiveCustodyScenarioIds,
} from '../generated/custody-registry';
import { V1037_PCRS_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';

const REGIONS: V1037PcresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1037PcresInputHash(input: V1037PcresTurnInput): string {
  return V1037_PCRS_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeCustodyScenarioIds.slice(0, 12),
    nodes: input.activeFacilityZoneIds.slice(0, 12),
  });
}

export function runV1037PcresTurn(input: V1037PcresTurnInput): V1037PcresTurnResult {
  const persisted = sanitizeV1037PcresPersisted(input.persisted ?? createEmptyV1037PcresPersisted(), input.turn);

  const mix = V1037_PCRS_mixSeed(input.seed, input.turn, 'v1037_provenance_chain_resilience');
  const scenarioIds =
    input.activeCustodyScenarioIds.length > 0
      ? input.activeCustodyScenarioIds
      : V1037_PCRS_listActiveCustodyScenarioIds(input.turn);
  const custodyBatch = V1037_PCRS_evaluateCustodyBatch(input.turn, scenarioIds);

  let aggregateCustodyChainStressExposure = V1037_PCRS_clamp(
    custodyBatch.meanCustodyChainStressExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1037_PCRS_custodyChainMeshPressure(
    V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES,
    input.turn,
    aggregateCustodyChainStressExposure,
  );

  const supplyBridge = computeV1037PcresSupply20bbBridge(input, aggregateCustodyChainStressExposure);
  const tradeBridge = computeV1037PcresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1037PcresEnergy20bcBridge(input, aggregateCustodyChainStressExposure);
  const workforceBridge = computeV1037PcresWorkforce20bfBridge(input, aggregateCustodyChainStressExposure);

  const nodeBuffer = V1037_PCRS_FACILITY_ZONE_00_buffer(input.turn);
  const aggregateProvenanceChainResilience = V1037_PCRS_clamp(
    custodyBatch.meanTelecomResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.provenanceChainResiliencePolicyFocus * 0.05 -
      aggregateCustodyChainStressExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1037_PCRS_clamp(
    aggregateProvenanceChainResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const custodyChainMeshGraphHash = V1037_PCRS_custodyChainMeshGraphHash(V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES);
  const inputHash = v1037PcresInputHash(input);
  const briefing = buildV1037PcresBriefing(input, aggregateCustodyChainStressExposure, aggregateProvenanceChainResilience);

  const regionalCustodyChainMesh = { ...persisted.regionalCustodyChainMesh };
  REGIONS.forEach((region, idx) => {
    const prior = regionalCustodyChainMesh[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = custodyBatch.byRegion[region];
    const compositeCapacity = V1037_PCRS_clamp(
      V1037_PCRS_weightedMean([
        { weight: 1.1, value: aggregateProvenanceChainResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.provenanceChainResilienceScore ?? aggregateProvenanceChainResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalCustodyChainMesh[region] = {
      bufferIndex: V1037_PCRS_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateCustodyChainStressExposure * 0.03, 0, 100),
      rerouteStress: V1037_PCRS_clamp(
        prior.rerouteStress + (regionalTransfer?.custodyChainStressExposureIndex ?? aggregateCustodyChainStressExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1037_PCRS_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const custodySnapshots = { ...persisted.custodySnapshots };
  custodyBatch.snapshots.forEach((snap) => {
    custodySnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1037PcresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    custodyChainMeshGraphRevision: persisted.custodyChainMeshGraphRevision + 1,
    custodySnapshots,
    regionalCustodyChainMesh,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateCustodyChainStressExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateCustodyChainStressExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateCustodyChainStressExposure.toFixed(1)}; facility_zone ${aggregateProvenanceChainResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1037_PCRS_provenanceChainResilienceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'facility_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; custodyChainMesh ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateCustodyChainStressExposureIndex: aggregateCustodyChainStressExposure,
      aggregateProvenanceChainResilienceScore: aggregateProvenanceChainResilience,
      custodyChainNetworkHarmonyScore: fiscalFederalism,
      custodyChainMeshPressure: heatStressPressure,
      custodyChainMeshGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1037PcresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1037PcresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      custodyChainMeshIndex: 0.42,
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
    provenanceChainResiliencePolicyFocus: 48,
    activeCustodyScenarioIds: V1037_PCRS_listActiveCustodyScenarioIds(turn).slice(0, 10),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1037PcresPersisted, sanitizeV1037PcresPersisted };
