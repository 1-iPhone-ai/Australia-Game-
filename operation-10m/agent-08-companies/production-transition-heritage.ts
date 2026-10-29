/**
 * Agent 08 round 26 (O10-183) — transition heritage posture from continuity bands.
 * Non-authoritative planning layer (heritage bands, not ledger enforcement).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import type { ProductionRecoveryLever } from './production-recovery-playbook';
import type { NationalProductionOperatingPriorities } from './production-operating-priorities';
import type { NationalProductionTransitionHorizon } from './production-transition-horizon';
import type { NationalProductionTransitionCommitment } from './production-transition-commitment';
import type { NationalProductionTransitionMobilization } from './production-transition-mobilization';
import type { NationalProductionTransitionDeployment } from './production-transition-deployment';
import type { NationalProductionTransitionValidation } from './production-transition-validation';
import type { NationalProductionTransitionConsolidation } from './production-transition-consolidation';
import type { NationalProductionTransitionSustainment } from './production-transition-sustainment';
import type { NationalProductionTransitionResilience } from './production-transition-resilience';
import type { NationalProductionTransitionEquilibrium } from './production-transition-equilibrium';
import type { NationalProductionTransitionMaturity } from './production-transition-maturity';
import {
  computeNationalProductionTransitionContinuity,
  type FirmProductionTransitionContinuity,
  type NationalProductionTransitionContinuity,
  type TransitionContinuityBand,
} from './production-transition-continuity';

export const AGENT08_TRANSITION_HERITAGE_SCHEMA_VERSION = '1.0.0';

export type TransitionHeritageBand = 'provisional' | 'accumulating' | 'established' | 'legacy';

export interface FirmProductionTransitionHeritage {
  companyId: string;
  regionId: string;
  heritageBand: TransitionHeritageBand;
  continuityBand: TransitionContinuityBand;
  heritageLever: ProductionRecoveryLever;
  turnsToLegacy: number;
  heritageScore: number;
  heritageRank: number;
  heritageSummary: string;
}

export interface RegionalTransitionHeritageSummary {
  regionId: string;
  firmCount: number;
  legacyCount: number;
  establishedCount: number;
  avgHeritageScore: number;
  regionalHeritagePressure: number;
  dominantBand: TransitionHeritageBand;
}

export interface NationalProductionTransitionHeritage {
  schemaVersion: typeof AGENT08_TRANSITION_HERITAGE_SCHEMA_VERSION;
  turn: number;
  continuityTurn: number;
  nationalHeritagePressure: number;
  nationalHeritageBand: TransitionHeritageBand;
  firmsLegacy: number;
  firmHeritages: FirmProductionTransitionHeritage[];
  regions: RegionalTransitionHeritageSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const HER_BAND_ORDER: TransitionHeritageBand[] = ['provisional', 'accumulating', 'established', 'legacy'];

function heritageBandFromContinuity(continuity: FirmProductionTransitionContinuity): TransitionHeritageBand {
  switch (continuity.continuityBand) {
    case 'canonical':
      return 'legacy';
    case 'enduring':
      return 'established';
    case 'persisting':
      return 'accumulating';
    default:
      return 'provisional';
  }
}

function heritageScoreFromSignals(
  band: TransitionHeritageBand,
  continuity: FirmProductionTransitionContinuity,
): number {
  const bandBase =
    band === 'legacy' ? 0.997 : band === 'established' ? 0.8 : band === 'accumulating' ? 0.52 : 0.06;
  const continuityAdj = continuity.continuityScore * 0.08;
  const urgencyAdj =
    continuity.continuityBand === 'canonical'
      ? 0.034
      : continuity.continuityBand === 'enduring'
        ? 0.018
        : continuity.continuityBand === 'persisting'
          ? 0.007
          : 0;
  return clamp(Math.round((bandBase + continuityAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionHeritage(
  continuity: FirmProductionTransitionContinuity,
): FirmProductionTransitionHeritage {
  const heritageBand = heritageBandFromContinuity(continuity);
  const heritageScore = heritageScoreFromSignals(heritageBand, continuity);
  const rankBase =
    heritageBand === 'legacy'
      ? 2200
      : heritageBand === 'established'
        ? 1400
        : heritageBand === 'accumulating'
          ? 800
          : 200;
  const heritageRank = Math.round(
    rankBase + continuity.continuityRank * 0.12 + heritageScore * 72,
  );

  const leverLabel = continuity.continuousLever.replace(/_/g, ' ');
  const heritageSummary =
    heritageBand === 'legacy'
      ? `legacy ${leverLabel} heritage after ${continuity.turnsToCanonical} canonical turns`
      : heritageBand === 'established'
        ? `established ${leverLabel} from ${continuity.continuityBand} continuity`
        : heritageBand === 'accumulating'
          ? `accumulating ${leverLabel} record while persisting`
          : `provisional — ${continuity.continuitySummary}`;

  const turnsToLegacy =
    heritageBand === 'legacy'
      ? Math.max(1, Math.min(continuity.turnsToCanonical, 1))
      : heritageBand === 'established'
        ? Math.max(1, continuity.turnsToCanonical + 1)
        : heritageBand === 'accumulating'
          ? continuity.turnsToCanonical + 6
          : continuity.turnsToCanonical + 13;

  return {
    companyId: continuity.companyId,
    regionId: continuity.regionId,
    heritageBand,
    continuityBand: continuity.continuityBand,
    heritageLever: continuity.continuousLever,
    turnsToLegacy,
    heritageScore,
    heritageRank,
    heritageSummary,
  };
}

export function summarizeRegionalTransitionHeritage(
  regionId: string,
  rows: FirmProductionTransitionHeritage[],
): RegionalTransitionHeritageSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const legacyCount = regional.filter(r => r.heritageBand === 'legacy').length;
  const establishedCount = regional.filter(
    r => r.heritageBand === 'established' || r.heritageBand === 'legacy',
  ).length;
  const avgHeritageScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.heritageScore, 0) / regional.length;

  const counts: Record<TransitionHeritageBand, number> = {
    provisional: 0,
    accumulating: 0,
    established: 0,
    legacy: 0,
  };
  for (const r of regional) counts[r.heritageBand] += 1;

  let dominantBand: TransitionHeritageBand = 'provisional';
  let max = -1;
  for (const b of [...HER_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalHeritagePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.heritageBand === 'legacy'
              ? 1
              : r.heritageBand === 'established'
                ? 0.52
                : r.heritageBand === 'accumulating'
                  ? 0.2
                  : 0.02;
          return acc + w * r.heritageScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    legacyCount,
    establishedCount,
    avgHeritageScore: Math.round(avgHeritageScore * 1000) / 1000,
    regionalHeritagePressure: Math.round(regionalHeritagePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalHeritageBand(
  pressure: number,
  firmsLegacy: number,
  nationalContinuityBand: TransitionContinuityBand,
): TransitionHeritageBand {
  if (firmsLegacy >= 2 || nationalContinuityBand === 'canonical' || pressure > 0.94) return 'legacy';
  if (firmsLegacy >= 1 || nationalContinuityBand === 'enduring' || pressure > 0.76) return 'established';
  if (nationalContinuityBand === 'persisting' || pressure > 0.54) return 'accumulating';
  return 'provisional';
}

export function computeNationalHeritagePressure(rows: FirmProductionTransitionHeritage[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.heritageBand === 'legacy'
        ? 1
        : r.heritageBand === 'established'
          ? 0.46
          : r.heritageBand === 'accumulating'
            ? 0.14
            : 0.01;
    return acc + bandW * 0.36 + r.heritageScore * 0.64;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionHeritage(params: {
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
  horizon?: NationalProductionTransitionHorizon;
  priorities?: NationalProductionOperatingPriorities;
  commitment?: NationalProductionTransitionCommitment;
  mobilization?: NationalProductionTransitionMobilization;
  deployment?: NationalProductionTransitionDeployment;
  validation?: NationalProductionTransitionValidation;
  consolidation?: NationalProductionTransitionConsolidation;
  sustainment?: NationalProductionTransitionSustainment;
  resilience?: NationalProductionTransitionResilience;
  equilibrium?: NationalProductionTransitionEquilibrium;
  maturity?: NationalProductionTransitionMaturity;
  continuity?: NationalProductionTransitionContinuity;
}): NationalProductionTransitionHeritage {
  const continuity =
    params.continuity ??
    computeNationalProductionTransitionContinuity({
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
      horizon: params.horizon,
      priorities: params.priorities,
      commitment: params.commitment,
      mobilization: params.mobilization,
      deployment: params.deployment,
      validation: params.validation,
      consolidation: params.consolidation,
      sustainment: params.sustainment,
      resilience: params.resilience,
      equilibrium: params.equilibrium,
      maturity: params.maturity,
    });

  const firmHeritages = continuity.firmContinuities
    .map(buildFirmProductionTransitionHeritage)
    .sort((a, b) => b.heritageRank - a.heritageRank);

  const regionIds = [...new Set(firmHeritages.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionHeritage(rid, firmHeritages));

  const nationalHeritagePressure = computeNationalHeritagePressure(firmHeritages);
  const firmsLegacy = firmHeritages.filter(r => r.heritageBand === 'legacy').length;
  const nationalHeritageBand = classifyNationalHeritageBand(
    nationalHeritagePressure,
    firmsLegacy,
    continuity.nationalContinuityBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_HERITAGE_SCHEMA_VERSION,
    turn: params.turn,
    continuityTurn: continuity.turn,
    nationalHeritagePressure,
    nationalHeritageBand,
    firmsLegacy,
    firmHeritages,
    regions,
  };
}

export function runAgent08TransitionHeritageSelfTests(): Array<{
  id: string;
  passed: boolean;
  detail: string;
}> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_heritage_01', () => {
    const row = buildFirmProductionTransitionHeritage({
      companyId: 'f1',
      regionId: 'NSW',
      continuityBand: 'canonical',
      maturityBand: 'institutional',
      continuousLever: 'relieve_upstream',
      turnsToCanonical: 1,
      continuityScore: 0.998,
      continuityRank: 2050,
      continuitySummary: 's',
    });
    return row.heritageBand === 'legacy' && row.heritageLever === 'relieve_upstream';
  });

  check('a08_heritage_02', () => {
    const row = buildFirmProductionTransitionHeritage({
      companyId: 'f2',
      regionId: 'VIC',
      continuityBand: 'ephemeral',
      maturityBand: 'nascent',
      continuousLever: 'sector_rebalance',
      turnsToCanonical: 56,
      continuityScore: 0.05,
      continuityRank: 160,
      continuitySummary: 's',
    });
    return row.heritageBand === 'provisional';
  });

  check('a08_heritage_03', () => {
    const summary = summarizeRegionalTransitionHeritage('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        heritageBand: 'legacy',
        continuityBand: 'canonical',
        heritageLever: 'capacity_buffer',
        turnsToLegacy: 1,
        heritageScore: 0.99,
        heritageRank: 2100,
        heritageSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        heritageBand: 'provisional',
        continuityBand: 'ephemeral',
        heritageLever: 'sector_rebalance',
        turnsToLegacy: 60,
        heritageScore: 0.05,
        heritageRank: 190,
        heritageSummary: 's',
      },
    ]);
    return summary.legacyCount === 1 && summary.dominantBand === 'legacy';
  });

  check('a08_heritage_04', () => {
    const band = classifyNationalHeritageBand(0.8, 1, 'enduring');
    return band === 'established';
  });

  check('a08_heritage_05', () => {
    const heritage = computeNationalProductionTransitionHeritage({
      turn: 6,
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
        lastUpdatedTurn: 6,
        inputHash: 's',
        computeMs: 0,
      },
      livingRegions: {
        revision: 1,
        regions: { NSW: { momentum: { band: 'stable' }, sectors: { manufacturing: 70 } } },
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
      workforce: null,
      fiscal: null,
      priorMandate: null,
    });
    return (
      heritage.schemaVersion === AGENT08_TRANSITION_HERITAGE_SCHEMA_VERSION &&
      heritage.firmHeritages.length >= 1 &&
      heritage.nationalHeritagePressure >= 0 &&
      heritage.nationalHeritagePressure <= 1
    );
  });

  return results;
}
