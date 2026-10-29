/**
 * Agent 08 round 24 — transition maturity posture from equilibrium bands.
 * Non-authoritative planning layer (maturity bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionEquilibrium,
  type FirmProductionTransitionEquilibrium,
  type NationalProductionTransitionEquilibrium,
  type TransitionEquilibriumBand,
} from './production-transition-equilibrium';

export const AGENT08_TRANSITION_MATURITY_SCHEMA_VERSION = '1.0.0';

export type TransitionMaturityBand = 'nascent' | 'developing' | 'mature' | 'institutional';

export interface FirmProductionTransitionMaturity {
  companyId: string;
  regionId: string;
  maturityBand: TransitionMaturityBand;
  equilibriumBand: TransitionEquilibriumBand;
  matureLever: ProductionRecoveryLever;
  turnsToInstitutional: number;
  maturityScore: number;
  maturityRank: number;
  maturitySummary: string;
}

export interface RegionalTransitionMaturitySummary {
  regionId: string;
  firmCount: number;
  institutionalCount: number;
  matureCount: number;
  avgMaturityScore: number;
  regionalMaturityPressure: number;
  dominantBand: TransitionMaturityBand;
}

export interface NationalProductionTransitionMaturity {
  schemaVersion: typeof AGENT08_TRANSITION_MATURITY_SCHEMA_VERSION;
  turn: number;
  equilibriumTurn: number;
  nationalMaturityPressure: number;
  nationalMaturityBand: TransitionMaturityBand;
  firmsInstitutional: number;
  firmMaturities: FirmProductionTransitionMaturity[];
  regions: RegionalTransitionMaturitySummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const MAT_BAND_ORDER: TransitionMaturityBand[] = ['nascent', 'developing', 'mature', 'institutional'];

function maturityBandFromEquilibrium(equilibrium: FirmProductionTransitionEquilibrium): TransitionMaturityBand {
  switch (equilibrium.equilibriumBand) {
    case 'steady':
      return 'institutional';
    case 'equilibrated':
      return 'mature';
    case 'balancing':
      return 'developing';
    default:
      return 'nascent';
  }
}

function maturityScoreFromSignals(
  band: TransitionMaturityBand,
  equilibrium: FirmProductionTransitionEquilibrium,
): number {
  const bandBase =
    band === 'institutional' ? 0.995 : band === 'mature' ? 0.78 : band === 'developing' ? 0.5 : 0.08;
  const equilibriumAdj = equilibrium.equilibriumScore * 0.09;
  const urgencyAdj =
    equilibrium.equilibriumBand === 'steady'
      ? 0.038
      : equilibrium.equilibriumBand === 'equilibrated'
        ? 0.022
        : equilibrium.equilibriumBand === 'balancing'
          ? 0.009
          : 0;
  return clamp(Math.round((bandBase + equilibriumAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionMaturity(
  equilibrium: FirmProductionTransitionEquilibrium,
): FirmProductionTransitionMaturity {
  const maturityBand = maturityBandFromEquilibrium(equilibrium);
  const maturityScore = maturityScoreFromSignals(maturityBand, equilibrium);
  const rankBase =
    maturityBand === 'institutional'
      ? 2000
      : maturityBand === 'mature'
        ? 1280
        : maturityBand === 'developing'
          ? 720
          : 180;
  const maturityRank = Math.round(
    rankBase + equilibrium.equilibriumRank * 0.16 + maturityScore * 76,
  );

  const leverLabel = equilibrium.equilibriumLever.replace(/_/g, ' ');
  const maturitySummary =
    maturityBand === 'institutional'
      ? `institutional ${leverLabel} maturity after ${equilibrium.turnsToSteadyState} steady turns`
      : maturityBand === 'mature'
        ? `mature ${leverLabel} from ${equilibrium.equilibriumBand} equilibrium`
        : maturityBand === 'developing'
          ? `developing ${leverLabel} practice while balancing`
          : `nascent — ${equilibrium.equilibriumSummary}`;

  const turnsToInstitutional =
    maturityBand === 'institutional'
      ? Math.max(1, Math.min(equilibrium.turnsToSteadyState, 1))
      : maturityBand === 'mature'
        ? Math.max(1, equilibrium.turnsToSteadyState + 1)
        : maturityBand === 'developing'
          ? equilibrium.turnsToSteadyState + 5
          : equilibrium.turnsToSteadyState + 11;

  return {
    companyId: equilibrium.companyId,
    regionId: equilibrium.regionId,
    maturityBand,
    equilibriumBand: equilibrium.equilibriumBand,
    matureLever: equilibrium.equilibriumLever,
    turnsToInstitutional,
    maturityScore,
    maturityRank,
    maturitySummary,
  };
}

export function summarizeRegionalTransitionMaturity(
  regionId: string,
  rows: FirmProductionTransitionMaturity[],
): RegionalTransitionMaturitySummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const institutionalCount = regional.filter(r => r.maturityBand === 'institutional').length;
  const matureCount = regional.filter(
    r => r.maturityBand === 'mature' || r.maturityBand === 'institutional',
  ).length;
  const avgMaturityScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.maturityScore, 0) / regional.length;

  const counts: Record<TransitionMaturityBand, number> = {
    nascent: 0,
    developing: 0,
    mature: 0,
    institutional: 0,
  };
  for (const r of regional) counts[r.maturityBand] += 1;

  let dominantBand: TransitionMaturityBand = 'nascent';
  let max = -1;
  for (const b of [...MAT_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalMaturityPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.maturityBand === 'institutional'
              ? 1
              : r.maturityBand === 'mature'
                ? 0.56
                : r.maturityBand === 'developing'
                  ? 0.24
                  : 0.03;
          return acc + w * r.maturityScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    institutionalCount,
    matureCount,
    avgMaturityScore: Math.round(avgMaturityScore * 1000) / 1000,
    regionalMaturityPressure: Math.round(regionalMaturityPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalMaturityBand(
  pressure: number,
  firmsInstitutional: number,
  nationalEquilibriumBand: TransitionEquilibriumBand,
): TransitionMaturityBand {
  if (firmsInstitutional >= 2 || nationalEquilibriumBand === 'steady' || pressure > 0.92) return 'institutional';
  if (firmsInstitutional >= 1 || nationalEquilibriumBand === 'equilibrated' || pressure > 0.72) return 'mature';
  if (nationalEquilibriumBand === 'balancing' || pressure > 0.5) return 'developing';
  return 'nascent';
}

export function computeNationalMaturityPressure(rows: FirmProductionTransitionMaturity[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.maturityBand === 'institutional'
        ? 1
        : r.maturityBand === 'mature'
          ? 0.5
          : r.maturityBand === 'developing'
            ? 0.18
            : 0.02;
    return acc + bandW * 0.4 + r.maturityScore * 0.6;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionMaturity(params: {
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
}): NationalProductionTransitionMaturity {
  const equilibrium =
    params.equilibrium ??
    computeNationalProductionTransitionEquilibrium({
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
    });

  const firmMaturities = equilibrium.firmEquilibria
    .map(buildFirmProductionTransitionMaturity)
    .sort((a, b) => b.maturityRank - a.maturityRank);

  const regionIds = [...new Set(firmMaturities.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionMaturity(rid, firmMaturities));

  const nationalMaturityPressure = computeNationalMaturityPressure(firmMaturities);
  const firmsInstitutional = firmMaturities.filter(r => r.maturityBand === 'institutional').length;
  const nationalMaturityBand = classifyNationalMaturityBand(
    nationalMaturityPressure,
    firmsInstitutional,
    equilibrium.nationalEquilibriumBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_MATURITY_SCHEMA_VERSION,
    turn: params.turn,
    equilibriumTurn: equilibrium.turn,
    nationalMaturityPressure,
    nationalMaturityBand,
    firmsInstitutional,
    firmMaturities,
    regions,
  };
}

export function runAgent08TransitionMaturitySelfTests(): Array<{
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

  check('a08_maturity_01', () => {
    const row = buildFirmProductionTransitionMaturity({
      companyId: 'f1',
      regionId: 'NSW',
      equilibriumBand: 'steady',
      resilienceBand: 'hardened',
      equilibriumLever: 'relieve_upstream',
      turnsToSteadyState: 1,
      equilibriumScore: 0.99,
      equilibriumRank: 1850,
      equilibriumSummary: 's',
    });
    return row.maturityBand === 'institutional' && row.matureLever === 'relieve_upstream';
  });

  check('a08_maturity_02', () => {
    const row = buildFirmProductionTransitionMaturity({
      companyId: 'f2',
      regionId: 'VIC',
      equilibriumBand: 'volatile',
      resilienceBand: 'exposed',
      equilibriumLever: 'sector_rebalance',
      turnsToSteadyState: 44,
      equilibriumScore: 0.09,
      equilibriumRank: 140,
      equilibriumSummary: 's',
    });
    return row.maturityBand === 'nascent';
  });

  check('a08_maturity_03', () => {
    const summary = summarizeRegionalTransitionMaturity('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        maturityBand: 'institutional',
        equilibriumBand: 'steady',
        matureLever: 'capacity_buffer',
        turnsToInstitutional: 1,
        maturityScore: 0.97,
        maturityRank: 1900,
        maturitySummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        maturityBand: 'nascent',
        equilibriumBand: 'volatile',
        matureLever: 'sector_rebalance',
        turnsToInstitutional: 48,
        maturityScore: 0.08,
        maturityRank: 170,
        maturitySummary: 's',
      },
    ]);
    return summary.institutionalCount === 1 && summary.dominantBand === 'institutional';
  });

  check('a08_maturity_04', () => {
    const band = classifyNationalMaturityBand(0.76, 1, 'equilibrated');
    return band === 'mature';
  });

  check('a08_maturity_05', () => {
    const maturity = computeNationalProductionTransitionMaturity({
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
      maturity.schemaVersion === AGENT08_TRANSITION_MATURITY_SCHEMA_VERSION &&
      maturity.firmMaturities.length >= 1 &&
      maturity.nationalMaturityPressure >= 0 &&
      maturity.nationalMaturityPressure <= 1
    );
  });

  return results;
}
