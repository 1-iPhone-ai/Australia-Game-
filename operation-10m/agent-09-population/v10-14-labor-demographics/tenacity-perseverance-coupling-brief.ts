import { v1014laborClamp } from './bands';
import { perseveranceEaseForRegion } from './catalog/workforce-perseverance-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalTenacityPerseveranceCouplingBrief,
  type NationalWorkforceTenacityDepthIndex,
  type TenacityPerseveranceCouplingBand
} from './types';

function couplingBand(index: number): TenacityPerseveranceCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-48 / wave-48 tenacity-perseverance coupling — tenacity depth × perseverance (O10-227). */
export function computeNationalTenacityPerseveranceCouplingBrief(
  state: NationalLaborDemographicsState,
  tenacityDepth: NationalWorkforceTenacityDepthIndex | null | undefined
): NationalTenacityPerseveranceCouplingBrief {
  if (!state.enabled || !tenacityDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      tenacityDrag: 0,
      summary: 'Tenacity-perseverance coupling idle — workforce tenacity depth unavailable.',
      stewardNote: 'Compute workforce tenacity depth before perseverance coupling guidance.'
    };
  }

  let perseveranceLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    perseveranceLift += perseveranceEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  perseveranceLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const tenacityDrag = v1014laborClamp(
    tenacityDepth.tenacityDrag * 0.47 + (tenacityDepth.band === 'fragile' || tenacityDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    tenacityDepth.band === 'elevated' || tenacityDepth.band === 'tenacity'
      ? tenacityDepth.tenacityIndex * 0.23
      : tenacityDepth.tenacityIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + perseveranceLift * 21 + depthLift - tenacityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained tenacity-perseverance link — deploy perseverance levers before wave-48 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard perseverance resilience spikes that drain tenacity buffers.'
        : 'Amplified coupling — pair perseverance packs with subject perseverance readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    tenacityDrag,
    summary: `Tenacity-perseverance coupling ${band} (index ${Math.round(couplingIndex)}); tenacity drag ${Math.round(tenacityDrag)}.`,
    stewardNote
  };
}
