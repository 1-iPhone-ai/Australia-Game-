import { v1014laborClamp } from './bands';
import { reengagementPullForRegion } from './catalog/workforce-reengagement-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingSustainOutlook,
  type NationalReengagementThrustOutlook,
  type ReengagementThrustBand
} from './types';

function thrustBand(index: number): ReengagementThrustBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'building';
  return 'surging';
}

export function computeNationalReengagementThrustOutlook(
  state: NationalLaborDemographicsState,
  onboardingSustain: NationalOnboardingSustainOutlook | null | undefined
): NationalReengagementThrustOutlook {
  if (!state.enabled || !onboardingSustain) {
    return {
      turn: state.turn,
      thrustIndex: 50,
      band: 'patchy',
      sustainDrag: 0,
      summary: 'Reengagement thrust idle — onboarding sustain unavailable.',
      stewardNote: 'Compute onboarding sustain before reengagement thrust guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const sustainDrag = v1014laborClamp(
    onboardingSustain.anchorDrag * 0.46 +
      (onboardingSustain.band === 'depleted' || onboardingSustain.band === 'thin' ? 10 : 3)
  );
  const sustainLift =
    onboardingSustain.band === 'sustained' || onboardingSustain.band === 'deep'
      ? onboardingSustain.sustainIndex * 0.2
      : onboardingSustain.sustainIndex * 0.1;

  const thrustIndex = v1014laborClamp(24 + reengagementLift * 22 + sustainLift - sustainDrag);
  const band = thrustBand(thrustIndex);

  const stewardNote =
    band === 'stalled' || band === 'patchy'
      ? 'Patchy reengagement thrust — deploy reengagement levers before subject pinnacle assembly.'
      : band === 'surging'
        ? 'Surging thrust band — verify apex-advocacy coupling before auto workforce pushes.'
        : 'Building thrust — align with reengagement momentum outlook checks.';

  return {
    turn: state.turn,
    thrustIndex,
    band,
    sustainDrag,
    summary: `National reengagement thrust ${band} (index ${Math.round(thrustIndex)}); sustain drag ${Math.round(sustainDrag)}.`,
    stewardNote
  };
}
