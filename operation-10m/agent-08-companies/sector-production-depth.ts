/**
 * Agent 08 — regional sector mix vs Living Regions + V10.1 industry capacity (interpretation).
 */

import type {
  NationalPrivateSectorState,
  PrivateCompanyArchetype,
  PrivateCompanyState,
  RegionalPrivateEcosystemState,
} from './v1014-private-sector-core';
import type {
  IndustriesSupplyChainsState,
  LivingRegionsState,
  LRSector,
  StrategicIndustryKind,
} from './upstream-stubs';

export const AGENT08_SECTOR_DEPTH_SCHEMA_VERSION = '1.0.0';

export type RegionalSectorDiversificationBand = 'specialized' | 'mixed' | 'diversified';

export interface FirmSectorProductionRow {
  companyId: string;
  regionId: string;
  archetype: PrivateCompanyArchetype;
  productionMass: number;
  linkedIndustry: StrategicIndustryKind | null;
  industryUtilization: number | null;
  industryStrength: number | null;
  alignmentGap: number;
  overloaded: boolean;
}

export interface RegionalSectorProductionDepth {
  regionId: string;
  firmCount: number;
  productionMass: number;
  archetypeShares: Partial<Record<PrivateCompanyArchetype, number>>;
  sectorMass: Partial<Record<LRSector, number>>;
  livingRegionSectorMass: Partial<Record<LRSector, number>>;
  alignmentScore: number;
  diversificationBand: RegionalSectorDiversificationBand;
  industryOutputTotal: number;
  capacityGap: number;
  overloadedFirmCount: number;
  dominantArchetype: PrivateCompanyArchetype | null;
}

export interface NationalSectorProductionDepth {
  schemaVersion: typeof AGENT08_SECTOR_DEPTH_SCHEMA_VERSION;
  turn: number;
  regions: RegionalSectorProductionDepth[];
  firmRows: FirmSectorProductionRow[];
  lowestAlignmentRegion: string | null;
  nationalAlignmentAvg: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const ARCHETYPE_SECTORS: Record<PrivateCompanyArchetype, LRSector[]> = {
  mining: ['mining'],
  agriculture: ['agriculture'],
  energy: ['energy', 'renewables'],
  manufacturing: ['manufacturing'],
  technology: ['technology'],
  research: ['research'],
  tourism: ['tourism'],
  trade: ['trade', 'logistics'],
  logistics: ['logistics', 'trade'],
  finance_services: ['finance', 'technology'],
};

export function archetypeToIndustry(archetype: PrivateCompanyArchetype): StrategicIndustryKind | null {
  if (archetype === 'logistics') return 'trade';
  if (archetype === 'finance_services') return 'technology';
  return archetype as StrategicIndustryKind;
}

function firmProductionMass(company: PrivateCompanyState): number {
  return clamp(company.scale, 0, 999) * clamp(company.utilization, 0, 1);
}

function normalizeMassMap<T extends string>(map: Partial<Record<T, number>>): Partial<Record<T, number>> {
  const total = Object.values(map).reduce((a, v) => a + (v || 0), 0);
  if (total <= 0) return map;
  const out: Partial<Record<T, number>> = {};
  for (const [k, v] of Object.entries(map) as [T, number][]) {
    out[k] = (v || 0) / total;
  }
  return out;
}

function cosineSimilarity(a: Partial<Record<LRSector, number>>, b: Partial<Record<LRSector, number>>): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<LRSector>;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const k of keys) {
    const x = a[k] || 0;
    const y = b[k] || 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (na <= 0 || nb <= 0) return 0;
  return clamp(dot / (Math.sqrt(na) * Math.sqrt(nb)), 0, 1);
}

function diversificationBand(shares: Partial<Record<PrivateCompanyArchetype, number>>): RegionalSectorDiversificationBand {
  const vals = Object.values(shares);
  if (vals.length <= 1) return 'specialized';
  const hhi = vals.reduce((a, s) => a + s * s, 0);
  if (hhi > 0.45) return 'specialized';
  if (hhi > 0.22) return 'mixed';
  return 'diversified';
}

