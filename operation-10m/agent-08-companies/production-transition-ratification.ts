/**
 * Agent 08 round 36 (O10-203) — transition ratification posture from precedence bands.
 * Non-authoritative planning layer (ratification bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionPrecedence,
  type FirmProductionTransitionPrecedence,
  type NationalProductionTransitionPrecedence,
  type TransitionPrecedenceBand,
} from './production-transition-precedence';

export const AGENT08_TRANSITION_RATIFICATION_SCHEMA_VERSION = '1.0.0';

export type TransitionRatificationBand = 'unratified' | 'provisional' | 'ratified' | 'entrenched';

export interface FirmProductionTransitionRatification {
  companyId: string;
  regionId: string;
  ratificationBand: TransitionRatificationBand;
  precedenceBand: TransitionPrecedenceBand;
  ratifiedLever: ProductionRecoveryLever;
  turnsToEntrench: number;
  ratificationScore: number;
  ratificationRank: number;
  ratificationSummary: string;
}

export interface RegionalTransitionRatificationSummary {
  regionId: string;
  firmCount: number;
  entrenchedCount: number;
  ratifiedCount: number;
  avgRatificationScore: number;
  regionalRatificationPressure: number;
  dominantBand: TransitionRatificationBand;
}

export interface NationalProductionTransitionRatification {
  schemaVersion: typeof AGENT08_TRANSITION_RATIFICATION_SCHEMA_VERSION;
  turn: number;
  precedenceTurn: number;
  nationalRatificationPressure: number;
  nationalRatificationBand: TransitionRatificationBand;
  firmsEntrenched: number;
  firmRatifications: FirmProductionTransitionRatification[];
  regions: RegionalTransitionRatificationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RAT_BAND_ORDER: TransitionRatificationBand[] = ['unratified', 'provisional', 'ratified', 'entrenched'];

function ratificationBandFromPrecedence(
  precedence: FirmProductionTransitionPrecedence,
): TransitionRatificationBand {
  switch (precedence.precedenceBand) {
    case 'definitive':
      return 'entrenched';
    case 'precedented':
      return 'ratified';
    case 'advancing':
      return 'provisional';
    default:
      return 'unratified';
  }
}

function ratificationScoreFromSignals(
  band: TransitionRatificationBand,
  precedence: FirmProductionTransitionPrecedence,
): number {
  const bandBase =
    band === 'entrenched'
      ? 0.999
      : band === 'ratified'
        ? 0.9
        : band === 'provisional'
          ? 0.62
          : 0.008;
  const precedenceAdj = precedence.precedenceScore * 0.042;
  const urgencyAdj =
    precedence.precedenceBand === 'definitive'
      ? 0.018
      : precedence.precedenceBand === 'precedented'
        ? 0.004
        : precedence.precedenceBand === 'advancing'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + precedenceAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionRatification(
  precedence: FirmProductionTransitionPrecedence,
): FirmProductionTransitionRatification {
  const ratificationBand = ratificationBandFromPrecedence(precedence);
  const ratificationScore = ratificationScoreFromSignals(ratificationBand, precedence);
  const rankBase =
    ratificationBand === 'entrenched'
      ? 3200
      : ratificationBand === 'ratified'
        ? 2120
        : ratificationBand === 'provisional'
          ? 1120
          : 180;
  const ratificationRank = Math.round(
    rankBase + precedence.precedenceRank * 0.048 + ratificationScore * 52,
  );

  const leverLabel = precedence.precedentedLever.replace(/_/g, ' ');
  const ratificationSummary =
    ratificationBand === 'entrenched'
      ? `entrenched ${leverLabel} ratification after ${precedence.turnsToDefinitive} definitive turns`
      : ratificationBand === 'ratified'
        ? `ratified ${leverLabel} from ${precedence.precedenceBand} precedence`
        : ratificationBand === 'provisional'
          ? `provisional ${leverLabel} while precedence advances`
          : `unratified — ${precedence.precedenceSummary}`;

  const turnsToEntrench =
    ratificationBand === 'entrenched'
      ? Math.max(1, Math.min(precedence.turnsToDefinitive, 1))
      : ratificationBand === 'ratified'
        ? Math.max(1, precedence.turnsToDefinitive + 1)
        : ratificationBand === 'provisional'
          ? precedence.turnsToDefinitive + 3
          : precedence.turnsToDefinitive + 14;

  return {
    companyId: precedence.companyId,
    regionId: precedence.regionId,
    ratificationBand,
    precedenceBand: precedence.precedenceBand,
    ratifiedLever: precedence.precedentedLever,
    turnsToEntrench,
    ratificationScore,
    ratificationRank,
    ratificationSummary,
  };
}

export function summarizeRegionalTransitionRatification(
  regionId: string,
  rows: FirmProductionTransitionRatification[],
): RegionalTransitionRatificationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const entrenchedCount = regional.filter(r => r.ratificationBand === 'entrenched').length;
  const ratifiedCount = regional.filter(
    r => r.ratificationBand === 'ratified' || r.ratificationBand === 'entrenched',
  ).length;
  const avgRatificationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.ratificationScore, 0) / regional.length;

  const counts: Record<TransitionRatificationBand, number> = {
    unratified: 0,
    provisional: 0,
    ratified: 0,
    entrenched: 0,
  };
  for (const r of regional) counts[r.ratificationBand] += 1;

  let dominantBand: TransitionRatificationBand = 'unratified';
  let max = -1;
  for (const b of [...RAT_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalRatificationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.ratificationBand === 'entrenched'
              ? 1
              : r.ratificationBand === 'ratified'
                ? 0.34
                : r.ratificationBand === 'provisional'
                  ? 0.055
                  : 0.001;
          return acc + w * r.ratificationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    entrenchedCount,
    ratifiedCount,
    avgRatificationScore: Math.round(avgRatificationScore * 1000) / 1000,
    regionalRatificationPressure: Math.round(regionalRatificationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalRatificationBand(
  pressure: number,
  firmsEntrenched: number,
  nationalPrecedenceBand: TransitionPrecedenceBand,
): TransitionRatificationBand {
  if (firmsEntrenched >= 2 || nationalPrecedenceBand === 'definitive' || pressure > 0.999)
    return 'entrenched';
  if (firmsEntrenched >= 1 || nationalPrecedenceBand === 'precedented' || pressure > 0.92)
    return 'ratified';
  if (nationalPrecedenceBand === 'advancing' || pressure > 0.7) return 'provisional';
  return 'unratified';
}

export function computeNationalRatificationPressure(
  rows: FirmProductionTransitionRatification[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.ratificationBand === 'entrenched'
        ? 1
        : r.ratificationBand === 'ratified'
          ? 0.3
          : r.ratificationBand === 'provisional'
            ? 0.028
            : 0.0004;
    return acc + bandW * 0.2 + r.ratificationScore * 0.8;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionRatification(params: {
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
}): NationalProductionTransitionRatification {
  const precedence =
    params.precedence ??
    computeNationalProductionTransitionPrecedence({
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
    });

  const firmRatifications = precedence.firmPrecedences
    .map(buildFirmProductionTransitionRatification)
    .sort((a, b) => b.ratificationRank - a.ratificationRank);

  const regionIds = [...new Set(firmRatifications.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionRatification(rid, firmRatifications));

  const nationalRatificationPressure = computeNationalRatificationPressure(firmRatifications);
  const firmsEntrenched = firmRatifications.filter(r => r.ratificationBand === 'entrenched').length;
  const nationalRatificationBand = classifyNationalRatificationBand(
    nationalRatificationPressure,
    firmsEntrenched,
    precedence.nationalPrecedenceBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_RATIFICATION_SCHEMA_VERSION,
    turn: params.turn,
    precedenceTurn: precedence.turn,
    nationalRatificationPressure,
    nationalRatificationBand,
    firmsEntrenched,
    firmRatifications,
    regions,
  };
}

export function runAgent08TransitionRatificationSelfTests(): Array<{
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

  check('a08_ratification_01', () => {
    const row = buildFirmProductionTransitionRatification({
      companyId: 'f1',
      regionId: 'NSW',
      precedenceBand: 'definitive',
      recognitionBand: 'canonical',
      precedentedLever: 'relieve_upstream',
      turnsToDefinitive: 1,
      precedenceScore: 0.999,
      precedenceRank: 3050,
      precedenceSummary: 's',
    });
    return row.ratificationBand === 'entrenched' && row.ratifiedLever === 'relieve_upstream';
  });

  check('a08_ratification_02', () => {
    const row = buildFirmProductionTransitionRatification({
      companyId: 'f2',
      regionId: 'VIC',
      precedenceBand: 'latent',
      recognitionBand: 'marginal',
      precedentedLever: 'sector_rebalance',
      turnsToDefinitive: 100,
      precedenceScore: 0.002,
      precedenceRank: 170,
      precedenceSummary: 's',
    });
    return row.ratificationBand === 'unratified';
  });

  check('a08_ratification_03', () => {
    const summary = summarizeRegionalTransitionRatification('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        ratificationBand: 'entrenched',
        precedenceBand: 'definitive',
        ratifiedLever: 'capacity_buffer',
        turnsToEntrench: 1,
        ratificationScore: 0.998,
        ratificationRank: 3100,
        ratificationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        ratificationBand: 'unratified',
        precedenceBand: 'latent',
        ratifiedLever: 'sector_rebalance',
        turnsToEntrench: 104,
        ratificationScore: 0.002,
        ratificationRank: 170,
        ratificationSummary: 's',
      },
    ]);
    return summary.entrenchedCount === 1 && summary.dominantBand === 'entrenched';
  });

  check('a08_ratification_04', () => {
    const band = classifyNationalRatificationBand(0.96, 1, 'precedented');
    return band === 'ratified';
  });

  check('a08_ratification_05', () => {
    const ratification = computeNationalProductionTransitionRatification({
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
      ratification.schemaVersion === AGENT08_TRANSITION_RATIFICATION_SCHEMA_VERSION &&
      ratification.firmRatifications.length >= 1 &&
      ratification.nationalRatificationPressure >= 0 &&
      ratification.nationalRatificationPressure <= 1
    );
  });

  return results;
}
