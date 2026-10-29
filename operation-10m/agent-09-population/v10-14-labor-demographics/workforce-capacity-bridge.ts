import { v1014laborClamp } from './bands';
import { skilledPathwayPullForRegion } from './catalog/skilled-labor-pathways';
import {
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_INDUSTRY_LABOR_WEIGHT,
  type LaborDemographicsIndustryLink,
  type LaborDemographicsRegionSnapshot,
  type NationalWorkforceCapacityBridge,
  type RegionalWorkforceCapacityGap,
  type StrategicIndustryKind,
  type WorkforceCapacityBand
} from './types';

function capacityBand(gap: number): WorkforceCapacityBand {
  if (gap <= 18) return 'surplus';
  if (gap <= 38) return 'balanced';
  if (gap <= 58) return 'tight';
  return 'critical_gap';
}

function regionalDemandIndex(
  region: LaborDemographicsRegionSnapshot,
  industryLinks: LaborDemographicsIndustryLink[]
): number {
  const outputPull = region.industryOutputIndex * 0.55;
  const linkPull =
    industryLinks.find(l => l.industry === region.dominantIndustry)?.linkageScore ?? region.employmentLinkageScore;
  const weight =
    region.dominantIndustry != null ? V1014_LABOR_INDUSTRY_LABOR_WEIGHT[region.dominantIndustry] : 0.7;
  return v1014laborClamp(outputPull * 0.4 + linkPull * 0.35 + weight * 35);
}

function regionalSupplyIndex(region: LaborDemographicsRegionSnapshot): number {
  return v1014laborClamp(
    region.employmentLinkageScore * 0.4 +
      region.householdEmploymentFit * 0.25 +
      (100 - region.workforceStrainIndex) * 0.35
  );
}

export function computeNationalWorkforceCapacityBridge(
  turn: number,
  regions: Record<string, LaborDemographicsRegionSnapshot>,
  industryLinks: LaborDemographicsIndustryLink[]
): NationalWorkforceCapacityBridge {
  const regionalGaps: Record<string, RegionalWorkforceCapacityGap> = {};
  const gapSamples: number[] = [];
  let maxGap = -1;
  let dominantShortageIndustry: StrategicIndustryKind | null = null;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const r = regions[regionId];
    if (!r) return;
    const demandIndex = regionalDemandIndex(r, industryLinks);
    const supplyIndex = regionalSupplyIndex(r);
    const pathwayBoost = skilledPathwayPullForRegion(regionId, r.dominantIndustry) * 12;
    const gapIndex = v1014laborClamp(demandIndex - supplyIndex + pathwayBoost * 0.15);
    const band = capacityBand(gapIndex);
    gapSamples.push(gapIndex);
    if (gapIndex > maxGap && r.dominantIndustry) {
      maxGap = gapIndex;
      dominantShortageIndustry = r.dominantIndustry;
    }
    regionalGaps[regionId] = {
      regionId,
      demandIndex,
      supplyIndex,
      gapIndex,
      band,
      skilledPathwayBoost: pathwayBoost,
      narrative: `${regionId}: demand ${Math.round(demandIndex)} vs supply ${Math.round(supplyIndex)} (${band.replace('_', ' ')}).`
    };
  });

  const nationalGapIndex = v1014laborClamp(
    gapSamples.reduce((a, b) => a + b, 0) / Math.max(1, gapSamples.length)
  );
  const nationalBand = capacityBand(nationalGapIndex);

  const topIndustry =
    dominantShortageIndustry ??
    industryLinks[0]?.industry ??
    (STRATEGIC_INDUSTRIES[0] as StrategicIndustryKind);

  return {
    turn,
    nationalGapIndex,
    nationalBand,
    regions: regionalGaps,
    dominantShortageIndustry: topIndustry,
    summary: `Workforce capacity ${nationalBand.replace('_', ' ')} nationally (gap index ${Math.round(nationalGapIndex)}); ${topIndustry} leads demand pressure.`
  };
}
