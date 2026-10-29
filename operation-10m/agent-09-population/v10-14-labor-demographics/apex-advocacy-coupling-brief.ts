import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type ApexAdvocacyCouplingBand,
  type NationalApexAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceApexIndex
} from './types';

function couplingBand(index: number): ApexAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

export function computeNationalApexAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  apex: NationalWorkforceApexIndex | null | undefined
): NationalApexAdvocacyCouplingBrief {
  if (!state.enabled || !apex) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      apexDrag: 0,
      summary: 'Apex-advocacy coupling idle — workforce apex unavailable.',
      stewardNote: 'Compute workforce apex before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const apexDrag = v1014laborClamp(
    apex.apexDrag * 0.48 + (apex.band === 'fragile' || apex.band === 'thin' ? 11 : 3)
  );
  const apexLift =
    apex.band === 'elevated' || apex.band === 'summit' ? apex.apexIndex * 0.24 : apex.apexIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + apexLift - apexDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained apex-advocacy link — deploy advocacy levers before wave-27 pinnacle commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard reengagement thrust spikes that drain advocacy buffers.'
        : 'Amplified coupling — pair advocacy packs with subject pinnacle readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    apexDrag,
    summary: `Apex-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); apex drag ${Math.round(apexDrag)}.`,
    stewardNote
  };
}
