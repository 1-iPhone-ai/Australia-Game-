/**
 * Agent 08 round 10 — production and utilization depth (firm vs industry capacity).
 * Non-authoritative interpretation layer over V10.14 private sector + V10.1 industries.
 */

import type {
  NationalPrivateSectorState,
  PrivateCompanyState,
  RegionalPrivateEcosystemState,
} from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState } from './upstream-stubs';
import { archetypeToIndustry } from './sector-production-depth';

export const AGENT08_UTILIZATION_DEPTH_SCHEMA_VERSION = '1.0.0';

export type UtilizationSlackBand = 'idle' | 'slack' | 'balanced' | 'tight';

export type UtilizationStressBand = 'underused' | 'normal' | 'strained';

export interface FirmProductionUtilizationRow {
  companyId: string;
  regionId: string;
  scale: number;
  firmUtilization: number;
  effectiveOutput: number;
  linkedIndustryUtilization: number | null;
  utilizationDelta: number | null;
  headroom: number;
  slackBand: UtilizationSlackBand;
  stressBand: UtilizationStressBand;
  capacityBind: boolean;
  utilizationNote: string;
}

export interface RegionalProductionUtilizationDepth {
  regionId: string;
  firmCount: number;
  activeProduction: number;
  effectiveOutputTotal: number;
  avgFirmUtilization: number;
  avgIndustryUtilization: number | null;
  utilizationSpread: number;
  headroomIndex: number;
  tightFirmCount: number;
  idleFirmCount: number;
  capacityBindCount: number;
  dominantSlackBand: UtilizationSlackBand;
}

export interface NationalProductionUtilizationDepth {
  schemaVersion: typeof AGENT08_UTILIZATION_DEPTH_SCHEMA_VERSION;
  turn: number;
  regions: RegionalProductionUtilizationDepth[];
  firmRows: FirmProductionUtilizationRow[];
  nationalAvgUtilization: number;
  nationalUtilizationSpread: number;
  tightestRegionId: string | null;
  slackiestRegionId: string | null;
  firmsUnderCapacityBind: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const SLACK_ORDER: UtilizationSlackBand[] = ['idle', 'slack', 'balanced', 'tight'];

function stdDev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, v) => a + v, 0) / values.length;
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function classifyUtilizationSlackBand(
  firmUtil: number,
  industryUtil: number | null,
): UtilizationSlackBand {
  const u = clamp(firmUtil, 0, 1);
  if (u < 0.18) return 'idle';
  if (industryUtil != null && u > 0.68 && industryUtil < 0.38) return 'tight';
  if (u > 0.78) return 'tight';
  if (u < 0.32) return 'slack';
  return 'balanced';
}

export function classifyUtilizationStress(
  company: PrivateCompanyState,
  firmUtil: number,
): UtilizationStressBand {
  const u = clamp(firmUtil, 0, 1);
  if (company.production === 'constrained' || company.production === 'stalled') {
    return u < 0.45 ? 'underused' : 'strained';
  }
  if (company.production === 'surging' && u > 0.7) return 'strained';
  if (u < 0.28) return 'underused';
  return 'normal';
}

export function scoreFirmProductionUtilization(
  company: PrivateCompanyState,
  indRegion: IndustriesSupplyChainsState['regions'][string] | undefined,
): FirmProductionUtilizationRow {
  const firmUtilization = clamp(company.utilization, 0, 1);
  const effectiveOutput = clamp(company.scale, 0, 999) * firmUtilization;
  const linked = company.linkedIndustry ?? archetypeToIndustry(company.archetype);
  const ind = linked && indRegion?.industries?.[linked];
  const linkedIndustryUtilization = ind ? clamp(ind.utilization, 0, 1) : null;
  const utilizationDelta =
    linkedIndustryUtilization == null ? null : firmUtilization - linkedIndustryUtilization;
  const headroom = clamp(1 - firmUtilization, 0, 1);
  const slackBand = classifyUtilizationSlackBand(firmUtilization, linkedIndustryUtilization);
  const stressBand = classifyUtilizationStress(company, firmUtilization);
  const capacityBind =
    linkedIndustryUtilization != null &&
    firmUtilization > 0.65 &&
    linkedIndustryUtilization < 0.42 &&
    (ind?.strength ?? 99) < 40;

  const utilizationNote =
    capacityBind
      ? 'firm hot while upstream industry slack — capacity bind'
      : slackBand === 'tight'
        ? 'utilization tight — limited headroom'
        : slackBand === 'idle'
          ? 'idle capacity — production mass minimal'
          : slackBand === 'slack'
            ? 'slack utilization — room to absorb demand'
            : 'balanced utilization vs industry';

  return {
    companyId: company.id,
    regionId: company.regionId,
    scale: company.scale,
    firmUtilization: Math.round(firmUtilization * 1000) / 1000,
    effectiveOutput: Math.round(effectiveOutput * 100) / 100,
    linkedIndustryUtilization:
      linkedIndustryUtilization == null ? null : Math.round(linkedIndustryUtilization * 1000) / 1000,
    utilizationDelta:
      utilizationDelta == null ? null : Math.round(utilizationDelta * 1000) / 1000,
    headroom: Math.round(headroom * 1000) / 1000,
    slackBand,
    stressBand,
    capacityBind,
    utilizationNote,
  };
}

