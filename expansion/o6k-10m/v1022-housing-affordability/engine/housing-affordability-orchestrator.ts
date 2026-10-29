/**
 * Turn orchestrator — V1018 housing affordability (SECTION 20BQ), post–§11A.
 */
import type { V1022HaffPersisted, V1022HaffRegionId, V1022HaffTurnInput, V1022HaffTurnResult } from '../types/core';
import {
  V1022_HAFF_clamp,
  V1022_HAFF_hash,
  V1022_HAFF_mixSeed,
  V1022_HAFF_tenureBandFromScore,
  V1022_HAFF_weightedMean,
} from './housing-affordability-utils';
import { createEmptyV1022HaffPersisted, sanitizeV1022HaffPersisted } from '../persistence/migrations';
import { buildV1022HaffBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1022HaffSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1022HaffTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1022HaffEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1022HaffWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1022_HAFF_supplyPipelineGraphHash, V1022_HAFF_supplyPipelinePressure } from '../supply-pipeline-stacks/graph-utils';
import { V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES } from '../generated/supply-pipeline-bundle';
import {
  V1022_HAFF_evaluateStressBatch,
  V1022_HAFF_listActiveStressScenarioIds,
} from '../generated/stress-registry';
import { V1022_HAFF_ZONING_NODE_00_buffer } from '../zoning-friction-nodes/zoning-node-00';

const REGIONS: V1022HaffRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1022HaffInputHash(input: V1022HaffTurnInput): string {
  return V1022_HAFF_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeStressScenarioIds.slice(0, 12),
    nodes: input.activeZoningNodeIds.slice(0, 12),
  });
}

export function runV1022HaffTurn(input: V1022HaffTurnInput): V1022HaffTurnResult {
  const persisted = sanitizeV1022HaffPersisted(input.persisted ?? createEmptyV1022HaffPersisted(), input.turn);

  const mix = V1022_HAFF_mixSeed(input.seed, input.turn, 'v1022_housing_affordability');
  const scenarioIds =
    input.activeStressScenarioIds.length > 0
      ? input.activeStressScenarioIds
      : V1022_HAFF_listActiveStressScenarioIds(input.turn);
  const stressBatch = V1022_HAFF_evaluateStressBatch(input.turn, scenarioIds);

  let aggregateRentStress = V1022_HAFF_clamp(
    stressBatch.meanRentStress * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const transferBackpressure = V1022_HAFF_supplyPipelinePressure(
    V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES,
    input.turn,
    aggregateRentStress,
  );

  const supplyBridge = computeV1022HaffSupply20bbBridge(input, aggregateRentStress);
  const tradeBridge = computeV1022HaffTrade20baBridge(input, transferBackpressure);
  const energyBridge = computeV1022HaffEnergy20bcBridge(input, aggregateRentStress);
  const workforceBridge = computeV1022HaffWorkforce20bfBridge(input, aggregateRentStress);

  const nodeBuffer = V1022_HAFF_ZONING_NODE_00_buffer(input.turn);
  const aggregateAffordability = V1022_HAFF_clamp(
    stressBatch.meanAffordability * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.housingPolicyFocus * 0.05 -
      aggregateRentStress * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1022_HAFF_clamp(
    aggregateAffordability -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const supplyPipelineGraphHash = V1022_HAFF_supplyPipelineGraphHash(V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES);
  const inputHash = v1022HaffInputHash(input);
  const briefing = buildV1022HaffBriefing(input, aggregateRentStress, aggregateAffordability);

  const regionalSupplyPipeline = { ...persisted.regionalSupplyPipeline };
  REGIONS.forEach((region, idx) => {
    const prior = regionalSupplyPipeline[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = stressBatch.byRegion[region];
    const compositeCapacity = V1022_HAFF_clamp(
      V1022_HAFF_weightedMean([
        { weight: 1.1, value: aggregateAffordability - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.affordabilityScore ?? aggregateAffordability },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalSupplyPipeline[region] = {
      bufferIndex: V1022_HAFF_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateRentStress * 0.03, 0, 100),
      rerouteStress: V1022_HAFF_clamp(
        prior.rerouteStress + (regionalTransfer?.rentStressIndex ?? aggregateRentStress) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1022_HAFF_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const stressSnapshots = { ...persisted.stressSnapshots };
  stressBatch.snapshots.forEach((snap) => {
    stressSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1022HaffPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    supplyPipelineGraphRevision: persisted.supplyPipelineGraphRevision + 1,
    stressSnapshots,
    regionalSupplyPipeline,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateRentStress },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateRentStress > 58
      ? [
          {
            id: `ffed_stress_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateRentStress.toFixed(1)}; zoning_node ${aggregateAffordability.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1022_HAFF_tenureBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'zoning_node',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; supplyPipeline ${transferBackpressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateRentStressIndex: aggregateRentStress,
      aggregateAffordabilityScore: aggregateAffordability,
      housingFiscalHarmonyScore: fiscalFederalism,
      supplyPipelinePressure: transferBackpressure,
      supplyPipelineGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1022HaffTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1022HaffTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      supplyPipelineIndex: 0.42,
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
    fiscalFederalism20bj: {
      turn,
      transferBackpressure: 34,
      grantStackLoad: 0.31,
      zoningBacklogTurns: 19,
    },
    constructionHeadroom: 55,
    housingPolicyFocus: 48,
    activeStressScenarioIds: V1022_HAFF_listActiveStressScenarioIds(turn).slice(0, 10),
    activeZoningNodeIds: ['zoning_node_00', 'zoning_node_01'],
    persisted: null,
  };
}

export { createEmptyV1022HaffPersisted, sanitizeV1022HaffPersisted };
