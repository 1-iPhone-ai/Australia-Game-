/**
 * Turn orchestrator — V1019 maritime trade (SECTION 20BM), post–§11A.
 */
import type { V1019MtrdPersisted, V1019MtrdRegionId, V1019MtrdTurnInput, V1019MtrdTurnResult } from '../types/core';
import {
  V1019_MTRD_clamp,
  V1019_MTRD_hash,
  V1019_MTRD_mixSeed,
  V1019_MTRD_portFromScore,
  V1019_MTRD_weightedMean,
} from './maritime-trade-utils';
import { createEmptyV1019MtrdPersisted, sanitizeV1019MtrdPersisted } from '../persistence/migrations';
import { buildV1019MtrdBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1019MtrdTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1019MtrdEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { V1019_MTRD_laneGraphHash, V1019_MTRD_lanePressure } from '../lane-graph/graph-utils';
import { V1019_MTRD_GENERATED_LANE_GRAPH_EDGES } from '../generated/lane-graph-bundle';
import {
  V1019_MTRD_evaluateShippingLaneBatch,
  V1019_MTRD_listActiveLaneScenarioIds,
} from '../generated/shipping-lane-registry';
import { V1019_MTRD_PORT_NODE_00_buffer } from '../maritime-ports/port-00';

const REGIONS: V1019MtrdRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1019MtrdInputHash(input: V1019MtrdTurnInput): string {
  return V1019_MTRD_hash({
    turn: input.turn,
    seed: input.seed,
    sanctions: input.trade20ba.sanctionsPressure,
    grid: input.energy20bc.gridStability,
    scenarios: input.activeLaneScenarioIds.slice(0, 12),
    nodes: input.activePortNodeIds.slice(0, 12),
  });
}

export function runV1019MtrdTurn(input: V1019MtrdTurnInput): V1019MtrdTurnResult {
  const persisted = sanitizeV1019MtrdPersisted(input.persisted ?? createEmptyV1019MtrdPersisted(), input.turn);

  const mix = V1019_MTRD_mixSeed(input.seed, input.turn, 'v1019_maritime_trade');
  const scenarioIds =
    input.activeLaneScenarioIds.length > 0
      ? input.activeLaneScenarioIds
      : V1019_MTRD_listActiveLaneScenarioIds(input.turn);
  const laneBatch = V1019_MTRD_evaluateShippingLaneBatch(input.turn, scenarioIds);

  let aggregateSeverity = V1019_MTRD_clamp(
    laneBatch.meanSeverity * 0.52 +
      input.trade20ba.sanctionsPressure * 0.14 +
      input.energy20bc.carbonStress * 0.08 +
      mix * 7,
    0,
    100,
  );

  const lanePressure = V1019_MTRD_lanePressure(
    V1019_MTRD_GENERATED_LANE_GRAPH_EDGES,
    input.turn,
    aggregateSeverity,
  );

  const tradeBridge = computeV1019MtrdTrade20baBridge(input, lanePressure);
  const energyBridge = computeV1019MtrdEnergy20bcBridge(input, aggregateSeverity);

  const nodeBuffer = V1019_MTRD_PORT_NODE_00_buffer(input.turn);
  const aggregatePort = V1019_MTRD_clamp(
    laneBatch.meanPort * 0.45 +
      input.energy20bc.gridStability * 0.18 +
      input.trade20ba.exportLaneStability * 0.12 +
      nodeBuffer * 18 +
      input.portPolicyFocus * 0.05 -
      aggregateSeverity * 0.14,
    0,
    100,
  );

  const nationalMaritime = V1019_MTRD_clamp(
    aggregatePort -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      energyBridge.reserveContribution * 0.6,
    0,
    100,
  );

  const laneGraphHash = V1019_MTRD_laneGraphHash(V1019_MTRD_GENERATED_LANE_GRAPH_EDGES);
  const inputHash = v1019MtrdInputHash(input);
  const briefing = buildV1019MtrdBriefing(input, aggregateSeverity, aggregatePort);

  const regionalPort = { ...persisted.regionalPort };
  REGIONS.forEach((region, idx) => {
    const prior = regionalPort[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositePort: 50,
      exposedSystems: 2,
    };
    const regionalLane = laneBatch.byRegion[region];
    const compositePort = V1019_MTRD_clamp(
      V1019_MTRD_weightedMean([
        { weight: 1.1, value: aggregatePort - idx * 0.15 },
        { weight: 0.9, value: regionalLane?.portScore ?? aggregatePort },
        { weight: 0.6, value: input.energy20bc.reserveMarginPct * 2 },
      ]),
      0,
      100,
    );
    regionalPort[region] = {
      bufferIndex: V1019_MTRD_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateSeverity * 0.03, 0, 100),
      rerouteStress: V1019_MTRD_clamp(
        prior.rerouteStress + (regionalLane?.severityIndex ?? aggregateSeverity) * 0.04,
        0,
        100,
      ),
      compositePort,
      exposedSystems: V1019_MTRD_clamp(
        prior.exposedSystems + (regionalLane ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const laneSnapshots = { ...persisted.laneSnapshots };
  laneBatch.snapshots.forEach((snap) => {
    laneSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1019MtrdPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    laneGraphRevision: persisted.laneGraphRevision + 1,
    laneSnapshots,
    regionalPort,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateSeverity },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateSeverity > 58
      ? [
          {
            id: `mtrd_lane_${input.turn}`,
            turn: input.turn,
            kind: 'shipping_lane',
            title: 'National shipping lane elevated',
            summary: `Severity ${aggregateSeverity.toFixed(1)}; port ${aggregatePort.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1019_MTRD_portFromScore(nationalMaritime) === 'critical') {
    worldEvents.push({
      id: `mtrd_port_${input.turn}`,
      turn: input.turn,
      kind: 'port',
      title: 'Port band critical',
      summary: `Maritime score ${nationalMaritime.toFixed(1)}; lane pressure ${lanePressure.toFixed(2)}.`,
    });
  }

  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateSeverityIndex: aggregateSeverity,
      aggregatePortScore: aggregatePort,
      nationalMaritimeScore: nationalMaritime,
      shippingLanePressure: lanePressure,
      laneGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1019MtrdTurnInputFromGameStateStub(turn: number, seed: number): V1019MtrdTurnInput {
  return {
    turn,
    seed,
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
      carbonStress: 28,
    },
    fiscalHeadroom: 55,
    portPolicyFocus: 48,
    activeLaneScenarioIds: V1019_MTRD_listActiveLaneScenarioIds(turn).slice(0, 10),
    activePortNodeIds: ['port_00', 'port_01'],
    persisted: null,
  };
}

export { createEmptyV1019MtrdPersisted, sanitizeV1019MtrdPersisted };
