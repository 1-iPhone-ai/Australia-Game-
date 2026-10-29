import { v1014laborClamp } from './bands';
import { careReliefForRegion } from './catalog/workforce-care-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOrbitCareCouplingBrief,
  type NationalWorkforceOrbitIndex,
  type OrbitCareCouplingBand
} from './types';

function couplingBand(index: number): OrbitCareCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-32 / wave-32 orbit-care coupling — orbit × care levers (O10-195). */
export function computeNationalOrbitCareCouplingBrief(
  state: NationalLaborDemographicsState,
  orbit: NationalWorkforceOrbitIndex | null | undefined
): NationalOrbitCareCouplingBrief {
  if (!state.enabled || !orbit) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      orbitDrag: 0,
      summary: 'Orbit-care coupling idle — workforce orbit unavailable.',
      stewardNote: 'Compute workforce orbit before care coupling guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const orbitDrag = v1014laborClamp(
    orbit.orbitDrag * 0.48 + (orbit.band === 'fragile' || orbit.band === 'thin' ? 11 : 3)
  );
  const orbitLift =
    orbit.band === 'elevated' || orbit.band === 'orbit'
      ? orbit.orbitIndex * 0.24
      : orbit.orbitIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + careLift * 21 + orbitLift - orbitDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained orbit-care link — deploy care levers before wave-32 nexus commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard care equilibrium spikes that drain orbit buffers.'
        : 'Amplified coupling — pair care packs with subject nexus readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    orbitDrag,
    summary: `Orbit-care coupling ${band} (index ${Math.round(couplingIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}
