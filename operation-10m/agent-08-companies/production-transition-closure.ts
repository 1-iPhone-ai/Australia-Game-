/**
 * Agent 08 round 39 (O10-209) — transition closure posture from finalization bands.
 * Non-authoritative planning layer (closure bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionFinalization,
  type FirmProductionTransitionFinalization,
  type NationalProductionTransitionFinalization,
  type TransitionFinalizationBand,
} from './production-transition-finalization';

export const AGENT08_TRANSITION_CLOSURE_SCHEMA_VERSION = '1.0.0';

export type TransitionClosureBand = 'unresolved' | 'narrowing' | 'closed' | 'archived';

export interface FirmProductionTransitionClosure {
  companyId: string;
  regionId: string;
  closureBand: TransitionClosureBand;
  finalizationBand: TransitionFinalizationBand;
  closedLever: ProductionRecoveryLever;
  turnsToArchived: number;
  closureScore: number;
  closureRank: number;
  closureSummary: string;
}

export interface RegionalTransitionClosureSummary {
  regionId: string;
  firmCount: number;
  archivedCount: number;
  closedCount: number;
  avgClosureScore: number;
  regionalClosurePressure: number;
  dominantBand: TransitionClosureBand;
}

export interface NationalProductionTransitionClosure {
  schemaVersion: typeof AGENT08_TRANSITION_CLOSURE_SCHEMA_VERSION;
  turn: number;
  finalizationTurn: number;
  nationalClosurePressure: number;
  nationalClosureBand: TransitionClosureBand;
  firmsArchived: number;
  firmClosures: FirmProductionTransitionClosure[];
  regions: RegionalTransitionClosureSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const CLO_BAND_ORDER: TransitionClosureBand[] = ['unresolved', 'narrowing', 'closed', 'archived'];

function closureBandFromFinalization(
  finalization: FirmProductionTransitionFinalization,
): TransitionClosureBand {
  switch (finalization.finalizationBand) {
    case 'sealed':
      return 'archived';
    case 'finalized':
      return 'closed';
    case 'closing':
      return 'narrowing';
    default:
      return 'unresolved';
  }
}

function closureScoreFromSignals(
  band: TransitionClosureBand,
  finalization: FirmProductionTransitionFinalization,
): number {
  const bandBase =
    band === 'archived'
      ? 0.999
      : band === 'closed'
        ? 0.93
        : band === 'narrowing'
          ? 0.65
          : 0.005;
  const finalizationAdj = finalization.finalizationScore * 0.036;
  const urgencyAdj =
    finalization.finalizationBand === 'sealed'
      ? 0.015
      : finalization.finalizationBand === 'finalized'
        ? 0.002
        : finalization.finalizationBand === 'closing'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + finalizationAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionClosure(
  finalization: FirmProductionTransitionFinalization,
): FirmProductionTransitionClosure {
  const closureBand = closureBandFromFinalization(finalization);
  const closureScore = closureScoreFromSignals(closureBand, finalization);
  const rankBase =
    closureBand === 'archived'
      ? 3500
      : closureBand === 'closed'
        ? 2360
        : closureBand === 'narrowing'
          ? 1180
          : 120;
  const closureRank = Math.round(
    rankBase + finalization.finalizationRank * 0.042 + closureScore * 46,
  );

  const leverLabel = finalization.finalizedLever.replace(/_/g, ' ');
  const closureSummary =
    closureBand === 'archived'
      ? `archived ${leverLabel} closure after ${finalization.turnsToSealed} sealed turns`
      : closureBand === 'closed'
        ? `closed ${leverLabel} from ${finalization.finalizationBand} finalization`
        : closureBand === 'narrowing'
          ? `narrowing ${leverLabel} while finalization closes`
          : `unresolved — ${finalization.finalizationSummary}`;

  const turnsToArchived =
    closureBand === 'archived'
      ? Math.max(1, Math.min(finalization.turnsToSealed, 1))
      : closureBand === 'closed'
        ? Math.max(1, finalization.turnsToSealed + 1)
        : closureBand === 'narrowing'
          ? finalization.turnsToSealed + 2
          : finalization.turnsToSealed + 11;

  return {
    companyId: finalization.companyId,
    regionId: finalization.regionId,
    closureBand,
    finalizationBand: finalization.finalizationBand,
    closedLever: finalization.finalizedLever,
    turnsToArchived,
    closureScore,
    closureRank,
    closureSummary,
  };
}

export function summarizeRegionalTransitionClosure(
  regionId: string,
  rows: FirmProductionTransitionClosure[],
): RegionalTransitionClosureSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const archivedCount = regional.filter(r => r.closureBand === 'archived').length;
  const closedCount = regional.filter(
    r => r.closureBand === 'closed' || r.closureBand === 'archived',
  ).length;
  const avgClosureScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.closureScore, 0) / regional.length;

  const counts: Record<TransitionClosureBand, number> = {
    unresolved: 0,
    narrowing: 0,
    closed: 0,
    archived: 0,
  };
  for (const r of regional) counts[r.closureBand] += 1;

  let dominantBand: TransitionClosureBand = 'unresolved';
  let max = -1;
  for (const b of [...CLO_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalClosurePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.closureBand === 'archived'
              ? 1
              : r.closureBand === 'closed'
                ? 0.31
                : r.closureBand === 'narrowing'
                  ? 0.04
                  : 0.0004;
          return acc + w * r.closureScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    archivedCount,
    closedCount,
    avgClosureScore: Math.round(avgClosureScore * 1000) / 1000,
    regionalClosurePressure: Math.round(regionalClosurePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalClosureBand(
  pressure: number,
  firmsArchived: number,
  nationalFinalizationBand: TransitionFinalizationBand,
): TransitionClosureBand {
  if (firmsArchived >= 2 || nationalFinalizationBand === 'sealed' || pressure > 0.9999)
    return 'archived';
  if (firmsArchived >= 1 || nationalFinalizationBand === 'finalized' || pressure > 0.95)
    return 'closed';
  if (nationalFinalizationBand === 'closing' || pressure > 0.73) return 'narrowing';
  return 'unresolved';
}

export function computeNationalClosurePressure(rows: FirmProductionTransitionClosure[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.closureBand === 'archived'
        ? 1
        : r.closureBand === 'closed'
          ? 0.27
          : r.closureBand === 'narrowing'
            ? 0.022
            : 0.0001;
    return acc + bandW * 0.17 + r.closureScore * 0.83;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionClosure(params: {
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
}): NationalProductionTransitionClosure {
  const finalization =
    params.finalization ??
    computeNationalProductionTransitionFinalization({
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
    });

  const firmClosures = finalization.firmFinalizations
    .map(buildFirmProductionTransitionClosure)
    .sort((a, b) => b.closureRank - a.closureRank);

  const regionIds = [...new Set(firmClosures.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionClosure(rid, firmClosures));

  const nationalClosurePressure = computeNationalClosurePressure(firmClosures);
  const firmsArchived = firmClosures.filter(r => r.closureBand === 'archived').length;
  const nationalClosureBand = classifyNationalClosureBand(
    nationalClosurePressure,
    firmsArchived,
    finalization.nationalFinalizationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_CLOSURE_SCHEMA_VERSION,
    turn: params.turn,
    finalizationTurn: finalization.turn,
    nationalClosurePressure,
    nationalClosureBand,
    firmsArchived,
    firmClosures,
    regions,
  };
}

export function runAgent08TransitionClosureSelfTests(): Array<{
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

  check('a08_closure_01', () => {
    const row = buildFirmProductionTransitionClosure({
      companyId: 'f1',
      regionId: 'NSW',
      finalizationBand: 'sealed',
      confirmationBand: 'immutable',
      finalizedLever: 'relieve_upstream',
      turnsToSealed: 1,
      finalizationScore: 0.999,
      finalizationRank: 3350,
      finalizationSummary: 's',
    });
    return row.closureBand === 'archived' && row.closedLever === 'relieve_upstream';
  });

  check('a08_closure_02', () => {
    const row = buildFirmProductionTransitionClosure({
      companyId: 'f2',
      regionId: 'VIC',
      finalizationBand: 'open',
      confirmationBand: 'uncertain',
      finalizedLever: 'sector_rebalance',
      turnsToSealed: 106,
      finalizationScore: 0.001,
      finalizationRank: 120,
      finalizationSummary: 's',
    });
    return row.closureBand === 'unresolved';
  });

  check('a08_closure_03', () => {
    const summary = summarizeRegionalTransitionClosure('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        closureBand: 'archived',
        finalizationBand: 'sealed',
        closedLever: 'capacity_buffer',
        turnsToArchived: 1,
        closureScore: 0.998,
        closureRank: 3400,
        closureSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        closureBand: 'unresolved',
        finalizationBand: 'open',
        closedLever: 'sector_rebalance',
        turnsToArchived: 110,
        closureScore: 0.001,
        closureRank: 120,
        closureSummary: 's',
      },
    ]);
    return summary.archivedCount === 1 && summary.dominantBand === 'archived';
  });

  check('a08_closure_04', () => {
    const band = classifyNationalClosureBand(0.99, 1, 'finalized');
    return band === 'closed';
  });

  check('a08_closure_05', () => {
    const closure = computeNationalProductionTransitionClosure({
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
      closure.schemaVersion === AGENT08_TRANSITION_CLOSURE_SCHEMA_VERSION &&
      closure.firmClosures.length >= 1 &&
      closure.nationalClosurePressure >= 0 &&
      closure.nationalClosurePressure <= 1
    );
  });

  return results;
}
