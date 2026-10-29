/**
 * Turn orchestrator — V1018 climate adaptation (SECTION 20BR), post–§11A.
 */
import type { V1023CladPersisted, V1023CladRegionId, V1023CladTurnInput, V1023CladTurnResult } from '../types/core';
import {
  V1023_CLAD_clamp,
  V1023_CLAD_hash,
  V1023_CLAD_mixSeed,
  V1023_CLAD_hazardBandFromScore,
  V1023_CLAD_weightedMean,
} from './climate-adaptation-utils';
import { createEmptyV1023CladPersisted, sanitizeV1023CladPersisted } from '../persistence/migrations';
import { buildV1023CladBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1023CladSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1023CladTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1023CladEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1023CladWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1023_CLAD_droughtBufferGraphHash, V1023_CLAD_droughtBufferPressure } from '../drought-buffer-stacks/graph-utils';
import { V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES } from '../generated/drought-buffer-bundle';
import {
  V1023_CLAD_evaluateHazardBatch,
  V1023_CLAD_listActiveHazardScenarioIds,
} from '../generated/hazard-registry';
import { V1023_CLAD_FLOOD_NODE_00_buffer } from '../flood-defend-nodes/flood-node-00';

const REGIONS: V1023CladRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1023CladInputHash(input: V1023CladTurnInput): string {
  return V1023_CLAD_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeHazardScenarioIds.slice(0, 12),
    nodes: input.activeFloodNodeIds.slice(0, 12),
  });
}

export function runV1023CladTurn(input: V1023CladTurnInput): V1023CladTurnResult {
  const persisted = sanitizeV1023CladPersisted(input.persisted ?? createEmptyV1023CladPersisted(), input.turn);

  const mix = V1023_CLAD_mixSeed(input.seed, input.turn, 'v1023_climate_adaptation');
  const scenarioIds =
    input.activeHazardScenarioIds.length > 0
      ? input.activeHazardScenarioIds
      : V1023_CLAD_listActiveHazardScenarioIds(input.turn);
  const hazardBatch = V1023_CLAD_evaluateHazardBatch(input.turn, scenarioIds);

  let aggregateHeatStress = V1023_CLAD_clamp(
    hazardBatch.meanHeatStress * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const packCohesionPressure = V1023_CLAD_droughtBufferPressure(
    V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES,
    input.turn,
    aggregateHeatStress,
  );

  const supplyBridge = computeV1023CladSupply20bbBridge(input, aggregateHeatStress);
  const tradeBridge = computeV1023CladTrade20baBridge(input, packCohesionPressure);
  const energyBridge = computeV1023CladEnergy20bcBridge(input, aggregateHeatStress);
  const workforceBridge = computeV1023CladWorkforce20bfBridge(input, aggregateHeatStress);

  const nodeBuffer = V1023_CLAD_FLOOD_NODE_00_buffer(input.turn);
  const aggregateResilience = V1023_CLAD_clamp(
    hazardBatch.meanResilience * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.adaptationPolicyFocus * 0.05 -
      aggregateHeatStress * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1023_CLAD_clamp(
    aggregateResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const droughtBufferGraphHash = V1023_CLAD_droughtBufferGraphHash(V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES);
  const inputHash = v1023CladInputHash(input);
  const briefing = buildV1023CladBriefing(input, aggregateHeatStress, aggregateResilience);

  const regionalDroughtBuffer = { ...persisted.regionalDroughtBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalDroughtBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = hazardBatch.byRegion[region];
    const compositeCapacity = V1023_CLAD_clamp(
      V1023_CLAD_weightedMean([
        { weight: 1.1, value: aggregateResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.resilienceScore ?? aggregateResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalDroughtBuffer[region] = {
      bufferIndex: V1023_CLAD_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateHeatStress * 0.03, 0, 100),
      rerouteStress: V1023_CLAD_clamp(
        prior.rerouteStress + (regionalTransfer?.heatStressIndex ?? aggregateHeatStress) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1023_CLAD_clamp(
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

  const nextPersisted: V1023CladPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    droughtBufferGraphRevision: persisted.droughtBufferGraphRevision + 1,
    hazardSnapshots,
    regionalDroughtBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateHeatStress },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateHeatStress > 58
      ? [
          {
            id: `ffed_stress_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateHeatStress.toFixed(1)}; flood_node ${aggregateResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1023_CLAD_hazardBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'flood_node',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; droughtBuffer ${packCohesionPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateHeatStressIndex: aggregateHeatStress,
      aggregateResilienceScore: aggregateResilience,
      climateEnergyHarmonyScore: fiscalFederalism,
      droughtBufferPressure: packCohesionPressure,
      droughtBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1023CladTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1023CladTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      droughtBufferIndex: 0.42,
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
      carbonStress: 33,
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
    scenarioPacks20bd: {
      turn,
      packCohesionPressure: 34,
      grantStackLoad: 0.31,
      objectiveDriftTurns: 19,
    },
    coolingHeadroom: 55,
    adaptationPolicyFocus: 48,
    activeHazardScenarioIds: V1023_CLAD_listActiveHazardScenarioIds(turn).slice(0, 10),
    activeFloodNodeIds: ['flood_node_00', 'flood_node_01'],
    persisted: null,
  };
}

export { createEmptyV1023CladPersisted, sanitizeV1023CladPersisted };
