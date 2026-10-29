import { v1014laborClamp } from './bands';
import { careReliefForRegion } from './catalog/workforce-care-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSafetyCareCouplingBrief,
  type NationalWorkforceSafetyIndex,
  type SafetyCareCouplingBand
} from './types';

function couplingBand(index: number): SafetyCareCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-46 / wave-46 safety-care coupling — safety × care (O10-223). */
export function computeNationalSafetyCareCouplingBrief(
  state: NationalLaborDemographicsState,
  safety: NationalWorkforceSafetyIndex | null | undefined
): NationalSafetyCareCouplingBrief {
  if (!state.enabled || !safety) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      safetyDrag: 0,
      summary: 'Safety-care coupling idle — workforce safety unavailable.',
      stewardNote: 'Compute workforce safety before care coupling guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const safetyDrag = v1014laborClamp(
    safety.safetyDrag * 0.48 + (safety.band === 'fragile' || safety.band === 'thin' ? 11 : 3)
  );
  const safetyLift =
    safety.band === 'elevated' || safety.band === 'safety'
      ? safety.safetyIndex * 0.24
      : safety.safetyIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + careLift * 21 + safetyLift - safetyDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained safety-care link — deploy care levers before wave-46 care commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard care balance spikes that drain safety buffers.'
        : 'Amplified coupling — pair care packs with subject care readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    safetyDrag,
    summary: `Safety-care coupling ${band} (index ${Math.round(couplingIndex)}); safety drag ${Math.round(safetyDrag)}.`,
    stewardNote
  };
}
