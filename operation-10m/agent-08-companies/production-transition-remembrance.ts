/**
 * Agent 08 round 45 (O10-221) — transition remembrance posture from legacy bands.
 * Non-authoritative planning layer (remembrance bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionLegacy,
  type FirmProductionTransitionLegacy,
  type NationalProductionTransitionLegacy,
  type TransitionLegacyBand,
} from './production-transition-legacy';

export const AGENT08_TRANSITION_REMEMBRANCE_SCHEMA_VERSION = '1.0.0';

export type TransitionRemembranceBand = 'faint' | 'gathering' | 'remembered' | 'eternal';

export interface FirmProductionTransitionRemembrance {
  companyId: string;
  regionId: string;
  remembranceBand: TransitionRemembranceBand;
  legacyBand: TransitionLegacyBand;
  rememberedLever: ProductionRecoveryLever;
  turnsToEternal: number;
  remembranceScore: number;
  remembranceRank: number;
  remembranceSummary: string;
}

export interface RegionalTransitionRemembranceSummary {
  regionId: string;
  firmCount: number;
  eternalCount: number;
  rememberedCount: number;
  avgRemembranceScore: number;
  regionalRemembrancePressure: number;
  dominantBand: TransitionRemembranceBand;
}

export interface NationalProductionTransitionRemembrance {
  schemaVersion: typeof AGENT08_TRANSITION_REMEMBRANCE_SCHEMA_VERSION;
  turn: number;
  legacyTurn: number;
  nationalRemembrancePressure: number;
  nationalRemembranceBand: TransitionRemembranceBand;
  firmsEternal: number;
  firmRemembrances: FirmProductionTransitionRemembrance[];
  regions: RegionalTransitionRemembranceSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const REM_BAND_ORDER: TransitionRemembranceBand[] = ['faint', 'gathering', 'remembered', 'eternal'];

function remembranceBandFromLegacy(legacy: FirmProductionTransitionLegacy): TransitionRemembranceBand {
  switch (legacy.legacyBand) {
    case 'immortal':
      return 'eternal';
    case 'legacy':
      return 'remembered';
    case 'accruing':
      return 'gathering';
    default:
      return 'faint';
  }
}

function remembranceScoreFromSignals(
  band: TransitionRemembranceBand,
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

export function buildFirmProductionTransitionRemembrance(
  legacy: FirmProductionTransitionLegacy,
): FirmProductionTransitionRemembrance {
  const remembranceBand = remembranceBandFromLegacy(legacy);
  const remembranceScore = remembranceScoreFromSignals(remembranceBand, legacy);
  const rankBase =
    remembranceBand === 'eternal'
      ? 4100
      : remembranceBand === 'remembered'
        ? 2840
        : remembranceBand === 'gathering'
          ? 1300
          : 50;
  const remembranceRank = Math.round(rankBase + legacy.legacyRank * 0.03 + remembranceScore * 34);

  const leverLabel = legacy.legacyLever.replace(/_/g, ' ');
  const remembranceSummary =
    remembranceBand === 'eternal'
      ? `eternal ${leverLabel} remembrance after ${legacy.turnsToImmortal} immortal turns`
      : remembranceBand === 'remembered'
        ? `remembered ${leverLabel} from ${legacy.legacyBand} legacy`
        : remembranceBand === 'gathering'
          ? `gathering ${leverLabel} while legacy accrues`
          : `faint — ${legacy.legacySummary}`;

  const turnsToEternal =
    remembranceBand === 'eternal'
      ? Math.max(1, Math.min(legacy.turnsToImmortal, 1))
      : remembranceBand === 'remembered'
        ? Math.max(1, legacy.turnsToImmortal + 1)
        : remembranceBand === 'gathering'
          ? legacy.turnsToImmortal + 2
          : legacy.turnsToImmortal + 5;

  return {
    companyId: legacy.companyId,
    regionId: legacy.regionId,
    remembranceBand,
    legacyBand: legacy.legacyBand,
    rememberedLever: legacy.legacyLever,
    turnsToEternal,
    remembranceScore,
    remembranceRank,
    remembranceSummary,
  };
}

export function summarizeRegionalTransitionRemembrance(
  regionId: string,
  rows: FirmProductionTransitionRemembrance[],
): RegionalTransitionRemembranceSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const eternalCount = regional.filter(r => r.remembranceBand === 'eternal').length;
  const rememberedCount = regional.filter(
    r => r.remembranceBand === 'remembered' || r.remembranceBand === 'eternal',
  ).length;
  const avgRemembranceScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.remembranceScore, 0) / regional.length;

  const counts: Record<TransitionRemembranceBand, number> = {
    faint: 0,
    gathering: 0,
    remembered: 0,
    eternal: 0,
  };
  for (const r of regional) counts[r.remembranceBand] += 1;

  let dominantBand: TransitionRemembranceBand = 'faint';
  let max = -1;
  for (const b of [...REM_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalRemembrancePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.remembranceBand === 'eternal'
              ? 1
              : r.remembranceBand === 'remembered'
                ? 0.25
                : r.remembranceBand === 'gathering'
                  ? 0.024
                  : 0.00006;
          return acc + w * r.remembranceScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    eternalCount,
    rememberedCount,
    avgRemembranceScore: Math.round(avgRemembranceScore * 1000) / 1000,
    regionalRemembrancePressure: Math.round(regionalRemembrancePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalRemembranceBand(
  pressure: number,
  firmsEternal: number,
  nationalLegacyBand: TransitionLegacyBand,
): TransitionRemembranceBand {
  if (firmsEternal >= 2 || nationalLegacyBand === 'immortal' || pressure > 0.999999)
    return 'eternal';
  if (firmsEternal >= 1 || nationalLegacyBand === 'legacy' || pressure > 0.992) return 'remembered';
  if (nationalLegacyBand === 'accruing' || pressure > 0.79) return 'gathering';
  return 'faint';
}

export function computeNationalRemembrancePressure(
  rows: FirmProductionTransitionRemembrance[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.remembranceBand === 'eternal'
        ? 1
        : r.remembranceBand === 'remembered'
          ? 0.21
          : r.remembranceBand === 'gathering'
            ? 0.01
            : 0.000008;
    return acc + bandW * 0.11 + r.remembranceScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionRemembrance(params: {
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
}): NationalProductionTransitionRemembrance {
  const legacy =
    params.legacy ??
    computeNationalProductionTransitionLegacy({
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
    });

  const firmRemembrances = legacy.firmLegacies
    .map(buildFirmProductionTransitionRemembrance)
    .sort((a, b) => b.remembranceRank - a.remembranceRank);

  const regionIds = [...new Set(firmRemembrances.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionRemembrance(rid, firmRemembrances));

  const nationalRemembrancePressure = computeNationalRemembrancePressure(firmRemembrances);
  const firmsEternal = firmRemembrances.filter(r => r.remembranceBand === 'eternal').length;
  const nationalRemembranceBand = classifyNationalRemembranceBand(
    nationalRemembrancePressure,
    firmsEternal,
    legacy.nationalLegacyBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_REMEMBRANCE_SCHEMA_VERSION,
    turn: params.turn,
    legacyTurn: legacy.turn,
    nationalRemembrancePressure,
    nationalRemembranceBand,
    firmsEternal,
    firmRemembrances,
    regions,
  };
}

export function runAgent08TransitionRemembranceSelfTests(): Array<{
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

  check('a08_remembrance_01', () => {
    const row = buildFirmProductionTransitionRemembrance({
      companyId: 'f1',
      regionId: 'NSW',
      legacyBand: 'immortal',
      retirementBand: 'memorialized',
      legacyLever: 'relieve_upstream',
      turnsToImmortal: 1,
      legacyScore: 0.999,
      legacyRank: 3950,
      legacySummary: 's',
    });
    return row.remembranceBand === 'eternal' && row.rememberedLever === 'relieve_upstream';
  });

  check('a08_remembrance_02', () => {
    const row = buildFirmProductionTransitionRemembrance({
      companyId: 'f2',
      regionId: 'VIC',
      legacyBand: 'nascent',
      retirementBand: 'active',
      legacyLever: 'sector_rebalance',
      turnsToImmortal: 118,
      legacyScore: 0.001,
      legacyRank: 50,
      legacySummary: 's',
    });
    return row.remembranceBand === 'faint';
  });

  check('a08_remembrance_03', () => {
    const summary = summarizeRegionalTransitionRemembrance('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        remembranceBand: 'eternal',
        legacyBand: 'immortal',
        rememberedLever: 'capacity_buffer',
        turnsToEternal: 1,
        remembranceScore: 0.998,
        remembranceRank: 4000,
        remembranceSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        remembranceBand: 'faint',
        legacyBand: 'nascent',
        rememberedLever: 'sector_rebalance',
        turnsToEternal: 122,
        remembranceScore: 0.001,
        remembranceRank: 50,
        remembranceSummary: 's',
      },
    ]);
    return summary.eternalCount === 1 && summary.dominantBand === 'eternal';
  });

  check('a08_remembrance_04', () => {
    const band = classifyNationalRemembranceBand(0.996, 1, 'legacy');
    return band === 'remembered';
  });

  check('a08_remembrance_05', () => {
    const remembrance = computeNationalProductionTransitionRemembrance({
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
      remembrance.schemaVersion === AGENT08_TRANSITION_REMEMBRANCE_SCHEMA_VERSION &&
      remembrance.firmRemembrances.length >= 1 &&
      remembrance.nationalRemembrancePressure >= 0 &&
      remembrance.nationalRemembrancePressure <= 1
    );
  });

  return results;
}
