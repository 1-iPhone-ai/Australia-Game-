/**
 * Agent 08 round 32 (O10-195) — transition trust posture from assurance bands.
 * Non-authoritative planning layer (trust bands, not ledger enforcement).
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
import type { NationalProductionTransitionContinuity } from './production-transition-continuity';
import type { NationalProductionTransitionHeritage } from './production-transition-heritage';
import type { NationalProductionTransitionCodification } from './production-transition-codification';
import type { NationalProductionTransitionStewardship } from './production-transition-stewardship';
import type { NationalProductionTransitionGovernance } from './production-transition-governance';
import type { NationalProductionTransitionAccountability } from './production-transition-accountability';
import {
  computeNationalProductionTransitionAssurance,
  type FirmProductionTransitionAssurance,
  type NationalProductionTransitionAssurance,
  type TransitionAssuranceBand,
} from './production-transition-assurance';

export const AGENT08_TRANSITION_TRUST_SCHEMA_VERSION = '1.0.0';

export type TransitionTrustBand = 'doubtful' | 'building' | 'trusted' | 'bonded';

export interface FirmProductionTransitionTrust {
  companyId: string;
  regionId: string;
  trustBand: TransitionTrustBand;
  assuranceBand: TransitionAssuranceBand;
  trustedLever: ProductionRecoveryLever;
  turnsToBond: number;
  trustScore: number;
  trustRank: number;
  trustSummary: string;
}

export interface RegionalTransitionTrustSummary {
  regionId: string;
  firmCount: number;
  bondedCount: number;
  trustedCount: number;
  avgTrustScore: number;
  regionalTrustPressure: number;
  dominantBand: TransitionTrustBand;
}

export interface NationalProductionTransitionTrust {
  schemaVersion: typeof AGENT08_TRANSITION_TRUST_SCHEMA_VERSION;
  turn: number;
  assuranceTurn: number;
  nationalTrustPressure: number;
  nationalTrustBand: TransitionTrustBand;
  firmsBonded: number;
  firmTrusts: FirmProductionTransitionTrust[];
  regions: RegionalTransitionTrustSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const TRU_BAND_ORDER: TransitionTrustBand[] = ['doubtful', 'building', 'trusted', 'bonded'];

function trustBandFromAssurance(assurance: FirmProductionTransitionAssurance): TransitionTrustBand {
  switch (assurance.assuranceBand) {
    case 'certified':
      return 'bonded';
    case 'assured':
      return 'trusted';
    case 'monitoring':
      return 'building';
    default:
      return 'doubtful';
  }
}

function trustScoreFromSignals(
  band: TransitionTrustBand,
  assurance: FirmProductionTransitionAssurance,
): number {
  const bandBase =
    band === 'bonded' ? 0.999 : band === 'trusted' ? 0.86 : band === 'building' ? 0.58 : 0.012;
  const assuranceAdj = assurance.assuranceScore * 0.05;
  const urgencyAdj =
    assurance.assuranceBand === 'certified'
      ? 0.022
      : assurance.assuranceBand === 'assured'
        ? 0.008
        : assurance.assuranceBand === 'monitoring'
          ? 0.002
          : 0;
  return clamp(Math.round((bandBase + assuranceAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionTrust(
  assurance: FirmProductionTransitionAssurance,
): FirmProductionTransitionTrust {
  const trustBand = trustBandFromAssurance(assurance);
  const trustScore = trustScoreFromSignals(trustBand, assurance);
  const rankBase =
    trustBand === 'bonded'
      ? 2800
      : trustBand === 'trusted'
        ? 1800
        : trustBand === 'building'
          ? 1040
          : 260;
  const trustRank = Math.round(rankBase + assurance.assuranceRank * 0.06 + trustScore * 60);

  const leverLabel = assurance.assuredLever.replace(/_/g, ' ');
  const trustSummary =
    trustBand === 'bonded'
      ? `bonded ${leverLabel} trust after ${assurance.turnsToCertify} certified turns`
      : trustBand === 'trusted'
        ? `trusted ${leverLabel} from ${assurance.assuranceBand} assurance`
        : trustBand === 'building'
          ? `building ${leverLabel} confidence while monitoring`
          : `doubtful — ${assurance.assuranceSummary}`;

  const turnsToBond =
    trustBand === 'bonded'
      ? Math.max(1, Math.min(assurance.turnsToCertify, 1))
      : trustBand === 'trusted'
        ? Math.max(1, assurance.turnsToCertify + 1)
        : trustBand === 'building'
          ? assurance.turnsToCertify + 6
          : assurance.turnsToCertify + 19;

  return {
    companyId: assurance.companyId,
    regionId: assurance.regionId,
    trustBand,
    assuranceBand: assurance.assuranceBand,
    trustedLever: assurance.assuredLever,
    turnsToBond,
    trustScore,
    trustRank,
    trustSummary,
  };
}

export function summarizeRegionalTransitionTrust(
  regionId: string,
  rows: FirmProductionTransitionTrust[],
): RegionalTransitionTrustSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const bondedCount = regional.filter(r => r.trustBand === 'bonded').length;
  const trustedCount = regional.filter(
    r => r.trustBand === 'trusted' || r.trustBand === 'bonded',
  ).length;
  const avgTrustScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.trustScore, 0) / regional.length;

  const counts: Record<TransitionTrustBand, number> = {
    doubtful: 0,
    building: 0,
    trusted: 0,
    bonded: 0,
  };
  for (const r of regional) counts[r.trustBand] += 1;

  let dominantBand: TransitionTrustBand = 'doubtful';
  let max = -1;
  for (const b of [...TRU_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalTrustPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.trustBand === 'bonded'
              ? 1
              : r.trustBand === 'trusted'
                ? 0.4
                : r.trustBand === 'building'
                  ? 0.08
                  : 0.003;
          return acc + w * r.trustScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    bondedCount,
    trustedCount,
    avgTrustScore: Math.round(avgTrustScore * 1000) / 1000,
    regionalTrustPressure: Math.round(regionalTrustPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalTrustBand(
  pressure: number,
  firmsBonded: number,
  nationalAssuranceBand: TransitionAssuranceBand,
): TransitionTrustBand {
  if (firmsBonded >= 2 || nationalAssuranceBand === 'certified' || pressure > 0.995) return 'bonded';
  if (firmsBonded >= 1 || nationalAssuranceBand === 'assured' || pressure > 0.88) return 'trusted';
  if (nationalAssuranceBand === 'monitoring' || pressure > 0.66) return 'building';
  return 'doubtful';
}

export function computeNationalTrustPressure(rows: FirmProductionTransitionTrust[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.trustBand === 'bonded'
        ? 1
        : r.trustBand === 'trusted'
          ? 0.34
          : r.trustBand === 'building'
            ? 0.04
            : 0.0008;
    return acc + bandW * 0.24 + r.trustScore * 0.76;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionTrust(params: {
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
  heritage?: NationalProductionTransitionHeritage;
  codification?: NationalProductionTransitionCodification;
  stewardship?: NationalProductionTransitionStewardship;
  governance?: NationalProductionTransitionGovernance;
  accountability?: NationalProductionTransitionAccountability;
  assurance?: NationalProductionTransitionAssurance;
}): NationalProductionTransitionTrust {
  const assurance =
    params.assurance ??
    computeNationalProductionTransitionAssurance({
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
      continuity: params.continuity,
      heritage: params.heritage,
      codification: params.codification,
      stewardship: params.stewardship,
      governance: params.governance,
      accountability: params.accountability,
    });

  const firmTrusts = assurance.firmAssurances
    .map(buildFirmProductionTransitionTrust)
    .sort((a, b) => b.trustRank - a.trustRank);

  const regionIds = [...new Set(firmTrusts.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionTrust(rid, firmTrusts));

  const nationalTrustPressure = computeNationalTrustPressure(firmTrusts);
  const firmsBonded = firmTrusts.filter(r => r.trustBand === 'bonded').length;
  const nationalTrustBand = classifyNationalTrustBand(
    nationalTrustPressure,
    firmsBonded,
    assurance.nationalAssuranceBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_TRUST_SCHEMA_VERSION,
    turn: params.turn,
    assuranceTurn: assurance.turn,
    nationalTrustPressure,
    nationalTrustBand,
    firmsBonded,
    firmTrusts,
    regions,
  };
}

export function runAgent08TransitionTrustSelfTests(): Array<{
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

  check('a08_trust_01', () => {
    const row = buildFirmProductionTransitionTrust({
      companyId: 'f1',
      regionId: 'NSW',
      assuranceBand: 'certified',
      accountabilityBand: 'attested',
      assuredLever: 'relieve_upstream',
      turnsToCertify: 1,
      assuranceScore: 0.999,
      assuranceRank: 2650,
      assuranceSummary: 's',
    });
    return row.trustBand === 'bonded' && row.trustedLever === 'relieve_upstream';
  });

  check('a08_trust_02', () => {
    const row = buildFirmProductionTransitionTrust({
      companyId: 'f2',
      regionId: 'VIC',
      assuranceBand: 'unverified',
      accountabilityBand: 'opaque',
      assuredLever: 'sector_rebalance',
      turnsToCertify: 92,
      assuranceScore: 0.006,
      assuranceRank: 220,
      assuranceSummary: 's',
    });
    return row.trustBand === 'doubtful';
  });

  check('a08_trust_03', () => {
    const summary = summarizeRegionalTransitionTrust('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        trustBand: 'bonded',
        assuranceBand: 'certified',
        trustedLever: 'capacity_buffer',
        turnsToBond: 1,
        trustScore: 0.998,
        trustRank: 2700,
        trustSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        trustBand: 'doubtful',
        assuranceBand: 'unverified',
        trustedLever: 'sector_rebalance',
        turnsToBond: 96,
        trustScore: 0.006,
        trustRank: 250,
        trustSummary: 's',
      },
    ]);
    return summary.bondedCount === 1 && summary.dominantBand === 'bonded';
  });

  check('a08_trust_04', () => {
    const band = classifyNationalTrustBand(0.92, 1, 'assured');
    return band === 'trusted';
  });

  check('a08_trust_05', () => {
    const trust = computeNationalProductionTransitionTrust({
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
      trust.schemaVersion === AGENT08_TRANSITION_TRUST_SCHEMA_VERSION &&
      trust.firmTrusts.length >= 1 &&
      trust.nationalTrustPressure >= 0 &&
      trust.nationalTrustPressure <= 1
    );
  });

  return results;
}
