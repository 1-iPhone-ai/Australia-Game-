/**
 * Agent 08 round 34 (O10-199) — transition recognition posture from legitimacy bands.
 * Non-authoritative planning layer (recognition bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionLegitimacy,
  type FirmProductionTransitionLegitimacy,
  type NationalProductionTransitionLegitimacy,
  type TransitionLegitimacyBand,
} from './production-transition-legitimacy';

export const AGENT08_TRANSITION_RECOGNITION_SCHEMA_VERSION = '1.0.0';

export type TransitionRecognitionBand = 'marginal' | 'acknowledged' | 'recognized' | 'canonical';

export interface FirmProductionTransitionRecognition {
  companyId: string;
  regionId: string;
  recognitionBand: TransitionRecognitionBand;
  legitimacyBand: TransitionLegitimacyBand;
  recognizedLever: ProductionRecoveryLever;
  turnsToCanonical: number;
  recognitionScore: number;
  recognitionRank: number;
  recognitionSummary: string;
}

export interface RegionalTransitionRecognitionSummary {
  regionId: string;
  firmCount: number;
  canonicalCount: number;
  recognizedCount: number;
  avgRecognitionScore: number;
  regionalRecognitionPressure: number;
  dominantBand: TransitionRecognitionBand;
}

export interface NationalProductionTransitionRecognition {
  schemaVersion: typeof AGENT08_TRANSITION_RECOGNITION_SCHEMA_VERSION;
  turn: number;
  legitimacyTurn: number;
  nationalRecognitionPressure: number;
  nationalRecognitionBand: TransitionRecognitionBand;
  firmsCanonical: number;
  firmRecognitions: FirmProductionTransitionRecognition[];
  regions: RegionalTransitionRecognitionSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const REC_BAND_ORDER: TransitionRecognitionBand[] = ['marginal', 'acknowledged', 'recognized', 'canonical'];

function recognitionBandFromLegitimacy(
  legitimacy: FirmProductionTransitionLegitimacy,
): TransitionRecognitionBand {
  switch (legitimacy.legitimacyBand) {
    case 'institutional':
      return 'canonical';
    case 'legitimate':
      return 'recognized';
    case 'emerging':
      return 'acknowledged';
    default:
      return 'marginal';
  }
}

function recognitionScoreFromSignals(
  band: TransitionRecognitionBand,
  legitimacy: FirmProductionTransitionLegitimacy,
): number {
  const bandBase =
    band === 'canonical'
      ? 0.999
      : band === 'recognized'
        ? 0.88
        : band === 'acknowledged'
          ? 0.6
          : 0.01;
  const legitimacyAdj = legitimacy.legitimacyScore * 0.046;
  const urgencyAdj =
    legitimacy.legitimacyBand === 'institutional'
      ? 0.02
      : legitimacy.legitimacyBand === 'legitimate'
        ? 0.006
        : legitimacy.legitimacyBand === 'emerging'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + legitimacyAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionRecognition(
  legitimacy: FirmProductionTransitionLegitimacy,
): FirmProductionTransitionRecognition {
  const recognitionBand = recognitionBandFromLegitimacy(legitimacy);
  const recognitionScore = recognitionScoreFromSignals(recognitionBand, legitimacy);
  const rankBase =
    recognitionBand === 'canonical'
      ? 3000
      : recognitionBand === 'recognized'
        ? 1960
        : recognitionBand === 'acknowledged'
          ? 1080
          : 220;
  const recognitionRank = Math.round(
    rankBase + legitimacy.legitimacyRank * 0.052 + recognitionScore * 56,
  );

  const leverLabel = legitimacy.legitimateLever.replace(/_/g, ' ');
  const recognitionSummary =
    recognitionBand === 'canonical'
      ? `canonical ${leverLabel} recognition after ${legitimacy.turnsToInstitutional} institutional turns`
      : recognitionBand === 'recognized'
        ? `recognized ${leverLabel} from ${legitimacy.legitimacyBand} legitimacy`
        : recognitionBand === 'acknowledged'
          ? `acknowledged ${leverLabel} while legitimacy emerges`
          : `marginal — ${legitimacy.legitimacySummary}`;

  const turnsToCanonical =
    recognitionBand === 'canonical'
      ? Math.max(1, Math.min(legitimacy.turnsToInstitutional, 1))
      : recognitionBand === 'recognized'
        ? Math.max(1, legitimacy.turnsToInstitutional + 1)
        : recognitionBand === 'acknowledged'
          ? legitimacy.turnsToInstitutional + 4
          : legitimacy.turnsToInstitutional + 16;

  return {
    companyId: legitimacy.companyId,
    regionId: legitimacy.regionId,
    recognitionBand,
    legitimacyBand: legitimacy.legitimacyBand,
    recognizedLever: legitimacy.legitimateLever,
    turnsToCanonical,
    recognitionScore,
    recognitionRank,
    recognitionSummary,
  };
}

export function summarizeRegionalTransitionRecognition(
  regionId: string,
  rows: FirmProductionTransitionRecognition[],
): RegionalTransitionRecognitionSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const canonicalCount = regional.filter(r => r.recognitionBand === 'canonical').length;
  const recognizedCount = regional.filter(
    r => r.recognitionBand === 'recognized' || r.recognitionBand === 'canonical',
  ).length;
  const avgRecognitionScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.recognitionScore, 0) / regional.length;

  const counts: Record<TransitionRecognitionBand, number> = {
    marginal: 0,
    acknowledged: 0,
    recognized: 0,
    canonical: 0,
  };
  for (const r of regional) counts[r.recognitionBand] += 1;

  let dominantBand: TransitionRecognitionBand = 'marginal';
  let max = -1;
  for (const b of [...REC_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalRecognitionPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.recognitionBand === 'canonical'
              ? 1
              : r.recognitionBand === 'recognized'
                ? 0.36
                : r.recognitionBand === 'acknowledged'
                  ? 0.065
                  : 0.0015;
          return acc + w * r.recognitionScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    canonicalCount,
    recognizedCount,
    avgRecognitionScore: Math.round(avgRecognitionScore * 1000) / 1000,
    regionalRecognitionPressure: Math.round(regionalRecognitionPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalRecognitionBand(
  pressure: number,
  firmsCanonical: number,
  nationalLegitimacyBand: TransitionLegitimacyBand,
): TransitionRecognitionBand {
  if (firmsCanonical >= 2 || nationalLegitimacyBand === 'institutional' || pressure > 0.997)
    return 'canonical';
  if (firmsCanonical >= 1 || nationalLegitimacyBand === 'legitimate' || pressure > 0.9)
    return 'recognized';
  if (nationalLegitimacyBand === 'emerging' || pressure > 0.68) return 'acknowledged';
  return 'marginal';
}

export function computeNationalRecognitionPressure(
  rows: FirmProductionTransitionRecognition[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.recognitionBand === 'canonical'
        ? 1
        : r.recognitionBand === 'recognized'
          ? 0.32
          : r.recognitionBand === 'acknowledged'
            ? 0.032
            : 0.0006;
    return acc + bandW * 0.22 + r.recognitionScore * 0.78;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionRecognition(params: {
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
}): NationalProductionTransitionRecognition {
  const legitimacy =
    params.legitimacy ??
    computeNationalProductionTransitionLegitimacy({
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
    });

  const firmRecognitions = legitimacy.firmLegitimacies
    .map(buildFirmProductionTransitionRecognition)
    .sort((a, b) => b.recognitionRank - a.recognitionRank);

  const regionIds = [...new Set(firmRecognitions.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionRecognition(rid, firmRecognitions));

  const nationalRecognitionPressure = computeNationalRecognitionPressure(firmRecognitions);
  const firmsCanonical = firmRecognitions.filter(r => r.recognitionBand === 'canonical').length;
  const nationalRecognitionBand = classifyNationalRecognitionBand(
    nationalRecognitionPressure,
    firmsCanonical,
    legitimacy.nationalLegitimacyBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_RECOGNITION_SCHEMA_VERSION,
    turn: params.turn,
    legitimacyTurn: legitimacy.turn,
    nationalRecognitionPressure,
    nationalRecognitionBand,
    firmsCanonical,
    firmRecognitions,
    regions,
  };
}

export function runAgent08TransitionRecognitionSelfTests(): Array<{
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

  check('a08_recognition_01', () => {
    const row = buildFirmProductionTransitionRecognition({
      companyId: 'f1',
      regionId: 'NSW',
      legitimacyBand: 'institutional',
      trustBand: 'bonded',
      legitimateLever: 'relieve_upstream',
      turnsToInstitutional: 1,
      legitimacyScore: 0.999,
      legitimacyRank: 2850,
      legitimacySummary: 's',
    });
    return row.recognitionBand === 'canonical' && row.recognizedLever === 'relieve_upstream';
  });

  check('a08_recognition_02', () => {
    const row = buildFirmProductionTransitionRecognition({
      companyId: 'f2',
      regionId: 'VIC',
      legitimacyBand: 'contested',
      trustBand: 'doubtful',
      legitimateLever: 'sector_rebalance',
      turnsToInstitutional: 96,
      legitimacyScore: 0.004,
      legitimacyRank: 200,
      legitimacySummary: 's',
    });
    return row.recognitionBand === 'marginal';
  });

  check('a08_recognition_03', () => {
    const summary = summarizeRegionalTransitionRecognition('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        recognitionBand: 'canonical',
        legitimacyBand: 'institutional',
        recognizedLever: 'capacity_buffer',
        turnsToCanonical: 1,
        recognitionScore: 0.998,
        recognitionRank: 2900,
        recognitionSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        recognitionBand: 'marginal',
        legitimacyBand: 'contested',
        recognizedLever: 'sector_rebalance',
        turnsToCanonical: 100,
        recognitionScore: 0.004,
        recognitionRank: 210,
        recognitionSummary: 's',
      },
    ]);
    return summary.canonicalCount === 1 && summary.dominantBand === 'canonical';
  });

  check('a08_recognition_04', () => {
    const band = classifyNationalRecognitionBand(0.94, 1, 'legitimate');
    return band === 'recognized';
  });

  check('a08_recognition_05', () => {
    const recognition = computeNationalProductionTransitionRecognition({
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
      recognition.schemaVersion === AGENT08_TRANSITION_RECOGNITION_SCHEMA_VERSION &&
      recognition.firmRecognitions.length >= 1 &&
      recognition.nationalRecognitionPressure >= 0 &&
      recognition.nationalRecognitionPressure <= 1
    );
  });

  return results;
}