function dominantSlackBand(rows: FirmProductionUtilizationRow[]): UtilizationSlackBand {
  const counts: Record<UtilizationSlackBand, number> = {
    idle: 0,
    slack: 0,
    balanced: 0,
    tight: 0,
  };
  for (const r of rows) counts[r.slackBand] += 1;
  let dominant: UtilizationSlackBand = 'balanced';
  let max = -1;
  for (const b of SLACK_ORDER) {
    if (counts[b] >= max) {
      max = counts[b];
      dominant = b;
    }
  }
  return dominant;
}

export function computeRegionalProductionUtilizationDepth(
  region: RegionalPrivateEcosystemState,
  industries: IndustriesSupplyChainsState | null,
  firmRows: FirmProductionUtilizationRow[],
): RegionalProductionUtilizationDepth {
  const regionalRows = firmRows.filter(r => r.regionId === region.regionId);
  const utils = regionalRows.map(r => r.firmUtilization);
  const avgFirmUtilization =
    utils.length === 0 ? 0 : utils.reduce((a, v) => a + v, 0) / utils.length;

  const indReg = industries?.regions?.[region.regionId];
  let industryUtils: number[] = [];
  if (indReg?.industries) {
    industryUtils = Object.values(indReg.industries)
      .filter(Boolean)
      .map(ind => clamp(ind!.utilization, 0, 1));
  }
  const avgIndustryUtilization =
    industryUtils.length === 0
      ? null
      : Math.round((industryUtils.reduce((a, v) => a + v, 0) / industryUtils.length) * 1000) / 1000;

  const effectiveOutputTotal = regionalRows.reduce((a, r) => a + r.effectiveOutput, 0);
  const headroomIndex =
    regionalRows.length === 0
      ? 0
      : regionalRows.reduce((a, r) => a + r.headroom, 0) / regionalRows.length;

  return {
    regionId: region.regionId,
    firmCount: regionalRows.length,
    activeProduction: region.activeProduction,
    effectiveOutputTotal: Math.round(effectiveOutputTotal * 100) / 100,
    avgFirmUtilization: Math.round(avgFirmUtilization * 1000) / 1000,
    avgIndustryUtilization,
    utilizationSpread: Math.round(stdDev(utils) * 1000) / 1000,
    headroomIndex: Math.round(headroomIndex * 1000) / 1000,
    tightFirmCount: regionalRows.filter(r => r.slackBand === 'tight').length,
    idleFirmCount: regionalRows.filter(r => r.slackBand === 'idle').length,
    capacityBindCount: regionalRows.filter(r => r.capacityBind).length,
    dominantSlackBand: dominantSlackBand(regionalRows),
  };
}

export function computeNationalProductionUtilizationDepth(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions?: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
}): NationalProductionUtilizationDepth {
  const firmRows: FirmProductionUtilizationRow[] = [];
  for (const region of Object.values(params.privateState.regions)) {
    const indReg = params.industries?.regions?.[region.regionId];
    for (const company of region.companies) {
      firmRows.push(scoreFirmProductionUtilization(company, indReg));
    }
  }

  const regions = Object.values(params.privateState.regions).map(r =>
    computeRegionalProductionUtilizationDepth(r, params.industries, firmRows),
  );

  const allUtils = firmRows.map(r => r.firmUtilization);
  const nationalAvgUtilization =
    allUtils.length === 0 ? 0 : allUtils.reduce((a, v) => a + v, 0) / allUtils.length;
  const nationalUtilizationSpread = stdDev(allUtils);

  const tightest =
    regions.length === 0
      ? null
      : regions.reduce((min, r) => (r.headroomIndex < min.headroomIndex ? r : min), regions[0]);
  const slackiest =
    regions.length === 0
      ? null
      : regions.reduce((max, r) => (r.headroomIndex > max.headroomIndex ? r : max), regions[0]);

  return {
    schemaVersion: AGENT08_UTILIZATION_DEPTH_SCHEMA_VERSION,
    turn: params.turn,
    regions,
    firmRows,
    nationalAvgUtilization: Math.round(nationalAvgUtilization * 1000) / 1000,
    nationalUtilizationSpread: Math.round(nationalUtilizationSpread * 1000) / 1000,
    tightestRegionId: tightest?.regionId ?? null,
    slackiestRegionId: slackiest?.regionId ?? null,
    firmsUnderCapacityBind: firmRows.filter(r => r.capacityBind).length,
  };
}

