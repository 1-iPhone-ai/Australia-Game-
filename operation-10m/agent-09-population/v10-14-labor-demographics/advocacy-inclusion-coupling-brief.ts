import { v1014laborClamp } from './bands';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type AdvocacyInclusionCouplingBand,
  type NationalAdvocacyInclusionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceAdvocacyIndex
} from './types';

function couplingBand(index: number): AdvocacyInclusionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-41 / wave-41 advocacy-inclusion coupling — advocacy × inclusion (O10-213). */
export function computeNationalAdvocacyInclusionCouplingBrief(
  state: NationalLaborDemographicsState,
  advocacy: NationalWorkforceAdvocacyIndex | null | undefined
): NationalAdvocacyInclusionCouplingBrief {
  if (!state.enabled || !advocacy) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      advocacyDrag: 0,
      summary: 'Advocacy-inclusion coupling idle — workforce advocacy unavailable.',
      stewardNote: 'Compute workforce advocacy before inclusion coupling guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const advocacyDrag = v1014laborClamp(
    advocacy.advocacyDrag * 0.48 + (advocacy.band === 'fragile' || advocacy.band === 'thin' ? 11 : 3)
  );
  const advocacyLift =
    advocacy.band === 'elevated' || advocacy.band === 'advocacy'
      ? advocacy.advocacyIndex * 0.24
      : advocacy.advocacyIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + inclusionLift * 21 + advocacyLift - advocacyDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained advocacy-inclusion link — deploy inclusion levers before wave-41 inclusion commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard inclusion equity spikes that drain advocacy buffers.'
        : 'Amplified coupling — pair inclusion packs with subject inclusion readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    advocacyDrag,
    summary: `Advocacy-inclusion coupling ${band} (index ${Math.round(couplingIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
