import { v1014laborClamp } from './bands';
import { upskillingUpliftForRegion } from './catalog/workforce-upskilling-programs';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalSkillMismatchIndex,
  type NationalWorkforceCapacityBridge,
  type RegionalSkillMismatch,
  type SkillMismatchBand
} from './types';

function mismatchBand(index: number): SkillMismatchBand {
  if (index <= 32) return 'aligned';
  if (index <= 48) return 'moderate_gap';
  if (index <= 62) return 'elevated_gap';
  return 'critical_mismatch';
}

export function computeNationalSkillMismatchIndex(
  turn: number,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): NationalSkillMismatchIndex {
  if (!capacityBridge) {
    return {
      turn,
      nationalMismatchIndex: 50,
      nationalBand: 'moderate_gap',
      regions: {},
      worstRegion: null,
      summary: 'Skill mismatch idle — capacity bridge unavailable.',
      stewardNote: 'Compute workforce capacity before skill mismatch guidance.'
    };
  }

  const regions: Record<string, RegionalSkillMismatch> = {};
  const samples: number[] = [];
  let maxMismatch = -1;
  let worstRegion: string | null = null;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const gap = capacityBridge.regions[regionId];
    if (!gap) return;
    const upliftEase = upskillingUpliftForRegion(regionId, capacityBridge.dominantShortageIndustry) * 18;
    const pathwayEase = gap.skilledPathwayBoost * 0.35;
    const mismatchIndex = v1014laborClamp(gap.gapIndex * 0.85 - upliftEase - pathwayEase + 22);
    const band = mismatchBand(mismatchIndex);
    samples.push(mismatchIndex);
    if (mismatchIndex > maxMismatch) {
      maxMismatch = mismatchIndex;
      worstRegion = regionId;
    }
    regions[regionId] = {
      regionId,
      mismatchIndex,
      band,
      narrative: `${regionId} skill alignment ${band.replace('_', ' ')} (index ${Math.round(mismatchIndex)}).`
    };
  });

  const nationalMismatchIndex = v1014laborClamp(
    samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  );
  const nationalBand = mismatchBand(nationalMismatchIndex);

  const stewardNote =
    nationalBand === 'critical_mismatch' || nationalBand === 'elevated_gap'
      ? 'Elevated skill mismatch — prioritize upskilling programs before stacking automation.'
      : nationalBand === 'aligned'
        ? 'Skill alignment healthy — maintain pathway and retention balance.'
        : 'Moderate skill gaps — monitor dominant shortage industry corridors.';

  return {
    turn,
    nationalMismatchIndex,
    nationalBand,
    regions,
    worstRegion,
    summary: `National skill mismatch ${nationalBand.replace('_', ' ')} (index ${Math.round(nationalMismatchIndex)}); worst ${worstRegion ?? 'n/a'}.`,
    stewardNote
  };
}
