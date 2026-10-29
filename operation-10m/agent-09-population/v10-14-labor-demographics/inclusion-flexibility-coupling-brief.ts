import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type InclusionFlexibilityCouplingBand,
  type NationalInclusionFlexibilityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceInclusionIndex
} from './types';

function couplingBand(index: number): InclusionFlexibilityCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-42 / wave-42 inclusion-flexibility coupling — inclusion × flexibility (O10-215). */
export function computeNationalInclusionFlexibilityCouplingBrief(
  state: NationalLaborDemographicsState,
  inclusion: NationalWorkforceInclusionIndex | null | undefined
): NationalInclusionFlexibilityCouplingBrief {
  if (!state.enabled || !inclusion) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      inclusionDrag: 0,
      summary: 'Inclusion-flexibility coupling idle — workforce inclusion unavailable.',
      stewardNote: 'Compute workforce inclusion before flexibility coupling guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const inclusionDrag = v1014laborClamp(
    inclusion.inclusionDrag * 0.48 + (inclusion.band === 'fragile' || inclusion.band === 'thin' ? 11 : 3)
  );
  const inclusionLift =
    inclusion.band === 'elevated' || inclusion.band === 'inclusion'
      ? inclusion.inclusionIndex * 0.24
      : inclusion.inclusionIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + flexibilityLift * 21 + inclusionLift - inclusionDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained inclusion-flexibility link — deploy flexibility levers before wave-42 flexibility commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard flexibility flow spikes that drain inclusion buffers.'
        : 'Amplified coupling — pair flexibility packs with subject flexibility readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    inclusionDrag,
    summary: `Inclusion-flexibility coupling ${band} (index ${Math.round(couplingIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}
