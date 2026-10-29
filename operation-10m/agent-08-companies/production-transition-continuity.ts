/**
 * Agent 08 round 25 — transition continuity posture from maturity bands.
 * Non-authoritative planning layer (continuity bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionMaturity,
  type FirmProductionTransitionMaturity,
  type NationalProductionTransitionMaturity,
  type TransitionMaturityBand,
} from './production-transition-maturity';

export const AGENT08_TRANSITION_CONTINUITY_SCHEMA_VERSION = '1.0.0';

export type TransitionContinuityBand = 'ephemeral' | 'persisting' | 'enduring' | 'canonical';

export interface FirmProductionTransitionContinuity {
  companyId: string;
  regionId: string;
  continuityBand: TransitionContinuityBand;
  maturityBand: TransitionMaturityBand;
  continuousLever: ProductionRecoveryLever;
  turnsToCanonical: number;
  continuityScore: number;
  continuityRank: number;
  continuitySummary: string;
}

export interface RegionalTransitionContinuitySummary {
  regionId: string;
  firmCount: number;
  canonicalCount: number;
  enduringCount: number;
  avgContinuityScore: number;
  regionalContinuityPressure: number;
  dominantBand: TransitionContinuityBand;
}

export interface NationalProductionTransitionContinuity {
  schemaVersion: typeof AGENT08_TRANSITION_CONTINUITY_SCHEMA_VERSION;
  turn: number;
  maturityTurn: number;
  nationalContinuityPressure: number;
  nationalContinuityBand: TransitionContinuityBand;
  firmsCanonical: number;
  firmContinuities: FirmProductionTransitionContinuity[];
  regions: RegionalTransitionContinuitySummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const CON_BAND_ORDER: TransitionContinuityBand[] = ['ephemeral', 'persisting', 'enduring', 'canonical'];

function continuityBandFromMaturity(maturity: FirmProductionTransitionMaturity): TransitionContinuityBand {
  switch (maturity.maturityBand) {
    case 'institutional':
      return 'canonical';
    case 'mature':
      return 'enduring';
    case 'developing':
      return 'persisting';
    default:
      return 'ephemeral';
  }
}

function continuityScoreFromSignals(
  band: TransitionContinuityBand,
  maturity: FirmProductionTransitionMaturity,
): number {
  const bandBase =
    band === 'canonical' ? 0.996 : band === 'enduring' ? 0.79 : band === 'persisting' ? 0.51 : 0.07;
  const maturityAdj = maturity.maturityScore * 0.085;
  const urgencyAdj =
    maturity.maturityBand === 'institutional'
      ? 0.036
      : maturity.maturityBand === 'mature'
        ? 0.02
        : maturity.maturityBand === 'developing'
          ? 0.008
          : 0;
  return clamp(Math.round((bandBase + maturityAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionContinuity(
  maturity: FirmProductionTransitionMaturity,
): FirmProductionTransitionContinuity {
  const continuityBand = continuityBandFromMaturity(maturity);
  const continuityScore = continuityScoreFromSignals(continuityBand, maturity);
  const rankBase =
    continuityBand === 'canonical'
      ? 2100
      : continuityBand === 'enduring'
        ? 1340
        : continuityBand === 'persisting'
          ? 760
          : 190;
  const continuityRank = Math.round(
    rankBase + maturity.maturityRank * 0.14 + continuityScore * 74,
  );

  const leverLabel = maturity.matureLever.replace(/_/g, ' ');
  const continuitySummary =
    continuityBand === 'canonical'
      ? `canonical ${leverLabel} continuity after ${maturity.turnsToInstitutional} institutional turns`
      : continuityBand === 'enduring'
        ? `enduring ${leverLabel} from ${maturity.maturityBand} maturity`
        : continuityBand === 'persisting'
          ? `persisting ${leverLabel} practice while developing`
          : `ephemeral — ${maturity.maturitySummary}`;

  const turnsToCanonical =
    continuityBand === 'canonical'
      ? Math.max(1, Math.min(maturity.turnsToInstitutional, 1))
      : continuityBand === 'enduring'
        ? Math.max(1, maturity.turnsToInstitutional + 1)
        : continuityBand === 'persisting'
          ? maturity.turnsToInstitutional + 5
          : maturity.turnsToInstitutional + 12;

  return {
    companyId: maturity.companyId,
    regionId: maturity.regionId,
    continuityBand,
    maturityBand: maturity.maturityBand,
    continuousLever: maturity.matureLever,
    turnsToCanonical,
    continuityScore,
    continuityRank,
    continuitySummary,
  };
}

export function summarizeRegionalTransitionContinuity(
  regionId: string,
  rows: FirmProductionTransitionContinuity[],
): RegionalTransitionContinuitySummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const canonicalCount = regional.filter(r => r.continuityBand === 'canonical').length;
  const enduringCount = regional.filter(
    r => r.continuityBand === 'enduring' || r.continuityBand === 'canonical',
  ).length;
  const avgContinuityScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.continuityScore, 0) / regional.length;

  const counts: Record<TransitionContinuityBand, number> = {
    ephemeral: 0,
    persisting: 0,
    enduring: 0,
    canonical: 0,
  };
  for (const r of regional) counts[r.continuityBand] += 1;

  let dominantBand: TransitionContinuityBand = 'ephemeral';
  let max = -1;
  for (const b of [...CON_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalContinuityPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.continuityBand === 'canonical'
              ? 1
              : r.continuityBand === 'enduring'
                ? 0.54
                : r.continuityBand === 'persisting'
                  ? 0.22
                  : 0.025;
          return acc + w * r.continuityScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    canonicalCount,
    enduringCount,
    avgContinuityScore: Math.round(avgContinuityScore * 1000) / 1000,
    regionalContinuityPressure: Math.round(regionalContinuityPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalContinuityBand(
  pressure: number,
  firmsCanonical: number,
  nationalMaturityBand: TransitionMaturityBand,
): TransitionContinuityBand {
  if (firmsCanonical >= 2 || nationalMaturityBand === 'institutional' || pressure > 0.93) return 'canonical';
  if (firmsCanonical >= 1 || nationalMaturityBand === 'mature' || pressure > 0.74) return 'enduring';
  if (nationalMaturityBand === 'developing' || pressure > 0.52) return 'persisting';
  return 'ephemeral';
}

export function computeNationalContinuityPressure(rows: FirmProductionTransitionContinuity[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.continuityBand === 'canonical'
        ? 1
        : r.continuityBand === 'enduring'
          ? 0.48
          : r.continuityBand === 'persisting'
            ? 0.16
            : 0.015;
    return acc + bandW * 0.38 + r.continuityScore * 0.62;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionContinuity(params: {
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
}): NationalProductionTransitionContinuity {
  const maturity =
    params.maturity ??
    computeNationalProductionTransitionMaturity({
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
    });

  const firmContinuities = maturity.firmMaturities
    .map(buildFirmProductionTransitionContinuity)
    .sort((a, b) => b.continuityRank - a.continuityRank);

  const regionIds = [...new Set(firmContinuities.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionContinuity(rid, firmContinuities));

  const nationalContinuityPressure = computeNationalContinuityPressure(firmContinuities);
  const firmsCanonical = firmContinuities.filter(r => r.continuityBand === 'canonical').length;
  const nationalContinuityBand = classifyNationalContinuityBand(
    nationalContinuityPressure,
    firmsCanonical,
    maturity.nationalMaturityBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_CONTINUITY_SCHEMA_VERSION,
    turn: params.turn,
    maturityTurn: maturity.turn,
    nationalContinuityPressure,
    nationalContinuityBand,
    firmsCanonical,
    firmContinuities,
    regions,
  };
}

export function runAgent08TransitionContinuitySelfTests(): Array<{
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

  check('a08_continuity_01', () => {
    const row = buildFirmProductionTransitionContinuity({
      companyId: 'f1',
      regionId: 'NSW',
      maturityBand: 'institutional',
      equilibriumBand: 'steady',
      matureLever: 'relieve_upstream',
      turnsToInstitutional: 1,
      maturityScore: 0.995,
      maturityRank: 1950,
      maturitySummary: 's',
    });
    return row.continuityBand === 'canonical' && row.continuousLever === 'relieve_upstream';
  });

  check('a08_continuity_02', () => {
    const row = buildFirmProductionTransitionContinuity({
      companyId: 'f2',
      regionId: 'VIC',
      maturityBand: 'nascent',
      equilibriumBand: 'volatile',
      matureLever: 'sector_rebalance',
      turnsToInstitutional: 50,
      maturityScore: 0.07,
      maturityRank: 150,
      maturitySummary: 's',
    });
    return row.continuityBand === 'ephemeral';
  });

  check('a08_continuity_03', () => {
    const summary = summarizeRegionalTransitionContinuity('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        continuityBand: 'canonical',
        maturityBand: 'institutional',
        continuousLever: 'capacity_buffer',
        turnsToCanonical: 1,
        continuityScore: 0.98,
        continuityRank: 2000,
        continuitySummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        continuityBand: 'ephemeral',
        maturityBand: 'nascent',
        continuousLever: 'sector_rebalance',
        turnsToCanonical: 54,
        continuityScore: 0.06,
        continuityRank: 180,
        continuitySummary: 's',
      },
    ]);
    return summary.canonicalCount === 1 && summary.dominantBand === 'canonical';
  });

  check('a08_continuity_04', () => {
    const band = classifyNationalContinuityBand(0.78, 1, 'mature');
    return band === 'enduring';
  });

  check('a08_continuity_05', () => {
    const continuity = computeNationalProductionTransitionContinuity({
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
      continuity.schemaVersion === AGENT08_TRANSITION_CONTINUITY_SCHEMA_VERSION &&
      continuity.firmContinuities.length >= 1 &&
      continuity.nationalContinuityPressure >= 0 &&
      continuity.nationalContinuityPressure <= 1
    );
  });

  return results;
}
