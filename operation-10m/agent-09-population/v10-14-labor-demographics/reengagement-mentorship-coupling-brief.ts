import { v1014laborClamp } from './bands';
import { mentorshipEaseForRegion } from './catalog/workforce-mentorship-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalReengagementMentorshipCouplingBrief,
  type NationalWorkforceReengagementIndex,
  type ReengagementMentorshipCouplingBand
} from './types';

function couplingBand(index: number): ReengagementMentorshipCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-39 / wave-39 reengagement-mentorship coupling — reengagement × mentorship (O10-209). */
export function computeNationalReengagementMentorshipCouplingBrief(
  state: NationalLaborDemographicsState,
  reengagement: NationalWorkforceReengagementIndex | null | undefined
): NationalReengagementMentorshipCouplingBrief {
  if (!state.enabled || !reengagement) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      reengagementDrag: 0,
      summary: 'Reengagement-mentorship coupling idle — workforce reengagement unavailable.',
      stewardNote: 'Compute workforce reengagement before mentorship coupling guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const reengagementDrag = v1014laborClamp(
    reengagement.reengagementDrag * 0.48 + (reengagement.band === 'fragile' || reengagement.band === 'thin' ? 11 : 3)
  );
  const reengagementLift =
    reengagement.band === 'elevated' || reengagement.band === 'reengagement'
      ? reengagement.reengagementIndex * 0.24
      : reengagement.reengagementIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + mentorshipLift * 21 + reengagementLift - reengagementDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained reengagement-mentorship link — deploy mentorship levers before wave-39 mentorship commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard mentorship sustain spikes that drain reengagement buffers.'
        : 'Amplified coupling — pair mentorship packs with subject mentorship readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    reengagementDrag,
    summary: `Reengagement-mentorship coupling ${band} (index ${Math.round(couplingIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}