export function runAgent08UtilizationDepthSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_util_01', () => {
    return classifyUtilizationSlackBand(0.12, 0.5) === 'idle' && classifyUtilizationSlackBand(0.82, 0.5) === 'tight';
  });

  check('a08_util_02', () => {
    const row = scoreFirmProductionUtilization(
      {
        id: 'u1',
        regionId: 'NSW',
        archetype: 'manufacturing',
        name: 'Fab',
        vitality: 'fragile',
        production: 'constrained',
        exposure: 'exposed',
        scale: 20,
        utilization: 0.72,
        primarySupply: 'energy',
        linkedIndustry: 'manufacturing',
        ecosystemId: 'eco',
        summary: 's',
        evidence: [],
        revision: 1,
      },
      {
        regionId: 'NSW',
        industries: {
          manufacturing: {
            industry: 'manufacturing',
            strength: 18,
            effectiveOutput: 8,
            utilization: 0.3,
            constraint: null,
            outputs: [],
          },
        },
        suppliedBy: [],
        primaryIndustrialConstraint: null,
        resilience: 'moderate',
      },
    );
    return row.capacityBind === true && row.slackBand === 'tight' && row.effectiveOutput === 14.4;
  });

  check('a08_util_03', () => {
    const regional = computeRegionalProductionUtilizationDepth(
      {
        regionId: 'VIC',
        name: 'VIC',
        maturity: 'forming',
        anchorArchetype: 'technology',
        companyCount: 2,
        activeProduction: 40,
        supplyChainRole: 'x',
        resilience: 'moderate',
        primaryConstraint: null,
        revision: 1,
        links: [],
        companies: [],
      },
      null,
      [
        {
          companyId: 'a',
          regionId: 'VIC',
          scale: 10,
          firmUtilization: 0.5,
          effectiveOutput: 5,
          linkedIndustryUtilization: null,
          utilizationDelta: null,
          headroom: 0.5,
          slackBand: 'balanced',
          stressBand: 'normal',
          capacityBind: false,
          utilizationNote: 'n',
        },
        {
          companyId: 'b',
          regionId: 'VIC',
          scale: 10,
          firmUtilization: 0.9,
          effectiveOutput: 9,
          linkedIndustryUtilization: null,
          utilizationDelta: null,
          headroom: 0.1,
          slackBand: 'tight',
          stressBand: 'strained',
          capacityBind: false,
          utilizationNote: 'n',
        },
      ],
    );
    return regional.utilizationSpread > 0.15 && regional.tightFirmCount === 1;
  });

  check('a08_util_04', () => {
    const stress = classifyUtilizationStress(
      {
        id: 's',
        regionId: 'QLD',
        archetype: 'energy',
        name: 'E',
        vitality: 'stable',
        production: 'stalled',
        exposure: 'balanced',
        scale: 12,
        utilization: 0.55,
        primarySupply: null,
        linkedIndustry: 'energy',
        ecosystemId: 'eco',
        summary: 's',
        evidence: [],
        revision: 1,
      },
      0.55,
    );
    return stress === 'strained';
  });

  check('a08_util_05', () => {
    const depth = computeNationalProductionUtilizationDepth({
      turn: 2,
      privateState: {
        schemaVersion: '10.14.0',
        revision: 1,
        regions: {
          NSW: {
            regionId: 'NSW',
            name: 'NSW',
            maturity: 'connected',
            anchorArchetype: 'manufacturing',
            companyCount: 1,
            activeProduction: 25,
            supplyChainRole: 'linked',
            resilience: 'moderate',
            primaryConstraint: null,
            revision: 1,
            links: [],
            companies: [
              {
                id: 'co',
                regionId: 'NSW',
                archetype: 'manufacturing',
                name: 'Fab',
                vitality: 'fragile',
                production: 'constrained',
                exposure: 'exposed',
                scale: 14,
                utilization: 0.35,
                primarySupply: 'energy',
                linkedIndustry: 'manufacturing',
                ecosystemId: 'eco',
                summary: 's',
                evidence: [],
                revision: 1,
              },
            ],
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
          avgVitality: 1,
        },
        history: [],
        lastUpdatedTurn: 2,
        inputHash: 's',
        computeMs: 0,
      },
      industries: {
        revision: 1,
        regions: {
          NSW: {
            regionId: 'NSW',
            industries: {
              manufacturing: {
                industry: 'manufacturing',
                strength: 22,
                effectiveOutput: 12,
                utilization: 0.35,
                constraint: null,
                outputs: [{ supply: 'goods', amount: 12 }],
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
    return (
      depth.schemaVersion === AGENT08_UTILIZATION_DEPTH_SCHEMA_VERSION &&
      depth.firmRows.length === 1 &&
      depth.nationalAvgUtilization === 0.35 &&
      depth.regions[0].effectiveOutputTotal === 4.9
    );
  });

  return results;
}
