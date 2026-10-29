/**
 * Agent 08 round 8 — remediation plans from mandate compliance gaps and cluster coordination failures.
 * Closes the loop: compliance tracking → corrective actions (non-authoritative planning layer).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import {
  computeNationalProductionCoordinationMandate,
  type FirmProductionExecutionDirective,
  type NationalProductionCoordinationMandate,
} from './production-coordination-mandate';
import {
  computeNationalProductionMandateCompliance,
  type ClusterMandateComplianceGap,
  type FirmMandateComplianceRow,
  type NationalProductionMandateCompliance,
} from './production-mandate-compliance';
import type { ProductionRecoveryLever } from './production-recovery-playbook';

export const AGENT08_REMEDIATION_SCHEMA_VERSION = '1.0.0';

export type RemediationUrgencyBand = 'routine' | 'elevated' | 'critical';

export type RemediationActionKind =
  | 'reinforce_directive'
  | 'switch_lever'
  | 'cluster_upstream_escalation'
  | 'defer_with_watch'
  | 'hold_course';

export interface FirmComplianceRemediationAction {
  companyId: string;
  regionId: string;
  urgency: RemediationUrgencyBand;
  kind: RemediationActionKind;
  correctiveLever: ProductionRecoveryLever;
  remediationRank: number;
  slippage: number;
  expectedTurnsToRecover: number;
  clusterKey: string | null;
  actionSummary: string;
}

export interface ClusterComplianceRemediationPlan {
  clusterKey: string;
  upstreamRegionId: string;
  coordinationGap: ClusterMandateComplianceGap['coordinationGap'];
  affectedFirmIds: string[];
  sharedCorrectiveLever: ProductionRecoveryLever;
  urgency: RemediationUrgencyBand;
  remediationNote: string;
}

export interface RegionalComplianceRemediationSummary {
  regionId: string;
  firmCount: number;
  criticalActions: number;
  elevatedActions: number;
  avgExpectedRecoveryTurns: number;
  dominantUrgency: RemediationUrgencyBand;
}

export interface NationalProductionComplianceRemediation {
  schemaVersion: typeof AGENT08_REMEDIATION_SCHEMA_VERSION;
  turn: number;
  complianceTurn: number;
  nationalComplianceScore: number;
  remediationPressure: number;
  firmActions: FirmComplianceRemediationAction[];
  clusterPlans: ClusterComplianceRemediationPlan[];
  regions: RegionalComplianceRemediationSummary[];
  firmsRequiringCriticalRemediation: number;
  clustersRequiringEscalation: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const URGENCY_ORDER: RemediationUrgencyBand[] = ['routine', 'elevated', 'critical'];

function urgencyFromRow(row: FirmMandateComplianceRow): RemediationUrgencyBand {
  if (row.band === 'unknown') return 'routine';
  if (row.band === 'on_track') return 'routine';
  if (row.band === 'lagging') {
    if (row.priorPhase === 'immediate' || row.priorPhase === 'this_turn') return 'elevated';
    return 'routine';
  }
  if (row.priorPhase === 'immediate') return 'critical';
  if (row.priorPhase === 'this_turn' || row.pressureSlippage > 0.2) return 'elevated';
  return 'elevated';
}

function pickCorrectiveLever(
  row: FirmMandateComplianceRow,
  directive: FirmProductionExecutionDirective | undefined,
  clusterGap: ClusterMandateComplianceGap | undefined,
): ProductionRecoveryLever {
  if (clusterGap?.coordinationGap === 'severe') return 'relieve_upstream';
  if (row.priorLever && directive && row.priorLever !== directive.primaryLever) return 'diversify_supply';
  if (row.band === 'slipped' && row.priorLever === 'relieve_upstream') return 'capacity_buffer';
  if (row.band === 'slipped') return directive?.primaryLever ?? row.priorLever ?? 'sector_rebalance';
  return directive?.primaryLever ?? row.priorLever ?? 'sector_rebalance';
}

function remediationKind(
  row: FirmMandateComplianceRow,
  directive: FirmProductionExecutionDirective | undefined,
  correctiveLever: ProductionRecoveryLever,
  clusterGap: ClusterMandateComplianceGap | undefined,
): RemediationActionKind {
  if (row.band === 'on_track' || row.band === 'unknown') return 'hold_course';
  if (clusterGap?.coordinationGap === 'severe') return 'cluster_upstream_escalation';
  if (correctiveLever !== (directive?.primaryLever ?? row.priorLever)) return 'switch_lever';
  if (row.band === 'slipped') return 'reinforce_directive';
  if (row.band === 'lagging' && row.priorPhase === 'backlog') return 'defer_with_watch';
  return 'reinforce_directive';
}

function expectedRecoveryTurns(row: FirmMandateComplianceRow, urgency: RemediationUrgencyBand): number {
  const base = row.band === 'slipped' ? 4 + row.pressureSlippage * 8 : row.band === 'lagging' ? 2 : 0;
  const urgencyLag = urgency === 'critical' ? 0 : urgency === 'elevated' ? 1 : 2;
  return clamp(Math.ceil(base + urgencyLag), 0, 18);
}

export function buildFirmComplianceRemediation(
  row: FirmMandateComplianceRow,
  directive: FirmProductionExecutionDirective | undefined,
  clusterGap: ClusterMandateComplianceGap | undefined,
): FirmComplianceRemediationAction {
  const urgency = urgencyFromRow(row);
  const correctiveLever = pickCorrectiveLever(row, directive, clusterGap);
  const kind = remediationKind(row, directive, correctiveLever, clusterGap);
  const slippage = row.pressureSlippage;
  const expectedTurnsToRecover = expectedRecoveryTurns(row, urgency);

  const rankBase =
    urgency === 'critical' ? 1000 : urgency === 'elevated' ? 500 : 100;
  const slippageBoost = slippage * 120;
  const phaseBoost =
    row.priorPhase === 'immediate' ? 80 : row.priorPhase === 'this_turn' ? 40 : 0;
  const remediationRank = Math.round(rankBase + slippageBoost + phaseBoost);

  const leverLabel = correctiveLever.replace(/_/g, ' ');
  const actionSummary =
    kind === 'hold_course'
      ? 'compliance on track — maintain mandate'
      : kind === 'cluster_upstream_escalation'
        ? `escalate upstream cluster relief via ${leverLabel}`
        : kind === 'switch_lever'
          ? `switch corrective lever to ${leverLabel}`
          : kind === 'defer_with_watch'
            ? `monitor slippage; defer intensification (${leverLabel})`
            : `reinforce ${row.priorPhase ?? 'planned'} directive with ${leverLabel}`;

  return {
    companyId: row.companyId,
    regionId: row.regionId,
    urgency,
    kind,
    correctiveLever,
    remediationRank,
    slippage,
    expectedTurnsToRecover,
    clusterKey: directive?.blockingClusterKey ?? clusterGap?.clusterKey ?? null,
    actionSummary,
  };
}

export function buildClusterComplianceRemediationPlans(
  compliance: NationalProductionMandateCompliance,
  mandate: NationalProductionCoordinationMandate,
): ClusterComplianceRemediationPlan[] {
  const gapByKey = new Map(compliance.clusterGaps.map(g => [g.clusterKey, g] as const));
  const rowByFirm = new Map(compliance.firms.map(r => [r.companyId, r] as const));

  return mandate.clusterMandates
    .map(cluster => {
      const gap = gapByKey.get(cluster.clusterKey);
      if (!gap || gap.coordinationGap === 'none') return null;

      const memberDirectives = mandate.firmDirectives.filter(
        d => d.blockingClusterKey === cluster.clusterKey,
      );
      const affectedFirmIds = memberDirectives.map(d => d.companyId);
      const slipped = affectedFirmIds.filter(id => rowByFirm.get(id)?.band === 'slipped').length;

      const urgency: RemediationUrgencyBand =
        gap.coordinationGap === 'severe' || slipped >= 2
          ? 'critical'
          : gap.coordinationGap === 'moderate'
            ? 'elevated'
            : 'routine';

      const sharedCorrectiveLever: ProductionRecoveryLever =
        gap.coordinationGap === 'severe' ? 'relieve_upstream' : cluster.sharedLever;

      const remediationNote =
        gap.coordinationGap === 'severe'
          ? `cluster ${cluster.clusterKey}: ${slipped} slipped — shared upstream escalation`
          : `cluster ${cluster.clusterKey}: moderate gap — align ${cluster.sharedLever}`;

      return {
        clusterKey: cluster.clusterKey,
        upstreamRegionId: cluster.upstreamRegionId,
        coordinationGap: gap.coordinationGap,
        affectedFirmIds,
        sharedCorrectiveLever,
        urgency,
        remediationNote,
      };
    })
    .filter((p): p is ClusterComplianceRemediationPlan => p != null);
}

export function summarizeRegionalComplianceRemediation(
  regionId: string,
  actions: FirmComplianceRemediationAction[],
): RegionalComplianceRemediationSummary {
  const regional = actions.filter(a => a.regionId === regionId);
  const criticalActions = regional.filter(a => a.urgency === 'critical').length;
  const elevatedActions = regional.filter(a => a.urgency === 'elevated').length;
  const avgExpectedRecoveryTurns =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.expectedTurnsToRecover, 0) / regional.length;

  const counts: Record<RemediationUrgencyBand, number> = { routine: 0, elevated: 0, critical: 0 };
  for (const a of regional) counts[a.urgency] += 1;

  let dominantUrgency: RemediationUrgencyBand = 'routine';
  let max = -1;
  for (const u of URGENCY_ORDER) {
    if (counts[u] >= max) {
      max = counts[u];
      dominantUrgency = u;
    }
  }

  return {
    regionId,
    firmCount: regional.length,
    criticalActions,
    elevatedActions,
    avgExpectedRecoveryTurns: Math.round(avgExpectedRecoveryTurns * 1000) / 1000,
    dominantUrgency,
  };
}

export function computeRemediationPressure(actions: FirmComplianceRemediationAction[]): number {
  if (actions.length === 0) return 0;
  const weighted = actions.reduce((acc, a) => {
    const w = a.urgency === 'critical' ? 1 : a.urgency === 'elevated' ? 0.55 : 0.15;
    const kindBoost = a.kind === 'hold_course' ? 0 : a.slippage + w * 0.25;
    return acc + kindBoost;
  }, 0);
  return clamp(Math.round((weighted / actions.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionComplianceRemediation(params: {
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
}): NationalProductionComplianceRemediation {
  const mandate =
    params.mandate ??
    computeNationalProductionCoordinationMandate({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
      workforce: params.workforce,
      fiscal: params.fiscal,
      brief: params.brief,
    });

  const compliance =
    params.compliance ??
    computeNationalProductionMandateCompliance({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
      workforce: params.workforce,
      fiscal: params.fiscal,
      brief: params.brief,
      priorMandate: params.priorMandate ?? null,
      currentMandate: mandate,
    });

  const directiveByFirm = new Map(mandate.firmDirectives.map(d => [d.companyId, d] as const));
  const gapByKey = new Map(compliance.clusterGaps.map(g => [g.clusterKey, g] as const));

  const firmActions = compliance.firms
    .map(row => {
      const directive = directiveByFirm.get(row.companyId);
      const clusterKey = directive?.blockingClusterKey;
      const clusterGap = clusterKey ? gapByKey.get(clusterKey) : undefined;
      return buildFirmComplianceRemediation(row, directive, clusterGap);
    })
    .sort((a, b) => b.remediationRank - a.remediationRank);

  const clusterPlans = buildClusterComplianceRemediationPlans(compliance, mandate);
  const regionIds = [...new Set(firmActions.map(a => a.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalComplianceRemediation(rid, firmActions));

  const remediationPressure = computeRemediationPressure(firmActions);
  const firmsRequiringCriticalRemediation = firmActions.filter(a => a.urgency === 'critical').length;
  const clustersRequiringEscalation = clusterPlans.filter(p => p.urgency === 'critical').length;

  return {
    schemaVersion: AGENT08_REMEDIATION_SCHEMA_VERSION,
    turn: params.turn,
    complianceTurn: compliance.turn,
    nationalComplianceScore: compliance.nationalComplianceScore,
    remediationPressure,
    firmActions,
    clusterPlans,
    regions,
    firmsRequiringCriticalRemediation,
    clustersRequiringEscalation,
  };
}

export function runAgent08RemediationSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_remed_01', () => {
    const action = buildFirmComplianceRemediation(
      {
        companyId: 'f1',
        regionId: 'NSW',
        priorPhase: 'immediate',
        priorLever: 'relieve_upstream',
        currentPressure: 0.72,
        expectedPressureAfterRelief: 0.4,
        pressureSlippage: 0.28,
        band: 'slipped',
        complianceScore: 0.18,
        note: 'slipped',
      },
      {
        companyId: 'f1',
        regionId: 'NSW',
        phase: 'immediate',
        primaryLever: 'relieve_upstream',
        coordinationRank: 1,
        pressureGap: 0.5,
        stabilizationTurns: 2,
        blockingClusterKey: 'QLD:energy',
        directiveSummary: 'd',
      },
      {
        clusterKey: 'QLD:energy',
        upstreamRegionId: 'QLD',
        firmsSlipped: 2,
        firmsOnTrack: 0,
        avgSlippage: 0.25,
        coordinationGap: 'severe',
      },
    );
    return action.urgency === 'critical' && action.kind === 'cluster_upstream_escalation';
  });

  check('a08_remed_02', () => {
    const action = buildFirmComplianceRemediation(
      {
        companyId: 'f2',
        regionId: 'VIC',
        priorPhase: 'this_turn',
        priorLever: 'capacity_buffer',
        currentPressure: 0.41,
        expectedPressureAfterRelief: 0.32,
        pressureSlippage: 0.11,
        band: 'lagging',
        complianceScore: 0.62,
        note: 'lag',
      },
      {
        companyId: 'f2',
        regionId: 'VIC',
        phase: 'this_turn',
        primaryLever: 'capacity_buffer',
        coordinationRank: 5,
        pressureGap: 0.35,
        stabilizationTurns: 4,
        blockingClusterKey: null,
        directiveSummary: 'd',
      },
      undefined,
    );
    return action.urgency === 'elevated' && action.kind === 'reinforce_directive';
  });

  check('a08_remed_03', () => {
    const summary = summarizeRegionalComplianceRemediation('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        urgency: 'critical',
        kind: 'reinforce_directive',
        correctiveLever: 'relieve_upstream',
        remediationRank: 900,
        slippage: 0.2,
        expectedTurnsToRecover: 5,
        clusterKey: null,
        actionSummary: 'x',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        urgency: 'routine',
        kind: 'hold_course',
        correctiveLever: 'sector_rebalance',
        remediationRank: 100,
        slippage: 0,
        expectedTurnsToRecover: 0,
        clusterKey: null,
        actionSummary: 'y',
      },
    ]);
    return summary.criticalActions === 1 && summary.firmCount === 2 && summary.dominantUrgency === 'critical';
  });

  check('a08_remed_04', () => {
    const plans = buildClusterComplianceRemediationPlans(
      {
        schemaVersion: '1.0.0',
        turn: 3,
        priorMandateTurn: 2,
        resilienceMomentum: 'slipping',
        nationalComplianceScore: 0.42,
        firms: [],
        clusterGaps: [
          {
            clusterKey: 'WA:logistics',
            upstreamRegionId: 'WA',
            firmsSlipped: 1,
            firmsOnTrack: 0,
            avgSlippage: 0.14,
            coordinationGap: 'moderate',
          },
        ],
        regions: [],
        firmsRequiringEscalation: 1,
        mandateCoverageRatio: 0.8,
      },
      {
        schemaVersion: '1.0.0',
        turn: 3,
        stabilizationTurn: 3,
        resilienceMomentum: 'slipping',
        nationalMomentumScore: -0.05,
        firmDirectives: [
          {
            companyId: 'c1',
            regionId: 'SA',
            phase: 'this_turn',
            primaryLever: 'relieve_upstream',
            coordinationRank: 2,
            pressureGap: 0.4,
            stabilizationTurns: 3,
            blockingClusterKey: 'WA:logistics',
            directiveSummary: 'd',
          },
        ],
        clusterMandates: [
          {
            clusterKey: 'WA:logistics',
            upstreamRegionId: 'WA',
            supplyKind: 'logistics',
            phase: 'this_turn',
            affectedFirmCount: 1,
            combinedPressure: 0.55,
            sharedLever: 'relieve_upstream',
            sequencingNote: 'seq',
          },
        ],
        regions: [],
        firmsRequiringImmediateCoordination: 0,
        activeClusterCount: 1,
      },
    );
    return plans.length === 1 && plans[0].urgency === 'elevated';
  });

  check('a08_remed_05', () => {
    const remediation = computeNationalProductionComplianceRemediation({
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
      remediation.schemaVersion === AGENT08_REMEDIATION_SCHEMA_VERSION &&
      remediation.firmActions.length >= 1 &&
      remediation.remediationPressure >= 0 &&
      remediation.remediationPressure <= 1
    );
  });

  return results;
}
