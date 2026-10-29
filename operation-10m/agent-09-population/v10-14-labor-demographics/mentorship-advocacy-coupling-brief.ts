import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type MentorshipAdvocacyCouplingBand,
  type NationalLaborDemographicsState,
  type NationalMentorshipAdvocacyCouplingBrief,
  type NationalWorkforceMentorshipIndex
} from './types';

function couplingBand(index: number): MentorshipAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-40 / wave-40 mentorship-advocacy coupling — mentorship × advocacy (O10-211). */
export function computeNationalMentorshipAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  mentorship: NationalWorkforceMentorshipIndex | null | undefined
): NationalMentorshipAdvocacyCouplingBrief {
  if (!state.enabled || !mentorship) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      mentorshipDrag: 0,
      summary: 'Mentorship-advocacy coupling idle — workforce mentorship unavailable.',
      stewardNote: 'Compute workforce mentorship before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mentorshipDrag = v1014laborClamp(
    mentorship.mentorshipDrag * 0.48 + (mentorship.band === 'fragile' || mentorship.band === 'thin' ? 11 : 3)
  );
  const mentorshipLift =
    mentorship.band === 'elevated' || mentorship.band === 'mentorship'
      ? mentorship.mentorshipIndex * 0.24
      : mentorship.mentorshipIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + mentorshipLift - mentorshipDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained mentorship-advocacy link — deploy advocacy levers before wave-40 advocacy commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard advocacy resonance spikes that drain mentorship buffers.'
        : 'Amplified coupling — pair advocacy packs with subject advocacy readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    mentorshipDrag,
    summary: `Mentorship-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}
