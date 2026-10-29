/**
 * Agent 08 round 23 — transition equilibrium posture from resilience bands.
 * Non-authoritative planning layer (equilibrium bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionResilience,
  type FirmProductionTransitionResilience,
  type NationalProductionTransitionResilience,
  type TransitionResilienceBand,
} from './production-transition-resilience';

export const AGENT08_TRANSITION_EQUILIBRIUM_SCHEMA_VERSION = '1.0.0';

export type TransitionEquilibriumBand = 'volatile' | 'balancing' | 'equilibrated' | 'steady';

export interface FirmProductionTransitionEquilibrium {
  companyId: string;
  regionId: string;
  equilibriumBand: TransitionEquilibriumBand;
  resilienceBand: TransitionResilienceBand;
  equilibriumLever: ProductionRecoveryLever;
  turnsToSteadyState: number;
  equilibriumScore: number;
  equilibriumRank: number;
  equilibriumSummary: string;
}

export interface RegionalTransitionEquilibriumSummary {
  regionId: string;
  firmCount: number;
  steadyCount: number;
  equilibratedCount: number;
  avgEquilibriumScore: number;
  regionalEquilibriumPressure: number;
  dominantBand: TransitionEquilibriumBand;
}

export interface NationalProductionTransitionEquilibrium {
  schemaVersion: typeof AGENT08_TRANSITION_EQUILIBRIUM_SCHEMA_VERSION;
  turn: number;
  resilienceTurn: number;
  nationalEquilibriumPressure: number;
  nationalEquilibriumBand: TransitionEquilibriumBand;
  firmsSteady: number;
  firmEquilibria: FirmProductionTransitionEquilibrium[];
  regions: RegionalTransitionEquilibriumSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const EQ_BAND_ORDER: TransitionEquilibriumBand[] = ['volatile', 'balancing', 'equilibrated', 'steady'];

function equilibriumBandFromResilience(resilience: FirmProductionTransitionResilience): TransitionEquilibriumBand {
  switch (resilience.resilienceBand) {
    case 'hardened':
      return 'steady';
    case 'resilient':
      return 'equilibrated';
    case 'hedged':
      return 'balancing';
    default:
      return 'volatile';
  }
}

function equilibriumScoreFromSignals(
  band: TransitionEquilibriumBand,
  resilience: FirmProductionTransitionResilience,
): number {
  const bandBase =
    band === 'steady' ? 0.99 : band === 'equilibrated' ? 0.77 : band === 'balancing' ? 0.49 : 0.09;
  const resilienceAdj = resilience.resilienceScore * 0.095;
  const urgencyAdj =
    resilience.resilienceBand === 'hardened'
      ? 0.04
      : resilience.resilienceBand === 'resilient'
        ? 0.024
        : resilience.resilienceBand === 'hedged'
          ? 0.01
          : 0;
  return clamp(Math.round((bandBase + resilienceAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionEquilibrium(
  resilience: FirmProductionTransitionResilience,
): FirmProductionTransitionEquilibrium {
  const equilibriumBand = equilibriumBandFromResilience(resilience);
  const equilibriumScore = equilibriumScoreFromSignals(equilibriumBand, resilience);
  const rankBase =
    equilibriumBand === 'steady'
      ? 1900
      : equilibriumBand === 'equilibrated'
        ? 1220
        : equilibriumBand === 'balancing'
          ? 680
          : 170;
  const equilibriumRank = Math.round(
    rankBase + resilience.resilienceRank * 0.18 + equilibriumScore * 78,
  );

  const leverLabel = resilience.resilientLever.replace(/_/g, ' ');
  const equilibriumSummary =
    equilibriumBand === 'steady'
      ? `steady ${leverLabel} equilibrium after ${resilience.turnsToHarden} harden turns`
      : equilibriumBand === 'equilibrated'
        ? `equilibrated ${leverLabel} from ${resilience.resilienceBand} resilience`
        : equilibriumBand === 'balancing'
          ? `balancing ${leverLabel} while hedging shocks`
          : `volatile — ${resilience.resilienceSummary}`;

  const turnsToSteadyState =
    equilibriumBand === 'steady'
      ? Math.max(1, Math.min(resilience.turnsToHarden, 1))
      : equilibriumBand === 'equilibrated'
        ? Math.max(1, resilience.turnsToHarden + 1)
        : equilibriumBand === 'balancing'
          ? resilience.turnsToHarden + 4
          : resilience.turnsToHarden + 10;

  return {
    companyId: resilience.companyId,
    regionId: resilience.regionId,
    equilibriumBand,
    resilienceBand: resilience.resilienceBand,
    equilibriumLever: resilience.resilientLever,
    turnsToSteadyState,
    equilibriumScore,
    equilibriumRank,
    equilibriumSummary,
  };
}

export function summarizeRegionalTransitionEquilibrium(
  regionId: string,
  rows: FirmProductionTransitionEquilibrium[],
): RegionalTransitionEquilibriumSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const steadyCount = regional.filter(r => r.equilibriumBand === 'steady').length;
  const equilibratedCount = regional.filter(
    r => r.equilibriumBand === 'equilibrated' || r.equilibriumBand === 'steady',
  ).length;
  const avgEquilibriumScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.equilibriumScore, 0) / regional.length;

  const counts: Record<TransitionEquilibriumBand, number> = {
    volatile: 0,
    balancing: 0,
    equilibrated: 0,
    steady: 0,
  };
  for (const r of regional) counts[r.equilibriumBand] += 1;

  let dominantBand: TransitionEquilibriumBand = 'volatile';
  let max = -1;
  for (const b of [...EQ_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalEquilibriumPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.equilibriumBand === 'steady'
              ? 1
              : r.equilibriumBand === 'equilibrated'
                ? 0.58
                : r.equilibriumBand === 'balancing'
                  ? 0.26
                  : 0.04;
          return acc + w * r.equilibriumScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    steadyCount,
    equilibratedCount,
    avgEquilibriumScore: Math.round(avgEquilibriumScore * 1000) / 1000,
    regionalEquilibriumPressure: Math.round(regionalEquilibriumPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalEquilibriumBand(
  pressure: number,
  firmsSteady: number,
  nationalResilienceBand: TransitionResilienceBand,
): TransitionEquilibriumBand {
  if (firmsSteady >= 2 || nationalResilienceBand === 'hardened' || pressure > 0.91) return 'steady';
  if (firmsSteady >= 1 || nationalResilienceBand === 'resilient' || pressure > 0.7) return 'equilibrated';
  if (nationalResilienceBand === 'hedged' || pressure > 0.48) return 'balancing';
  return 'volatile';
}

export function computeNationalEquilibriumPressure(rows: FirmProductionTransitionEquilibrium[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.equilibriumBand === 'steady'
        ? 1
        : r.equilibriumBand === 'equilibrated'
          ? 0.52
          : r.equilibriumBand === 'balancing'
            ? 0.2
            : 0.02;
    return acc + bandW * 0.42 + r.equilibriumScore * 0.58;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionEquilibrium(params: {
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
}): NationalProductionTransitionEquilibrium {
  const resilience =
    params.resilience ??
    computeNationalProductionTransitionResilience({
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
    });

  const firmEquilibria = resilience.firmResiliences
    .map(buildFirmProductionTransitionEquilibrium)
    .sort((a, b) => b.equilibriumRank - a.equilibriumRank);

  const regionIds = [...new Set(firmEquilibria.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionEquilibrium(rid, firmEquilibria));

  const nationalEquilibriumPressure = computeNationalEquilibriumPressure(firmEquilibria);
  const firmsSteady = firmEquilibria.filter(r => r.equilibriumBand === 'steady').length;
  const nationalEquilibriumBand = classifyNationalEquilibriumBand(
    nationalEquilibriumPressure,
    firmsSteady,
    resilience.nationalResilienceBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_EQUILIBRIUM_SCHEMA_VERSION,
    turn: params.turn,
    resilienceTurn: resilience.turn,
    nationalEquilibriumPressure,
    nationalEquilibriumBand,
    firmsSteady,
    firmEquilibria,
    regions,
  };
}

export function runAgent08TransitionEquilibriumSelfTests(): Array<{
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

  check('a08_equilibrium_01', () => {
    const row = buildFirmProductionTransitionEquilibrium({
      companyId: 'f1',
      regionId: 'NSW',
      resilienceBand: 'hardened',
      sustainmentBand: 'durable',
      resilientLever: 'relieve_upstream',
      turnsToHarden: 1,
      resilienceScore: 0.98,
      resilienceRank: 1750,
      resilienceSummary: 's',
    });
    return row.equilibriumBand === 'steady' && row.equilibriumLever === 'relieve_upstream';
  });

  check('a08_equilibrium_02', () => {
    const row = buildFirmProductionTransitionEquilibrium({
      companyId: 'f2',
      regionId: 'VIC',
      resilienceBand: 'exposed',
      sustainmentBand: 'drifting',
      resilientLever: 'sector_rebalance',
      turnsToHarden: 38,
      resilienceScore: 0.11,
      resilienceRank: 130,
      resilienceSummary: 's',
    });
    return row.equilibriumBand === 'volatile';
  });

  check('a08_equilibrium_03', () => {
    const summary = summarizeRegionalTransitionEquilibrium('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        equilibriumBand: 'steady',
        resilienceBand: 'hardened',
        equilibriumLever: 'capacity_buffer',
        turnsToSteadyState: 1,
        equilibriumScore: 0.96,
        equilibriumRank: 1800,
        equilibriumSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        equilibriumBand: 'volatile',
        resilienceBand: 'exposed',
        equilibriumLever: 'sector_rebalance',
        turnsToSteadyState: 42,
        equilibriumScore: 0.1,
        equilibriumRank: 160,
        equilibriumSummary: 's',
      },
    ]);
    return summary.steadyCount === 1 && summary.dominantBand === 'steady';
  });

  check('a08_equilibrium_04', () => {
    const band = classifyNationalEquilibriumBand(0.74, 1, 'resilient');
    return band === 'equilibrated';
  });

  check('a08_equilibrium_05', () => {
    const equilibrium = computeNationalProductionTransitionEquilibrium({
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
      equilibrium.schemaVersion === AGENT08_TRANSITION_EQUILIBRIUM_SCHEMA_VERSION &&
      equilibrium.firmEquilibria.length >= 1 &&
      equilibrium.nationalEquilibriumPressure >= 0 &&
      equilibrium.nationalEquilibriumPressure <= 1
    );
  });

  return results;
}
