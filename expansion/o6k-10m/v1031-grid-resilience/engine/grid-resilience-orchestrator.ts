/**
 * Turn orchestrator — V1027 grid network resilience (SECTION 20CA), post–§11A.
 */
import type { V1031GresPersisted, V1031GresRegionId, V1031GresTurnInput, V1031GresTurnResult } from '../types/core';
import {
  V1031_GRES_clamp,
  V1031_GRES_hash,
  V1031_GRES_mixSeed,
  V1031_GRES_gridResilienceBandFromScore,
  V1031_GRES_weightedMean,
} from './grid-resilience-utils';
import { createEmptyV1031GresPersisted, sanitizeV1031GresPersisted } from '../persistence/migrations';
import { buildV1031GresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1031GresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1031GresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1031GresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1031GresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1031_GRES_gridBufferGraphHash, V1031_GRES_gridBufferPressure } from '../grid-buffer-stacks/graph-utils';
import { V1031_GRES_GENERATED_GRID_BUFFER_EDGES } from '../generated/grid-buffer-bundle';
import {
  V1031_GRES_evaluateOutageBatch,
  V1031_GRES_listActiveOutageScenarioIds,
} from '../generated/outage-registry';
import { V1031_GRES_SUBSTATION_ZONE_00_buffer } from '../substation-zone-nodes/substation-zone-00';

const REGIONS: V1031GresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1031GresInputHash(input: V1031GresTurnInput): string {
  return V1031_GRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeOutageScenarioIds.slice(0, 12),
    nodes: input.activeSubstationZoneIds.slice(0, 12),
  });
}

export function runV1031GresTurn(input: V1031GresTurnInput): V1031GresTurnResult {
  const persisted = sanitizeV1031GresPersisted(input.persisted ?? createEmptyV1031GresPersisted(), input.turn);

  const mix = V1031_GRES_mixSeed(input.seed, input.turn, 'v1031_grid_resilience');
  const scenarioIds =
    input.activeOutageScenarioIds.length > 0
      ? input.activeOutageScenarioIds
      : V1031_GRES_listActiveOutageScenarioIds(input.turn);
  const outageBatch = V1031_GRES_evaluateOutageBatch(input.turn, scenarioIds);

  let aggregateGridStressExposure = V1031_GRES_clamp(
    outageBatch.meanGridStressExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1031_GRES_gridBufferPressure(
    V1031_GRES_GENERATED_GRID_BUFFER_EDGES,
    input.turn,
    aggregateGridStressExposure,
  );

  const supplyBridge = computeV1031GresSupply20bbBridge(input, aggregateGridStressExposure);
  const tradeBridge = computeV1031GresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1031GresEnergy20bcBridge(input, aggregateGridStressExposure);
  const workforceBridge = computeV1031GresWorkforce20bfBridge(input, aggregateGridStressExposure);

  const nodeBuffer = V1031_GRES_SUBSTATION_ZONE_00_buffer(input.turn);
  const aggregateGridResilience = V1031_GRES_clamp(
    outageBatch.meanGridResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.gridResiliencePolicyFocus * 0.05 -
      aggregateGridStressExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1031_GRES_clamp(
    aggregateGridResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const gridBufferGraphHash = V1031_GRES_gridBufferGraphHash(V1031_GRES_GENERATED_GRID_BUFFER_EDGES);
  const inputHash = v1031GresInputHash(input);
  const briefing = buildV1031GresBriefing(input, aggregateGridStressExposure, aggregateGridResilience);

  const regionalGridBuffer = { ...persisted.regionalGridBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalGridBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = outageBatch.byRegion[region];
    const compositeCapacity = V1031_GRES_clamp(
      V1031_GRES_weightedMean([
        { weight: 1.1, value: aggregateGridResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.gridResilienceScore ?? aggregateGridResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalGridBuffer[region] = {
      bufferIndex: V1031_GRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateGridStressExposure * 0.03, 0, 100),
      rerouteStress: V1031_GRES_clamp(
        prior.rerouteStress + (regionalTransfer?.gridStressExposureIndex ?? aggregateGridStressExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1031_GRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const outageSnapshots = { ...persisted.outageSnapshots };
  outageBatch.snapshots.forEach((snap) => {
    outageSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1031GresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    gridBufferGraphRevision: persisted.gridBufferGraphRevision + 1,
    outageSnapshots,
    regionalGridBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateGridStressExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateGridStressExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateGridStressExposure.toFixed(1)}; substation_zone ${aggregateGridResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1031_GRES_gridResilienceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'substation_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; gridBuffer ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateGridStressExposureIndex: aggregateGridStressExposure,
      aggregateGridResilienceScore: aggregateGridResilience,
      gridNetworkHarmonyScore: fiscalFederalism,
      gridBufferPressure: heatStressPressure,
      gridBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1031GresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1031GresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      gridBufferIndex: 0.42,
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
      outageCascadeRisk: 33,
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
    gridResiliencePolicyFocus: 48,
    activeOutageScenarioIds: V1031_GRES_listActiveOutageScenarioIds(turn).slice(0, 10),
    activeSubstationZoneIds: ['substation_zone_00', 'substation_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1031GresPersisted, sanitizeV1031GresPersisted };
