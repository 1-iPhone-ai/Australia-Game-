import { v1014laborClamp } from './bands';
import { mentorshipEaseForRegion } from './catalog/workforce-mentorship-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CulminationMentorshipCouplingBand,
  type NationalCulminationMentorshipCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceCulminationIndex
} from './types';

function couplingBand(index: number): CulminationMentorshipCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'guided';
  return 'elevated';
}

export function computeNationalCulminationMentorshipCouplingBrief(
  state: NationalLaborDemographicsState,
  culmination: NationalWorkforceCulminationIndex | null | undefined
): NationalCulminationMentorshipCouplingBrief {
  if (!state.enabled || !culmination) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      culminationDrag: 0,
      summary: 'Culmination-mentorship coupling idle — workforce culmination unavailable.',
      stewardNote: 'Compute workforce culmination before mentorship coupling guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const culminationDrag = v1014laborClamp(
    culmination.crownDrag * 0.48 +
      (culmination.band === 'fragile' || culmination.band === 'thin' ? 11 : 3)
  );
  const culminationLift =
    culmination.band === 'ready' || culmination.band === 'summit'
      ? culmination.culminationIndex * 0.24
      : culmination.culminationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + mentorshipLift * 21 + culminationLift - culminationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained culmination-mentorship link — ease mentorship levers before wave-26 apex commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard onboarding sustain spikes that drain mentorship buffers.'
        : 'Guided coupling — pair mentorship packs with subject apex readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    culminationDrag,
    summary: `Culmination-mentorship coupling ${band} (index ${Math.round(couplingIndex)}); culmination drag ${Math.round(culminationDrag)}.`,
    stewardNote
  };
}
