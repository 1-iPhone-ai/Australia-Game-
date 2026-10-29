/**
 * Agent 08 round 53 (O10-237) — transition divinization posture from divinization bands.
 * Non-authoritative planning layer (divinization bands, not ledger enforcement).
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
  buildFirmProductionTransitionDeification,
  computeNationalProductionTransitionDeification,
  type FirmProductionTransitionDeification,
  type NationalProductionTransitionDeification,
  type TransitionDeificationBand,
} from './production-transition-deification';

export const AGENT08_TRANSITION_DIVINIZATION_SCHEMA_VERSION = '1.0.0';

export type TransitionDivinizationBand = 'nascent' | 'rising' | 'divinized' | 'transcendent';

export interface FirmProductionTransitionDivinization {
  companyId: string;
  regionId: string;
  divinizationBand: TransitionDivinizationBand;
  deificationBand: TransitionDeificationBand;
  apotheosizedLever: ProductionRecoveryLever;
  turnsToTranscendent: number;
  divinizationScore: number;
  divinizationRank: number;
  divinizationSummary: string;
}

export interface RegionalTransitionDivinizationSummary {
  regionId: string;
  firmCount: number;
  transcendentCount: number;
  divinizedCount: number;
  avgDivinizationScore: number;
  regionalDivinizationPressure: number;
  dominantBand: TransitionDivinizationBand;
}

export interface NationalProductionTransitionDivinization {
  schemaVersion: typeof AGENT08_TRANSITION_DIVINIZATION_SCHEMA_VERSION;
  turn: number;
  deificationTurn: number;
  nationalDivinizationPressure: number;
  nationalDivinizationBand: TransitionDivinizationBand;
  firmsTranscendent: number;
  firmDivinizations: FirmProductionTransitionDivinization[];
  regions: RegionalTransitionDivinizationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const DIVINIZATION_BAND_ORDER: TransitionDivinizationBand[] = [
  'nascent',
  'rising',
  'divinized',
  'transcendent',
];

function divinizationBandFromDeification(
  deification: FirmProductionTransitionDeification,
): TransitionDivinizationBand {
  switch (deification.deificationBand) {
    case 'omnipotent':
      return 'transcendent';
    case 'deified':
      return 'divinized';
    case 'rising':
      return 'rising';
    default:
      return 'nascent';
  }
}

function divinizationScoreFromSignals(
  band: TransitionDivinizationBand,
  deification: FirmProductionTransitionDeification,
): number {
  const bandBase =
    band === 'transcendent' ? 0.9998 : band === 'divinized' ? 0.988 : band === 'rising' ? 0.73 : 0.001;
  const transcendAdj = deification.deificationScore * 0.022;
  const urgencyAdj =
    deification.deificationBand === 'omnipotent'
      ? 0.0105
      : deification.deificationBand === 'deified'
        ? 0.0028
        : deification.deificationBand === 'rising'
          ? 0.0013
          : 0;
  return clamp(Math.round((bandBase + transcendAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionDivinization(
  deification: FirmProductionTransitionDeification,
): FirmProductionTransitionDivinization {
  const divinizationBand = divinizationBandFromDeification(deification);
  const divinizationScore = divinizationScoreFromSignals(divinizationBand, deification);
  const rankBase =
    divinizationBand === 'transcendent'
      ? 4800
      : divinizationBand === 'divinized'
        ? 3400
        : divinizationBand === 'rising'
          ? 1700
          : 80;
  const divinizationRank = Math.round(
    rankBase + deification.deificationRank * 0.024 + divinizationScore * 42,
  );

  const leverLabel = deification.apotheosizedLever.replace(/_/g, ' ');
  const divinizationSummary =
    divinizationBand === 'transcendent'
      ? `transcendent ${leverLabel} divinization after ${deification.turnsToOmnipotent} omnipotent turns`
      : divinizationBand === 'divinized'
        ? `divinized ${leverLabel} from ${deification.deificationBand} deification`
        : divinizationBand === 'rising'
          ? `rising ${leverLabel} while deification is rising`
          : `nascent — ${deification.deificationSummary}`;

  const turnsToTranscendent =
    divinizationBand === 'transcendent'
      ? Math.max(1, Math.min(deification.turnsToOmnipotent, 1))
      : divinizationBand === 'divinized'
        ? Math.max(1, deification.turnsToOmnipotent + 1)
        : divinizationBand === 'rising'
          ? deification.turnsToOmnipotent + 2
          : deification.turnsToOmnipotent + 5;

  return {
    companyId: deification.companyId,
    regionId: deification.regionId,
    divinizationBand,
    deificationBand: deification.deificationBand,
    apotheosizedLever: deification.apotheosizedLever,
    turnsToTranscendent,
    divinizationScore,
    divinizationRank,
    divinizationSummary,
  };
}

export function summarizeRegionalTransitionDivinization(
  regionId: string,
  rows: FirmProductionTransitionDivinization[],
): RegionalTransitionDivinizationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const transcendentCount = regional.filter(r => r.divinizationBand === 'transcendent').length;
  const divinizedCount = regional.filter(
    r => r.divinizationBand === 'divinized' || r.divinizationBand === 'transcendent',
  ).length;
  const avgDivinizationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.divinizationScore, 0) / regional.length;

  const counts: Record<TransitionDivinizationBand, number> = {
    nascent: 0,
    rising: 0,
    divinized: 0,
    transcendent: 0,
  };
  for (const r of regional) counts[r.divinizationBand] += 1;

  let dominantBand: TransitionDivinizationBand = 'nascent';
  let max = -1;
  for (const b of [...DIVINIZATION_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalDivinizationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.divinizationBand === 'transcendent'
              ? 1
              : r.divinizationBand === 'divinized'
                ? 0.28
                : r.divinizationBand === 'rising'
                  ? 0.027
                  : 0.00005;
          return acc + w * r.divinizationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    transcendentCount,
    divinizedCount,
    avgDivinizationScore: Math.round(avgDivinizationScore * 1000) / 1000,
    regionalDivinizationPressure: Math.round(regionalDivinizationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalDivinizationBand(
  pressure: number,
  firmsTranscendent: number,
  nationalDeificationBand: TransitionDeificationBand,
): TransitionDivinizationBand {
  if (firmsTranscendent >= 2 || nationalDeificationBand === 'omnipotent' || pressure > 0.9999998)
    return 'transcendent';
  if (firmsTranscendent >= 1 || nationalDeificationBand === 'deified' || pressure > 0.994)
    return 'divinized';
  if (nationalDeificationBand === 'rising' || pressure > 0.81) return 'rising';
  return 'nascent';
}

export function computeNationalDivinizationPressure(
  rows: FirmProductionTransitionDivinization[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.divinizationBand === 'transcendent'
        ? 1
        : r.divinizationBand === 'divinized'
          ? 0.25
          : r.divinizationBand === 'rising'
            ? 0.014
            : 0.000008;
    return acc + bandW * 0.11 + r.divinizationScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionDivinization(params: {
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
  deification?: NationalProductionTransitionDeification;
}): NationalProductionTransitionDivinization {
  const deificationLayer =
    params.deification ??
    computeNationalProductionTransitionDeification({
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

  const firmDivinizations = deificationLayer.firmDeifications
    .map(buildFirmProductionTransitionDivinization)
    .sort((a, b) => b.divinizationRank - a.divinizationRank);

  const regionIds = [...new Set(firmDivinizations.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionDivinization(rid, firmDivinizations),
  );

  const nationalDivinizationPressure = computeNationalDivinizationPressure(firmDivinizations);
  const firmsTranscendent = firmDivinizations.filter(r => r.divinizationBand === 'transcendent').length;
  const nationalDivinizationBand = classifyNationalDivinizationBand(
    nationalDivinizationPressure,
    firmsTranscendent,
    deificationLayer.nationalDeificationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_DIVINIZATION_SCHEMA_VERSION,
    turn: params.turn,
    deificationTurn: deificationLayer.turn,
    nationalDivinizationPressure,
    nationalDivinizationBand,
    firmsTranscendent,
    firmDivinizations,
    regions,
  };
}


export function runAgent08TransitionDivinizationSelfTests(): Array<{
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

  check('a08_divinization_01', () => {
    const deification = buildFirmProductionTransitionDeification({
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
    const row = buildFirmProductionTransitionDivinization(deification);
    return row.divinizationBand === 'transcendent' && row.apotheosizedLever === 'relieve_upstream';
  });

  check('a08_divinization_02', () => {
    const deification = buildFirmProductionTransitionDeification({
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
    const row = buildFirmProductionTransitionDivinization(deification);
    return row.divinizationBand === 'nascent';
  });

  check('a08_divinization_03', () => {
    const summary = summarizeRegionalTransitionDivinization('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        divinizationBand: 'transcendent',
        deificationBand: 'omnipotent',
        apotheosizedLever: 'capacity_buffer',
        turnsToTranscendent: 1,
        divinizationScore: 0.998,
        divinizationRank: 4800,
        divinizationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        divinizationBand: 'nascent',
        deificationBand: 'nascent',
        apotheosizedLever: 'sector_rebalance',
        turnsToTranscendent: 137,
        divinizationScore: 0.001,
        divinizationRank: 80,
        divinizationSummary: 's',
      },
    ]);
    return summary.transcendentCount === 1 && summary.dominantBand === 'transcendent';
  });

  check('a08_divinization_04', () => {
    const band = classifyNationalDivinizationBand(0.998, 1, 'omnipotent');
    return band === 'transcendent';
  });

  check('a08_divinization_05', () => {
    const divinization = computeNationalProductionTransitionDivinization({
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
      divinization.schemaVersion === AGENT08_TRANSITION_DIVINIZATION_SCHEMA_VERSION &&
      divinization.firmDivinizations.length >= 1 &&
      divinization.nationalDivinizationPressure >= 0 &&
      divinization.nationalDivinizationPressure <= 1
    );
  });

  return results;
}
