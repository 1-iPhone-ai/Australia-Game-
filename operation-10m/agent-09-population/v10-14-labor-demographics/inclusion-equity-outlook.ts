import { v1014laborClamp } from './bands';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type InclusionEquityBand,
  type NationalAdvocacyResonanceOutlook,
  type NationalInclusionEquityOutlook,
  type NationalLaborDemographicsState
} from './types';

function equityBand(index: number): InclusionEquityBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'equitable';
}

export function computeNationalInclusionEquityOutlook(
  state: NationalLaborDemographicsState,
  advocacyResonance: NationalAdvocacyResonanceOutlook | null | undefined
): NationalInclusionEquityOutlook {
  if (!state.enabled || !advocacyResonance) {
    return {
      turn: state.turn,
      equityIndex: 50,
      band: 'patchy',
      advocacyDrag: 0,
      summary: 'Inclusion equity idle — advocacy resonance unavailable.',
      stewardNote: 'Compute advocacy resonance before inclusion equity guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const advocacyDrag = v1014laborClamp(
    advocacyResonance.mentorshipDrag * 0.46 +
      (advocacyResonance.band === 'ebbing' || advocacyResonance.band === 'patchy' ? 10 : 3)
  );
  const resonanceLift =
    advocacyResonance.band === 'rising' || advocacyResonance.band === 'resonant'
      ? advocacyResonance.resonanceIndex * 0.2
      : advocacyResonance.resonanceIndex * 0.1;

  const equityIndex = v1014laborClamp(24 + inclusionLift * 22 + resonanceLift - advocacyDrag);
  const band = equityBand(equityIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy inclusion equity — deploy inclusion levers before subject inclusion assembly.'
      : band === 'equitable'
        ? 'Equitable band — verify advocacy-inclusion coupling before auto workforce pushes.'
        : 'Rising equity — align with advocacy resonance outlook checks.';

  return {
    turn: state.turn,
    equityIndex,
    band,
    advocacyDrag,
    summary: `National inclusion equity ${band} (index ${Math.round(equityIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
