/**
 * Turn orchestrator — V1018 regional health systems (SECTION 20BV), post–§11A.
 */
import type { V1026RhsPersisted, V1026RhsRegionId, V1026RhsTurnInput, V1026RhsTurnResult } from '../types/core';
import {
  V1026_RHS_clamp,
  V1026_RHS_hash,
  V1026_RHS_mixSeed,
  V1026_RHS_healthSystemBandFromScore,
  V1026_RHS_weightedMean,
} from './regional-health-systems-utils';
import { createEmptyV1026RhsPersisted, sanitizeV1026RhsPersisted } from '../persistence/migrations';
import { buildV1026RhsBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1026RhsSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1026RhsTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1026RhsEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1026RhsWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1026_RHS_primaryCareAccessGraphHash, V1026_RHS_primaryCareAccessPressure } from '../primary-care-access-stacks/graph-utils';
import { V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES } from '../generated/primary-care-access-bundle';
import {
  V1026_RHS_evaluateCareBatch,
  V1026_RHS_listActiveCareScenarioIds,
} from '../generated/care-registry';
import { V1026_RHS_HOSPITAL_NETWORK_00_buffer } from '../hospital-network-nodes/hospital-network-00';

const REGIONS: V1026RhsRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1026RhsInputHash(input: V1026RhsTurnInput): string {
  return V1026_RHS_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeCareScenarioIds.slice(0, 12),
    nodes: input.activeHospitalNetworkIds.slice(0, 12),
  });
}

export function runV1026RhsTurn(input: V1026RhsTurnInput): V1026RhsTurnResult {
  const persisted = sanitizeV1026RhsPersisted(input.persisted ?? createEmptyV1026RhsPersisted(), input.turn);

  const mix = V1026_RHS_mixSeed(input.seed, input.turn, 'v1026_regional_health_systems');
  const scenarioIds =
    input.activeCareScenarioIds.length > 0
      ? input.activeCareScenarioIds
      : V1026_RHS_listActiveCareScenarioIds(input.turn);
  const careBatch = V1026_RHS_evaluateCareBatch(input.turn, scenarioIds);

  let aggregateCapacityStress = V1026_RHS_clamp(
    careBatch.meanCapacityStress * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1026_RHS_primaryCareAccessPressure(
    V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES,
    input.turn,
    aggregateCapacityStress,
  );

  const supplyBridge = computeV1026RhsSupply20bbBridge(input, aggregateCapacityStress);
  const tradeBridge = computeV1026RhsTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1026RhsEnergy20bcBridge(input, aggregateCapacityStress);
  const workforceBridge = computeV1026RhsWorkforce20bfBridge(input, aggregateCapacityStress);

  const nodeBuffer = V1026_RHS_HOSPITAL_NETWORK_00_buffer(input.turn);
  const aggregateHealthSystem = V1026_RHS_clamp(
    careBatch.meanHealthSystemScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.healthPolicyFocus * 0.05 -
      aggregateCapacityStress * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1026_RHS_clamp(
    aggregateHealthSystem -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const primaryCareAccessGraphHash = V1026_RHS_primaryCareAccessGraphHash(V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES);
  const inputHash = v1026RhsInputHash(input);
  const briefing = buildV1026RhsBriefing(input, aggregateCapacityStress, aggregateHealthSystem);

  const regionalPrimaryCareAccess = { ...persisted.regionalPrimaryCareAccess };
  REGIONS.forEach((region, idx) => {
    const prior = regionalPrimaryCareAccess[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = careBatch.byRegion[region];
    const compositeCapacity = V1026_RHS_clamp(
      V1026_RHS_weightedMean([
        { weight: 1.1, value: aggregateHealthSystem - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.healthSystemScore ?? aggregateHealthSystem },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalPrimaryCareAccess[region] = {
      bufferIndex: V1026_RHS_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateCapacityStress * 0.03, 0, 100),
      rerouteStress: V1026_RHS_clamp(
        prior.rerouteStress + (regionalTransfer?.capacityStressIndex ?? aggregateCapacityStress) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1026_RHS_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const careSnapshots = { ...persisted.careSnapshots };
  careBatch.snapshots.forEach((snap) => {
    careSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1026RhsPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    primaryCareAccessGraphRevision: persisted.primaryCareAccessGraphRevision + 1,
    careSnapshots,
    regionalPrimaryCareAccess,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateCapacityStress },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateCapacityStress > 58
      ? [
          {
            id: `ffed_stress_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateCapacityStress.toFixed(1)}; hospital_network ${aggregateHealthSystem.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1026_RHS_healthSystemBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'hospital_network',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; primaryCareAccess ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateCapacityStressIndex: aggregateCapacityStress,
      aggregateHealthSystemScore: aggregateHealthSystem,
      healthClimateHarmonyScore: fiscalFederalism,
      primaryCareAccessPressure: heatStressPressure,
      primaryCareAccessGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1026RhsTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1026RhsTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      primaryCareAccessIndex: 0.42,
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
      surgeRiskStress: 33,
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
    bedHeadroom: 55,
    healthPolicyFocus: 48,
    activeCareScenarioIds: V1026_RHS_listActiveCareScenarioIds(turn).slice(0, 10),
    activeHospitalNetworkIds: ['hospital_network_00', 'hospital_network_01'],
    persisted: null,
  };
}

export { createEmptyV1026RhsPersisted, sanitizeV1026RhsPersisted };
