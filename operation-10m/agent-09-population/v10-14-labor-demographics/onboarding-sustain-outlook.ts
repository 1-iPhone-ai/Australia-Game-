import { v1014laborClamp } from './bands';
import { onboardingEaseForRegion } from './catalog/workforce-onboarding-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalHybridAnchorOutlook,
  type NationalLaborDemographicsState,
  type NationalOnboardingSustainOutlook,
  type OnboardingSustainBand
} from './types';

function sustainBand(index: number): OnboardingSustainBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'sustained';
  return 'deep';
}

export function computeNationalOnboardingSustainOutlook(
  state: NationalLaborDemographicsState,
  hybridAnchor: NationalHybridAnchorOutlook | null | undefined
): NationalOnboardingSustainOutlook {
  if (!state.enabled || !hybridAnchor) {
    return {
      turn: state.turn,
      sustainIndex: 50,
      band: 'thin',
      anchorDrag: 0,
      summary: 'Onboarding sustain idle — hybrid anchor unavailable.',
      stewardNote: 'Compute hybrid anchor before onboarding sustain guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const anchorDrag = v1014laborClamp(
    hybridAnchor.bindDrag * 0.46 +
      (hybridAnchor.band === 'drifting' || hybridAnchor.band === 'mixed' ? 10 : 3)
  );
  const anchorLift =
    hybridAnchor.band === 'anchored' || hybridAnchor.band === 'fixed'
      ? hybridAnchor.anchorIndex * 0.2
      : hybridAnchor.anchorIndex * 0.1;

  const sustainIndex = v1014laborClamp(24 + onboardingLift * 22 + anchorLift - anchorDrag);
  const band = sustainBand(sustainIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin onboarding sustain — deploy onboarding levers before subject apex assembly.'
      : band === 'deep'
        ? 'Deep sustain band — verify culmination-mentorship coupling before auto workforce pushes.'
        : 'Sustained onboarding — align sustain with onboarding velocity outlook checks.';

  return {
    turn: state.turn,
    sustainIndex,
    band,
    anchorDrag,
    summary: `National onboarding sustain ${band} (index ${Math.round(sustainIndex)}); anchor drag ${Math.round(anchorDrag)}.`,
    stewardNote
  };
}
