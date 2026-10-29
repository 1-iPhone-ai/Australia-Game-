/**
 * Agent 08 round 43 (O10-217) — transition retirement posture from settlement bands.
 * Non-authoritative planning layer (retirement bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionSettlement,
  type FirmProductionTransitionSettlement,
  type NationalProductionTransitionSettlement,
  type TransitionSettlementBand,
} from './production-transition-settlement';

export const AGENT08_TRANSITION_RETIREMENT_SCHEMA_VERSION = '1.0.0';

export type TransitionRetirementBand = 'active' | 'winding' | 'retired' | 'memorialized';

export interface FirmProductionTransitionRetirement {
  companyId: string;
  regionId: string;
  retirementBand: TransitionRetirementBand;
  settlementBand: TransitionSettlementBand;
  retiredLever: ProductionRecoveryLever;
  turnsToMemorialized: number;
  retirementScore: number;
  retirementRank: number;
  retirementSummary: string;
}

export interface RegionalTransitionRetirementSummary {
  regionId: string;
  firmCount: number;
  memorializedCount: number;
  retiredCount: number;
  avgRetirementScore: number;
  regionalRetirementPressure: number;
  dominantBand: TransitionRetirementBand;
}

export interface NationalProductionTransitionRetirement {
  schemaVersion: typeof AGENT08_TRANSITION_RETIREMENT_SCHEMA_VERSION;
  turn: number;
  settlementTurn: number;
  nationalRetirementPressure: number;
  nationalRetirementBand: TransitionRetirementBand;
  firmsMemorialized: number;
  firmRetirements: FirmProductionTransitionRetirement[];
  regions: RegionalTransitionRetirementSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RET_BAND_ORDER: TransitionRetirementBand[] = ['active', 'winding', 'retired', 'memorialized'];

function retirementBandFromSettlement(
  settlement: FirmProductionTransitionSettlement,
): TransitionRetirementBand {
  switch (settlement.settlementBand) {
    case 'discharged':
      return 'memorialized';
    case 'settled':
      return 'retired';
    case 'negotiating':
      return 'winding';
    default:
      return 'active';
  }
}

function retirementScoreFromSignals(
  band: TransitionRetirementBand,
  settlement: FirmProductionTransitionSettlement,
): number {
  const bandBase =
    band === 'memorialized'
      ? 0.999
      : band === 'retired'
        ? 0.97
        : band === 'winding'
          ? 0.69
          : 0.001;
  const settlementAdj = settlement.settlementScore * 0.028;
  const urgencyAdj =
    settlement.settlementBand === 'discharged'
      ? 0.011
      : settlement.settlementBand === 'settled'
        ? 0.002
        : settlement.settlementBand === 'negotiating'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + settlementAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionRetirement(
  settlement: FirmProductionTransitionSettlement,
): FirmProductionTransitionRetirement {
  const retirementBand = retirementBandFromSettlement(settlement);
  const retirementScore = retirementScoreFromSignals(retirementBand, settlement);
  const rankBase =
    retirementBand === 'memorialized'
      ? 3900
      : retirementBand === 'retired'
        ? 2680
        : retirementBand === 'winding'
          ? 1260
          : 70;
  const retirementRank = Math.round(
    rankBase + settlement.settlementRank * 0.034 + retirementScore * 38,
  );

  const leverLabel = settlement.settledLever.replace(/_/g, ' ');
  const retirementSummary =
    retirementBand === 'memorialized'
      ? `memorialized ${leverLabel} retirement after ${settlement.turnsToDischarged} discharged turns`
      : retirementBand === 'retired'
        ? `retired ${leverLabel} from ${settlement.settlementBand} settlement`
        : retirementBand === 'winding'
          ? `winding ${leverLabel} while settlement negotiates`
          : `active — ${settlement.settlementSummary}`;

  const turnsToMemorialized =
    retirementBand === 'memorialized'
      ? Math.max(1, Math.min(settlement.turnsToDischarged, 1))
      : retirementBand === 'retired'
        ? Math.max(1, settlement.turnsToDischarged + 1)
        : retirementBand === 'winding'
          ? settlement.turnsToDischarged + 2
          : settlement.turnsToDischarged + 7;

  return {
    companyId: settlement.companyId,
    regionId: settlement.regionId,
    retirementBand,
    settlementBand: settlement.settlementBand,
    retiredLever: settlement.settledLever,
    turnsToMemorialized,
    retirementScore,
    retirementRank,
    retirementSummary,
  };
}

export function summarizeRegionalTransitionRetirement(
  regionId: string,
  rows: FirmProductionTransitionRetirement[],
): RegionalTransitionRetirementSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const memorializedCount = regional.filter(r => r.retirementBand === 'memorialized').length;
  const retiredCount = regional.filter(
    r => r.retirementBand === 'retired' || r.retirementBand === 'memorialized',
  ).length;
  const avgRetirementScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.retirementScore, 0) / regional.length;

  const counts: Record<TransitionRetirementBand, number> = {
    active: 0,
    winding: 0,
    retired: 0,
    memorialized: 0,
  };
  for (const r of regional) counts[r.retirementBand] += 1;

  let dominantBand: TransitionRetirementBand = 'active';
  let max = -1;
  for (const b of [...RET_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalRetirementPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.retirementBand === 'memorialized'
              ? 1
              : r.retirementBand === 'retired'
                ? 0.27
                : r.retirementBand === 'winding'
                  ? 0.028
                  : 0.0001;
          return acc + w * r.retirementScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    memorializedCount,
    retiredCount,
    avgRetirementScore: Math.round(avgRetirementScore * 1000) / 1000,
    regionalRetirementPressure: Math.round(regionalRetirementPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalRetirementBand(
  pressure: number,
  firmsMemorialized: number,
  nationalSettlementBand: TransitionSettlementBand,
): TransitionRetirementBand {
  if (firmsMemorialized >= 2 || nationalSettlementBand === 'discharged' || pressure > 0.999995)
    return 'memorialized';
  if (firmsMemorialized >= 1 || nationalSettlementBand === 'settled' || pressure > 0.985)
    return 'retired';
  if (nationalSettlementBand === 'negotiating' || pressure > 0.77) return 'winding';
  return 'active';
}

export function computeNationalRetirementPressure(
  rows: FirmProductionTransitionRetirement[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.retirementBand === 'memorialized'
        ? 1
        : r.retirementBand === 'retired'
          ? 0.23
          : r.retirementBand === 'winding'
            ? 0.014
            : 0.00002;
    return acc + bandW * 0.13 + r.retirementScore * 0.87;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionRetirement(params: {
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
}): NationalProductionTransitionRetirement {
  const settlement =
    params.settlement ??
    computeNationalProductionTransitionSettlement({
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
    });

  const firmRetirements = settlement.firmSettlements
    .map(buildFirmProductionTransitionRetirement)
    .sort((a, b) => b.retirementRank - a.retirementRank);

  const regionIds = [...new Set(firmRetirements.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionRetirement(rid, firmRetirements));

  const nationalRetirementPressure = computeNationalRetirementPressure(firmRetirements);
  const firmsMemorialized = firmRetirements.filter(r => r.retirementBand === 'memorialized').length;
  const nationalRetirementBand = classifyNationalRetirementBand(
    nationalRetirementPressure,
    firmsMemorialized,
    settlement.nationalSettlementBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_RETIREMENT_SCHEMA_VERSION,
    turn: params.turn,
    settlementTurn: settlement.turn,
    nationalRetirementPressure,
    nationalRetirementBand,
    firmsMemorialized,
    firmRetirements,
    regions,
  };
}

export function runAgent08TransitionRetirementSelfTests(): Array<{
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

  check('a08_retirement_01', () => {
    const row = buildFirmProductionTransitionRetirement({
      companyId: 'f1',
      regionId: 'NSW',
      settlementBand: 'discharged',
      resolutionBand: 'terminal',
      settledLever: 'relieve_upstream',
      turnsToDischarged: 1,
      settlementScore: 0.999,
      settlementRank: 3750,
      settlementSummary: 's',
    });
    return row.retirementBand === 'memorialized' && row.retiredLever === 'relieve_upstream';
  });

  check('a08_retirement_02', () => {
    const row = buildFirmProductionTransitionRetirement({
      companyId: 'f2',
      regionId: 'VIC',
      settlementBand: 'unsettled',
      resolutionBand: 'open',
      settledLever: 'sector_rebalance',
      turnsToDischarged: 114,
      settlementScore: 0.001,
      settlementRank: 70,
      settlementSummary: 's',
    });
    return row.retirementBand === 'active';
  });

  check('a08_retirement_03', () => {
    const summary = summarizeRegionalTransitionRetirement('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        retirementBand: 'memorialized',
        settlementBand: 'discharged',
        retiredLever: 'capacity_buffer',
        turnsToMemorialized: 1,
        retirementScore: 0.998,
        retirementRank: 3800,
        retirementSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        retirementBand: 'active',
        settlementBand: 'unsettled',
        retiredLever: 'sector_rebalance',
        turnsToMemorialized: 118,
        retirementScore: 0.001,
        retirementRank: 70,
        retirementSummary: 's',
      },
    ]);
    return summary.memorializedCount === 1 && summary.dominantBand === 'memorialized';
  });

  check('a08_retirement_04', () => {
    const band = classifyNationalRetirementBand(0.994, 1, 'settled');
    return band === 'retired';
  });

  check('a08_retirement_05', () => {
    const retirement = computeNationalProductionTransitionRetirement({
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
      retirement.schemaVersion === AGENT08_TRANSITION_RETIREMENT_SCHEMA_VERSION &&
      retirement.firmRetirements.length >= 1 &&
      retirement.nationalRetirementPressure >= 0 &&
      retirement.nationalRetirementPressure <= 1
    );
  });

  return results;
}
