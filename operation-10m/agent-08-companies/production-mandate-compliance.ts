/**
 * Agent 08 round 7 — mandate compliance from prior coordination directives vs current stabilization.
 * Non-authoritative execution tracking layer (planning feedback, not game enforcement).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import {
  computeNationalProductionCoordinationMandate,
  type FirmProductionExecutionDirective,
  type MandateExecutionPhase,
  type NationalProductionCoordinationMandate,
  type ResilienceMomentumBand,
} from './production-coordination-mandate';
import {
  computeNationalProductionStabilizationOutlook,
  type FirmProductionStabilizationOutlook,
  type NationalProductionStabilizationOutlook,
} from './production-stabilization-outlook';
import type { ProductionRecoveryLever } from './production-recovery-playbook';

export const AGENT08_COMPLIANCE_SCHEMA_VERSION = '1.0.0';

export type MandateComplianceBand = 'on_track' | 'lagging' | 'slipped' | 'unknown';

export interface FirmMandateComplianceRow {
  companyId: string;
  regionId: string;
  priorPhase: MandateExecutionPhase | null;
  priorLever: ProductionRecoveryLever | null;
  currentPressure: number;
  expectedPressureAfterRelief: number;
  pressureSlippage: number;
  band: MandateComplianceBand;
  complianceScore: number;
  note: string;
}

export interface ClusterMandateComplianceGap {
  clusterKey: string;
  upstreamRegionId: string;
  firmsSlipped: number;
  firmsOnTrack: number;
  avgSlippage: number;
  coordinationGap: 'none' | 'moderate' | 'severe';
}

export interface RegionalMandateComplianceSummary {
  regionId: string;
  firmCount: number;
  onTrackCount: number;
  slippedCount: number;
  avgComplianceScore: number;
  dominantBand: MandateComplianceBand;
}

export interface NationalProductionMandateCompliance {
  schemaVersion: typeof AGENT08_COMPLIANCE_SCHEMA_VERSION;
  turn: number;
  priorMandateTurn: number | null;
  resilienceMomentum: ResilienceMomentumBand;
  nationalComplianceScore: number;
  firms: FirmMandateComplianceRow[];
  clusterGaps: ClusterMandateComplianceGap[];
  regions: RegionalMandateComplianceSummary[];
  firmsRequiringEscalation: number;
  mandateCoverageRatio: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const PHASE_WEIGHT: Record<MandateExecutionPhase, number> = {
  immediate: 1,
  this_turn: 0.85,
  next_turn: 0.55,
  backlog: 0.25,
};

function bandFromSlippage(
  slippage: number,
  priorPhase: MandateExecutionPhase | null,
): MandateComplianceBand {
  if (priorPhase == null) return 'unknown';
  const tolerance =
    priorPhase === 'immediate' ? 0.06 : priorPhase === 'this_turn' ? 0.1 : priorPhase === 'next_turn' ? 0.16 : 0.24;
  if (slippage <= tolerance) return 'on_track';
  if (slippage <= tolerance + 0.12) return 'lagging';
  return 'slipped';
}

export function scoreFirmMandateCompliance(
  prior: FirmProductionExecutionDirective | undefined,
  outlook: FirmProductionStabilizationOutlook,
): FirmMandateComplianceRow {
  if (!prior) {
    return {
      companyId: outlook.companyId,
      regionId: outlook.regionId,
      priorPhase: null,
      priorLever: null,
      currentPressure: outlook.currentPressure,
      expectedPressureAfterRelief: outlook.projectedPressureEnd,
      pressureSlippage: 0,
      band: 'unknown',
      complianceScore: 0.5,
      note: 'no prior mandate directive',
    };
  }

  const expected = clamp(
    outlook.currentPressure - outlook.expectedReliefPerTurn * PHASE_WEIGHT[prior.phase],
    0,
    1,
  );
  const slippage = clamp(outlook.currentPressure - expected, -0.05, 0.65);
  const band = bandFromSlippage(Math.max(0, slippage), prior.phase);
  const phaseWeight = PHASE_WEIGHT[prior.phase];
  const leverMatch = prior.primaryLever === outlook.primaryLever ? 0.08 : -0.04;
  const raw =
    1 -
    Math.max(0, slippage) * (1.1 + phaseWeight * 0.35) +
    leverMatch -
    (outlook.horizon === 'extended' && prior.phase !== 'backlog' ? 0.06 : 0);
  const complianceScore = clamp(Math.round(raw * 1000) / 1000, 0, 1);

  const note =
    band === 'on_track'
      ? `${prior.phase} directive holding (${prior.primaryLever})`
      : band === 'lagging'
        ? `${prior.phase} relief lagging vs plan`
        : `${prior.phase} mandate slipped — revisit ${prior.primaryLever}`;

  return {
    companyId: outlook.companyId,
    regionId: outlook.regionId,
    priorPhase: prior.phase,
    priorLever: prior.primaryLever,
    currentPressure: outlook.currentPressure,
    expectedPressureAfterRelief: expected,
    pressureSlippage: Math.round(Math.max(0, slippage) * 1000) / 1000,
    band,
    complianceScore,
    note,
  };
}

export function summarizeRegionalMandateCompliance(
  regionId: string,
  rows: FirmMandateComplianceRow[],
): RegionalMandateComplianceSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const scored = regional.filter(r => r.band !== 'unknown');
  const onTrackCount = scored.filter(r => r.band === 'on_track').length;
  const slippedCount = scored.filter(r => r.band === 'slipped').length;
  const avgComplianceScore =
    scored.length === 0
      ? 0.5
      : scored.reduce((a, r) => a + r.complianceScore, 0) / scored.length;

  const bandCounts: Record<MandateComplianceBand, number> = {
    on_track: 0,
    lagging: 0,
    slipped: 0,
    unknown: 0,
  };
  for (const r of regional) bandCounts[r.band] += 1;

  let dominantBand: MandateComplianceBand = 'unknown';
  let max = -1;
  for (const b of ['slipped', 'lagging', 'on_track', 'unknown'] as MandateComplianceBand[]) {
    if (bandCounts[b] > max) {
      max = bandCounts[b];
      dominantBand = b;
    }
  }

  return {
    regionId,
    firmCount: regional.length,
    onTrackCount,
    slippedCount,
    avgComplianceScore: Math.round(avgComplianceScore * 1000) / 1000,
    dominantBand,
  };
}

export function buildClusterMandateComplianceGaps(
  mandate: NationalProductionCoordinationMandate,
  rows: FirmMandateComplianceRow[],
): ClusterMandateComplianceGap[] {
  const rowByFirm = new Map(rows.map(r => [r.companyId, r] as const));

  return mandate.clusterMandates.map(cluster => {
    const memberRows = cluster.affectedFirmCount
      ? mandate.firmDirectives
          .filter(d => d.blockingClusterKey === cluster.clusterKey)
          .map(d => rowByFirm.get(d.companyId))
          .filter((r): r is FirmMandateComplianceRow => r != null)
      : [];

    const firmsSlipped = memberRows.filter(r => r.band === 'slipped').length;
    const firmsOnTrack = memberRows.filter(r => r.band === 'on_track').length;
    const avgSlippage =
      memberRows.length === 0
        ? 0
        : memberRows.reduce((a, r) => a + r.pressureSlippage, 0) / memberRows.length;

    let coordinationGap: ClusterMandateComplianceGap['coordinationGap'] = 'none';
    if (firmsSlipped >= 2 || avgSlippage > 0.22) coordinationGap = 'severe';
    else if (firmsSlipped >= 1 || avgSlippage > 0.12) coordinationGap = 'moderate';

    return {
      clusterKey: cluster.clusterKey,
      upstreamRegionId: cluster.upstreamRegionId,
      firmsSlipped,
      firmsOnTrack,
      avgSlippage: Math.round(avgSlippage * 1000) / 1000,
      coordinationGap,
    };
  });
}

export function computeNationalComplianceScore(rows: FirmMandateComplianceRow[]): number {
  const scored = rows.filter(r => r.band !== 'unknown');
  if (scored.length === 0) return 0.5;
  const slippedPenalty = scored.filter(r => r.band === 'slipped').length / scored.length;
  const avg = scored.reduce((a, r) => a + r.complianceScore, 0) / scored.length;
  return clamp(Math.round((avg - slippedPenalty * 0.18) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionMandateCompliance(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  livingRegions: LivingRegionsState | null;
  industries: IndustriesSupplyChainsState | null;
  workforce: NationalWorkforceState | null;
  fiscal: Agent08FiscalRegionSlice[] | null;
  brief?: NationalIntegratedProductionBrief;
  priorMandate?: NationalProductionCoordinationMandate | null;
  currentMandate?: NationalProductionCoordinationMandate;
  stabilization?: NationalProductionStabilizationOutlook;
}): NationalProductionMandateCompliance {
  const currentMandate =
    params.currentMandate ??
    computeNationalProductionCoordinationMandate({
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
    });

  const prior = params.priorMandate ?? null;
  const priorByFirm = new Map(
    (prior?.firmDirectives ?? []).map(d => [d.companyId, d] as const),
  );

  const firms = stabilization.firms.map(outlook =>
    scoreFirmMandateCompliance(priorByFirm.get(outlook.companyId), outlook),
  );

  const regionIds = [...new Set(firms.map(f => f.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalMandateCompliance(rid, firms));
  const clusterGaps = prior
    ? buildClusterMandateComplianceGaps(prior, firms)
    : buildClusterMandateComplianceGaps(currentMandate, firms);

  const nationalComplianceScore = computeNationalComplianceScore(firms);
  const firmsRequiringEscalation = firms.filter(
    f => f.band === 'slipped' && (f.priorPhase === 'immediate' || f.priorPhase === 'this_turn'),
  ).length;

  const mandateCoverageRatio =
    prior == null
      ? 0
      : clamp(
          prior.firmDirectives.filter(d => priorByFirm.has(d.companyId)).length /
            Math.max(stabilization.firms.length, 1),
          0,
          1,
        );

  return {
    schemaVersion: AGENT08_COMPLIANCE_SCHEMA_VERSION,
    turn: params.turn,
    priorMandateTurn: prior?.turn ?? null,
    resilienceMomentum: currentMandate.resilienceMomentum,
    nationalComplianceScore,
    firms,
    clusterGaps,
    regions,
    firmsRequiringEscalation,
    mandateCoverageRatio: Math.round(mandateCoverageRatio * 1000) / 1000,
  };
}

export function runAgent08ComplianceSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_comp_01', () => {
    const row = scoreFirmMandateCompliance(
      {
        companyId: 'f1',
        regionId: 'NSW',
        phase: 'this_turn',
        primaryLever: 'relieve_upstream',
        coordinationRank: 10,
        pressureGap: 0.4,
        stabilizationTurns: 3,
        blockingClusterKey: null,
        directiveSummary: 'x',
      },
      {
        companyId: 'f1',
        regionId: 'NSW',
        currentPressure: 0.34,
        projectedPressureEnd: 0.25,
        expectedReliefPerTurn: 0.12,
        estimatedTurnsToStabilize: 2,
        horizon: 'near_term',
        confidence: 'moderate',
        primaryLever: 'relieve_upstream',
        priority: 'urgent',
        watchpoints: [],
      },
    );
    return row.band === 'lagging' && row.complianceScore >= 0.65;
  });

  check('a08_comp_02', () => {
    const row = scoreFirmMandateCompliance(
      {
        companyId: 'f2',
        regionId: 'VIC',
        phase: 'immediate',
        primaryLever: 'capacity_buffer',
        coordinationRank: 1,
        pressureGap: 0.55,
        stabilizationTurns: 1,
        blockingClusterKey: null,
        directiveSummary: 'x',
      },
      {
        companyId: 'f2',
        regionId: 'VIC',
        currentPressure: 0.8,
        projectedPressureEnd: 0.58,
        expectedReliefPerTurn: 0.22,
        estimatedTurnsToStabilize: 8,
        horizon: 'extended',
        confidence: 'low',
        primaryLever: 'diversify_supply',
        priority: 'immediate',
        watchpoints: ['stall'],
      },
    );
    return row.band === 'slipped' && row.pressureSlippage > 0.08;
  });

  check('a08_comp_03', () => {
    const summary = summarizeRegionalMandateCompliance('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        priorPhase: 'next_turn',
        priorLever: 'sector_rebalance',
        currentPressure: 0.3,
        expectedPressureAfterRelief: 0.28,
        pressureSlippage: 0.01,
        band: 'on_track',
        complianceScore: 0.88,
        note: 'ok',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        priorPhase: 'next_turn',
        priorLever: 'relieve_upstream',
        currentPressure: 0.52,
        expectedPressureAfterRelief: 0.4,
        pressureSlippage: 0.18,
        band: 'slipped',
        complianceScore: 0.2,
        note: 'bad',
      },
    ]);
    return summary.slippedCount === 1 && summary.onTrackCount === 1 && summary.firmCount === 2;
  });

  check('a08_comp_04', () => {
    const gaps = buildClusterMandateComplianceGaps(
      {
        schemaVersion: '1.0.0',
        turn: 2,
        stabilizationTurn: 2,
        resilienceMomentum: 'slipping',
        nationalMomentumScore: -0.1,
        firmDirectives: [
          {
            companyId: 'x',
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
            companyId: 'y',
            regionId: 'NSW',
            phase: 'this_turn',
            primaryLever: 'relieve_upstream',
            coordinationRank: 2,
            pressureGap: 0.45,
            stabilizationTurns: 3,
            blockingClusterKey: 'QLD:energy',
            directiveSummary: 'd',
          },
        ],
        clusterMandates: [
          {
            clusterKey: 'QLD:energy',
            upstreamRegionId: 'QLD',
            supplyKind: 'energy',
            phase: 'immediate',
            affectedFirmCount: 2,
            combinedPressure: 0.7,
            sharedLever: 'relieve_upstream',
            sequencingNote: 'seq',
          },
        ],
        regions: [],
        firmsRequiringImmediateCoordination: 2,
        activeClusterCount: 1,
      },
      [
        {
          companyId: 'x',
          regionId: 'NSW',
          priorPhase: 'immediate',
          priorLever: 'relieve_upstream',
          currentPressure: 0.68,
          expectedPressureAfterRelief: 0.45,
          pressureSlippage: 0.23,
          band: 'slipped',
          complianceScore: 0.25,
          note: 'n',
        },
        {
          companyId: 'y',
          regionId: 'NSW',
          priorPhase: 'this_turn',
          priorLever: 'relieve_upstream',
          currentPressure: 0.55,
          expectedPressureAfterRelief: 0.38,
          pressureSlippage: 0.19,
          band: 'slipped',
          complianceScore: 0.35,
          note: 'n',
        },
      ],
    );
    return gaps.length === 1 && gaps[0].coordinationGap === 'severe';
  });

  check('a08_comp_05', () => {
    const compliance = computeNationalProductionMandateCompliance({
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
      compliance.schemaVersion === AGENT08_COMPLIANCE_SCHEMA_VERSION &&
      compliance.firms.length >= 1 &&
      compliance.nationalComplianceScore >= 0 &&
      compliance.nationalComplianceScore <= 1
    );
  });

  return results;
}
