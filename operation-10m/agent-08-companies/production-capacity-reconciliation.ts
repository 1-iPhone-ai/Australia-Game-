/**
 * Agent 08 round 11 — reconcile utilization depth, remediation execution, and integrated pressure.
 * Non-authoritative coherence layer (planning feedback across prior round-9/10 signals).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import {
  computeNationalIntegratedProductionBrief,
  type FirmIntegratedProductionSignal,
  type NationalIntegratedProductionBrief,
} from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import {
  computeNationalProductionRemediationExecution,
  type FirmRemediationExecutionRow,
  type NationalProductionRemediationExecution,
} from './production-remediation-execution';
import {
  computeNationalProductionUtilizationDepth,
  type FirmProductionUtilizationRow,
  type NationalProductionUtilizationDepth,
} from './production-utilization-depth';

export const AGENT08_RECONCILIATION_SCHEMA_VERSION = '1.0.0';

export type CapacityReconciliationBand = 'aligned' | 'drift' | 'conflict';

export interface FirmProductionCapacityReconciliation {
  companyId: string;
  regionId: string;
  reconciliationBand: CapacityReconciliationBand;
  coherenceScore: number;
  utilizationStress: number;
  executionBacklog: number;
  integratedPressure: number;
  reconciliationRank: number;
  primaryTension: string | null;
  reconciliationNote: string;
}

export interface RegionalCapacityReconciliationSummary {
  regionId: string;
  firmCount: number;
  alignedCount: number;
  driftCount: number;
  conflictCount: number;
  avgCoherenceScore: number;
  dominantBand: CapacityReconciliationBand;
}

export interface NationalProductionCapacityReconciliation {
  schemaVersion: typeof AGENT08_RECONCILIATION_SCHEMA_VERSION;
  turn: number;
  utilizationTurn: number;
  executionTurn: number;
  nationalCoherenceScore: number;
  reconciliationPressure: number;
  firmRows: FirmProductionCapacityReconciliation[];
  regions: RegionalCapacityReconciliationSummary[];
  firmsInConflict: number;
  regionsWithDriftMajority: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const BAND_ORDER: CapacityReconciliationBand[] = ['aligned', 'drift', 'conflict'];

function utilizationStressScore(row: FirmProductionUtilizationRow): number {
  const slackPenalty =
    row.slackBand === 'tight' ? 0.55 : row.slackBand === 'idle' ? 0.35 : row.slackBand === 'slack' ? 0.15 : 0.25;
  const stressBoost = row.stressBand === 'strained' ? 0.35 : row.stressBand === 'underused' ? 0.2 : 0.08;
  const bindBoost = row.capacityBind ? 0.25 : 0;
  return clamp(slackPenalty + stressBoost + bindBoost, 0, 1);
}

function executionBacklogScore(row: FirmRemediationExecutionRow): number {
  const band =
    row.executionBand === 'stalled'
      ? 0.85
      : row.executionBand === 'pending'
        ? 0.55
        : row.executionBand === 'in_progress'
          ? 0.35
          : row.executionBand === 'waived'
            ? 0.12
            : 0;
  const urgency =
    row.urgency === 'critical' ? 0.25 : row.urgency === 'elevated' ? 0.15 : 0.05;
  const turns = clamp(row.turnsRemaining / 10, 0, 0.2);
  return clamp(band + urgency + turns, 0, 1);
}

function classifyReconciliationBand(params: {
  utilization: FirmProductionUtilizationRow;
  execution: FirmRemediationExecutionRow;
  integratedPressure: number;
}): CapacityReconciliationBand {
  const utilStress = utilizationStressScore(params.utilization);
  const execBacklog = executionBacklogScore(params.execution);

  if (
    params.utilization.capacityBind &&
    (params.execution.executionBand === 'stalled' || params.execution.executionBand === 'pending')
  ) {
    return 'conflict';
  }
  if (params.integratedPressure > 0.52 && params.execution.executionBand === 'closed') {
    return 'conflict';
  }
  if (
    params.utilization.slackBand === 'tight' &&
    (params.execution.executionBand === 'closed' || params.execution.executionBand === 'waived')
  ) {
    return 'drift';
  }
  if (utilStress > 0.55 && execBacklog < 0.2) {
    return 'drift';
  }
  if (utilStress > 0.65 && execBacklog > 0.5) {
    return 'conflict';
  }
  if (Math.abs(utilStress - execBacklog) > 0.45) {
    return 'drift';
  }
  return 'aligned';
}

function primaryTension(
  band: CapacityReconciliationBand,
  utilization: FirmProductionUtilizationRow,
  execution: FirmRemediationExecutionRow,
): string | null {
  if (band === 'aligned') return null;
  if (utilization.capacityBind && execution.executionBand !== 'in_progress') {
    return 'capacity_bind_vs_execution';
  }
  if (utilization.slackBand === 'tight' && execution.executionBand === 'closed') {
    return 'tight_util_closed_execution';
  }
  if (execution.executionBand === 'stalled') return 'stalled_remediation';
  if (utilization.stressBand === 'underused' && execution.urgency === 'critical') {
    return 'underuse_critical_remediation';
  }
  return 'signal_divergence';
}

export function reconcileFirmProductionCapacity(params: {
  utilization: FirmProductionUtilizationRow;
  execution: FirmRemediationExecutionRow;
  integrated?: FirmIntegratedProductionSignal;
}): FirmProductionCapacityReconciliation {
  const integratedPressure = params.integrated?.compositePressure ?? 0.28;
  const utilizationStress = utilizationStressScore(params.utilization);
  const executionBacklog = executionBacklogScore(params.execution);
  const reconciliationBand = classifyReconciliationBand({
    utilization: params.utilization,
    execution: params.execution,
    integratedPressure,
  });

  const coherenceScore = clamp(
    1 -
      Math.abs(utilizationStress - executionBacklog) * 0.45 -
      integratedPressure * 0.25 -
      (reconciliationBand === 'conflict' ? 0.22 : reconciliationBand === 'drift' ? 0.1 : 0),
    0,
    1,
  );

  const rankBase =
    reconciliationBand === 'conflict' ? 900 : reconciliationBand === 'drift' ? 450 : 100;
  const reconciliationRank = Math.round(
    rankBase + (1 - coherenceScore) * 200 + integratedPressure * 80,
  );

  const tension = primaryTension(reconciliationBand, params.utilization, params.execution);
  const reconciliationNote =
    reconciliationBand === 'aligned'
      ? 'utilization, execution, and integrated pressure coherent'
      : reconciliationBand === 'drift'
        ? `drift — ${tension?.replace(/_/g, ' ') ?? 'signals diverging'}`
        : `conflict — ${tension?.replace(/_/g, ' ') ?? 'requires realignment'}`;

  return {
    companyId: params.utilization.companyId,
    regionId: params.utilization.regionId,
    reconciliationBand,
    coherenceScore: Math.round(coherenceScore * 1000) / 1000,
    utilizationStress: Math.round(utilizationStress * 1000) / 1000,
    executionBacklog: Math.round(executionBacklog * 1000) / 1000,
    integratedPressure: Math.round(integratedPressure * 1000) / 1000,
    reconciliationRank,
    primaryTension: tension,
    reconciliationNote,
  };
}

export function summarizeRegionalCapacityReconciliation(
  regionId: string,
  firmRows: FirmProductionCapacityReconciliation[],
): RegionalCapacityReconciliationSummary {
  const regional = firmRows.filter(r => r.regionId === regionId);
  const alignedCount = regional.filter(r => r.reconciliationBand === 'aligned').length;
  const driftCount = regional.filter(r => r.reconciliationBand === 'drift').length;
  const conflictCount = regional.filter(r => r.reconciliationBand === 'conflict').length;
  const avgCoherenceScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.coherenceScore, 0) / regional.length;

  const counts: Record<CapacityReconciliationBand, number> = {
    aligned: alignedCount,
    drift: driftCount,
    conflict: conflictCount,
  };
  let dominantBand: CapacityReconciliationBand = 'aligned';
  let max = -1;
  for (const b of BAND_ORDER) {
    if (counts[b] >= max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  return {
    regionId,
    firmCount: regional.length,
    alignedCount,
    driftCount,
    conflictCount,
    avgCoherenceScore: Math.round(avgCoherenceScore * 1000) / 1000,
    dominantBand,
  };
}

export function computeReconciliationPressure(
  firmRows: FirmProductionCapacityReconciliation[],
): number {
  if (firmRows.length === 0) return 0;
  const weighted = firmRows.reduce((acc, r) => {
    const w =
      r.reconciliationBand === 'conflict' ? 1 : r.reconciliationBand === 'drift' ? 0.55 : 0.12;
    return acc + w * (1 - r.coherenceScore) + r.integratedPressure * 0.15;
  }, 0);
  return clamp(Math.round((weighted / firmRows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalCoherenceScore(
  firmRows: FirmProductionCapacityReconciliation[],
): number {
  if (firmRows.length === 0) return 1;
  const avg = firmRows.reduce((a, r) => a + r.coherenceScore, 0) / firmRows.length;
  return clamp(Math.round(avg * 1000) / 1000, 0, 1);
}

export function computeNationalProductionCapacityReconciliation(params: {
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
  utilization?: NationalProductionUtilizationDepth;
  execution?: NationalProductionRemediationExecution;
}): NationalProductionCapacityReconciliation {
  const utilization =
    params.utilization ??
    computeNationalProductionUtilizationDepth({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
    });

  const execution =
    params.execution ??
    computeNationalProductionRemediationExecution({
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

  const utilByFirm = new Map(utilization.firmRows.map(r => [r.companyId, r] as const));
  const execByFirm = new Map(execution.firmRows.map(r => [r.companyId, r] as const));
  const integratedByFirm = new Map(brief.firms.map(f => [f.companyId, f] as const));

  const firmRows: FirmProductionCapacityReconciliation[] = [];
  for (const [companyId, utilRow] of utilByFirm) {
    const execRow = execByFirm.get(companyId);
    if (!execRow) continue;
    firmRows.push(
      reconcileFirmProductionCapacity({
        utilization: utilRow,
        execution: execRow,
        integrated: integratedByFirm.get(companyId),
      }),
    );
  }
  firmRows.sort((a, b) => b.reconciliationRank - a.reconciliationRank);

  const regionIds = [...new Set(firmRows.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalCapacityReconciliation(rid, firmRows));

  const nationalCoherenceScore = computeNationalCoherenceScore(firmRows);
  const reconciliationPressure = computeReconciliationPressure(firmRows);
  const firmsInConflict = firmRows.filter(r => r.reconciliationBand === 'conflict').length;
  const regionsWithDriftMajority = regions.filter(r => r.dominantBand === 'drift').length;

  return {
    schemaVersion: AGENT08_RECONCILIATION_SCHEMA_VERSION,
    turn: params.turn,
    utilizationTurn: utilization.turn,
    executionTurn: execution.turn,
    nationalCoherenceScore,
    reconciliationPressure,
    firmRows,
    regions,
    firmsInConflict,
    regionsWithDriftMajority,
  };
}

export function runAgent08ReconciliationSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  const utilRow: FirmProductionUtilizationRow = {
    companyId: 'f1',
    regionId: 'NSW',
    scale: 20,
    firmUtilization: 0.72,
    effectiveOutput: 14.4,
    linkedIndustryUtilization: 0.3,
    utilizationDelta: 0.42,
    headroom: 0.28,
    slackBand: 'tight',
    stressBand: 'strained',
    capacityBind: true,
    utilizationNote: 'bind',
  };

  const execClosed: FirmRemediationExecutionRow = {
    companyId: 'f1',
    regionId: 'NSW',
    urgency: 'routine',
    kind: 'hold_course',
    executionBand: 'closed',
    closureScore: 0.95,
    turnsRemaining: 0,
    executionRank: 100,
    clusterKey: null,
    executionNote: 'closed',
  };

  check('a08_recon_01', () => {
    const row = reconcileFirmProductionCapacity({
      utilization: { ...utilRow, capacityBind: false },
      execution: execClosed,
      integrated: {
        companyId: 'f1',
        regionId: 'NSW',
        compositePressure: 0.6,
        riskBand: 'critical',
        supplyDepthStress: 0.5,
        sectorMisalignment: 0.4,
        cascadePressure: 0.3,
        taxLaborDrag: 0.1,
        drivers: ['supply_stress'],
      },
    });
    return row.reconciliationBand === 'conflict' && row.primaryTension === 'tight_util_closed_execution';
  });

  check('a08_recon_02', () => {
    const row = reconcileFirmProductionCapacity({
      utilization: { ...utilRow, capacityBind: true, slackBand: 'tight' },
      execution: {
        ...execClosed,
        executionBand: 'stalled',
        urgency: 'critical',
        kind: 'reinforce_directive',
      },
    });
    return row.reconciliationBand === 'conflict';
  });

  check('a08_recon_03', () => {
    const summary = summarizeRegionalCapacityReconciliation('VIC', [
      {
        companyId: 'a',
        regionId: 'VIC',
        reconciliationBand: 'aligned',
        coherenceScore: 0.82,
        utilizationStress: 0.3,
        executionBacklog: 0.25,
        integratedPressure: 0.2,
        reconciliationRank: 120,
        primaryTension: null,
        reconciliationNote: 'ok',
      },
      {
        companyId: 'b',
        regionId: 'VIC',
        reconciliationBand: 'drift',
        coherenceScore: 0.55,
        utilizationStress: 0.5,
        executionBacklog: 0.1,
        integratedPressure: 0.35,
        reconciliationRank: 500,
        primaryTension: 'signal_divergence',
        reconciliationNote: 'd',
      },
    ]);
    return summary.driftCount === 1 && summary.dominantBand === 'drift';
  });

  check('a08_recon_04', () => {
    const pressure = computeReconciliationPressure([
      {
        companyId: 'x',
        regionId: 'QLD',
        reconciliationBand: 'conflict',
        coherenceScore: 0.2,
        utilizationStress: 0.8,
        executionBacklog: 0.7,
        integratedPressure: 0.5,
        reconciliationRank: 950,
        primaryTension: 'stalled_remediation',
        reconciliationNote: 'c',
      },
    ]);
    return pressure > 0.4 && pressure <= 1;
  });

  check('a08_recon_05', () => {
    const reconciliation = computeNationalProductionCapacityReconciliation({
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
      reconciliation.schemaVersion === AGENT08_RECONCILIATION_SCHEMA_VERSION &&
      reconciliation.firmRows.length >= 1 &&
      reconciliation.nationalCoherenceScore >= 0 &&
      reconciliation.nationalCoherenceScore <= 1
    );
  });

  return results;
}
