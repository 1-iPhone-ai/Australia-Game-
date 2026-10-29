/**
 * Agent 08 round 12 — operating priorities from capacity reconciliation and utilization stress.
 * Non-authoritative planning layer (ranked interventions, not game enforcement).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import {
  computeNationalProductionCapacityReconciliation,
  type CapacityReconciliationBand,
  type FirmProductionCapacityReconciliation,
  type NationalProductionCapacityReconciliation,
} from './production-capacity-reconciliation';
import {
  computeNationalProductionRemediationExecution,
  type FirmRemediationExecutionRow,
} from './production-remediation-execution';
import {
  computeNationalProductionUtilizationDepth,
  type FirmProductionUtilizationRow,
} from './production-utilization-depth';
import type { ProductionRecoveryLever } from './production-recovery-playbook';

export const AGENT08_OPERATING_PRIORITY_SCHEMA_VERSION = '1.0.0';

export type OperatingPriorityBand = 'defer' | 'monitor' | 'escalate' | 'intervene';

export type OperatingPriorityKind =
  | 'hold_alignment'
  | 'watch_drift'
  | 'reconcile_execution'
  | 'relieve_capacity_bind'
  | 'stabilize_upstream';

export interface FirmProductionOperatingPriority {
  companyId: string;
  regionId: string;
  priorityBand: OperatingPriorityBand;
  kind: OperatingPriorityKind;
  suggestedLever: ProductionRecoveryLever;
  priorityRank: number;
  reconciliationBand: CapacityReconciliationBand;
  operatingPressure: number;
  prioritySummary: string;
}

export interface RegionalProductionOperatingSummary {
  regionId: string;
  firmCount: number;
  interveneCount: number;
  escalateCount: number;
  monitorCount: number;
  avgOperatingPressure: number;
  dominantPriorityBand: OperatingPriorityBand;
  topLever: ProductionRecoveryLever | null;
}

export interface NationalProductionOperatingPriorities {
  schemaVersion: typeof AGENT08_OPERATING_PRIORITY_SCHEMA_VERSION;
  turn: number;
  reconciliationTurn: number;
  nationalOperatingPressure: number;
  firmPriorities: FirmProductionOperatingPriority[];
  regions: RegionalProductionOperatingSummary[];
  firmsRequiringIntervention: number;
  regionsRequiringEscalation: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const PRIORITY_ORDER: OperatingPriorityBand[] = ['defer', 'monitor', 'escalate', 'intervene'];

function pickSuggestedLever(
  reconciliation: FirmProductionCapacityReconciliation,
  utilization?: FirmProductionUtilizationRow,
  execution?: FirmRemediationExecutionRow,
): ProductionRecoveryLever {
  if (utilization?.capacityBind) return 'relieve_upstream';
  if (reconciliation.primaryTension === 'stalled_remediation') return 'capacity_buffer';
  if (reconciliation.reconciliationBand === 'conflict') return 'sector_rebalance';
  if (execution?.executionBand === 'stalled') return 'diversify_supply';
  if (utilization?.slackBand === 'idle') return 'sector_rebalance';
  return 'capacity_buffer';
}

function classifyOperatingKind(
  reconciliation: FirmProductionCapacityReconciliation,
  utilization?: FirmProductionUtilizationRow,
): OperatingPriorityKind {
  if (reconciliation.reconciliationBand === 'aligned') return 'hold_alignment';
  if (utilization?.capacityBind) return 'relieve_capacity_bind';
  if (reconciliation.primaryTension === 'stalled_remediation') return 'reconcile_execution';
  if (reconciliation.reconciliationBand === 'drift') return 'watch_drift';
  if (reconciliation.integratedPressure > 0.5) return 'stabilize_upstream';
  return 'reconcile_execution';
}

export function classifyOperatingPriorityBand(
  reconciliation: FirmProductionCapacityReconciliation,
  utilization?: FirmProductionUtilizationRow,
  execution?: FirmRemediationExecutionRow,
): OperatingPriorityBand {
  if (reconciliation.reconciliationBand === 'aligned' && reconciliation.coherenceScore > 0.72) {
    return 'defer';
  }
  if (
    reconciliation.reconciliationBand === 'conflict' ||
    (utilization?.capacityBind && execution?.executionBand === 'stalled')
  ) {
    return 'intervene';
  }
  if (
    reconciliation.reconciliationBand === 'conflict' ||
    reconciliation.reconciliationBand === 'drift' ||
    execution?.urgency === 'critical'
  ) {
    return 'escalate';
  }
  if (reconciliation.coherenceScore < 0.55 || execution?.executionBand === 'pending') {
    return 'monitor';
  }
  return 'defer';
}

export function buildFirmProductionOperatingPriority(params: {
  reconciliation: FirmProductionCapacityReconciliation;
  utilization?: FirmProductionUtilizationRow;
  execution?: FirmRemediationExecutionRow;
}): FirmProductionOperatingPriority {
  const { reconciliation, utilization, execution } = params;
  const priorityBand = classifyOperatingPriorityBand(reconciliation, utilization, execution);
  const kind = classifyOperatingKind(reconciliation, utilization);
  const suggestedLever = pickSuggestedLever(reconciliation, utilization, execution);

  const operatingPressure = clamp(
    (1 - reconciliation.coherenceScore) * 0.45 +
      reconciliation.utilizationStress * 0.25 +
      reconciliation.executionBacklog * 0.2 +
      reconciliation.integratedPressure * 0.1,
    0,
    1,
  );

  const rankBase =
    priorityBand === 'intervene' ? 1000 : priorityBand === 'escalate' ? 600 : priorityBand === 'monitor' ? 250 : 80;
  const priorityRank = Math.round(rankBase + operatingPressure * 120 + (1 - reconciliation.coherenceScore) * 80);

  const leverLabel = suggestedLever.replace(/_/g, ' ');
  const prioritySummary =
    priorityBand === 'defer'
      ? 'operating posture aligned — defer action'
      : priorityBand === 'monitor'
        ? `monitor ${kind.replace(/_/g, ' ')}`
        : priorityBand === 'escalate'
          ? `escalate ${kind.replace(/_/g, ' ')} via ${leverLabel}`
          : `intervene — ${kind.replace(/_/g, ' ')} with ${leverLabel}`;

  return {
    companyId: reconciliation.companyId,
    regionId: reconciliation.regionId,
    priorityBand,
    kind,
    suggestedLever,
    priorityRank,
    reconciliationBand: reconciliation.reconciliationBand,
    operatingPressure: Math.round(operatingPressure * 1000) / 1000,
    prioritySummary,
  };
}

export function summarizeRegionalProductionOperating(
  regionId: string,
  firmPriorities: FirmProductionOperatingPriority[],
): RegionalProductionOperatingSummary {
  const regional = firmPriorities.filter(p => p.regionId === regionId);
  const interveneCount = regional.filter(p => p.priorityBand === 'intervene').length;
  const escalateCount = regional.filter(p => p.priorityBand === 'escalate').length;
  const monitorCount = regional.filter(p => p.priorityBand === 'monitor').length;
  const avgOperatingPressure =
    regional.length === 0
      ? 0
      : regional.reduce((a, p) => a + p.operatingPressure, 0) / regional.length;

  const counts: Record<OperatingPriorityBand, number> = {
    defer: 0,
    monitor: 0,
    escalate: 0,
    intervene: 0,
  };
  for (const p of regional) counts[p.priorityBand] += 1;

  let dominantPriorityBand: OperatingPriorityBand = 'defer';
  let max = -1;
  for (const b of PRIORITY_ORDER) {
    if (counts[b] >= max) {
      max = counts[b];
      dominantPriorityBand = b;
    }
  }

  const leverCounts: Partial<Record<ProductionRecoveryLever, number>> = {};
  for (const p of regional) {
    leverCounts[p.suggestedLever] = (leverCounts[p.suggestedLever] || 0) + 1;
  }
  const topLever =
    (Object.entries(leverCounts).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] as
      | ProductionRecoveryLever
      | undefined) ?? null;

  return {
    regionId,
    firmCount: regional.length,
    interveneCount,
    escalateCount,
    monitorCount,
    avgOperatingPressure: Math.round(avgOperatingPressure * 1000) / 1000,
    dominantPriorityBand,
    topLever,
  };
}

export function computeNationalOperatingPressure(
  firmPriorities: FirmProductionOperatingPriority[],
): number {
  if (firmPriorities.length === 0) return 0;
  const weighted = firmPriorities.reduce((acc, p) => {
    const w =
      p.priorityBand === 'intervene' ? 1 : p.priorityBand === 'escalate' ? 0.65 : p.priorityBand === 'monitor' ? 0.35 : 0.1;
    return acc + w * p.operatingPressure;
  }, 0);
  return clamp(Math.round((weighted / firmPriorities.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionOperatingPriorities(params: {
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
  reconciliation?: NationalProductionCapacityReconciliation;
}): NationalProductionOperatingPriorities {
  const reconciliation =
    params.reconciliation ??
    computeNationalProductionCapacityReconciliation({
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

  const utilization = computeNationalProductionUtilizationDepth({
    turn: params.turn,
    privateState: params.privateState,
    livingRegions: params.livingRegions,
    industries: params.industries,
  });
  const execution = computeNationalProductionRemediationExecution({
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
  const utilByFirm = new Map(utilization.firmRows.map(r => [r.companyId, r] as const));
  const execByFirm = new Map(execution.firmRows.map(r => [r.companyId, r] as const));

  const firmPriorities = reconciliation.firmRows
    .map(row =>
      buildFirmProductionOperatingPriority({
        reconciliation: row,
        utilization: utilByFirm.get(row.companyId),
        execution: execByFirm.get(row.companyId),
      }),
    )
    .sort((a, b) => b.priorityRank - a.priorityRank);

  const regionIds = [...new Set(firmPriorities.map(p => p.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalProductionOperating(rid, firmPriorities));

  const nationalOperatingPressure = computeNationalOperatingPressure(firmPriorities);
  const firmsRequiringIntervention = firmPriorities.filter(p => p.priorityBand === 'intervene').length;
  const regionsRequiringEscalation = regions.filter(
    r => r.dominantPriorityBand === 'escalate' || r.dominantPriorityBand === 'intervene',
  ).length;

  return {
    schemaVersion: AGENT08_OPERATING_PRIORITY_SCHEMA_VERSION,
    turn: params.turn,
    reconciliationTurn: reconciliation.turn,
    nationalOperatingPressure,
    firmPriorities,
    regions,
    firmsRequiringIntervention,
    regionsRequiringEscalation,
  };
}

export function runAgent08OperatingPrioritySelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  const alignedRecon: FirmProductionCapacityReconciliation = {
    companyId: 'a1',
    regionId: 'NSW',
    reconciliationBand: 'aligned',
    coherenceScore: 0.85,
    utilizationStress: 0.2,
    executionBacklog: 0.15,
    integratedPressure: 0.18,
    reconciliationRank: 100,
    primaryTension: null,
    reconciliationNote: 'ok',
  };

  check('a08_opri_01', () => {
    const p = buildFirmProductionOperatingPriority({ reconciliation: alignedRecon });
    return p.priorityBand === 'defer' && p.kind === 'hold_alignment';
  });

  check('a08_opri_02', () => {
    const band = classifyOperatingPriorityBand(
      {
        companyId: 'c1',
        regionId: 'VIC',
        reconciliationBand: 'conflict',
        coherenceScore: 0.25,
        utilizationStress: 0.75,
        executionBacklog: 0.7,
        integratedPressure: 0.55,
        reconciliationRank: 900,
        primaryTension: 'stalled_remediation',
        reconciliationNote: 'x',
      },
      { capacityBind: true } as FirmProductionUtilizationRow,
      { executionBand: 'stalled', urgency: 'critical' } as FirmRemediationExecutionRow,
    );
    return band === 'intervene';
  });

  check('a08_opri_03', () => {
    const summary = summarizeRegionalProductionOperating('QLD', [
      {
        companyId: 'x',
        regionId: 'QLD',
        priorityBand: 'escalate',
        kind: 'watch_drift',
        suggestedLever: 'sector_rebalance',
        priorityRank: 700,
        reconciliationBand: 'drift',
        operatingPressure: 0.5,
        prioritySummary: 's',
      },
      {
        companyId: 'y',
        regionId: 'QLD',
        priorityBand: 'defer',
        kind: 'hold_alignment',
        suggestedLever: 'capacity_buffer',
        priorityRank: 90,
        reconciliationBand: 'aligned',
        operatingPressure: 0.1,
        prioritySummary: 's',
      },
    ]);
    return summary.escalateCount === 1 && summary.dominantPriorityBand === 'escalate';
  });

  check('a08_opri_04', () => {
    const pressure = computeNationalOperatingPressure([
      {
        companyId: 'i',
        regionId: 'SA',
        priorityBand: 'intervene',
        kind: 'relieve_capacity_bind',
        suggestedLever: 'relieve_upstream',
        priorityRank: 1100,
        reconciliationBand: 'conflict',
        operatingPressure: 0.82,
        prioritySummary: 's',
      },
    ]);
    return pressure > 0.5 && pressure <= 1;
  });

  check('a08_opri_05', () => {
    const priorities = computeNationalProductionOperatingPriorities({
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
      priorities.schemaVersion === AGENT08_OPERATING_PRIORITY_SCHEMA_VERSION &&
      priorities.firmPriorities.length >= 1 &&
      priorities.nationalOperatingPressure >= 0 &&
      priorities.nationalOperatingPressure <= 1
    );
  });

  return results;
}
