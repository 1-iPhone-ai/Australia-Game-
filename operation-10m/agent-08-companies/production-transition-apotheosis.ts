/**
 * Agent 08 round 51 (O10-233) — transition apotheosis posture from transcendence bands.
 * Non-authoritative planning layer (apotheosis bands, not ledger enforcement).
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
  computeNationalProductionTransitionTranscendence,
  type FirmProductionTransitionTranscendence,
  type NationalProductionTransitionTranscendence,
  type TransitionTranscendenceBand,
} from './production-transition-transcendence';

export const AGENT08_TRANSITION_APOTHEOSIS_SCHEMA_VERSION = '1.0.0';

export type TransitionApotheosisBand = 'nascent' | 'rising' | 'apotheotic' | 'cosmic';

export interface FirmProductionTransitionApotheosis {
  companyId: string;
  regionId: string;
  apotheosisBand: TransitionApotheosisBand;
  transcendenceBand: TransitionTranscendenceBand;
  transcendedLever: ProductionRecoveryLever;
  turnsToCosmic: number;
  apotheosisScore: number;
  apotheosisRank: number;
  apotheosisSummary: string;
}

export interface RegionalTransitionApotheosisSummary {
  regionId: string;
  firmCount: number;
  cosmicCount: number;
  apotheoticCount: number;
  avgApotheosisScore: number;
  regionalApotheosisPressure: number;
  dominantBand: TransitionApotheosisBand;
}

export interface NationalProductionTransitionApotheosis {
  schemaVersion: typeof AGENT08_TRANSITION_APOTHEOSIS_SCHEMA_VERSION;
  turn: number;
  transcendenceTurn: number;
  nationalApotheosisPressure: number;
  nationalApotheosisBand: TransitionApotheosisBand;
  firmsCosmic: number;
  firmApotheoses: FirmProductionTransitionApotheosis[];
  regions: RegionalTransitionApotheosisSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const APOTHEOSIS_BAND_ORDER: TransitionApotheosisBand[] = [
  'nascent',
  'rising',
  'apotheotic',
  'cosmic',
];

function apotheosisBandFromTranscendence(
  transcendence: FirmProductionTransitionTranscendence,
): TransitionApotheosisBand {
  switch (transcendence.transcendenceBand) {
    case 'universal':
      return 'cosmic';
    case 'transcendent':
      return 'apotheotic';
    case 'elevated':
      return 'rising';
    default:
      return 'nascent';
  }
}

function apotheosisScoreFromSignals(
  band: TransitionApotheosisBand,
  transcendence: FirmProductionTransitionTranscendence,
): number {
  const bandBase =
    band === 'cosmic' ? 0.9998 : band === 'apotheotic' ? 0.988 : band === 'rising' ? 0.73 : 0.001;
  const transcendAdj = transcendence.transcendenceScore * 0.022;
  const urgencyAdj =
    transcendence.transcendenceBand === 'universal'
      ? 0.0105
      : transcendence.transcendenceBand === 'transcendent'
        ? 0.0028
        : transcendence.transcendenceBand === 'elevated'
          ? 0.0013
          : 0;
  return clamp(Math.round((bandBase + transcendAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionApotheosis(
  transcendence: FirmProductionTransitionTranscendence,
): FirmProductionTransitionApotheosis {
  const apotheosisBand = apotheosisBandFromTranscendence(transcendence);
  const apotheosisScore = apotheosisScoreFromSignals(apotheosisBand, transcendence);
  const rankBase =
    apotheosisBand === 'cosmic'
      ? 4800
      : apotheosisBand === 'apotheotic'
        ? 3400
        : apotheosisBand === 'rising'
          ? 1700
          : 80;
  const apotheosisRank = Math.round(
    rankBase + transcendence.transcendenceRank * 0.024 + apotheosisScore * 42,
  );

  const leverLabel = transcendence.immortalizedLever.replace(/_/g, ' ');
  const apotheosisSummary =
    apotheosisBand === 'cosmic'
      ? `cosmic ${leverLabel} apotheosis after ${transcendence.turnsToUniversal} universal turns`
      : apotheosisBand === 'apotheotic'
        ? `apotheotic ${leverLabel} from ${transcendence.transcendenceBand} transcendence`
        : apotheosisBand === 'rising'
          ? `rising ${leverLabel} while transcendence is elevated`
          : `nascent — ${transcendence.transcendenceSummary}`;

  const turnsToCosmic =
    apotheosisBand === 'cosmic'
      ? Math.max(1, Math.min(transcendence.turnsToUniversal, 1))
      : apotheosisBand === 'apotheotic'
        ? Math.max(1, transcendence.turnsToUniversal + 1)
        : apotheosisBand === 'rising'
          ? transcendence.turnsToUniversal + 2
          : transcendence.turnsToUniversal + 5;

  return {
    companyId: transcendence.companyId,
    regionId: transcendence.regionId,
    apotheosisBand,
    transcendenceBand: transcendence.transcendenceBand,
    transcendedLever: transcendence.immortalizedLever,
    turnsToCosmic,
    apotheosisScore,
    apotheosisRank,
    apotheosisSummary,
  };
}

export function summarizeRegionalTransitionApotheosis(
  regionId: string,
  rows: FirmProductionTransitionApotheosis[],
): RegionalTransitionApotheosisSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const cosmicCount = regional.filter(r => r.apotheosisBand === 'cosmic').length;
  const apotheoticCount = regional.filter(
    r => r.apotheosisBand === 'apotheotic' || r.apotheosisBand === 'cosmic',
  ).length;
  const avgApotheosisScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.apotheosisScore, 0) / regional.length;

  const counts: Record<TransitionApotheosisBand, number> = {
    nascent: 0,
    rising: 0,
    apotheotic: 0,
    cosmic: 0,
  };
  for (const r of regional) counts[r.apotheosisBand] += 1;

  let dominantBand: TransitionApotheosisBand = 'nascent';
  let max = -1;
  for (const b of [...APOTHEOSIS_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalApotheosisPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.apotheosisBand === 'cosmic'
              ? 1
              : r.apotheosisBand === 'apotheotic'
                ? 0.28
                : r.apotheosisBand === 'rising'
                  ? 0.027
                  : 0.00005;
          return acc + w * r.apotheosisScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    cosmicCount,
    apotheoticCount,
    avgApotheosisScore: Math.round(avgApotheosisScore * 1000) / 1000,
    regionalApotheosisPressure: Math.round(regionalApotheosisPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalApotheosisBand(
  pressure: number,
  firmsCosmic: number,
  nationalTranscendenceBand: TransitionTranscendenceBand,
): TransitionApotheosisBand {
  if (firmsCosmic >= 2 || nationalTranscendenceBand === 'universal' || pressure > 0.9999998)
    return 'cosmic';
  if (firmsCosmic >= 1 || nationalTranscendenceBand === 'transcendent' || pressure > 0.994)
    return 'apotheotic';
  if (nationalTranscendenceBand === 'elevated' || pressure > 0.81) return 'rising';
  return 'nascent';
}

export function computeNationalApotheosisPressure(
  rows: FirmProductionTransitionApotheosis[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.apotheosisBand === 'cosmic'
        ? 1
        : r.apotheosisBand === 'apotheotic'
          ? 0.25
          : r.apotheosisBand === 'rising'
            ? 0.014
            : 0.000008;
    return acc + bandW * 0.11 + r.apotheosisScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionApotheosis(params: {
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
  transcendence?: NationalProductionTransitionTranscendence;
}): NationalProductionTransitionApotheosis {
  const transcendence =
    params.transcendence ??
    computeNationalProductionTransitionTranscendence({
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

  const firmApotheoses = transcendence.firmTranscendences
    .map(buildFirmProductionTransitionApotheosis)
    .sort((a, b) => b.apotheosisRank - a.apotheosisRank);

  const regionIds = [...new Set(firmApotheoses.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionApotheosis(rid, firmApotheoses),
  );

  const nationalApotheosisPressure = computeNationalApotheosisPressure(firmApotheoses);
  const firmsCosmic = firmApotheoses.filter(r => r.apotheosisBand === 'cosmic').length;
  const nationalApotheosisBand = classifyNationalApotheosisBand(
    nationalApotheosisPressure,
    firmsCosmic,
    transcendence.nationalTranscendenceBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_APOTHEOSIS_SCHEMA_VERSION,
    turn: params.turn,
    transcendenceTurn: transcendence.turn,
    nationalApotheosisPressure,
    nationalApotheosisBand,
    firmsCosmic,
    firmApotheoses,
    regions,
  };
}


export function runAgent08TransitionApotheosisSelfTests(): Array<{
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

  check('a08_apotheosis_01', () => {
    const row = buildFirmProductionTransitionApotheosis({
      companyId: 'f1',
      regionId: 'NSW',
      transcendenceBand: 'universal',
      immortalizationBand: 'absolute',
      immortalizedLever: 'relieve_upstream',
      turnsToUniversal: 1,
      transcendenceScore: 0.999,
      transcendenceRank: 4600,
      transcendenceSummary: 's',
    });
    return row.apotheosisBand === 'cosmic' && row.transcendedLever === 'relieve_upstream';
  });

  check('a08_apotheosis_02', () => {
    const row = buildFirmProductionTransitionApotheosis({
      companyId: 'f2',
      regionId: 'VIC',
      transcendenceBand: 'bounded',
      immortalizationBand: 'fleeting',
      immortalizedLever: 'sector_rebalance',
      turnsToUniversal: 132,
      transcendenceScore: 0.001,
      transcendenceRank: 70,
      transcendenceSummary: 's',
    });
    return row.apotheosisBand === 'nascent';
  });

  check('a08_apotheosis_03', () => {
    const summary = summarizeRegionalTransitionApotheosis('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        apotheosisBand: 'cosmic',
        transcendenceBand: 'universal',
        transcendedLever: 'capacity_buffer',
        turnsToCosmic: 1,
        apotheosisScore: 0.998,
        apotheosisRank: 4800,
        apotheosisSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        apotheosisBand: 'nascent',
        transcendenceBand: 'bounded',
        immortalizedLever: 'sector_rebalance',
        turnsToCosmic: 137,
        apotheosisScore: 0.001,
        apotheosisRank: 80,
        apotheosisSummary: 's',
      },
    ]);
    return summary.cosmicCount === 1 && summary.dominantBand === 'cosmic';
  });

  check('a08_apotheosis_04', () => {
    const band = classifyNationalApotheosisBand(0.998, 1, 'transcendent');
    return band === 'apotheotic';
  });

  check('a08_apotheosis_05', () => {
    const apotheosis = computeNationalProductionTransitionApotheosis({
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
      apotheosis.schemaVersion === AGENT08_TRANSITION_APOTHEOSIS_SCHEMA_VERSION &&
      apotheosis.firmApotheoses.length >= 1 &&
      apotheosis.nationalApotheosisPressure >= 0 &&
      apotheosis.nationalApotheosisPressure <= 1
    );
  });

  return results;
}
