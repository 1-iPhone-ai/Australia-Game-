/**
 * Agent 08 round 40 (O10-211) — transition completion posture from closure bands.
 * Non-authoritative planning layer (completion bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionClosure,
  type FirmProductionTransitionClosure,
  type NationalProductionTransitionClosure,
  type TransitionClosureBand,
} from './production-transition-closure';

export const AGENT08_TRANSITION_COMPLETION_SCHEMA_VERSION = '1.0.0';

export type TransitionCompletionBand = 'outstanding' | 'progressing' | 'completed' | 'perpetual';

export interface FirmProductionTransitionCompletion {
  companyId: string;
  regionId: string;
  completionBand: TransitionCompletionBand;
  closureBand: TransitionClosureBand;
  completedLever: ProductionRecoveryLever;
  turnsToPerpetual: number;
  completionScore: number;
  completionRank: number;
  completionSummary: string;
}

export interface RegionalTransitionCompletionSummary {
  regionId: string;
  firmCount: number;
  perpetualCount: number;
  completedCount: number;
  avgCompletionScore: number;
  regionalCompletionPressure: number;
  dominantBand: TransitionCompletionBand;
}

export interface NationalProductionTransitionCompletion {
  schemaVersion: typeof AGENT08_TRANSITION_COMPLETION_SCHEMA_VERSION;
  turn: number;
  closureTurn: number;
  nationalCompletionPressure: number;
  nationalCompletionBand: TransitionCompletionBand;
  firmsPerpetual: number;
  firmCompletions: FirmProductionTransitionCompletion[];
  regions: RegionalTransitionCompletionSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const COM_BAND_ORDER: TransitionCompletionBand[] = ['outstanding', 'progressing', 'completed', 'perpetual'];

function completionBandFromClosure(closure: FirmProductionTransitionClosure): TransitionCompletionBand {
  switch (closure.closureBand) {
    case 'archived':
      return 'perpetual';
    case 'closed':
      return 'completed';
    case 'narrowing':
      return 'progressing';
    default:
      return 'outstanding';
  }
}

function completionScoreFromSignals(
  band: TransitionCompletionBand,
  closure: FirmProductionTransitionClosure,
): number {
  const bandBase =
    band === 'perpetual'
      ? 0.999
      : band === 'completed'
        ? 0.94
        : band === 'progressing'
          ? 0.66
          : 0.004;
  const closureAdj = closure.closureScore * 0.034;
  const urgencyAdj =
    closure.closureBand === 'archived'
      ? 0.014
      : closure.closureBand === 'closed'
        ? 0.002
        : closure.closureBand === 'narrowing'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + closureAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionCompletion(
  closure: FirmProductionTransitionClosure,
): FirmProductionTransitionCompletion {
  const completionBand = completionBandFromClosure(closure);
  const completionScore = completionScoreFromSignals(completionBand, closure);
  const rankBase =
    completionBand === 'perpetual'
      ? 3600
      : completionBand === 'completed'
        ? 2440
        : completionBand === 'progressing'
          ? 1200
          : 100;
  const completionRank = Math.round(rankBase + closure.closureRank * 0.04 + completionScore * 44);

  const leverLabel = closure.closedLever.replace(/_/g, ' ');
  const completionSummary =
    completionBand === 'perpetual'
      ? `perpetual ${leverLabel} completion after ${closure.turnsToArchived} archived turns`
      : completionBand === 'completed'
        ? `completed ${leverLabel} from ${closure.closureBand} closure`
        : completionBand === 'progressing'
          ? `progressing ${leverLabel} while closure narrows`
          : `outstanding — ${closure.closureSummary}`;

  const turnsToPerpetual =
    completionBand === 'perpetual'
      ? Math.max(1, Math.min(closure.turnsToArchived, 1))
      : completionBand === 'completed'
        ? Math.max(1, closure.turnsToArchived + 1)
        : completionBand === 'progressing'
          ? closure.turnsToArchived + 2
          : closure.turnsToArchived + 10;

  return {
    companyId: closure.companyId,
    regionId: closure.regionId,
    completionBand,
    closureBand: closure.closureBand,
    completedLever: closure.closedLever,
    turnsToPerpetual,
    completionScore,
    completionRank,
    completionSummary,
  };
}

export function summarizeRegionalTransitionCompletion(
  regionId: string,
  rows: FirmProductionTransitionCompletion[],
): RegionalTransitionCompletionSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const perpetualCount = regional.filter(r => r.completionBand === 'perpetual').length;
  const completedCount = regional.filter(
    r => r.completionBand === 'completed' || r.completionBand === 'perpetual',
  ).length;
  const avgCompletionScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.completionScore, 0) / regional.length;

  const counts: Record<TransitionCompletionBand, number> = {
    outstanding: 0,
    progressing: 0,
    completed: 0,
    perpetual: 0,
  };
  for (const r of regional) counts[r.completionBand] += 1;

  let dominantBand: TransitionCompletionBand = 'outstanding';
  let max = -1;
  for (const b of [...COM_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalCompletionPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.completionBand === 'perpetual'
              ? 1
              : r.completionBand === 'completed'
                ? 0.3
                : r.completionBand === 'progressing'
                  ? 0.035
                  : 0.0003;
          return acc + w * r.completionScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    perpetualCount,
    completedCount,
    avgCompletionScore: Math.round(avgCompletionScore * 1000) / 1000,
    regionalCompletionPressure: Math.round(regionalCompletionPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalCompletionBand(
  pressure: number,
  firmsPerpetual: number,
  nationalClosureBand: TransitionClosureBand,
): TransitionCompletionBand {
  if (firmsPerpetual >= 2 || nationalClosureBand === 'archived' || pressure > 0.99995)
    return 'perpetual';
  if (firmsPerpetual >= 1 || nationalClosureBand === 'closed' || pressure > 0.96) return 'completed';
  if (nationalClosureBand === 'narrowing' || pressure > 0.74) return 'progressing';
  return 'outstanding';
}

export function computeNationalCompletionPressure(
  rows: FirmProductionTransitionCompletion[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.completionBand === 'perpetual'
        ? 1
        : r.completionBand === 'completed'
          ? 0.26
          : r.completionBand === 'progressing'
            ? 0.02
            : 0.00008;
    return acc + bandW * 0.16 + r.completionScore * 0.84;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionCompletion(params: {
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
}): NationalProductionTransitionCompletion {
  const closure =
    params.closure ??
    computeNationalProductionTransitionClosure({
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
    });

  const firmCompletions = closure.firmClosures
    .map(buildFirmProductionTransitionCompletion)
    .sort((a, b) => b.completionRank - a.completionRank);

  const regionIds = [...new Set(firmCompletions.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionCompletion(rid, firmCompletions));

  const nationalCompletionPressure = computeNationalCompletionPressure(firmCompletions);
  const firmsPerpetual = firmCompletions.filter(r => r.completionBand === 'perpetual').length;
  const nationalCompletionBand = classifyNationalCompletionBand(
    nationalCompletionPressure,
    firmsPerpetual,
    closure.nationalClosureBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_COMPLETION_SCHEMA_VERSION,
    turn: params.turn,
    closureTurn: closure.turn,
    nationalCompletionPressure,
    nationalCompletionBand,
    firmsPerpetual,
    firmCompletions,
    regions,
  };
}

export function runAgent08TransitionCompletionSelfTests(): Array<{
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

  check('a08_completion_01', () => {
    const row = buildFirmProductionTransitionCompletion({
      companyId: 'f1',
      regionId: 'NSW',
      closureBand: 'archived',
      finalizationBand: 'sealed',
      closedLever: 'relieve_upstream',
      turnsToArchived: 1,
      closureScore: 0.999,
      closureRank: 3450,
      closureSummary: 's',
    });
    return row.completionBand === 'perpetual' && row.completedLever === 'relieve_upstream';
  });

  check('a08_completion_02', () => {
    const row = buildFirmProductionTransitionCompletion({
      companyId: 'f2',
      regionId: 'VIC',
      closureBand: 'unresolved',
      finalizationBand: 'open',
      closedLever: 'sector_rebalance',
      turnsToArchived: 108,
      closureScore: 0.001,
      closureRank: 100,
      closureSummary: 's',
    });
    return row.completionBand === 'outstanding';
  });

  check('a08_completion_03', () => {
    const summary = summarizeRegionalTransitionCompletion('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        completionBand: 'perpetual',
        closureBand: 'archived',
        completedLever: 'capacity_buffer',
        turnsToPerpetual: 1,
        completionScore: 0.998,
        completionRank: 3500,
        completionSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        completionBand: 'outstanding',
        closureBand: 'unresolved',
        completedLever: 'sector_rebalance',
        turnsToPerpetual: 112,
        completionScore: 0.001,
        completionRank: 100,
        completionSummary: 's',
      },
    ]);
    return summary.perpetualCount === 1 && summary.dominantBand === 'perpetual';
  });

  check('a08_completion_04', () => {
    const band = classifyNationalCompletionBand(0.991, 1, 'closed');
    return band === 'completed';
  });

  check('a08_completion_05', () => {
    const completion = computeNationalProductionTransitionCompletion({
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
      completion.schemaVersion === AGENT08_TRANSITION_COMPLETION_SCHEMA_VERSION &&
      completion.firmCompletions.length >= 1 &&
      completion.nationalCompletionPressure >= 0 &&
      completion.nationalCompletionPressure <= 1
    );
  });

  return results;
}
