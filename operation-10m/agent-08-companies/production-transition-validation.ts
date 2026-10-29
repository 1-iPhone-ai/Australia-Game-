/**
 * Agent 08 round 19 — transition validation posture from deployment bands.
 * Non-authoritative planning layer (validation bands, not ledger enforcement).
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
import type { NationalProductionTransitionMobilization } from './production-transition-mobilization';
import {
  computeNationalProductionTransitionDeployment,
  type FirmProductionTransitionDeployment,
  type NationalProductionTransitionDeployment,
  type TransitionDeploymentBand,
} from './production-transition-deployment';

export const AGENT08_TRANSITION_VALIDATION_SCHEMA_VERSION = '1.0.0';

export type TransitionValidationBand = 'pending' | 'review' | 'verified' | 'anchored';

export interface FirmProductionTransitionValidation {
  companyId: string;
  regionId: string;
  validationBand: TransitionValidationBand;
  deploymentBand: TransitionDeploymentBand;
  validatedLever: ProductionRecoveryLever;
  turnsToAnchor: number;
  validationScore: number;
  validationRank: number;
  validationSummary: string;
}

export interface RegionalTransitionValidationSummary {
  regionId: string;
  firmCount: number;
  anchoredCount: number;
  verifiedCount: number;
  avgValidationScore: number;
  regionalValidationPressure: number;
  dominantBand: TransitionValidationBand;
}

export interface NationalProductionTransitionValidation {
  schemaVersion: typeof AGENT08_TRANSITION_VALIDATION_SCHEMA_VERSION;
  turn: number;
  deploymentTurn: number;
  nationalValidationPressure: number;
  nationalValidationBand: TransitionValidationBand;
  firmsAnchored: number;
  firmValidations: FirmProductionTransitionValidation[];
  regions: RegionalTransitionValidationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const VAL_BAND_ORDER: TransitionValidationBand[] = ['pending', 'review', 'verified', 'anchored'];

function validationBandFromDeployment(deployment: FirmProductionTransitionDeployment): TransitionValidationBand {
  switch (deployment.deploymentBand) {
    case 'live':
      return 'anchored';
    case 'rollout':
      return 'verified';
    case 'pilot':
      return 'review';
    default:
      return 'pending';
  }
}

function validationScoreFromSignals(
  band: TransitionValidationBand,
  deployment: FirmProductionTransitionDeployment,
): number {
  const bandBase =
    band === 'anchored' ? 0.96 : band === 'verified' ? 0.73 : band === 'review' ? 0.45 : 0.14;
  const deploymentAdj = deployment.deploymentScore * 0.13;
  const urgencyAdj =
    deployment.deploymentBand === 'live'
      ? 0.05
      : deployment.deploymentBand === 'rollout'
        ? 0.032
        : deployment.deploymentBand === 'pilot'
          ? 0.016
          : 0;
  return clamp(Math.round((bandBase + deploymentAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionValidation(
  deployment: FirmProductionTransitionDeployment,
): FirmProductionTransitionValidation {
  const validationBand = validationBandFromDeployment(deployment);
  const validationScore = validationScoreFromSignals(validationBand, deployment);
  const rankBase =
    validationBand === 'anchored'
      ? 1500
      : validationBand === 'verified'
        ? 980
        : validationBand === 'review'
          ? 520
          : 130;
  const validationRank = Math.round(
    rankBase + deployment.deploymentRank * 0.26 + validationScore * 86,
  );

  const leverLabel = deployment.deployedLever.replace(/_/g, ' ');
  const validationSummary =
    validationBand === 'anchored'
      ? `anchored ${leverLabel} after ${deployment.turnsToLive} turn live window`
      : validationBand === 'verified'
        ? `verified ${leverLabel} from ${deployment.deploymentBand} deployment`
        : validationBand === 'review'
          ? `review ${leverLabel} pilot evidence`
          : `pending — ${deployment.deploymentSummary}`;

  const turnsToAnchor =
    validationBand === 'anchored'
      ? Math.max(1, Math.min(deployment.turnsToLive, 1))
      : validationBand === 'verified'
        ? Math.max(1, deployment.turnsToLive + 1)
        : validationBand === 'review'
          ? deployment.turnsToLive + 3
          : deployment.turnsToLive + 6;

  return {
    companyId: deployment.companyId,
    regionId: deployment.regionId,
    validationBand,
    deploymentBand: deployment.deploymentBand,
    validatedLever: deployment.deployedLever,
    turnsToAnchor,
    validationScore,
    validationRank,
    validationSummary,
  };
}

export function summarizeRegionalTransitionValidation(
  regionId: string,
  rows: FirmProductionTransitionValidation[],
): RegionalTransitionValidationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const anchoredCount = regional.filter(r => r.validationBand === 'anchored').length;
  const verifiedCount = regional.filter(
    r => r.validationBand === 'verified' || r.validationBand === 'anchored',
  ).length;
  const avgValidationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.validationScore, 0) / regional.length;

  const counts: Record<TransitionValidationBand, number> = {
    pending: 0,
    review: 0,
    verified: 0,
    anchored: 0,
  };
  for (const r of regional) counts[r.validationBand] += 1;

  let dominantBand: TransitionValidationBand = 'pending';
  let max = -1;
  for (const b of [...VAL_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalValidationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.validationBand === 'anchored'
              ? 1
              : r.validationBand === 'verified'
                ? 0.66
                : r.validationBand === 'review'
                  ? 0.34
                  : 0.08;
          return acc + w * r.validationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    anchoredCount,
    verifiedCount,
    avgValidationScore: Math.round(avgValidationScore * 1000) / 1000,
    regionalValidationPressure: Math.round(regionalValidationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalValidationBand(
  pressure: number,
  firmsAnchored: number,
  nationalDeploymentBand: TransitionDeploymentBand,
): TransitionValidationBand {
  if (firmsAnchored >= 2 || nationalDeploymentBand === 'live' || pressure > 0.84) return 'anchored';
  if (firmsAnchored >= 1 || nationalDeploymentBand === 'rollout' || pressure > 0.62) return 'verified';
  if (nationalDeploymentBand === 'pilot' || pressure > 0.4) return 'review';
  return 'pending';
}

export function computeNationalValidationPressure(rows: FirmProductionTransitionValidation[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.validationBand === 'anchored'
        ? 1
        : r.validationBand === 'verified'
          ? 0.6
          : r.validationBand === 'review'
            ? 0.28
            : 0.06;
    return acc + bandW * 0.5 + r.validationScore * 0.5;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionValidation(params: {
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
  deployment?: NationalProductionTransitionDeployment;
}): NationalProductionTransitionValidation {
  const deployment =
    params.deployment ??
    computeNationalProductionTransitionDeployment({
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
      mobilization: params.mobilization,
    });

  const firmValidations = deployment.firmDeployments
    .map(buildFirmProductionTransitionValidation)
    .sort((a, b) => b.validationRank - a.validationRank);

  const regionIds = [...new Set(firmValidations.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionValidation(rid, firmValidations));

  const nationalValidationPressure = computeNationalValidationPressure(firmValidations);
  const firmsAnchored = firmValidations.filter(r => r.validationBand === 'anchored').length;
  const nationalValidationBand = classifyNationalValidationBand(
    nationalValidationPressure,
    firmsAnchored,
    deployment.nationalDeploymentBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_VALIDATION_SCHEMA_VERSION,
    turn: params.turn,
    deploymentTurn: deployment.turn,
    nationalValidationPressure,
    nationalValidationBand,
    firmsAnchored,
    firmValidations,
    regions,
  };
}

export function runAgent08TransitionValidationSelfTests(): Array<{
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

  check('a08_validation_01', () => {
    const row = buildFirmProductionTransitionValidation({
      companyId: 'f1',
      regionId: 'NSW',
      deploymentBand: 'live',
      mobilizationBand: 'surge',
      deployedLever: 'relieve_upstream',
      turnsToLive: 1,
      deploymentScore: 0.94,
      deploymentRank: 1350,
      deploymentSummary: 's',
    });
    return row.validationBand === 'anchored' && row.validatedLever === 'relieve_upstream';
  });

  check('a08_validation_02', () => {
    const row = buildFirmProductionTransitionValidation({
      companyId: 'f2',
      regionId: 'VIC',
      deploymentBand: 'staged',
      mobilizationBand: 'standby',
      deployedLever: 'sector_rebalance',
      turnsToLive: 18,
      deploymentScore: 0.19,
      deploymentRank: 95,
      deploymentSummary: 's',
    });
    return row.validationBand === 'pending';
  });

  check('a08_validation_03', () => {
    const summary = summarizeRegionalTransitionValidation('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        validationBand: 'anchored',
        deploymentBand: 'live',
        validatedLever: 'capacity_buffer',
        turnsToAnchor: 1,
        validationScore: 0.92,
        validationRank: 1400,
        validationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        validationBand: 'pending',
        deploymentBand: 'staged',
        validatedLever: 'sector_rebalance',
        turnsToAnchor: 20,
        validationScore: 0.17,
        validationRank: 120,
        validationSummary: 's',
      },
    ]);
    return summary.anchoredCount === 1 && summary.dominantBand === 'anchored';
  });

  check('a08_validation_04', () => {
    const band = classifyNationalValidationBand(0.66, 1, 'rollout');
    return band === 'verified';
  });

  check('a08_validation_05', () => {
    const validation = computeNationalProductionTransitionValidation({
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
      validation.schemaVersion === AGENT08_TRANSITION_VALIDATION_SCHEMA_VERSION &&
      validation.firmValidations.length >= 1 &&
      validation.nationalValidationPressure >= 0 &&
      validation.nationalValidationPressure <= 1
    );
  });

  return results;
}
