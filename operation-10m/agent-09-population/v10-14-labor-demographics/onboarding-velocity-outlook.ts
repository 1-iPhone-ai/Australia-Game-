import { v1014laborClamp } from './bands';
import { onboardingEaseForRegion } from './catalog/workforce-onboarding-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingVelocityOutlook,
  type NationalUpskillingVelocityOutlook,
  type OnboardingVelocityBand
} from './types';

function velocityBand(index: number): OnboardingVelocityBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'steady';
  return 'surging';
}

export function computeNationalOnboardingVelocityOutlook(
  state: NationalLaborDemographicsState,
  upskillingVelocity: NationalUpskillingVelocityOutlook | null | undefined
): NationalOnboardingVelocityOutlook {
  if (!state.enabled || !upskillingVelocity) {
    return {
      turn: state.turn,
      velocityIndex: 50,
      band: 'uneven',
      pipelineDrag: 0,
      summary: 'Onboarding velocity idle — upskilling velocity outlook unavailable.',
      stewardNote: 'Compute upskilling velocity before onboarding pipeline guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pipelineDrag = v1014laborClamp(
    upskillingVelocity.mismatchDrag * 0.5 +
      (upskillingVelocity.band === 'stalled' || upskillingVelocity.band === 'uneven' ? 11 : 3)
  );
  const upskillingLift =
    upskillingVelocity.band === 'active' || upskillingVelocity.band === 'accelerating'
      ? upskillingVelocity.velocityIndex * 0.22
      : upskillingVelocity.velocityIndex * 0.11;

  const velocityIndex = v1014laborClamp(24 + onboardingLift * 23 + upskillingLift - pipelineDrag);
  const band = velocityBand(velocityIndex);

  const stewardNote =
    band === 'stalled' || band === 'uneven'
      ? 'Uneven onboarding velocity — ease onboarding levers before subject assembly commits.'
      : band === 'surging'
        ? 'Surging onboarding band — verify sustainment-retention coupling before scale-wave intake.'
        : 'Steady onboarding — align pipeline velocity with credential mobility checks.';

  return {
    turn: state.turn,
    velocityIndex,
    band,
    pipelineDrag,
    summary: `National onboarding velocity ${band} (index ${Math.round(velocityIndex)}); pipeline drag ${Math.round(pipelineDrag)}.`,
    stewardNote
  };
}
