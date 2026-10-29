import { v1014laborClamp } from './bands';
import { upskillingUpliftForRegion } from './catalog/workforce-upskilling-programs';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalUnificationUpskillingCouplingBrief,
  type NationalWorkforceUnificationIndex,
  type UnificationUpskillingCouplingBand
} from './types';

function couplingBand(index: number): UnificationUpskillingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-35 / wave-35 unification-upskilling coupling — unification × upskilling (O10-201). */
export function computeNationalUnificationUpskillingCouplingBrief(
  state: NationalLaborDemographicsState,
  unification: NationalWorkforceUnificationIndex | null | undefined
): NationalUnificationUpskillingCouplingBrief {
  if (!state.enabled || !unification) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      unificationDrag: 0,
      summary: 'Unification-upskilling coupling idle — workforce unification unavailable.',
      stewardNote: 'Compute workforce unification before upskilling coupling guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const unificationDrag = v1014laborClamp(
    unification.unificationDrag * 0.48 + (unification.band === 'fragile' || unification.band === 'thin' ? 11 : 3)
  );
  const unificationLift =
    unification.band === 'elevated' || unification.band === 'unification'
      ? unification.unificationIndex * 0.24
      : unification.unificationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + upskillingLift * 21 + unificationLift - unificationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained unification-upskilling link — deploy upskilling programs before wave-35 synthesis commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard upskilling synthesis spikes that drain unification buffers.'
        : 'Amplified coupling — pair upskilling packs with subject synthesis readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    unificationDrag,
    summary: `Unification-upskilling coupling ${band} (index ${Math.round(couplingIndex)}); unification drag ${Math.round(unificationDrag)}.`,
    stewardNote
  };
}
