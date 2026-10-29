/**
 * Turn orchestrator — V1027 critical infrastructure network resilience (SECTION 20CE), post–§11A.
 */
import type { V1034CiresPersisted, V1034CiresRegionId, V1034CiresTurnInput, V1034CiresTurnResult } from '../types/core';
import {
  V1034_CIRES_clamp,
  V1034_CIRES_hash,
  V1034_CIRES_mixSeed,
  V1034_CIRES_criticalInfrastructureResilienceBandFromScore,
  V1034_CIRES_weightedMean,
} from './critical-infrastructure-resilience-utils';
import { createEmptyV1034CiresPersisted, sanitizeV1034CiresPersisted } from '../persistence/migrations';
import { buildV1034CiresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1034CiresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1034CiresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1034CiresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1034CiresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1034_CIRES_segmentBufferGraphHash, V1034_CIRES_segmentBufferPressure } from '../segment-buffer-stacks/graph-utils';
import { V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES } from '../generated/segment-buffer-bundle';
import {
  V1034_CIRES_evaluateCompromiseBatch,
  V1034_CIRES_listActiveCompromiseScenarioIds,
} from '../generated/compromise-registry';
import { V1034_CIRES_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';

const REGIONS: V1034CiresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1034CiresInputHash(input: V1034CiresTurnInput): string {
  return V1034_CIRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeCompromiseScenarioIds.slice(0, 12),
    nodes: input.activeFacilityZoneIds.slice(0, 12),
  });
}

export function runV1034CiresTurn(input: V1034CiresTurnInput): V1034CiresTurnResult {
  const persisted = sanitizeV1034CiresPersisted(input.persisted ?? createEmptyV1034CiresPersisted(), input.turn);

  const mix = V1034_CIRES_mixSeed(input.seed, input.turn, 'v1034_critical_infrastructure_resilience');
  const scenarioIds =
    input.activeCompromiseScenarioIds.length > 0
      ? input.activeCompromiseScenarioIds
      : V1034_CIRES_listActiveCompromiseScenarioIds(input.turn);
  const compromiseBatch = V1034_CIRES_evaluateCompromiseBatch(input.turn, scenarioIds);

  let aggregateCyberPhysicalStressExposure = V1034_CIRES_clamp(
    compromiseBatch.meanCyberPhysicalStressExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1034_CIRES_segmentBufferPressure(
    V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES,
    input.turn,
    aggregateCyberPhysicalStressExposure,
  );

  const supplyBridge = computeV1034CiresSupply20bbBridge(input, aggregateCyberPhysicalStressExposure);
  const tradeBridge = computeV1034CiresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1034CiresEnergy20bcBridge(input, aggregateCyberPhysicalStressExposure);
  const workforceBridge = computeV1034CiresWorkforce20bfBridge(input, aggregateCyberPhysicalStressExposure);

  const nodeBuffer = V1034_CIRES_FACILITY_ZONE_00_buffer(input.turn);
  const aggregateCriticalInfrastructureResilience = V1034_CIRES_clamp(
    compromiseBatch.meanTelecomResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.criticalInfrastructureResiliencePolicyFocus * 0.05 -
      aggregateCyberPhysicalStressExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1034_CIRES_clamp(
    aggregateCriticalInfrastructureResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const segmentBufferGraphHash = V1034_CIRES_segmentBufferGraphHash(V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES);
  const inputHash = v1034CiresInputHash(input);
  const briefing = buildV1034CiresBriefing(input, aggregateCyberPhysicalStressExposure, aggregateCriticalInfrastructureResilience);

  const regionalSegmentBuffer = { ...persisted.regionalSegmentBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalSegmentBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = compromiseBatch.byRegion[region];
    const compositeCapacity = V1034_CIRES_clamp(
      V1034_CIRES_weightedMean([
        { weight: 1.1, value: aggregateCriticalInfrastructureResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.criticalInfrastructureResilienceScore ?? aggregateCriticalInfrastructureResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalSegmentBuffer[region] = {
      bufferIndex: V1034_CIRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateCyberPhysicalStressExposure * 0.03, 0, 100),
      rerouteStress: V1034_CIRES_clamp(
        prior.rerouteStress + (regionalTransfer?.cyberPhysicalStressExposureIndex ?? aggregateCyberPhysicalStressExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1034_CIRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const compromiseSnapshots = { ...persisted.compromiseSnapshots };
  compromiseBatch.snapshots.forEach((snap) => {
    compromiseSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1034CiresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    segmentBufferGraphRevision: persisted.segmentBufferGraphRevision + 1,
    compromiseSnapshots,
    regionalSegmentBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateCyberPhysicalStressExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateCyberPhysicalStressExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateCyberPhysicalStressExposure.toFixed(1)}; facility_zone ${aggregateCriticalInfrastructureResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1034_CIRES_criticalInfrastructureResilienceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'facility_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; segmentBuffer ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateCyberPhysicalStressExposureIndex: aggregateCyberPhysicalStressExposure,
      aggregateCriticalInfrastructureResilienceScore: aggregateCriticalInfrastructureResilience,
      cyberPhysicalNetworkHarmonyScore: fiscalFederalism,
      segmentBufferPressure: heatStressPressure,
      segmentBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1034CiresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1034CiresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      segmentBufferIndex: 0.42,
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
    criticalInfrastructureResiliencePolicyFocus: 48,
    activeCompromiseScenarioIds: V1034_CIRES_listActiveCompromiseScenarioIds(turn).slice(0, 10),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1034CiresPersisted, sanitizeV1034CiresPersisted };
