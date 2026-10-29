/**
 * Turn orchestrator — V1018 intermodal freight (SECTION 20BO), post–§11A.
 */
import type { V1021ImfdPersisted, V1021ImfdRegionId, V1021ImfdTurnInput, V1021ImfdTurnResult } from '../types/core';
import {
  V1021_IMFD_clamp,
  V1021_IMFD_hash,
  V1021_IMFD_mixSeed,
  V1021_IMFD_handoffFromScore,
  V1021_IMFD_weightedMean,
} from './intermodal-freight-utils';
import { createEmptyV1021ImfdPersisted, sanitizeV1021ImfdPersisted } from '../persistence/migrations';
import { buildV1021ImfdBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1021ImfdSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1021ImfdTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1021ImfdEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1021ImfdWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1021_IMFD_handoffStackGraphHash, V1021_IMFD_handoffStackPressure } from '../handoff-stacks/graph-utils';
import { V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES } from '../generated/handoff-stack-bundle';
import {
  V1021_IMFD_evaluateCorridorBatch,
  V1021_IMFD_listActiveCorridorScenarioIds,
} from '../generated/corridor-registry';
import { V1021_IMFD_DWELL_HUB_00_buffer } from '../dwell-hubs/dwell-hub-00';

const REGIONS: V1021ImfdRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1021ImfdInputHash(input: V1021ImfdTurnInput): string {
  return V1021_IMFD_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeCorridorScenarioIds.slice(0, 12),
    nodes: input.activeDwellHubNodeIds.slice(0, 12),
  });
}

export function runV1021ImfdTurn(input: V1021ImfdTurnInput): V1021ImfdTurnResult {
  const persisted = sanitizeV1021ImfdPersisted(input.persisted ?? createEmptyV1021ImfdPersisted(), input.turn);

  const mix = V1021_IMFD_mixSeed(input.seed, input.turn, 'v1021_intermodal_freight');
  const scenarioIds =
    input.activeCorridorScenarioIds.length > 0
      ? input.activeCorridorScenarioIds
      : V1021_IMFD_listActiveCorridorScenarioIds(input.turn);
  const corridorBatch = V1021_IMFD_evaluateCorridorBatch(input.turn, scenarioIds);

  let aggregateDwellPenalty = V1021_IMFD_clamp(
    corridorBatch.meanDwellPenalty * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const iclogBackpressure = V1021_IMFD_handoffStackPressure(
    V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES,
    input.turn,
    aggregateDwellPenalty,
  );

  const supplyBridge = computeV1021ImfdSupply20bbBridge(input, aggregateDwellPenalty);
  const tradeBridge = computeV1021ImfdTrade20baBridge(input, iclogBackpressure);
  const energyBridge = computeV1021ImfdEnergy20bcBridge(input, aggregateDwellPenalty);
  const workforceBridge = computeV1021ImfdWorkforce20bfBridge(input, aggregateDwellPenalty);

  const nodeBuffer = V1021_IMFD_DWELL_HUB_00_buffer(input.turn);
  const aggregateCapacity = V1021_IMFD_clamp(
    corridorBatch.meanCapacity * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.corridorPolicyFocus * 0.05 -
      aggregateDwellPenalty * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1021_IMFD_clamp(
    aggregateCapacity -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const handoffStackGraphHash = V1021_IMFD_handoffStackGraphHash(V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES);
  const inputHash = v1021ImfdInputHash(input);
  const briefing = buildV1021ImfdBriefing(input, aggregateDwellPenalty, aggregateCapacity);

  const regionalHandoff = { ...persisted.regionalHandoff };
  REGIONS.forEach((region, idx) => {
    const prior = regionalHandoff[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = corridorBatch.byRegion[region];
    const compositeCapacity = V1021_IMFD_clamp(
      V1021_IMFD_weightedMean([
        { weight: 1.1, value: aggregateCapacity - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.corridorCapacityScore ?? aggregateCapacity },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalHandoff[region] = {
      bufferIndex: V1021_IMFD_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateDwellPenalty * 0.03, 0, 100),
      rerouteStress: V1021_IMFD_clamp(
        prior.rerouteStress + (regionalTransfer?.dwellPenaltyIndex ?? aggregateDwellPenalty) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1021_IMFD_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const corridorSnapshots = { ...persisted.corridorSnapshots };
  corridorBatch.snapshots.forEach((snap) => {
    corridorSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1021ImfdPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    handoffStackGraphRevision: persisted.handoffStackGraphRevision + 1,
    corridorSnapshots,
    regionalHandoff,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateDwellPenalty },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateDwellPenalty > 58
      ? [
          {
            id: `ffed_corridor_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateDwellPenalty.toFixed(1)}; dwell_hub ${aggregateCapacity.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1021_IMFD_handoffFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'dwell_hub',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; handoffStack ${iclogBackpressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateDwellPenaltyIndex: aggregateDwellPenalty,
      aggregateCapacityScore: aggregateCapacity,
      intermodalResilienceScore: fiscalFederalism,
      handoffStackPressure: iclogBackpressure,
      handoffStackGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1021ImfdTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1021ImfdTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      handoffStackIndex: 0.42,
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
    maritime20bn: {
      turn,
      berthUtilizationScore: 64,
      craneAutomationCoverage: 0.39,
      handoffReadiness: 51,
    },
    iclog20bk: {
      turn,
      iclogBackpressure: 34,
      corridorLoadFactor: 0.31,
      dwellBacklogTurns: 19,
    },
    freightHeadroom: 55,
    corridorPolicyFocus: 48,
    activeCorridorScenarioIds: V1021_IMFD_listActiveCorridorScenarioIds(turn).slice(0, 10),
    activeDwellHubNodeIds: ['dwell_hub_00', 'dwell_hub_01'],
    persisted: null,
  };
}

export { createEmptyV1021ImfdPersisted, sanitizeV1021ImfdPersisted };