export function scoreFirmSectorIndustryAlignment(
  company: PrivateCompanyState,
  indRegion: IndustriesSupplyChainsState['regions'][string] | undefined,
): FirmSectorProductionRow {
  const productionMass = firmProductionMass(company);
  const linked = company.linkedIndustry ?? archetypeToIndustry(company.archetype);
  const ind = linked && indRegion?.industries?.[linked];
  const industryUtilization = ind ? clamp(ind.utilization, 0, 1) : null;
  const industryStrength = ind ? ind.strength : null;
  const firmUtil = clamp(company.utilization, 0, 1);
  const alignmentGap =
    industryUtilization == null ? 0 : clamp(Math.abs(firmUtil - industryUtilization) * company.scale * 0.05, 0, 15);
  const overloaded =
    industryStrength != null &&
    industryUtilization != null &&
    firmUtil > 0.72 &&
    industryUtilization < 0.45 &&
    industryStrength < 35;
  return {
    companyId: company.id,
    regionId: company.regionId,
    archetype: company.archetype,
    productionMass,
    linkedIndustry: linked,
    industryUtilization,
    industryStrength,
    alignmentGap,
    overloaded,
  };
}

export function computeRegionalSectorProductionDepth(
  region: RegionalPrivateEcosystemState,
  livingRegions: LivingRegionsState | null,
  industries: IndustriesSupplyChainsState | null,
  firmRows: FirmSectorProductionRow[],
): RegionalSectorProductionDepth {
  const regionalRows = firmRows.filter(r => r.regionId === region.regionId);
  const productionMass = regionalRows.reduce((a, r) => a + r.productionMass, 0);
  const archetypeMass: Partial<Record<PrivateCompanyArchetype, number>> = {};
  const sectorMass: Partial<Record<LRSector, number>> = {};

  for (const company of region.companies) {
    const mass = firmProductionMass(company);
    archetypeMass[company.archetype] = (archetypeMass[company.archetype] || 0) + mass;
    const sectors = ARCHETYPE_SECTORS[company.archetype] || [];
    const share = mass / Math.max(1, sectors.length);
    for (const s of sectors) {
      sectorMass[s] = (sectorMass[s] || 0) + share;
    }
  }

  const archetypeShares = normalizeMassMap(archetypeMass);
  const firmSectorNorm = normalizeMassMap(sectorMass);
  const lrSectors = livingRegions?.regions?.[region.regionId]?.sectors || {};
  const livingRegionSectorMass = normalizeMassMap(
    Object.fromEntries(
      Object.entries(lrSectors).map(([k, v]) => [k, Number(v) || 0]),
    ) as Partial<Record<LRSector, number>>,
  );

  const alignmentScore = cosineSimilarity(firmSectorNorm, livingRegionSectorMass);
  const indReg = industries?.regions?.[region.regionId];
  let industryOutputTotal = 0;
  if (indReg?.industries) {
    for (const ind of Object.values(indReg.industries)) {
      if (ind) industryOutputTotal += ind.effectiveOutput || 0;
    }
  }
  const capacityGap = clamp(region.activeProduction - productionMass, -999, 999);
  const overloadedFirmCount = regionalRows.filter(r => r.overloaded).length;
  const dominantArchetype =
    (Object.entries(archetypeShares).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] as
      | PrivateCompanyArchetype
      | undefined) ?? null;

  return {
    regionId: region.regionId,
    firmCount: region.companies.length,
    productionMass: Math.round(productionMass * 100) / 100,
    archetypeShares,
    sectorMass: firmSectorNorm,
    livingRegionSectorMass,
    alignmentScore: Math.round(alignmentScore * 1000) / 1000,
    diversificationBand: diversificationBand(archetypeShares),
    industryOutputTotal: Math.round(industryOutputTotal * 100) / 100,
    capacityGap: Math.round(capacityGap * 100) / 100,
    overloadedFirmCount,
    dominantArchetype,
  };
}

