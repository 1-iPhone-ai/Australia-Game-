import type { StrategicIndustryKind } from '../types';

/** Static regional labor-market character (indices 0..100 — not population). */
export interface RegionalLaborBaseline {
  regionId: string;
  name: string;
  laborMobilityIndex: number;
  wageStickinessIndex: number;
  migrationElasticity: number;
  demographicInertia: number;
  anchorIndustries: StrategicIndustryKind[];
  narrative: string;
}

export const REGION_LABOR_BASELINES: Record<string, RegionalLaborBaseline> = {
  NSW: {
    regionId: 'NSW',
    name: 'New South Wales',
    laborMobilityIndex: 78,
    wageStickinessIndex: 62,
    migrationElasticity: 0.82,
    demographicInertia: 55,
    anchorIndustries: ['technology', 'trade', 'research'],
    narrative: 'Metro services and tech anchor a mobile, wage-responsive labor pool.'
  },
  VIC: {
    regionId: 'VIC',
    name: 'Victoria',
    laborMobilityIndex: 74,
    wageStickinessIndex: 58,
    migrationElasticity: 0.78,
    demographicInertia: 52,
    anchorIndustries: ['manufacturing', 'technology', 'research'],
    narrative: 'Manufacturing–research mix with strong internal mobility.'
  },
  QLD: {
    regionId: 'QLD',
    name: 'Queensland',
    laborMobilityIndex: 68,
    wageStickinessIndex: 48,
    migrationElasticity: 0.88,
    demographicInertia: 46,
    anchorIndustries: ['mining', 'tourism', 'agriculture'],
    narrative: 'Resource and tourism cycles drive elastic migration swings.'
  },
  WA: {
    regionId: 'WA',
    name: 'Western Australia',
    laborMobilityIndex: 62,
    wageStickinessIndex: 44,
    migrationElasticity: 0.92,
    demographicInertia: 42,
    anchorIndustries: ['mining', 'energy', 'trade'],
    narrative: 'Fly-in fly-out dynamics amplify migration sensitivity to mining output.'
  },
  SA: {
    regionId: 'SA',
    name: 'South Australia',
    laborMobilityIndex: 58,
    wageStickinessIndex: 54,
    migrationElasticity: 0.65,
    demographicInertia: 58,
    anchorIndustries: ['manufacturing', 'agriculture', 'research'],
    narrative: 'Smaller pool with moderate outflow when affordability strains.'
  },
  TAS: {
    regionId: 'TAS',
    name: 'Tasmania',
    laborMobilityIndex: 50,
    wageStickinessIndex: 60,
    migrationElasticity: 0.55,
    demographicInertia: 64,
    anchorIndustries: ['agriculture', 'tourism', 'energy'],
    narrative: 'Island inertia limits rapid migration despite tourism demand.'
  },
  NT: {
    regionId: 'NT',
    name: 'Northern Territory',
    laborMobilityIndex: 70,
    wageStickinessIndex: 40,
    migrationElasticity: 0.95,
    demographicInertia: 38,
    anchorIndustries: ['mining', 'energy', 'agriculture'],
    narrative: 'Frontier labor market with high turnover tied to resource projects.'
  },
  ACT: {
    regionId: 'ACT',
    name: 'Australian Capital Territory',
    laborMobilityIndex: 72,
    wageStickinessIndex: 68,
    migrationElasticity: 0.72,
    demographicInertia: 50,
    anchorIndustries: ['research', 'technology', 'trade'],
    narrative: 'Public–research employment stabilizes wages; moderate migration pull.'
  }
};

export function lookupRegionalLaborBaseline(regionId: string): RegionalLaborBaseline | null {
  return REGION_LABOR_BASELINES[regionId] ?? null;
}
