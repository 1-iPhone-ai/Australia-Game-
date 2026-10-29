/**
 * Agent 08 round 49 (O10-229) — transition immortalization posture from enshrinement bands.
 * Non-authoritative planning layer (immortalization bands, not ledger enforcement).
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
  computeNationalProductionTransitionEnshrinement,
  type FirmProductionTransitionEnshrinement,
  type NationalProductionTransitionEnshrinement,
  type TransitionEnshrinementBand,
} from './production-transition-enshrinement';

export const AGENT08_TRANSITION_IMMORTALIZATION_SCHEMA_VERSION = '1.0.0';

export type TransitionImmortalizationBand = 'fleeting' | 'enduring' | 'immortalized' | 'absolute';

export interface FirmProductionTransitionImmortalization {
  companyId: string;
  regionId: string;
  immortalizationBand: TransitionImmortalizationBand;
  enshrinementBand: TransitionEnshrinementBand;
  immortalizedLever: ProductionRecoveryLever;
  turnsToAbsolute: number;
  immortalizationScore: number;
  immortalizationRank: number;
  immortalizationSummary: string;
}

export interface RegionalTransitionImmortalizationSummary {
  regionId: string;
  firmCount: number;
  absoluteCount: number;
  immortalizedCount: number;
  avgImmortalizationScore: number;
  regionalImmortalizationPressure: number;
  dominantBand: TransitionImmortalizationBand;
}

export interface NationalProductionTransitionImmortalization {
  schemaVersion: typeof AGENT08_TRANSITION_IMMORTALIZATION_SCHEMA_VERSION;
  turn: number;
  enshrinementTurn: number;
  nationalImmortalizationPressure: number;
  nationalImmortalizationBand: TransitionImmortalizationBand;
  firmsAbsolute: number;
  firmImmortalizations: FirmProductionTransitionImmortalization[];
  regions: RegionalTransitionImmortalizationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const IMMORTAL_BAND_ORDER: TransitionImmortalizationBand[] = [
  'fleeting',
  'enduring',
  'immortalized',
  'absolute',
];

function immortalizationBandFromEnshrinement(
  enshrinement: FirmProductionTransitionEnshrinement,
): TransitionImmortalizationBand {
  switch (enshrinement.enshrinementBand) {
    case 'perpetual':
      return 'absolute';
    case 'enshrined':
      return 'immortalized';
    case 'registered':
      return 'enduring';
    default:
      return 'fleeting';
  }
}

function immortalizationScoreFromSignals(
  band: TransitionImmortalizationBand,
  enshrinement: FirmProductionTransitionEnshrinement,
): number {
  const bandBase =
    band === 'absolute' ? 0.9998 : band === 'immortalized' ? 0.988 : band === 'enduring' ? 0.73 : 0.001;
  const enshrineAdj = enshrinement.enshrinementScore * 0.022;
  const urgencyAdj =
    enshrinement.enshrinementBand === 'perpetual'
      ? 0.0105
      : enshrinement.enshrinementBand === 'enshrined'
        ? 0.0028
        : enshrinement.enshrinementBand === 'registered'
          ? 0.0013
          : 0;
  return clamp(Math.round((bandBase + enshrineAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionImmortalization(
  enshrinement: FirmProductionTransitionEnshrinement,
): FirmProductionTransitionImmortalization {
  const immortalizationBand = immortalizationBandFromEnshrinement(enshrinement);
  const immortalizationScore = immortalizationScoreFromSignals(immortalizationBand, enshrinement);
  const rankBase =
    immortalizationBand === 'absolute'
      ? 4500
      : immortalizationBand === 'immortalized'
        ? 3200
        : immortalizationBand === 'enduring'
          ? 1600
          : 70;
  const immortalizationRank = Math.round(
    rankBase + enshrinement.enshrinementRank * 0.026 + immortalizationScore * 40,
  );

  const leverLabel = enshrinement.enshrinedLever.replace(/_/g, ' ');
  const immortalizationSummary =
    immortalizationBand === 'absolute'
      ? `absolute ${leverLabel} immortalization after ${enshrinement.turnsToPerpetual} perpetual turns`
      : immortalizationBand === 'immortalized'
        ? `immortalized ${leverLabel} from ${enshrinement.enshrinementBand} enshrinement`
        : immortalizationBand === 'enduring'
          ? `enduring ${leverLabel} while enshrinement is registered`
          : `fleeting — ${enshrinement.enshrinementSummary}`;

  const turnsToAbsolute =
    immortalizationBand === 'absolute'
      ? Math.max(1, Math.min(enshrinement.turnsToPerpetual, 1))
      : immortalizationBand === 'immortalized'
        ? Math.max(1, enshrinement.turnsToPerpetual + 1)
        : immortalizationBand === 'enduring'
          ? enshrinement.turnsToPerpetual + 2
          : enshrinement.turnsToPerpetual + 5;

  return {
    companyId: enshrinement.companyId,
    regionId: enshrinement.regionId,
    immortalizationBand,
    enshrinementBand: enshrinement.enshrinementBand,
    immortalizedLever: enshrinement.enshrinedLever,
    turnsToAbsolute,
    immortalizationScore,
    immortalizationRank,
    immortalizationSummary,
  };
}

export function summarizeRegionalTransitionImmortalization(
  regionId: string,
  rows: FirmProductionTransitionImmortalization[],
): RegionalTransitionImmortalizationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const absoluteCount = regional.filter(r => r.immortalizationBand === 'absolute').length;
  const immortalizedCount = regional.filter(
    r => r.immortalizationBand === 'immortalized' || r.immortalizationBand === 'absolute',
  ).length;
  const avgImmortalizationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.immortalizationScore, 0) / regional.length;

  const counts: Record<TransitionImmortalizationBand, number> = {
    fleeting: 0,
    enduring: 0,
    immortalized: 0,
    absolute: 0,
  };
  for (const r of regional) counts[r.immortalizationBand] += 1;

  let dominantBand: TransitionImmortalizationBand = 'fleeting';
  let max = -1;
  for (const b of [...IMMORTAL_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalImmortalizationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.immortalizationBand === 'absolute'
              ? 1
              : r.immortalizationBand === 'immortalized'
                ? 0.27
                : r.immortalizationBand === 'enduring'
                  ? 0.026
                  : 0.00004;
          return acc + w * r.immortalizationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    absoluteCount,
    immortalizedCount,
    avgImmortalizationScore: Math.round(avgImmortalizationScore * 1000) / 1000,
    regionalImmortalizationPressure: Math.round(regionalImmortalizationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalImmortalizationBand(
  pressure: number,
  firmsAbsolute: number,
  nationalEnshrinementBand: TransitionEnshrinementBand,
): TransitionImmortalizationBand {
  if (firmsAbsolute >= 2 || nationalEnshrinementBand === 'perpetual' || pressure > 0.9999998)
    return 'absolute';
  if (firmsAbsolute >= 1 || nationalEnshrinementBand === 'enshrined' || pressure > 0.994)
    return 'immortalized';
  if (nationalEnshrinementBand === 'registered' || pressure > 0.81) return 'enduring';
  return 'fleeting';
}

export function computeNationalImmortalizationPressure(
  rows: FirmProductionTransitionImmortalization[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.immortalizationBand === 'absolute'
        ? 1
        : r.immortalizationBand === 'immortalized'
          ? 0.24
          : r.immortalizationBand === 'enduring'
            ? 0.013
            : 0.000007;
    return acc + bandW * 0.11 + r.immortalizationScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionImmortalization(params: {
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
  enshrinement?: NationalProductionTransitionEnshrinement;
}): NationalProductionTransitionImmortalization {
  const enshrinement =
    params.enshrinement ??
    computeNationalProductionTransitionEnshrinement({
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

  const firmImmortalizations = enshrinement.firmEnshrinements
    .map(buildFirmProductionTransitionImmortalization)
    .sort((a, b) => b.immortalizationRank - a.immortalizationRank);

  const regionIds = [...new Set(firmImmortalizations.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionImmortalization(rid, firmImmortalizations),
  );

  const nationalImmortalizationPressure = computeNationalImmortalizationPressure(firmImmortalizations);
  const firmsAbsolute = firmImmortalizations.filter(r => r.immortalizationBand === 'absolute').length;
  const nationalImmortalizationBand = classifyNationalImmortalizationBand(
    nationalImmortalizationPressure,
    firmsAbsolute,
    enshrinement.nationalEnshrinementBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_IMMORTALIZATION_SCHEMA_VERSION,
    turn: params.turn,
    enshrinementTurn: enshrinement.turn,
    nationalImmortalizationPressure,
    nationalImmortalizationBand,
    firmsAbsolute,
    firmImmortalizations,
    regions,
  };
}

export function runAgent08TransitionImmortalizationSelfTests(): Array<{
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

  check('a08_immortalization_01', () => {
    const row = buildFirmProductionTransitionImmortalization({
      companyId: 'f1',
      regionId: 'NSW',
      enshrinementBand: 'perpetual',
      venerationBand: 'canonized',
      enshrinedLever: 'relieve_upstream',
      turnsToPerpetual: 1,
      enshrinementScore: 0.999,
      enshrinementRank: 4400,
      enshrinementSummary: 's',
    });
    return row.immortalizationBand === 'absolute' && row.immortalizedLever === 'relieve_upstream';
  });

  check('a08_immortalization_02', () => {
    const row = buildFirmProductionTransitionImmortalization({
      companyId: 'f2',
      regionId: 'VIC',
      enshrinementBand: 'nominal',
      venerationBand: 'muted',
      enshrinedLever: 'sector_rebalance',
      turnsToPerpetual: 132,
      enshrinementScore: 0.001,
      enshrinementRank: 65,
      enshrinementSummary: 's',
    });
    return row.immortalizationBand === 'fleeting';
  });

  check('a08_immortalization_03', () => {
    const summary = summarizeRegionalTransitionImmortalization('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        immortalizationBand: 'absolute',
        enshrinementBand: 'perpetual',
        immortalizedLever: 'capacity_buffer',
        turnsToAbsolute: 1,
        immortalizationScore: 0.998,
        immortalizationRank: 4500,
        immortalizationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        immortalizationBand: 'fleeting',
        enshrinementBand: 'nominal',
        immortalizedLever: 'sector_rebalance',
        turnsToAbsolute: 137,
        immortalizationScore: 0.001,
        immortalizationRank: 70,
        immortalizationSummary: 's',
      },
    ]);
    return summary.absoluteCount === 1 && summary.dominantBand === 'absolute';
  });

  check('a08_immortalization_04', () => {
    const band = classifyNationalImmortalizationBand(0.998, 1, 'enshrined');
    return band === 'immortalized';
  });

  check('a08_immortalization_05', () => {
    const immortalization = computeNationalProductionTransitionImmortalization({
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
      immortalization.schemaVersion === AGENT08_TRANSITION_IMMORTALIZATION_SCHEMA_VERSION &&
      immortalization.firmImmortalizations.length >= 1 &&
      immortalization.nationalImmortalizationPressure >= 0 &&
      immortalization.nationalImmortalizationPressure <= 1
    );
  });

  return results;
}
