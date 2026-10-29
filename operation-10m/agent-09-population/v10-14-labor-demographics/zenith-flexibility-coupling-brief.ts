import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalWorkforceZenithIndex,
  type NationalZenithFlexibilityCouplingBrief,
  type ZenithFlexibilityCouplingBand
} from './types';

function couplingBand(index: number): ZenithFlexibilityCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-30 / wave-30 zenith-flexibility coupling — zenith × flexibility levers (O10-191). */
export function computeNationalZenithFlexibilityCouplingBrief(
  state: NationalLaborDemographicsState,
  zenith: NationalWorkforceZenithIndex | null | undefined
): NationalZenithFlexibilityCouplingBrief {
  if (!state.enabled || !zenith) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      zenithDrag: 0,
      summary: 'Zenith-flexibility coupling idle — workforce zenith unavailable.',
      stewardNote: 'Compute workforce zenith before flexibility coupling guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const zenithDrag = v1014laborClamp(
    zenith.zenithDrag * 0.48 + (zenith.band === 'fragile' || zenith.band === 'thin' ? 11 : 3)
  );
  const zenithLift =
    zenith.band === 'elevated' || zenith.band === 'horizon'
      ? zenith.zenithIndex * 0.24
      : zenith.zenithIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + flexibilityLift * 21 + zenithLift - zenithDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained zenith-flexibility link — deploy flexibility levers before wave-30 apogee commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard flexibility ascent spikes that drain zenith buffers.'
        : 'Amplified coupling — pair flexibility packs with subject apogee readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    zenithDrag,
    summary: `Zenith-flexibility coupling ${band} (index ${Math.round(couplingIndex)}); zenith drag ${Math.round(zenithDrag)}.`,
    stewardNote
  };
}
