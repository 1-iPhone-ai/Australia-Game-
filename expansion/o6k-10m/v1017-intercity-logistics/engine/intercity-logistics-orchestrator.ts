/**
 * Turn orchestrator — V1016 intercity logistics (SECTION 20BI), post–§11A.
 */
import type { V1017IclogPersisted, V1017IclogRegionId, V1017IclogTurnInput, V1017IclogTurnResult } from '../types/core';
import {
  V1017_ICLOG_clamp,
  V1017_ICLOG_hash,
  V1017_ICLOG_mixSeed,
  V1017_ICLOG_hubFromScore,
  V1017_ICLOG_weightedMean,
} from './intercity-logistics-utils';
import { createEmptyV1017IclogPersisted, sanitizeV1017IclogPersisted } from '../persistence/migrations';
import { buildV1017IclogBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1017IclogSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1017IclogTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1017IclogCities20akBridge } from '../adapters/adapter-v1014-cities-20ak';
import { computeV1017IclogResilience20bgBridge } from '../adapters/adapter-v1016-resilience-20bg';
import { V1017_ICLOG_corridorGraphHash, V1017_ICLOG_corridorPressure } from '../corridor-graph/graph-utils';
import { V1017_ICLOG_GENERATED_CORRIDOR_EDGES } from '../generated/corridor-graph-bundle';
import {
  V1017_ICLOG_evaluateSupplyRouteBatch,
  V1017_ICLOG_listActiveRouteScenarioIds,
} from '../generated/freight-route-registry';
import { V1017_ICLOG_HUB_NODE_00_buffer } from '../logistics-hubs/hub-00';

const REGIONS: V1017IclogRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1017IclogInputHash(input: V1017IclogTurnInput): string {
  return V1017_ICLOG_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeRouteScenarioIds.slice(0, 12),
    nodes: input.activeHubNodeIds.slice(0, 12),
  });
}

export function runV1017IclogTurn(input: V1017IclogTurnInput): V1017IclogTurnResult {
  const persisted = sanitizeV1017IclogPersisted(input.persisted ?? createEmptyV1017IclogPersisted(), input.turn);

  const mix = V1017_ICLOG_mixSeed(input.seed, input.turn, 'v1017_intercity_logistics');
  const scenarioIds =
    input.activeRouteScenarioIds.length > 0
      ? input.activeRouteScenarioIds
      : V1017_ICLOG_listActiveRouteScenarioIds(input.turn);
  const routeBatch = V1017_ICLOG_evaluateSupplyRouteBatch(input.turn, scenarioIds);

  let aggregateSeverity = V1017_ICLOG_clamp(
    routeBatch.meanSeverity * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const routePressure = V1017_ICLOG_corridorPressure(
    V1017_ICLOG_GENERATED_CORRIDOR_EDGES,
    input.turn,
    aggregateSeverity,
  );

  const supplyBridge = computeV1017IclogSupply20bbBridge(input, aggregateSeverity);
  const tradeBridge = computeV1017IclogTrade20baBridge(input, routePressure);
  const citiesBridge = computeV1017IclogCities20akBridge(input, aggregateSeverity);
  const resilienceBridge = computeV1017IclogResilience20bgBridge(input, aggregateSeverity);

  const nodeBuffer = V1017_ICLOG_HUB_NODE_00_buffer(input.turn);
  const aggregateHub = V1017_ICLOG_clamp(
    routeBatch.meanHub * 0.45 +
      input.cities20ak.intercityLinkCongestion * 0.22 +
      input.resilience20bg.resilienceContinuityScore * 0.12 +
      nodeBuffer * 18 +
      input.hubPolicyFocus * 0.05 -
      aggregateSeverity * 0.14,
    0,
    100,
  );

  const nationalResilience = V1017_ICLOG_clamp(
    aggregateHub -
      tradeBridge.importStressContribution * 12 -
      citiesBridge.congestionDrag * 8 +
      resilienceBridge.continuityDelta * 0.6,
    0,
    100,
  );

  const corridorGraphHash = V1017_ICLOG_corridorGraphHash(V1017_ICLOG_GENERATED_CORRIDOR_EDGES);
  const inputHash = v1017IclogInputHash(input);
  const briefing = buildV1017IclogBriefing(input, aggregateSeverity, aggregateHub);

  const regionalHub = { ...persisted.regionalHub };
  REGIONS.forEach((region, idx) => {
    const prior = regionalHub[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeHub: 50,
      exposedSystems: 2,
    };
    const regionalRoute = routeBatch.byRegion[region];
    const compositeHub = V1017_ICLOG_clamp(
      V1017_ICLOG_weightedMean([
        { weight: 1.1, value: aggregateHub - idx * 0.15 },
        { weight: 0.9, value: regionalRoute?.hubScore ?? aggregateHub },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalHub[region] = {
      bufferIndex: V1017_ICLOG_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateSeverity * 0.03, 0, 100),
      rerouteStress: V1017_ICLOG_clamp(
        prior.rerouteStress + (regionalRoute?.severityIndex ?? aggregateSeverity) * 0.04,
        0,
        100,
      ),
      compositeHub,
      exposedSystems: V1017_ICLOG_clamp(
        prior.exposedSystems + (regionalRoute ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const routeSnapshots = { ...persisted.routeSnapshots };
  routeBatch.snapshots.forEach((snap) => {
    routeSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1017IclogPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    corridorGraphRevision: persisted.corridorGraphRevision + 1,
    routeSnapshots,
    regionalHub,
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
            id: `iclog_route_${input.turn}`,
            turn: input.turn,
            kind: 'freight_route',
            title: 'National freight route elevated',
            summary: `Severity ${aggregateSeverity.toFixed(1)}; hub ${aggregateHub.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1017_ICLOG_hubFromScore(nationalResilience) === 'critical') {
    worldEvents.push({
      id: `iclog_cont_${input.turn}`,
      turn: input.turn,
      kind: 'hub',
      title: 'Hub band critical',
      summary: `Resilience ${nationalResilience.toFixed(1)}; corridor ${routePressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void citiesBridge;

  return {
    state: {
      turn: input.turn,
      aggregateSeverityIndex: aggregateSeverity,
      aggregateHubScore: aggregateHub,
      nationalResilienceScore: nationalResilience,
      supplyRoutePressure: routePressure,
      corridorGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1017IclogTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1017IclogTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      corridorIndex: 0.42,
    },
    trade20ba: {
      turn,
      sanctionsPressure: 22,
      importDependencyRatio: 0.38,
      exportLaneStability: 56,
    },
    cities20ak: {
      turn,
      intercityLinkCongestion: 61,
      corridorThroughputIndex: 14,
      hubCapacityScore: 33,
    },
    resilience20bg: {
      turn,
      supplyShockPressure: 29,
      resilienceContinuityScore: 57,
      rerouteUrgencyIndex: 41,
    },
    fiscalHeadroom: 55,
    hubPolicyFocus: 48,
    activeRouteScenarioIds: V1017_ICLOG_listActiveRouteScenarioIds(turn).slice(0, 10),
    activeHubNodeIds: ['hub_00', 'hub_01'],
    persisted: null,
  };
}

export { createEmptyV1017IclogPersisted, sanitizeV1017IclogPersisted };
