/**
 * Turn orchestrator — V1027 sovereign cyber network resilience (SECTION 20CG), post–§11A.
 */
import type { V1035CyresPersisted, V1035CyresRegionId, V1035CyresTurnInput, V1035CyresTurnResult } from '../types/core';
import {
  V1035_CYRES_clamp,
  V1035_CYRES_hash,
  V1035_CYRES_mixSeed,
  V1035_CYRES_cyberResilienceBandFromScore,
  V1035_CYRES_weightedMean,
} from './cyber-resilience-utils';
import { createEmptyV1035CyresPersisted, sanitizeV1035CyresPersisted } from '../persistence/migrations';
import { buildV1035CyresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1035CyresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1035CyresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1035CyresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1035CyresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1035_CYRES_segmentBufferGraphHash, V1035_CYRES_segmentBufferPressure } from '../segment-buffer-stacks/graph-utils';
import { V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES } from '../generated/segment-buffer-bundle';
import {
  V1035_CYRES_evaluateIntrusionBatch,
  V1035_CYRES_listActiveIntrusionScenarioIds,
} from '../generated/intrusion-registry';
import { V1035_CYRES_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';

const REGIONS: V1035CyresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1035CyresInputHash(input: V1035CyresTurnInput): string {
  return V1035_CYRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeIntrusionScenarioIds.slice(0, 12),
    nodes: input.activeFacilityZoneIds.slice(0, 12),
  });
}

export function runV1035CyresTurn(input: V1035CyresTurnInput): V1035CyresTurnResult {
  const persisted = sanitizeV1035CyresPersisted(input.persisted ?? createEmptyV1035CyresPersisted(), input.turn);

  const mix = V1035_CYRES_mixSeed(input.seed, input.turn, 'v1035_cyber_resilience');
  const scenarioIds =
    input.activeIntrusionScenarioIds.length > 0
      ? input.activeIntrusionScenarioIds
      : V1035_CYRES_listActiveIntrusionScenarioIds(input.turn);
  const intrusionBatch = V1035_CYRES_evaluateIntrusionBatch(input.turn, scenarioIds);

  let aggregateSovereignDigitalStressExposure = V1035_CYRES_clamp(
    intrusionBatch.meanSovereignDigitalStressExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1035_CYRES_segmentBufferPressure(
    V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES,
    input.turn,
    aggregateSovereignDigitalStressExposure,
  );

  const supplyBridge = computeV1035CyresSupply20bbBridge(input, aggregateSovereignDigitalStressExposure);
  const tradeBridge = computeV1035CyresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1035CyresEnergy20bcBridge(input, aggregateSovereignDigitalStressExposure);
  const workforceBridge = computeV1035CyresWorkforce20bfBridge(input, aggregateSovereignDigitalStressExposure);

  const nodeBuffer = V1035_CYRES_FACILITY_ZONE_00_buffer(input.turn);
  const aggregateCyberResilience = V1035_CYRES_clamp(
    intrusionBatch.meanTelecomResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.cyberResiliencePolicyFocus * 0.05 -
      aggregateSovereignDigitalStressExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1035_CYRES_clamp(
    aggregateCyberResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const segmentBufferGraphHash = V1035_CYRES_segmentBufferGraphHash(V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES);
  const inputHash = v1035CyresInputHash(input);
  const briefing = buildV1035CyresBriefing(input, aggregateSovereignDigitalStressExposure, aggregateCyberResilience);

  const regionalSegmentBuffer = { ...persisted.regionalSegmentBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalSegmentBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = intrusionBatch.byRegion[region];
    const compositeCapacity = V1035_CYRES_clamp(
      V1035_CYRES_weightedMean([
        { weight: 1.1, value: aggregateCyberResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.cyberResilienceScore ?? aggregateCyberResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalSegmentBuffer[region] = {
      bufferIndex: V1035_CYRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateSovereignDigitalStressExposure * 0.03, 0, 100),
      rerouteStress: V1035_CYRES_clamp(
        prior.rerouteStress + (regionalTransfer?.sovereignDigitalStressExposureIndex ?? aggregateSovereignDigitalStressExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1035_CYRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const intrusionSnapshots = { ...persisted.intrusionSnapshots };
  intrusionBatch.snapshots.forEach((snap) => {
    intrusionSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1035CyresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    segmentBufferGraphRevision: persisted.segmentBufferGraphRevision + 1,
    intrusionSnapshots,
    regionalSegmentBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateSovereignDigitalStressExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateSovereignDigitalStressExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateSovereignDigitalStressExposure.toFixed(1)}; facility_zone ${aggregateCyberResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1035_CYRES_cyberResilienceBandFromScore(fiscalFederalism) === 'critical') {
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
      aggregateSovereignDigitalStressExposureIndex: aggregateSovereignDigitalStressExposure,
      aggregateCyberResilienceScore: aggregateCyberResilience,
      sovereignDigitalNetworkHarmonyScore: fiscalFederalism,
      segmentBufferPressure: heatStressPressure,
      segmentBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1035CyresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1035CyresTurnInput {
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
    cyberResiliencePolicyFocus: 48,
    activeIntrusionScenarioIds: V1035_CYRES_listActiveIntrusionScenarioIds(turn).slice(0, 10),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1035CyresPersisted, sanitizeV1035CyresPersisted };
