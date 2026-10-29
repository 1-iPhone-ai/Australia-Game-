import { v1014laborClamp } from './bands';
import {
  V1014_LABOR_CORE_REGIONS,
  type LaborDemographicsRegionSnapshot,
  type LaborMarketVelocityBand,
  type NationalLaborMarketVelocityIndex,
  type RegionalLaborMarketVelocity
} from './types';

function velocityBand(index: number): LaborMarketVelocityBand {
  if (index <= 38) return 'sluggish';
  if (index <= 52) return 'moderate';
  if (index <= 65) return 'active';
  return 'volatile';
}

function regionalVelocity(region: LaborDemographicsRegionSnapshot): number {
  const migrationChurn = Math.abs(region.migrationFlowScore - 50) * 0.85;
  const wageChurn = Math.abs(region.wagePressureScore - 50) * 0.55;
  const strainChurn = region.workforceStrainIndex * 0.35;
  const stabilityEase = region.householdEmploymentFit * 0.2;
  return v1014laborClamp(migrationChurn + wageChurn + strainChurn - stabilityEase + 25);
}

export function computeNationalLaborMarketVelocityIndex(
  turn: number,
  regions: Record<string, LaborDemographicsRegionSnapshot>
): NationalLaborMarketVelocityIndex {
  const regional: Record<string, RegionalLaborMarketVelocity> = {};
  const samples: number[] = [];
  let maxVel = -1;
  let hottestRegion: string | null = null;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const r = regions[regionId];
    if (!r) return;
    const velocityIndex = regionalVelocity(r);
    const band = velocityBand(velocityIndex);
    samples.push(velocityIndex);
    if (velocityIndex > maxVel) {
      maxVel = velocityIndex;
      hottestRegion = regionId;
    }
    regional[regionId] = {
      regionId,
      velocityIndex,
      band,
      narrative: `${regionId} labor velocity ${band} (index ${Math.round(velocityIndex)}).`
    };
  });

  const nationalVelocityIndex = v1014laborClamp(
    samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  );
  const nationalBand = velocityBand(nationalVelocityIndex);

  return {
    turn,
    nationalVelocityIndex,
    nationalBand,
    regions: regional,
    hottestRegion,
    summary: `Labor market velocity ${nationalBand} nationally (index ${Math.round(nationalVelocityIndex)}); ${hottestRegion ?? 'n/a'} most active.`
  };
}
