/**
 * Agent 08 round 55 (O10-247) — transition beatification posture from sanctification bands.
 * Non-authoritative planning layer (beatification bands, not ledger enforcement).
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
  buildFirmProductionTransitionSanctification,
  computeNationalProductionTransitionSanctification,
  type FirmProductionTransitionSanctification,
  type NationalProductionTransitionSanctification,
  type TransitionSanctificationBand,
} from './production-transition-sanctification';
import {
  buildFirmProductionTransitionDivinization,
  type FirmProductionTransitionDivinization,
  type TransitionDivinizationBand,
} from './production-transition-divinization';
import { buildFirmProductionTransitionDeification } from './production-transition-deification';

export const AGENT08_TRANSITION_BEATIFICATION_SCHEMA_VERSION = '1.0.0';

export type TransitionBeatificationBand = 'nascent' | 'rising' | 'beatified' | 'glorified';

export interface FirmProductionTransitionBeatification {
  companyId: string;
  regionId: string;
  beatificationBand: TransitionBeatificationBand;
  sanctificationBand: TransitionSanctificationBand;
  apotheosizedLever: ProductionRecoveryLever;
  turnsToGlorified: number;
  beatificationScore: number;
  beatificationRank: number;
  beatificationSummary: string;
}

export interface RegionalTransitionBeatificationSummary {
  regionId: string;
  firmCount: number;
  glorifiedCount: number;
  beatifiedCount: number;
  avgBeatificationScore: number;
  regionalBeatificationPressure: number;
  dominantBand: TransitionBeatificationBand;
}

export interface NationalProductionTransitionBeatification {
  schemaVersion: typeof AGENT08_TRANSITION_BEATIFICATION_SCHEMA_VERSION;
  turn: number;
  sanctificationTurn: number;
  nationalBeatificationPressure: number;
  nationalBeatificationBand: TransitionBeatificationBand;
  firmsGlorified: number;
  firmBeatifications: FirmProductionTransitionBeatification[];
  regions: RegionalTransitionBeatificationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const BEATIFICATION_BAND_ORDER: TransitionBeatificationBand[] = [
  'nascent',
  'rising',
  'beatified',
  'glorified',
];

function beatificationBandFromSanctification(
  sanctification: FirmProductionTransitionSanctification,
): TransitionBeatificationBand {
  switch (sanctification.sanctificationBand) {
    case 'canonized':
      return 'glorified';
    case 'sanctified':
      return 'beatified';
    case 'rising':
      return 'rising';
    default:
      return 'nascent';
  }
}

function beatificationScoreFromSignals(
  band: TransitionBeatificationBand,
  sanctification: FirmProductionTransitionSanctification,
): number {
  const bandBase =
    band === 'glorified' ? 0.9998 : band === 'beatified' ? 0.988 : band === 'rising' ? 0.73 : 0.001;
  const transcendAdj = sanctification.sanctificationScore * 0.022;
  const urgencyAdj =
    sanctification.sanctificationBand === 'canonized'
      ? 0.0105
      : sanctification.sanctificationBand === 'sanctified'
        ? 0.0028
        : sanctification.sanctificationBand === 'rising'
          ? 0.0013
          : 0;
  return clamp(Math.round((bandBase + transcendAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionBeatification(
  sanctification: FirmProductionTransitionSanctification,
): FirmProductionTransitionBeatification {
  const beatificationBand = beatificationBandFromSanctification(sanctification);
  const beatificationScore = beatificationScoreFromSignals(beatificationBand, sanctification);
  const rankBase =
    beatificationBand === 'glorified'
      ? 4800
      : beatificationBand === 'beatified'
        ? 3400
        : beatificationBand === 'rising'
          ? 1700
          : 80;
  const beatificationRank = Math.round(
    rankBase + sanctification.sanctificationRank * 0.024 + beatificationScore * 42,
  );

  const leverLabel = sanctification.apotheosizedLever.replace(/_/g, ' ');
  const beatificationSummary =
    beatificationBand === 'glorified'
      ? `glorified ${leverLabel} beatification after ${sanctification.turnsToCanonized} canonized turns`
      : beatificationBand === 'beatified'
        ? `beatified ${leverLabel} from ${sanctification.sanctificationBand} sanctification`
        : beatificationBand === 'rising'
          ? `rising ${leverLabel} while sanctification is rising`
          : `nascent — ${sanctification.sanctificationSummary}`;

  const turnsToGlorified =
    beatificationBand === 'glorified'
      ? Math.max(1, Math.min(sanctification.turnsToCanonized, 1))
      : beatificationBand === 'beatified'
        ? Math.max(1, sanctification.turnsToCanonized + 1)
        : beatificationBand === 'rising'
          ? sanctification.turnsToCanonized + 2
          : sanctification.turnsToCanonized + 5;

  return {
    companyId: sanctification.companyId,
    regionId: sanctification.regionId,
    beatificationBand,
    sanctificationBand: sanctification.sanctificationBand,
    apotheosizedLever: sanctification.apotheosizedLever,
    turnsToGlorified,
    beatificationScore,
    beatificationRank,
    beatificationSummary,
  };
}

export function summarizeRegionalTransitionBeatification(
  regionId: string,
  rows: FirmProductionTransitionBeatification[],
): RegionalTransitionBeatificationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const glorifiedCount = regional.filter(r => r.beatificationBand === 'glorified').length;
  const beatifiedCount = regional.filter(
    r => r.beatificationBand === 'beatified' || r.beatificationBand === 'glorified',
  ).length;
  const avgBeatificationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.beatificationScore, 0) / regional.length;

  const counts: Record<TransitionBeatificationBand, number> = {
    nascent: 0,
    rising: 0,
    beatified: 0,
    glorified: 0,
  };
  for (const r of regional) counts[r.beatificationBand] += 1;

  let dominantBand: TransitionBeatificationBand = 'nascent';
  let max = -1;
  for (const b of [...BEATIFICATION_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalBeatificationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.beatificationBand === 'glorified'
              ? 1
              : r.beatificationBand === 'beatified'
                ? 0.28
                : r.beatificationBand === 'rising'
                  ? 0.027
                  : 0.00005;
          return acc + w * r.beatificationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    glorifiedCount,
    beatifiedCount,
    avgBeatificationScore: Math.round(avgBeatificationScore * 1000) / 1000,
    regionalBeatificationPressure: Math.round(regionalBeatificationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalBeatificationBand(
  pressure: number,
  firmsGlorified: number,
  nationalSanctificationBand: TransitionSanctificationBand,
): TransitionBeatificationBand {
  if (firmsGlorified >= 2 || nationalSanctificationBand === 'canonized' || pressure > 0.9999998)
    return 'glorified';
  if (firmsGlorified >= 1 || nationalSanctificationBand === 'sanctified' || pressure > 0.994)
    return 'beatified';
  if (nationalSanctificationBand === 'rising' || pressure > 0.81) return 'rising';
  return 'nascent';
}

export function computeNationalBeatificationPressure(
  rows: FirmProductionTransitionBeatification[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.beatificationBand === 'glorified'
        ? 1
        : r.beatificationBand === 'beatified'
          ? 0.25
          : r.beatificationBand === 'rising'
            ? 0.014
            : 0.000008;
    return acc + bandW * 0.11 + r.beatificationScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionBeatification(params: {
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
  sanctification?: NationalProductionTransitionSanctification;
}): NationalProductionTransitionBeatification {
  const sanctificationLayer =
    params.sanctification ??
    computeNationalProductionTransitionSanctification({
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

  const firmBeatifications = sanctificationLayer.firmSanctifications
    .map(buildFirmProductionTransitionBeatification)
    .sort((a, b) => b.beatificationRank - a.beatificationRank);

  const regionIds = [...new Set(firmBeatifications.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionBeatification(rid, firmBeatifications),
  );

  const nationalBeatificationPressure = computeNationalBeatificationPressure(firmBeatifications);
  const firmsGlorified = firmBeatifications.filter(r => r.beatificationBand === 'glorified').length;
  const nationalBeatificationBand = classifyNationalBeatificationBand(
    nationalBeatificationPressure,
    firmsGlorified,
    sanctificationLayer.nationalSanctificationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_BEATIFICATION_SCHEMA_VERSION,
    turn: params.turn,
    sanctificationTurn: sanctificationLayer.turn,
    nationalBeatificationPressure,
    nationalBeatificationBand,
    firmsGlorified,
    firmBeatifications,
    regions,
  };
}


export function runAgent08TransitionBeatificationSelfTests(): Array<{
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

  check('a08_beatification_01', () => {
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
    const divinization = buildFirmProductionTransitionDivinization(deification);
    const sanctification = buildFirmProductionTransitionSanctification(divinization);
    const row = buildFirmProductionTransitionBeatification(sanctification);
    return row.beatificationBand === 'glorified' && row.apotheosizedLever === 'relieve_upstream';
  });

  check('a08_beatification_02', () => {
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
    const divinization = buildFirmProductionTransitionDivinization(deification);
    const sanctification = buildFirmProductionTransitionSanctification(divinization);
    const row = buildFirmProductionTransitionBeatification(sanctification);
    return row.beatificationBand === 'nascent';
  });

  check('a08_beatification_03', () => {
    const summary = summarizeRegionalTransitionBeatification('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        beatificationBand: 'glorified',
        sanctificationBand: 'canonized',
        apotheosizedLever: 'capacity_buffer',
        turnsToGlorified: 1,
        beatificationScore: 0.998,
        beatificationRank: 4800,
        beatificationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        beatificationBand: 'nascent',
        sanctificationBand: 'nascent',
        apotheosizedLever: 'sector_rebalance',
        turnsToGlorified: 137,
        beatificationScore: 0.001,
        beatificationRank: 80,
        beatificationSummary: 's',
      },
    ]);
    return summary.glorifiedCount === 1 && summary.dominantBand === 'glorified';
  });

  check('a08_beatification_04', () => {
    const band = classifyNationalBeatificationBand(0.998, 1, 'canonized');
    return band === 'glorified';
  });

  check('a08_beatification_05', () => {
    const beatification = computeNationalProductionTransitionBeatification({
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
      beatification.schemaVersion === AGENT08_TRANSITION_BEATIFICATION_SCHEMA_VERSION &&
      beatification.firmBeatifications.length >= 1 &&
      beatification.nationalBeatificationPressure >= 0 &&
      beatification.nationalBeatificationPressure <= 1
    );
  });

  return results;
}
