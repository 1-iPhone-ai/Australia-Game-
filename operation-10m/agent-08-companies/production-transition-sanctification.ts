/**
 * Agent 08 round 54 (O10-240) — transition sanctification posture from divinization bands.
 * Non-authoritative planning layer (sanctification bands, not ledger enforcement).
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
  buildFirmProductionTransitionDivinization,
  computeNationalProductionTransitionDivinization,
  type FirmProductionTransitionDivinization,
  type NationalProductionTransitionDivinization,
  type TransitionDivinizationBand,
} from './production-transition-divinization';
import { buildFirmProductionTransitionDeification } from './production-transition-deification';

export const AGENT08_TRANSITION_SANCTIFICATION_SCHEMA_VERSION = '1.0.0';

export type TransitionSanctificationBand = 'nascent' | 'rising' | 'sanctified' | 'canonized';

export interface FirmProductionTransitionSanctification {
  companyId: string;
  regionId: string;
  sanctificationBand: TransitionSanctificationBand;
  divinizationBand: TransitionDivinizationBand;
  apotheosizedLever: ProductionRecoveryLever;
  turnsToCanonized: number;
  sanctificationScore: number;
  sanctificationRank: number;
  sanctificationSummary: string;
}

export interface RegionalTransitionSanctificationSummary {
  regionId: string;
  firmCount: number;
  canonizedCount: number;
  sanctifiedCount: number;
  avgSanctificationScore: number;
  regionalSanctificationPressure: number;
  dominantBand: TransitionSanctificationBand;
}

export interface NationalProductionTransitionSanctification {
  schemaVersion: typeof AGENT08_TRANSITION_SANCTIFICATION_SCHEMA_VERSION;
  turn: number;
  divinizationTurn: number;
  nationalSanctificationPressure: number;
  nationalSanctificationBand: TransitionSanctificationBand;
  firmsCanonized: number;
  firmSanctifications: FirmProductionTransitionSanctification[];
  regions: RegionalTransitionSanctificationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const SANCTIFICATION_BAND_ORDER: TransitionSanctificationBand[] = [
  'nascent',
  'rising',
  'sanctified',
  'canonized',
];

function sanctificationBandFromDivinization(
  divinization: FirmProductionTransitionDivinization,
): TransitionSanctificationBand {
  switch (divinization.divinizationBand) {
    case 'transcendent':
      return 'canonized';
    case 'divinized':
      return 'sanctified';
    case 'rising':
      return 'rising';
    default:
      return 'nascent';
  }
}

function sanctificationScoreFromSignals(
  band: TransitionSanctificationBand,
  divinization: FirmProductionTransitionDivinization,
): number {
  const bandBase =
    band === 'canonized' ? 0.9998 : band === 'sanctified' ? 0.988 : band === 'rising' ? 0.73 : 0.001;
  const transcendAdj = divinization.divinizationScore * 0.022;
  const urgencyAdj =
    divinization.divinizationBand === 'transcendent'
      ? 0.0105
      : divinization.divinizationBand === 'divinized'
        ? 0.0028
        : divinization.divinizationBand === 'rising'
          ? 0.0013
          : 0;
  return clamp(Math.round((bandBase + transcendAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionSanctification(
  divinization: FirmProductionTransitionDivinization,
): FirmProductionTransitionSanctification {
  const sanctificationBand = sanctificationBandFromDivinization(divinization);
  const sanctificationScore = sanctificationScoreFromSignals(sanctificationBand, divinization);
  const rankBase =
    sanctificationBand === 'canonized'
      ? 4800
      : sanctificationBand === 'sanctified'
        ? 3400
        : sanctificationBand === 'rising'
          ? 1700
          : 80;
  const sanctificationRank = Math.round(
    rankBase + divinization.divinizationRank * 0.024 + sanctificationScore * 42,
  );

  const leverLabel = divinization.apotheosizedLever.replace(/_/g, ' ');
  const sanctificationSummary =
    sanctificationBand === 'canonized'
      ? `canonized ${leverLabel} sanctification after ${divinization.turnsToCanonized} transcendent turns`
      : sanctificationBand === 'sanctified'
        ? `sanctified ${leverLabel} from ${divinization.divinizationBand} divinization`
        : sanctificationBand === 'rising'
          ? `rising ${leverLabel} while divinization is rising`
          : `nascent — ${divinization.divinizationSummary}`;

  const turnsToCanonized =
    sanctificationBand === 'canonized'
      ? Math.max(1, Math.min(divinization.turnsToCanonized, 1))
      : sanctificationBand === 'sanctified'
        ? Math.max(1, divinization.turnsToCanonized + 1)
        : sanctificationBand === 'rising'
          ? divinization.turnsToCanonized + 2
          : divinization.turnsToCanonized + 5;

  return {
    companyId: divinization.companyId,
    regionId: divinization.regionId,
    sanctificationBand,
    divinizationBand: divinization.divinizationBand,
    apotheosizedLever: divinization.apotheosizedLever,
    turnsToCanonized,
    sanctificationScore,
    sanctificationRank,
    sanctificationSummary,
  };
}

export function summarizeRegionalTransitionSanctification(
  regionId: string,
  rows: FirmProductionTransitionSanctification[],
): RegionalTransitionSanctificationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const canonizedCount = regional.filter(r => r.sanctificationBand === 'canonized').length;
  const sanctifiedCount = regional.filter(
    r => r.sanctificationBand === 'sanctified' || r.sanctificationBand === 'canonized',
  ).length;
  const avgSanctificationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.sanctificationScore, 0) / regional.length;

  const counts: Record<TransitionSanctificationBand, number> = {
    nascent: 0,
    rising: 0,
    sanctified: 0,
    canonized: 0,
  };
  for (const r of regional) counts[r.sanctificationBand] += 1;

  let dominantBand: TransitionSanctificationBand = 'nascent';
  let max = -1;
  for (const b of [...SANCTIFICATION_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalSanctificationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.sanctificationBand === 'canonized'
              ? 1
              : r.sanctificationBand === 'sanctified'
                ? 0.28
                : r.sanctificationBand === 'rising'
                  ? 0.027
                  : 0.00005;
          return acc + w * r.sanctificationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    canonizedCount,
    sanctifiedCount,
    avgSanctificationScore: Math.round(avgSanctificationScore * 1000) / 1000,
    regionalSanctificationPressure: Math.round(regionalSanctificationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalSanctificationBand(
  pressure: number,
  firmsCanonized: number,
  nationalDivinizationBand: TransitionDivinizationBand,
): TransitionSanctificationBand {
  if (firmsCanonized >= 2 || nationalDivinizationBand === 'transcendent' || pressure > 0.9999998)
    return 'canonized';
  if (firmsCanonized >= 1 || nationalDivinizationBand === 'divinized' || pressure > 0.994)
    return 'sanctified';
  if (nationalDivinizationBand === 'rising' || pressure > 0.81) return 'rising';
  return 'nascent';
}

export function computeNationalSanctificationPressure(
  rows: FirmProductionTransitionSanctification[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.sanctificationBand === 'canonized'
        ? 1
        : r.sanctificationBand === 'sanctified'
          ? 0.25
          : r.sanctificationBand === 'rising'
            ? 0.014
            : 0.000008;
    return acc + bandW * 0.11 + r.sanctificationScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionSanctification(params: {
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
  divinization?: NationalProductionTransitionDivinization;
}): NationalProductionTransitionSanctification {
  const divinizationLayer =
    params.divinization ??
    computeNationalProductionTransitionDivinization({
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

  const firmSanctifications = divinizationLayer.firmDivinizations
    .map(buildFirmProductionTransitionSanctification)
    .sort((a, b) => b.sanctificationRank - a.sanctificationRank);

  const regionIds = [...new Set(firmSanctifications.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionSanctification(rid, firmSanctifications),
  );

  const nationalSanctificationPressure = computeNationalSanctificationPressure(firmSanctifications);
  const firmsCanonized = firmSanctifications.filter(r => r.sanctificationBand === 'canonized').length;
  const nationalSanctificationBand = classifyNationalSanctificationBand(
    nationalSanctificationPressure,
    firmsCanonized,
    divinizationLayer.nationalDivinizationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_SANCTIFICATION_SCHEMA_VERSION,
    turn: params.turn,
    divinizationTurn: divinizationLayer.turn,
    nationalSanctificationPressure,
    nationalSanctificationBand,
    firmsCanonized,
    firmSanctifications,
    regions,
  };
}


export function runAgent08TransitionSanctificationSelfTests(): Array<{
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

  check('a08_sanctification_01', () => {
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
    const row = buildFirmProductionTransitionSanctification(divinization);
    return row.sanctificationBand === 'canonized' && row.apotheosizedLever === 'relieve_upstream';
  });

  check('a08_sanctification_02', () => {
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
    const row = buildFirmProductionTransitionSanctification(divinization);
    return row.sanctificationBand === 'nascent';
  });

  check('a08_sanctification_03', () => {
    const summary = summarizeRegionalTransitionSanctification('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        sanctificationBand: 'canonized',
        divinizationBand: 'transcendent',
        apotheosizedLever: 'capacity_buffer',
        turnsToCanonized: 1,
        sanctificationScore: 0.998,
        sanctificationRank: 4800,
        sanctificationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        sanctificationBand: 'nascent',
        divinizationBand: 'nascent',
        apotheosizedLever: 'sector_rebalance',
        turnsToCanonized: 137,
        sanctificationScore: 0.001,
        sanctificationRank: 80,
        sanctificationSummary: 's',
      },
    ]);
    return summary.canonizedCount === 1 && summary.dominantBand === 'canonized';
  });

  check('a08_sanctification_04', () => {
    const band = classifyNationalSanctificationBand(0.998, 1, 'transcendent');
    return band === 'canonized';
  });

  check('a08_sanctification_05', () => {
    const sanctification = computeNationalProductionTransitionSanctification({
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
      sanctification.schemaVersion === AGENT08_TRANSITION_SANCTIFICATION_SCHEMA_VERSION &&
      sanctification.firmSanctifications.length >= 1 &&
      sanctification.nationalSanctificationPressure >= 0 &&
      sanctification.nationalSanctificationPressure <= 1
    );
  });

  return results;
}
