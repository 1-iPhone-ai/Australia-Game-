import { v1014laborClamp } from './bands';
import { careReliefForRegion } from './catalog/workforce-care-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CareEquilibriumBand,
  type NationalCareEquilibriumOutlook,
  type NationalInclusionOrbitOutlook,
  type NationalLaborDemographicsState
} from './types';

function equilibriumBand(index: number): CareEquilibriumBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'equilibrium';
}

export function computeNationalCareEquilibriumOutlook(
  state: NationalLaborDemographicsState,
  inclusionOrbit: NationalInclusionOrbitOutlook | null | undefined
): NationalCareEquilibriumOutlook {
  if (!state.enabled || !inclusionOrbit) {
    return {
      turn: state.turn,
      equilibriumIndex: 50,
      band: 'patchy',
      orbitDrag: 0,
      summary: 'Care equilibrium idle — inclusion orbit unavailable.',
      stewardNote: 'Compute inclusion orbit before care equilibrium guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const orbitDrag = v1014laborClamp(
    inclusionOrbit.ascentDrag * 0.46 +
      (inclusionOrbit.band === 'ebbing' || inclusionOrbit.band === 'patchy' ? 10 : 3)
  );
  const orbitLift =
    inclusionOrbit.band === 'rising' || inclusionOrbit.band === 'orbit'
      ? inclusionOrbit.orbitIndex * 0.2
      : inclusionOrbit.orbitIndex * 0.1;

  const equilibriumIndex = v1014laborClamp(24 + careLift * 22 + orbitLift - orbitDrag);
  const band = equilibriumBand(equilibriumIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy care equilibrium — deploy care levers before subject nexus assembly.'
      : band === 'equilibrium'
        ? 'Equilibrium band — verify orbit-care coupling before auto workforce pushes.'
        : 'Rising equilibrium — align with tenacity-care coupling checks.';

  return {
    turn: state.turn,
    equilibriumIndex,
    band,
    orbitDrag,
    summary: `National care equilibrium ${band} (index ${Math.round(equilibriumIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}
