import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type FlexibilityFlowBand,
  type NationalFlexibilityFlowOutlook,
  type NationalInclusionEquityOutlook,
  type NationalLaborDemographicsState
} from './types';

function flowBand(index: number): FlexibilityFlowBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'flowing';
}

export function computeNationalFlexibilityFlowOutlook(
  state: NationalLaborDemographicsState,
  inclusionEquity: NationalInclusionEquityOutlook | null | undefined
): NationalFlexibilityFlowOutlook {
  if (!state.enabled || !inclusionEquity) {
    return {
      turn: state.turn,
      flowIndex: 50,
      band: 'patchy',
      inclusionDrag: 0,
      summary: 'Flexibility flow idle — inclusion equity unavailable.',
      stewardNote: 'Compute inclusion equity before flexibility flow guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const inclusionDrag = v1014laborClamp(
    inclusionEquity.advocacyDrag * 0.46 +
      (inclusionEquity.band === 'ebbing' || inclusionEquity.band === 'patchy' ? 10 : 3)
  );
  const equityLift =
    inclusionEquity.band === 'rising' || inclusionEquity.band === 'equitable'
      ? inclusionEquity.equityIndex * 0.2
      : inclusionEquity.equityIndex * 0.1;

  const flowIndex = v1014laborClamp(24 + flexibilityLift * 22 + equityLift - inclusionDrag);
  const band = flowBand(flowIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy flexibility flow — deploy flexibility levers before subject flexibility assembly.'
      : band === 'flowing'
        ? 'Flowing band — verify inclusion-flexibility coupling before auto workforce pushes.'
        : 'Rising flow — align with inclusion equity outlook checks.';

  return {
    turn: state.turn,
    flowIndex,
    band,
    inclusionDrag,
    summary: `National flexibility flow ${band} (index ${Math.round(flowIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}
