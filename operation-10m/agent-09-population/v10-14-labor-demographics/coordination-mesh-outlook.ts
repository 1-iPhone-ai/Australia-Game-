import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CoordinationMeshBand,
  type NationalCoordinationMeshOutlook,
  type NationalFlexibilityFlowOutlook,
  type NationalLaborDemographicsState
} from './types';

function meshBand(index: number): CoordinationMeshBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'meshed';
}

export function computeNationalCoordinationMeshOutlook(
  state: NationalLaborDemographicsState,
  flexibilityFlow: NationalFlexibilityFlowOutlook | null | undefined
): NationalCoordinationMeshOutlook {
  if (!state.enabled || !flexibilityFlow) {
    return {
      turn: state.turn,
      meshIndex: 50,
      band: 'patchy',
      flexibilityDrag: 0,
      summary: 'Coordination mesh idle — flexibility flow unavailable.',
      stewardNote: 'Compute flexibility flow before coordination mesh guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const flexibilityDrag = v1014laborClamp(
    flexibilityFlow.inclusionDrag * 0.46 +
      (flexibilityFlow.band === 'ebbing' || flexibilityFlow.band === 'patchy' ? 10 : 3)
  );
  const flowLift =
    flexibilityFlow.band === 'rising' || flexibilityFlow.band === 'flowing'
      ? flexibilityFlow.flowIndex * 0.2
      : flexibilityFlow.flowIndex * 0.1;

  const meshIndex = v1014laborClamp(24 + coordinationLift * 22 + flowLift - flexibilityDrag);
  const band = meshBand(meshIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy coordination mesh — deploy coordination levers before subject coordination assembly.'
      : band === 'meshed'
        ? 'Meshed band — verify flexibility-coordination coupling before auto workforce pushes.'
        : 'Rising mesh — align with flexibility flow outlook checks.';

  return {
    turn: state.turn,
    meshIndex,
    band,
    flexibilityDrag,
    summary: `National coordination mesh ${band} (index ${Math.round(meshIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}
