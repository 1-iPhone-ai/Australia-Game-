/**
 * Turn orchestrator — V1027 information integrity network resilience (SECTION 20CI), post–§11A.
 */
import type { V1036IiresPersisted, V1036IiresRegionId, V1036IiresTurnInput, V1036IiresTurnResult } from '../types/core';
import {
  V1036_IIRES_clamp,
  V1036_IIRES_hash,
  V1036_IIRES_mixSeed,
  V1036_IIRES_informationIntegrityResilienceBandFromScore,
  V1036_IIRES_weightedMean,
} from './information-integrity-resilience-utils';
import { createEmptyV1036IiresPersisted, sanitizeV1036IiresPersisted } from '../persistence/migrations';
import { buildV1036IiresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1036IiresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1036IiresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1036IiresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1036IiresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1036_IIRES_attestationMeshGraphHash, V1036_IIRES_attestationMeshPressure } from '../attestation-mesh-stacks/graph-utils';
import { V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES } from '../generated/attestation-mesh-bundle';
import {
  V1036_IIRES_evaluateAttestationBatch,
  V1036_IIRES_listActiveAttestationScenarioIds,
} from '../generated/attestation-registry';
import { V1036_IIRES_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';

const REGIONS: V1036IiresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1036IiresInputHash(input: V1036IiresTurnInput): string {
  return V1036_IIRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeAttestationScenarioIds.slice(0, 12),
    nodes: input.activeFacilityZoneIds.slice(0, 12),
  });
}

export function runV1036IiresTurn(input: V1036IiresTurnInput): V1036IiresTurnResult {
  const persisted = sanitizeV1036IiresPersisted(input.persisted ?? createEmptyV1036IiresPersisted(), input.turn);

  const mix = V1036_IIRES_mixSeed(input.seed, input.turn, 'v1036_information_integrity_resilience');
  const scenarioIds =
    input.activeAttestationScenarioIds.length > 0
      ? input.activeAttestationScenarioIds
      : V1036_IIRES_listActiveAttestationScenarioIds(input.turn);
  const attestationBatch = V1036_IIRES_evaluateAttestationBatch(input.turn, scenarioIds);

  let aggregateAttestationMeshStressExposure = V1036_IIRES_clamp(
    attestationBatch.meanAttestationMeshStressExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1036_IIRES_attestationMeshPressure(
    V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES,
    input.turn,
    aggregateAttestationMeshStressExposure,
  );

  const supplyBridge = computeV1036IiresSupply20bbBridge(input, aggregateAttestationMeshStressExposure);
  const tradeBridge = computeV1036IiresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1036IiresEnergy20bcBridge(input, aggregateAttestationMeshStressExposure);
  const workforceBridge = computeV1036IiresWorkforce20bfBridge(input, aggregateAttestationMeshStressExposure);

  const nodeBuffer = V1036_IIRES_FACILITY_ZONE_00_buffer(input.turn);
  const aggregateInformationIntegrityResilience = V1036_IIRES_clamp(
    attestationBatch.meanTelecomResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.informationIntegrityResiliencePolicyFocus * 0.05 -
      aggregateAttestationMeshStressExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1036_IIRES_clamp(
    aggregateInformationIntegrityResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const attestationMeshGraphHash = V1036_IIRES_attestationMeshGraphHash(V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES);
  const inputHash = v1036IiresInputHash(input);
  const briefing = buildV1036IiresBriefing(input, aggregateAttestationMeshStressExposure, aggregateInformationIntegrityResilience);

  const regionalAttestationMesh = { ...persisted.regionalAttestationMesh };
  REGIONS.forEach((region, idx) => {
    const prior = regionalAttestationMesh[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = attestationBatch.byRegion[region];
    const compositeCapacity = V1036_IIRES_clamp(
      V1036_IIRES_weightedMean([
        { weight: 1.1, value: aggregateInformationIntegrityResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.informationIntegrityResilienceScore ?? aggregateInformationIntegrityResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalAttestationMesh[region] = {
      bufferIndex: V1036_IIRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateAttestationMeshStressExposure * 0.03, 0, 100),
      rerouteStress: V1036_IIRES_clamp(
        prior.rerouteStress + (regionalTransfer?.attestationMeshStressExposureIndex ?? aggregateAttestationMeshStressExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1036_IIRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const attestationSnapshots = { ...persisted.attestationSnapshots };
  attestationBatch.snapshots.forEach((snap) => {
    attestationSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1036IiresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    attestationMeshGraphRevision: persisted.attestationMeshGraphRevision + 1,
    attestationSnapshots,
    regionalAttestationMesh,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateAttestationMeshStressExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateAttestationMeshStressExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateAttestationMeshStressExposure.toFixed(1)}; facility_zone ${aggregateInformationIntegrityResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1036_IIRES_informationIntegrityResilienceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'facility_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; attestationMesh ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateAttestationMeshStressExposureIndex: aggregateAttestationMeshStressExposure,
      aggregateInformationIntegrityResilienceScore: aggregateInformationIntegrityResilience,
      attestationMeshNetworkHarmonyScore: fiscalFederalism,
      attestationMeshPressure: heatStressPressure,
      attestationMeshGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1036IiresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1036IiresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      attestationMeshIndex: 0.42,
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
    informationIntegrityResiliencePolicyFocus: 48,
    activeAttestationScenarioIds: V1036_IIRES_listActiveAttestationScenarioIds(turn).slice(0, 10),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1036IiresPersisted, sanitizeV1036IiresPersisted };
