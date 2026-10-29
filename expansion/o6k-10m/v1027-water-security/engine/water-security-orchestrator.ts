/**
 * Turn orchestrator — V1027 water security (SECTION 20BW), post–§11A.
 */
import type { V1027WsecPersisted, V1027WsecRegionId, V1027WsecTurnInput, V1027WsecTurnResult } from '../types/core';
import {
  V1027_WSEC_clamp,
  V1027_WSEC_hash,
  V1027_WSEC_mixSeed,
  V1027_WSEC_waterSecurityBandFromScore,
  V1027_WSEC_weightedMean,
} from './water-security-utils';
import { createEmptyV1027WsecPersisted, sanitizeV1027WsecPersisted } from '../persistence/migrations';
import { buildV1027WsecBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1027WsecSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1027WsecTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1027WsecEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1027WsecWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1027_WSEC_aquiferReserveGraphHash, V1027_WSEC_aquiferReservePressure } from '../aquifer-reserve-stacks/graph-utils';
import { V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES } from '../generated/aquifer-reserve-bundle';
import {
  V1027_WSEC_evaluateBasinBatch,
  V1027_WSEC_listActiveBasinScenarioIds,
} from '../generated/basin-registry';
import { V1027_WSEC_DISTRIBUTION_NETWORK_00_buffer } from '../distribution-network-nodes/distribution-network-00';

const REGIONS: V1027WsecRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1027WsecInputHash(input: V1027WsecTurnInput): string {
  return V1027_WSEC_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeBasinScenarioIds.slice(0, 12),
    nodes: input.activeDistributionNetworkIds.slice(0, 12),
  });
}

export function runV1027WsecTurn(input: V1027WsecTurnInput): V1027WsecTurnResult {
  const persisted = sanitizeV1027WsecPersisted(input.persisted ?? createEmptyV1027WsecPersisted(), input.turn);

  const mix = V1027_WSEC_mixSeed(input.seed, input.turn, 'v1027_water_security');
  const scenarioIds =
    input.activeBasinScenarioIds.length > 0
      ? input.activeBasinScenarioIds
      : V1027_WSEC_listActiveBasinScenarioIds(input.turn);
  const basinBatch = V1027_WSEC_evaluateBasinBatch(input.turn, scenarioIds);

  let aggregateWaterStress = V1027_WSEC_clamp(
    basinBatch.meanWaterStress * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1027_WSEC_aquiferReservePressure(
    V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES,
    input.turn,
    aggregateWaterStress,
  );

  const supplyBridge = computeV1027WsecSupply20bbBridge(input, aggregateWaterStress);
  const tradeBridge = computeV1027WsecTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1027WsecEnergy20bcBridge(input, aggregateWaterStress);
  const workforceBridge = computeV1027WsecWorkforce20bfBridge(input, aggregateWaterStress);

  const nodeBuffer = V1027_WSEC_DISTRIBUTION_NETWORK_00_buffer(input.turn);
  const aggregateWaterSecurity = V1027_WSEC_clamp(
    basinBatch.meanWaterSecurityScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.waterPolicyFocus * 0.05 -
      aggregateWaterStress * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1027_WSEC_clamp(
    aggregateWaterSecurity -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const aquiferReserveGraphHash = V1027_WSEC_aquiferReserveGraphHash(V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES);
  const inputHash = v1027WsecInputHash(input);
  const briefing = buildV1027WsecBriefing(input, aggregateWaterStress, aggregateWaterSecurity);

  const regionalAquiferReserve = { ...persisted.regionalAquiferReserve };
  REGIONS.forEach((region, idx) => {
    const prior = regionalAquiferReserve[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = basinBatch.byRegion[region];
    const compositeCapacity = V1027_WSEC_clamp(
      V1027_WSEC_weightedMean([
        { weight: 1.1, value: aggregateWaterSecurity - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.waterSecurityScore ?? aggregateWaterSecurity },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalAquiferReserve[region] = {
      bufferIndex: V1027_WSEC_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateWaterStress * 0.03, 0, 100),
      rerouteStress: V1027_WSEC_clamp(
        prior.rerouteStress + (regionalTransfer?.waterStressIndex ?? aggregateWaterStress) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1027_WSEC_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const basinSnapshots = { ...persisted.basinSnapshots };
  basinBatch.snapshots.forEach((snap) => {
    basinSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1027WsecPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    aquiferReserveGraphRevision: persisted.aquiferReserveGraphRevision + 1,
    basinSnapshots,
    regionalAquiferReserve,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateWaterStress },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateWaterStress > 58
      ? [
          {
            id: `ffed_basin_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateWaterStress.toFixed(1)}; distribution_network ${aggregateWaterSecurity.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1027_WSEC_waterSecurityBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'distribution_network',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; aquiferReserve ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateWaterStressIndex: aggregateWaterStress,
      aggregateWaterSecurityScore: aggregateWaterSecurity,
      waterClimateHarmonyScore: fiscalFederalism,
      aquiferReservePressure: heatStressPressure,
      aquiferReserveGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1027WsecTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1027WsecTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      aquiferReserveIndex: 0.42,
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
      droughtRiskStress: 33,
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
    biodiversityStewardship20bu: {
      turn,
      catchmentIntegrityPressure: 30,
      grantStackLoad: 0.24,
      offsetDriftTurns: 13,
    },
    storageHeadroom: 55,
    waterPolicyFocus: 48,
    activeBasinScenarioIds: V1027_WSEC_listActiveBasinScenarioIds(turn).slice(0, 10),
    activeDistributionNetworkIds: ['distribution_network_00', 'distribution_network_01'],
    persisted: null,
  };
}

export { createEmptyV1027WsecPersisted, sanitizeV1027WsecPersisted };
