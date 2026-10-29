/**
 * Agent 08 round 17 — transition mobilization posture from transition commitment bands.
 * Non-authoritative planning layer (mobilization bands, not ledger enforcement).
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import type { ProductionRecoveryLever } from './production-recovery-playbook';
import type { NationalProductionOperatingPriorities } from './production-operating-priorities';
import type { NationalProductionTransitionHorizon } from './production-transition-horizon';
import {
  computeNationalProductionTransitionCommitment,
  type FirmProductionTransitionCommitment,
  type NationalProductionTransitionCommitment,
  type TransitionCommitmentBand,
} from './production-transition-commitment';

export const AGENT08_TRANSITION_MOBILIZATION_SCHEMA_VERSION = '1.0.0';

export type TransitionMobilizationBand = 'standby' | 'rally' | 'mobilize' | 'surge';

export interface FirmProductionTransitionMobilization {
  companyId: string;
  regionId: string;
  mobilizationBand: TransitionMobilizationBand;
  commitmentBand: TransitionCommitmentBand;
  mobilizedLever: ProductionRecoveryLever;
  turnsToDeploy: number;
  mobilizationScore: number;
  mobilizationRank: number;
  mobilizationSummary: string;
}

export interface RegionalTransitionMobilizationSummary {
  regionId: string;
  firmCount: number;
  surgeCount: number;
  mobilizeCount: number;
  avgMobilizationScore: number;
  regionalMobilizationPressure: number;
  dominantBand: TransitionMobilizationBand;
}

export interface NationalProductionTransitionMobilization {
  schemaVersion: typeof AGENT08_TRANSITION_MOBILIZATION_SCHEMA_VERSION;
  turn: number;
  commitmentTurn: number;
  nationalMobilizationPressure: number;
  nationalMobilizationBand: TransitionMobilizationBand;
  firmsSurging: number;
  firmMobilizations: FirmProductionTransitionMobilization[];
  regions: RegionalTransitionMobilizationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const MOB_BAND_ORDER: TransitionMobilizationBand[] = ['standby', 'rally', 'mobilize', 'surge'];

function mobilizationBandFromCommitment(commitment: FirmProductionTransitionCommitment): TransitionMobilizationBand {
  switch (commitment.commitmentBand) {
    case 'immediate':
      return 'surge';
    case 'commit':
      return 'mobilize';
    case 'stage':
      return 'rally';
    default:
      return 'standby';
  }
}

function mobilizationScoreFromSignals(
  band: TransitionMobilizationBand,
  commitment: FirmProductionTransitionCommitment,
): number {
  const bandBase =
    band === 'surge' ? 0.94 : band === 'mobilize' ? 0.74 : band === 'rally' ? 0.46 : 0.18;
  const commitmentAdj = commitment.commitmentScore * 0.12;
  const urgencyAdj =
    commitment.transitionRisk === 'severe'
      ? 0.06
      : commitment.transitionRisk === 'elevated'
        ? 0.04
        : commitment.transitionRisk === 'moderate'
          ? 0.02
          : 0;
  return clamp(Math.round((bandBase + commitmentAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionMobilization(
  commitment: FirmProductionTransitionCommitment,
): FirmProductionTransitionMobilization {
  const mobilizationBand = mobilizationBandFromCommitment(commitment);
  const mobilizationScore = mobilizationScoreFromSignals(mobilizationBand, commitment);
  const rankBase =
    mobilizationBand === 'surge'
      ? 1300
      : mobilizationBand === 'mobilize'
        ? 860
        : mobilizationBand === 'rally'
          ? 420
          : 100;
  const mobilizationRank = Math.round(
    rankBase + commitment.commitmentRank * 0.3 + mobilizationScore * 95,
  );

  const leverLabel = commitment.committedLever.replace(/_/g, ' ');
  const mobilizationSummary =
    mobilizationBand === 'surge'
      ? `surge ${leverLabel} within ${commitment.turnsWithinHorizon} turns`
      : mobilizationBand === 'mobilize'
        ? `mobilize ${leverLabel} from ${commitment.commitmentBand} commitment`
        : mobilizationBand === 'rally'
          ? `rally resources to stage ${leverLabel}`
          : `standby — ${commitment.commitmentSummary}`;

  const turnsToDeploy =
    mobilizationBand === 'surge'
      ? Math.max(1, Math.min(commitment.turnsWithinHorizon, 2))
      : mobilizationBand === 'mobilize'
        ? Math.max(1, commitment.turnsWithinHorizon - 1)
        : mobilizationBand === 'rally'
          ? commitment.turnsWithinHorizon + 1
          : commitment.turnsWithinHorizon + 4;

  return {
    companyId: commitment.companyId,
    regionId: commitment.regionId,
    mobilizationBand,
    commitmentBand: commitment.commitmentBand,
    mobilizedLever: commitment.committedLever,
    turnsToDeploy,
    mobilizationScore,
    mobilizationRank,
    mobilizationSummary,
  };
}

export function summarizeRegionalTransitionMobilization(
  regionId: string,
  rows: FirmProductionTransitionMobilization[],
): RegionalTransitionMobilizationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const surgeCount = regional.filter(r => r.mobilizationBand === 'surge').length;
  const mobilizeCount = regional.filter(
    r => r.mobilizationBand === 'mobilize' || r.mobilizationBand === 'surge',
  ).length;
  const avgMobilizationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.mobilizationScore, 0) / regional.length;

  const counts: Record<TransitionMobilizationBand, number> = {
    standby: 0,
    rally: 0,
    mobilize: 0,
    surge: 0,
  };
  for (const r of regional) counts[r.mobilizationBand] += 1;

  let dominantBand: TransitionMobilizationBand = 'standby';
  let max = -1;
  for (const b of [...MOB_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalMobilizationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.mobilizationBand === 'surge'
              ? 1
              : r.mobilizationBand === 'mobilize'
                ? 0.7
                : r.mobilizationBand === 'rally'
                  ? 0.38
                  : 0.1;
          return acc + w * r.mobilizationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    surgeCount,
    mobilizeCount,
    avgMobilizationScore: Math.round(avgMobilizationScore * 1000) / 1000,
    regionalMobilizationPressure: Math.round(regionalMobilizationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalMobilizationBand(
  pressure: number,
  firmsSurging: number,
  nationalCommitmentBand: TransitionCommitmentBand,
): TransitionMobilizationBand {
  if (firmsSurging >= 2 || nationalCommitmentBand === 'immediate' || pressure > 0.8) return 'surge';
  if (firmsSurging >= 1 || nationalCommitmentBand === 'commit' || pressure > 0.58) return 'mobilize';
  if (nationalCommitmentBand === 'stage' || pressure > 0.36) return 'rally';
  return 'standby';
}

export function computeNationalMobilizationPressure(
  rows: FirmProductionTransitionMobilization[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.mobilizationBand === 'surge'
        ? 1
        : r.mobilizationBand === 'mobilize'
          ? 0.64
          : r.mobilizationBand === 'rally'
            ? 0.32
            : 0.08;
    return acc + bandW * 0.55 + r.mobilizationScore * 0.45;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionMobilization(params: {
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
  commitment?: NationalProductionTransitionCommitment;
}): NationalProductionTransitionMobilization {
  const commitment =
    params.commitment ??
    computeNationalProductionTransitionCommitment({
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
      horizon: params.horizon,
      priorities: params.priorities,
    });

  const firmMobilizations = commitment.firmCommitments
    .map(buildFirmProductionTransitionMobilization)
    .sort((a, b) => b.mobilizationRank - a.mobilizationRank);

  const regionIds = [...new Set(firmMobilizations.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionMobilization(rid, firmMobilizations));

  const nationalMobilizationPressure = computeNationalMobilizationPressure(firmMobilizations);
  const firmsSurging = firmMobilizations.filter(r => r.mobilizationBand === 'surge').length;
  const nationalMobilizationBand = classifyNationalMobilizationBand(
    nationalMobilizationPressure,
    firmsSurging,
    commitment.nationalCommitmentBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_MOBILIZATION_SCHEMA_VERSION,
    turn: params.turn,
    commitmentTurn: commitment.turn,
    nationalMobilizationPressure,
    nationalMobilizationBand,
    firmsSurging,
    firmMobilizations,
    regions,
  };
}

export function runAgent08TransitionMobilizationSelfTests(): Array<{
  id: string;
  passed: boolean;
  detail: string;
}> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_mobilization_01', () => {
    const row = buildFirmProductionTransitionMobilization({
      companyId: 'f1',
      regionId: 'NSW',
      commitmentBand: 'immediate',
      horizonBand: 'near_term',
      transitionRisk: 'severe',
      committedLever: 'relieve_upstream',
      turnsWithinHorizon: 2,
      commitmentScore: 0.92,
      commitmentRank: 1100,
      commitmentSummary: 's',
    });
    return row.mobilizationBand === 'surge' && row.mobilizedLever === 'relieve_upstream';
  });

  check('a08_mobilization_02', () => {
    const row = buildFirmProductionTransitionMobilization({
      companyId: 'f2',
      regionId: 'VIC',
      commitmentBand: 'observe',
      horizonBand: 'extended',
      transitionRisk: 'low',
      committedLever: 'sector_rebalance',
      turnsWithinHorizon: 12,
      commitmentScore: 0.22,
      commitmentRank: 80,
      commitmentSummary: 's',
    });
    return row.mobilizationBand === 'standby';
  });

  check('a08_mobilization_03', () => {
    const summary = summarizeRegionalTransitionMobilization('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        mobilizationBand: 'surge',
        commitmentBand: 'immediate',
        mobilizedLever: 'capacity_buffer',
        turnsToDeploy: 2,
        mobilizationScore: 0.9,
        mobilizationRank: 1200,
        mobilizationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        mobilizationBand: 'standby',
        commitmentBand: 'observe',
        mobilizedLever: 'sector_rebalance',
        turnsToDeploy: 14,
        mobilizationScore: 0.2,
        mobilizationRank: 100,
        mobilizationSummary: 's',
      },
    ]);
    return summary.surgeCount === 1 && summary.dominantBand === 'surge';
  });

  check('a08_mobilization_04', () => {
    const band = classifyNationalMobilizationBand(0.62, 1, 'commit');
    return band === 'mobilize';
  });

  check('a08_mobilization_05', () => {
    const mobilization = computeNationalProductionTransitionMobilization({
      turn: 6,
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
        lastUpdatedTurn: 6,
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
      mobilization.schemaVersion === AGENT08_TRANSITION_MOBILIZATION_SCHEMA_VERSION &&
      mobilization.firmMobilizations.length >= 1 &&
      mobilization.nationalMobilizationPressure >= 0 &&
      mobilization.nationalMobilizationPressure <= 1
    );
  });

  return results;
}
