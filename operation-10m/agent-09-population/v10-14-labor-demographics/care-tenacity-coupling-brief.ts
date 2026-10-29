import { v1014laborClamp } from './bands';
import { tenacityEaseForRegion } from './catalog/workforce-tenacity-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CareTenacityCouplingBand,
  type NationalCareTenacityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceCareIndex
} from './types';

function couplingBand(index: number): CareTenacityCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-47 / wave-47 care-tenacity coupling — care × tenacity (O10-225). */
export function computeNationalCareTenacityCouplingBrief(
  state: NationalLaborDemographicsState,
  care: NationalWorkforceCareIndex | null | undefined
): NationalCareTenacityCouplingBrief {
  if (!state.enabled || !care) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      careDrag: 0,
      summary: 'Care-tenacity coupling idle — workforce care unavailable.',
      stewardNote: 'Compute workforce care before tenacity coupling guidance.'
    };
  }

  let tenacityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    tenacityLift += tenacityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  tenacityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const careDrag = v1014laborClamp(
    care.careDrag * 0.48 + (care.band === 'fragile' || care.band === 'thin' ? 11 : 3)
  );
  const careLift =
    care.band === 'elevated' || care.band === 'care'
      ? care.careIndex * 0.24
      : care.careIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + tenacityLift * 21 + careLift - careDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained care-tenacity link — deploy tenacity levers before wave-47 tenacity commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard tenacity resilience spikes that drain care buffers.'
        : 'Amplified coupling — pair tenacity packs with subject tenacity readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    careDrag,
    summary: `Care-tenacity coupling ${band} (index ${Math.round(couplingIndex)}); care drag ${Math.round(careDrag)}.`,
    stewardNote
  };
}
