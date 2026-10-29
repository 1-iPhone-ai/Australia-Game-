/**
 * Agent 08 round 16 — transition commitment posture from transition horizon outlooks.
 * Non-authoritative planning layer (commitment bands, not ledger enforcement).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import {
  computeNationalProductionTransitionHorizon,
  type FirmProductionTransitionOutlook,
  type NationalProductionTransitionHorizon,
  type TransitionHorizonBand,
  type TransitionRiskBand,
} from './production-transition-horizon';
import type { ProductionRecoveryLever } from './production-recovery-playbook';
import type {
  FirmProductionOperatingPriority,
  NationalProductionOperatingPriorities,
} from './production-operating-priorities';

export const AGENT08_TRANSITION_COMMITMENT_SCHEMA_VERSION = '1.0.0';

export type TransitionCommitmentBand = 'observe' | 'stage' | 'commit' | 'immediate';

export interface FirmProductionTransitionCommitment {
  companyId: string;
  regionId: string;
  commitmentBand: TransitionCommitmentBand;
  horizonBand: TransitionHorizonBand;
  transitionRisk: TransitionRiskBand;
  committedLever: ProductionRecoveryLever;
  turnsWithinHorizon: number;
  commitmentScore: number;
  commitmentRank: number;
  commitmentSummary: string;
}

export interface RegionalTransitionCommitmentSummary {
  regionId: string;
  firmCount: number;
  immediateCount: number;
  commitCount: number;
  avgCommitmentScore: number;
  regionalCommitmentPressure: number;
  dominantBand: TransitionCommitmentBand;
}

export interface NationalProductionTransitionCommitment {
  schemaVersion: typeof AGENT08_TRANSITION_COMMITMENT_SCHEMA_VERSION;
  turn: number;
  horizonTurn: number;
  nationalCommitmentPressure: number;
  nationalCommitmentBand: TransitionCommitmentBand;
  firmsImmediate: number;
  firmCommitments: FirmProductionTransitionCommitment[];
  regions: RegionalTransitionCommitmentSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const BAND_ORDER: TransitionCommitmentBand[] = ['observe', 'stage', 'commit', 'immediate'];

function commitmentBandFromOutlook(
  outlook: FirmProductionTransitionOutlook,
  priority?: FirmProductionOperatingPriority,
): TransitionCommitmentBand {
  const priorityBand = priority?.priorityBand;
  if (outlook.transitionRisk === 'severe' || priorityBand === 'intervene') return 'immediate';
  if (outlook.horizonBand === 'near_term' || outlook.transitionRisk === 'elevated' || priorityBand === 'escalate') {
    return 'commit';
  }
  if (outlook.horizonBand === 'mid_turn' || outlook.transitionRisk === 'moderate' || priorityBand === 'monitor') {
    return 'stage';
  }
  return 'observe';
}

function commitmentScoreFromSignals(
  band: TransitionCommitmentBand,
  outlook: FirmProductionTransitionOutlook,
): number {
  const bandBase =
    band === 'immediate' ? 0.92 : band === 'commit' ? 0.72 : band === 'stage' ? 0.48 : 0.22;
  const horizonAdj =
    outlook.horizonBand === 'near_term' ? 0.08 : outlook.horizonBand === 'mid_turn' ? 0.04 : 0;
  const riskAdj =
    outlook.transitionRisk === 'severe'
      ? 0.06
      : outlook.transitionRisk === 'elevated'
        ? 0.04
        : outlook.transitionRisk === 'moderate'
          ? 0.02
          : 0;
  return clamp(Math.round((bandBase + horizonAdj + riskAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionCommitment(params: {
  outlook: FirmProductionTransitionOutlook;
  priority?: FirmProductionOperatingPriority;
}): FirmProductionTransitionCommitment {
  const commitmentBand = commitmentBandFromOutlook(params.outlook, params.priority);
  const committedLever = params.priority?.suggestedLever ?? params.outlook.suggestedLever;
  const commitmentScore = commitmentScoreFromSignals(commitmentBand, params.outlook);
  const rankBase =
    commitmentBand === 'immediate'
      ? 1200
      : commitmentBand === 'commit'
        ? 780
        : commitmentBand === 'stage'
          ? 360
          : 120;
  const commitmentRank = Math.round(
    rankBase + params.outlook.transitionRank * 0.35 + commitmentScore * 90,
  );

  const commitmentSummary =
    commitmentBand === 'immediate'
      ? `immediate ${committedLever.replace(/_/g, ' ')} within ${params.outlook.estimatedTurnsToStabilize} turns`
      : commitmentBand === 'commit'
        ? `commit to ${committedLever.replace(/_/g, ' ')} this horizon`
        : commitmentBand === 'stage'
          ? `stage ${committedLever.replace(/_/g, ' ')} for ${params.outlook.horizonBand.replace(/_/g, ' ')}`
          : `observe ${params.outlook.readinessTier} readiness — no lever pull yet`;

  return {
    companyId: params.outlook.companyId,
    regionId: params.outlook.regionId,
    commitmentBand,
    horizonBand: params.outlook.horizonBand,
    transitionRisk: params.outlook.transitionRisk,
    committedLever,
    turnsWithinHorizon: params.outlook.estimatedTurnsToStabilize,
    commitmentScore,
    commitmentRank,
    commitmentSummary,
  };
}

export function summarizeRegionalTransitionCommitment(
  regionId: string,
  commitments: FirmProductionTransitionCommitment[],
): RegionalTransitionCommitmentSummary {
  const regional = commitments.filter(c => c.regionId === regionId);
  const immediateCount = regional.filter(c => c.commitmentBand === 'immediate').length;
  const commitCount = regional.filter(c => c.commitmentBand === 'commit' || c.commitmentBand === 'immediate').length;
  const avgCommitmentScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, c) => a + c.commitmentScore, 0) / regional.length;

  const counts: Record<TransitionCommitmentBand, number> = {
    observe: 0,
    stage: 0,
    commit: 0,
    immediate: 0,
  };
  for (const c of regional) counts[c.commitmentBand] += 1;

  let dominantBand: TransitionCommitmentBand = 'observe';
  let max = -1;
  for (const b of [...BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalCommitmentPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, c) => {
          const w =
            c.commitmentBand === 'immediate'
              ? 1
              : c.commitmentBand === 'commit'
                ? 0.68
                : c.commitmentBand === 'stage'
                  ? 0.38
                  : 0.12;
          return acc + w * c.commitmentScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    immediateCount,
    commitCount,
    avgCommitmentScore: Math.round(avgCommitmentScore * 1000) / 1000,
    regionalCommitmentPressure: Math.round(regionalCommitmentPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalCommitmentBand(
  pressure: number,
  firmsImmediate: number,
  horizonRisk: TransitionRiskBand,
): TransitionCommitmentBand {
  if (firmsImmediate >= 2 || horizonRisk === 'severe' || pressure > 0.78) return 'immediate';
  if (firmsImmediate >= 1 || horizonRisk === 'elevated' || pressure > 0.55) return 'commit';
  if (horizonRisk === 'moderate' || pressure > 0.35) return 'stage';
  return 'observe';
}

export function computeNationalCommitmentPressure(commitments: FirmProductionTransitionCommitment[]): number {
  if (commitments.length === 0) return 0;
  const weighted = commitments.reduce((acc, c) => {
    const bandW =
      c.commitmentBand === 'immediate'
        ? 1
        : c.commitmentBand === 'commit'
          ? 0.62
          : c.commitmentBand === 'stage'
            ? 0.34
            : 0.1;
    return acc + bandW * 0.6 + c.commitmentScore * 0.4;
  }, 0);
  return clamp(Math.round((weighted / commitments.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionCommitment(params: {
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
}): NationalProductionTransitionCommitment {
  const horizon =
    params.horizon ??
    computeNationalProductionTransitionHorizon({
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
      priorities: params.priorities,
    });

  const priorityByFirm = new Map(
    (params.priorities?.firmPriorities ?? []).map(p => [p.companyId, p] as const),
  );

  const firmCommitments = horizon.firmOutlooks
    .map(outlook =>
      buildFirmProductionTransitionCommitment({
        outlook,
        priority: priorityByFirm.get(outlook.companyId),
      }),
    )
    .sort((a, b) => b.commitmentRank - a.commitmentRank);

  const regionIds = [...new Set(firmCommitments.map(c => c.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionCommitment(rid, firmCommitments));

  const nationalCommitmentPressure = computeNationalCommitmentPressure(firmCommitments);
  const firmsImmediate = firmCommitments.filter(c => c.commitmentBand === 'immediate').length;
  const nationalCommitmentBand = classifyNationalCommitmentBand(
    nationalCommitmentPressure,
    firmsImmediate,
    horizon.nationalTransitionRisk,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_COMMITMENT_SCHEMA_VERSION,
    turn: params.turn,
    horizonTurn: horizon.turn,
    nationalCommitmentPressure,
    nationalCommitmentBand,
    firmsImmediate,
    firmCommitments,
    regions,
  };
}

export function runAgent08TransitionCommitmentSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_commitment_01', () => {
    const row = buildFirmProductionTransitionCommitment({
      outlook: {
        companyId: 'f1',
        regionId: 'NSW',
        horizonBand: 'near_term',
        transitionRisk: 'severe',
        estimatedTurnsToStabilize: 2,
        suggestedLever: 'relieve_upstream',
        readinessTier: 'impaired',
        transitionRank: 900,
        outlookSummary: 's',
      },
    });
    return row.commitmentBand === 'immediate' && row.committedLever === 'relieve_upstream';
  });

  check('a08_commitment_02', () => {
    const row = buildFirmProductionTransitionCommitment({
      outlook: {
        companyId: 'f2',
        regionId: 'VIC',
        horizonBand: 'extended',
        transitionRisk: 'low',
        estimatedTurnsToStabilize: 12,
        suggestedLever: 'sector_rebalance',
        readinessTier: 'ready',
        transitionRank: 80,
        outlookSummary: 's',
      },
    });
    return row.commitmentBand === 'observe';
  });

  check('a08_commitment_03', () => {
    const summary = summarizeRegionalTransitionCommitment('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        commitmentBand: 'immediate',
        horizonBand: 'near_term',
        transitionRisk: 'severe',
        committedLever: 'capacity_buffer',
        turnsWithinHorizon: 2,
        commitmentScore: 0.9,
        commitmentRank: 1000,
        commitmentSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        commitmentBand: 'observe',
        horizonBand: 'extended',
        transitionRisk: 'low',
        committedLever: 'sector_rebalance',
        turnsWithinHorizon: 10,
        commitmentScore: 0.25,
        commitmentRank: 100,
        commitmentSummary: 's',
      },
    ]);
    return summary.immediateCount === 1 && summary.dominantBand === 'immediate';
  });

  check('a08_commitment_04', () => {
    const band = classifyNationalCommitmentBand(0.6, 1, 'elevated');
    return band === 'commit';
  });

  check('a08_commitment_05', () => {
    const commitment = computeNationalProductionTransitionCommitment({
      turn: 5,
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
        lastUpdatedTurn: 5,
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
      commitment.schemaVersion === AGENT08_TRANSITION_COMMITMENT_SCHEMA_VERSION &&
      commitment.firmCommitments.length >= 1 &&
      commitment.nationalCommitmentPressure >= 0 &&
      commitment.nationalCommitmentPressure <= 1
    );
  });

  return results;
}
