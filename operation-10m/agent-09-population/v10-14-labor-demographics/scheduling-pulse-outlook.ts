import { v1014laborClamp } from './bands';
import { schedulingEaseForRegion } from './catalog/workforce-scheduling-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalCoordinationMeshOutlook,
  type NationalLaborDemographicsState,
  type NationalSchedulingPulseOutlook,
  type SchedulingPulseBand
} from './types';

function pulseBand(index: number): SchedulingPulseBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'pulsing';
}

export function computeNationalSchedulingPulseOutlook(
  state: NationalLaborDemographicsState,
  coordinationMesh: NationalCoordinationMeshOutlook | null | undefined
): NationalSchedulingPulseOutlook {
  if (!state.enabled || !coordinationMesh) {
    return {
      turn: state.turn,
      pulseIndex: 50,
      band: 'patchy',
      coordinationDrag: 0,
      summary: 'Scheduling pulse idle — coordination mesh unavailable.',
      stewardNote: 'Compute coordination mesh before scheduling pulse guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const coordinationDrag = v1014laborClamp(
    coordinationMesh.flexibilityDrag * 0.46 +
      (coordinationMesh.band === 'ebbing' || coordinationMesh.band === 'patchy' ? 10 : 3)
  );
  const meshLift =
    coordinationMesh.band === 'rising' || coordinationMesh.band === 'meshed'
      ? coordinationMesh.meshIndex * 0.2
      : coordinationMesh.meshIndex * 0.1;

  const pulseIndex = v1014laborClamp(24 + schedulingLift * 22 + meshLift - coordinationDrag);
  const band = pulseBand(pulseIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy scheduling pulse — deploy scheduling levers before subject scheduling assembly.'
      : band === 'pulsing'
        ? 'Pulsing band — verify coordination-scheduling coupling before auto workforce pushes.'
        : 'Rising pulse — align with coordination mesh outlook checks.';

  return {
    turn: state.turn,
    pulseIndex,
    band,
    coordinationDrag,
    summary: `National scheduling pulse ${band} (index ${Math.round(pulseIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}
