/**
 * Agent 08 round 33 (O10-197) — transition legitimacy posture from trust bands.
 * Non-authoritative planning layer (legitimacy bands, not ledger enforcement).
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
import type { NationalProductionTransitionAssurance } from './production-transition-assurance';
import {
  computeNationalProductionTransitionTrust,
  type FirmProductionTransitionTrust,
  type NationalProductionTransitionTrust,
  type TransitionTrustBand,
} from './production-transition-trust';

export const AGENT08_TRANSITION_LEGITIMACY_SCHEMA_VERSION = '1.0.0';

export type TransitionLegitimacyBand = 'contested' | 'emerging' | 'legitimate' | 'institutional';

export interface FirmProductionTransitionLegitimacy {
  companyId: string;
  regionId: string;
  legitimacyBand: TransitionLegitimacyBand;
  trustBand: TransitionTrustBand;
  legitimateLever: ProductionRecoveryLever;
  turnsToInstitutional: number;
  legitimacyScore: number;
  legitimacyRank: number;
  legitimacySummary: string;
}

export interface RegionalTransitionLegitimacySummary {
  regionId: string;
  firmCount: number;
  institutionalCount: number;
  legitimateCount: number;
  avgLegitimacyScore: number;
  regionalLegitimacyPressure: number;
  dominantBand: TransitionLegitimacyBand;
}

export interface NationalProductionTransitionLegitimacy {
  schemaVersion: typeof AGENT08_TRANSITION_LEGITIMACY_SCHEMA_VERSION;
  turn: number;
  trustTurn: number;
  nationalLegitimacyPressure: number;
  nationalLegitimacyBand: TransitionLegitimacyBand;
  firmsInstitutional: number;
  firmLegitimacies: FirmProductionTransitionLegitimacy[];
  regions: RegionalTransitionLegitimacySummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const LEG_BAND_ORDER: TransitionLegitimacyBand[] = ['contested', 'emerging', 'legitimate', 'institutional'];

function legitimacyBandFromTrust(trust: FirmProductionTransitionTrust): TransitionLegitimacyBand {
  switch (trust.trustBand) {
    case 'bonded':
      return 'institutional';
    case 'trusted':
      return 'legitimate';
    case 'building':
      return 'emerging';
    default:
      return 'contested';
  }
}

function legitimacyScoreFromSignals(
  band: TransitionLegitimacyBand,
  trust: FirmProductionTransitionTrust,
): number {
  const bandBase =
    band === 'institutional'
      ? 0.999
      : band === 'legitimate'
        ? 0.87
        : band === 'emerging'
          ? 0.59
          : 0.011;
  const trustAdj = trust.trustScore * 0.048;
  const urgencyAdj =
    trust.trustBand === 'bonded'
      ? 0.021
      : trust.trustBand === 'trusted'
        ? 0.007
        : trust.trustBand === 'building'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + trustAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionLegitimacy(
  trust: FirmProductionTransitionTrust,
): FirmProductionTransitionLegitimacy {
  const legitimacyBand = legitimacyBandFromTrust(trust);
  const legitimacyScore = legitimacyScoreFromSignals(legitimacyBand, trust);
  const rankBase =
    legitimacyBand === 'institutional'
      ? 2900
      : legitimacyBand === 'legitimate'
        ? 1880
        : legitimacyBand === 'emerging'
          ? 1060
          : 240;
  const legitimacyRank = Math.round(rankBase + trust.trustRank * 0.055 + legitimacyScore * 58);

  const leverLabel = trust.trustedLever.replace(/_/g, ' ');
  const legitimacySummary =
    legitimacyBand === 'institutional'
      ? `institutional ${leverLabel} legitimacy after ${trust.turnsToBond} bonded turns`
      : legitimacyBand === 'legitimate'
        ? `legitimate ${leverLabel} from ${trust.trustBand} trust`
        : legitimacyBand === 'emerging'
          ? `emerging ${leverLabel} standing while building trust`
          : `contested — ${trust.trustSummary}`;

  const turnsToInstitutional =
    legitimacyBand === 'institutional'
      ? Math.max(1, Math.min(trust.turnsToBond, 1))
      : legitimacyBand === 'legitimate'
        ? Math.max(1, trust.turnsToBond + 1)
        : legitimacyBand === 'emerging'
          ? trust.turnsToBond + 5
          : trust.turnsToBond + 17;

  return {
    companyId: trust.companyId,
    regionId: trust.regionId,
    legitimacyBand,
    trustBand: trust.trustBand,
    legitimateLever: trust.trustedLever,
    turnsToInstitutional,
    legitimacyScore,
    legitimacyRank,
    legitimacySummary,
  };
}

export function summarizeRegionalTransitionLegitimacy(
  regionId: string,
  rows: FirmProductionTransitionLegitimacy[],
): RegionalTransitionLegitimacySummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const institutionalCount = regional.filter(r => r.legitimacyBand === 'institutional').length;
  const legitimateCount = regional.filter(
    r => r.legitimacyBand === 'legitimate' || r.legitimacyBand === 'institutional',
  ).length;
  const avgLegitimacyScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.legitimacyScore, 0) / regional.length;

  const counts: Record<TransitionLegitimacyBand, number> = {
    contested: 0,
    emerging: 0,
    legitimate: 0,
    institutional: 0,
  };
  for (const r of regional) counts[r.legitimacyBand] += 1;

  let dominantBand: TransitionLegitimacyBand = 'contested';
  let max = -1;
  for (const b of [...LEG_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalLegitimacyPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.legitimacyBand === 'institutional'
              ? 1
              : r.legitimacyBand === 'legitimate'
                ? 0.38
                : r.legitimacyBand === 'emerging'
                  ? 0.07
                  : 0.002;
          return acc + w * r.legitimacyScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    institutionalCount,
    legitimateCount,
    avgLegitimacyScore: Math.round(avgLegitimacyScore * 1000) / 1000,
    regionalLegitimacyPressure: Math.round(regionalLegitimacyPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalLegitimacyBand(
  pressure: number,
  firmsInstitutional: number,
  nationalTrustBand: TransitionTrustBand,
): TransitionLegitimacyBand {
  if (firmsInstitutional >= 2 || nationalTrustBand === 'bonded' || pressure > 0.996) return 'institutional';
  if (firmsInstitutional >= 1 || nationalTrustBand === 'trusted' || pressure > 0.89) return 'legitimate';
  if (nationalTrustBand === 'building' || pressure > 0.67) return 'emerging';
  return 'contested';
}

export function computeNationalLegitimacyPressure(rows: FirmProductionTransitionLegitimacy[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.legitimacyBand === 'institutional'
        ? 1
        : r.legitimacyBand === 'legitimate'
          ? 0.33
          : r.legitimacyBand === 'emerging'
            ? 0.035
            : 0.0007;
    return acc + bandW * 0.23 + r.legitimacyScore * 0.77;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionLegitimacy(params: {
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
  trust?: NationalProductionTransitionTrust;
}): NationalProductionTransitionLegitimacy {
  const trust =
    params.trust ??
    computeNationalProductionTransitionTrust({
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
      assurance: params.assurance,
    });

  const firmLegitimacies = trust.firmTrusts
    .map(buildFirmProductionTransitionLegitimacy)
    .sort((a, b) => b.legitimacyRank - a.legitimacyRank);

  const regionIds = [...new Set(firmLegitimacies.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionLegitimacy(rid, firmLegitimacies));

  const nationalLegitimacyPressure = computeNationalLegitimacyPressure(firmLegitimacies);
  const firmsInstitutional = firmLegitimacies.filter(r => r.legitimacyBand === 'institutional').length;
  const nationalLegitimacyBand = classifyNationalLegitimacyBand(
    nationalLegitimacyPressure,
    firmsInstitutional,
    trust.nationalTrustBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_LEGITIMACY_SCHEMA_VERSION,
    turn: params.turn,
    trustTurn: trust.turn,
    nationalLegitimacyPressure,
    nationalLegitimacyBand,
    firmsInstitutional,
    firmLegitimacies,
    regions,
  };
}

export function runAgent08TransitionLegitimacySelfTests(): Array<{
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

  check('a08_legitimacy_01', () => {
    const row = buildFirmProductionTransitionLegitimacy({
      companyId: 'f1',
      regionId: 'NSW',
      trustBand: 'bonded',
      assuranceBand: 'certified',
      trustedLever: 'relieve_upstream',
      turnsToBond: 1,
      trustScore: 0.999,
      trustRank: 2750,
      trustSummary: 's',
    });
    return row.legitimacyBand === 'institutional' && row.legitimateLever === 'relieve_upstream';
  });

  check('a08_legitimacy_02', () => {
    const row = buildFirmProductionTransitionLegitimacy({
      companyId: 'f2',
      regionId: 'VIC',
      trustBand: 'doubtful',
      assuranceBand: 'unverified',
      trustedLever: 'sector_rebalance',
      turnsToBond: 94,
      trustScore: 0.005,
      trustRank: 210,
      trustSummary: 's',
    });
    return row.legitimacyBand === 'contested';
  });

  check('a08_legitimacy_03', () => {
    const summary = summarizeRegionalTransitionLegitimacy('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        legitimacyBand: 'institutional',
        trustBand: 'bonded',
        legitimateLever: 'capacity_buffer',
        turnsToInstitutional: 1,
        legitimacyScore: 0.998,
        legitimacyRank: 2800,
        legitimacySummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        legitimacyBand: 'contested',
        trustBand: 'doubtful',
        legitimateLever: 'sector_rebalance',
        turnsToInstitutional: 98,
        legitimacyScore: 0.005,
        legitimacyRank: 230,
        legitimacySummary: 's',
      },
    ]);
    return summary.institutionalCount === 1 && summary.dominantBand === 'institutional';
  });

  check('a08_legitimacy_04', () => {
    const band = classifyNationalLegitimacyBand(0.93, 1, 'trusted');
    return band === 'legitimate';
  });

  check('a08_legitimacy_05', () => {
    const legitimacy = computeNationalProductionTransitionLegitimacy({
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
      legitimacy.schemaVersion === AGENT08_TRANSITION_LEGITIMACY_SCHEMA_VERSION &&
      legitimacy.firmLegitimacies.length >= 1 &&
      legitimacy.nationalLegitimacyPressure >= 0 &&
      legitimacy.nationalLegitimacyPressure <= 1
    );
  });

  return results;
}
