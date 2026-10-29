import { v1014laborClamp } from './bands';
import { onboardingEaseForRegion } from './catalog/workforce-onboarding-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingIntegrationOutlook,
  type NationalUpskillingSynthesisOutlook,
  type OnboardingIntegrationBand
} from './types';

function integrationBand(index: number): OnboardingIntegrationBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'integration';
}

export function computeNationalOnboardingIntegrationOutlook(
  state: NationalLaborDemographicsState,
  upskillingSynthesis: NationalUpskillingSynthesisOutlook | null | undefined
): NationalOnboardingIntegrationOutlook {
  if (!state.enabled || !upskillingSynthesis) {
    return {
      turn: state.turn,
      integrationIndex: 50,
      band: 'patchy',
      synthesisDrag: 0,
      summary: 'Onboarding integration idle — upskilling synthesis unavailable.',
      stewardNote: 'Compute upskilling synthesis before onboarding integration guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const synthesisDrag = v1014laborClamp(
    upskillingSynthesis.harmonyDrag * 0.46 +
      (upskillingSynthesis.band === 'ebbing' || upskillingSynthesis.band === 'patchy' ? 10 : 3)
  );
  const synthesisLift =
    upskillingSynthesis.band === 'rising' || upskillingSynthesis.band === 'synthesis'
      ? upskillingSynthesis.synthesisIndex * 0.2
      : upskillingSynthesis.synthesisIndex * 0.1;

  const integrationIndex = v1014laborClamp(24 + onboardingLift * 22 + synthesisLift - synthesisDrag);
  const band = integrationBand(integrationIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy onboarding integration — deploy onboarding levers before subject integration assembly.'
      : band === 'integration'
        ? 'Integration band — verify synthesis-onboarding coupling before auto workforce pushes.'
        : 'Rising integration — align with onboarding sustain outlook checks.';

  return {
    turn: state.turn,
    integrationIndex,
    band,
    synthesisDrag,
    summary: `National onboarding integration ${band} (index ${Math.round(integrationIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}
