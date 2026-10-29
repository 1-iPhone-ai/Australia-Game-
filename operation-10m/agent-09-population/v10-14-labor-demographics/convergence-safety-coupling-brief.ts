import { v1014laborClamp } from './bands';
import { safetyEaseForRegion } from './catalog/workforce-safety-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type ConvergenceSafetyCouplingBand,
  type NationalConvergenceSafetyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceConvergenceIndex
} from './types';

function couplingBand(index: number): ConvergenceSafetyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-34 / wave-34 convergence-safety coupling — convergence × safety levers (O10-199). */
export function computeNationalConvergenceSafetyCouplingBrief(
  state: NationalLaborDemographicsState,
  convergence: NationalWorkforceConvergenceIndex | null | undefined
): NationalConvergenceSafetyCouplingBrief {
  if (!state.enabled || !convergence) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      convergenceDrag: 0,
      summary: 'Convergence-safety coupling idle — workforce convergence unavailable.',
      stewardNote: 'Compute workforce convergence before safety coupling guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const convergenceDrag = v1014laborClamp(
    convergence.convergenceDrag * 0.48 + (convergence.band === 'fragile' || convergence.band === 'thin' ? 11 : 3)
  );
  const convergenceLift =
    convergence.band === 'elevated' || convergence.band === 'convergence'
      ? convergence.convergenceIndex * 0.24
      : convergence.convergenceIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + safetyLift * 21 + convergenceLift - convergenceDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained convergence-safety link — deploy safety levers before wave-34 unification commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard safety harmony spikes that drain convergence buffers.'
        : 'Amplified coupling — pair safety packs with subject unification readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    convergenceDrag,
    summary: `Convergence-safety coupling ${band} (index ${Math.round(couplingIndex)}); convergence drag ${Math.round(convergenceDrag)}.`,
    stewardNote
  };
}
