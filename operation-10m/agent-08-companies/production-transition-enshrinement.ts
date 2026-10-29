/**
 * Agent 08 round 48 (O10-227) — transition enshrinement posture from veneration bands.
 * Non-authoritative planning layer (enshrinement bands, not ledger enforcement).
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
import type { NationalProductionTransitionRatification } from './production-transition-ratification';
import type { NationalProductionTransitionConfirmation } from './production-transition-confirmation';
import type { NationalProductionTransitionFinalization } from './production-transition-finalization';
import type { NationalProductionTransitionClosure } from './production-transition-closure';
import type { NationalProductionTransitionCompletion } from './production-transition-completion';
import type { NationalProductionTransitionResolution } from './production-transition-resolution';
import type { NationalProductionTransitionSettlement } from './production-transition-settlement';
import type { NationalProductionTransitionRetirement } from './production-transition-retirement';
import type { NationalProductionTransitionLegacy } from './production-transition-legacy';
import type { NationalProductionTransitionCommemoration } from './production-transition-commemoration';
import {
  computeNationalProductionTransitionVeneration,
  type FirmProductionTransitionVeneration,
  type NationalProductionTransitionVeneration,
  type TransitionVenerationBand,
} from './production-transition-veneration';

export const AGENT08_TRANSITION_ENSHRINEMENT_SCHEMA_VERSION = '1.0.0';

export type TransitionEnshrinementBand = 'nominal' | 'registered' | 'enshrined' | 'perpetual';

export interface FirmProductionTransitionEnshrinement {
  companyId: string;
  regionId: string;
  enshrinementBand: TransitionEnshrinementBand;
  venerationBand: TransitionVenerationBand;
  enshrinedLever: ProductionRecoveryLever;
  turnsToPerpetual: number;
  enshrinementScore: number;
  enshrinementRank: number;
  enshrinementSummary: string;
}

export interface RegionalTransitionEnshrinementSummary {
  regionId: string;
  firmCount: number;
  perpetualCount: number;
  enshrinedCount: number;
  avgEnshrinementScore: number;
  regionalEnshrinementPressure: number;
  dominantBand: TransitionEnshrinementBand;
}

export interface NationalProductionTransitionEnshrinement {
  schemaVersion: typeof AGENT08_TRANSITION_ENSHRINEMENT_SCHEMA_VERSION;
  turn: number;
  venerationTurn: number;
  nationalEnshrinementPressure: number;
  nationalEnshrinementBand: TransitionEnshrinementBand;
  firmsPerpetual: number;
  firmEnshrinements: FirmProductionTransitionEnshrinement[];
  regions: RegionalTransitionEnshrinementSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const ENSHRINE_BAND_ORDER: TransitionEnshrinementBand[] = ['nominal', 'registered', 'enshrined', 'perpetual'];

function enshrinementBandFromVeneration(
  veneration: FirmProductionTransitionVeneration,
): TransitionEnshrinementBand {
  switch (veneration.venerationBand) {
    case 'canonized':
      return 'perpetual';
    case 'venerated':
      return 'enshrined';
    case 'revered':
      return 'registered';
    default:
      return 'nominal';
  }
}

function enshrinementScoreFromSignals(
  band: TransitionEnshrinementBand,
  veneration: FirmProductionTransitionVeneration,
): number {
  const bandBase =
    band === 'perpetual' ? 0.9995 : band === 'enshrined' ? 0.987 : band === 'registered' ? 0.72 : 0.001;
  const venerationAdj = veneration.venerationScore * 0.023;
  const urgencyAdj =
    veneration.venerationBand === 'canonized'
      ? 0.01
      : veneration.venerationBand === 'venerated'
        ? 0.0025
        : veneration.venerationBand === 'revered'
          ? 0.0012
          : 0;
  return clamp(Math.round((bandBase + venerationAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionEnshrinement(
  veneration: FirmProductionTransitionVeneration,
): FirmProductionTransitionEnshrinement {
  const enshrinementBand = enshrinementBandFromVeneration(veneration);
  const enshrinementScore = enshrinementScoreFromSignals(enshrinementBand, veneration);
  const rankBase =
    enshrinementBand === 'perpetual'
      ? 4400
      : enshrinementBand === 'enshrined'
        ? 3100
        : enshrinementBand === 'registered'
          ? 1500
          : 65;
  const enshrinementRank = Math.round(
    rankBase + veneration.venerationRank * 0.027 + enshrinementScore * 38,
  );

  const leverLabel = veneration.veneratedLever.replace(/_/g, ' ');
  const enshrinementSummary =
    enshrinementBand === 'perpetual'
      ? `perpetual ${leverLabel} enshrinement after ${veneration.turnsToCanonized} canonized turns`
      : enshrinementBand === 'enshrined'
        ? `enshrined ${leverLabel} from ${veneration.venerationBand} veneration`
        : enshrinementBand === 'registered'
          ? `registered ${leverLabel} while veneration is revered`
          : `nominal — ${veneration.venerationSummary}`;

  const turnsToPerpetual =
    enshrinementBand === 'perpetual'
      ? Math.max(1, Math.min(veneration.turnsToCanonized, 1))
      : enshrinementBand === 'enshrined'
        ? Math.max(1, veneration.turnsToCanonized + 1)
        : enshrinementBand === 'registered'
          ? veneration.turnsToCanonized + 2
          : veneration.turnsToCanonized + 5;

  return {
    companyId: veneration.companyId,
    regionId: veneration.regionId,
    enshrinementBand,
    venerationBand: veneration.venerationBand,
    enshrinedLever: veneration.veneratedLever,
    turnsToPerpetual,
    enshrinementScore,
    enshrinementRank,
    enshrinementSummary,
  };
}

export function summarizeRegionalTransitionEnshrinement(
  regionId: string,
  rows: FirmProductionTransitionEnshrinement[],
): RegionalTransitionEnshrinementSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const perpetualCount = regional.filter(r => r.enshrinementBand === 'perpetual').length;
  const enshrinedCount = regional.filter(
    r => r.enshrinementBand === 'enshrined' || r.enshrinementBand === 'perpetual',
  ).length;
  const avgEnshrinementScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.enshrinementScore, 0) / regional.length;

  const counts: Record<TransitionEnshrinementBand, number> = {
    nominal: 0,
    registered: 0,
    enshrined: 0,
    perpetual: 0,
  };
  for (const r of regional) counts[r.enshrinementBand] += 1;

  let dominantBand: TransitionEnshrinementBand = 'nominal';
  let max = -1;
  for (const b of [...ENSHRINE_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalEnshrinementPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.enshrinementBand === 'perpetual'
              ? 1
              : r.enshrinementBand === 'enshrined'
                ? 0.26
                : r.enshrinementBand === 'registered'
                  ? 0.025
                  : 0.00005;
          return acc + w * r.enshrinementScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    perpetualCount,
    enshrinedCount,
    avgEnshrinementScore: Math.round(avgEnshrinementScore * 1000) / 1000,
    regionalEnshrinementPressure: Math.round(regionalEnshrinementPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalEnshrinementBand(
  pressure: number,
  firmsPerpetual: number,
  nationalVenerationBand: TransitionVenerationBand,
): TransitionEnshrinementBand {
  if (firmsPerpetual >= 2 || nationalVenerationBand === 'canonized' || pressure > 0.9999995)
    return 'perpetual';
  if (firmsPerpetual >= 1 || nationalVenerationBand === 'venerated' || pressure > 0.993)
    return 'enshrined';
  if (nationalVenerationBand === 'revered' || pressure > 0.8) return 'registered';
  return 'nominal';
}

export function computeNationalEnshrinementPressure(
  rows: FirmProductionTransitionEnshrinement[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.enshrinementBand === 'perpetual'
        ? 1
        : r.enshrinementBand === 'enshrined'
          ? 0.23
          : r.enshrinementBand === 'registered'
            ? 0.012
            : 0.000008;
    return acc + bandW * 0.11 + r.enshrinementScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionEnshrinement(params: {
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
  confirmation?: NationalProductionTransitionConfirmation;
  finalization?: NationalProductionTransitionFinalization;
  closure?: NationalProductionTransitionClosure;
  completion?: NationalProductionTransitionCompletion;
  resolution?: NationalProductionTransitionResolution;
  settlement?: NationalProductionTransitionSettlement;
  retirement?: NationalProductionTransitionRetirement;
  legacy?: NationalProductionTransitionLegacy;
  commemoration?: NationalProductionTransitionCommemoration;
  veneration?: NationalProductionTransitionVeneration;
}): NationalProductionTransitionEnshrinement {
  const veneration =
    params.veneration ??
    computeNationalProductionTransitionVeneration({
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
      ratification: params.ratification,
      confirmation: params.confirmation,
      finalization: params.finalization,
      closure: params.closure,
      completion: params.completion,
      resolution: params.resolution,
      settlement: params.settlement,
      retirement: params.retirement,
      legacy: params.legacy,
      commemoration: params.commemoration,
    });

  const firmEnshrinements = veneration.firmVenerations
    .map(buildFirmProductionTransitionEnshrinement)
    .sort((a, b) => b.enshrinementRank - a.enshrinementRank);

  const regionIds = [...new Set(firmEnshrinements.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionEnshrinement(rid, firmEnshrinements));

  const nationalEnshrinementPressure = computeNationalEnshrinementPressure(firmEnshrinements);
  const firmsPerpetual = firmEnshrinements.filter(r => r.enshrinementBand === 'perpetual').length;
  const nationalEnshrinementBand = classifyNationalEnshrinementBand(
    nationalEnshrinementPressure,
    firmsPerpetual,
    veneration.nationalVenerationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_ENSHRINEMENT_SCHEMA_VERSION,
    turn: params.turn,
    venerationTurn: veneration.turn,
    nationalEnshrinementPressure,
    nationalEnshrinementBand,
    firmsPerpetual,
    firmEnshrinements,
    regions,
  };
}

export function runAgent08TransitionEnshrinementSelfTests(): Array<{
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

  check('a08_enshrinement_01', () => {
    const row = buildFirmProductionTransitionEnshrinement({
      companyId: 'f1',
      regionId: 'NSW',
      venerationBand: 'canonized',
      commemorationBand: 'sanctified',
      veneratedLever: 'relieve_upstream',
      turnsToCanonized: 1,
      venerationScore: 0.999,
      venerationRank: 4300,
      venerationSummary: 's',
    });
    return row.enshrinementBand === 'perpetual' && row.enshrinedLever === 'relieve_upstream';
  });

  check('a08_enshrinement_02', () => {
    const row = buildFirmProductionTransitionEnshrinement({
      companyId: 'f2',
      regionId: 'VIC',
      venerationBand: 'muted',
      commemorationBand: 'private',
      veneratedLever: 'sector_rebalance',
      turnsToCanonized: 127,
      venerationScore: 0.001,
      venerationRank: 60,
      venerationSummary: 's',
    });
    return row.enshrinementBand === 'nominal';
  });

  check('a08_enshrinement_03', () => {
    const summary = summarizeRegionalTransitionEnshrinement('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        enshrinementBand: 'perpetual',
        venerationBand: 'canonized',
        enshrinedLever: 'capacity_buffer',
        turnsToPerpetual: 1,
        enshrinementScore: 0.998,
        enshrinementRank: 4400,
        enshrinementSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        enshrinementBand: 'nominal',
        venerationBand: 'muted',
        enshrinedLever: 'sector_rebalance',
        turnsToPerpetual: 132,
        enshrinementScore: 0.001,
        enshrinementRank: 65,
        enshrinementSummary: 's',
      },
    ]);
    return summary.perpetualCount === 1 && summary.dominantBand === 'perpetual';
  });

  check('a08_enshrinement_04', () => {
    const band = classifyNationalEnshrinementBand(0.997, 1, 'venerated');
    return band === 'enshrined';
  });

  check('a08_enshrinement_05', () => {
    const enshrinement = computeNationalProductionTransitionEnshrinement({
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
      enshrinement.schemaVersion === AGENT08_TRANSITION_ENSHRINEMENT_SCHEMA_VERSION &&
      enshrinement.firmEnshrinements.length >= 1 &&
      enshrinement.nationalEnshrinementPressure >= 0 &&
      enshrinement.nationalEnshrinementPressure <= 1
    );
  });

  return results;
}
