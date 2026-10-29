import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type AdvocacyResonanceBand,
  type NationalAdvocacyResonanceOutlook,
  type NationalLaborDemographicsState,
  type NationalMentorshipSustainOutlook
} from './types';

function resonanceBand(index: number): AdvocacyResonanceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'resonant';
}

export function computeNationalAdvocacyResonanceOutlook(
  state: NationalLaborDemographicsState,
  mentorshipSustain: NationalMentorshipSustainOutlook | null | undefined
): NationalAdvocacyResonanceOutlook {
  if (!state.enabled || !mentorshipSustain) {
    return {
      turn: state.turn,
      resonanceIndex: 50,
      band: 'patchy',
      mentorshipDrag: 0,
      summary: 'Advocacy resonance idle — mentorship sustain unavailable.',
      stewardNote: 'Compute mentorship sustain before advocacy resonance guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mentorshipDrag = v1014laborClamp(
    mentorshipSustain.reengagementDrag * 0.46 +
      (mentorshipSustain.band === 'ebbing' || mentorshipSustain.band === 'patchy' ? 10 : 3)
  );
  const sustainLift =
    mentorshipSustain.band === 'rising' || mentorshipSustain.band === 'sustained'
      ? mentorshipSustain.sustainIndex * 0.2
      : mentorshipSustain.sustainIndex * 0.1;

  const resonanceIndex = v1014laborClamp(24 + advocacyLift * 22 + sustainLift - mentorshipDrag);
  const band = resonanceBand(resonanceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy advocacy resonance — deploy advocacy levers before subject advocacy assembly.'
      : band === 'resonant'
        ? 'Resonant band — verify mentorship-advocacy coupling before auto workforce pushes.'
        : 'Rising resonance — align with mentorship sustain outlook checks.';

  return {
    turn: state.turn,
    resonanceIndex,
    band,
    mentorshipDrag,
    summary: `National advocacy resonance ${band} (index ${Math.round(resonanceIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}