export function computeNationalSectorProductionDepth(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
}): NationalSectorProductionDepth {
  const firmRows: FirmSectorProductionRow[] = [];
  for (const region of Object.values(params.privateState.regions)) {
    const indReg = params.industries?.regions?.[region.regionId];
    for (const company of region.companies) {
      firmRows.push(scoreFirmSectorIndustryAlignment(company, indReg));
    }
  }

  const regions = Object.values(params.privateState.regions).map(r =>
    computeRegionalSectorProductionDepth(r, params.livingRegions, params.industries, firmRows),
  );

  const nationalAlignmentAvg = regions.length
    ? regions.reduce((a, r) => a + r.alignmentScore, 0) / regions.length
    : 0;
  const lowest = regions.length
    ? regions.reduce((min, r) => (r.alignmentScore < min.alignmentScore ? r : min), regions[0])
    : null;

  return {
    schemaVersion: AGENT08_SECTOR_DEPTH_SCHEMA_VERSION,
    turn: params.turn,
    regions,
    firmRows,
    lowestAlignmentRegion: lowest?.regionId ?? null,
    nationalAlignmentAvg: Math.round(nationalAlignmentAvg * 1000) / 1000,
  };
}

export function runAgent08SectorDepthSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  const company: PrivateCompanyState = {
    id: 'co_x',
    regionId: 'NSW',
    archetype: 'manufacturing',
    name: 'Mfg Co',
    vitality: 'stable',
    production: 'surging',
    exposure: 'balanced',
    scale: 30,
    utilization: 0.85,
    primarySupply: 'manufactured_goods',
    linkedIndustry: 'manufacturing',
    ecosystemId: 'eco',
    summary: 't',
    evidence: [],
    revision: 1,
  };

  check('a08_sd_01', () => {
    const row = scoreFirmSectorIndustryAlignment(company, {
      regionId: 'NSW',
      industries: {
        manufacturing: {
          industry: 'manufacturing',
          strength: 20,
          effectiveOutput: 10,
          utilization: 0.35,
          constraint: null,
          outputs: [],
        },
      },
      suppliedBy: [],
      primaryIndustrialConstraint: null,
      resilience: 'moderate',
    });
    return row.overloaded === true && row.alignmentGap > 0;
  });

  check('a08_sd_02', () => {
    const state: NationalPrivateSectorState = {
      schemaVersion: '10.14.0',
      revision: 1,
      regions: {
        NSW: {
          regionId: 'NSW',
          name: 'NSW',
          maturity: 'forming',
          anchorArchetype: 'mining',
          companyCount: 1,
          activeProduction: 50,
          supplyChainRole: 'x',
          resilience: 'moderate',
          companies: [company],
          links: [],
          primaryConstraint: null,
          revision: 1,
        },
      },
      national: {
        leadingRegions: [],
        constrainedRegions: [],
        dominantArchetypes: [],
        criticalDependencies: [],
        ecosystemOpportunity: null,
        ecosystemRisk: null,
        totalCompanies: 1,
        avgVitality: 2,
      },
      history: [],
      lastUpdatedTurn: 1,
      inputHash: 't',
      computeMs: 0,
    };
    const depth = computeNationalSectorProductionDepth({
      turn: 1,
      privateState: state,
      livingRegions: {
        revision: 1,
        regions: {
          NSW: {
            momentum: { band: 'stable' },
            sectors: { manufacturing: 80, mining: 20 },
          },
        },
      },
      industries: {
        revision: 1,
        regions: {
          NSW: {
            regionId: 'NSW',
            industries: {
              manufacturing: {
                industry: 'manufacturing',
                strength: 20,
                effectiveOutput: 40,
                utilization: 0.35,
                constraint: null,
                outputs: [],
              },
            },
            suppliedBy: [],
            primaryIndustrialConstraint: null,
            resilience: 'moderate',
          },
        },
        dependencies: [],
      },
    });
    return depth.firmRows.length === 1 && depth.regions[0].dominantArchetype === 'manufacturing';
  });

  check('a08_sd_03', () => {
    const sim = cosineSimilarity({ mining: 1 }, { mining: 1 });
    return sim === 1;
  });

  check('a08_sd_04', () => {
    const sim = cosineSimilarity({ mining: 1 }, { agriculture: 1 });
    return sim === 0;
  });

  check('a08_sd_05', () => {
    return diversificationBand({ mining: 0.9, agriculture: 0.1 }) === 'specialized';
  });

  return results;
}
