import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CoordinationBindBand,
  type NationalCoordinationBindOutlook,
  type NationalLaborDemographicsState,
  type NationalSteadfastSchedulingCouplingBrief
} from './types';

function bindBand(index: number): CoordinationBindBand {
  if (index <= 34) return 'loose';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'bound';
  return 'locked';
}

export function computeNationalCoordinationBindOutlook(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalSteadfastSchedulingCouplingBrief | null | undefined
): NationalCoordinationBindOutlook {
  if (!state.enabled || !schedulingCoupling) {
    return {
      turn: state.turn,
      bindIndex: 50,
      band: 'patchy',
      schedulingDrag: 0,
      summary: 'Coordination bind idle — steadfast-scheduling coupling unavailable.',
      stewardNote: 'Compute steadfast-scheduling coupling before coordination bind guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const schedulingDrag = v1014laborClamp(
    schedulingCoupling.steadfastDrag * 0.46 +
      (schedulingCoupling.band === 'decoupled' || schedulingCoupling.band === 'strained' ? 10 : 3)
  );
  const schedulingLift =
    schedulingCoupling.band === 'rhythmic' || schedulingCoupling.band === 'locked'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;

  const bindIndex = v1014laborClamp(24 + coordinationLift * 22 + schedulingLift - schedulingDrag);
  const band = bindBand(bindIndex);

  const stewardNote =
    band === 'loose' || band === 'patchy'
      ? 'Patchy coordination bind — ease coordination levers before subject bind assembly.'
      : band === 'locked'
        ? 'Locked bind band — verify resolve-upskilling coupling before auto workforce pushes.'
        : 'Bound coordination — align bind with labor market stability checks.';

  return {
    turn: state.turn,
    bindIndex,
    band,
    schedulingDrag,
    summary: `National coordination bind ${band} (index ${Math.round(bindIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
    stewardNote
  };
}
