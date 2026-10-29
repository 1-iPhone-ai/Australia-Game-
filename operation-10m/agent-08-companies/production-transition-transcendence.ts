/**
 * Agent 08 round 50 (O10-231) — transition transcendence posture from immortalization bands.
 * Non-authoritative planning layer (transcendence bands, not ledger enforcement).
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
import type { NationalProductionTransitionVeneration } from './production-transition-veneration';
import {
  computeNationalProductionTransitionImmortalization,
  type FirmProductionTransitionImmortalization,
  type NationalProductionTransitionImmortalization,
  type TransitionImmortalizationBand,
} from './production-transition-immortalization';

export const AGENT08_TRANSITION_TRANSCENDENCE_SCHEMA_VERSION = '1.0.0';

export type TransitionTranscendenceBand = 'bounded' | 'elevated' | 'transcendent' | 'universal';

export interface FirmProductionTransitionTranscendence {
  companyId: string;
  regionId: string;
  transcendenceBand: TransitionTranscendenceBand;
  immortalizationBand: TransitionImmortalizationBand;
  immortalizedLever: ProductionRecoveryLever;
  turnsToUniversal: number;
  transcendenceScore: number;
  transcendenceRank: number;
  transcendenceSummary: string;
}

export interface RegionalTransitionTranscendenceSummary {
  regionId: string;
  firmCount: number;
  universalCount: number;
  transcendentCount: number;
  avgTranscendenceScore: number;
  regionalTranscendencePressure: number;
  dominantBand: TransitionTranscendenceBand;
}

export interface NationalProductionTransitionTranscendence {
  schemaVersion: typeof AGENT08_TRANSITION_TRANSCENDENCE_SCHEMA_VERSION;
  turn: number;
  immortalizationTurn: number;
  nationalTranscendencePressure: number;
  nationalTranscendenceBand: TransitionTranscendenceBand;
  firmsUniversal: number;
  firmTranscendences: FirmProductionTransitionTranscendence[];
  regions: RegionalTransitionTranscendenceSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const TRANSCEND_BAND_ORDER: TransitionTranscendenceBand[] = [
  'bounded',
  'elevated',
  'transcendent',
  'universal',
];

function transcendenceBandFromImmortalization(
  immortalization: FirmProductionTransitionImmortalization,
): TransitionTranscendenceBand {
  switch (immortalization.immortalizationBand) {
    case 'absolute':
      return 'universal';
    case 'immortalized':
      return 'transcendent';
    case 'enduring':
      return 'elevated';
    default:
      return 'bounded';
  }
}

function transcendenceScoreFromSignals(
  band: TransitionTranscendenceBand,
  immortalization: FirmProductionTransitionImmortalization,
): number {
  const bandBase =
    band === 'universal' ? 0.9998 : band === 'transcendent' ? 0.988 : band === 'elevated' ? 0.73 : 0.001;
  const immortalAdj = immortalization.immortalizationScore * 0.022;
  const urgencyAdj =
    immortalization.immortalizationBand === 'absolute'
      ? 0.0105
      : immortalization.immortalizationBand === 'immortalized'
        ? 0.0028
        : immortalization.immortalizationBand === 'enduring'
          ? 0.0013
          : 0;
  return clamp(Math.round((bandBase + immortalAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionTranscendence(
  immortalization: FirmProductionTransitionImmortalization,
): FirmProductionTransitionTranscendence {
  const transcendenceBand = transcendenceBandFromImmortalization(immortalization);
  const transcendenceScore = transcendenceScoreFromSignals(transcendenceBand, immortalization);
  const rankBase =
    transcendenceBand === 'universal'
      ? 4600
      : transcendenceBand === 'transcendent'
        ? 3200
        : transcendenceBand === 'elevated'
          ? 1600
          : 70;
  const transcendenceRank = Math.round(
    rankBase + immortalization.immortalizationRank * 0.026 + transcendenceScore * 40,
  );

  const leverLabel = immortalization.immortalizedLever.replace(/_/g, ' ');
  const transcendenceSummary =
    transcendenceBand === 'universal'
      ? `universal ${leverLabel} transcendence after ${immortalization.turnsToAbsolute} absolute turns`
      : transcendenceBand === 'transcendent'
        ? `transcendent ${leverLabel} from ${immortalization.immortalizationBand} immortalization`
        : transcendenceBand === 'elevated'
          ? `elevated ${leverLabel} while immortalization is enduring`
          : `bounded — ${immortalization.immortalizationSummary}`;

  const turnsToUniversal =
    transcendenceBand === 'universal'
      ? Math.max(1, Math.min(immortalization.turnsToAbsolute, 1))
      : transcendenceBand === 'transcendent'
        ? Math.max(1, immortalization.turnsToAbsolute + 1)
        : transcendenceBand === 'elevated'
          ? immortalization.turnsToAbsolute + 2
          : immortalization.turnsToAbsolute + 5;

  return {
    companyId: immortalization.companyId,
    regionId: immortalization.regionId,
    transcendenceBand,
    immortalizationBand: immortalization.immortalizationBand,
    immortalizedLever: immortalization.immortalizedLever,
    turnsToUniversal,
    transcendenceScore,
    transcendenceRank,
    transcendenceSummary,
  };
}

export function summarizeRegionalTransitionTranscendence(
  regionId: string,
  rows: FirmProductionTransitionTranscendence[],
): RegionalTransitionTranscendenceSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const universalCount = regional.filter(r => r.transcendenceBand === 'universal').length;
  const transcendentCount = regional.filter(
    r => r.transcendenceBand === 'transcendent' || r.transcendenceBand === 'universal',
  ).length;
  const avgTranscendenceScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.transcendenceScore, 0) / regional.length;

  const counts: Record<TransitionTranscendenceBand, number> = {
    bounded: 0,
    elevated: 0,
    transcendent: 0,
    universal: 0,
  };
  for (const r of regional) counts[r.transcendenceBand] += 1;

  let dominantBand: TransitionTranscendenceBand = 'bounded';
  let max = -1;
  for (const b of [...TRANSCEND_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalTranscendencePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.transcendenceBand === 'universal'
              ? 1
              : r.transcendenceBand === 'transcendent'
                ? 0.27
                : r.transcendenceBand === 'elevated'
                  ? 0.026
                  : 0.00004;
          return acc + w * r.transcendenceScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    universalCount,
    transcendentCount,
    avgTranscendenceScore: Math.round(avgTranscendenceScore * 1000) / 1000,
    regionalTranscendencePressure: Math.round(regionalTranscendencePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalTranscendenceBand(
  pressure: number,
  firmsUniversal: number,
  nationalImmortalizationBand: TransitionImmortalizationBand,
): TransitionTranscendenceBand {
  if (firmsUniversal >= 2 || nationalImmortalizationBand === 'absolute' || pressure > 0.9999998)
    return 'universal';
  if (firmsUniversal >= 1 || nationalImmortalizationBand === 'immortalized' || pressure > 0.994)
    return 'transcendent';
  if (nationalImmortalizationBand === 'enduring' || pressure > 0.81) return 'elevated';
  return 'bounded';
}

export function computeNationalTranscendencePressure(
  rows: FirmProductionTransitionTranscendence[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.transcendenceBand === 'universal'
        ? 1
        : r.transcendenceBand === 'transcendent'
          ? 0.24
          : r.transcendenceBand === 'elevated'
            ? 0.013
            : 0.000007;
    return acc + bandW * 0.11 + r.transcendenceScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionTranscendence(params: {
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
  immortalization?: NationalProductionTransitionImmortalization;
}): NationalProductionTransitionTranscendence {
  const immortalization =
    params.immortalization ??
    computeNationalProductionTransitionImmortalization({
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

  const firmTranscendences = immortalization.firmImmortalizations
    .map(buildFirmProductionTransitionTranscendence)
    .sort((a, b) => b.transcendenceRank - a.transcendenceRank);

  const regionIds = [...new Set(firmTranscendences.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionTranscendence(rid, firmTranscendences),
  );

  const nationalTranscendencePressure = computeNationalTranscendencePressure(firmTranscendences);
  const firmsUniversal = firmTranscendences.filter(r => r.transcendenceBand === 'universal').length;
  const nationalTranscendenceBand = classifyNationalTranscendenceBand(
    nationalTranscendencePressure,
    firmsUniversal,
    immortalization.nationalImmortalizationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_TRANSCENDENCE_SCHEMA_VERSION,
    turn: params.turn,
    immortalizationTurn: immortalization.turn,
    nationalTranscendencePressure,
    nationalTranscendenceBand,
    firmsUniversal,
    firmTranscendences,
    regions,
  };
}

export function runAgent08TransitionTranscendenceSelfTests(): Array<{
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

  check('a08_transcendence_01', () => {
    const row = buildFirmProductionTransitionTranscendence({
      companyId: 'f1',
      regionId: 'NSW',
      immortalizationBand: 'absolute',
      enshrinementBand: 'perpetual',
      immortalizedLever: 'relieve_upstream',
      turnsToAbsolute: 1,
      immortalizationScore: 0.999,
      immortalizationRank: 4500,
      immortalizationSummary: 's',
    });
    return row.transcendenceBand === 'universal' && row.immortalizedLever === 'relieve_upstream';
  });

  check('a08_transcendence_02', () => {
    const row = buildFirmProductionTransitionTranscendence({
      companyId: 'f2',
      regionId: 'VIC',
      immortalizationBand: 'fleeting',
      enshrinementBand: 'nominal',
      immortalizedLever: 'sector_rebalance',
      turnsToAbsolute: 132,
      immortalizationScore: 0.001,
      immortalizationRank: 70,
      immortalizationSummary: 's',
    });
    return row.transcendenceBand === 'bounded';
  });

  check('a08_transcendence_03', () => {
    const summary = summarizeRegionalTransitionTranscendence('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        transcendenceBand: 'universal',
        immortalizationBand: 'absolute',
        immortalizedLever: 'capacity_buffer',
        turnsToUniversal: 1,
        transcendenceScore: 0.998,
        transcendenceRank: 4600,
        transcendenceSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        transcendenceBand: 'bounded',
        immortalizationBand: 'fleeting',
        immortalizedLever: 'sector_rebalance',
        turnsToUniversal: 137,
        transcendenceScore: 0.001,
        transcendenceRank: 70,
        transcendenceSummary: 's',
      },
    ]);
    return summary.universalCount === 1 && summary.dominantBand === 'universal';
  });

  check('a08_transcendence_04', () => {
    const band = classifyNationalTranscendenceBand(0.998, 1, 'immortalized');
    return band === 'transcendent';
  });

  check('a08_transcendence_05', () => {
    const transcendence = computeNationalProductionTransitionTranscendence({
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
      transcendence.schemaVersion === AGENT08_TRANSITION_TRANSCENDENCE_SCHEMA_VERSION &&
      transcendence.firmTranscendences.length >= 1 &&
      transcendence.nationalTranscendencePressure >= 0 &&
      transcendence.nationalTranscendencePressure <= 1
    );
  });

  return results;
}
