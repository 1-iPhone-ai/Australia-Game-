/**
 * Agent 08 round 14 — production readiness portfolio from operating digest and priorities.
 * Non-authoritative turn-readiness layer for private-sector planning feedback.
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import {
  computeNationalProductionOperatingDigest,
  type FirmOperatingDigestEntry,
  type NationalOperatingPostureBand,
  type NationalProductionOperatingDigest,
  type RegionalOperatingDigestSlice,
} from './production-operating-digest';
import {
  computeNationalProductionOperatingPriorities,
  type FirmProductionOperatingPriority,
  type NationalProductionOperatingPriorities,
} from './production-operating-priorities';

export const AGENT08_READINESS_PORTFOLIO_SCHEMA_VERSION = '1.0.0';

export type ProductionReadinessTier = 'ready' | 'constrained' | 'fragile' | 'impaired';

export interface FirmProductionReadinessRow {
  companyId: string;
  regionId: string;
  readinessTier: ProductionReadinessTier;
  readinessScore: number;
  postureSlice: FirmOperatingDigestEntry['postureSlice'];
  operatingPressure: number;
  readinessRank: number;
  readinessNote: string;
}

export interface RegionalProductionReadinessPortfolio {
  regionId: string;
  postureBand: NationalOperatingPostureBand;
  firmCount: number;
  readyCount: number;
  impairedCount: number;
  avgReadinessScore: number;
  portfolioPressure: number;
  dominantTier: ProductionReadinessTier;
}

export interface NationalProductionReadinessPortfolio {
  schemaVersion: typeof AGENT08_READINESS_PORTFOLIO_SCHEMA_VERSION;
  turn: number;
  digestTurn: number;
  nationalReadinessScore: number;
  portfolioPressure: number;
  nationalReadinessTier: ProductionReadinessTier;
  firmRows: FirmProductionReadinessRow[];
  regions: RegionalProductionReadinessPortfolio[];
  firmsImpaired: number;
  regionsFragileOrWorse: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const TIER_ORDER: ProductionReadinessTier[] = ['ready', 'constrained', 'fragile', 'impaired'];

function tierFromSignals(params: {
  digest: FirmOperatingDigestEntry;
  priority: FirmProductionOperatingPriority | undefined;
  postureBand: NationalOperatingPostureBand | undefined;
}): ProductionReadinessTier {
  const pressure = params.priority?.operatingPressure ?? 0.35;
  if (params.digest.postureSlice === 'action' && params.digest.reconciliationBand === 'conflict') {
    return 'impaired';
  }
  if (params.digest.postureSlice === 'action' || pressure > 0.72) return 'fragile';
  if (
    params.digest.postureSlice === 'watch' ||
    params.digest.reconciliationBand === 'drift' ||
    pressure > 0.45
  ) {
    return 'constrained';
  }
  if (params.postureBand === 'critical' || params.postureBand === 'stressed') {
    return params.digest.postureSlice === 'core' ? 'constrained' : 'fragile';
  }
  return 'ready';
}

function readinessScoreFromTier(tier: ProductionReadinessTier, pressure: number): number {
  const base =
    tier === 'ready' ? 0.88 : tier === 'constrained' ? 0.62 : tier === 'fragile' ? 0.38 : 0.15;
  return clamp(Math.round((base - pressure * 0.12) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionReadinessRow(params: {
  digest: FirmOperatingDigestEntry;
  priority?: FirmProductionOperatingPriority;
  regionalPosture?: NationalOperatingPostureBand;
}): FirmProductionReadinessRow {
  const operatingPressure = params.priority?.operatingPressure ?? 0.3;
  const readinessTier = tierFromSignals({
    digest: params.digest,
    priority: params.priority,
    postureBand: params.regionalPosture,
  });
  const readinessScore = readinessScoreFromTier(readinessTier, operatingPressure);

  const rankBase =
    readinessTier === 'impaired' ? 1000 : readinessTier === 'fragile' ? 650 : readinessTier === 'constrained' ? 320 : 90;
  const readinessRank = Math.round(rankBase + (1 - readinessScore) * 150 + operatingPressure * 80);

  const readinessNote =
    readinessTier === 'ready'
      ? 'portfolio ready — digest aligned'
      : readinessTier === 'constrained'
        ? 'constrained — monitor operating drift'
        : readinessTier === 'fragile'
          ? 'fragile — priority escalation likely'
          : 'impaired — conflict in action queue';

  return {
    companyId: params.digest.companyId,
    regionId: params.digest.regionId,
    readinessTier,
    readinessScore,
    postureSlice: params.digest.postureSlice,
    operatingPressure: Math.round(operatingPressure * 1000) / 1000,
    readinessRank,
    readinessNote,
  };
}

function dominantTier(rows: FirmProductionReadinessRow[]): ProductionReadinessTier {
  const counts: Record<ProductionReadinessTier, number> = {
    ready: 0,
    constrained: 0,
    fragile: 0,
    impaired: 0,
  };
  for (const r of rows) counts[r.readinessTier] += 1;
  let dominant: ProductionReadinessTier = 'ready';
  let max = -1;
  for (const t of TIER_ORDER) {
    if (counts[t] >= max) {
      max = counts[t];
      dominant = t;
    }
  }
  return dominant;
}

export function summarizeRegionalProductionReadiness(
  regionId: string,
  firmRows: FirmProductionReadinessRow[],
  digestSlice: RegionalOperatingDigestSlice | undefined,
): RegionalProductionReadinessPortfolio {
  const regional = firmRows.filter(r => r.regionId === regionId);
  const readyCount = regional.filter(r => r.readinessTier === 'ready').length;
  const impairedCount = regional.filter(r => r.readinessTier === 'impaired').length;
  const avgReadinessScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.readinessScore, 0) / regional.length;
  const portfolioPressure =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.operatingPressure * (1 - r.readinessScore), 0) / regional.length;

  return {
    regionId,
    postureBand: digestSlice?.postureBand ?? 'stable',
    firmCount: regional.length,
    readyCount,
    impairedCount,
    avgReadinessScore: Math.round(avgReadinessScore * 1000) / 1000,
    portfolioPressure: Math.round(portfolioPressure * 1000) / 1000,
    dominantTier: dominantTier(regional),
  };
}

export function classifyNationalReadinessTier(
  score: number,
  firmsImpaired: number,
  digestPosture: NationalOperatingPostureBand,
): ProductionReadinessTier {
  if (firmsImpaired >= 2 || digestPosture === 'critical' || score < 0.25) return 'impaired';
  if (firmsImpaired >= 1 || digestPosture === 'stressed' || score < 0.42) return 'fragile';
  if (digestPosture === 'managed' || score < 0.62) return 'constrained';
  return 'ready';
}

export function computeNationalReadinessScore(firmRows: FirmProductionReadinessRow[]): number {
  if (firmRows.length === 0) return 1;
  const avg = firmRows.reduce((a, r) => a + r.readinessScore, 0) / firmRows.length;
  return clamp(Math.round(avg * 1000) / 1000, 0, 1);
}

export function computePortfolioPressure(firmRows: FirmProductionReadinessRow[]): number {
  if (firmRows.length === 0) return 0;
  const weighted = firmRows.reduce((acc, r) => {
    const w =
      r.readinessTier === 'impaired' ? 1 : r.readinessTier === 'fragile' ? 0.7 : r.readinessTier === 'constrained' ? 0.4 : 0.12;
    return acc + w * r.operatingPressure;
  }, 0);
  return clamp(Math.round((weighted / firmRows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionReadinessPortfolio(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
  workforce: NationalWorkforceState | null;
  fiscal: Agent08FiscalRegionSlice[] | null;
  brief?: NationalIntegratedProductionBrief;
  priorMandate?: NationalProductionCoordinationMandate | null;
  compliance?: NationalProductionMandateCompliance;
  mandate?: NationalProductionCoordinationMandate;
  digest?: NationalProductionOperatingDigest;
  priorities?: NationalProductionOperatingPriorities;
}): NationalProductionReadinessPortfolio {
  const priorities =
    params.priorities ??
    computeNationalProductionOperatingPriorities({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
      workforce: params.workforce,
      fiscal: params.fiscal,
      brief: params.brief,
      priorMandate: params.priorMandate ?? null,
      compliance: params.compliance,
      mandate: params.mandate,
    });

  const digest =
    params.digest ??
    computeNationalProductionOperatingDigest({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
      workforce: params.workforce,
      fiscal: params.fiscal,
      brief: params.brief,
      priorMandate: params.priorMandate ?? null,
      compliance: params.compliance,
      mandate: params.mandate,
      priorities,
    });

  const priorityByFirm = new Map(priorities.firmPriorities.map(p => [p.companyId, p] as const));
  const digestRegionById = new Map(digest.regions.map(r => [r.regionId, r] as const));

  const firmRows = digest.firmEntries
    .map(entry =>
      buildFirmProductionReadinessRow({
        digest: entry,
        priority: priorityByFirm.get(entry.companyId),
        regionalPosture: digestRegionById.get(entry.regionId)?.postureBand,
      }),
    )
    .sort((a, b) => b.readinessRank - a.readinessRank);

  const regionIds = [...new Set(firmRows.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalProductionReadiness(rid, firmRows, digestRegionById.get(rid)),
  );

  const nationalReadinessScore = computeNationalReadinessScore(firmRows);
  const portfolioPressure = computePortfolioPressure(firmRows);
  const firmsImpaired = firmRows.filter(r => r.readinessTier === 'impaired').length;
  const regionsFragileOrWorse = regions.filter(
    r => r.dominantTier === 'fragile' || r.dominantTier === 'impaired',
  ).length;
  const nationalReadinessTier = classifyNationalReadinessTier(
    nationalReadinessScore,
    firmsImpaired,
    digest.nationalPostureBand,
  );

  return {
    schemaVersion: AGENT08_READINESS_PORTFOLIO_SCHEMA_VERSION,
    turn: params.turn,
    digestTurn: digest.turn,
    nationalReadinessScore,
    portfolioPressure,
    nationalReadinessTier,
    firmRows,
    regions,
    firmsImpaired,
    regionsFragileOrWorse,
  };
}

export function runAgent08ReadinessPortfolioSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_ready_01', () => {
    const row = buildFirmProductionReadinessRow({
      digest: {
        companyId: 'f1',
        regionId: 'NSW',
        postureSlice: 'core',
        priorityBand: 'defer',
        reconciliationBand: 'aligned',
        digestRank: 100,
        headline: 'h',
      },
      priority: {
        companyId: 'f1',
        regionId: 'NSW',
        priorityBand: 'defer',
        kind: 'hold_alignment',
        suggestedLever: 'capacity_buffer',
        priorityRank: 90,
        reconciliationBand: 'aligned',
        operatingPressure: 0.15,
        prioritySummary: 's',
      },
      regionalPosture: 'stable',
    });
    return row.readinessTier === 'ready' && row.readinessScore > 0.7;
  });

  check('a08_ready_02', () => {
    const row = buildFirmProductionReadinessRow({
      digest: {
        companyId: 'f2',
        regionId: 'VIC',
        postureSlice: 'action',
        priorityBand: 'intervene',
        reconciliationBand: 'conflict',
        digestRank: 1200,
        headline: 'h',
      },
      priority: {
        companyId: 'f2',
        regionId: 'VIC',
        priorityBand: 'intervene',
        kind: 'relieve_capacity_bind',
        suggestedLever: 'relieve_upstream',
        priorityRank: 1100,
        reconciliationBand: 'conflict',
        operatingPressure: 0.85,
        prioritySummary: 's',
      },
    });
    return row.readinessTier === 'impaired';
  });

  check('a08_ready_03', () => {
    const tier = classifyNationalReadinessTier(0.5, 0, 'managed');
    return tier === 'constrained';
  });

  check('a08_ready_04', () => {
    const pressure = computePortfolioPressure([
      {
        companyId: 'x',
        regionId: 'QLD',
        readinessTier: 'fragile',
        readinessScore: 0.35,
        postureSlice: 'action',
        operatingPressure: 0.7,
        readinessRank: 700,
        readinessNote: 'n',
      },
    ]);
    return pressure > 0.35 && pressure <= 1;
  });

  check('a08_ready_05', () => {
    const portfolio = computeNationalProductionReadinessPortfolio({
      turn: 4,
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
            links: [
              {
                id: 'lk',
                fromRegionId: 'QLD',
                toRegionId: 'NSW',
                supply: 'energy',
                strength: 85,
                fragile: true,
                reason: 'dep',
              },
            ],
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
          QLD: {
            regionId: 'QLD',
            name: 'QLD',
            maturity: 'forming',
            anchorArchetype: 'energy',
            companyCount: 0,
            activeProduction: 12,
            supplyChainRole: 'provider',
            resilience: 'exposed',
            primaryConstraint: 'energy',
            revision: 1,
            links: [],
            companies: [],
          },
        },
        national: {
          leadingRegions: [],
          constrainedRegions: ['QLD'],
          dominantArchetypes: [],
          criticalDependencies: [],
          ecosystemOpportunity: null,
          ecosystemRisk: null,
          totalCompanies: 1,
          avgVitality: 1,
        },
        history: [],
        lastUpdatedTurn: 4,
        inputHash: 's',
        computeMs: 0,
      },
      livingRegions: {
        revision: 1,
        regions: { NSW: { momentum: { band: 'softening' }, sectors: { manufacturing: 70 } } },
      },
      industries: {
        revision: 1,
        regions: {
          QLD: {
            regionId: 'QLD',
            industries: {
              energy: {
                industry: 'energy',
                strength: 16,
                effectiveOutput: 7,
                utilization: 0.22,
                constraint: { kind: 'production_constraint' },
                outputs: [{ supply: 'energy', amount: 7 }],
              },
            },
            suppliedBy: [],
            primaryIndustrialConstraint: 'energy',
            resilience: 'exposed',
          },
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
      workforce: null,
      fiscal: null,
      priorMandate: null,
    });
    return (
      portfolio.schemaVersion === AGENT08_READINESS_PORTFOLIO_SCHEMA_VERSION &&
      portfolio.firmRows.length >= 1 &&
      portfolio.nationalReadinessScore >= 0 &&
      portfolio.nationalReadinessScore <= 1
    );
  });

  return results;
}
