/**
 * Turn orchestrator — V1027 coastal resilience (SECTION 20BY), post–§11A.
 */
import type { V1029CresPersisted, V1029CresRegionId, V1029CresTurnInput, V1029CresTurnResult } from '../types/core';
import {
  V1029_CRES_clamp,
  V1029_CRES_hash,
  V1029_CRES_mixSeed,
  V1029_CRES_adaptationBandFromScore,
  V1029_CRES_weightedMean,
} from './coastal-resilience-utils';
import { createEmptyV1029CresPersisted, sanitizeV1029CresPersisted } from '../persistence/migrations';
import { buildV1029CresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1029CresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1029CresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1029CresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1029CresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1029_CRES_adaptationBufferGraphHash, V1029_CRES_adaptationBufferPressure } from '../adaptation-buffer-stacks/graph-utils';
import { V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES } from '../generated/adaptation-buffer-bundle';
import {
  V1029_CRES_evaluateSurgeBatch,
  V1029_CRES_listActiveSurgeScenarioIds,
} from '../generated/surge-registry';
import { V1029_CRES_LITTORAL_ZONE_00_buffer } from '../littoral-zone-nodes/littoral-zone-00';

const REGIONS: V1029CresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1029CresInputHash(input: V1029CresTurnInput): string {
  return V1029_CRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeSurgeScenarioIds.slice(0, 12),
    nodes: input.activeLittoralZoneIds.slice(0, 12),
  });
}

export function runV1029CresTurn(input: V1029CresTurnInput): V1029CresTurnResult {
  const persisted = sanitizeV1029CresPersisted(input.persisted ?? createEmptyV1029CresPersisted(), input.turn);

  const mix = V1029_CRES_mixSeed(input.seed, input.turn, 'v1029_coastal_resilience');
  const scenarioIds =
    input.activeSurgeScenarioIds.length > 0
      ? input.activeSurgeScenarioIds
      : V1029_CRES_listActiveSurgeScenarioIds(input.turn);
  const surgeBatch = V1029_CRES_evaluateSurgeBatch(input.turn, scenarioIds);

  let aggregateSeaLevelExposure = V1029_CRES_clamp(
    surgeBatch.meanSeaLevelExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1029_CRES_adaptationBufferPressure(
    V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES,
    input.turn,
    aggregateSeaLevelExposure,
  );

  const supplyBridge = computeV1029CresSupply20bbBridge(input, aggregateSeaLevelExposure);
  const tradeBridge = computeV1029CresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1029CresEnergy20bcBridge(input, aggregateSeaLevelExposure);
  const workforceBridge = computeV1029CresWorkforce20bfBridge(input, aggregateSeaLevelExposure);

  const nodeBuffer = V1029_CRES_LITTORAL_ZONE_00_buffer(input.turn);
  const aggregateAdaptation = V1029_CRES_clamp(
    surgeBatch.meanAdaptationScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.coastalPolicyFocus * 0.05 -
      aggregateSeaLevelExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1029_CRES_clamp(
    aggregateAdaptation -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const adaptationBufferGraphHash = V1029_CRES_adaptationBufferGraphHash(V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES);
  const inputHash = v1029CresInputHash(input);
  const briefing = buildV1029CresBriefing(input, aggregateSeaLevelExposure, aggregateAdaptation);

  const regionalAdaptationBuffer = { ...persisted.regionalAdaptationBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalAdaptationBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = surgeBatch.byRegion[region];
    const compositeCapacity = V1029_CRES_clamp(
      V1029_CRES_weightedMean([
        { weight: 1.1, value: aggregateAdaptation - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.adaptationScore ?? aggregateAdaptation },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalAdaptationBuffer[region] = {
      bufferIndex: V1029_CRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateSeaLevelExposure * 0.03, 0, 100),
      rerouteStress: V1029_CRES_clamp(
        prior.rerouteStress + (regionalTransfer?.seaLevelExposureIndex ?? aggregateSeaLevelExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1029_CRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const surgeSnapshots = { ...persisted.surgeSnapshots };
  surgeBatch.snapshots.forEach((snap) => {
    surgeSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1029CresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    adaptationBufferGraphRevision: persisted.adaptationBufferGraphRevision + 1,
    surgeSnapshots,
    regionalAdaptationBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateSeaLevelExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateSeaLevelExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateSeaLevelExposure.toFixed(1)}; littoral_zone ${aggregateAdaptation.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1029_CRES_adaptationBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'littoral_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; adaptationBuffer ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateSeaLevelExposureIndex: aggregateSeaLevelExposure,
      aggregateAdaptationScore: aggregateAdaptation,
      coastalClimateHarmonyScore: fiscalFederalism,
      adaptationBufferPressure: heatStressPressure,
      adaptationBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1029CresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1029CresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      adaptationBufferIndex: 0.42,
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
      inundationRiskStress: 33,
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
    bermHeadroom: 55,
    coastalPolicyFocus: 48,
    activeSurgeScenarioIds: V1029_CRES_listActiveSurgeScenarioIds(turn).slice(0, 10),
    activeLittoralZoneIds: ['littoral_zone_00', 'littoral_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1029CresPersisted, sanitizeV1029CresPersisted };
