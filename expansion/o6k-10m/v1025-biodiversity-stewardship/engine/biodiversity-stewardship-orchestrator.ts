/**
 * Turn orchestrator — V1018 biodiversity stewardship (SECTION 20BU), post–§11A.
 */
import type { V1025BioPersisted, V1025BioRegionId, V1025BioTurnInput, V1025BioTurnResult } from '../types/core';
import {
  V1025_BIO_clamp,
  V1025_BIO_hash,
  V1025_BIO_mixSeed,
  V1025_BIO_stewardshipBandFromScore,
  V1025_BIO_weightedMean,
} from './biodiversity-stewardship-utils';
import { createEmptyV1025BioPersisted, sanitizeV1025BioPersisted } from '../persistence/migrations';
import { buildV1025BioBriefing } from '../adapters/adapter-crosswire-hub';
import { computeV1025BioSupply20bbBridge } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1025BioTrade20baBridge } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1025BioEnergy20bcBridge } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1025BioWorkforce20bfBridge } from '../adapters/adapter-v1014-workforce-20bf';
import { V1025_BIO_conservationOffsetGraphHash, V1025_BIO_conservationOffsetPressure } from '../conservation-offset-stacks/graph-utils';
import { V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES } from '../generated/conservation-offset-bundle';
import {
  V1025_BIO_evaluateRecoveryBatch,
  V1025_BIO_listActiveRecoveryScenarioIds,
} from '../generated/recovery-registry';
import { V1025_BIO_PROTECTED_AREA_00_buffer } from '../protected-area-nodes/protected-area-00';

const REGIONS: V1025BioRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1025BioInputHash(input: V1025BioTurnInput): string {
  return V1025_BIO_hash({
    turn: input.turn,
    seed: input.seed,
    bottleneck: input.supply20bb.bottleneckPressure,
    sanctions: input.trade20ba.sanctionsPressure,
    scenarios: input.activeRecoveryScenarioIds.slice(0, 12),
    nodes: input.activeProtectedAreaIds.slice(0, 12),
  });
}

