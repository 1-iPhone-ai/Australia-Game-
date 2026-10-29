import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type HybridAnchorBand,
  type NationalCoordinationBindOutlook,
  type NationalHybridAnchorOutlook,
  type NationalLaborDemographicsState
} from './types';

function anchorBand(index: number): HybridAnchorBand {
  if (index <= 34) return 'drifting';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'anchored';
  return 'fixed';
}

export function computeNationalHybridAnchorOutlook(
  state: NationalLaborDemographicsState,
  coordinationBind: NationalCoordinationBindOutlook | null | undefined
): NationalHybridAnchorOutlook {
  if (!state.enabled || !coordinationBind) {
    return {
      turn: state.turn,
      anchorIndex: 50,
      band: 'mixed',
      bindDrag: 0,
      summary: 'Hybrid anchor idle — coordination bind unavailable.',
      stewardNote: 'Compute coordination bind before hybrid anchor guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const bindDrag = v1014laborClamp(
    coordinationBind.schedulingDrag * 0.46 +
      (coordinationBind.band === 'loose' || coordinationBind.band === 'patchy' ? 10 : 3)
  );
  const bindLift =
    coordinationBind.band === 'bound' || coordinationBind.band === 'locked'
      ? coordinationBind.bindIndex * 0.2
      : coordinationBind.bindIndex * 0.1;

  const anchorIndex = v1014laborClamp(24 + flexibilityLift * 22 + bindLift - bindDrag);
  const band = anchorBand(anchorIndex);

  const stewardNote =
    band === 'drifting' || band === 'mixed'
      ? 'Mixed hybrid anchor — ease flexibility levers before subject crown assembly.'
      : band === 'fixed'
        ? 'Fixed anchor band — verify fortitude-inclusion coupling before auto workforce pushes.'
        : 'Anchored hybrid — align anchor with hybrid remote participation checks.';

  return {
    turn: state.turn,
    anchorIndex,
    band,
    bindDrag,
    summary: `National hybrid anchor ${band} (index ${Math.round(anchorIndex)}); bind drag ${Math.round(bindDrag)}.`,
    stewardNote
  };
}
