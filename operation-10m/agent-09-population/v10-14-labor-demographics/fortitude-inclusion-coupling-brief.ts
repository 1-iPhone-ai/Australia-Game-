import { v1014laborClamp } from './bands';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type FortitudeInclusionCouplingBand,
  type NationalFortitudeInclusionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceFortitudeIndex
} from './types';

function couplingBand(index: number): FortitudeInclusionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'inclusive';
  return 'elevated';
}

export function computeNationalFortitudeInclusionCouplingBrief(
  state: NationalLaborDemographicsState,
  fortitude: NationalWorkforceFortitudeIndex | null | undefined
): NationalFortitudeInclusionCouplingBrief {
  if (!state.enabled || !fortitude) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      fortitudeDrag: 0,
      summary: 'Fortitude-inclusion coupling idle — workforce fortitude unavailable.',
      stewardNote: 'Compute workforce fortitude before inclusion coupling guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const fortitudeDrag = v1014laborClamp(
    fortitude.bindDrag * 0.48 +
      (fortitude.band === 'fragile' || fortitude.band === 'thin' ? 11 : 3)
  );
  const fortitudeLift =
    fortitude.band === 'solid' || fortitude.band === 'unshakable'
      ? fortitude.fortitudeIndex * 0.24
      : fortitude.fortitudeIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + inclusionLift * 21 + fortitudeLift - fortitudeDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained fortitude-inclusion link — deploy inclusion levers before round-25 crown commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard hybrid anchor spikes that drain inclusion buffers.'
        : 'Inclusive coupling — pair inclusion packs with subject crown readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    fortitudeDrag,
    summary: `Fortitude-inclusion coupling ${band} (index ${Math.round(couplingIndex)}); fortitude drag ${Math.round(fortitudeDrag)}.`,
    stewardNote
  };
}