export function runV1025BioTurn(input: V1025BioTurnInput): V1025BioTurnResult {
  const persisted = sanitizeV1025BioPersisted(input.persisted ?? createEmptyV1025BioPersisted(), input.turn);

  const mix = V1025_BIO_mixSeed(input.seed, input.turn, 'v1025_biodiversity_stewardship');
  const scenarioIds =
    input.activeRecoveryScenarioIds.length > 0
      ? input.activeRecoveryScenarioIds
      : V1025_BIO_listActiveRecoveryScenarioIds(input.turn);
  const recoveryBatch = V1025_BIO_evaluateRecoveryBatch(input.turn, scenarioIds);

  let aggregateEcosystemStress = V1025_BIO_clamp(
    recoveryBatch.meanEcosystemStress * 0.52 +
      input.supply20bb.bottleneckPressure * 0.18 +
      input.trade20ba.sanctionsPressure * 0.06 +
      mix * 7,
    0,
    100,
  );

  const heatStressPressure = V1025_BIO_conservationOffsetPressure(
    V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES,
    input.turn,
    aggregateEcosystemStress,
  );

  const supplyBridge = computeV1025BioSupply20bbBridge(input, aggregateEcosystemStress);
  const tradeBridge = computeV1025BioTrade20baBridge(input, heatStressPressure);
  const energyBridge = computeV1025BioEnergy20bcBridge(input, aggregateEcosystemStress);
  const workforceBridge = computeV1025BioWorkforce20bfBridge(input, aggregateEcosystemStress);

  const nodeBuffer = V1025_BIO_PROTECTED_AREA_00_buffer(input.turn);
  const aggregateStewardship = V1025_BIO_clamp(
    recoveryBatch.meanStewardshipScore * 0.45 +
      input.energy20bc.gridStability * 0.22 +
      input.workforce20bf.nationalReadiness * 0.12 +
      nodeBuffer * 18 +
      input.stewardshipPolicyFocus * 0.05 -
      aggregateEcosystemStress * 0.14,
    0,
    100,
  );

  const fiscalFederalism = V1025_BIO_clamp(
    aggregateStewardship -
      tradeBridge.importStressContribution * 12 -
      energyBridge.gridDrag * 8 +
      workforceBridge.readinessDelta * 0.6,
    0,
    100,
  );

  const conservationOffsetGraphHash = V1025_BIO_conservationOffsetGraphHash(V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES);
  const inputHash = v1025BioInputHash(input);
  const briefing = buildV1025BioBriefing(input, aggregateEcosystemStress, aggregateStewardship);

  const regionalConservationOffset = { ...persisted.regionalConservationOffset };
  REGIONS.forEach((region, idx) => {
    const prior = regionalConservationOffset[region] ?? {
      bufferIndex: 42,
      rerouteStress: 38,
      compositeCapacity: 50,
      exposedSystems: 2,
    };
    const regionalTransfer = recoveryBatch.byRegion[region];
    const compositeCapacity = V1025_BIO_clamp(
      V1025_BIO_weightedMean([
        { weight: 1.1, value: aggregateStewardship - idx * 0.15 },
        { weight: 0.9, value: regionalTransfer?.stewardshipScore ?? aggregateStewardship },
        { weight: 0.6, value: input.supply20bb.regionalStockDays?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalConservationOffset[region] = {
      bufferIndex: V1025_BIO_clamp(prior.bufferIndex + nodeBuffer * 4 - aggregateEcosystemStress * 0.03, 0, 100),
      rerouteStress: V1025_BIO_clamp(
        prior.rerouteStress + (regionalTransfer?.ecosystemStressIndex ?? aggregateEcosystemStress) * 0.04,
        0,
        100,
      ),
      compositeCapacity,
      exposedSystems: V1025_BIO_clamp(
        prior.exposedSystems + (regionalTransfer ? 1 : 0) + (tradeBridge.importStressContribution > 0.35 ? 1 : 0),
        0,
        10,
      ),
    };
  });

  const recoverySnapshots = { ...persisted.recoverySnapshots };
  recoveryBatch.snapshots.forEach((snap) => {
    recoverySnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1025BioPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    conservationOffsetGraphRevision: persisted.conservationOffsetGraphRevision + 1,
    recoverySnapshots,
    regionalConservationOffset,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateEcosystemStress },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateEcosystemStress > 58
      ? [
          {
            id: `ffed_stress_${input.turn}`,
            turn: input.turn,
            kind: 'supply_transfer',
            title: 'National state–federal transfer elevated',
            summary: `Severity ${aggregateEcosystemStress.toFixed(1)}; protected_area ${aggregateStewardship.toFixed(1)}.`,
          },
        ]
      : [];

  if (V1025_BIO_stewardshipBandFromScore(fiscalFederalism) === 'critical') {
    worldEvents.push({
      id: `ffed_cont_${input.turn}`,
      turn: input.turn,
      kind: 'protected_area',
      title: 'Compliance band critical',
      summary: `Resilience ${fiscalFederalism.toFixed(1)}; conservationOffset ${heatStressPressure.toFixed(2)}.`,
    });
  }

  void supplyBridge;
  void energyBridge;

  return {
    state: {
      turn: input.turn,
      aggregateEcosystemStressIndex: aggregateEcosystemStress,
      aggregateStewardshipScore: aggregateStewardship,
      stewardshipClimateHarmonyScore: fiscalFederalism,
      conservationOffsetPressure: heatStressPressure,
      conservationOffsetGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export function buildV1025BioTurnInputFromGameStateStub(
  turn: number,
  seed: number,
): V1025BioTurnInput {
  return {
    turn,
    seed,
    supply20bb: {
      turn,
      bottleneckPressure: 44,
      regionalStockDays: { NSW: 18, VIC: 16 },
      conservationOffsetIndex: 0.42,
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
      invasiveRiskStress: 33,
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
    habitatHeadroom: 55,
    stewardshipPolicyFocus: 48,
    activeRecoveryScenarioIds: V1025_BIO_listActiveRecoveryScenarioIds(turn).slice(0, 10),
    activeProtectedAreaIds: ['protected_area_00', 'protected_area_01'],
    persisted: null,
  };
}

export { createEmptyV1025BioPersisted, sanitizeV1025BioPersisted };
