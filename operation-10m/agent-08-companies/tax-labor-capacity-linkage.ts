/**
 * Agent 08 — fiscal + labor read-only bridges into private-sector capacity interpretation.
 * V10.1 remains authoritative for production; V10.12/V10.10 for tax/labor — this layer only
 * derives bounded utilization/vitality pressure signals for company abstractions.
 */

import type { NationalPrivateSectorState, PrivateCompanyState } from './v1014-private-sector-core';
import type { NationalWorkforceState } from './upstream-stubs';

export const AGENT08_TAX_LABOR_SCHEMA_VERSION = '1.0.0';

export interface Agent08FiscalRegionSlice {
  regionId: string;
  /** Effective corporate tax burden 0–1 (derived from V10.12 public finance). */
  effectiveTaxRate: number;
  /** Fiscal headroom / constraint 0–100 abstract points. */
  fiscalHeadroom: number;
}

export interface Agent08LaborRegionSlice {
  regionId: string;
  employmentTightness: number;
  wagePressure: number;
  skillsGap: number;
}

export interface Agent08TaxLaborInputs {
  turn: number;
  fiscal: Agent08FiscalRegionSlice[] | null;
  workforce: NationalWorkforceState | null;
}

export interface Agent08CapacityAdjustment {
  companyId: string;
  regionId: string;
  utilizationDelta: number;
  vitalityPressure: number;
  taxDrag: number;
  laborDrag: number;
  evidence: string[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function buildLaborSlicesFromWorkforce(
  workforce: NationalWorkforceState | null,
): Agent08LaborRegionSlice[] {
  if (!workforce?.regions) return [];
  return Object.entries(workforce.regions).map(([regionId, row]) => ({
    regionId,
    employmentTightness: clamp((row.employmentRate ?? 0.92) - 0.85, 0, 1),
    wagePressure: clamp((row.wagePressure ?? 40) / 100, 0, 1),
    skillsGap: clamp((row.skillsGap ?? 20) / 100, 0, 1),
  }));
}

export function inferFiscalSlicesFromNationalSystems(
  nationalSystems: { revision: number; regions?: Record<string, { fiscalHeadroom?: number; taxBurden?: number }> } | null,
): Agent08FiscalRegionSlice[] {
  if (!nationalSystems?.regions) return [];
  return Object.entries(nationalSystems.regions).map(([regionId, row]) => ({
    regionId,
    effectiveTaxRate: clamp(row.taxBurden ?? 0.28, 0.05, 0.55),
    fiscalHeadroom: clamp(row.fiscalHeadroom ?? 50, 0, 100),
  }));
}

export function computeTaxLaborCapacityAdjustments(
  companies: PrivateCompanyState[],
  inputs: Agent08TaxLaborInputs,
): Agent08CapacityAdjustment[] {
  const fiscalByRegion = Object.fromEntries((inputs.fiscal || []).map(f => [f.regionId, f]));
  const laborByRegion = Object.fromEntries(buildLaborSlicesFromWorkforce(inputs.workforce).map(l => [l.regionId, l]));

  return companies.map(company => {
    const fiscal = fiscalByRegion[company.regionId];
    const labor = laborByRegion[company.regionId];
    const taxDrag = fiscal ? fiscal.effectiveTaxRate * 0.12 : 0;
    const laborDrag = labor
      ? labor.wagePressure * 0.08 + labor.skillsGap * 0.06 + labor.employmentTightness * 0.05
      : 0;
    const headroomBonus = fiscal ? (fiscal.fiscalHeadroom - 50) * 0.001 : 0;
    const utilizationDelta = clamp(headroomBonus - taxDrag - laborDrag * 0.5, -0.15, 0.08);
    const vitalityPressure = clamp(taxDrag * 40 + laborDrag * 35, 0, 25);
    const evidence: string[] = [];
    if (fiscal) evidence.push(`v10.12.tax:${Math.round(fiscal.effectiveTaxRate * 100)}%`);
    if (labor) evidence.push(`v10.10.labor:tight=${labor.employmentTightness.toFixed(2)}`);
    return {
      companyId: company.id,
      regionId: company.regionId,
      utilizationDelta,
      vitalityPressure,
      taxDrag,
      laborDrag,
      evidence,
    };
  });
}

/** Apply bounded capacity interpretation onto an already-computed private sector state (non-authoritative overlay). */
export function applyTaxLaborCapacityOverlay(
  state: NationalPrivateSectorState,
  adjustments: Agent08CapacityAdjustment[],
): NationalPrivateSectorState {
  const byId = Object.fromEntries(adjustments.map(a => [a.companyId, a]));
  const regions = { ...state.regions };
  for (const [code, region] of Object.entries(regions)) {
    const companies = region.companies.map(c => {
      const adj = byId[c.id];
      if (!adj) return c;
      const utilization = clamp(c.utilization + adj.utilizationDelta, 0, 1);
      return {
        ...c,
        utilization: Math.round(utilization * 100) / 100,
        evidence: [
          ...c.evidence,
          { label: 'Tax/labor capacity overlay', value: adj.vitalityPressure, source: 'agent08.tax_labor' },
        ],
      };
    });
    regions[code] = { ...region, companies, revision: state.lastUpdatedTurn };
  }
  return { ...state, regions, revision: state.revision + 1 };
}

export function runAgent08TaxLaborSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_tl_01', () => {
    const adj = computeTaxLaborCapacityAdjustments(
      [
        {
          id: 'co_test',
          regionId: 'NSW',
          archetype: 'mining',
          name: 'Test Co',
          vitality: 'stable',
          production: 'steady',
          exposure: 'balanced',
          scale: 10,
          utilization: 0.5,
          primarySupply: 'minerals',
          linkedIndustry: 'mining',
          ecosystemId: 'eco_NSW',
          summary: 'test',
          evidence: [],
          revision: 1,
        },
      ],
      {
        turn: 1,
        fiscal: [{ regionId: 'NSW', effectiveTaxRate: 0.4, fiscalHeadroom: 30 }],
        workforce: { revision: 1, regions: { NSW: { wagePressure: 80, skillsGap: 40, employmentRate: 0.96 } } },
      },
    );
    return adj.length === 1 && adj[0].utilizationDelta < 0 && adj[0].vitalityPressure > 0;
  });

  check('a08_tl_02', () => {
    const labor = buildLaborSlicesFromWorkforce(null);
    return labor.length === 0;
  });

  check('a08_tl_03', () => {
    const adj = computeTaxLaborCapacityAdjustments([], { turn: 1, fiscal: null, workforce: null });
    return adj.length === 0;
  });

  return results;
}
