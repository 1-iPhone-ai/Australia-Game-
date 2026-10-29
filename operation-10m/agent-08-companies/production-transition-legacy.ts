/**
 * Agent 08 round 44 (O10-219) — transition legacy posture from retirement bands.
 * Non-authoritative planning layer (legacy bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionRetirement,
  type FirmProductionTransitionRetirement,
  type NationalProductionTransitionRetirement,
  type TransitionRetirementBand,
} from './production-transition-retirement';

export const AGENT08_TRANSITION_LEGACY_SCHEMA_VERSION = '1.0.0';

export type TransitionLegacyBand = 'nascent' | 'accruing' | 'legacy' | 'immortal';

export interface FirmProductionTransitionLegacy {
  companyId: string;
  regionId: string;
  legacyBand: TransitionLegacyBand;
  retirementBand: TransitionRetirementBand;
  legacyLever: ProductionRecoveryLever;
  turnsToImmortal: number;
  legacyScore: number;
  legacyRank: number;
  legacySummary: string;
}

export interface RegionalTransitionLegacySummary {
  regionId: string;
  firmCount: number;
  immortalCount: number;
  legacyCount: number;
  avgLegacyScore: number;
  regionalLegacyPressure: number;
  dominantBand: TransitionLegacyBand;
}

export interface NationalProductionTransitionLegacy {
  schemaVersion: typeof AGENT08_TRANSITION_LEGACY_SCHEMA_VERSION;
  turn: number;
  retirementTurn: number;
  nationalLegacyPressure: number;
  nationalLegacyBand: TransitionLegacyBand;
  firmsImmortal: number;
  firmLegacies: FirmProductionTransitionLegacy[];
  regions: RegionalTransitionLegacySummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const LEGACY_BAND_ORDER: TransitionLegacyBand[] = ['nascent', 'accruing', 'legacy', 'immortal'];

function legacyBandFromRetirement(retirement: FirmProductionTransitionRetirement): TransitionLegacyBand {
  switch (retirement.retirementBand) {
    case 'memorialized':
      return 'immortal';
    case 'retired':
      return 'legacy';
    case 'winding':
      return 'accruing';
    default:
      return 'nascent';
  }
}

function legacyScoreFromSignals(
  band: TransitionLegacyBand,
  retirement: FirmProductionTransitionRetirement,
): number {
  const bandBase =
    band === 'immortal' ? 0.999 : band === 'legacy' ? 0.98 : band === 'accruing' ? 0.7 : 0.001;
  const retirementAdj = retirement.retirementScore * 0.026;
  const urgencyAdj =
    retirement.retirementBand === 'memorialized'
      ? 0.01
      : retirement.retirementBand === 'retired'
        ? 0.002
        : retirement.retirementBand === 'winding'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + retirementAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionLegacy(
  retirement: FirmProductionTransitionRetirement,
): FirmProductionTransitionLegacy {
  const legacyBand = legacyBandFromRetirement(retirement);
  const legacyScore = legacyScoreFromSignals(legacyBand, retirement);
  const rankBase =
    legacyBand === 'immortal'
      ? 4000
      : legacyBand === 'legacy'
        ? 2760
        : legacyBand === 'accruing'
          ? 1280
          : 60;
  const legacyRank = Math.round(rankBase + retirement.retirementRank * 0.032 + legacyScore * 36);

  const leverLabel = retirement.retiredLever.replace(/_/g, ' ');
  const legacySummary =
    legacyBand === 'immortal'
      ? `immortal ${leverLabel} legacy after ${retirement.turnsToMemorialized} memorialized turns`
      : legacyBand === 'legacy'
        ? `legacy ${leverLabel} from ${retirement.retirementBand} retirement`
        : legacyBand === 'accruing'
          ? `accruing ${leverLabel} while retirement winds`
          : `nascent — ${retirement.retirementSummary}`;

  const turnsToImmortal =
    legacyBand === 'immortal'
      ? Math.max(1, Math.min(retirement.turnsToMemorialized, 1))
      : legacyBand === 'legacy'
        ? Math.max(1, retirement.turnsToMemorialized + 1)
        : legacyBand === 'accruing'
          ? retirement.turnsToMemorialized + 2
          : retirement.turnsToMemorialized + 6;

  return {
    companyId: retirement.companyId,
    regionId: retirement.regionId,
    legacyBand,
    retirementBand: retirement.retirementBand,
    legacyLever: retirement.retiredLever,
    turnsToImmortal,
    legacyScore,
    legacyRank,
    legacySummary,
  };
}

export function summarizeRegionalTransitionLegacy(
  regionId: string,
  rows: FirmProductionTransitionLegacy[],
): RegionalTransitionLegacySummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const immortalCount = regional.filter(r => r.legacyBand === 'immortal').length;
  const legacyCount = regional.filter(
    r => r.legacyBand === 'legacy' || r.legacyBand === 'immortal',
  ).length;
  const avgLegacyScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.legacyScore, 0) / regional.length;

  const counts: Record<TransitionLegacyBand, number> = {
    nascent: 0,
    accruing: 0,
    legacy: 0,
    immortal: 0,
  };
  for (const r of regional) counts[r.legacyBand] += 1;

  let dominantBand: TransitionLegacyBand = 'nascent';
  let max = -1;
  for (const b of [...LEGACY_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalLegacyPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.legacyBand === 'immortal'
              ? 1
              : r.legacyBand === 'legacy'
                ? 0.26
                : r.legacyBand === 'accruing'
                  ? 0.026
                  : 0.00008;
          return acc + w * r.legacyScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    immortalCount,
    legacyCount,
    avgLegacyScore: Math.round(avgLegacyScore * 1000) / 1000,
    regionalLegacyPressure: Math.round(regionalLegacyPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalLegacyBand(
  pressure: number,
  firmsImmortal: number,
  nationalRetirementBand: TransitionRetirementBand,
): TransitionLegacyBand {
  if (firmsImmortal >= 2 || nationalRetirementBand === 'memorialized' || pressure > 0.999998)
    return 'immortal';
  if (firmsImmortal >= 1 || nationalRetirementBand === 'retired' || pressure > 0.99) return 'legacy';
  if (nationalRetirementBand === 'winding' || pressure > 0.78) return 'accruing';
  return 'nascent';
}

export function computeNationalLegacyPressure(rows: FirmProductionTransitionLegacy[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.legacyBand === 'immortal'
        ? 1
        : r.legacyBand === 'legacy'
          ? 0.22
          : r.legacyBand === 'accruing'
            ? 0.012
            : 0.00001;
    return acc + bandW * 0.12 + r.legacyScore * 0.88;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionLegacy(params: {
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
}): NationalProductionTransitionLegacy {
  const retirement =
    params.retirement ??
    computeNationalProductionTransitionRetirement({
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
    });

  const firmLegacies = retirement.firmRetirements
    .map(buildFirmProductionTransitionLegacy)
    .sort((a, b) => b.legacyRank - a.legacyRank);

  const regionIds = [...new Set(firmLegacies.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionLegacy(rid, firmLegacies));

  const nationalLegacyPressure = computeNationalLegacyPressure(firmLegacies);
  const firmsImmortal = firmLegacies.filter(r => r.legacyBand === 'immortal').length;
  const nationalLegacyBand = classifyNationalLegacyBand(
    nationalLegacyPressure,
    firmsImmortal,
    retirement.nationalRetirementBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_LEGACY_SCHEMA_VERSION,
    turn: params.turn,
    retirementTurn: retirement.turn,
    nationalLegacyPressure,
    nationalLegacyBand,
    firmsImmortal,
    firmLegacies,
    regions,
  };
}

export function runAgent08TransitionLegacySelfTests(): Array<{
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

  check('a08_legacy_01', () => {
    const row = buildFirmProductionTransitionLegacy({
      companyId: 'f1',
      regionId: 'NSW',
      retirementBand: 'memorialized',
      settlementBand: 'discharged',
      retiredLever: 'relieve_upstream',
      turnsToMemorialized: 1,
      retirementScore: 0.999,
      retirementRank: 3850,
      retirementSummary: 's',
    });
    return row.legacyBand === 'immortal' && row.legacyLever === 'relieve_upstream';
  });

  check('a08_legacy_02', () => {
    const row = buildFirmProductionTransitionLegacy({
      companyId: 'f2',
      regionId: 'VIC',
      retirementBand: 'active',
      settlementBand: 'unsettled',
      retiredLever: 'sector_rebalance',
      turnsToMemorialized: 116,
      retirementScore: 0.001,
      retirementRank: 60,
      retirementSummary: 's',
    });
    return row.legacyBand === 'nascent';
  });

  check('a08_legacy_03', () => {
    const summary = summarizeRegionalTransitionLegacy('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        legacyBand: 'immortal',
        retirementBand: 'memorialized',
        legacyLever: 'capacity_buffer',
        turnsToImmortal: 1,
        legacyScore: 0.998,
        legacyRank: 3900,
        legacySummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        legacyBand: 'nascent',
        retirementBand: 'active',
        legacyLever: 'sector_rebalance',
        turnsToImmortal: 120,
        legacyScore: 0.001,
        legacyRank: 60,
        legacySummary: 's',
      },
    ]);
    return summary.immortalCount === 1 && summary.dominantBand === 'immortal';
  });

  check('a08_legacy_04', () => {
    const band = classifyNationalLegacyBand(0.995, 1, 'retired');
    return band === 'legacy';
  });

  check('a08_legacy_05', () => {
    const legacy = computeNationalProductionTransitionLegacy({
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
      legacy.schemaVersion === AGENT08_TRANSITION_LEGACY_SCHEMA_VERSION &&
      legacy.firmLegacies.length >= 1 &&
      legacy.nationalLegacyPressure >= 0 &&
      legacy.nationalLegacyPressure <= 1
    );
  });

  return results;
}
