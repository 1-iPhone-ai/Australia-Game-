import { v1014laborClamp } from './bands';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type ApogeeInclusionCouplingBand,
  type NationalApogeeInclusionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceApogeeIndex
} from './types';

function couplingBand(index: number): ApogeeInclusionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-31 / wave-31 apogee-inclusion coupling — apogee × inclusion levers (O10-193). */
export function computeNationalApogeeInclusionCouplingBrief(
  state: NationalLaborDemographicsState,
  apogee: NationalWorkforceApogeeIndex | null | undefined
): NationalApogeeInclusionCouplingBrief {
  if (!state.enabled || !apogee) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      apogeeDrag: 0,
      summary: 'Apogee-inclusion coupling idle — workforce apogee unavailable.',
      stewardNote: 'Compute workforce apogee before inclusion coupling guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const apogeeDrag = v1014laborClamp(
    apogee.apogeeDrag * 0.48 + (apogee.band === 'fragile' || apogee.band === 'thin' ? 11 : 3)
  );
  const apogeeLift =
    apogee.band === 'elevated' || apogee.band === 'apogee'
      ? apogee.apogeeIndex * 0.24
      : apogee.apogeeIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + inclusionLift * 21 + apogeeLift - apogeeDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained apogee-inclusion link — deploy inclusion levers before wave-31 orbit commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard inclusion orbit spikes that drain apogee buffers.'
        : 'Amplified coupling — pair inclusion packs with subject orbit readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    apogeeDrag,
    summary: `Apogee-inclusion coupling ${band} (index ${Math.round(couplingIndex)}); apogee drag ${Math.round(apogeeDrag)}.`,
    stewardNote
  };
}
