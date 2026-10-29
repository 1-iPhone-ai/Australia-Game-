/**
 * Turn orchestrator — V1018 research pipeline (SECTION 20BL), post–§11A.
 */
import type { V1020RpipePersisted, V1020RpipeRegionId, V1020RpipeTurnInput, V1020RpipeTurnResult } from '../types/core';
import {
  V1020_RPIPE_clamp,
  V1020_RPIPE_hash,
  V1020_RPIPE_mixSeed,
  V1020_RPIPE_complianceFromScore,
  V1020_RPIPE_weightedMean,
} from './research-pipeline-utils';
import { createEmptyV1020RpipePersisted, sanitizeV1020RpipePersisted } from '../persistence/migrations';
import { buildV1020RpipeBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1020RpipeSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1020RpipeTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1020RpipeEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1020RpipeWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1020_RPIPE_commercializationStackGraphHash, V1020_RPIPE_commercializationStackPressure } from '../commercialization-stacks/graph-utils';
import { V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES } from '../generated/commercialization-stack-bundle';
import {
  V1020_RPIPE_evaluatePipelineBatch,
  V1020_RPIPE_listActivePipelineScenarioIds,
} from '../generated/pipeline-registry';
import { V1020_RPIPE_LAB_TRANSFER_NODE_00_buffer } from '../lab-transfers/lab-transfer-00';

const REGIONS: V1020RpipeRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1020RpipeInputHash(input: V1020RpipeTurnInput): string {
  return V1020_RPIPE_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeTransferScenarioIds.slice(0, 12),
    nodes: input.activeLabTransferNodeIds.slice(0, 12),
  });
}

export function runV1020RpipeTurn(input: V1020RpipeTurnInput): V1020RpipeTurnResult {
  const persisted = sanitizeV1020RpipePersisted(input.persisted ?? createEmptyV1020RpipePersisted(), input.turn);

  const mix = V1020_RPIPE_mixSeed(input.seed, input.turn, 'v1020_research_pipeline');
  const scenarioIds =
    input.activeTransferScenarioIds.length > 0
      ? input.activeTransferScenarioIds
      : V1020_RPIPE_listActivePipelineScenarioIds(input.turn);
  const transferBatch = V1020_RPIPE_evaluatePipelineBatch(input.turn, scenarioIds);

  let aggregateSeverity = V1020_RPIPE_clamp(
    transferBatch.meanSeverity * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const transferPressure = V1020_RPIPE_commercializationStackPressure(
    V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES,
    input.turn,
    aggregateSeverity,
  );

  const supplyBridge = computeV1020RpipeSupply20bbBridge(input, aggregateSeverity);
  const tradeBridge = computeV1020RpipeTrade20baBridge(input, transferPressure);
  const energyBridge = computeV1020RpipeEnergy20bcBridge(input, aggregateSeverity);
  const workforceBridge = computeV1020RpipeWorkforce20bfBridge(input, aggregateSeverity);

  const nodeBuffer = V1020_RPIPE_LAB_TRANSFER_NODE_00_buffer(input.turn);
  const aggregateCompliance = V1020_RPIPE_clamp(
    transferBatch.meanCompliance * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.pipelinePolicyFocus * 0.05 -
      aggregateSeverity * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1020_RPIPE_clamp(
    aggregateCompliance -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const commercializationStackGraphHash = V1020_RPIPE_commercializationStackGraphHash(V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES);
  const inputHash = v1020RpipeInputHash(input);
  const briefing = buildV1020RpipeBriefing(input, aggregateSeverity, aggregateCompliance);

  const regionalCompliance = { ...persisted.regionalCompliance };
  REGIONS.forEach((region, idx) => {
    const prior = regionalCompliance[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCompliance: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = transferBatch.byRegion[region];
    const compositeCompliance = V1020_RPIPE_clamp(
      V1020_RPIPE_weightedMean([
        { weight: 1.1, value: aggregateCompliance - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.complianceScore ?? aggregateCompliance },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalCompliance[region] = {
      bufferIndex: V1020_RPIPE_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateSeverity * 0.03, 0, 100),
      rerouteStress: V1020_RPIPE_clamp(
        prior.rerouteStress + (regionalTransfer?.severityIndex ?? aggregateSeverity) * 0.04,
        0,
        100,
      ),
      compositeCompliance,
      exposedSystems: V1020_RPIPE_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const pipelineSnapshots = { ...persisted.pipelineSnapshots };
  transferBatch.snapshots.forEach((snap) => {
    pipelineSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1020RpipePersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    commercializationStackGraphRevision: persisted.commercializationStackGraphRevision + 1,
    pipelineSnapshots,
    regionalCompliance,
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
            id: `ffed_pipeline_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateSeverity.toFixed(1)}; lab_transfer ${aggregateCompliance.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1020_RPIPE_complianceFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'lab_transfer',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; commercializationStack ${transferPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateSeverityIndex: aggregateSeverity,
      aggregateComplianceScore: aggregateCompliance,
      fiscalFederalismScore: fiscalFederalism,
      supplyTransferPressure: transferPressure,
      commercializationStackGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1020RpipeTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1020RpipeTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      commercializationStackIndex: 0.42,
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
    aiFidelity20be: {
      turn,
      planVerifyScore: 64,
      automationCoverage: 0.39,
      commercializationReadiness: 51,
    },
    fiscalFederalism20bj: {
      turn,
      transferPressure: 34,
      grantStackLoad: 0.31,
      labTransferBacklog: 19,
    },
    researchHeadroom: 55,
    pipelinePolicyFocus: 48,
    activeTransferScenarioIds: V1020_RPIPE_listActivePipelineScenarioIds(turn).slice(0, 10),
    activeLabTransferNodeIds: ['lab_transfer_00', 'lab_transfer_01'],
    persisted: null,
  };
}

export { createEmptyV1020RpipePersisted, sanitizeV1020RpipePersisted };
