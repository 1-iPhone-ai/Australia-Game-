import { v1014laborClamp } from './bands';
import { gritEaseForRegion } from './catalog/workforce-grit-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalPerseveranceGritCouplingBrief,
  type NationalWorkforcePerseveranceDepthIndex,
  type PerseveranceGritCouplingBand
} from './types';

function couplingBand(index: number): PerseveranceGritCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-49 / wave-49 perseverance-grit coupling — perseverance depth × grit (O10-229). */
export function computeNationalPerseveranceGritCouplingBrief(
  state: NationalLaborDemographicsState,
  perseveranceDepth: NationalWorkforcePerseveranceDepthIndex | null | undefined
): NationalPerseveranceGritCouplingBrief {
  if (!state.enabled || !perseveranceDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      perseveranceDrag: 0,
      summary: 'Perseverance-grit coupling idle — workforce perseverance depth unavailable.',
      stewardNote: 'Compute workforce perseverance depth before grit coupling guidance.'
    };
  }

  let gritLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    gritLift += gritEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  gritLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const perseveranceDrag = v1014laborClamp(
    perseveranceDepth.perseveranceDrag * 0.46 +
      (perseveranceDepth.band === 'fragile' || perseveranceDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    perseveranceDepth.band === 'elevated' || perseveranceDepth.band === 'perseverance'
      ? perseveranceDepth.perseveranceIndex * 0.22
      : perseveranceDepth.perseveranceIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + gritLift * 21 + depthLift - perseveranceDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained perseverance-grit link — deploy grit levers before wave-49 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard grit resilience spikes that drain perseverance buffers.'
        : 'Amplified coupling — pair grit packs with subject grit readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    perseveranceDrag,
    summary: `Perseverance-grit coupling ${band} (index ${Math.round(couplingIndex)}); perseverance drag ${Math.round(perseveranceDrag)}.`,
    stewardNote
  };
}
