import { v1014laborClamp } from './bands';
import { schedulingEaseForRegion } from './catalog/workforce-scheduling-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSteadfastSchedulingCouplingBrief,
  type NationalWorkforceSteadfastIndex,
  type SteadfastSchedulingCouplingBand
} from './types';

function couplingBand(index: number): SteadfastSchedulingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'rhythmic';
  return 'locked';
}

export function computeNationalSteadfastSchedulingCouplingBrief(
  state: NationalLaborDemographicsState,
  steadfast: NationalWorkforceSteadfastIndex | null | undefined
): NationalSteadfastSchedulingCouplingBrief {
  if (!state.enabled || !steadfast) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      steadfastDrag: 0,
      summary: 'Steadfast-scheduling coupling idle — workforce steadfast unavailable.',
      stewardNote: 'Compute workforce steadfast before scheduling coupling guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const steadfastDrag = v1014laborClamp(
    steadfast.releaseDrag * 0.48 +
      (steadfast.band === 'fragile' || steadfast.band === 'thin' ? 11 : 3)
  );
  const steadfastLift =
    steadfast.band === 'steady' || steadfast.band === 'anchored'
      ? steadfast.steadfastIndex * 0.24
      : steadfast.steadfastIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + schedulingLift * 21 + steadfastLift - steadfastDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained steadfast-scheduling link — ease scheduling levers before round-23 seal commits.'
      : band === 'locked'
        ? 'Locked coupling — guard retention spikes that drain scheduling buffers.'
        : 'Rhythmic coupling — pair scheduling packs with subject seal readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    steadfastDrag,
    summary: `Steadfast-scheduling coupling ${band} (index ${Math.round(couplingIndex)}); steadfast drag ${Math.round(steadfastDrag)}.`,
    stewardNote
  };
}
