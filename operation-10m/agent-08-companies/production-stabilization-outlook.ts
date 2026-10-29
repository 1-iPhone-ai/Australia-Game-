/**
 * Agent 08 round 5 — stabilization outlook from recovery playbook + integrated pressure.
 * Bounded turn-horizon estimates and upstream coordination clusters (non-authoritative).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { FirmIntegratedProductionSignal, NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import {
  computeNationalProductionRecoveryPlaybook,
  type FirmProductionRecoveryAction,
  type NationalProductionRecoveryPlaybook,
  type ProductionRecoveryLever,
  type RecoveryPriorityBand,
} from './production-recovery-playbook';

export const AGENT08_STABILIZATION_SCHEMA_VERSION = '1.0.0';

export type StabilizationHorizonBand = 'near_term' | 'mid_term' | 'extended' | 'uncertain';

export type StabilizationConfidence = 'high' | 'moderate' | 'low';

export interface FirmProductionStabilizationOutlook {
  companyId: string;
  regionId: string;
  currentPressure: number;
  projectedPressureEnd: number;
  expectedReliefPerTurn: number;
  estimatedTurnsToStabilize: number;
  horizon: StabilizationHorizonBand;
  confidence: StabilizationConfidence;
  primaryLever: ProductionRecoveryLever;
  priority: RecoveryPriorityBand;
  watchpoints: string[];
}

export interface UpstreamCoordinationCluster {
  clusterKey: string;
  upstreamRegionId: string;
  supplyKind: string;
  firmIds: string[];
  combinedPressure: number;
  sharedLever: ProductionRecoveryLever;
  coordinationPriority: RecoveryPriorityBand;
}

export interface RegionalProductionStabilizationSummary {
  regionId: string;
  firmCount: number;
  avgTurnsToStabilize: number;
  dominantHorizon: StabilizationHorizonBand;
  firmsNearTerm: number;
  maxResidualPressure: number;
}

export interface NationalProductionStabilizationOutlook {
  schemaVersion: typeof AGENT08_STABILIZATION_SCHEMA_VERSION;
  turn: number;
  playbookTurn: number;
  nationalAvgTurnsToStabilize: number;
  firms: FirmProductionStabilizationOutlook[];
  regions: RegionalProductionStabilizationSummary[];
  coordinationClusters: UpstreamCoordinationCluster[];
  firmsStillCriticalNextTurn: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const STABILIZE_THRESHOLD = 0.28;

export function estimateTurnsToStabilize(
  compositePressure: number,
  expectedReliefPerTurn: number,
  priority: RecoveryPriorityBand,
): number {
  const gap = Math.max(0, compositePressure - STABILIZE_THRESHOLD);
  if (gap <= 0.01) return 0;
  const relief = Math.max(expectedReliefPerTurn, 0.04);
  const priorityLag =
    priority === 'immediate' ? 0 : priority === 'urgent' ? 1 : priority === 'plan' ? 2 : 3;
  const raw = Math.ceil(gap / relief) + priorityLag;
  return clamp(raw, 0, 24);
}

export function classifyStabilizationHorizon(turns: number): StabilizationHorizonBand {
  if (turns <= 0) return 'near_term';
  if (turns <= 3) return 'near_term';
  if (turns <= 8) return 'mid_term';
  if (turns <= 16) return 'extended';
  return 'uncertain';
}

export function stabilizationConfidenceFrom(
  action: FirmProductionRecoveryAction,
  signal?: FirmIntegratedProductionSignal | null,
): StabilizationConfidence {
  let score = 0.45;
  if (action.expectedRelief >= 0.25) score += 0.2;
  if (action.rationale.length >= 2) score += 0.1;
  if (signal && signal.drivers.length <= 2) score += 0.15;
  if (action.priority === 'defer') score += 0.1;
  if (action.compositePressure > 0.7 && action.expectedRelief < 0.15) score -= 0.25;
  if (score >= 0.65) return 'high';
  if (score >= 0.4) return 'moderate';
  return 'low';
}

export function buildFirmStabilizationOutlook(
  action: FirmProductionRecoveryAction,
  signal?: FirmIntegratedProductionSignal | null,
): FirmProductionStabilizationOutlook {
  const expectedReliefPerTurn = clamp(action.expectedRelief * 0.55, 0.03, 0.35);
  const estimatedTurnsToStabilize = estimateTurnsToStabilize(
    action.compositePressure,
    expectedReliefPerTurn,
    action.priority,
  );
  const projectedPressureEnd = clamp(
    action.compositePressure - expectedReliefPerTurn * Math.max(estimatedTurnsToStabilize, 1),
    0,
    1,
  );

  const watchpoints: string[] = [];
  if (projectedPressureEnd > STABILIZE_THRESHOLD + 0.08) watchpoints.push('residual_pressure');
  if (action.secondaryLever) watchpoints.push(`secondary:${action.secondaryLever}`);
  if (signal?.drivers.includes('upstream_cascade')) watchpoints.push('upstream_dependency');
  if (estimatedTurnsToStabilize > 12) watchpoints.push('long_horizon');

  return {
    companyId: action.companyId,
    regionId: action.regionId,
    currentPressure: action.compositePressure,
    projectedPressureEnd: Math.round(projectedPressureEnd * 1000) / 1000,
    expectedReliefPerTurn: Math.round(expectedReliefPerTurn * 1000) / 1000,
    estimatedTurnsToStabilize,
    horizon: classifyStabilizationHorizon(estimatedTurnsToStabilize),
    confidence: stabilizationConfidenceFrom(action, signal),
    primaryLever: action.primaryLever,
    priority: action.priority,
    watchpoints,
  };
}

function parseUpstreamEvidence(evidence: string[]): { regionId: string; supply: string } | null {
  const tag = evidence.find(e => e.startsWith('upstream:'));
  if (!tag) return null;
  const parts = tag.split(':');
  if (parts.length < 3) return null;
  return { regionId: parts[1], supply: parts[2] };
}

export function buildUpstreamCoordinationClusters(
  playbook: NationalProductionRecoveryPlaybook,
): UpstreamCoordinationCluster[] {
  const buckets = new Map<
    string,
    { upstreamRegionId: string; supply: string; actions: FirmProductionRecoveryAction[] }
  >();

  for (const action of playbook.actions) {
    if (action.primaryLever !== 'relieve_upstream' && action.primaryLever !== 'diversify_supply') continue;
    const parsed = parseUpstreamEvidence(action.evidence);
    const upstreamRegionId = parsed?.regionId ?? 'national';
    const supplyKind = parsed?.supply ?? action.primaryLever;
    const clusterKey = `${upstreamRegionId}:${supplyKind}`;
    const existing = buckets.get(clusterKey) ?? { upstreamRegionId, supply: supplyKind, actions: [] };
    existing.actions.push(action);
    buckets.set(clusterKey, existing);
  }

  const clusters: UpstreamCoordinationCluster[] = [];
  for (const [clusterKey, bucket] of buckets) {
    if (bucket.actions.length < 1) continue;
    const combinedPressure =
      bucket.actions.reduce((a, x) => a + x.compositePressure, 0) / bucket.actions.length;
    const leverCounts = new Map<ProductionRecoveryLever, number>();
    for (const a of bucket.actions) {
      leverCounts.set(a.primaryLever, (leverCounts.get(a.primaryLever) ?? 0) + 1);
    }
    let sharedLever: ProductionRecoveryLever = 'relieve_upstream';
    let max = 0;
    for (const [lever, count] of leverCounts) {
      if (count > max) {
        max = count;
        sharedLever = lever;
      }
    }
    const worstPriority = bucket.actions.reduce<RecoveryPriorityBand>((worst, a) => {
      const order: RecoveryPriorityBand[] = ['defer', 'plan', 'urgent', 'immediate'];
      return order.indexOf(a.priority) > order.indexOf(worst) ? a.priority : worst;
    }, 'defer');

    clusters.push({
      clusterKey,
      upstreamRegionId: bucket.upstreamRegionId,
      supplyKind: bucket.supply,
      firmIds: bucket.actions.map(a => a.companyId),
      combinedPressure: Math.round(combinedPressure * 1000) / 1000,
      sharedLever,
      coordinationPriority: worstPriority,
    });
  }

  return clusters.sort((a, b) => b.combinedPressure - a.combinedPressure);
}

export function summarizeRegionalStabilization(
  regionId: string,
  outlooks: FirmProductionStabilizationOutlook[],
): RegionalProductionStabilizationSummary {
  const regional = outlooks.filter(o => o.regionId === regionId);
  const avgTurnsToStabilize = regional.length
    ? regional.reduce((a, x) => a + x.estimatedTurnsToStabilize, 0) / regional.length
    : 0;
  const horizonCounts = new Map<StabilizationHorizonBand, number>();
  for (const o of regional) {
    horizonCounts.set(o.horizon, (horizonCounts.get(o.horizon) ?? 0) + 1);
  }
  let dominantHorizon: StabilizationHorizonBand = 'near_term';
  let maxH = 0;
  for (const [h, count] of horizonCounts) {
    if (count > maxH) {
      maxH = count;
      dominantHorizon = h;
    }
  }
  const firmsNearTerm = regional.filter(o => o.horizon === 'near_term').length;
  const maxResidualPressure = regional.length
    ? Math.max(...regional.map(o => o.projectedPressureEnd))
    : 0;

  return {
    regionId,
    firmCount: regional.length,
    avgTurnsToStabilize: Math.round(avgTurnsToStabilize * 100) / 100,
    dominantHorizon,
    firmsNearTerm,
    maxResidualPressure: Math.round(maxResidualPressure * 1000) / 1000,
  };
}

export function computeNationalProductionStabilizationOutlook(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
  workforce: NationalWorkforceState | null;
  fiscal: Agent08FiscalRegionSlice[] | null;
  brief?: NationalIntegratedProductionBrief;
  playbook?: NationalProductionRecoveryPlaybook;
}): NationalProductionStabilizationOutlook {
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

  const signalByCompany = new Map(
    (params.brief?.firms ?? []).map(f => [f.companyId, f] as const),
  );

  const firms = playbook.actions.map(action =>
    buildFirmStabilizationOutlook(action, signalByCompany.get(action.companyId) ?? null),
  );

  const regionIds = [...new Set(firms.map(f => f.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalStabilization(rid, firms));
  const coordinationClusters = buildUpstreamCoordinationClusters(playbook);

  const nationalAvgTurnsToStabilize = firms.length
    ? firms.reduce((a, x) => a + x.estimatedTurnsToStabilize, 0) / firms.length
    : 0;

  const firmsStillCriticalNextTurn = firms.filter(
    o => o.projectedPressureEnd > 0.52 || o.estimatedTurnsToStabilize > 10,
  ).length;

  return {
    schemaVersion: AGENT08_STABILIZATION_SCHEMA_VERSION,
    turn: params.turn,
    playbookTurn: playbook.turn,
    nationalAvgTurnsToStabilize: Math.round(nationalAvgTurnsToStabilize * 100) / 100,
    firms,
    regions,
    coordinationClusters,
    firmsStillCriticalNextTurn,
  };
}

export function runAgent08StabilizationSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_stab_01', () => {
    const turns = estimateTurnsToStabilize(0.62, 0.18, 'immediate');
    return turns >= 2 && turns <= 8 && classifyStabilizationHorizon(turns) !== 'uncertain';
  });

  check('a08_stab_02', () => {
    const outlook = buildFirmStabilizationOutlook({
      companyId: 'x',
      regionId: 'NSW',
      compositePressure: 0.25,
      priority: 'defer',
      primaryLever: 'capacity_buffer',
      secondaryLever: null,
      expectedRelief: 0.12,
      rationale: ['supply_depth_elevated'],
      evidence: ['pressure:0.25'],
    });
    return outlook.estimatedTurnsToStabilize === 0 && outlook.horizon === 'near_term';
  });

  check('a08_stab_03', () => {
    const clusters = buildUpstreamCoordinationClusters({
      schemaVersion: '1.0.0',
      turn: 1,
      briefTurn: 1,
      nationalAvgPressure: 0.5,
      actions: [
        {
          companyId: 'a',
          regionId: 'NSW',
          compositePressure: 0.55,
          priority: 'urgent',
          primaryLever: 'relieve_upstream',
          secondaryLever: null,
          expectedRelief: 0.2,
          rationale: [],
          evidence: ['upstream:QLD:energy'],
        },
        {
          companyId: 'b',
          regionId: 'VIC',
          compositePressure: 0.48,
          priority: 'plan',
          primaryLever: 'relieve_upstream',
          secondaryLever: null,
          expectedRelief: 0.15,
          rationale: [],
          evidence: ['upstream:QLD:energy'],
        },
      ],
      regions: [],
      immediateActionCount: 0,
      upstreamReliefTargets: ['QLD'],
    });
    return clusters.length === 1 && clusters[0].firmIds.length === 2 && clusters[0].upstreamRegionId === 'QLD';
  });

  check('a08_stab_04', () => {
    const summary = summarizeRegionalStabilization('NSW', [
      {
        companyId: 'a',
        regionId: 'NSW',
        currentPressure: 0.5,
        projectedPressureEnd: 0.22,
        expectedReliefPerTurn: 0.1,
        estimatedTurnsToStabilize: 2,
        horizon: 'near_term',
        confidence: 'moderate',
        primaryLever: 'diversify_supply',
        priority: 'plan',
        watchpoints: [],
      },
      {
        companyId: 'b',
        regionId: 'NSW',
        currentPressure: 0.7,
        projectedPressureEnd: 0.45,
        expectedReliefPerTurn: 0.08,
        estimatedTurnsToStabilize: 12,
        horizon: 'extended',
        confidence: 'low',
        primaryLever: 'relieve_upstream',
        priority: 'immediate',
        watchpoints: ['long_horizon'],
      },
    ]);
    return summary.firmCount === 2 && summary.firmsNearTerm === 1 && summary.maxResidualPressure === 0.45;
  });

  check('a08_stab_05', () => {
    const outlook = computeNationalProductionStabilizationOutlook({
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
      outlook.schemaVersion === AGENT08_STABILIZATION_SCHEMA_VERSION &&
      outlook.firms.length === 1 &&
      outlook.regions.length >= 1
    );
  });

  return results;
}
