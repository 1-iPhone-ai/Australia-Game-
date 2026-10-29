import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingIntegrationOutlook,
  type NationalRetentionCohesionOutlook,
  type RetentionCohesionBand
} from './types';

function cohesionBand(index: number): RetentionCohesionBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'cohesion';
}

export function computeNationalRetentionCohesionOutlook(
  state: NationalLaborDemographicsState,
  onboardingIntegration: NationalOnboardingIntegrationOutlook | null | undefined
): NationalRetentionCohesionOutlook {
  if (!state.enabled || !onboardingIntegration) {
    return {
      turn: state.turn,
      cohesionIndex: 50,
      band: 'patchy',
      integrationDrag: 0,
      summary: 'Retention cohesion idle — onboarding integration unavailable.',
      stewardNote: 'Compute onboarding integration before retention cohesion guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const integrationDrag = v1014laborClamp(
    onboardingIntegration.synthesisDrag * 0.46 +
      (onboardingIntegration.band === 'ebbing' || onboardingIntegration.band === 'patchy' ? 10 : 3)
  );
  const integrationLift =
    onboardingIntegration.band === 'rising' || onboardingIntegration.band === 'integration'
      ? onboardingIntegration.integrationIndex * 0.2
      : onboardingIntegration.integrationIndex * 0.1;

  const cohesionIndex = v1014laborClamp(24 + retentionLift * 22 + integrationLift - integrationDrag);
  const band = cohesionBand(cohesionIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy retention cohesion — deploy retention levers before subject retention assembly.'
      : band === 'cohesion'
        ? 'Cohesion band — verify integration-retention coupling before auto workforce pushes.'
        : 'Rising cohesion — align with integration sustain outlook checks.';

  return {
    turn: state.turn,
    cohesionIndex,
    band,
    integrationDrag,
    summary: `National retention cohesion ${band} (index ${Math.round(cohesionIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}
