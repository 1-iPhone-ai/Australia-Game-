/**
 * Agent 08 round 9 — execution tracking and closure assurance from compliance remediation plans.
 * Closes the loop: remediation actions → execution status (non-authoritative planning layer).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import {
  computeNationalProductionComplianceRemediation,
  type ClusterComplianceRemediationPlan,
  type FirmComplianceRemediationAction,
  type NationalProductionComplianceRemediation,
  type RemediationActionKind,
  type RemediationUrgencyBand,
} from './production-compliance-remediation';

export const AGENT08_EXECUTION_SCHEMA_VERSION = '1.0.0';

export type RemediationExecutionBand = 'pending' | 'in_progress' | 'stalled' | 'closed' | 'waived';

export interface FirmRemediationExecutionRow {
  companyId: string;
  regionId: string;
  urgency: RemediationUrgencyBand;
  kind: RemediationActionKind;
  executionBand: RemediationExecutionBand;
  closureScore: number;
  turnsRemaining: number;
  executionRank: number;
  clusterKey: string | null;
  executionNote: string;
}

export interface ClusterRemediationExecutionRollup {
  clusterKey: string;
  upstreamRegionId: string;
  firmsTracked: number;
  stalledCount: number;
  closedCount: number;
  dominantBand: RemediationExecutionBand;
  sharedUrgency: RemediationUrgencyBand;
  rollupNote: string;
}

export interface RegionalRemediationExecutionSummary {
  regionId: string;
  firmCount: number;
  pendingCount: number;
  inProgressCount: number;
  stalledCount: number;
  closedCount: number;
  avgClosureScore: number;
  dominantBand: RemediationExecutionBand;
}

export interface NationalProductionRemediationExecution {
  schemaVersion: typeof AGENT08_EXECUTION_SCHEMA_VERSION;
  turn: number;
  remediationTurn: number;
  nationalClosureScore: number;
  executionBacklogPressure: number;
  firmRows: FirmRemediationExecutionRow[];
  clusterRollups: ClusterRemediationExecutionRollup[];
  regions: RegionalRemediationExecutionSummary[];
  firmsStalledInRemediation: number;
  clustersWithStalledExecution: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const EXEC_BAND_ORDER: RemediationExecutionBand[] = [
  'pending',
  'in_progress',
  'stalled',
  'closed',
  'waived',
];

function closureScoreFromBand(
  band: RemediationExecutionBand,
  urgency: RemediationUrgencyBand,
  slippage: number,
): number {
  const base =
    band === 'closed'
      ? 0.95
      : band === 'waived'
        ? 0.88
        : band === 'in_progress'
          ? 0.55
          : band === 'pending'
            ? 0.35
            : 0.12;
  const urgencyBoost =
    urgency === 'critical' ? 0.04 : urgency === 'elevated' ? 0.02 : 0;
  const slippageDrag = band === 'stalled' ? slippage * 0.15 : slippage * 0.05;
  return clamp(Math.round((base + urgencyBoost - slippageDrag) * 1000) / 1000, 0, 1);
}

export function classifyRemediationExecutionBand(
  action: FirmComplianceRemediationAction,
): RemediationExecutionBand {
  if (action.kind === 'hold_course') return 'closed';
  if (action.kind === 'defer_with_watch') return 'waived';
  if (action.slippage >= 0.32 && action.urgency === 'critical') return 'stalled';
  if (action.expectedTurnsToRecover <= 0) return 'pending';
  if (action.expectedTurnsToRecover <= 2 && action.urgency !== 'routine') return 'in_progress';
  if (action.kind === 'cluster_upstream_escalation' && action.urgency === 'critical') return 'stalled';
  if (action.expectedTurnsToRecover >= 6) return 'pending';
  return 'in_progress';
}

export function buildFirmRemediationExecutionRow(
  action: FirmComplianceRemediationAction,
): FirmRemediationExecutionRow {
  const executionBand = classifyRemediationExecutionBand(action);
  const closureScore = closureScoreFromBand(executionBand, action.urgency, action.slippage);
  const turnsRemaining =
    executionBand === 'closed' || executionBand === 'waived'
      ? 0
      : Math.max(0, action.expectedTurnsToRecover - (executionBand === 'in_progress' ? 1 : 0));

  const rankBase =
    action.urgency === 'critical' ? 900 : action.urgency === 'elevated' ? 450 : 120;
  const bandBoost =
    executionBand === 'stalled' ? 200 : executionBand === 'pending' ? 80 : executionBand === 'in_progress' ? 40 : 0;
  const executionRank = Math.round(rankBase + bandBoost + action.slippage * 100);

  const executionNote =
    executionBand === 'closed'
      ? 'remediation not required — mandate aligned'
      : executionBand === 'waived'
        ? `watch-only deferral (${action.correctiveLever.replace(/_/g, ' ')})`
        : executionBand === 'stalled'
          ? `execution stalled — escalate ${action.kind.replace(/_/g, ' ')}`
          : executionBand === 'pending'
            ? `queued corrective ${action.correctiveLever.replace(/_/g, ' ')}`
            : `active execution (${action.actionSummary})`;

  return {
    companyId: action.companyId,
    regionId: action.regionId,
    urgency: action.urgency,
    kind: action.kind,
    executionBand,
    closureScore,
    turnsRemaining,
    executionRank,
    clusterKey: action.clusterKey,
    executionNote,
  };
}

export function buildClusterRemediationExecutionRollups(
  firmRows: FirmRemediationExecutionRow[],
  clusterPlans: ClusterComplianceRemediationPlan[],
): ClusterRemediationExecutionRollup[] {
  return clusterPlans.map(plan => {
    const memberRows = firmRows.filter(r => r.clusterKey === plan.clusterKey);
    const firmsTracked = memberRows.length;
    const stalledCount = memberRows.filter(r => r.executionBand === 'stalled').length;
    const closedCount = memberRows.filter(r => r.executionBand === 'closed' || r.executionBand === 'waived').length;

    const counts: Record<RemediationExecutionBand, number> = {
      pending: 0,
      in_progress: 0,
      stalled: 0,
      closed: 0,
      waived: 0,
    };
    for (const r of memberRows) counts[r.executionBand] += 1;

    let dominantBand: RemediationExecutionBand = 'pending';
    let max = -1;
    for (const b of EXEC_BAND_ORDER) {
      if (counts[b] >= max) {
        max = counts[b];
        dominantBand = b;
      }
    }

    const sharedUrgency = plan.urgency;
    const rollupNote =
      stalledCount >= 2
        ? `cluster ${plan.clusterKey}: ${stalledCount} stalled executions`
        : dominantBand === 'closed' || dominantBand === 'waived'
          ? `cluster ${plan.clusterKey}: remediation largely closed`
          : `cluster ${plan.clusterKey}: ${dominantBand.replace(/_/g, ' ')} phase`;

    return {
      clusterKey: plan.clusterKey,
      upstreamRegionId: plan.upstreamRegionId,
      firmsTracked,
      stalledCount,
      closedCount,
      dominantBand,
      sharedUrgency,
      rollupNote,
    };
  });
}

export function summarizeRegionalRemediationExecution(
  regionId: string,
  firmRows: FirmRemediationExecutionRow[],
): RegionalRemediationExecutionSummary {
  const regional = firmRows.filter(r => r.regionId === regionId);
  const pendingCount = regional.filter(r => r.executionBand === 'pending').length;
  const inProgressCount = regional.filter(r => r.executionBand === 'in_progress').length;
  const stalledCount = regional.filter(r => r.executionBand === 'stalled').length;
  const closedCount = regional.filter(
    r => r.executionBand === 'closed' || r.executionBand === 'waived',
  ).length;

  const avgClosureScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.closureScore, 0) / regional.length;

  const counts: Record<RemediationExecutionBand, number> = {
    pending: 0,
    in_progress: 0,
    stalled: 0,
    closed: 0,
    waived: 0,
  };
  for (const r of regional) counts[r.executionBand] += 1;

  let dominantBand: RemediationExecutionBand = 'pending';
  let max = -1;
  for (const b of EXEC_BAND_ORDER) {
    if (counts[b] >= max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  return {
    regionId,
    firmCount: regional.length,
    pendingCount,
    inProgressCount,
    stalledCount,
    closedCount,
    avgClosureScore: Math.round(avgClosureScore * 1000) / 1000,
    dominantBand,
  };
}

export function computeExecutionBacklogPressure(firmRows: FirmRemediationExecutionRow[]): number {
  const active = firmRows.filter(
    r => r.executionBand !== 'closed' && r.executionBand !== 'waived',
  );
  if (active.length === 0) return 0;
  const weighted = active.reduce((acc, r) => {
    const w =
      r.executionBand === 'stalled'
        ? 1
        : r.executionBand === 'pending'
          ? 0.65
          : r.executionBand === 'in_progress'
            ? 0.45
            : 0.2;
    const urgency =
      r.urgency === 'critical' ? 0.35 : r.urgency === 'elevated' ? 0.2 : 0.08;
    return acc + w * 0.55 + urgency;
  }, 0);
  return clamp(Math.round((weighted / active.length) * 1000) / 1000, 0, 1);
}

export function computeNationalClosureScore(firmRows: FirmRemediationExecutionRow[]): number {
  if (firmRows.length === 0) return 1;
  const avg = firmRows.reduce((a, r) => a + r.closureScore, 0) / firmRows.length;
  return clamp(Math.round(avg * 1000) / 1000, 0, 1);
}

export function computeNationalProductionRemediationExecution(params: {
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
  remediation?: NationalProductionComplianceRemediation;
}): NationalProductionRemediationExecution {
  const remediation =
    params.remediation ??
    computeNationalProductionComplianceRemediation({
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

  const firmRows = remediation.firmActions
    .map(buildFirmRemediationExecutionRow)
    .sort((a, b) => b.executionRank - a.executionRank);

  const clusterRollups = buildClusterRemediationExecutionRollups(firmRows, remediation.clusterPlans);
  const regionIds = [...new Set(firmRows.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalRemediationExecution(rid, firmRows));

  const nationalClosureScore = computeNationalClosureScore(firmRows);
  const executionBacklogPressure = computeExecutionBacklogPressure(firmRows);
  const firmsStalledInRemediation = firmRows.filter(r => r.executionBand === 'stalled').length;
  const clustersWithStalledExecution = clusterRollups.filter(r => r.stalledCount >= 1).length;

  return {
    schemaVersion: AGENT08_EXECUTION_SCHEMA_VERSION,
    turn: params.turn,
    remediationTurn: remediation.turn,
    nationalClosureScore,
    executionBacklogPressure,
    firmRows,
    clusterRollups,
    regions,
    firmsStalledInRemediation,
    clustersWithStalledExecution,
  };
}

export function runAgent08ExecutionSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_exec_01', () => {
    const row = buildFirmRemediationExecutionRow({
      companyId: 'f1',
      regionId: 'NSW',
      urgency: 'routine',
      kind: 'hold_course',
      correctiveLever: 'sector_rebalance',
      remediationRank: 100,
      slippage: 0,
      expectedTurnsToRecover: 0,
      clusterKey: null,
      actionSummary: 'ok',
    });
    return row.executionBand === 'closed' && row.closureScore >= 0.9;
  });

  check('a08_exec_02', () => {
    const band = classifyRemediationExecutionBand({
      companyId: 'f2',
      regionId: 'VIC',
      urgency: 'critical',
      kind: 'reinforce_directive',
      correctiveLever: 'relieve_upstream',
      remediationRank: 1100,
      slippage: 0.35,
      expectedTurnsToRecover: 5,
      clusterKey: 'QLD:energy',
      actionSummary: 'x',
    });
    return band === 'stalled';
  });

  check('a08_exec_03', () => {
    const summary = summarizeRegionalRemediationExecution('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        urgency: 'elevated',
        kind: 'switch_lever',
        executionBand: 'in_progress',
        closureScore: 0.6,
        turnsRemaining: 3,
        executionRank: 500,
        clusterKey: null,
        executionNote: 'n',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        urgency: 'routine',
        kind: 'hold_course',
        executionBand: 'closed',
        closureScore: 0.95,
        turnsRemaining: 0,
        executionRank: 100,
        clusterKey: null,
        executionNote: 'n',
      },
    ]);
    return summary.inProgressCount === 1 && summary.closedCount === 1 && summary.firmCount === 2;
  });

  check('a08_exec_04', () => {
    const rollups = buildClusterRemediationExecutionRollups(
      [
        {
          companyId: 'c1',
          regionId: 'SA',
          urgency: 'critical',
          kind: 'cluster_upstream_escalation',
          executionBand: 'stalled',
          closureScore: 0.15,
          turnsRemaining: 4,
          executionRank: 1000,
          clusterKey: 'WA:logistics',
          executionNote: 'n',
        },
        {
          companyId: 'c2',
          regionId: 'SA',
          urgency: 'critical',
          kind: 'cluster_upstream_escalation',
          executionBand: 'stalled',
          closureScore: 0.12,
          turnsRemaining: 5,
          executionRank: 980,
          clusterKey: 'WA:logistics',
          executionNote: 'n',
        },
      ],
      [
        {
          clusterKey: 'WA:logistics',
          upstreamRegionId: 'WA',
          coordinationGap: 'severe',
          affectedFirmIds: ['c1', 'c2'],
          sharedCorrectiveLever: 'relieve_upstream',
          urgency: 'critical',
          remediationNote: 'r',
        },
      ],
    );
    return rollups.length === 1 && rollups[0].stalledCount === 2 && rollups[0].dominantBand === 'stalled';
  });

  check('a08_exec_05', () => {
    const execution = computeNationalProductionRemediationExecution({
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
      execution.schemaVersion === AGENT08_EXECUTION_SCHEMA_VERSION &&
      execution.firmRows.length >= 1 &&
      execution.nationalClosureScore >= 0 &&
      execution.nationalClosureScore <= 1 &&
      execution.executionBacklogPressure >= 0
    );
  });

  return results;
}
