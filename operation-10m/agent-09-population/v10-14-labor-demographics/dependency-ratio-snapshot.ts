import { v1014laborClamp } from './bands';
import { lookupRegionalLaborBaseline } from './catalog/regional-labor-baselines';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type DependencyRatioBand,
  type LaborDemographicsRegionSnapshot,
  type NationalDependencyRatioSnapshot
} from './types';

function dependencyBand(ratioIndex: number): DependencyRatioBand {
  if (ratioIndex <= 42) return 'youth_heavy';
  if (ratioIndex <= 55) return 'balanced';
  if (ratioIndex <= 68) return 'aging';
  return 'aged_pressure';
}

function regionalRatioIndex(region: LaborDemographicsRegionSnapshot): number {
  const baseline = lookupRegionalLaborBaseline(region.regionId);
  const inertia = baseline?.demographicInertia ?? 50;
  const agingPull = 100 - region.demographicScore;
  const strainPull = region.workforceStrainIndex * 0.25;
  const retentionEase = retentionPullForRegion(region.regionId, region.dominantIndustry) * 18;
  return v1014laborClamp(inertia * 0.35 + agingPull * 0.45 + strainPull - retentionEase);
}

export function computeNationalDependencyRatioSnapshot(
  turn: number,
  regions: Record<string, LaborDemographicsRegionSnapshot>
): NationalDependencyRatioSnapshot {
  const regional: NationalDependencyRatioSnapshot['regions'] = {};
  const samples: number[] = [];

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const r = regions[regionId];
    if (!r) return;
    const ratioIndex = regionalRatioIndex(r);
    const band = dependencyBand(ratioIndex);
    samples.push(ratioIndex);
    regional[regionId] = {
      regionId,
      ratioIndex,
      band,
      narrative: `${regionId} dependency ${band.replace('_', ' ')} (index ${Math.round(ratioIndex)}).`
    };
  });

  const nationalRatioIndex = v1014laborClamp(
    samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  );
  const nationalBand = dependencyBand(nationalRatioIndex);
  const agedRegions = Object.values(regional)
    .filter(x => x.band === 'aged_pressure' || x.band === 'aging')
    .map(x => x.regionId);

  return {
    turn,
    nationalRatioIndex,
    nationalBand,
    regions: regional,
    agedPressureRegions: agedRegions.slice(0, 4),
    summary: `Dependency structure ${nationalBand.replace('_', ' ')} nationally (index ${Math.round(nationalRatioIndex)}); ${agedRegions.length} region(s) under aging pressure.`
  };
}
