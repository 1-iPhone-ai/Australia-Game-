/**
 * Agent 08 round 18 — transition deployment posture from mobilization bands.
 * Non-authoritative planning layer (deployment bands, not ledger enforcement).
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
import type { NationalProductionTransitionCommitment } from './production-transition-commitment';
import {
  computeNationalProductionTransitionMobilization,
  type FirmProductionTransitionMobilization,
  type NationalProductionTransitionMobilization,
  type TransitionMobilizationBand,
} from './production-transition-mobilization';

export const AGENT08_TRANSITION_DEPLOYMENT_SCHEMA_VERSION = '1.0.0';

export type TransitionDeploymentBand = 'staged' | 'pilot' | 'rollout' | 'live';

export interface FirmProductionTransitionDeployment {
  companyId: string;
  regionId: string;
  deploymentBand: TransitionDeploymentBand;
  mobilizationBand: TransitionMobilizationBand;
  deployedLever: ProductionRecoveryLever;
  turnsToLive: number;
  deploymentScore: number;
  deploymentRank: number;
  deploymentSummary: string;
}

export interface RegionalTransitionDeploymentSummary {
  regionId: string;
  firmCount: number;
  liveCount: number;
  rolloutCount: number;
  avgDeploymentScore: number;
  regionalDeploymentPressure: number;
  dominantBand: TransitionDeploymentBand;
}

export interface NationalProductionTransitionDeployment {
  schemaVersion: typeof AGENT08_TRANSITION_DEPLOYMENT_SCHEMA_VERSION;
  turn: number;
  mobilizationTurn: number;
  nationalDeploymentPressure: number;
  nationalDeploymentBand: TransitionDeploymentBand;
  firmsLive: number;
  firmDeployments: FirmProductionTransitionDeployment[];
  regions: RegionalTransitionDeploymentSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const DEP_BAND_ORDER: TransitionDeploymentBand[] = ['staged', 'pilot', 'rollout', 'live'];

function deploymentBandFromMobilization(mobilization: FirmProductionTransitionMobilization): TransitionDeploymentBand {
  switch (mobilization.mobilizationBand) {
    case 'surge':
      return 'live';
    case 'mobilize':
      return 'rollout';
    case 'rally':
      return 'pilot';
    default:
      return 'staged';
  }
}

function deploymentScoreFromSignals(
  band: TransitionDeploymentBand,
  mobilization: FirmProductionTransitionMobilization,
): number {
  const bandBase =
    band === 'live' ? 0.95 : band === 'rollout' ? 0.72 : band === 'pilot' ? 0.44 : 0.16;
  const mobilizationAdj = mobilization.mobilizationScore * 0.14;
  const urgencyAdj =
    mobilization.mobilizationBand === 'surge'
      ? 0.05
      : mobilization.mobilizationBand === 'mobilize'
        ? 0.03
        : mobilization.mobilizationBand === 'rally'
          ? 0.015
          : 0;
  return clamp(Math.round((bandBase + mobilizationAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionDeployment(
  mobilization: FirmProductionTransitionMobilization,
): FirmProductionTransitionDeployment {
  const deploymentBand = deploymentBandFromMobilization(mobilization);
  const deploymentScore = deploymentScoreFromSignals(deploymentBand, mobilization);
  const rankBase =
    deploymentBand === 'live'
      ? 1400
      : deploymentBand === 'rollout'
        ? 920
        : deploymentBand === 'pilot'
          ? 480
          : 120;
  const deploymentRank = Math.round(
    rankBase + mobilization.mobilizationRank * 0.28 + deploymentScore * 88,
  );

  const leverLabel = mobilization.mobilizedLever.replace(/_/g, ' ');
  const deploymentSummary =
    deploymentBand === 'live'
      ? `live ${leverLabel} within ${mobilization.turnsToDeploy} turns`
      : deploymentBand === 'rollout'
        ? `rollout ${leverLabel} from ${mobilization.mobilizationBand} mobilization`
        : deploymentBand === 'pilot'
          ? `pilot ${leverLabel} while staging capacity`
          : `staged — ${mobilization.mobilizationSummary}`;

  const turnsToLive =
    deploymentBand === 'live'
      ? Math.max(1, Math.min(mobilization.turnsToDeploy, 1))
      : deploymentBand === 'rollout'
        ? Math.max(1, mobilization.turnsToDeploy)
        : deploymentBand === 'pilot'
          ? mobilization.turnsToDeploy + 2
          : mobilization.turnsToDeploy + 5;

  return {
    companyId: mobilization.companyId,
    regionId: mobilization.regionId,
    deploymentBand,
    mobilizationBand: mobilization.mobilizationBand,
    deployedLever: mobilization.mobilizedLever,
    turnsToLive,
    deploymentScore,
    deploymentRank,
    deploymentSummary,
  };
}

export function summarizeRegionalTransitionDeployment(
  regionId: string,
  rows: FirmProductionTransitionDeployment[],
): RegionalTransitionDeploymentSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const liveCount = regional.filter(r => r.deploymentBand === 'live').length;
  const rolloutCount = regional.filter(
    r => r.deploymentBand === 'rollout' || r.deploymentBand === 'live',
  ).length;
  const avgDeploymentScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.deploymentScore, 0) / regional.length;

  const counts: Record<TransitionDeploymentBand, number> = {
    staged: 0,
    pilot: 0,
    rollout: 0,
    live: 0,
  };
  for (const r of regional) counts[r.deploymentBand] += 1;

  let dominantBand: TransitionDeploymentBand = 'staged';
  let max = -1;
  for (const b of [...DEP_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalDeploymentPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.deploymentBand === 'live'
              ? 1
              : r.deploymentBand === 'rollout'
                ? 0.68
                : r.deploymentBand === 'pilot'
                  ? 0.36
                  : 0.09;
          return acc + w * r.deploymentScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    liveCount,
    rolloutCount,
    avgDeploymentScore: Math.round(avgDeploymentScore * 1000) / 1000,
    regionalDeploymentPressure: Math.round(regionalDeploymentPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalDeploymentBand(
  pressure: number,
  firmsLive: number,
  nationalMobilizationBand: TransitionMobilizationBand,
): TransitionDeploymentBand {
  if (firmsLive >= 2 || nationalMobilizationBand === 'surge' || pressure > 0.82) return 'live';
  if (firmsLive >= 1 || nationalMobilizationBand === 'mobilize' || pressure > 0.6) return 'rollout';
  if (nationalMobilizationBand === 'rally' || pressure > 0.38) return 'pilot';
  return 'staged';
}

export function computeNationalDeploymentPressure(rows: FirmProductionTransitionDeployment[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.deploymentBand === 'live'
        ? 1
        : r.deploymentBand === 'rollout'
          ? 0.62
          : r.deploymentBand === 'pilot'
            ? 0.3
            : 0.07;
    return acc + bandW * 0.52 + r.deploymentScore * 0.48;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionDeployment(params: {
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
  mobilization?: NationalProductionTransitionMobilization;
}): NationalProductionTransitionDeployment {
  const mobilization =
    params.mobilization ??
    computeNationalProductionTransitionMobilization({
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
      commitment: params.commitment,
    });

  const firmDeployments = mobilization.firmMobilizations
    .map(buildFirmProductionTransitionDeployment)
    .sort((a, b) => b.deploymentRank - a.deploymentRank);

  const regionIds = [...new Set(firmDeployments.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionDeployment(rid, firmDeployments));

  const nationalDeploymentPressure = computeNationalDeploymentPressure(firmDeployments);
  const firmsLive = firmDeployments.filter(r => r.deploymentBand === 'live').length;
  const nationalDeploymentBand = classifyNationalDeploymentBand(
    nationalDeploymentPressure,
    firmsLive,
    mobilization.nationalMobilizationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_DEPLOYMENT_SCHEMA_VERSION,
    turn: params.turn,
    mobilizationTurn: mobilization.turn,
    nationalDeploymentPressure,
    nationalDeploymentBand,
    firmsLive,
    firmDeployments,
    regions,
  };
}

export function runAgent08TransitionDeploymentSelfTests(): Array<{
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

  check('a08_deployment_01', () => {
    const row = buildFirmProductionTransitionDeployment({
      companyId: 'f1',
      regionId: 'NSW',
      mobilizationBand: 'surge',
      commitmentBand: 'immediate',
      mobilizedLever: 'relieve_upstream',
      turnsToDeploy: 2,
      mobilizationScore: 0.93,
      mobilizationRank: 1250,
      mobilizationSummary: 's',
    });
    return row.deploymentBand === 'live' && row.deployedLever === 'relieve_upstream';
  });

  check('a08_deployment_02', () => {
    const row = buildFirmProductionTransitionDeployment({
      companyId: 'f2',
      regionId: 'VIC',
      mobilizationBand: 'standby',
      commitmentBand: 'observe',
      mobilizedLever: 'sector_rebalance',
      turnsToDeploy: 14,
      mobilizationScore: 0.2,
      mobilizationRank: 90,
      mobilizationSummary: 's',
    });
    return row.deploymentBand === 'staged';
  });

  check('a08_deployment_03', () => {
    const summary = summarizeRegionalTransitionDeployment('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        deploymentBand: 'live',
        mobilizationBand: 'surge',
        deployedLever: 'capacity_buffer',
        turnsToLive: 1,
        deploymentScore: 0.91,
        deploymentRank: 1300,
        deploymentSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        deploymentBand: 'staged',
        mobilizationBand: 'standby',
        deployedLever: 'sector_rebalance',
        turnsToLive: 18,
        deploymentScore: 0.18,
        deploymentRank: 110,
        deploymentSummary: 's',
      },
    ]);
    return summary.liveCount === 1 && summary.dominantBand === 'live';
  });

  check('a08_deployment_04', () => {
    const band = classifyNationalDeploymentBand(0.64, 1, 'mobilize');
    return band === 'rollout';
  });

  check('a08_deployment_05', () => {
    const deployment = computeNationalProductionTransitionDeployment({
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
      deployment.schemaVersion === AGENT08_TRANSITION_DEPLOYMENT_SCHEMA_VERSION &&
      deployment.firmDeployments.length >= 1 &&
      deployment.nationalDeploymentPressure >= 0 &&
      deployment.nationalDeploymentPressure <= 1
    );
  });

  return results;
}
