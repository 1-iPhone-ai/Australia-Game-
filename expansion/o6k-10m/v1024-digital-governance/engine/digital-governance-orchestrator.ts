/**
 * Turn orchestrator — V1018 digital governance (SECTION 20BT), post–§11A.
 */
import type { V1024DgovPersisted, V1024DgovRegionId, V1024DgovTurnInput, V1024DgovTurnResult } from '../types/core';
import {
  V1024_DGOV_clamp,
  V1024_DGOV_hash,
  V1024_DGOV_mixSeed,
  V1024_DGOV_governanceBandFromScore,
  V1024_DGOV_weightedMean,
} from './digital-governance-utils';
import { createEmptyV1024DgovPersisted, sanitizeV1024DgovPersisted } from '../persistence/migrations';
import { buildV1024DgovBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1024DgovSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1024DgovTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1024DgovEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1024DgovWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1024_DGOV_dataSovereigntyGraphHash, V1024_DGOV_dataSovereigntyPressure } from '../data-sovereignty-stacks/graph-utils';
import { V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES } from '../generated/data-sovereignty-bundle';
import {
  V1024_DGOV_evaluatePolicyBatch,
  V1024_DGOV_listActivePolicyScenarioIds,
} from '../generated/policy-registry';
import { V1024_DGOV_PLATFORM_NODE_00_buffer } from '../platform-regulation-nodes/platform-node-00';

const REGIONS: V1024DgovRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1024DgovInputHash(input: V1024DgovTurnInput): string {
  return V1024_DGOV_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activePolicyScenarioIds.slice(0, 12),
    nodes: input.activePlatformNodeIds.slice(0, 12),
  });
}

export function runV1024DgovTurn(input: V1024DgovTurnInput): V1024DgovTurnResult {
  const persisted = sanitizeV1024DgovPersisted(input.persisted ?? createEmptyV1024DgovPersisted(), input.turn);

  const mix = V1024_DGOV_mixSeed(input.seed, input.turn, 'v1024_digital_governance');
  const scenarioIds =
    input.activePolicyScenarioIds.length > 0
      ? input.activePolicyScenarioIds
      : V1024_DGOV_listActivePolicyScenarioIds(input.turn);
  const policyBatch = V1024_DGOV_evaluatePolicyBatch(input.turn, scenarioIds);

  let aggregateComplianceStress = V1024_DGOV_clamp(
    policyBatch.meanComplianceStress * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const modelGovernancePressure = V1024_DGOV_dataSovereigntyPressure(
    V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES,
    input.turn,
    aggregateComplianceStress,
  );

  const supplyBridge = computeV1024DgovSupply20bbBridge(input, aggregateComplianceStress);
  const tradeBridge = computeV1024DgovTrade20baBridge(input, modelGovernancePressure);
  const energyBridge = computeV1024DgovEnergy20bcBridge(input, aggregateComplianceStress);
  const workforceBridge = computeV1024DgovWorkforce20bfBridge(input, aggregateComplianceStress);

  const nodeBuffer = V1024_DGOV_PLATFORM_NODE_00_buffer(input.turn);
  const aggregateGovernance = V1024_DGOV_clamp(
    policyBatch.meanGovernanceScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.governancePolicyFocus * 0.05 -
      aggregateComplianceStress * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1024_DGOV_clamp(
    aggregateGovernance -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const dataSovereigntyGraphHash = V1024_DGOV_dataSovereigntyGraphHash(V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES);
  const inputHash = v1024DgovInputHash(input);
  const briefing = buildV1024DgovBriefing(input, aggregateComplianceStress, aggregateGovernance);

  const regionalDataSovereignty = { ...persisted.regionalDataSovereignty };
  REGIONS.forEach((region, idx) => {
    const prior = regionalDataSovereignty[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = policyBatch.byRegion[region];
    const compositeCapacity = V1024_DGOV_clamp(
      V1024_DGOV_weightedMean([
        { weight: 1.1, value: aggregateGovernance - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.governanceScore ?? aggregateGovernance },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalDataSovereignty[region] = {
      bufferIndex: V1024_DGOV_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateComplianceStress * 0.03, 0, 100),
      rerouteStress: V1024_DGOV_clamp(
        prior.rerouteStress + (regionalTransfer?.complianceStressIndex ?? aggregateComplianceStress) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1024_DGOV_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const policySnapshots = { ...persisted.policySnapshots };
  policyBatch.snapshots.forEach((snap) => {
    policySnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1024DgovPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    dataSovereigntyGraphRevision: persisted.dataSovereigntyGraphRevision + 1,
    policySnapshots,
    regionalDataSovereignty,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateComplianceStress },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateComplianceStress > 58
      ? [
          {
            id: `ffed_stress_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateComplianceStress.toFixed(1)}; platform_node ${aggregateGovernance.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1024_DGOV_governanceBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'platform_node',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; dataSovereignty ${modelGovernancePressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateComplianceStressIndex: aggregateComplianceStress,
      aggregateGovernanceScore: aggregateGovernance,
      governanceAiHarmonyScore: fiscalFederalism,
      dataSovereigntyPressure: modelGovernancePressure,
      dataSovereigntyGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1024DgovTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1024DgovTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      dataSovereigntyIndex: 0.42,
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
      platformRiskStress: 33,
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
    aiFidelity20be: {
      turn,
      modelGovernancePressure: 34,
      grantStackLoad: 0.31,
      alignmentDriftTurns: 19,
    },
    auditHeadroom: 55,
    governancePolicyFocus: 48,
    activePolicyScenarioIds: V1024_DGOV_listActivePolicyScenarioIds(turn).slice(0, 10),
    activePlatformNodeIds: ['platform_node_00', 'platform_node_01'],
    persisted: null,
  };
}

export { createEmptyV1024DgovPersisted, sanitizeV1024DgovPersisted };
