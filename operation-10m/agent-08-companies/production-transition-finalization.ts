/**
 * Agent 08 round 38 (O10-207) — transition finalization posture from confirmation bands.
 * Non-authoritative planning layer (finalization bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionConfirmation,
  type FirmProductionTransitionConfirmation,
  type NationalProductionTransitionConfirmation,
  type TransitionConfirmationBand,
} from './production-transition-confirmation';

export const AGENT08_TRANSITION_FINALIZATION_SCHEMA_VERSION = '1.0.0';

export type TransitionFinalizationBand = 'open' | 'closing' | 'finalized' | 'sealed';

export interface FirmProductionTransitionFinalization {
  companyId: string;
  regionId: string;
  finalizationBand: TransitionFinalizationBand;
  confirmationBand: TransitionConfirmationBand;
  finalizedLever: ProductionRecoveryLever;
  turnsToSealed: number;
  finalizationScore: number;
  finalizationRank: number;
  finalizationSummary: string;
}

export interface RegionalTransitionFinalizationSummary {
  regionId: string;
  firmCount: number;
  sealedCount: number;
  finalizedCount: number;
  avgFinalizationScore: number;
  regionalFinalizationPressure: number;
  dominantBand: TransitionFinalizationBand;
}

export interface NationalProductionTransitionFinalization {
  schemaVersion: typeof AGENT08_TRANSITION_FINALIZATION_SCHEMA_VERSION;
  turn: number;
  confirmationTurn: number;
  nationalFinalizationPressure: number;
  nationalFinalizationBand: TransitionFinalizationBand;
  firmsSealed: number;
  firmFinalizations: FirmProductionTransitionFinalization[];
  regions: RegionalTransitionFinalizationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const FIN_BAND_ORDER: TransitionFinalizationBand[] = ['open', 'closing', 'finalized', 'sealed'];

function finalizationBandFromConfirmation(
  confirmation: FirmProductionTransitionConfirmation,
): TransitionFinalizationBand {
  switch (confirmation.confirmationBand) {
    case 'immutable':
      return 'sealed';
    case 'confirmed':
      return 'finalized';
    case 'forming':
      return 'closing';
    default:
      return 'open';
  }
}

function finalizationScoreFromSignals(
  band: TransitionFinalizationBand,
  confirmation: FirmProductionTransitionConfirmation,
): number {
  const bandBase =
    band === 'sealed' ? 0.999 : band === 'finalized' ? 0.92 : band === 'closing' ? 0.64 : 0.006;
  const confirmationAdj = confirmation.confirmationScore * 0.038;
  const urgencyAdj =
    confirmation.confirmationBand === 'immutable'
      ? 0.016
      : confirmation.confirmationBand === 'confirmed'
        ? 0.002
        : confirmation.confirmationBand === 'forming'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + confirmationAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionFinalization(
  confirmation: FirmProductionTransitionConfirmation,
): FirmProductionTransitionFinalization {
  const finalizationBand = finalizationBandFromConfirmation(confirmation);
  const finalizationScore = finalizationScoreFromSignals(finalizationBand, confirmation);
  const rankBase =
    finalizationBand === 'sealed'
      ? 3400
      : finalizationBand === 'finalized'
        ? 2280
        : finalizationBand === 'closing'
          ? 1160
          : 140;
  const finalizationRank = Math.round(
    rankBase + confirmation.confirmationRank * 0.044 + finalizationScore * 48,
  );

  const leverLabel = confirmation.confirmedLever.replace(/_/g, ' ');
  const finalizationSummary =
    finalizationBand === 'sealed'
      ? `sealed ${leverLabel} finalization after ${confirmation.turnsToImmutable} immutable turns`
      : finalizationBand === 'finalized'
        ? `finalized ${leverLabel} from ${confirmation.confirmationBand} confirmation`
        : finalizationBand === 'closing'
          ? `closing ${leverLabel} while confirmation forms`
          : `open — ${confirmation.confirmationSummary}`;

  const turnsToSealed =
    finalizationBand === 'sealed'
      ? Math.max(1, Math.min(confirmation.turnsToImmutable, 1))
      : finalizationBand === 'finalized'
        ? Math.max(1, confirmation.turnsToImmutable + 1)
        : finalizationBand === 'closing'
          ? confirmation.turnsToImmutable + 2
          : confirmation.turnsToImmutable + 12;

  return {
    companyId: confirmation.companyId,
    regionId: confirmation.regionId,
    finalizationBand,
    confirmationBand: confirmation.confirmationBand,
    finalizedLever: confirmation.confirmedLever,
    turnsToSealed,
    finalizationScore,
    finalizationRank,
    finalizationSummary,
  };
}

export function summarizeRegionalTransitionFinalization(
  regionId: string,
  rows: FirmProductionTransitionFinalization[],
): RegionalTransitionFinalizationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const sealedCount = regional.filter(r => r.finalizationBand === 'sealed').length;
  const finalizedCount = regional.filter(
    r => r.finalizationBand === 'finalized' || r.finalizationBand === 'sealed',
  ).length;
  const avgFinalizationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.finalizationScore, 0) / regional.length;

  const counts: Record<TransitionFinalizationBand, number> = {
    open: 0,
    closing: 0,
    finalized: 0,
    sealed: 0,
  };
  for (const r of regional) counts[r.finalizationBand] += 1;

  let dominantBand: TransitionFinalizationBand = 'open';
  let max = -1;
  for (const b of [...FIN_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalFinalizationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.finalizationBand === 'sealed'
              ? 1
              : r.finalizationBand === 'finalized'
                ? 0.32
                : r.finalizationBand === 'closing'
                  ? 0.045
                  : 0.0006;
          return acc + w * r.finalizationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    sealedCount,
    finalizedCount,
    avgFinalizationScore: Math.round(avgFinalizationScore * 1000) / 1000,
    regionalFinalizationPressure: Math.round(regionalFinalizationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalFinalizationBand(
  pressure: number,
  firmsSealed: number,
  nationalConfirmationBand: TransitionConfirmationBand,
): TransitionFinalizationBand {
  if (firmsSealed >= 2 || nationalConfirmationBand === 'immutable' || pressure > 0.9998)
    return 'sealed';
  if (firmsSealed >= 1 || nationalConfirmationBand === 'confirmed' || pressure > 0.94)
    return 'finalized';
  if (nationalConfirmationBand === 'forming' || pressure > 0.72) return 'closing';
  return 'open';
}

export function computeNationalFinalizationPressure(
  rows: FirmProductionTransitionFinalization[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.finalizationBand === 'sealed'
        ? 1
        : r.finalizationBand === 'finalized'
          ? 0.28
          : r.finalizationBand === 'closing'
            ? 0.024
            : 0.0002;
    return acc + bandW * 0.18 + r.finalizationScore * 0.82;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionFinalization(params: {
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
}): NationalProductionTransitionFinalization {
  const confirmation =
    params.confirmation ??
    computeNationalProductionTransitionConfirmation({
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
    });

  const firmFinalizations = confirmation.firmConfirmations
    .map(buildFirmProductionTransitionFinalization)
    .sort((a, b) => b.finalizationRank - a.finalizationRank);

  const regionIds = [...new Set(firmFinalizations.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionFinalization(rid, firmFinalizations));

  const nationalFinalizationPressure = computeNationalFinalizationPressure(firmFinalizations);
  const firmsSealed = firmFinalizations.filter(r => r.finalizationBand === 'sealed').length;
  const nationalFinalizationBand = classifyNationalFinalizationBand(
    nationalFinalizationPressure,
    firmsSealed,
    confirmation.nationalConfirmationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_FINALIZATION_SCHEMA_VERSION,
    turn: params.turn,
    confirmationTurn: confirmation.turn,
    nationalFinalizationPressure,
    nationalFinalizationBand,
    firmsSealed,
    firmFinalizations,
    regions,
  };
}

export function runAgent08TransitionFinalizationSelfTests(): Array<{
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

  check('a08_finalization_01', () => {
    const row = buildFirmProductionTransitionFinalization({
      companyId: 'f1',
      regionId: 'NSW',
      confirmationBand: 'immutable',
      ratificationBand: 'entrenched',
      confirmedLever: 'relieve_upstream',
      turnsToImmutable: 1,
      confirmationScore: 0.999,
      confirmationRank: 3250,
      confirmationSummary: 's',
    });
    return row.finalizationBand === 'sealed' && row.finalizedLever === 'relieve_upstream';
  });

  check('a08_finalization_02', () => {
    const row = buildFirmProductionTransitionFinalization({
      companyId: 'f2',
      regionId: 'VIC',
      confirmationBand: 'uncertain',
      ratificationBand: 'unratified',
      confirmedLever: 'sector_rebalance',
      turnsToImmutable: 104,
      confirmationScore: 0.001,
      confirmationRank: 130,
      confirmationSummary: 's',
    });
    return row.finalizationBand === 'open';
  });

  check('a08_finalization_03', () => {
    const summary = summarizeRegionalTransitionFinalization('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        finalizationBand: 'sealed',
        confirmationBand: 'immutable',
        finalizedLever: 'capacity_buffer',
        turnsToSealed: 1,
        finalizationScore: 0.998,
        finalizationRank: 3300,
        finalizationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        finalizationBand: 'open',
        confirmationBand: 'uncertain',
        finalizedLever: 'sector_rebalance',
        turnsToSealed: 108,
        finalizationScore: 0.001,
        finalizationRank: 130,
        finalizationSummary: 's',
      },
    ]);
    return summary.sealedCount === 1 && summary.dominantBand === 'sealed';
  });

  check('a08_finalization_04', () => {
    const band = classifyNationalFinalizationBand(0.98, 1, 'confirmed');
    return band === 'finalized';
  });

  check('a08_finalization_05', () => {
    const finalization = computeNationalProductionTransitionFinalization({
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
      finalization.schemaVersion === AGENT08_TRANSITION_FINALIZATION_SCHEMA_VERSION &&
      finalization.firmFinalizations.length >= 1 &&
      finalization.nationalFinalizationPressure >= 0 &&
      finalization.nationalFinalizationPressure <= 1
    );
  });

  return results;
}
