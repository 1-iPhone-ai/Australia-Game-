/**
 * Agent 08 round 41 (O10-213) — transition resolution posture from completion bands.
 * Non-authoritative planning layer (resolution bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionCompletion,
  type FirmProductionTransitionCompletion,
  type NationalProductionTransitionCompletion,
  type TransitionCompletionBand,
} from './production-transition-completion';

export const AGENT08_TRANSITION_RESOLUTION_SCHEMA_VERSION = '1.0.0';

export type TransitionResolutionBand = 'open' | 'converging' | 'resolved' | 'terminal';

export interface FirmProductionTransitionResolution {
  companyId: string;
  regionId: string;
  resolutionBand: TransitionResolutionBand;
  completionBand: TransitionCompletionBand;
  resolvedLever: ProductionRecoveryLever;
  turnsToTerminal: number;
  resolutionScore: number;
  resolutionRank: number;
  resolutionSummary: string;
}

export interface RegionalTransitionResolutionSummary {
  regionId: string;
  firmCount: number;
  terminalCount: number;
  resolvedCount: number;
  avgResolutionScore: number;
  regionalResolutionPressure: number;
  dominantBand: TransitionResolutionBand;
}

export interface NationalProductionTransitionResolution {
  schemaVersion: typeof AGENT08_TRANSITION_RESOLUTION_SCHEMA_VERSION;
  turn: number;
  completionTurn: number;
  nationalResolutionPressure: number;
  nationalResolutionBand: TransitionResolutionBand;
  firmsTerminal: number;
  firmResolutions: FirmProductionTransitionResolution[];
  regions: RegionalTransitionResolutionSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RES_BAND_ORDER: TransitionResolutionBand[] = ['open', 'converging', 'resolved', 'terminal'];

function resolutionBandFromCompletion(
  completion: FirmProductionTransitionCompletion,
): TransitionResolutionBand {
  switch (completion.completionBand) {
    case 'perpetual':
      return 'terminal';
    case 'completed':
      return 'resolved';
    case 'progressing':
      return 'converging';
    default:
      return 'open';
  }
}

function resolutionScoreFromSignals(
  band: TransitionResolutionBand,
  completion: FirmProductionTransitionCompletion,
): number {
  const bandBase =
    band === 'terminal' ? 0.999 : band === 'resolved' ? 0.95 : band === 'converging' ? 0.67 : 0.003;
  const completionAdj = completion.completionScore * 0.032;
  const urgencyAdj =
    completion.completionBand === 'perpetual'
      ? 0.013
      : completion.completionBand === 'completed'
        ? 0.002
        : completion.completionBand === 'progressing'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + completionAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionResolution(
  completion: FirmProductionTransitionCompletion,
): FirmProductionTransitionResolution {
  const resolutionBand = resolutionBandFromCompletion(completion);
  const resolutionScore = resolutionScoreFromSignals(resolutionBand, completion);
  const rankBase =
    resolutionBand === 'terminal'
      ? 3700
      : resolutionBand === 'resolved'
        ? 2520
        : resolutionBand === 'converging'
          ? 1220
          : 90;
  const resolutionRank = Math.round(
    rankBase + completion.completionRank * 0.038 + resolutionScore * 42,
  );

  const leverLabel = completion.completedLever.replace(/_/g, ' ');
  const resolutionSummary =
    resolutionBand === 'terminal'
      ? `terminal ${leverLabel} resolution after ${completion.turnsToPerpetual} perpetual turns`
      : resolutionBand === 'resolved'
        ? `resolved ${leverLabel} from ${completion.completionBand} completion`
        : resolutionBand === 'converging'
          ? `converging ${leverLabel} while completion progresses`
          : `open — ${completion.completionSummary}`;

  const turnsToTerminal =
    resolutionBand === 'terminal'
      ? Math.max(1, Math.min(completion.turnsToPerpetual, 1))
      : resolutionBand === 'resolved'
        ? Math.max(1, completion.turnsToPerpetual + 1)
        : resolutionBand === 'converging'
          ? completion.turnsToPerpetual + 2
          : completion.turnsToPerpetual + 9;

  return {
    companyId: completion.companyId,
    regionId: completion.regionId,
    resolutionBand,
    completionBand: completion.completionBand,
    resolvedLever: completion.completedLever,
    turnsToTerminal,
    resolutionScore,
    resolutionRank,
    resolutionSummary,
  };
}

export function summarizeRegionalTransitionResolution(
  regionId: string,
  rows: FirmProductionTransitionResolution[],
): RegionalTransitionResolutionSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const terminalCount = regional.filter(r => r.resolutionBand === 'terminal').length;
  const resolvedCount = regional.filter(
    r => r.resolutionBand === 'resolved' || r.resolutionBand === 'terminal',
  ).length;
  const avgResolutionScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.resolutionScore, 0) / regional.length;

  const counts: Record<TransitionResolutionBand, number> = {
    open: 0,
    converging: 0,
    resolved: 0,
    terminal: 0,
  };
  for (const r of regional) counts[r.resolutionBand] += 1;

  let dominantBand: TransitionResolutionBand = 'open';
  let max = -1;
  for (const b of [...RES_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalResolutionPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.resolutionBand === 'terminal'
              ? 1
              : r.resolutionBand === 'resolved'
                ? 0.29
                : r.resolutionBand === 'converging'
                  ? 0.032
                  : 0.0002;
          return acc + w * r.resolutionScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    terminalCount,
    resolvedCount,
    avgResolutionScore: Math.round(avgResolutionScore * 1000) / 1000,
    regionalResolutionPressure: Math.round(regionalResolutionPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalResolutionBand(
  pressure: number,
  firmsTerminal: number,
  nationalCompletionBand: TransitionCompletionBand,
): TransitionResolutionBand {
  if (firmsTerminal >= 2 || nationalCompletionBand === 'perpetual' || pressure > 0.99998)
    return 'terminal';
  if (firmsTerminal >= 1 || nationalCompletionBand === 'completed' || pressure > 0.97) return 'resolved';
  if (nationalCompletionBand === 'progressing' || pressure > 0.75) return 'converging';
  return 'open';
}

export function computeNationalResolutionPressure(
  rows: FirmProductionTransitionResolution[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.resolutionBand === 'terminal'
        ? 1
        : r.resolutionBand === 'resolved'
          ? 0.25
          : r.resolutionBand === 'converging'
            ? 0.018
            : 0.00005;
    return acc + bandW * 0.15 + r.resolutionScore * 0.85;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionResolution(params: {
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
}): NationalProductionTransitionResolution {
  const completion =
    params.completion ??
    computeNationalProductionTransitionCompletion({
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
    });

  const firmResolutions = completion.firmCompletions
    .map(buildFirmProductionTransitionResolution)
    .sort((a, b) => b.resolutionRank - a.resolutionRank);

  const regionIds = [...new Set(firmResolutions.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionResolution(rid, firmResolutions));

  const nationalResolutionPressure = computeNationalResolutionPressure(firmResolutions);
  const firmsTerminal = firmResolutions.filter(r => r.resolutionBand === 'terminal').length;
  const nationalResolutionBand = classifyNationalResolutionBand(
    nationalResolutionPressure,
    firmsTerminal,
    completion.nationalCompletionBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_RESOLUTION_SCHEMA_VERSION,
    turn: params.turn,
    completionTurn: completion.turn,
    nationalResolutionPressure,
    nationalResolutionBand,
    firmsTerminal,
    firmResolutions,
    regions,
  };
}

export function runAgent08TransitionResolutionSelfTests(): Array<{
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

  check('a08_resolution_01', () => {
    const row = buildFirmProductionTransitionResolution({
      companyId: 'f1',
      regionId: 'NSW',
      completionBand: 'perpetual',
      closureBand: 'archived',
      completedLever: 'relieve_upstream',
      turnsToPerpetual: 1,
      completionScore: 0.999,
      completionRank: 3550,
      completionSummary: 's',
    });
    return row.resolutionBand === 'terminal' && row.resolvedLever === 'relieve_upstream';
  });

  check('a08_resolution_02', () => {
    const row = buildFirmProductionTransitionResolution({
      companyId: 'f2',
      regionId: 'VIC',
      completionBand: 'outstanding',
      closureBand: 'unresolved',
      completedLever: 'sector_rebalance',
      turnsToPerpetual: 110,
      completionScore: 0.001,
      completionRank: 90,
      completionSummary: 's',
    });
    return row.resolutionBand === 'open';
  });

  check('a08_resolution_03', () => {
    const summary = summarizeRegionalTransitionResolution('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        resolutionBand: 'terminal',
        completionBand: 'perpetual',
        resolvedLever: 'capacity_buffer',
        turnsToTerminal: 1,
        resolutionScore: 0.998,
        resolutionRank: 3600,
        resolutionSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        resolutionBand: 'open',
        completionBand: 'outstanding',
        resolvedLever: 'sector_rebalance',
        turnsToTerminal: 114,
        resolutionScore: 0.001,
        resolutionRank: 90,
        resolutionSummary: 's',
      },
    ]);
    return summary.terminalCount === 1 && summary.dominantBand === 'terminal';
  });

  check('a08_resolution_04', () => {
    const band = classifyNationalResolutionBand(0.992, 1, 'completed');
    return band === 'resolved';
  });

  check('a08_resolution_05', () => {
    const resolution = computeNationalProductionTransitionResolution({
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
      resolution.schemaVersion === AGENT08_TRANSITION_RESOLUTION_SCHEMA_VERSION &&
      resolution.firmResolutions.length >= 1 &&
      resolution.nationalResolutionPressure >= 0 &&
      resolution.nationalResolutionPressure <= 1
    );
  });

  return results;
}
