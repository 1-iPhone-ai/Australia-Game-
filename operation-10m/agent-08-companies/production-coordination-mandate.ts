/**
 * Agent 08 round 6 — coordination mandate from recovery playbook + stabilization outlook.
 * Turns horizon estimates into sequenced firm/cluster directives (non-authoritative planning layer).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import {
  computeNationalProductionRecoveryPlaybook,
  type FirmProductionRecoveryAction,
  type NationalProductionRecoveryPlaybook,
  type ProductionRecoveryLever,
  type RecoveryPriorityBand,
} from './production-recovery-playbook';
import {
  computeNationalProductionStabilizationOutlook,
  type FirmProductionStabilizationOutlook,
  type NationalProductionStabilizationOutlook,
  type UpstreamCoordinationCluster,
} from './production-stabilization-outlook';

export const AGENT08_MANDATE_SCHEMA_VERSION = '1.0.0';

export type MandateExecutionPhase = 'immediate' | 'this_turn' | 'next_turn' | 'backlog';

export type ResilienceMomentumBand = 'recovering' | 'stable' | 'slipping' | 'critical';

export interface FirmProductionExecutionDirective {
  companyId: string;
  regionId: string;
  phase: MandateExecutionPhase;
  primaryLever: ProductionRecoveryLever;
  coordinationRank: number;
  pressureGap: number;
  stabilizationTurns: number;
  blockingClusterKey: string | null;
  directiveSummary: string;
}

export interface ClusterCoordinationMandate {
  clusterKey: string;
  upstreamRegionId: string;
  supplyKind: string;
  phase: MandateExecutionPhase;
  affectedFirmCount: number;
  combinedPressure: number;
  sharedLever: ProductionRecoveryLever;
  sequencingNote: string;
}

export interface RegionalProductionCoordinationMandate {
  regionId: string;
  firmCount: number;
  immediateDirectives: number;
  dominantPhase: MandateExecutionPhase;
  avgStabilizationTurns: number;
  escalationLevel: RecoveryPriorityBand;
}

export interface NationalProductionCoordinationMandate {
  schemaVersion: typeof AGENT08_MANDATE_SCHEMA_VERSION;
  turn: number;
  stabilizationTurn: number;
  resilienceMomentum: ResilienceMomentumBand;
  nationalMomentumScore: number;
  firmDirectives: FirmProductionExecutionDirective[];
  clusterMandates: ClusterCoordinationMandate[];
  regions: RegionalProductionCoordinationMandate[];
  firmsRequiringImmediateCoordination: number;
  activeClusterCount: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const PRIORITY_ORDER: RecoveryPriorityBand[] = ['defer', 'plan', 'urgent', 'immediate'];

function phaseFromOutlook(
  outlook: FirmProductionStabilizationOutlook,
  action: FirmProductionRecoveryAction,
): MandateExecutionPhase {
  if (action.priority === 'immediate' || outlook.horizon === 'extended') return 'immediate';
  if (action.priority === 'urgent' || outlook.estimatedTurnsToStabilize <= 2) return 'this_turn';
  if (outlook.estimatedTurnsToStabilize <= 6) return 'next_turn';
  return 'backlog';
}

function directiveSummary(
  action: FirmProductionRecoveryAction,
  outlook: FirmProductionStabilizationOutlook,
  phase: MandateExecutionPhase,
): string {
  const lever = action.primaryLever.replace(/_/g, ' ');
  const horizon =
    outlook.estimatedTurnsToStabilize <= 0
      ? 'already near stable'
      : `~${outlook.estimatedTurnsToStabilize} turn horizon`;
  return `${phase}: apply ${lever} (${horizon})`;
}

export function rankFirmDirectives(
  outlooks: FirmProductionStabilizationOutlook[],
  actions: FirmProductionRecoveryAction[],
): FirmProductionExecutionDirective[] {
  const actionById = new Map(actions.map(a => [a.companyId, a] as const));
  const clusterByFirm = new Map<string, string>();

  const directives: FirmProductionExecutionDirective[] = outlooks.map(outlook => {
    const action = actionById.get(outlook.companyId);
    if (!action) {
      return {
        companyId: outlook.companyId,
        regionId: outlook.regionId,
        phase: 'backlog',
        primaryLever: outlook.primaryLever,
        coordinationRank: 999,
        pressureGap: outlook.currentPressure,
        stabilizationTurns: outlook.estimatedTurnsToStabilize,
        blockingClusterKey: null,
        directiveSummary: 'monitor: missing recovery action',
      };
    }
    const phase = phaseFromOutlook(outlook, action);
    const pressureGap = clamp(outlook.currentPressure - 0.28, 0, 1);
    const blockingClusterKey = clusterByFirm.get(outlook.companyId) ?? null;
    return {
      companyId: outlook.companyId,
      regionId: outlook.regionId,
      phase,
      primaryLever: action.primaryLever,
      coordinationRank: 0,
      pressureGap: Math.round(pressureGap * 1000) / 1000,
      stabilizationTurns: outlook.estimatedTurnsToStabilize,
      blockingClusterKey,
      directiveSummary: directiveSummary(action, outlook, phase),
    };
  });

  const phaseWeight: Record<MandateExecutionPhase, number> = {
    immediate: 400,
    this_turn: 300,
    next_turn: 200,
    backlog: 100,
  };

  for (const d of directives) {
    d.coordinationRank =
      phaseWeight[d.phase] +
      d.pressureGap * 80 +
      clamp(24 - d.stabilizationTurns, 0, 24) * 3;
  }

  directives.sort((a, b) => b.coordinationRank - a.coordinationRank);
  return directives;
}

export function buildClusterCoordinationMandates(
  clusters: UpstreamCoordinationCluster[],
  outlook: NationalProductionStabilizationOutlook,
): ClusterCoordinationMandate[] {
  const outlookByFirm = new Map(outlook.firms.map(f => [f.companyId, f] as const));

  return clusters.map(cluster => {
    const firmOutlooks = cluster.firmIds
      .map(id => outlookByFirm.get(id))
      .filter((x): x is FirmProductionStabilizationOutlook => !!x);
    const avgTurns = firmOutlooks.length
      ? firmOutlooks.reduce((a, x) => a + x.estimatedTurnsToStabilize, 0) / firmOutlooks.length
      : 12;

    let phase: MandateExecutionPhase = 'backlog';
    if (cluster.coordinationPriority === 'immediate' || cluster.combinedPressure >= 0.58) {
      phase = 'immediate';
    } else if (cluster.coordinationPriority === 'urgent' || avgTurns <= 4) {
      phase = 'this_turn';
    } else if (avgTurns <= 10) {
      phase = 'next_turn';
    }

    const sequencingNote =
      phase === 'immediate'
        ? `Relieve ${cluster.upstreamRegionId} ${cluster.supplyKind} before downstream firm levers`
        : `Coordinate ${cluster.firmIds.length} firms on shared ${cluster.sharedLever.replace(/_/g, ' ')}`;

    return {
      clusterKey: cluster.clusterKey,
      upstreamRegionId: cluster.upstreamRegionId,
      supplyKind: cluster.supplyKind,
      phase,
      affectedFirmCount: cluster.firmIds.length,
      combinedPressure: cluster.combinedPressure,
      sharedLever: cluster.sharedLever,
      sequencingNote,
    };
  });
}

export function summarizeRegionalCoordinationMandate(
  regionId: string,
  directives: FirmProductionExecutionDirective[],
): RegionalProductionCoordinationMandate {
  const regional = directives.filter(d => d.regionId === regionId);
  const immediateDirectives = regional.filter(
    d => d.phase === 'immediate' || d.phase === 'this_turn',
  ).length;

  const phaseCounts = new Map<MandateExecutionPhase, number>();
  for (const d of regional) {
    phaseCounts.set(d.phase, (phaseCounts.get(d.phase) ?? 0) + 1);
  }
  let dominantPhase: MandateExecutionPhase = 'backlog';
  let max = 0;
  for (const [phase, count] of phaseCounts) {
    if (count > max) {
      max = count;
      dominantPhase = phase;
    }
  }

  const avgStabilizationTurns = regional.length
    ? regional.reduce((a, x) => a + x.stabilizationTurns, 0) / regional.length
    : 0;

  const escalationLevel = regional.reduce<RecoveryPriorityBand>((worst, d) => {
    const inferred: RecoveryPriorityBand =
      d.phase === 'immediate'
        ? 'immediate'
        : d.phase === 'this_turn'
          ? 'urgent'
          : d.phase === 'next_turn'
            ? 'plan'
            : 'defer';
    return PRIORITY_ORDER.indexOf(inferred) > PRIORITY_ORDER.indexOf(worst) ? inferred : worst;
  }, 'defer');

  return {
    regionId,
    firmCount: regional.length,
    immediateDirectives,
    dominantPhase,
    avgStabilizationTurns: Math.round(avgStabilizationTurns * 100) / 100,
    escalationLevel,
  };
}

export function computeResilienceMomentum(
  playbook: NationalProductionRecoveryPlaybook,
  outlook: NationalProductionStabilizationOutlook,
): { band: ResilienceMomentumBand; score: number } {
  const reliefCapacity = playbook.actions.reduce((a, x) => a + x.expectedRelief, 0);
  const pressureLoad = playbook.nationalAvgPressure * Math.max(playbook.actions.length, 1);
  const horizonDrag = outlook.nationalAvgTurnsToStabilize * 0.04;
  const criticalShare =
    outlook.firmsStillCriticalNextTurn / Math.max(outlook.firms.length, 1);

  const score = clamp(
    reliefCapacity * 1.2 - pressureLoad * 0.85 - horizonDrag - criticalShare * 0.35,
    -1,
    1,
  );

  let band: ResilienceMomentumBand = 'stable';
  if (score >= 0.25) band = 'recovering';
  else if (score <= -0.35 || outlook.firmsStillCriticalNextTurn >= Math.max(2, outlook.firms.length)) {
    band = 'critical';
  } else if (score < -0.08) band = 'slipping';

  return { band, score: Math.round(score * 1000) / 1000 };
}

export function computeNationalProductionCoordinationMandate(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
  workforce: NationalWorkforceState | null;
  fiscal: Agent08FiscalRegionSlice[] | null;
  brief?: NationalIntegratedProductionBrief;
  playbook?: NationalProductionRecoveryPlaybook;
  stabilization?: NationalProductionStabilizationOutlook;
}): NationalProductionCoordinationMandate {
  const playbook =
    params.playbook ??
    computeNationalProductionRecoveryPlaybook({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
      workforce: params.workforce,
      fiscal: params.fiscal,
      brief: params.brief,
    });

  const stabilization =
    params.stabilization ??
    computeNationalProductionStabilizationOutlook({
      turn: params.turn,
      privateState: params.privateState,
      livingRegions: params.livingRegions,
      industries: params.industries,
      workforce: params.workforce,
      fiscal: params.fiscal,
      brief: params.brief,
      playbook,
    });

  const firmDirectives = rankFirmDirectives(stabilization.firms, playbook.actions);
  const clusterMandates = buildClusterCoordinationMandates(
    stabilization.coordinationClusters,
    stabilization,
  );

  for (const directive of firmDirectives) {
    const cluster = stabilization.coordinationClusters.find(c =>
      c.firmIds.includes(directive.companyId),
    );
    if (cluster) directive.blockingClusterKey = cluster.clusterKey;
  }

  const regionIds = [...new Set(firmDirectives.map(d => d.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalCoordinationMandate(rid, firmDirectives));
  const { band, score } = computeResilienceMomentum(playbook, stabilization);

  const firmsRequiringImmediateCoordination = firmDirectives.filter(
    d => d.phase === 'immediate' || d.phase === 'this_turn',
  ).length;

  return {
    schemaVersion: AGENT08_MANDATE_SCHEMA_VERSION,
    turn: params.turn,
    stabilizationTurn: stabilization.turn,
    resilienceMomentum: band,
    nationalMomentumScore: score,
    firmDirectives,
    clusterMandates,
    regions,
    firmsRequiringImmediateCoordination,
    activeClusterCount: clusterMandates.filter(c => c.phase !== 'backlog').length,
  };
}

export function runAgent08MandateSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_mand_01', () => {
    const directives = rankFirmDirectives(
      [
        {
          companyId: 'a',
          regionId: 'NSW',
          currentPressure: 0.62,
          projectedPressureEnd: 0.4,
          expectedReliefPerTurn: 0.12,
          estimatedTurnsToStabilize: 2,
          horizon: 'near_term',
          confidence: 'moderate',
          primaryLever: 'relieve_upstream',
          priority: 'urgent',
          watchpoints: [],
        },
        {
          companyId: 'b',
          regionId: 'NSW',
          currentPressure: 0.31,
          projectedPressureEnd: 0.2,
          expectedReliefPerTurn: 0.08,
          estimatedTurnsToStabilize: 8,
          horizon: 'mid_term',
          confidence: 'low',
          primaryLever: 'capacity_buffer',
          priority: 'plan',
          watchpoints: [],
        },
      ],
      [
        {
          companyId: 'a',
          regionId: 'NSW',
          compositePressure: 0.62,
          priority: 'urgent',
          primaryLever: 'relieve_upstream',
          secondaryLever: null,
          expectedRelief: 0.22,
          rationale: [],
          evidence: [],
        },
        {
          companyId: 'b',
          regionId: 'NSW',
          compositePressure: 0.31,
          priority: 'plan',
          primaryLever: 'capacity_buffer',
          secondaryLever: null,
          expectedRelief: 0.14,
          rationale: [],
          evidence: [],
        },
      ],
    );
    return directives[0].companyId === 'a' && directives[0].phase === 'this_turn';
  });

  check('a08_mand_02', () => {
    const clusters = buildClusterCoordinationMandates(
      [
        {
          clusterKey: 'QLD:energy',
          upstreamRegionId: 'QLD',
          supplyKind: 'energy',
          firmIds: ['x', 'y'],
          combinedPressure: 0.61,
          sharedLever: 'relieve_upstream',
          coordinationPriority: 'immediate',
        },
      ],
      {
        schemaVersion: '1.0.0',
        turn: 1,
        playbookTurn: 1,
        nationalAvgTurnsToStabilize: 4,
        firms: [
          {
            companyId: 'x',
            regionId: 'NSW',
            currentPressure: 0.6,
            projectedPressureEnd: 0.35,
            expectedReliefPerTurn: 0.1,
            estimatedTurnsToStabilize: 3,
            horizon: 'near_term',
            confidence: 'moderate',
            primaryLever: 'relieve_upstream',
            priority: 'urgent',
            watchpoints: [],
          },
        ],
        regions: [],
        coordinationClusters: [],
        firmsStillCriticalNextTurn: 1,
      },
    );
    return clusters.length === 1 && clusters[0].phase === 'immediate';
  });

  check('a08_mand_03', () => {
    const summary = summarizeRegionalCoordinationMandate('VIC', [
      {
        companyId: 'c',
        regionId: 'VIC',
        phase: 'immediate',
        primaryLever: 'diversify_supply',
        coordinationRank: 500,
        pressureGap: 0.4,
        stabilizationTurns: 1,
        blockingClusterKey: null,
        directiveSummary: 'x',
      },
      {
        companyId: 'd',
        regionId: 'VIC',
        phase: 'backlog',
        primaryLever: 'sector_rebalance',
        coordinationRank: 100,
        pressureGap: 0.05,
        stabilizationTurns: 14,
        blockingClusterKey: null,
        directiveSummary: 'y',
      },
    ]);
    return summary.immediateDirectives === 1 && summary.escalationLevel === 'immediate';
  });

  check('a08_mand_04', () => {
    const { band, score } = computeResilienceMomentum(
      {
        schemaVersion: '1.0.0',
        turn: 2,
        briefTurn: 2,
        nationalAvgPressure: 0.72,
        actions: [
          {
            companyId: 'z',
            regionId: 'NSW',
            compositePressure: 0.72,
            priority: 'immediate',
            primaryLever: 'relieve_upstream',
            secondaryLever: null,
            expectedRelief: 0.08,
            rationale: [],
            evidence: [],
          },
        ],
        regions: [],
        immediateActionCount: 1,
        upstreamReliefTargets: [],
      },
      {
        schemaVersion: '1.0.0',
        turn: 2,
        playbookTurn: 2,
        nationalAvgTurnsToStabilize: 14,
        firms: [
          {
            companyId: 'z',
            regionId: 'NSW',
            currentPressure: 0.72,
            projectedPressureEnd: 0.55,
            expectedReliefPerTurn: 0.05,
            estimatedTurnsToStabilize: 14,
            horizon: 'extended',
            confidence: 'low',
            primaryLever: 'relieve_upstream',
            priority: 'immediate',
            watchpoints: ['long_horizon'],
          },
        ],
        regions: [],
        coordinationClusters: [],
        firmsStillCriticalNextTurn: 1,
      },
    );
    return (band === 'slipping' || band === 'critical') && score < 0.1;
  });

  check('a08_mand_05', () => {
    const mandate = computeNationalProductionCoordinationMandate({
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
    });
    return (
      mandate.schemaVersion === AGENT08_MANDATE_SCHEMA_VERSION &&
      mandate.firmDirectives.length === 1 &&
      mandate.regions.length >= 1
    );
  });

  return results;
}
