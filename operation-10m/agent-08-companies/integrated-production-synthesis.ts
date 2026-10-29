/**
 * Agent 08 round 3 — synthesize supply, sector, cascade, and tax/labor signals into
 * bounded firm/regional production interpretation (non-authoritative).
 */

import type { NationalPrivateSectorState, PrivateCompanyState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import {
  computeNationalProductionCapacityCascade,
  type FirmCascadeExposure,
} from './production-capacity-cascade';
import { computeNationalSectorProductionDepth, type FirmSectorProductionRow } from './sector-production-depth';
import { computeNationalSupplyDepthSummary, type FirmSupplyChainProfile } from './supply-chain-firm-depth';
import {
  computeTaxLaborCapacityAdjustments,
  type Agent08TaxLaborInputs,
  type Agent08FiscalRegionSlice,
  buildLaborSlicesFromWorkforce,
} from './tax-labor-capacity-linkage';

export const AGENT08_INTEGRATED_SCHEMA_VERSION = '1.0.0';

export type IntegratedProductionRiskBand = 'stable' | 'watch' | 'stressed' | 'critical';

export interface FirmIntegratedProductionSignal {
  companyId: string;
  regionId: string;
  compositePressure: number;
  riskBand: IntegratedProductionRiskBand;
  supplyDepthStress: number;
  sectorMisalignment: number;
  cascadePressure: number;
  taxLaborDrag: number;
  drivers: string[];
}

export interface RegionalIntegratedProductionSummary {
  regionId: string;
  firmCount: number;
  avgCompositePressure: number;
  riskBand: IntegratedProductionRiskBand;
  watchFirmCount: number;
  criticalFirmCount: number;
}

export interface NationalIntegratedProductionBrief {
  schemaVersion: typeof AGENT08_INTEGRATED_SCHEMA_VERSION;
  turn: number;
  firms: FirmIntegratedProductionSignal[];
  regions: RegionalIntegratedProductionSummary[];
  highestRiskRegion: string | null;
  nationalAvgPressure: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

function riskBandFromPressure(p: number): IntegratedProductionRiskBand {
  if (p < 0.22) return 'stable';
  if (p < 0.38) return 'watch';
  if (p < 0.55) return 'stressed';
  return 'critical';
}

function indexByCompany<T extends { companyId: string }>(rows: T[]): Record<string, T> {
  return Object.fromEntries(rows.map(r => [r.companyId, r]));
}

export function synthesizeFirmIntegratedProductionSignal(params: {
  company: PrivateCompanyState;
  supply?: FirmSupplyChainProfile;
  sector?: FirmSectorProductionRow;
  cascade?: FirmCascadeExposure;
  taxLaborUtilizationDelta?: number;
  taxLaborVitalityPressure?: number;
}): FirmIntegratedProductionSignal {
  const supplyDepthStress = params.supply?.capacityStress ?? 0.35;
  const sectorMisalignment = params.sector
    ? clamp(params.sector.alignmentGap / 15 + (params.sector.overloaded ? 0.25 : 0), 0, 1)
    : 0;
  const cascadePressure = params.cascade?.inboundPressure ?? 0;
  const taxLaborDrag = clamp(
    Math.abs(params.taxLaborUtilizationDelta ?? 0) * 2 + (params.taxLaborVitalityPressure ?? 0) / 25,
    0,
    1,
  );

  const compositePressure = clamp(
    supplyDepthStress * 0.3 +
      sectorMisalignment * 0.25 +
      cascadePressure * 0.3 +
      taxLaborDrag * 0.15,
    0,
    1,
  );

  const drivers: string[] = [];
  if (supplyDepthStress > 0.55) drivers.push('supply_stress');
  if (sectorMisalignment > 0.35) drivers.push('sector_mismatch');
  if (cascadePressure > 0.25) drivers.push('upstream_cascade');
  if (taxLaborDrag > 0.2) drivers.push('tax_labor');

  return {
    companyId: params.company.id,
    regionId: params.company.regionId,
    compositePressure: Math.round(compositePressure * 1000) / 1000,
    riskBand: riskBandFromPressure(compositePressure),
    supplyDepthStress: Math.round(supplyDepthStress * 1000) / 1000,
    sectorMisalignment: Math.round(sectorMisalignment * 1000) / 1000,
    cascadePressure: Math.round(cascadePressure * 1000) / 1000,
    taxLaborDrag: Math.round(taxLaborDrag * 1000) / 1000,
    drivers,
  };
}

export function summarizeRegionalIntegratedProduction(
  regionId: string,
  firms: FirmIntegratedProductionSignal[],
): RegionalIntegratedProductionSummary {
  const regional = firms.filter(f => f.regionId === regionId);
  const avgCompositePressure = regional.length
    ? regional.reduce((a, f) => a + f.compositePressure, 0) / regional.length
    : 0;
  return {
    regionId,
    firmCount: regional.length,
    avgCompositePressure: Math.round(avgCompositePressure * 1000) / 1000,
    riskBand: riskBandFromPressure(avgCompositePressure),
    watchFirmCount: regional.filter(f => f.riskBand === 'watch' || f.riskBand === 'stressed').length,
    criticalFirmCount: regional.filter(f => f.riskBand === 'critical').length,
  };
}

export function computeNationalIntegratedProductionBrief(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
  workforce: NationalWorkforceState | null;
  fiscal: Agent08FiscalRegionSlice[] | null;
}): NationalIntegratedProductionBrief {
  const supply = computeNationalSupplyDepthSummary(params.privateState);
  const sector = computeNationalSectorProductionDepth({
    turn: params.turn,
    privateState: params.privateState,
    livingRegions: params.livingRegions,
    industries: params.industries,
  });
  const cascade = computeNationalProductionCapacityCascade({
    turn: params.turn,
    privateState: params.privateState,
    industries: params.industries,
  });

  const supplyByCo = indexByCompany(supply.firmProfiles);
  const sectorByCo = indexByCompany(sector.firmRows);
  const cascadeByCo = indexByCompany(cascade.firmExposure);

  const allCompanies: PrivateCompanyState[] = [];
  for (const r of Object.values(params.privateState.regions)) {
    allCompanies.push(...r.companies);
  }

  const taxLaborInputs: Agent08TaxLaborInputs = {
    turn: params.turn,
    fiscal: params.fiscal,
    workforce: params.workforce,
  };
  const taxLaborAdj = computeTaxLaborCapacityAdjustments(allCompanies, taxLaborInputs);
  const taxByCo = Object.fromEntries(taxLaborAdj.map(a => [a.companyId, a]));

  const firms = allCompanies.map(company => {
    const adj = taxByCo[company.id];
    return synthesizeFirmIntegratedProductionSignal({
      company,
      supply: supplyByCo[company.id],
      sector: sectorByCo[company.id],
      cascade: cascadeByCo[company.id],
      taxLaborUtilizationDelta: adj?.utilizationDelta,
      taxLaborVitalityPressure: adj?.vitalityPressure,
    });
  });

  const regions = Object.keys(params.privateState.regions).map(code =>
    summarizeRegionalIntegratedProduction(code, firms),
  );
  const nationalAvgPressure = firms.length
    ? firms.reduce((a, f) => a + f.compositePressure, 0) / firms.length
    : 0;
  const highestRiskRegion = regions.length
    ? regions.reduce((max, r) => (r.avgCompositePressure > max.avgCompositePressure ? r : max), regions[0])
        .regionId
    : null;

  return {
    schemaVersion: AGENT08_INTEGRATED_SCHEMA_VERSION,
    turn: params.turn,
    firms,
    regions,
    highestRiskRegion,
    nationalAvgPressure: Math.round(nationalAvgPressure * 1000) / 1000,
  };
}

export function runAgent08IntegratedSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_int_01', () => {
    const sig = synthesizeFirmIntegratedProductionSignal({
      company: {
        id: 'c1',
        regionId: 'NSW',
        archetype: 'manufacturing',
        name: 'X',
        vitality: 'fragile',
        production: 'constrained',
        exposure: 'exposed',
        scale: 10,
        utilization: 0.4,
        primarySupply: 'energy',
        linkedIndustry: 'manufacturing',
        ecosystemId: 'e',
        summary: '',
        evidence: [],
        revision: 1,
      },
      supply: {
        companyId: 'c1',
        regionId: 'NSW',
        archetype: 'manufacturing',
        upstreamRegions: ['QLD'],
        inboundLinkCount: 2,
        fragileInbound: 1,
        outboundDependentRegions: 0,
        concentrationScore: 0.8,
        capacityStress: 0.7,
        utilization: 0.4,
        productionBand: 'constrained',
        primarySupply: 'energy',
        depthBand: 'deep',
        evidence: [],
      },
      sector: {
        companyId: 'c1',
        regionId: 'NSW',
        archetype: 'manufacturing',
        productionMass: 4,
        linkedIndustry: 'manufacturing',
        industryUtilization: 0.3,
        industryStrength: 15,
        alignmentGap: 8,
        overloaded: true,
      },
      cascade: {
        companyId: 'c1',
        regionId: 'NSW',
        inboundPressure: 0.35,
        severity: 'high',
        dominantSupply: 'energy',
        evidence: [],
      },
      taxLaborUtilizationDelta: -0.08,
      taxLaborVitalityPressure: 12,
    });
    return sig.riskBand !== 'stable' && sig.drivers.length >= 2;
  });

  check('a08_int_02', () => riskBandFromPressure(0.6) === 'critical');

  check('a08_int_03', () => {
    const brief = computeNationalIntegratedProductionBrief({
      turn: 1,
      privateState: {
        schemaVersion: '10.14.0',
        revision: 1,
        regions: {
          NSW: {
            regionId: 'NSW',
            name: 'NSW',
            maturity: 'connected',
            anchorArchetype: 'mining',
            companyCount: 1,
            activeProduction: 20,
            supplyChainRole: 'x',
            resilience: 'moderate',
            primaryConstraint: null,
            revision: 1,
            links: [],
            companies: [
              {
                id: 'co',
                regionId: 'NSW',
                archetype: 'mining',
                name: 'Mine',
                vitality: 'stable',
                production: 'steady',
                exposure: 'balanced',
                scale: 12,
                utilization: 0.6,
                primarySupply: 'minerals',
                linkedIndustry: 'mining',
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
          dominantArchetypes: ['mining'],
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
      },
      livingRegions: { revision: 1, regions: { NSW: { momentum: { band: 'stable' }, sectors: { mining: 90 } } } },
      industries: {
        revision: 1,
        regions: {
          NSW: {
            regionId: 'NSW',
            industries: {
              mining: {
                industry: 'mining',
                strength: 40,
                effectiveOutput: 20,
                utilization: 0.6,
                constraint: null,
                outputs: [{ supply: 'minerals', amount: 20 }],
              },
            },
            suppliedBy: [],
            primaryIndustrialConstraint: null,
            resilience: 'moderate',
          },
        },
        dependencies: [],
      },
      workforce: null,
      fiscal: null,
    });
    return brief.firms.length === 1 && brief.regions.length === 1 && brief.schemaVersion === AGENT08_INTEGRATED_SCHEMA_VERSION;
  });

  check('a08_int_04', () => {
    const regions = summarizeRegionalIntegratedProduction('NSW', [
      {
        companyId: 'a',
        regionId: 'NSW',
        compositePressure: 0.5,
        riskBand: 'stressed',
        supplyDepthStress: 0.5,
        sectorMisalignment: 0.2,
        cascadePressure: 0.1,
        taxLaborDrag: 0.1,
        drivers: ['supply_stress'],
      },
    ]);
    return regions.criticalFirmCount === 0 && regions.watchFirmCount === 1;
  });

  check('a08_int_05', () => buildLaborSlicesFromWorkforce(null).length === 0);

  return results;
}
