import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type FlexibilityAscentBand,
  type NationalCoordinationHorizonOutlook,
  type NationalFlexibilityAscentOutlook,
  type NationalLaborDemographicsState
} from './types';

function ascentBand(index: number): FlexibilityAscentBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'ascent';
}

export function computeNationalFlexibilityAscentOutlook(
  state: NationalLaborDemographicsState,
  coordinationHorizon: NationalCoordinationHorizonOutlook | null | undefined
): NationalFlexibilityAscentOutlook {
  if (!state.enabled || !coordinationHorizon) {
    return {
      turn: state.turn,
      ascentIndex: 50,
      band: 'patchy',
      horizonDrag: 0,
      summary: 'Flexibility ascent idle — coordination horizon unavailable.',
      stewardNote: 'Compute coordination horizon before flexibility ascent guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const horizonDrag = v1014laborClamp(
    coordinationHorizon.crestDrag * 0.46 +
      (coordinationHorizon.band === 'ebbing' || coordinationHorizon.band === 'patchy' ? 10 : 3)
  );
  const horizonLift =
    coordinationHorizon.band === 'rising' || coordinationHorizon.band === 'horizon'
      ? coordinationHorizon.horizonIndex * 0.2
      : coordinationHorizon.horizonIndex * 0.1;

  const ascentIndex = v1014laborClamp(24 + flexibilityLift * 22 + horizonLift - horizonDrag);
  const band = ascentBand(ascentIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy flexibility ascent — deploy flexibility levers before subject apogee assembly.'
      : band === 'ascent'
        ? 'Ascent band — verify zenith-flexibility coupling before auto workforce pushes.'
        : 'Rising ascent — align with endurance-flexibility coupling checks.';

  return {
    turn: state.turn,
    ascentIndex,
    band,
    horizonDrag,
    summary: `National flexibility ascent ${band} (index ${Math.round(ascentIndex)}); horizon drag ${Math.round(horizonDrag)}.`,
    stewardNote
  };
}
