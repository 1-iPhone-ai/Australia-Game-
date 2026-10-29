import { v1014laborClamp } from './bands';
import { reengagementPullForRegion } from './catalog/workforce-reengagement-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingVelocityOutlook,
  type NationalReengagementMomentumOutlook,
  type ReengagementMomentumBand
} from './types';

function momentumBand(index: number): ReengagementMomentumBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'building';
  return 'surging';
}

export function computeNationalReengagementMomentumOutlook(
  state: NationalLaborDemographicsState,
  onboardingVelocity: NationalOnboardingVelocityOutlook | null | undefined
): NationalReengagementMomentumOutlook {
  if (!state.enabled || !onboardingVelocity) {
    return {
      turn: state.turn,
      momentumIndex: 50,
      band: 'patchy',
      pipelineDrag: 0,
      summary: 'Reengagement momentum idle — onboarding velocity unavailable.',
      stewardNote: 'Compute onboarding velocity before reengagement momentum guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pipelineDrag = v1014laborClamp(
    onboardingVelocity.pipelineDrag * 0.48 +
      (onboardingVelocity.band === 'stalled' || onboardingVelocity.band === 'uneven' ? 10 : 3)
  );
  const onboardingLift =
    onboardingVelocity.band === 'steady' || onboardingVelocity.band === 'surging'
      ? onboardingVelocity.velocityIndex * 0.2
      : onboardingVelocity.velocityIndex * 0.1;

  const momentumIndex = v1014laborClamp(24 + reengagementLift * 22 + onboardingLift - pipelineDrag);
  const band = momentumBand(momentumIndex);

  const stewardNote =
    band === 'stalled' || band === 'patchy'
      ? 'Patchy reengagement momentum — deploy reengagement levers before subject wave assembly.'
      : band === 'surging'
        ? 'Surging momentum — verify continuity-coordination coupling before scale-wave intake.'
        : 'Building momentum — align reengagement with household participation coupling checks.';

  return {
    turn: state.turn,
    momentumIndex,
    band,
    pipelineDrag,
    summary: `National reengagement momentum ${band} (index ${Math.round(momentumIndex)}); pipeline drag ${Math.round(pipelineDrag)}.`,
    stewardNote
  };
}
