import type {
  V1014WorkforceAc20Slice,
  V1014WorkforceAf20Slice,
  V1014WorkforceAj20Slice,
  V1014WorkforceTurnInput,
} from '../types/core';
import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_flowBandRank } from '../engine/workforce-migration-utils';

export function readV1014WorkforceAc20Bridge(slice: V1014WorkforceAc20Slice, mismatchIndex: number) {
  const gap = V1014_WORKFORCE_clamp(slice.specialistGap + mismatchIndex * 0.22, 0, 100);
  const readinessDelta = V1014_WORKFORCE_clamp((slice.nationalReadiness - 55) * 0.08 - gap * 0.05, -8, 8);
  return {
    readinessDelta,
    specialistGapDelta: gap - slice.specialistGap,
    domainPressure: slice.domainDepth ?? {},
  };
}

export function readV1014WorkforceAj20Bridge(slice: V1014WorkforceAj20Slice, migrationPressure: number) {
  const rank = V1014_WORKFORCE_flowBandRank(slice.migrationFlowBand);
  const wagePressureContribution = V1014_WORKFORCE_clamp(
    slice.wagePressureIndex * 0.01 + migrationPressure * 0.15 + (rank - 2) * 0.04,
    0,
    1,
  );
  return {
    flowBandHint: slice.migrationFlowBand,
    attractivenessDelta: slice.regionalAttractiveness,
    wagePressureContribution,
  };
}

export function readV1014WorkforceAf20Bridge(slice: V1014WorkforceAf20Slice, mismatchIndex: number) {
  const affordabilityDrag = V1014_WORKFORCE_clamp(slice.affordabilityStress * 0.008 + mismatchIndex * 0.12, 0, 0.45);
  const domesticDemandMultiplier = V1014_WORKFORCE_clamp(
    1 - affordabilityDrag * 0.35 + slice.domesticDemandPull * 0.004,
    0.62,
    1.08,
  );
  return {
    affordabilityDrag,
    domesticDemandMultiplier,
    livingStandardDelta: slice.regionalLivingStandard,
  };
}

export function buildV1014WorkforceMigrationBriefing(
  input: V1014WorkforceTurnInput,
  mismatch: number,
  readiness: number,
): string {
  return (
    `Turn ${input.turn}: readiness ${readiness.toFixed(1)}, mismatch ${mismatch.toFixed(1)}, ` +
    `flow ${input.aj20.migrationFlowBand}, affordability ${input.af20.affordabilityStress.toFixed(0)}.`
  );
}
