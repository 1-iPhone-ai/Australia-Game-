import { v1014laborClamp } from './bands';
import { onboardingEaseForRegion } from './catalog/workforce-onboarding-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSynthesisOnboardingCouplingBrief,
  type NationalWorkforceSynthesisIndex,
  type SynthesisOnboardingCouplingBand
} from './types';

function couplingBand(index: number): SynthesisOnboardingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-36 / wave-36 synthesis-onboarding coupling — synthesis × onboarding (O10-203). */
export function computeNationalSynthesisOnboardingCouplingBrief(
  state: NationalLaborDemographicsState,
  synthesis: NationalWorkforceSynthesisIndex | null | undefined
): NationalSynthesisOnboardingCouplingBrief {
  if (!state.enabled || !synthesis) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      synthesisDrag: 0,
      summary: 'Synthesis-onboarding coupling idle — workforce synthesis unavailable.',
      stewardNote: 'Compute workforce synthesis before onboarding coupling guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const synthesisDrag = v1014laborClamp(
    synthesis.synthesisDrag * 0.48 + (synthesis.band === 'fragile' || synthesis.band === 'thin' ? 11 : 3)
  );
  const synthesisLift =
    synthesis.band === 'elevated' || synthesis.band === 'synthesis'
      ? synthesis.synthesisIndex * 0.24
      : synthesis.synthesisIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + onboardingLift * 21 + synthesisLift - synthesisDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained synthesis-onboarding link — deploy onboarding levers before wave-36 integration commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard onboarding integration spikes that drain synthesis buffers.'
        : 'Amplified coupling — pair onboarding packs with subject integration readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    synthesisDrag,
    summary: `Synthesis-onboarding coupling ${band} (index ${Math.round(couplingIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}
