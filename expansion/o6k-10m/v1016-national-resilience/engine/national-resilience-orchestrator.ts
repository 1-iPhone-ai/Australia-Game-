/**
 * Turn orchestrator — V1016 national resilience (SECTION 20BG), post–§11A.
 */
import type { V1016NresPersisted, V1016NresRegionId, V1016NresTurnInput, V1016NresTurnResult } from '../types/core';
import {
  V1016_NRES_clamp,
  V1016_NRES_hash,
  V1016_NRES_mixSeed,
  V1016_NRES_continuityFromScore,
  V1016_NRES_weightedMean,
} from './national-resilience-utils';
import { createEmptyV1016NresPersisted, sanitizeV1016NresPersisted } from '../persistence/migrations';
import { buildV1016NresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1016NresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1016NresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1016NresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1016NresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1016_NRES_propagationGraphHash, V1016_NRES_propagationPressure } from '../propagation-graph/graph-utils';
import { V1016_NRES_GENERATED_PROPAGATION_EDGES } from '../generated/propagation-graph-bundle';
import {
  V1016_NRES_evaluateSupplyShockBatch,
  V1016_NRES_listActiveShockScenarioIds,
} from '../generated/supply-shock-registry';
import { V1016_NRES_CONTINUITY_NODE_00_buffer } from '../continuity-nodes/node-00';

const REGIONS: V1016NresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1016NresInputHash(input: V1016NresTurnInput): string {
  return V1016_NRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeShockScenarioIds.slice(0, 12),
    nodes: input.activeContinuityNodeIds.slice(0, 12),
  });
}

export function runV1016NresTurn(input: V1016NresTurnInput): V1016NresTurnResult {
  const persisted = sanitizeV1016NresPersisted(input.persisted ?? createEmptyV1016NresPersisted(), input.turn);

  const mix = V1016_NRES_mixSeed(input.seed, input.turn, 'v1016_national_resilience');
  const scenarioIds =
    input.activeShockScenarioIds.length > 0
      ? input.activeShockScenarioIds
      : V1016_NRES_listActiveShockScenarioIds(input.turn);
  const shockBatch = V1016_NRES_evaluateSupplyShockBatch(input.turn, scenarioIds);

  let aggregateSeverity = V1016_NRES_clamp(
    shockBatch.meanSeverity * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const shockPressure = V1016_NRES_propagationPressure(
    V1016_NRES_GENERATED_PROPAGATION_EDGES,
    input.turn,
    aggregateSeverity,
  );

  const supplyBridge = computeV1016NresSupply20bbBridge(input, aggregateSeverity);
  const tradeBridge = computeV1016NresTrade20baBridge(input, shockPressure);
  const energyBridge = computeV1016NresEnergy20bcBridge(input, aggregateSeverity);
  const workforceBridge = computeV1016NresWorkforce20bfBridge(input, aggregateSeverity);

  const nodeBuffer = V1016_NRES_CONTINUITY_NODE_00_buffer(input.turn);
  const aggregateContinuity = V1016_NRES_clamp(
    shockBatch.meanContinuity * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.continuityPolicyFocus * 0.05 -
      aggregateSeverity * 0.14,
    0,
    100,
  );

  const nationalResilience = V1016_NRES_clamp(
    aggregateContinuity -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const propagationGraphHash = V1016_NRES_propagationGraphHash(V1016_NRES_GENERATED_PROPAGATION_EDGES);
  const inputHash = v1016NresInputHash(input);
  const briefing = buildV1016NresBriefing(input, aggregateSeverity, aggregateContinuity);

  const regionalContinuity = { ...persisted.regionalContinuity };
  REGIONS.forEach((region, idx) => {
    const prior = regionalContinuity[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeContinuity: 50,
      exposedSystems: 2,
    };
    const regionalShock = shockBatch.byRegion[region];
    const compositeContinuity = V1016_NRES_clamp(
      V1016_NRES_weightedMean([
        { weight: 1.1, value: aggregateContinuity - idx * 0.15 },
        { weight: 0.9, value: regionalShock?.continuityScore ?? aggregateContinuity },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalContinuity[region] = {
      bufferIndex: V1016_NRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateSeverity * 0.03, 0, 100),
      rerouteStress: V1016_NRES_clamp(
        prior.rerouteStress + (regionalShock?.severityIndex ?? aggregateSeverity) * 0.04,
        0,
        100,
      ),
      compositeContinuity,
      exposedSystems: V1016_NRES_clamp(
        prior.exposedSystems + (regionalShock ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const shockSnapshots = { ...persisted.shockSnapshots };
  shockBatch.snapshots.forEach((snap) => {
    shockSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1016NresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    propagationGraphRevision: persisted.propagationGraphRevision + 1,
    shockSnapshots,
    regionalContinuity,
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
            id: `nres_shock_${input.turn}`,
            turn: input.turn,
            kind: 'supply_shock',
            title: 'National supply shock elevated',
            summary: `Severity ${aggregateSeverity.toFixed(1)}; continuity ${aggregateContinuity.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1016_NRES_continuityFromScore(nationalResilience) === 'critical') {
    worldEvents.push({
      id: `nres_cont_${input.turn}`,
      turn: input.turn,
      kind: 'continuity',
      title: 'Continuity band critical',
      summary: `Resilience ${nationalResilience.toFixed(1)}; propagation ${shockPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateSeverityIndex: aggregateSeverity,
      aggregateContinuityScore: aggregateContinuity,
      nationalResilienceScore: nationalResilience,
      supplyShockPressure: shockPressure,
      propagationGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1016NresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1016NresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      propagationIndex: 0.42,
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
    fiscalHeadroom: 55,
    continuityPolicyFocus: 48,
    activeShockScenarioIds: V1016_NRES_listActiveShockScenarioIds(turn).slice(0, 10),
    activeContinuityNodeIds: ['node_00', 'node_01'],
    persisted: null,
  };
}

export { createEmptyV1016NresPersisted, sanitizeV1016NresPersisted };
