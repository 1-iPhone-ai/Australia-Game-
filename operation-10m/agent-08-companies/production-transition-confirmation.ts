/**
 * Agent 08 round 37 (O10-205) — transition confirmation posture from ratification bands.
 * Non-authoritative planning layer (confirmation bands, not ledger enforcement).
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
import type { NationalProductionTransitionDeployment } from './production-transition-deployment';
import type { NationalProductionTransitionValidation } from './production-transition-validation';
import type { NationalProductionTransitionConsolidation } from './production-transition-consolidation';
import type { NationalProductionTransitionSustainment } from './production-transition-sustainment';
import type { NationalProductionTransitionResilience } from './production-transition-resilience';
import type { NationalProductionTransitionEquilibrium } from './production-transition-equilibrium';
import type { NationalProductionTransitionMaturity } from './production-transition-maturity';
import type { NationalProductionTransitionContinuity } from './production-transition-continuity';
import type { NationalProductionTransitionHeritage } from './production-transition-heritage';
import type { NationalProductionTransitionCodification } from './production-transition-codification';
import type { NationalProductionTransitionStewardship } from './production-transition-stewardship';
import type { NationalProductionTransitionGovernance } from './production-transition-governance';
import type { NationalProductionTransitionAccountability } from './production-transition-accountability';
import type { NationalProductionTransitionAssurance } from './production-transition-assurance';
import type { NationalProductionTransitionTrust } from './production-transition-trust';
import type { NationalProductionTransitionLegitimacy } from './production-transition-legitimacy';
import type { NationalProductionTransitionRecognition } from './production-transition-recognition';
import type { NationalProductionTransitionPrecedence } from './production-transition-precedence';
import {
  computeNationalProductionTransitionRatification,
  type FirmProductionTransitionRatification,
  type NationalProductionTransitionRatification,
  type TransitionRatificationBand,
} from './production-transition-ratification';

export const AGENT08_TRANSITION_CONFIRMATION_SCHEMA_VERSION = '1.0.0';

export type TransitionConfirmationBand = 'uncertain' | 'forming' | 'confirmed' | 'immutable';

export interface FirmProductionTransitionConfirmation {
  companyId: string;
  regionId: string;
  confirmationBand: TransitionConfirmationBand;
  ratificationBand: TransitionRatificationBand;
  confirmedLever: ProductionRecoveryLever;
  turnsToImmutable: number;
  confirmationScore: number;
  confirmationRank: number;
  confirmationSummary: string;
}

export interface RegionalTransitionConfirmationSummary {
  regionId: string;
  firmCount: number;
  immutableCount: number;
  confirmedCount: number;
  avgConfirmationScore: number;
  regionalConfirmationPressure: number;
  dominantBand: TransitionConfirmationBand;
}

export interface NationalProductionTransitionConfirmation {
  schemaVersion: typeof AGENT08_TRANSITION_CONFIRMATION_SCHEMA_VERSION;
  turn: number;
  ratificationTurn: number;
  nationalConfirmationPressure: number;
  nationalConfirmationBand: TransitionConfirmationBand;
  firmsImmutable: number;
  firmConfirmations: FirmProductionTransitionConfirmation[];
  regions: RegionalTransitionConfirmationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const CON_BAND_ORDER: TransitionConfirmationBand[] = ['uncertain', 'forming', 'confirmed', 'immutable'];

function confirmationBandFromRatification(
  ratification: FirmProductionTransitionRatification,
): TransitionConfirmationBand {
  switch (ratification.ratificationBand) {
    case 'entrenched':
      return 'immutable';
    case 'ratified':
      return 'confirmed';
    case 'provisional':
      return 'forming';
    default:
      return 'uncertain';
  }
}

function confirmationScoreFromSignals(
  band: TransitionConfirmationBand,
  ratification: FirmProductionTransitionRatification,
): number {
  const bandBase =
    band === 'immutable'
      ? 0.999
      : band === 'confirmed'
        ? 0.91
        : band === 'forming'
          ? 0.63
          : 0.007;
  const ratificationAdj = ratification.ratificationScore * 0.04;
  const urgencyAdj =
    ratification.ratificationBand === 'entrenched'
      ? 0.017
      : ratification.ratificationBand === 'ratified'
        ? 0.003
        : ratification.ratificationBand === 'provisional'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + ratificationAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionConfirmation(
  ratification: FirmProductionTransitionRatification,
): FirmProductionTransitionConfirmation {
  const confirmationBand = confirmationBandFromRatification(ratification);
  const confirmationScore = confirmationScoreFromSignals(confirmationBand, ratification);
  const rankBase =
    confirmationBand === 'immutable'
      ? 3300
      : confirmationBand === 'confirmed'
        ? 2200
        : confirmationBand === 'forming'
          ? 1140
          : 160;
  const confirmationRank = Math.round(
    rankBase + ratification.ratificationRank * 0.046 + confirmationScore * 50,
  );

  const leverLabel = ratification.ratifiedLever.replace(/_/g, ' ');
  const confirmationSummary =
    confirmationBand === 'immutable'
      ? `immutable ${leverLabel} confirmation after ${ratification.turnsToEntrench} entrenched turns`
      : confirmationBand === 'confirmed'
        ? `confirmed ${leverLabel} from ${ratification.ratificationBand} ratification`
        : confirmationBand === 'forming'
          ? `forming ${leverLabel} while ratification proceeds`
          : `uncertain — ${ratification.ratificationSummary}`;

  const turnsToImmutable =
    confirmationBand === 'immutable'
      ? Math.max(1, Math.min(ratification.turnsToEntrench, 1))
      : confirmationBand === 'confirmed'
        ? Math.max(1, ratification.turnsToEntrench + 1)
        : confirmationBand === 'forming'
          ? ratification.turnsToEntrench + 2
          : ratification.turnsToEntrench + 13;

  return {
    companyId: ratification.companyId,
    regionId: ratification.regionId,
    confirmationBand,
    ratificationBand: ratification.ratificationBand,
    confirmedLever: ratification.ratifiedLever,
    turnsToImmutable,
    confirmationScore,
    confirmationRank,
    confirmationSummary,
  };
}

export function summarizeRegionalTransitionConfirmation(
  regionId: string,
  rows: FirmProductionTransitionConfirmation[],
): RegionalTransitionConfirmationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const immutableCount = regional.filter(r => r.confirmationBand === 'immutable').length;
  const confirmedCount = regional.filter(
    r => r.confirmationBand === 'confirmed' || r.confirmationBand === 'immutable',
  ).length;
  const avgConfirmationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.confirmationScore, 0) / regional.length;

  const counts: Record<TransitionConfirmationBand, number> = {
    uncertain: 0,
    forming: 0,
    confirmed: 0,
    immutable: 0,
  };
  for (const r of regional) counts[r.confirmationBand] += 1;

  let dominantBand: TransitionConfirmationBand = 'uncertain';
  let max = -1;
  for (const b of [...CON_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalConfirmationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.confirmationBand === 'immutable'
              ? 1
              : r.confirmationBand === 'confirmed'
                ? 0.33
                : r.confirmationBand === 'forming'
                  ? 0.05
                  : 0.0008;
          return acc + w * r.confirmationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    immutableCount,
    confirmedCount,
    avgConfirmationScore: Math.round(avgConfirmationScore * 1000) / 1000,
    regionalConfirmationPressure: Math.round(regionalConfirmationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalConfirmationBand(
  pressure: number,
  firmsImmutable: number,
  nationalRatificationBand: TransitionRatificationBand,
): TransitionConfirmationBand {
  if (firmsImmutable >= 2 || nationalRatificationBand === 'entrenched' || pressure > 0.9995)
    return 'immutable';
  if (firmsImmutable >= 1 || nationalRatificationBand === 'ratified' || pressure > 0.93)
    return 'confirmed';
  if (nationalRatificationBand === 'provisional' || pressure > 0.71) return 'forming';
  return 'uncertain';
}

export function computeNationalConfirmationPressure(
  rows: FirmProductionTransitionConfirmation[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.confirmationBand === 'immutable'
        ? 1
        : r.confirmationBand === 'confirmed'
          ? 0.29
          : r.confirmationBand === 'forming'
            ? 0.026
            : 0.0003;
    return acc + bandW * 0.19 + r.confirmationScore * 0.81;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionConfirmation(params: {
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
  validation?: NationalProductionTransitionValidation;
  consolidation?: NationalProductionTransitionConsolidation;
  sustainment?: NationalProductionTransitionSustainment;
  resilience?: NationalProductionTransitionResilience;
  equilibrium?: NationalProductionTransitionEquilibrium;
  maturity?: NationalProductionTransitionMaturity;
  continuity?: NationalProductionTransitionContinuity;
  heritage?: NationalProductionTransitionHeritage;
  codification?: NationalProductionTransitionCodification;
  stewardship?: NationalProductionTransitionStewardship;
  governance?: NationalProductionTransitionGovernance;
  accountability?: NationalProductionTransitionAccountability;
  assurance?: NationalProductionTransitionAssurance;
  trust?: NationalProductionTransitionTrust;
  legitimacy?: NationalProductionTransitionLegitimacy;
  recognition?: NationalProductionTransitionRecognition;
  precedence?: NationalProductionTransitionPrecedence;
  ratification?: NationalProductionTransitionRatification;
}): NationalProductionTransitionConfirmation {
  const ratification =
    params.ratification ??
    computeNationalProductionTransitionRatification({
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
      deployment: params.deployment,
      validation: params.validation,
      consolidation: params.consolidation,
      sustainment: params.sustainment,
      resilience: params.resilience,
      equilibrium: params.equilibrium,
      maturity: params.maturity,
      continuity: params.continuity,
      heritage: params.heritage,
      codification: params.codification,
      stewardship: params.stewardship,
      governance: params.governance,
      accountability: params.accountability,
      assurance: params.assurance,
      trust: params.trust,
      legitimacy: params.legitimacy,
      recognition: params.recognition,
      precedence: params.precedence,
    });

  const firmConfirmations = ratification.firmRatifications
    .map(buildFirmProductionTransitionConfirmation)
    .sort((a, b) => b.confirmationRank - a.confirmationRank);

  const regionIds = [...new Set(firmConfirmations.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionConfirmation(rid, firmConfirmations));

  const nationalConfirmationPressure = computeNationalConfirmationPressure(firmConfirmations);
  const firmsImmutable = firmConfirmations.filter(r => r.confirmationBand === 'immutable').length;
  const nationalConfirmationBand = classifyNationalConfirmationBand(
    nationalConfirmationPressure,
    firmsImmutable,
    ratification.nationalRatificationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_CONFIRMATION_SCHEMA_VERSION,
    turn: params.turn,
    ratificationTurn: ratification.turn,
    nationalConfirmationPressure,
    nationalConfirmationBand,
    firmsImmutable,
    firmConfirmations,
    regions,
  };
}

export function runAgent08TransitionConfirmationSelfTests(): Array<{
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

  check('a08_confirmation_01', () => {
    const row = buildFirmProductionTransitionConfirmation({
      companyId: 'f1',
      regionId: 'NSW',
      ratificationBand: 'entrenched',
      precedenceBand: 'definitive',
      ratifiedLever: 'relieve_upstream',
      turnsToEntrench: 1,
      ratificationScore: 0.999,
      ratificationRank: 3150,
      ratificationSummary: 's',
    });
    return row.confirmationBand === 'immutable' && row.confirmedLever === 'relieve_upstream';
  });

  check('a08_confirmation_02', () => {
    const row = buildFirmProductionTransitionConfirmation({
      companyId: 'f2',
      regionId: 'VIC',
      ratificationBand: 'unratified',
      precedenceBand: 'latent',
      ratifiedLever: 'sector_rebalance',
      turnsToEntrench: 102,
      ratificationScore: 0.001,
      ratificationRank: 150,
      ratificationSummary: 's',
    });
    return row.confirmationBand === 'uncertain';
  });

  check('a08_confirmation_03', () => {
    const summary = summarizeRegionalTransitionConfirmation('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        confirmationBand: 'immutable',
        ratificationBand: 'entrenched',
        confirmedLever: 'capacity_buffer',
        turnsToImmutable: 1,
        confirmationScore: 0.998,
        confirmationRank: 3200,
        confirmationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        confirmationBand: 'uncertain',
        ratificationBand: 'unratified',
        confirmedLever: 'sector_rebalance',
        turnsToImmutable: 106,
        confirmationScore: 0.001,
        confirmationRank: 150,
        confirmationSummary: 's',
      },
    ]);
    return summary.immutableCount === 1 && summary.dominantBand === 'immutable';
  });

  check('a08_confirmation_04', () => {
    const band = classifyNationalConfirmationBand(0.97, 1, 'ratified');
    return band === 'confirmed';
  });

  check('a08_confirmation_05', () => {
    const confirmation = computeNationalProductionTransitionConfirmation({
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
      confirmation.schemaVersion === AGENT08_TRANSITION_CONFIRMATION_SCHEMA_VERSION &&
      confirmation.firmConfirmations.length >= 1 &&
      confirmation.nationalConfirmationPressure >= 0 &&
      confirmation.nationalConfirmationPressure <= 1
    );
  });

  return results;
}
