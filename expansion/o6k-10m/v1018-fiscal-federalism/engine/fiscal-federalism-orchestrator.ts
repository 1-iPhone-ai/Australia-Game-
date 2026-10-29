/**
 * Turn orchestrator — V1018 fiscal federalism (SECTION 20BI), post–§11A.
 */
import type { V1018FfedPersisted, V1018FfedRegionId, V1018FfedTurnInput, V1018FfedTurnResult } from '../types/core';
import {
  V1018_FFED_clamp,
  V1018_FFED_hash,
  V1018_FFED_mixSeed,
  V1018_FFED_complianceFromScore,
  V1018_FFED_weightedMean,
} from './fiscal-federalism-utils';
import { createEmptyV1018FfedPersisted, sanitizeV1018FfedPersisted } from '../persistence/migrations';
import { buildV1018FfedBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1018FfedSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1018FfedTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1018FfedEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1018FfedWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1018_FFED_grantStackGraphHash, V1018_FFED_grantStackPressure } from '../grant-stacks/graph-utils';
import { V1018_FFED_GENERATED_GRANT_STACK_EDGES } from '../generated/grant-stack-bundle';
import {
  V1018_FFED_evaluateTransferBatch,
  V1018_FFED_listActiveTransferScenarioIds,
} from '../generated/transfer-registry';
import { V1018_FFED_AUDIT_NODE_00_buffer } from '../audit-trails/audit-00';

const REGIONS: V1018FfedRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1018FfedInputHash(input: V1018FfedTurnInput): string {
  return V1018_FFED_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeTransferScenarioIds.slice(0, 12),
    nodes: input.activeComplianceNodeIds.slice(0, 12),
  });
}

export function runV1018FfedTurn(input: V1018FfedTurnInput): V1018FfedTurnResult {
  const persisted = sanitizeV1018FfedPersisted(input.persisted ?? createEmptyV1018FfedPersisted(), input.turn);

  const mix = V1018_FFED_mixSeed(input.seed, input.turn, 'v1018_fiscal_federalism');
  const scenarioIds =
    input.activeTransferScenarioIds.length > 0
      ? input.activeTransferScenarioIds
      : V1018_FFED_listActiveTransferScenarioIds(input.turn);
  const transferBatch = V1018_FFED_evaluateTransferBatch(input.turn, scenarioIds);

  let aggregateSeverity = V1018_FFED_clamp(
    transferBatch.meanSeverity * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const transferPressure = V1018_FFED_grantStackPressure(
    V1018_FFED_GENERATED_GRANT_STACK_EDGES,
    input.turn,
    aggregateSeverity,
  );

  const supplyBridge = computeV1018FfedSupply20bbBridge(input, aggregateSeverity);
  const tradeBridge = computeV1018FfedTrade20baBridge(input, transferPressure);
  const energyBridge = computeV1018FfedEnergy20bcBridge(input, aggregateSeverity);
  const workforceBridge = computeV1018FfedWorkforce20bfBridge(input, aggregateSeverity);

  const nodeBuffer = V1018_FFED_AUDIT_NODE_00_buffer(input.turn);
  const aggregateCompliance = V1018_FFED_clamp(
    transferBatch.meanCompliance * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.federalismPolicyFocus * 0.05 -
      aggregateSeverity * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1018_FFED_clamp(
    aggregateCompliance -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const grantStackGraphHash = V1018_FFED_grantStackGraphHash(V1018_FFED_GENERATED_GRANT_STACK_EDGES);
  const inputHash = v1018FfedInputHash(input);
  const briefing = buildV1018FfedBriefing(input, aggregateSeverity, aggregateCompliance);

  const regionalCompliance = { ...persisted.regionalCompliance };
  REGIONS.forEach((region, idx) => {
    const prior = regionalCompliance[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCompliance: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = transferBatch.byRegion[region];
    const compositeCompliance = V1018_FFED_clamp(
      V1018_FFED_weightedMean([
        { weight: 1.1, value: aggregateCompliance - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.complianceScore ?? aggregateCompliance },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalCompliance[region] = {
      bufferIndex: V1018_FFED_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateSeverity * 0.03, 0, 100),
      rerouteStress: V1018_FFED_clamp(
        prior.rerouteStress + (regionalTransfer?.severityIndex ?? aggregateSeverity) * 0.04,
        0,
        100,
      ),
      compositeCompliance,
      exposedSystems: V1018_FFED_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const transferSnapshots = { ...persisted.transferSnapshots };
  transferBatch.snapshots.forEach((snap) => {
    transferSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1018FfedPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    grantStackGraphRevision: persisted.grantStackGraphRevision + 1,
    transferSnapshots,
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
            id: `ffed_transfer_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateSeverity.toFixed(1)}; audit_trail ${aggregateCompliance.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1018_FFED_complianceFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'audit_trail',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; grantStack ${transferPressure.toFixed(2)}.`,
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
      grantStackGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1018FfedTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1018FfedTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      grantStackIndex: 0.42,
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
    federalismPolicyFocus: 48,
    activeTransferScenarioIds: V1018_FFED_listActiveTransferScenarioIds(turn).slice(0, 10),
    activeComplianceNodeIds: ['audit_00', 'audit_01'],
    persisted: null,
  };
}

export { createEmptyV1018FfedPersisted, sanitizeV1018FfedPersisted };
