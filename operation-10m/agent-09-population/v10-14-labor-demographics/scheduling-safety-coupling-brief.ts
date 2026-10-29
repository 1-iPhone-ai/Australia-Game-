import { v1014laborClamp } from './bands';
import { safetyEaseForRegion } from './catalog/workforce-safety-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSchedulingSafetyCouplingBrief,
  type NationalWorkforceSchedulingIndex,
  type SchedulingSafetyCouplingBand
} from './types';

function couplingBand(index: number): SchedulingSafetyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-45 / wave-45 scheduling-safety coupling — scheduling × safety (O10-221). */
export function computeNationalSchedulingSafetyCouplingBrief(
  state: NationalLaborDemographicsState,
  scheduling: NationalWorkforceSchedulingIndex | null | undefined
): NationalSchedulingSafetyCouplingBrief {
  if (!state.enabled || !scheduling) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      schedulingDrag: 0,
      summary: 'Scheduling-safety coupling idle — workforce scheduling unavailable.',
      stewardNote: 'Compute workforce scheduling before safety coupling guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const schedulingDrag = v1014laborClamp(
    scheduling.schedulingDrag * 0.48 + (scheduling.band === 'fragile' || scheduling.band === 'thin' ? 11 : 3)
  );
  const schedulingLift =
    scheduling.band === 'elevated' || scheduling.band === 'scheduling'
      ? scheduling.schedulingIndex * 0.24
      : scheduling.schedulingIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + safetyLift * 21 + schedulingLift - schedulingDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained scheduling-safety link — deploy safety levers before wave-45 safety commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard safety calibration spikes that drain scheduling buffers.'
        : 'Amplified coupling — pair safety packs with subject safety readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    schedulingDrag,
    summary: `Scheduling-safety coupling ${band} (index ${Math.round(couplingIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
    stewardNote
  };
}
