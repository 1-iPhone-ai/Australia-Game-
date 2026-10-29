import { v1014laborClamp } from './bands';
import { schedulingEaseForRegion } from './catalog/workforce-scheduling-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CoordinationSchedulingCouplingBand,
  type NationalCoordinationSchedulingCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceCoordinationIndex
} from './types';

function couplingBand(index: number): CoordinationSchedulingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-44 / wave-44 coordination-scheduling coupling — coordination × scheduling (O10-219). */
export function computeNationalCoordinationSchedulingCouplingBrief(
  state: NationalLaborDemographicsState,
  coordination: NationalWorkforceCoordinationIndex | null | undefined
): NationalCoordinationSchedulingCouplingBrief {
  if (!state.enabled || !coordination) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      coordinationDrag: 0,
      summary: 'Coordination-scheduling coupling idle — workforce coordination unavailable.',
      stewardNote: 'Compute workforce coordination before scheduling coupling guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const coordinationDrag = v1014laborClamp(
    coordination.coordinationDrag * 0.48 + (coordination.band === 'fragile' || coordination.band === 'thin' ? 11 : 3)
  );
  const coordinationLift =
    coordination.band === 'elevated' || coordination.band === 'coordination'
      ? coordination.coordinationIndex * 0.24
      : coordination.coordinationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + schedulingLift * 21 + coordinationLift - coordinationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained coordination-scheduling link — deploy scheduling levers before wave-44 scheduling commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard scheduling pulse spikes that drain coordination buffers.'
        : 'Amplified coupling — pair scheduling packs with subject scheduling readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    coordinationDrag,
    summary: `Coordination-scheduling coupling ${band} (index ${Math.round(couplingIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}
