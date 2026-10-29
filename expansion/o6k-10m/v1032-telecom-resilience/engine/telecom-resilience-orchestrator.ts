/**
 * Turn orchestrator — V1027 telecom network resilience (SECTION 20CB), post–§11A.
 */
import type { V1032TresPersisted, V1032TresRegionId, V1032TresTurnInput, V1032TresTurnResult } from '../types/core';
import {
  V1032_TRES_clamp,
  V1032_TRES_hash,
  V1032_TRES_mixSeed,
  V1032_TRES_telecomResilienceBandFromScore,
  V1032_TRES_weightedMean,
} from './telecom-resilience-utils';
import { createEmptyV1032TresPersisted, sanitizeV1032TresPersisted } from '../persistence/migrations';
import { buildV1032TresBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1032TresSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1032TresTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1032TresEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1032TresWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1032_TRES_backboneBufferGraphHash, V1032_TRES_backboneBufferPressure } from '../backbone-buffer-stacks/graph-utils';
import { V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES } from '../generated/backbone-buffer-bundle';
import {
  V1032_TRES_evaluateFailoverBatch,
  V1032_TRES_listActiveFailoverScenarioIds,
} from '../generated/failover-registry';
import { V1032_TRES_EXCHANGE_ZONE_00_buffer } from '../exchange-zone-nodes/exchange-zone-00';

const REGIONS: V1032TresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1032TresInputHash(input: V1032TresTurnInput): string {
  return V1032_TRES_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeFailoverScenarioIds.slice(0, 12),
    nodes: input.activeExchangeZoneIds.slice(0, 12),
  });
}

export function runV1032TresTurn(input: V1032TresTurnInput): V1032TresTurnResult {
  const persisted = sanitizeV1032TresPersisted(input.persisted ?? createEmptyV1032TresPersisted(), input.turn);

  const mix = V1032_TRES_mixSeed(input.seed, input.turn, 'v1032_telecom_resilience');
  const scenarioIds =
    input.activeFailoverScenarioIds.length > 0
      ? input.activeFailoverScenarioIds
      : V1032_TRES_listActiveFailoverScenarioIds(input.turn);
  const failoverBatch = V1032_TRES_evaluateFailoverBatch(input.turn, scenarioIds);

  let aggregateTelecomStressExposure = V1032_TRES_clamp(
    failoverBatch.meanTelecomStressExposure * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1032_TRES_backboneBufferPressure(
    V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES,
    input.turn,
    aggregateTelecomStressExposure,
  );

  const supplyBridge = computeV1032TresSupply20bbBridge(input, aggregateTelecomStressExposure);
  const tradeBridge = computeV1032TresTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1032TresEnergy20bcBridge(input, aggregateTelecomStressExposure);
  const workforceBridge = computeV1032TresWorkforce20bfBridge(input, aggregateTelecomStressExposure);

  const nodeBuffer = V1032_TRES_EXCHANGE_ZONE_00_buffer(input.turn);
  const aggregateTelecomResilience = V1032_TRES_clamp(
    failoverBatch.meanTelecomResilienceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.telecomResiliencePolicyFocus * 0.05 -
      aggregateTelecomStressExposure * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1032_TRES_clamp(
    aggregateTelecomResilience -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const backboneBufferGraphHash = V1032_TRES_backboneBufferGraphHash(V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES);
  const inputHash = v1032TresInputHash(input);
  const briefing = buildV1032TresBriefing(input, aggregateTelecomStressExposure, aggregateTelecomResilience);

  const regionalBackboneBuffer = { ...persisted.regionalBackboneBuffer };
  REGIONS.forEach((region, idx) => {
    const prior = regionalBackboneBuffer[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = failoverBatch.byRegion[region];
    const compositeCapacity = V1032_TRES_clamp(
      V1032_TRES_weightedMean([
        { weight: 1.1, value: aggregateTelecomResilience - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.telecomResilienceScore ?? aggregateTelecomResilience },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalBackboneBuffer[region] = {
      bufferIndex: V1032_TRES_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateTelecomStressExposure * 0.03, 0, 100),
      rerouteStress: V1032_TRES_clamp(
        prior.rerouteStress + (regionalTransfer?.telecomStressExposureIndex ?? aggregateTelecomStressExposure) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1032_TRES_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const failoverSnapshots = { ...persisted.failoverSnapshots };
  failoverBatch.snapshots.forEach((snap) => {
    failoverSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1032TresPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    backboneBufferGraphRevision: persisted.backboneBufferGraphRevision + 1,
    failoverSnapshots,
    regionalBackboneBuffer,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateTelecomStressExposure },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateTelecomStressExposure > 58
      ? [
          {
            id: `ffed_hazard_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateTelecomStressExposure.toFixed(1)}; exchange_zone ${aggregateTelecomResilience.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1032_TRES_telecomResilienceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'exchange_zone',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; backboneBuffer ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateTelecomStressExposureIndex: aggregateTelecomStressExposure,
      aggregateTelecomResilienceScore: aggregateTelecomResilience,
      telecomNetworkHarmonyScore: fiscalFederalism,
      backboneBufferPressure: heatStressPressure,
      backboneBufferGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1032TresTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1032TresTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      backboneBufferIndex: 0.42,
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
    telecomResiliencePolicyFocus: 48,
    activeFailoverScenarioIds: V1032_TRES_listActiveFailoverScenarioIds(turn).slice(0, 10),
    activeExchangeZoneIds: ['exchange_zone_00', 'exchange_zone_01'],
    persisted: null,
  };
}

export { createEmptyV1032TresPersisted, sanitizeV1032TresPersisted };
