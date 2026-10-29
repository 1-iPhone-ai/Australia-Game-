/**
 * Agent 08 round 15 — turn transition horizon from readiness portfolio and operating priorities.
 * Non-authoritative forward-looking planning layer (horizon bands, not enforcement).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import {
  computeNationalProductionOperatingPriorities,
  type FirmProductionOperatingPriority,
  type NationalProductionOperatingPriorities,
} from './production-operating-priorities';
import {
  computeNationalProductionReadinessPortfolio,
  type FirmProductionReadinessRow,
  type NationalProductionReadinessPortfolio,
  type ProductionReadinessTier,
} from './production-readiness-portfolio';
import type { ProductionRecoveryLever } from './production-recovery-playbook';

export const AGENT08_TRANSITION_HORIZON_SCHEMA_VERSION = '1.0.0';

export type TransitionHorizonBand = 'near_term' | 'mid_turn' | 'extended';

export type TransitionRiskBand = 'low' | 'moderate' | 'elevated' | 'severe';

export interface FirmProductionTransitionOutlook {
  companyId: string;
  regionId: string;
  horizonBand: TransitionHorizonBand;
  transitionRisk: TransitionRiskBand;
  estimatedTurnsToStabilize: number;
  suggestedLever: ProductionRecoveryLever;
  readinessTier: ProductionReadinessTier;
  transitionRank: number;
  outlookSummary: string;
}

export interface RegionalTransitionHorizonSummary {
  regionId: string;
  firmCount: number;
  nearTermCount: number;
  severeRiskCount: number;
  avgEstimatedTurns: number;
  dominantHorizon: TransitionHorizonBand;
  regionalTransitionPressure: number;
}

export interface NationalProductionTransitionHorizon {
  schemaVersion: typeof AGENT08_TRANSITION_HORIZON_SCHEMA_VERSION;
  turn: number;
  portfolioTurn: number;
  nationalTransitionPressure: number;
  nationalTransitionRisk: TransitionRiskBand;
  dominantHorizon: TransitionHorizonBand;
  firmOutlooks: FirmProductionTransitionOutlook[];
  regions: RegionalTransitionHorizonSummary[];
  firmsNeedingNearTermAction: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const HORIZON_ORDER: TransitionHorizonBand[] = ['near_term', 'mid_turn', 'extended'];

function estimatedTurnsToStabilize(
  tier: ProductionReadinessTier,
  operatingPressure: number,
  priorityBand: FirmProductionOperatingPriority['priorityBand'],
): number {
  const base =
    tier === 'impaired' ? 8 : tier === 'fragile' ? 5 : tier === 'constrained' ? 3 : 1;
  const pressureLag = Math.ceil(operatingPressure * 6);
  const priorityLag =
    priorityBand === 'intervene' ? 2 : priorityBand === 'escalate' ? 1 : priorityBand === 'monitor' ? 1 : 0;
  return clamp(base + pressureLag + priorityLag, 1, 18);
}

function horizonFromTurns(turns: number): TransitionHorizonBand {
  if (turns <= 3) return 'near_term';
  if (turns <= 7) return 'mid_turn';
  return 'extended';
}

function transitionRiskFromSignals(
  tier: ProductionReadinessTier,
  operatingPressure: number,
  priorityBand: FirmProductionOperatingPriority['priorityBand'],
): TransitionRiskBand {
  if (tier === 'impaired' || priorityBand === 'intervene') return 'severe';
  if (tier === 'fragile' || priorityBand === 'escalate' || operatingPressure > 0.65) return 'elevated';
  if (tier === 'constrained' || operatingPressure > 0.4) return 'moderate';
  return 'low';
}

export function buildFirmProductionTransitionOutlook(params: {
  readiness: FirmProductionReadinessRow;
  priority?: FirmProductionOperatingPriority;
}): FirmProductionTransitionOutlook {
  const priorityBand = params.priority?.priorityBand ?? 'defer';
  const suggestedLever = params.priority?.suggestedLever ?? 'capacity_buffer';
  const estimatedTurnsToStabilizeValue = estimatedTurnsToStabilize(
    params.readiness.readinessTier,
    params.readiness.operatingPressure,
    priorityBand,
  );
  const transitionRisk = transitionRiskFromSignals(
    params.readiness.readinessTier,
    params.readiness.operatingPressure,
    priorityBand,
  );
  const horizonTurns =
    transitionRisk === 'severe' ? Math.min(estimatedTurnsToStabilizeValue, 3) : estimatedTurnsToStabilizeValue;
  const horizonBand = horizonFromTurns(horizonTurns);

  const rankBase =
    transitionRisk === 'severe' ? 1000 : transitionRisk === 'elevated' ? 620 : transitionRisk === 'moderate' ? 280 : 90;
  const transitionRank = Math.round(
    rankBase + estimatedTurnsToStabilizeValue * 15 + params.readiness.operatingPressure * 70,
  );

  const outlookSummary =
    horizonBand === 'near_term'
      ? `near-term stabilization (~${estimatedTurnsToStabilizeValue} turns) via ${suggestedLever.replace(/_/g, ' ')}`
      : horizonBand === 'mid_turn'
        ? `mid-turn horizon — ${params.readiness.readinessTier} readiness`
        : `extended horizon — maintain ${suggestedLever.replace(/_/g, ' ')} watch`;

  return {
    companyId: params.readiness.companyId,
    regionId: params.readiness.regionId,
    horizonBand,
    transitionRisk,
    estimatedTurnsToStabilize: estimatedTurnsToStabilizeValue,
    suggestedLever,
    readinessTier: params.readiness.readinessTier,
    transitionRank,
    outlookSummary,
  };
}

export function summarizeRegionalTransitionHorizon(
  regionId: string,
  outlooks: FirmProductionTransitionOutlook[],
): RegionalTransitionHorizonSummary {
  const regional = outlooks.filter(o => o.regionId === regionId);
  const nearTermCount = regional.filter(o => o.horizonBand === 'near_term').length;
  const severeRiskCount = regional.filter(o => o.transitionRisk === 'severe').length;
  const avgEstimatedTurns =
    regional.length === 0
      ? 0
      : regional.reduce((a, o) => a + o.estimatedTurnsToStabilize, 0) / regional.length;

  const counts: Record<TransitionHorizonBand, number> = {
    near_term: 0,
    mid_turn: 0,
    extended: 0,
  };
  for (const o of regional) counts[o.horizonBand] += 1;

  let dominantHorizon: TransitionHorizonBand = 'extended';
  let max = -1;
  for (const h of HORIZON_ORDER) {
    if (counts[h] > max) {
      max = counts[h];
      dominantHorizon = h;
    }
  }

  const regionalTransitionPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, o) => {
          const w =
            o.transitionRisk === 'severe'
              ? 1
              : o.transitionRisk === 'elevated'
                ? 0.65
                : o.transitionRisk === 'moderate'
                  ? 0.35
                  : 0.12;
          return acc + w * (o.estimatedTurnsToStabilize / 12);
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    nearTermCount,
    severeRiskCount,
    avgEstimatedTurns: Math.round(avgEstimatedTurns * 100) / 100,
    dominantHorizon,
    regionalTransitionPressure: Math.round(regionalTransitionPressure * 1000) / 1000,
  };
}

export function classifyNationalTransitionRisk(
  pressure: number,
  firmsNeedingNearTermAction: number,
  portfolioTier: ProductionReadinessTier,
): TransitionRiskBand {
  if (portfolioTier === 'impaired' || firmsNeedingNearTermAction >= 3 || pressure > 0.72) return 'severe';
  if (firmsNeedingNearTermAction >= 1 || portfolioTier === 'fragile' || pressure > 0.5) return 'elevated';
  if (portfolioTier === 'constrained' || pressure > 0.32) return 'moderate';
  return 'low';
}

export function computeNationalTransitionPressure(outlooks: FirmProductionTransitionOutlook[]): number {
  if (outlooks.length === 0) return 0;
  const weighted = outlooks.reduce((acc, o) => {
    const riskW =
      o.transitionRisk === 'severe' ? 1 : o.transitionRisk === 'elevated' ? 0.6 : o.transitionRisk === 'moderate' ? 0.32 : 0.1;
    const horizonW = o.horizonBand === 'near_term' ? 0.35 : o.horizonBand === 'mid_turn' ? 0.2 : 0.08;
    return acc + riskW * 0.55 + horizonW;
  }, 0);
  return clamp(Math.round((weighted / outlooks.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionHorizon(params: {
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
  portfolio?: NationalProductionReadinessPortfolio;
  priorities?: NationalProductionOperatingPriorities;
}): NationalProductionTransitionHorizon {
  const priorities =
    params.priorities ??
    computeNationalProductionOperatingPriorities({
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
    });

  const portfolio =
    params.portfolio ??
    computeNationalProductionReadinessPortfolio({
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
      priorities,
    });

  const priorityByFirm = new Map(priorities.firmPriorities.map(p => [p.companyId, p] as const));

  const firmOutlooks = portfolio.firmRows
    .map(readiness =>
      buildFirmProductionTransitionOutlook({
        readiness,
        priority: priorityByFirm.get(readiness.companyId),
      }),
    )
    .sort((a, b) => b.transitionRank - a.transitionRank);

  const regionIds = [...new Set(firmOutlooks.map(o => o.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionHorizon(rid, firmOutlooks));

  const nationalTransitionPressure = computeNationalTransitionPressure(firmOutlooks);
  const firmsNeedingNearTermAction = firmOutlooks.filter(o => o.horizonBand === 'near_term').length;

  const nationalTransitionRisk = classifyNationalTransitionRisk(
    nationalTransitionPressure,
    firmsNeedingNearTermAction,
    portfolio.nationalReadinessTier,
  );

  const horizonCounts: Record<TransitionHorizonBand, number> = {
    near_term: 0,
    mid_turn: 0,
    extended: 0,
  };
  for (const o of firmOutlooks) horizonCounts[o.horizonBand] += 1;
  let dominantHorizon: TransitionHorizonBand = 'extended';
  let max = -1;
  for (const h of HORIZON_ORDER) {
    if (horizonCounts[h] >= max) {
      max = horizonCounts[h];
      dominantHorizon = h;
    }
  }

  return {
    schemaVersion: AGENT08_TRANSITION_HORIZON_SCHEMA_VERSION,
    turn: params.turn,
    portfolioTurn: portfolio.turn,
    nationalTransitionPressure,
    nationalTransitionRisk,
    dominantHorizon,
    firmOutlooks,
    regions,
    firmsNeedingNearTermAction,
  };
}

export function runAgent08TransitionHorizonSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_horizon_01', () => {
    return horizonFromTurns(2) === 'near_term' && horizonFromTurns(10) === 'extended';
  });

  check('a08_horizon_02', () => {
    const outlook = buildFirmProductionTransitionOutlook({
      readiness: {
        companyId: 'f1',
        regionId: 'NSW',
        readinessTier: 'impaired',
        readinessScore: 0.2,
        postureSlice: 'action',
        operatingPressure: 0.85,
        readinessRank: 1000,
        readinessNote: 'n',
      },
      priority: {
        companyId: 'f1',
        regionId: 'NSW',
        priorityBand: 'intervene',
        kind: 'relieve_capacity_bind',
        suggestedLever: 'relieve_upstream',
        priorityRank: 1100,
        reconciliationBand: 'conflict',
        operatingPressure: 0.85,
        prioritySummary: 's',
      },
    });
    return outlook.transitionRisk === 'severe' && outlook.horizonBand === 'near_term';
  });

  check('a08_horizon_03', () => {
    const summary = summarizeRegionalTransitionHorizon('VIC', [
      {
        companyId: 'a',
        regionId: 'VIC',
        horizonBand: 'near_term',
        transitionRisk: 'elevated',
        estimatedTurnsToStabilize: 3,
        suggestedLever: 'capacity_buffer',
        readinessTier: 'fragile',
        transitionRank: 500,
        outlookSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'VIC',
        horizonBand: 'extended',
        transitionRisk: 'low',
        estimatedTurnsToStabilize: 10,
        suggestedLever: 'sector_rebalance',
        readinessTier: 'ready',
        transitionRank: 100,
        outlookSummary: 's',
      },
    ]);
    return summary.nearTermCount === 1 && summary.dominantHorizon === 'near_term';
  });

  check('a08_horizon_04', () => {
    const risk = classifyNationalTransitionRisk(0.55, 1, 'fragile');
    return risk === 'elevated';
  });

  check('a08_horizon_05', () => {
    const horizon = computeNationalProductionTransitionHorizon({
      turn: 4,
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
            links: [
              {
                id: 'lk',
                fromRegionId: 'QLD',
                toRegionId: 'NSW',
                supply: 'energy',
                strength: 85,
                fragile: true,
                reason: 'dep',
              },
            ],
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
          QLD: {
            regionId: 'QLD',
            name: 'QLD',
            maturity: 'forming',
            anchorArchetype: 'energy',
            companyCount: 0,
            activeProduction: 12,
            supplyChainRole: 'provider',
            resilience: 'exposed',
            primaryConstraint: 'energy',
            revision: 1,
            links: [],
            companies: [],
          },
        },
        national: {
          leadingRegions: [],
          constrainedRegions: ['QLD'],
          dominantArchetypes: [],
          criticalDependencies: [],
          ecosystemOpportunity: null,
          ecosystemRisk: null,
          totalCompanies: 1,
          avgVitality: 1,
        },
        history: [],
        lastUpdatedTurn: 4,
        inputHash: 's',
        computeMs: 0,
      },
      livingRegions: {
        revision: 1,
        regions: { NSW: { momentum: { band: 'softening' }, sectors: { manufacturing: 70 } } },
      },
      industries: {
        revision: 1,
        regions: {
          QLD: {
            regionId: 'QLD',
            industries: {
              energy: {
                industry: 'energy',
                strength: 16,
                effectiveOutput: 7,
                utilization: 0.22,
                constraint: { kind: 'production_constraint' },
                outputs: [{ supply: 'energy', amount: 7 }],
              },
            },
            suppliedBy: [],
            primaryIndustrialConstraint: 'energy',
            resilience: 'exposed',
          },
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
      horizon.schemaVersion === AGENT08_TRANSITION_HORIZON_SCHEMA_VERSION &&
      horizon.firmOutlooks.length >= 1 &&
      horizon.nationalTransitionPressure >= 0 &&
      horizon.nationalTransitionPressure <= 1
    );
  });

  return results;
}
