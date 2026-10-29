/**
 * Agent 08 round 4 — deterministic recovery playbook from integrated production signals.
 * Suggests bounded levers for UI / World Reaction; never mutates authoritative industry state.
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import {
  computeNationalIntegratedProductionBrief,
  type FirmIntegratedProductionSignal,
  type NationalIntegratedProductionBrief,
  type RegionalIntegratedProductionSummary,
} from './integrated-production-synthesis';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalProductionCapacityCascade } from './production-capacity-cascade';
import { computeNationalProductionCapacityCascade } from './production-capacity-cascade';

export const AGENT08_RECOVERY_SCHEMA_VERSION = '1.0.0';

export type ProductionRecoveryLever =
  | 'diversify_supply'
  | 'relieve_upstream'
  | 'sector_rebalance'
  | 'labor_headroom'
  | 'capacity_buffer';

export type RecoveryPriorityBand = 'defer' | 'plan' | 'urgent' | 'immediate';

export interface FirmProductionRecoveryAction {
  companyId: string;
  regionId: string;
  compositePressure: number;
  priority: RecoveryPriorityBand;
  primaryLever: ProductionRecoveryLever;
  secondaryLever: ProductionRecoveryLever | null;
  expectedRelief: number;
  rationale: string[];
  evidence: string[];
}

export interface RegionalProductionRecoveryPlan {
  regionId: string;
  firmCount: number;
  stressedFirmCount: number;
  priority: RecoveryPriorityBand;
  dominantLever: ProductionRecoveryLever;
  avgExpectedRelief: number;
  topActions: FirmProductionRecoveryAction[];
}

export interface NationalProductionRecoveryPlaybook {
  schemaVersion: typeof AGENT08_RECOVERY_SCHEMA_VERSION;
  turn: number;
  briefTurn: number;
  nationalAvgPressure: number;
  actions: FirmProductionRecoveryAction[];
  regions: RegionalProductionRecoveryPlan[];
  immediateActionCount: number;
  upstreamReliefTargets: string[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

function priorityFromPressure(p: number): RecoveryPriorityBand {
  if (p < 0.28) return 'defer';
  if (p < 0.42) return 'plan';
  if (p < 0.58) return 'urgent';
  return 'immediate';
}

function leverReliefEstimate(lever: ProductionRecoveryLever, signal: FirmIntegratedProductionSignal): number {
  switch (lever) {
    case 'diversify_supply':
      return clamp(signal.supplyDepthStress * 0.35 + signal.cascadePressure * 0.15, 0.05, 0.45);
    case 'relieve_upstream':
      return clamp(signal.cascadePressure * 0.4 + signal.supplyDepthStress * 0.1, 0.05, 0.5);
    case 'sector_rebalance':
      return clamp(signal.sectorMisalignment * 0.45, 0.05, 0.4);
    case 'labor_headroom':
      return clamp(signal.taxLaborDrag * 0.5, 0.05, 0.35);
    case 'capacity_buffer':
      return clamp((signal.compositePressure - signal.supplyDepthStress * 0.3) * 0.35, 0.05, 0.3);
    default:
      return 0.1;
  }
}

export function rankRecoveryLeversForFirm(
  signal: FirmIntegratedProductionSignal,
): Array<{ lever: ProductionRecoveryLever; score: number; relief: number }> {
  const driverBoost = (tag: string, lever: ProductionRecoveryLever): number => {
    if (tag === 'supply_stress' && (lever === 'diversify_supply' || lever === 'capacity_buffer')) return 0.25;
    if (tag === 'upstream_cascade' && lever === 'relieve_upstream') return 0.3;
    if (tag === 'sector_mismatch' && lever === 'sector_rebalance') return 0.28;
    if (tag === 'tax_labor' && lever === 'labor_headroom') return 0.26;
    return 0;
  };

  const levers: ProductionRecoveryLever[] = [
    'diversify_supply',
    'relieve_upstream',
    'sector_rebalance',
    'labor_headroom',
    'capacity_buffer',
  ];

  return levers
    .map(lever => {
      const relief = leverReliefEstimate(lever, signal);
      const driverScore = signal.drivers.reduce((a, d) => a + driverBoost(d, lever), 0);
      const score = clamp(relief + driverScore + signal.compositePressure * 0.08, 0, 1.2);
      return { lever, score: Math.round(score * 1000) / 1000, relief: Math.round(relief * 1000) / 1000 };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildFirmProductionRecoveryAction(
  signal: FirmIntegratedProductionSignal,
  cascade?: NationalProductionCapacityCascade | null,
): FirmProductionRecoveryAction {
  const ranked = rankRecoveryLeversForFirm(signal);
  const primary = ranked[0]?.lever ?? 'capacity_buffer';
  const secondary = ranked[1] && ranked[1].score > ranked[0].score * 0.65 ? ranked[1].lever : null;
  const expectedRelief = clamp(
    (ranked[0]?.relief ?? 0.1) + (secondary ? (ranked[1]?.relief ?? 0) * 0.35 : 0),
    0.05,
    0.65,
  );

  const rationale: string[] = [];
  if (signal.drivers.includes('supply_stress')) rationale.push('supply_depth_elevated');
  if (signal.drivers.includes('upstream_cascade')) rationale.push('cascade_inbound');
  if (signal.drivers.includes('sector_mismatch')) rationale.push('sector_alignment_gap');
  if (signal.drivers.includes('tax_labor')) rationale.push('tax_labor_drag');

  const evidence: string[] = [`pressure:${signal.compositePressure}`, `band:${signal.riskBand}`];
  if (cascade && primary === 'relieve_upstream') {
    const edge = cascade.edges.find(e => e.consumerRegionId === signal.regionId);
    if (edge) evidence.push(`upstream:${edge.providerRegionId}:${edge.supply}`);
  }

  return {
    companyId: signal.companyId,
    regionId: signal.regionId,
    compositePressure: signal.compositePressure,
    priority: priorityFromPressure(signal.compositePressure),
    primaryLever: primary,
    secondaryLever: secondary,
    expectedRelief: Math.round(expectedRelief * 1000) / 1000,
    rationale,
    evidence,
  };
}

export function summarizeRegionalRecoveryPlan(
  region: RegionalIntegratedProductionSummary,
  actions: FirmProductionRecoveryAction[],
): RegionalProductionRecoveryPlan {
  const regionalActions = actions.filter(a => a.regionId === region.regionId);
  const stressedFirmCount = regionalActions.filter(
    a => a.priority === 'urgent' || a.priority === 'immediate',
  ).length;
  const leverCounts = new Map<ProductionRecoveryLever, number>();
  for (const a of regionalActions) {
    leverCounts.set(a.primaryLever, (leverCounts.get(a.primaryLever) ?? 0) + 1);
  }
  let dominantLever: ProductionRecoveryLever = 'capacity_buffer';
  let maxCount = 0;
  for (const [lever, count] of leverCounts) {
    if (count > maxCount) {
      maxCount = count;
      dominantLever = lever;
    }
  }
  const avgExpectedRelief = regionalActions.length
    ? regionalActions.reduce((a, x) => a + x.expectedRelief, 0) / regionalActions.length
    : 0;
  const topActions = [...regionalActions]
    .sort((a, b) => b.compositePressure - a.compositePressure)
    .slice(0, 3);

  return {
    regionId: region.regionId,
    firmCount: region.firmCount,
    stressedFirmCount,
    priority: priorityFromPressure(region.avgCompositePressure),
    dominantLever,
    avgExpectedRelief: Math.round(avgExpectedRelief * 1000) / 1000,
    topActions,
  };
}

export function computeNationalProductionRecoveryPlaybook(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
  workforce: NationalWorkforceState | null;
  fiscal: Agent08FiscalRegionSlice[] | null;
  brief?: NationalIntegratedProductionBrief;
}): NationalProductionRecoveryPlaybook {
  const brief =
    params.brief ??
    computeNationalIntegratedProductionBrief({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
      workforce: params.workforce,
      fiscal: params.fiscal,
    });

  const cascade = computeNationalProductionCapacityCascade({
    turn: params.turn,
    privateState: params.privateState,
    industries: params.industries,
  });

  const actions = brief.firms.map(f => buildFirmProductionRecoveryAction(f, cascade));
  const regions = brief.regions.map(r => summarizeRegionalRecoveryPlan(r, actions));
  const immediateActionCount = actions.filter(a => a.priority === 'immediate').length;

  const upstreamReliefTargets = [
    ...new Set(
      actions
        .filter(a => a.primaryLever === 'relieve_upstream')
        .flatMap(a => a.evidence.filter(e => e.startsWith('upstream:')).map(e => e.split(':')[1]))
        .filter(Boolean),
    ),
  ] as string[];

  return {
    schemaVersion: AGENT08_RECOVERY_SCHEMA_VERSION,
    turn: params.turn,
    briefTurn: brief.turn,
    nationalAvgPressure: brief.nationalAvgPressure,
    actions,
    regions,
    immediateActionCount,
    upstreamReliefTargets,
  };
}

export function runAgent08RecoverySelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  const stressedSignal: FirmIntegratedProductionSignal = {
    companyId: 'c1',
    regionId: 'NSW',
    compositePressure: 0.62,
    riskBand: 'critical',
    supplyDepthStress: 0.72,
    sectorMisalignment: 0.15,
    cascadePressure: 0.48,
    taxLaborDrag: 0.1,
    drivers: ['supply_stress', 'upstream_cascade'],
  };

  check('a08_rec_01', () => {
    const ranked = rankRecoveryLeversForFirm(stressedSignal);
    return ranked[0].lever === 'relieve_upstream' || ranked[0].lever === 'diversify_supply';
  });

  check('a08_rec_02', () => {
    const action = buildFirmProductionRecoveryAction(stressedSignal, null);
    return action.priority === 'immediate' && action.expectedRelief > 0.1 && action.rationale.length >= 2;
  });

  check('a08_rec_03', () => {
    const plan = summarizeRegionalRecoveryPlan(
      {
        regionId: 'NSW',
        firmCount: 2,
        avgCompositePressure: 0.5,
        riskBand: 'stressed',
        watchFirmCount: 1,
        criticalFirmCount: 1,
      },
      [
        buildFirmProductionRecoveryAction(stressedSignal, null),
        buildFirmProductionRecoveryAction(
          { ...stressedSignal, companyId: 'c2', compositePressure: 0.3, riskBand: 'watch', drivers: [] },
          null,
        ),
      ],
    );
    return plan.stressedFirmCount >= 1 && plan.topActions.length <= 3;
  });

  check('a08_rec_04', () => priorityFromPressure(0.65) === 'immediate');

  check('a08_rec_05', () => {
    const playbook = computeNationalProductionRecoveryPlaybook({
      turn: 3,
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
        lastUpdatedTurn: 3,
        inputHash: 'r',
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
    });
    return (
      playbook.schemaVersion === AGENT08_RECOVERY_SCHEMA_VERSION &&
      playbook.actions.length === 1 &&
      playbook.regions.length === 2
    );
  });

  return results;
}
