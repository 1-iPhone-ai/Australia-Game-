/**
 * Turn orchestrator — V1027 inland heat adaptation (SECTION 20BZ), post–§11A.
 */
import type { V1030IheatPersisted, V1030IheatRegionId, V1030IheatTurnInput, V1030IheatTurnResult } from '../types/core';
import {
  V1030_IHEAT_clamp,
  V1030_IHEAT_hash,
  V1030_IHEAT_mixSeed,
  V1030_IHEAT_aridAdaptationBandFromScore,
  V1030_IHEAT_weightedMean,
} from './inland-heat-utils';
import { createEmptyV1030IheatPersisted, sanitizeV1030IheatPersisted } from '../persistence/migrations';
import { buildV1030IheatBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1030IheatSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1030IheatTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1030IheatEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1030IheatWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1030_IHEAT_aridBufferGraphHash, V1030_IHEAT_aridBufferPressure } from '../arid-buffer-stacks/graph-utils';
import { V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES } from '../generated/arid-buffer-bundle';
import {
  V1030_IHEAT_evaluateHeatwaveBatch,
  V1030_IHEAT_listActiveHeatwaveScenarioIds,
} from '../generated/heatwave-registry';
import { V1030_IHEAT_INLAND_ZONE_00_buffer } from '../inland-zone-nodes/inland-zone-00';

const REGIONS: V1030IheatRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1030IheatInputHash(input: V1030IheatTurnInput): string {
  return V1030_IHEAT_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeHeatwaveScenarioIds.slice(0, 12),
    nodes: input.activeInlandZoneIds.slice(0, 12),
  });
}

export function runV1030IheatTurn(input: V1030IheatTurnInput): V1030IheatTurnResult {
  const persisted = sanitizeV1030IheatPersisted(input.persisted ?? createEmptyV1030IheatPersisted(), input.turn);

  const mix = V1030_IHEAT_mixSeed(input.seed, input.turn, 'v1030_inland_heat');
  const scenarioIds =
    input.activeHeatwaveScenarioIds.length > 0
      ? input.activeHeatwaveScenarioIds
      : V1030_IHEAT_listActiveHeatwaveScenarioIds(input.turn);
  const heatwaveBatch = V1030_IHEAT_evaluateHeatwaveBatch(input.turn, scenarioIds);

  let aggregateInlandHeatExposure = V1030_IHEAT_clamp(
    heatwaveBatch.meanInlandHeatExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1030_IHEAT_aridBufferPressure(
    V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES,
    input.turn,
    aggregateInlandHeatExposure,
  );

  const supplyBridge = computeV1030IheatSupply20bbBridge(input, aggregateInlandHeatExposure);
  const tradeBridge = computeV1030IheatTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1030IheatEnergy20bcBridge(input, aggregateInlandHeatExposure);
  const workforceBridge = computeV1030IheatWorkforce20bfBridge(input, aggregateInlandHeatExposure);

  const nodeBuffer = V1030_IHEAT_INLAND_ZONE_00_buffer(input.turn);
  const aggregateAridAdaptation = V1030_IHEAT_clamp(
    heatwaveBatch.meanAridAdaptationScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.inlandHeatPolicyFocus * 0.05 -
      aggregateInlandHeatExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1030_IHEAT_clamp(
    aggregateAridAdaptation -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const aridBufferGraphHash = V1030_IHEAT_aridBufferGraphHash(V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES);
  const inputHash = v1030IheatInputHash(input);
  const briefing = buildV1030IheatBriefing(input, aggregateInlandHeatExposure, aggregateAridAdaptation);

  const regionalAridBuffer = { ...persisted.regionalAridBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalAridBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = heatwaveBatch.byRegion[region];
    const compositeCapacity = V1030_IHEAT_clamp(
      V1030_IHEAT_weightedMean([
        { weight: 1.1, value: aggregateAridAdaptation - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.aridAdaptationScore ?? aggregateAridAdaptation },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalAridBuffer[region] = {
      bufferIndex: V1030_IHEAT_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateInlandHeatExposure * 0.03, 0, 100),
      rerouteStress: V1030_IHEAT_clamp(
        prior.rerouteStress + (regionalTransfer?.inlandHeatExposureIndex ?? aggregateInlandHeatExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1030_IHEAT_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const heatwaveSnapshots = { ...persisted.heatwaveSnapshots };
  heatwaveBatch.snapshots.forEach((snap) => {
    heatwaveSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1030IheatPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    aridBufferGraphRevision: persisted.aridBufferGraphRevision + 1,
    heatwaveSnapshots,
    regionalAridBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateInlandHeatExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateInlandHeatExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateInlandHeatExposure.toFixed(1)}; inland_zone ${aggregateAridAdaptation.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1030_IHEAT_aridAdaptationBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'inland_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; aridBuffer ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateInlandHeatExposureIndex: aggregateInlandHeatExposure,
      aggregateAridAdaptationScore: aggregateAridAdaptation,
      inlandAridHarmonyScore: fiscalFederalism,
      aridBufferPressure: heatStressPressure,
      aridBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1030IheatTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1030IheatTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      aridBufferIndex: 0.42,
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
      heatStressRisk: 33,
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
    shadeHeadroom: 55,
    inlandHeatPolicyFocus: 48,
    activeHeatwaveScenarioIds: V1030_IHEAT_listActiveHeatwaveScenarioIds(turn).slice(0, 10),
    activeInlandZoneIds: ['inland_zone_00', 'inland_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1030IheatPersisted, sanitizeV1030IheatPersisted };
