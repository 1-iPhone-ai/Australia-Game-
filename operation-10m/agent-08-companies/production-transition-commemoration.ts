/**
 * Agent 08 round 46 (O10-223) — transition commemoration posture from remembrance bands.
 * Non-authoritative planning layer (commemoration bands, not ledger enforcement).
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
import type { NationalProductionTransitionTrust } from './production-transition-trust';
import type { NationalProductionTransitionLegitimacy } from './production-transition-legitimacy';
import type { NationalProductionTransitionRecognition } from './production-transition-recognition';
import type { NationalProductionTransitionPrecedence } from './production-transition-precedence';
import type { NationalProductionTransitionRatification } from './production-transition-ratification';
import type { NationalProductionTransitionConfirmation } from './production-transition-confirmation';
import type { NationalProductionTransitionFinalization } from './production-transition-finalization';
import type { NationalProductionTransitionClosure } from './production-transition-closure';
import type { NationalProductionTransitionCompletion } from './production-transition-completion';
import type { NationalProductionTransitionResolution } from './production-transition-resolution';
import type { NationalProductionTransitionSettlement } from './production-transition-settlement';
import type { NationalProductionTransitionRetirement } from './production-transition-retirement';
import type { NationalProductionTransitionLegacy } from './production-transition-legacy';
import {
  computeNationalProductionTransitionRemembrance,
  type FirmProductionTransitionRemembrance,
  type NationalProductionTransitionRemembrance,
  type TransitionRemembranceBand,
} from './production-transition-remembrance';

export const AGENT08_TRANSITION_COMMEMORATION_SCHEMA_VERSION = '1.0.0';

export type TransitionCommemorationBand = 'private' | 'observed' | 'commemorated' | 'sanctified';

export interface FirmProductionTransitionCommemoration {
  companyId: string;
  regionId: string;
  commemorationBand: TransitionCommemorationBand;
  remembranceBand: TransitionRemembranceBand;
  commemoratedLever: ProductionRecoveryLever;
  turnsToSanctified: number;
  commemorationScore: number;
  commemorationRank: number;
  commemorationSummary: string;
}

export interface RegionalTransitionCommemorationSummary {
  regionId: string;
  firmCount: number;
  sanctifiedCount: number;
  commemoratedCount: number;
  avgCommemorationScore: number;
  regionalCommemorationPressure: number;
  dominantBand: TransitionCommemorationBand;
}

export interface NationalProductionTransitionCommemoration {
  schemaVersion: typeof AGENT08_TRANSITION_COMMEMORATION_SCHEMA_VERSION;
  turn: number;
  remembranceTurn: number;
  nationalCommemorationPressure: number;
  nationalCommemorationBand: TransitionCommemorationBand;
  firmsSanctified: number;
  firmCommemorations: FirmProductionTransitionCommemoration[];
  regions: RegionalTransitionCommemorationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const COMM_BAND_ORDER: TransitionCommemorationBand[] = ['private', 'observed', 'commemorated', 'sanctified'];

function commemorationBandFromRemembrance(
  remembrance: FirmProductionTransitionRemembrance,
): TransitionCommemorationBand {
  switch (remembrance.remembranceBand) {
    case 'eternal':
      return 'sanctified';
    case 'remembered':
      return 'commemorated';
    case 'gathering':
      return 'observed';
    default:
      return 'private';
  }
}

function commemorationScoreFromSignals(
  band: TransitionCommemorationBand,
  legacy: FirmProductionTransitionLegacy,
): number {
  const bandBase =
    band === 'eternal' ? 0.999 : band === 'remembered' ? 0.985 : band === 'gathering' ? 0.71 : 0.001;
  const legacyAdj = legacy.legacyScore * 0.024;
  const urgencyAdj =
    legacy.legacyBand === 'immortal'
      ? 0.009
      : legacy.legacyBand === 'legacy'
        ? 0.002
        : legacy.legacyBand === 'accruing'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + legacyAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionCommemoration(
  remembrance: FirmProductionTransitionRemembrance,
): FirmProductionTransitionCommemoration {
  const commemorationBand = commemorationBandFromRemembrance(remembrance);
  const commemorationScore = commemorationScoreFromSignals(commemorationBand, remembrance);
  const rankBase =
    commemorationBand === 'sanctified'
      ? 4200
      : commemorationBand === 'commemorated'
        ? 2900
        : commemorationBand === 'observed'
          ? 1350
          : 55;
  const commemorationRank = Math.round(
    rankBase + remembrance.remembranceRank * 0.028 + commemorationScore * 36,
  );

  const leverLabel = remembrance.rememberedLever.replace(/_/g, ' ');
  const commemorationSummary =
    commemorationBand === 'sanctified'
      ? `sanctified ${leverLabel} commemoration after ${remembrance.turnsToEternal} eternal turns`
      : commemorationBand === 'commemorated'
        ? `commemorated ${leverLabel} from ${remembrance.remembranceBand} remembrance`
        : commemorationBand === 'observed'
          ? `observed ${leverLabel} while remembrance gathers`
          : `private — ${remembrance.remembranceSummary}`;

  const turnsToSanctified =
    commemorationBand === 'sanctified'
      ? Math.max(1, Math.min(remembrance.turnsToEternal, 1))
      : commemorationBand === 'commemorated'
        ? Math.max(1, remembrance.turnsToEternal + 1)
        : commemorationBand === 'observed'
          ? remembrance.turnsToEternal + 2
          : remembrance.turnsToEternal + 5;

  return {
    companyId: remembrance.companyId,
    regionId: remembrance.regionId,
    commemorationBand,
    remembranceBand: remembrance.remembranceBand,
    commemoratedLever: remembrance.rememberedLever,
    turnsToSanctified,
    commemorationScore,
    commemorationRank,
    commemorationSummary,
  };
}

export function summarizeRegionalTransitionCommemoration(
  regionId: string,
  rows: FirmProductionTransitionCommemoration[],
): RegionalTransitionCommemorationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const sanctifiedCount = regional.filter(r => r.commemorationBand === 'sanctified').length;
  const commemoratedCount = regional.filter(
    r => r.commemorationBand === 'commemorated' || r.commemorationBand === 'sanctified',
  ).length;
  const avgCommemorationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.commemorationScore, 0) / regional.length;

  const counts: Record<TransitionCommemorationBand, number> = {
    private: 0,
    observed: 0,
    commemorated: 0,
    sanctified: 0,
  };
  for (const r of regional) counts[r.commemorationBand] += 1;

  let dominantBand: TransitionCommemorationBand = 'private';
  let max = -1;
  for (const b of [...COMM_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalCommemorationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.commemorationBand === 'sanctified'
              ? 1
              : r.commemorationBand === 'commemorated'
                ? 0.25
                : r.commemorationBand === 'observed'
                  ? 0.024
                  : 0.00006;
          return acc + w * r.commemorationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    sanctifiedCount,
    commemoratedCount,
    avgCommemorationScore: Math.round(avgCommemorationScore * 1000) / 1000,
    regionalCommemorationPressure: Math.round(regionalCommemorationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalCommemorationBand(
  pressure: number,
  firmsSanctified: number,
  nationalRemembranceBand: TransitionRemembranceBand,
): TransitionCommemorationBand {
  if (firmsSanctified >= 2 || nationalRemembranceBand === 'eternal' || pressure > 0.999999)
    return 'sanctified';
  if (firmsSanctified >= 1 || nationalRemembranceBand === 'remembered' || pressure > 0.992)
    return 'commemorated';
  if (nationalRemembranceBand === 'gathering' || pressure > 0.79) return 'observed';
  return 'private';
}

export function computeNationalCommemorationPressure(
  rows: FirmProductionTransitionCommemoration[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.commemorationBand === 'sanctified'
        ? 1
        : r.commemorationBand === 'commemorated'
          ? 0.22
          : r.commemorationBand === 'observed'
            ? 0.011
            : 0.000009;
    return acc + bandW * 0.11 + r.commemorationScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionCommemoration(params: {
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
  legitimacy?: NationalProductionTransitionLegitimacy;
  recognition?: NationalProductionTransitionRecognition;
  precedence?: NationalProductionTransitionPrecedence;
  ratification?: NationalProductionTransitionRatification;
  confirmation?: NationalProductionTransitionConfirmation;
  finalization?: NationalProductionTransitionFinalization;
  closure?: NationalProductionTransitionClosure;
  completion?: NationalProductionTransitionCompletion;
  resolution?: NationalProductionTransitionResolution;
  settlement?: NationalProductionTransitionSettlement;
  retirement?: NationalProductionTransitionRetirement;
  legacy?: NationalProductionTransitionLegacy;
  remembrance?: NationalProductionTransitionRemembrance;
}): NationalProductionTransitionCommemoration {
  const remembrance =
    params.remembrance ??
    computeNationalProductionTransitionRemembrance({
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
      trust: params.trust,
      legitimacy: params.legitimacy,
      recognition: params.recognition,
      precedence: params.precedence,
      ratification: params.ratification,
      confirmation: params.confirmation,
      finalization: params.finalization,
      closure: params.closure,
      completion: params.completion,
      resolution: params.resolution,
      settlement: params.settlement,
      retirement: params.retirement,
      legacy: params.legacy,
    });

  const firmCommemorations = remembrance.firmRemembrances
    .map(buildFirmProductionTransitionCommemoration)
    .sort((a, b) => b.commemorationRank - a.commemorationRank);

  const regionIds = [...new Set(firmCommemorations.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionCommemoration(rid, firmCommemorations));

  const nationalCommemorationPressure = computeNationalCommemorationPressure(firmCommemorations);
  const firmsSanctified = firmCommemorations.filter(r => r.commemorationBand === 'sanctified').length;
  const nationalCommemorationBand = classifyNationalCommemorationBand(
    nationalCommemorationPressure,
    firmsSanctified,
    remembrance.nationalRemembranceBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_COMMEMORATION_SCHEMA_VERSION,
    turn: params.turn,
    remembranceTurn: remembrance.turn,
    nationalCommemorationPressure,
    nationalCommemorationBand,
    firmsSanctified,
    firmCommemorations,
    regions,
  };
}
export function runAgent08TransitionCommemorationSelfTests(): Array<{
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

    check('a08_commemoration_01', () => {
    const row = buildFirmProductionTransitionCommemoration({
      companyId: 'f1',
      regionId: 'NSW',
      remembranceBand: 'eternal',
      legacyBand: 'immortal',
      rememberedLever: 'relieve_upstream',
      turnsToEternal: 1,
      remembranceScore: 0.999,
      remembranceRank: 4100,
      remembranceSummary: 's',
    });
    return row.commemorationBand === 'sanctified' && row.commemoratedLever === 'relieve_upstream';
  });

  check('a08_commemoration_02', () => {
    const row = buildFirmProductionTransitionCommemoration({
      companyId: 'f2',
      regionId: 'VIC',
      remembranceBand: 'faint',
      legacyBand: 'nascent',
      rememberedLever: 'sector_rebalance',
      turnsToEternal: 118,
      remembranceScore: 0.001,
      remembranceRank: 50,
      remembranceSummary: 's',
    });
    return row.commemorationBand === 'private';
  });

  check('a08_commemoration_03', () => {
    const summary = summarizeRegionalTransitionCommemoration('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        commemorationBand: 'sanctified',
        remembranceBand: 'eternal',
        commemoratedLever: 'capacity_buffer',
        turnsToSanctified: 1,
        commemorationScore: 0.998,
        commemorationRank: 4200,
        commemorationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        commemorationBand: 'private',
        remembranceBand: 'faint',
        commemoratedLever: 'sector_rebalance',
        turnsToSanctified: 122,
        commemorationScore: 0.001,
        commemorationRank: 55,
        commemorationSummary: 's',
      },
    ]);
    return summary.sanctifiedCount === 1 && summary.dominantBand === 'sanctified';
  });

  check('a08_commemoration_04', () => {
    const band = classifyNationalCommemorationBand(0.996, 1, 'remembered');
    return band === 'commemorated';
  });

  check('a08_commemoration_05', () => {
    const commemoration = computeNationalProductionTransitionCommemoration({
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
      commemoration.schemaVersion === AGENT08_TRANSITION_COMMEMORATION_SCHEMA_VERSION &&
      commemoration.firmCommemorations.length >= 1 &&
      commemoration.nationalCommemorationPressure >= 0 &&
      commemoration.nationalCommemorationPressure <= 1
    );
  });

  return results;
}
