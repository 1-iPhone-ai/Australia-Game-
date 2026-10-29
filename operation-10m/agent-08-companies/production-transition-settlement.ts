/**
 * Agent 08 round 42 (O10-215) — transition settlement posture from resolution bands.
 * Non-authoritative planning layer (settlement bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionResolution,
  type FirmProductionTransitionResolution,
  type NationalProductionTransitionResolution,
  type TransitionResolutionBand,
} from './production-transition-resolution';

export const AGENT08_TRANSITION_SETTLEMENT_SCHEMA_VERSION = '1.0.0';

export type TransitionSettlementBand = 'unsettled' | 'negotiating' | 'settled' | 'discharged';

export interface FirmProductionTransitionSettlement {
  companyId: string;
  regionId: string;
  settlementBand: TransitionSettlementBand;
  resolutionBand: TransitionResolutionBand;
  settledLever: ProductionRecoveryLever;
  turnsToDischarged: number;
  settlementScore: number;
  settlementRank: number;
  settlementSummary: string;
}

export interface RegionalTransitionSettlementSummary {
  regionId: string;
  firmCount: number;
  dischargedCount: number;
  settledCount: number;
  avgSettlementScore: number;
  regionalSettlementPressure: number;
  dominantBand: TransitionSettlementBand;
}

export interface NationalProductionTransitionSettlement {
  schemaVersion: typeof AGENT08_TRANSITION_SETTLEMENT_SCHEMA_VERSION;
  turn: number;
  resolutionTurn: number;
  nationalSettlementPressure: number;
  nationalSettlementBand: TransitionSettlementBand;
  firmsDischarged: number;
  firmSettlements: FirmProductionTransitionSettlement[];
  regions: RegionalTransitionSettlementSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const SET_BAND_ORDER: TransitionSettlementBand[] = ['unsettled', 'negotiating', 'settled', 'discharged'];

function settlementBandFromResolution(
  resolution: FirmProductionTransitionResolution,
): TransitionSettlementBand {
  switch (resolution.resolutionBand) {
    case 'terminal':
      return 'discharged';
    case 'resolved':
      return 'settled';
    case 'converging':
      return 'negotiating';
    default:
      return 'unsettled';
  }
}

function settlementScoreFromSignals(
  band: TransitionSettlementBand,
  resolution: FirmProductionTransitionResolution,
): number {
  const bandBase =
    band === 'discharged'
      ? 0.999
      : band === 'settled'
        ? 0.96
        : band === 'negotiating'
          ? 0.68
          : 0.002;
  const resolutionAdj = resolution.resolutionScore * 0.03;
  const urgencyAdj =
    resolution.resolutionBand === 'terminal'
      ? 0.012
      : resolution.resolutionBand === 'resolved'
        ? 0.002
        : resolution.resolutionBand === 'converging'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + resolutionAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionSettlement(
  resolution: FirmProductionTransitionResolution,
): FirmProductionTransitionSettlement {
  const settlementBand = settlementBandFromResolution(resolution);
  const settlementScore = settlementScoreFromSignals(settlementBand, resolution);
  const rankBase =
    settlementBand === 'discharged'
      ? 3800
      : settlementBand === 'settled'
        ? 2600
        : settlementBand === 'negotiating'
          ? 1240
          : 80;
  const settlementRank = Math.round(
    rankBase + resolution.resolutionRank * 0.036 + settlementScore * 40,
  );

  const leverLabel = resolution.resolvedLever.replace(/_/g, ' ');
  const settlementSummary =
    settlementBand === 'discharged'
      ? `discharged ${leverLabel} settlement after ${resolution.turnsToTerminal} terminal turns`
      : settlementBand === 'settled'
        ? `settled ${leverLabel} from ${resolution.resolutionBand} resolution`
        : settlementBand === 'negotiating'
          ? `negotiating ${leverLabel} while resolution converges`
          : `unsettled — ${resolution.resolutionSummary}`;

  const turnsToDischarged =
    settlementBand === 'discharged'
      ? Math.max(1, Math.min(resolution.turnsToTerminal, 1))
      : settlementBand === 'settled'
        ? Math.max(1, resolution.turnsToTerminal + 1)
        : settlementBand === 'negotiating'
          ? resolution.turnsToTerminal + 2
          : resolution.turnsToTerminal + 8;

  return {
    companyId: resolution.companyId,
    regionId: resolution.regionId,
    settlementBand,
    resolutionBand: resolution.resolutionBand,
    settledLever: resolution.resolvedLever,
    turnsToDischarged,
    settlementScore,
    settlementRank,
    settlementSummary,
  };
}

export function summarizeRegionalTransitionSettlement(
  regionId: string,
  rows: FirmProductionTransitionSettlement[],
): RegionalTransitionSettlementSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const dischargedCount = regional.filter(r => r.settlementBand === 'discharged').length;
  const settledCount = regional.filter(
    r => r.settlementBand === 'settled' || r.settlementBand === 'discharged',
  ).length;
  const avgSettlementScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.settlementScore, 0) / regional.length;

  const counts: Record<TransitionSettlementBand, number> = {
    unsettled: 0,
    negotiating: 0,
    settled: 0,
    discharged: 0,
  };
  for (const r of regional) counts[r.settlementBand] += 1;

  let dominantBand: TransitionSettlementBand = 'unsettled';
  let max = -1;
  for (const b of [...SET_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalSettlementPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.settlementBand === 'discharged'
              ? 1
              : r.settlementBand === 'settled'
                ? 0.28
                : r.settlementBand === 'negotiating'
                  ? 0.03
                  : 0.00015;
          return acc + w * r.settlementScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    dischargedCount,
    settledCount,
    avgSettlementScore: Math.round(avgSettlementScore * 1000) / 1000,
    regionalSettlementPressure: Math.round(regionalSettlementPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalSettlementBand(
  pressure: number,
  firmsDischarged: number,
  nationalResolutionBand: TransitionResolutionBand,
): TransitionSettlementBand {
  if (firmsDischarged >= 2 || nationalResolutionBand === 'terminal' || pressure > 0.99999)
    return 'discharged';
  if (firmsDischarged >= 1 || nationalResolutionBand === 'resolved' || pressure > 0.98)
    return 'settled';
  if (nationalResolutionBand === 'converging' || pressure > 0.76) return 'negotiating';
  return 'unsettled';
}

export function computeNationalSettlementPressure(
  rows: FirmProductionTransitionSettlement[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.settlementBand === 'discharged'
        ? 1
        : r.settlementBand === 'settled'
          ? 0.24
          : r.settlementBand === 'negotiating'
            ? 0.016
            : 0.00003;
    return acc + bandW * 0.14 + r.settlementScore * 0.86;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionSettlement(params: {
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
}): NationalProductionTransitionSettlement {
  const resolution =
    params.resolution ??
    computeNationalProductionTransitionResolution({
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
    });

  const firmSettlements = resolution.firmResolutions
    .map(buildFirmProductionTransitionSettlement)
    .sort((a, b) => b.settlementRank - a.settlementRank);

  const regionIds = [...new Set(firmSettlements.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionSettlement(rid, firmSettlements));

  const nationalSettlementPressure = computeNationalSettlementPressure(firmSettlements);
  const firmsDischarged = firmSettlements.filter(r => r.settlementBand === 'discharged').length;
  const nationalSettlementBand = classifyNationalSettlementBand(
    nationalSettlementPressure,
    firmsDischarged,
    resolution.nationalResolutionBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_SETTLEMENT_SCHEMA_VERSION,
    turn: params.turn,
    resolutionTurn: resolution.turn,
    nationalSettlementPressure,
    nationalSettlementBand,
    firmsDischarged,
    firmSettlements,
    regions,
  };
}

export function runAgent08TransitionSettlementSelfTests(): Array<{
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

  check('a08_settlement_01', () => {
    const row = buildFirmProductionTransitionSettlement({
      companyId: 'f1',
      regionId: 'NSW',
      resolutionBand: 'terminal',
      completionBand: 'perpetual',
      resolvedLever: 'relieve_upstream',
      turnsToTerminal: 1,
      resolutionScore: 0.999,
      resolutionRank: 3650,
      resolutionSummary: 's',
    });
    return row.settlementBand === 'discharged' && row.settledLever === 'relieve_upstream';
  });

  check('a08_settlement_02', () => {
    const row = buildFirmProductionTransitionSettlement({
      companyId: 'f2',
      regionId: 'VIC',
      resolutionBand: 'open',
      completionBand: 'outstanding',
      resolvedLever: 'sector_rebalance',
      turnsToTerminal: 112,
      resolutionScore: 0.001,
      resolutionRank: 80,
      resolutionSummary: 's',
    });
    return row.settlementBand === 'unsettled';
  });

  check('a08_settlement_03', () => {
    const summary = summarizeRegionalTransitionSettlement('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        settlementBand: 'discharged',
        resolutionBand: 'terminal',
        settledLever: 'capacity_buffer',
        turnsToDischarged: 1,
        settlementScore: 0.998,
        settlementRank: 3700,
        settlementSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        settlementBand: 'unsettled',
        resolutionBand: 'open',
        settledLever: 'sector_rebalance',
        turnsToDischarged: 116,
        settlementScore: 0.001,
        settlementRank: 80,
        settlementSummary: 's',
      },
    ]);
    return summary.dischargedCount === 1 && summary.dominantBand === 'discharged';
  });

  check('a08_settlement_04', () => {
    const band = classifyNationalSettlementBand(0.993, 1, 'resolved');
    return band === 'settled';
  });

  check('a08_settlement_05', () => {
    const settlement = computeNationalProductionTransitionSettlement({
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
      settlement.schemaVersion === AGENT08_TRANSITION_SETTLEMENT_SCHEMA_VERSION &&
      settlement.firmSettlements.length >= 1 &&
      settlement.nationalSettlementPressure >= 0 &&
      settlement.nationalSettlementPressure <= 1
    );
  });

  return results;
}
