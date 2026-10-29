import { AGENT14_CORE_REGIONS, AGENT14_HOUSING_REGION_BASELINE } from './constants.ts';
import { advanceDelayedSpendingEffects, commitSpendingProgram } from './delayed-spending-effects.ts';
import { computeAllRegionalHousingPipelines } from './housing-delivery-pipeline.ts';
import { computeNationalHousingWellbeingSnapshot } from './national-wellbeing-snapshot.ts';
import { recommendAgent14ProgramSequence } from './program-sequencing.ts';
import { computeNationalServiceAccessLens } from './service-access-lens.ts';
import { computeCrossPillarCoupling } from './cross-pillar-coupling.ts';
import { advanceRegionalWellbeingMemory } from './regional-wellbeing-memory.ts';
import { evaluateAgent14WellbeingWarnings } from './wellbeing-guardian-warnings.ts';
import { advanceCouplingTrajectory } from './coupling-trajectory.ts';
import { adviseEquityRebalancing } from './equity-rebalancing-advisor.ts';
import { composeWellbeingAccountabilityScorecard } from './wellbeing-accountability-scorecard.ts';
import { composeAgent14WellbeingExecutiveBrief } from './wellbeing-executive-brief.ts';
import {
  canAcceptSpendingCommitment,
  computePublicServiceCapacity,
} from './public-service-capacity.ts';
import type {
  CapacityAndSpendingInputs,
  CouplingTrajectoryPersisted,
  DelayedSpendingPersisted,
  EnrichedPublicServiceTurnInputs,
  RegionalWellbeingMemoryPersisted,
  SpendingCommitment,
} from './types.ts';

export interface AdvancePublicServicesTurnArgs {
  inputs: CapacityAndSpendingInputs;
  spendingPersisted?: DelayedSpendingPersisted | null;
  wellbeingMemoryPersisted?: RegionalWellbeingMemoryPersisted | null;
  couplingTrajectoryPersisted?: CouplingTrajectoryPersisted | null;
  /** New commitments queued this turn (already validated or not). */
  newCommitments?: SpendingCommitment[];
  /** When true, reject commitments that fail capacity gate. */
  enforceCapacity?: boolean;
}

export interface AdvancePublicServicesTurnResult {
  inputs: EnrichedPublicServiceTurnInputs;
  spendingPersisted: DelayedSpendingPersisted;
  wellbeingMemoryPersisted: RegionalWellbeingMemoryPersisted;
  couplingTrajectoryPersisted: CouplingTrajectoryPersisted;
  rejectedCommitments: Array<{ commitment: SpendingCommitment; reason: string }>;
}

export function advancePublicServicesTurn(
  args: AdvancePublicServicesTurnArgs
): AdvancePublicServicesTurnResult {
  const turn = Math.max(1, Math.floor(args.inputs.turn || 1));
  let spendingPersisted = args.spendingPersisted ?? null;
  const rejectedCommitments: AdvancePublicServicesTurnResult['rejectedCommitments'] = [];

  for (const c of args.newCommitments ?? []) {
    const capacityNow = computePublicServiceCapacity(
      args.inputs,
      spendingPersisted?.active ?? []
    );
    const gate = canAcceptSpendingCommitment(capacityNow, c);
    if (!gate.allowed && args.enforceCapacity !== false) {
      rejectedCommitments.push({ commitment: c, reason: gate.reason });
      continue;
    }
    spendingPersisted = commitSpendingProgram(spendingPersisted, c);
  }

  const { effects, persisted: afterTick } = advanceDelayedSpendingEffects(turn, spendingPersisted);
  spendingPersisted = afterTick;

  const capacity = computePublicServiceCapacity(args.inputs, spendingPersisted.active);

  const fiscalHeadroom = args.inputs.fiscalHeadroom ?? 55;
  const regionalPipelines = computeAllRegionalHousingPipelines(
    turn,
    capacity,
    effects,
    fiscalHeadroom
  );
  const housingWellbeing = computeNationalHousingWellbeingSnapshot(turn, regionalPipelines);

  const remoteShareByRegion = Object.fromEntries(
    AGENT14_CORE_REGIONS.map((r) => [r, AGENT14_HOUSING_REGION_BASELINE[r].remoteShare])
  );
  const serviceAccessLens = computeNationalServiceAccessLens(
    turn,
    capacity,
    effects,
    remoteShareByRegion
  );
  const wellbeingWarnings = evaluateAgent14WellbeingWarnings(
    capacity,
    housingWellbeing,
    serviceAccessLens
  );
  const programRecommendations = recommendAgent14ProgramSequence(
    turn,
    capacity,
    housingWellbeing,
    serviceAccessLens,
    6
  );

  const crossPillarCoupling = computeCrossPillarCoupling(
    turn,
    capacity,
    housingWellbeing,
    serviceAccessLens
  );

  const memoryAdvance = advanceRegionalWellbeingMemory(
    turn,
    housingWellbeing,
    serviceAccessLens,
    args.wellbeingMemoryPersisted
  );

  const couplingTrajectoryAdvance = advanceCouplingTrajectory(
    turn,
    crossPillarCoupling,
    args.couplingTrajectoryPersisted
  );

  const equityRebalancing = adviseEquityRebalancing({
    turn,
    housing: housingWellbeing,
    access: serviceAccessLens,
    memory: memoryAdvance.snapshot,
  });

  const accountabilityScorecard = composeWellbeingAccountabilityScorecard({
    turn,
    capacity,
    housing: housingWellbeing,
    warnings: wellbeingWarnings,
    coupling: crossPillarCoupling,
    couplingTrajectory: couplingTrajectoryAdvance.snapshot,
    memory: memoryAdvance.snapshot,
    spendingPersisted,
  });

  const executiveBrief = composeAgent14WellbeingExecutiveBrief({
    turn,
    warnings: wellbeingWarnings,
    coupling: crossPillarCoupling,
    recommendations: programRecommendations,
    accountabilityScorecard,
    equityRebalancing,
  });

  const enriched: EnrichedPublicServiceTurnInputs = {
    ...args.inputs,
    turn,
    fiscalLoadFromActivePrograms: Math.round(
      (effects.fiscalLoadThisTurn + (args.inputs.activeProgramCount ?? 0) * 0.5) * 10
    ) / 10,
    completedHousingProjects: effects.completedProjectBoost.housing,
    completedHealthProjects: effects.completedProjectBoost.healthcare,
    completedEducationProjects: effects.completedProjectBoost.education,
    activeProgramCount: spendingPersisted.active.length,
    capacity,
    spending: effects,
    housingWellbeing,
    serviceAccessLens,
    wellbeingWarnings,
    programRecommendations,
    crossPillarCoupling,
    regionalWellbeingMemory: memoryAdvance.snapshot,
    executiveBrief,
    couplingTrajectory: couplingTrajectoryAdvance.snapshot,
    accountabilityScorecard,
    equityRebalancing,
  };

  return {
    inputs: enriched,
    spendingPersisted,
    wellbeingMemoryPersisted: memoryAdvance.persisted,
    couplingTrajectoryPersisted: couplingTrajectoryAdvance.persisted,
    rejectedCommitments,
  };
}
