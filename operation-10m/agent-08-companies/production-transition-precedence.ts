/**
 * Agent 08 round 35 (O10-201) — transition precedence posture from recognition bands.
 * Non-authoritative planning layer (precedence bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionRecognition,
  type FirmProductionTransitionRecognition,
  type NationalProductionTransitionRecognition,
  type TransitionRecognitionBand,
} from './production-transition-recognition';

export const AGENT08_TRANSITION_PRECEDENCE_SCHEMA_VERSION = '1.0.0';

export type TransitionPrecedenceBand = 'latent' | 'advancing' | 'precedented' | 'definitive';

export interface FirmProductionTransitionPrecedence {
  companyId: string;
  regionId: string;
  precedenceBand: TransitionPrecedenceBand;
  recognitionBand: TransitionRecognitionBand;
  precedentedLever: ProductionRecoveryLever;
  turnsToDefinitive: number;
  precedenceScore: number;
  precedenceRank: number;
  precedenceSummary: string;
}

export interface RegionalTransitionPrecedenceSummary {
  regionId: string;
  firmCount: number;
  definitiveCount: number;
  precedentedCount: number;
  avgPrecedenceScore: number;
  regionalPrecedencePressure: number;
  dominantBand: TransitionPrecedenceBand;
}

export interface NationalProductionTransitionPrecedence {
  schemaVersion: typeof AGENT08_TRANSITION_PRECEDENCE_SCHEMA_VERSION;
  turn: number;
  recognitionTurn: number;
  nationalPrecedencePressure: number;
  nationalPrecedenceBand: TransitionPrecedenceBand;
  firmsDefinitive: number;
  firmPrecedences: FirmProductionTransitionPrecedence[];
  regions: RegionalTransitionPrecedenceSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const PRE_BAND_ORDER: TransitionPrecedenceBand[] = ['latent', 'advancing', 'precedented', 'definitive'];

function precedenceBandFromRecognition(
  recognition: FirmProductionTransitionRecognition,
): TransitionPrecedenceBand {
  switch (recognition.recognitionBand) {
    case 'canonical':
      return 'definitive';
    case 'recognized':
      return 'precedented';
    case 'acknowledged':
      return 'advancing';
    default:
      return 'latent';
  }
}

function precedenceScoreFromSignals(
  band: TransitionPrecedenceBand,
  recognition: FirmProductionTransitionRecognition,
): number {
  const bandBase =
    band === 'definitive'
      ? 0.999
      : band === 'precedented'
        ? 0.89
        : band === 'advancing'
          ? 0.61
          : 0.009;
  const recognitionAdj = recognition.recognitionScore * 0.044;
  const urgencyAdj =
    recognition.recognitionBand === 'canonical'
      ? 0.019
      : recognition.recognitionBand === 'recognized'
        ? 0.005
        : recognition.recognitionBand === 'acknowledged'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + recognitionAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionPrecedence(
  recognition: FirmProductionTransitionRecognition,
): FirmProductionTransitionPrecedence {
  const precedenceBand = precedenceBandFromRecognition(recognition);
  const precedenceScore = precedenceScoreFromSignals(precedenceBand, recognition);
  const rankBase =
    precedenceBand === 'definitive'
      ? 3100
      : precedenceBand === 'precedented'
        ? 2040
        : precedenceBand === 'advancing'
          ? 1100
          : 200;
  const precedenceRank = Math.round(
    rankBase + recognition.recognitionRank * 0.05 + precedenceScore * 54,
  );

  const leverLabel = recognition.recognizedLever.replace(/_/g, ' ');
  const precedenceSummary =
    precedenceBand === 'definitive'
      ? `definitive ${leverLabel} precedence after ${recognition.turnsToCanonical} canonical turns`
      : precedenceBand === 'precedented'
        ? `precedented ${leverLabel} from ${recognition.recognitionBand} recognition`
        : precedenceBand === 'advancing'
          ? `advancing ${leverLabel} while recognition builds`
          : `latent — ${recognition.recognitionSummary}`;

  const turnsToDefinitive =
    precedenceBand === 'definitive'
      ? Math.max(1, Math.min(recognition.turnsToCanonical, 1))
      : precedenceBand === 'precedented'
        ? Math.max(1, recognition.turnsToCanonical + 1)
        : precedenceBand === 'advancing'
          ? recognition.turnsToCanonical + 3
          : recognition.turnsToCanonical + 15;

  return {
    companyId: recognition.companyId,
    regionId: recognition.regionId,
    precedenceBand,
    recognitionBand: recognition.recognitionBand,
    precedentedLever: recognition.recognizedLever,
    turnsToDefinitive,
    precedenceScore,
    precedenceRank,
    precedenceSummary,
  };
}

export function summarizeRegionalTransitionPrecedence(
  regionId: string,
  rows: FirmProductionTransitionPrecedence[],
): RegionalTransitionPrecedenceSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const definitiveCount = regional.filter(r => r.precedenceBand === 'definitive').length;
  const precedentedCount = regional.filter(
    r => r.precedenceBand === 'precedented' || r.precedenceBand === 'definitive',
  ).length;
  const avgPrecedenceScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.precedenceScore, 0) / regional.length;

  const counts: Record<TransitionPrecedenceBand, number> = {
    latent: 0,
    advancing: 0,
    precedented: 0,
    definitive: 0,
  };
  for (const r of regional) counts[r.precedenceBand] += 1;

  let dominantBand: TransitionPrecedenceBand = 'latent';
  let max = -1;
  for (const b of [...PRE_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalPrecedencePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.precedenceBand === 'definitive'
              ? 1
              : r.precedenceBand === 'precedented'
                ? 0.35
                : r.precedenceBand === 'advancing'
                  ? 0.06
                  : 0.0012;
          return acc + w * r.precedenceScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    definitiveCount,
    precedentedCount,
    avgPrecedenceScore: Math.round(avgPrecedenceScore * 1000) / 1000,
    regionalPrecedencePressure: Math.round(regionalPrecedencePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalPrecedenceBand(
  pressure: number,
  firmsDefinitive: number,
  nationalRecognitionBand: TransitionRecognitionBand,
): TransitionPrecedenceBand {
  if (firmsDefinitive >= 2 || nationalRecognitionBand === 'canonical' || pressure > 0.998)
    return 'definitive';
  if (firmsDefinitive >= 1 || nationalRecognitionBand === 'recognized' || pressure > 0.91)
    return 'precedented';
  if (nationalRecognitionBand === 'acknowledged' || pressure > 0.69) return 'advancing';
  return 'latent';
}

export function computeNationalPrecedencePressure(
  rows: FirmProductionTransitionPrecedence[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.precedenceBand === 'definitive'
        ? 1
        : r.precedenceBand === 'precedented'
          ? 0.31
          : r.precedenceBand === 'advancing'
            ? 0.03
            : 0.0005;
    return acc + bandW * 0.21 + r.precedenceScore * 0.79;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionPrecedence(params: {
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
}): NationalProductionTransitionPrecedence {
  const recognition =
    params.recognition ??
    computeNationalProductionTransitionRecognition({
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
    });

  const firmPrecedences = recognition.firmRecognitions
    .map(buildFirmProductionTransitionPrecedence)
    .sort((a, b) => b.precedenceRank - a.precedenceRank);

  const regionIds = [...new Set(firmPrecedences.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionPrecedence(rid, firmPrecedences));

  const nationalPrecedencePressure = computeNationalPrecedencePressure(firmPrecedences);
  const firmsDefinitive = firmPrecedences.filter(r => r.precedenceBand === 'definitive').length;
  const nationalPrecedenceBand = classifyNationalPrecedenceBand(
    nationalPrecedencePressure,
    firmsDefinitive,
    recognition.nationalRecognitionBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_PRECEDENCE_SCHEMA_VERSION,
    turn: params.turn,
    recognitionTurn: recognition.turn,
    nationalPrecedencePressure,
    nationalPrecedenceBand,
    firmsDefinitive,
    firmPrecedences,
    regions,
  };
}

export function runAgent08TransitionPrecedenceSelfTests(): Array<{
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

  check('a08_precedence_01', () => {
    const row = buildFirmProductionTransitionPrecedence({
      companyId: 'f1',
      regionId: 'NSW',
      recognitionBand: 'canonical',
      legitimacyBand: 'institutional',
      recognizedLever: 'relieve_upstream',
      turnsToCanonical: 1,
      recognitionScore: 0.999,
      recognitionRank: 2950,
      recognitionSummary: 's',
    });
    return row.precedenceBand === 'definitive' && row.precedentedLever === 'relieve_upstream';
  });

  check('a08_precedence_02', () => {
    const row = buildFirmProductionTransitionPrecedence({
      companyId: 'f2',
      regionId: 'VIC',
      recognitionBand: 'marginal',
      legitimacyBand: 'contested',
      recognizedLever: 'sector_rebalance',
      turnsToCanonical: 98,
      recognitionScore: 0.003,
      recognitionRank: 190,
      recognitionSummary: 's',
    });
    return row.precedenceBand === 'latent';
  });

  check('a08_precedence_03', () => {
    const summary = summarizeRegionalTransitionPrecedence('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        precedenceBand: 'definitive',
        recognitionBand: 'canonical',
        precedentedLever: 'capacity_buffer',
        turnsToDefinitive: 1,
        precedenceScore: 0.998,
        precedenceRank: 3000,
        precedenceSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        precedenceBand: 'latent',
        recognitionBand: 'marginal',
        precedentedLever: 'sector_rebalance',
        turnsToDefinitive: 102,
        precedenceScore: 0.003,
        precedenceRank: 190,
        precedenceSummary: 's',
      },
    ]);
    return summary.definitiveCount === 1 && summary.dominantBand === 'definitive';
  });

  check('a08_precedence_04', () => {
    const band = classifyNationalPrecedenceBand(0.95, 1, 'recognized');
    return band === 'precedented';
  });

  check('a08_precedence_05', () => {
    const precedence = computeNationalProductionTransitionPrecedence({
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
      precedence.schemaVersion === AGENT08_TRANSITION_PRECEDENCE_SCHEMA_VERSION &&
      precedence.firmPrecedences.length >= 1 &&
      precedence.nationalPrecedencePressure >= 0 &&
      precedence.nationalPrecedencePressure <= 1
    );
  });

  return results;
}
