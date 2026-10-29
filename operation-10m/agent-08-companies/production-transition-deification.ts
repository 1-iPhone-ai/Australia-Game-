/**
 * Agent 08 round 52 (O10-235) — transition deification posture from apotheosis bands.
 * Non-authoritative planning layer (deification bands, not ledger enforcement).
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
  computeNationalProductionTransitionApotheosis,
  type FirmProductionTransitionApotheosis,
  type NationalProductionTransitionApotheosis,
  type TransitionApotheosisBand,
} from './production-transition-apotheosis';

export const AGENT08_TRANSITION_DEIFICATION_SCHEMA_VERSION = '1.0.0';

export type TransitionDeificationBand = 'nascent' | 'rising' | 'deified' | 'omnipotent';

export interface FirmProductionTransitionDeification {
  companyId: string;
  regionId: string;
  deificationBand: TransitionDeificationBand;
  apotheosisBand: TransitionApotheosisBand;
  apotheosizedLever: ProductionRecoveryLever;
  turnsToOmnipotent: number;
  deificationScore: number;
  deificationRank: number;
  deificationSummary: string;
}

export interface RegionalTransitionDeificationSummary {
  regionId: string;
  firmCount: number;
  omnipotentCount: number;
  deifiedCount: number;
  avgDeificationScore: number;
  regionalDeificationPressure: number;
  dominantBand: TransitionDeificationBand;
}

export interface NationalProductionTransitionDeification {
  schemaVersion: typeof AGENT08_TRANSITION_DEIFICATION_SCHEMA_VERSION;
  turn: number;
  apotheosisTurn: number;
  nationalDeificationPressure: number;
  nationalDeificationBand: TransitionDeificationBand;
  firmsOmnipotent: number;
  firmDeifications: FirmProductionTransitionDeification[];
  regions: RegionalTransitionDeificationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const DEIFICATION_BAND_ORDER: TransitionDeificationBand[] = [
  'nascent',
  'rising',
  'deified',
  'omnipotent',
];

function deificationBandFromApotheosis(
  apotheosis: FirmProductionTransitionApotheosis,
): TransitionDeificationBand {
  switch (apotheosis.apotheosisBand) {
    case 'cosmic':
      return 'omnipotent';
    case 'apotheotic':
      return 'deified';
    case 'rising':
      return 'rising';
    default:
      return 'nascent';
  }
}

function deificationScoreFromSignals(
  band: TransitionDeificationBand,
  apotheosis: FirmProductionTransitionApotheosis,
): number {
  const bandBase =
    band === 'omnipotent' ? 0.9998 : band === 'deified' ? 0.988 : band === 'rising' ? 0.73 : 0.001;
  const transcendAdj = apotheosis.apotheosisScore * 0.022;
  const urgencyAdj =
    apotheosis.apotheosisBand === 'cosmic'
      ? 0.0105
      : apotheosis.apotheosisBand === 'apotheotic'
        ? 0.0028
        : apotheosis.apotheosisBand === 'rising'
          ? 0.0013
          : 0;
  return clamp(Math.round((bandBase + transcendAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionDeification(
  apotheosis: FirmProductionTransitionApotheosis,
): FirmProductionTransitionDeification {
  const deificationBand = deificationBandFromApotheosis(apotheosis);
  const deificationScore = deificationScoreFromSignals(deificationBand, apotheosis);
  const rankBase =
    deificationBand === 'omnipotent'
      ? 4800
      : deificationBand === 'deified'
        ? 3400
        : deificationBand === 'rising'
          ? 1700
          : 80;
  const deificationRank = Math.round(
    rankBase + apotheosis.apotheosisRank * 0.024 + deificationScore * 42,
  );

  const leverLabel = apotheosis.transcendedLever.replace(/_/g, ' ');
  const deificationSummary =
    deificationBand === 'omnipotent'
      ? `omnipotent ${leverLabel} deification after ${apotheosis.turnsToCosmic} cosmic turns`
      : deificationBand === 'deified'
        ? `deified ${leverLabel} from ${apotheosis.apotheosisBand} apotheosis`
        : deificationBand === 'rising'
          ? `rising ${leverLabel} while apotheosis is rising`
          : `nascent — ${apotheosis.apotheosisSummary}`;

  const turnsToOmnipotent =
    deificationBand === 'omnipotent'
      ? Math.max(1, Math.min(apotheosis.turnsToCosmic, 1))
      : deificationBand === 'deified'
        ? Math.max(1, apotheosis.turnsToCosmic + 1)
        : deificationBand === 'rising'
          ? apotheosis.turnsToCosmic + 2
          : apotheosis.turnsToCosmic + 5;

  return {
    companyId: apotheosis.companyId,
    regionId: apotheosis.regionId,
    deificationBand,
    apotheosisBand: apotheosis.apotheosisBand,
    apotheosizedLever: apotheosis.transcendedLever,
    turnsToOmnipotent,
    deificationScore,
    deificationRank,
    deificationSummary,
  };
}

export function summarizeRegionalTransitionDeification(
  regionId: string,
  rows: FirmProductionTransitionDeification[],
): RegionalTransitionDeificationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const omnipotentCount = regional.filter(r => r.deificationBand === 'omnipotent').length;
  const deifiedCount = regional.filter(
    r => r.deificationBand === 'deified' || r.deificationBand === 'omnipotent',
  ).length;
  const avgDeificationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.deificationScore, 0) / regional.length;

  const counts: Record<TransitionDeificationBand, number> = {
    nascent: 0,
    rising: 0,
    deified: 0,
    omnipotent: 0,
  };
  for (const r of regional) counts[r.deificationBand] += 1;

  let dominantBand: TransitionDeificationBand = 'nascent';
  let max = -1;
  for (const b of [...DEIFICATION_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalDeificationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.deificationBand === 'omnipotent'
              ? 1
              : r.deificationBand === 'deified'
                ? 0.28
                : r.deificationBand === 'rising'
                  ? 0.027
                  : 0.00005;
          return acc + w * r.deificationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    omnipotentCount,
    deifiedCount,
    avgDeificationScore: Math.round(avgDeificationScore * 1000) / 1000,
    regionalDeificationPressure: Math.round(regionalDeificationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalDeificationBand(
  pressure: number,
  firmsOmnipotent: number,
  nationalApotheosisBand: TransitionApotheosisBand,
): TransitionDeificationBand {
  if (firmsOmnipotent >= 2 || nationalApotheosisBand === 'cosmic' || pressure > 0.9999998)
    return 'omnipotent';
  if (firmsOmnipotent >= 1 || nationalApotheosisBand === 'apotheotic' || pressure > 0.994)
    return 'deified';
  if (nationalApotheosisBand === 'rising' || pressure > 0.81) return 'rising';
  return 'nascent';
}

export function computeNationalDeificationPressure(
  rows: FirmProductionTransitionDeification[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.deificationBand === 'omnipotent'
        ? 1
        : r.deificationBand === 'deified'
          ? 0.25
          : r.deificationBand === 'rising'
            ? 0.014
            : 0.000008;
    return acc + bandW * 0.11 + r.deificationScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionDeification(params: {
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
  apotheosis?: NationalProductionTransitionApotheosis;
}): NationalProductionTransitionDeification {
  const apotheosisLayer =
    params.apotheosis ??
    computeNationalProductionTransitionApotheosis({
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
      veneration: params.veneration,
    });

  const firmDeifications = apotheosisLayer.firmApotheoses
    .map(buildFirmProductionTransitionDeification)
    .sort((a, b) => b.deificationRank - a.deificationRank);

  const regionIds = [...new Set(firmDeifications.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionDeification(rid, firmDeifications),
  );

  const nationalDeificationPressure = computeNationalDeificationPressure(firmDeifications);
  const firmsOmnipotent = firmDeifications.filter(r => r.deificationBand === 'omnipotent').length;
  const nationalDeificationBand = classifyNationalDeificationBand(
    nationalDeificationPressure,
    firmsOmnipotent,
    apotheosisLayer.nationalApotheosisBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_DEIFICATION_SCHEMA_VERSION,
    turn: params.turn,
    apotheosisTurn: apotheosisLayer.turn,
    nationalDeificationPressure,
    nationalDeificationBand,
    firmsOmnipotent,
    firmDeifications,
    regions,
  };
}


export function runAgent08TransitionDeificationSelfTests(): Array<{
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

  check('a08_deification_01', () => {
    const row = buildFirmProductionTransitionDeification({
      companyId: 'f1',
      regionId: 'NSW',
      apotheosisBand: 'cosmic',
      transcendenceBand: 'universal',
      transcendedLever: 'relieve_upstream',
      turnsToCosmic: 1,
      apotheosisScore: 0.999,
      apotheosisRank: 4600,
      apotheosisSummary: 's',
    });
    return row.deificationBand === 'omnipotent' && row.apotheosizedLever === 'relieve_upstream';
  });

  check('a08_deification_02', () => {
    const row = buildFirmProductionTransitionDeification({
      companyId: 'f2',
      regionId: 'VIC',
      apotheosisBand: 'nascent',
      transcendenceBand: 'bounded',
      transcendedLever: 'sector_rebalance',
      turnsToCosmic: 132,
      apotheosisScore: 0.001,
      apotheosisRank: 70,
      apotheosisSummary: 's',
    });
    return row.deificationBand === 'nascent';
  });

  check('a08_deification_03', () => {
    const summary = summarizeRegionalTransitionDeification('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        deificationBand: 'omnipotent',
        apotheosisBand: 'cosmic',
        apotheosizedLever: 'capacity_buffer',
        turnsToOmnipotent: 1,
        deificationScore: 0.998,
        deificationRank: 4800,
        deificationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        deificationBand: 'nascent',
        apotheosisBand: 'nascent',
        apotheosizedLever: 'sector_rebalance',
        turnsToOmnipotent: 137,
        deificationScore: 0.001,
        deificationRank: 80,
        deificationSummary: 's',
      },
    ]);
    return summary.omnipotentCount === 1 && summary.dominantBand === 'omnipotent';
  });

  check('a08_deification_04', () => {
    const band = classifyNationalDeificationBand(0.998, 1, 'apotheotic');
    return band === 'deified';
  });

  check('a08_deification_05', () => {
    const deification = computeNationalProductionTransitionDeification({
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
      deification.schemaVersion === AGENT08_TRANSITION_DEIFICATION_SCHEMA_VERSION &&
      deification.firmDeifications.length >= 1 &&
      deification.nationalDeificationPressure >= 0 &&
      deification.nationalDeificationPressure <= 1
    );
  });

  return results;
}
