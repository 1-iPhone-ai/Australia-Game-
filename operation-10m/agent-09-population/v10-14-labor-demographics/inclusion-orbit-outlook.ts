import { v1014laborClamp } from './bands';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type InclusionOrbitBand,
  type NationalFlexibilityAscentOutlook,
  type NationalInclusionOrbitOutlook,
  type NationalLaborDemographicsState
} from './types';

function orbitBand(index: number): InclusionOrbitBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'orbit';
}

export function computeNationalInclusionOrbitOutlook(
  state: NationalLaborDemographicsState,
  flexibilityAscent: NationalFlexibilityAscentOutlook | null | undefined
): NationalInclusionOrbitOutlook {
  if (!state.enabled || !flexibilityAscent) {
    return {
      turn: state.turn,
      orbitIndex: 50,
      band: 'patchy',
      ascentDrag: 0,
      summary: 'Inclusion orbit idle — flexibility ascent unavailable.',
      stewardNote: 'Compute flexibility ascent before inclusion orbit guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const ascentDrag = v1014laborClamp(
    flexibilityAscent.horizonDrag * 0.46 +
      (flexibilityAscent.band === 'ebbing' || flexibilityAscent.band === 'patchy' ? 10 : 3)
  );
  const ascentLift =
    flexibilityAscent.band === 'rising' || flexibilityAscent.band === 'ascent'
      ? flexibilityAscent.ascentIndex * 0.2
      : flexibilityAscent.ascentIndex * 0.1;

  const orbitIndex = v1014laborClamp(24 + inclusionLift * 22 + ascentLift - ascentDrag);
  const band = orbitBand(orbitIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy inclusion orbit — deploy inclusion levers before subject orbit assembly.'
      : band === 'orbit'
        ? 'Orbit band — verify apogee-inclusion coupling before auto workforce pushes.'
        : 'Rising orbit — align with fortitude-inclusion coupling checks.';

  return {
    turn: state.turn,
    orbitIndex,
    band,
    ascentDrag,
    summary: `National inclusion orbit ${band} (index ${Math.round(orbitIndex)}); ascent drag ${Math.round(ascentDrag)}.`,
    stewardNote
  };
}
