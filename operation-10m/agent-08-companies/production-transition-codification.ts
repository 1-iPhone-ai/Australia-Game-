/**
 * Agent 08 round 27 (O10-185) — transition codification posture from heritage bands.
 * Non-authoritative planning layer (codification bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionHeritage,
  type FirmProductionTransitionHeritage,
  type NationalProductionTransitionHeritage,
  type TransitionHeritageBand,
} from './production-transition-heritage';

export const AGENT08_TRANSITION_CODIFICATION_SCHEMA_VERSION = '1.0.0';

export type TransitionCodificationBand = 'draft' | 'codifying' | 'codified' | 'entrenched';

export interface FirmProductionTransitionCodification {
  companyId: string;
  regionId: string;
  codificationBand: TransitionCodificationBand;
  heritageBand: TransitionHeritageBand;
  codifiedLever: ProductionRecoveryLever;
  turnsToEntrench: number;
  codificationScore: number;
  codificationRank: number;
  codificationSummary: string;
}

export interface RegionalTransitionCodificationSummary {
  regionId: string;
  firmCount: number;
  entrenchedCount: number;
  codifiedCount: number;
  avgCodificationScore: number;
  regionalCodificationPressure: number;
  dominantBand: TransitionCodificationBand;
}

export interface NationalProductionTransitionCodification {
  schemaVersion: typeof AGENT08_TRANSITION_CODIFICATION_SCHEMA_VERSION;
  turn: number;
  heritageTurn: number;
  nationalCodificationPressure: number;
  nationalCodificationBand: TransitionCodificationBand;
  firmsEntrenched: number;
  firmCodifications: FirmProductionTransitionCodification[];
  regions: RegionalTransitionCodificationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const COD_BAND_ORDER: TransitionCodificationBand[] = ['draft', 'codifying', 'codified', 'entrenched'];

function codificationBandFromHeritage(heritage: FirmProductionTransitionHeritage): TransitionCodificationBand {
  switch (heritage.heritageBand) {
    case 'legacy':
      return 'entrenched';
    case 'established':
      return 'codified';
    case 'accumulating':
      return 'codifying';
    default:
      return 'draft';
  }
}

function codificationScoreFromSignals(
  band: TransitionCodificationBand,
  heritage: FirmProductionTransitionHeritage,
): number {
  const bandBase =
    band === 'entrenched' ? 0.998 : band === 'codified' ? 0.81 : band === 'codifying' ? 0.53 : 0.05;
  const heritageAdj = heritage.heritageScore * 0.075;
  const urgencyAdj =
    heritage.heritageBand === 'legacy'
      ? 0.032
      : heritage.heritageBand === 'established'
        ? 0.016
        : heritage.heritageBand === 'accumulating'
          ? 0.006
          : 0;
  return clamp(Math.round((bandBase + heritageAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionCodification(
  heritage: FirmProductionTransitionHeritage,
): FirmProductionTransitionCodification {
  const codificationBand = codificationBandFromHeritage(heritage);
  const codificationScore = codificationScoreFromSignals(codificationBand, heritage);
  const rankBase =
    codificationBand === 'entrenched'
      ? 2300
      : codificationBand === 'codified'
        ? 1460
        : codificationBand === 'codifying'
          ? 840
          : 210;
  const codificationRank = Math.round(
    rankBase + heritage.heritageRank * 0.1 + codificationScore * 70,
  );

  const leverLabel = heritage.heritageLever.replace(/_/g, ' ');
  const codificationSummary =
    codificationBand === 'entrenched'
      ? `entrenched ${leverLabel} codification after ${heritage.turnsToLegacy} legacy turns`
      : codificationBand === 'codified'
        ? `codified ${leverLabel} from ${heritage.heritageBand} heritage`
        : codificationBand === 'codifying'
          ? `codifying ${leverLabel} practice while accumulating`
          : `draft — ${heritage.heritageSummary}`;

  const turnsToEntrench =
    codificationBand === 'entrenched'
      ? Math.max(1, Math.min(heritage.turnsToLegacy, 1))
      : codificationBand === 'codified'
        ? Math.max(1, heritage.turnsToLegacy + 1)
        : codificationBand === 'codifying'
          ? heritage.turnsToLegacy + 6
          : heritage.turnsToLegacy + 14;

  return {
    companyId: heritage.companyId,
    regionId: heritage.regionId,
    codificationBand,
    heritageBand: heritage.heritageBand,
    codifiedLever: heritage.heritageLever,
    turnsToEntrench,
    codificationScore,
    codificationRank,
    codificationSummary,
  };
}

export function summarizeRegionalTransitionCodification(
  regionId: string,
  rows: FirmProductionTransitionCodification[],
): RegionalTransitionCodificationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const entrenchedCount = regional.filter(r => r.codificationBand === 'entrenched').length;
  const codifiedCount = regional.filter(
    r => r.codificationBand === 'codified' || r.codificationBand === 'entrenched',
  ).length;
  const avgCodificationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.codificationScore, 0) / regional.length;

  const counts: Record<TransitionCodificationBand, number> = {
    draft: 0,
    codifying: 0,
    codified: 0,
    entrenched: 0,
  };
  for (const r of regional) counts[r.codificationBand] += 1;

  let dominantBand: TransitionCodificationBand = 'draft';
  let max = -1;
  for (const b of [...COD_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalCodificationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.codificationBand === 'entrenched'
              ? 1
              : r.codificationBand === 'codified'
                ? 0.5
                : r.codificationBand === 'codifying'
                  ? 0.18
                  : 0.015;
          return acc + w * r.codificationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    entrenchedCount,
    codifiedCount,
    avgCodificationScore: Math.round(avgCodificationScore * 1000) / 1000,
    regionalCodificationPressure: Math.round(regionalCodificationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalCodificationBand(
  pressure: number,
  firmsEntrenched: number,
  nationalHeritageBand: TransitionHeritageBand,
): TransitionCodificationBand {
  if (firmsEntrenched >= 2 || nationalHeritageBand === 'legacy' || pressure > 0.95) return 'entrenched';
  if (firmsEntrenched >= 1 || nationalHeritageBand === 'established' || pressure > 0.78) return 'codified';
  if (nationalHeritageBand === 'accumulating' || pressure > 0.56) return 'codifying';
  return 'draft';
}

export function computeNationalCodificationPressure(
  rows: FirmProductionTransitionCodification[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.codificationBand === 'entrenched'
        ? 1
        : r.codificationBand === 'codified'
          ? 0.44
          : r.codificationBand === 'codifying'
            ? 0.12
            : 0.008;
    return acc + bandW * 0.34 + r.codificationScore * 0.66;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionCodification(params: {
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
}): NationalProductionTransitionCodification {
  const heritage =
    params.heritage ??
    computeNationalProductionTransitionHeritage({
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
    });

  const firmCodifications = heritage.firmHeritages
    .map(buildFirmProductionTransitionCodification)
    .sort((a, b) => b.codificationRank - a.codificationRank);

  const regionIds = [...new Set(firmCodifications.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionCodification(rid, firmCodifications));

  const nationalCodificationPressure = computeNationalCodificationPressure(firmCodifications);
  const firmsEntrenched = firmCodifications.filter(r => r.codificationBand === 'entrenched').length;
  const nationalCodificationBand = classifyNationalCodificationBand(
    nationalCodificationPressure,
    firmsEntrenched,
    heritage.nationalHeritageBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_CODIFICATION_SCHEMA_VERSION,
    turn: params.turn,
    heritageTurn: heritage.turn,
    nationalCodificationPressure,
    nationalCodificationBand,
    firmsEntrenched,
    firmCodifications,
    regions,
  };
}

export function runAgent08TransitionCodificationSelfTests(): Array<{
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

  check('a08_codification_01', () => {
    const row = buildFirmProductionTransitionCodification({
      companyId: 'f1',
      regionId: 'NSW',
      heritageBand: 'legacy',
      continuityBand: 'canonical',
      heritageLever: 'relieve_upstream',
      turnsToLegacy: 1,
      heritageScore: 0.999,
      heritageRank: 2150,
      heritageSummary: 's',
    });
    return row.codificationBand === 'entrenched' && row.codifiedLever === 'relieve_upstream';
  });

  check('a08_codification_02', () => {
    const row = buildFirmProductionTransitionCodification({
      companyId: 'f2',
      regionId: 'VIC',
      heritageBand: 'provisional',
      continuityBand: 'ephemeral',
      heritageLever: 'sector_rebalance',
      turnsToLegacy: 62,
      heritageScore: 0.04,
      heritageRank: 170,
      heritageSummary: 's',
    });
    return row.codificationBand === 'draft';
  });

  check('a08_codification_03', () => {
    const summary = summarizeRegionalTransitionCodification('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        codificationBand: 'entrenched',
        heritageBand: 'legacy',
        codifiedLever: 'capacity_buffer',
        turnsToEntrench: 1,
        codificationScore: 0.995,
        codificationRank: 2200,
        codificationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        codificationBand: 'draft',
        heritageBand: 'provisional',
        codifiedLever: 'sector_rebalance',
        turnsToEntrench: 66,
        codificationScore: 0.04,
        codificationRank: 200,
        codificationSummary: 's',
      },
    ]);
    return summary.entrenchedCount === 1 && summary.dominantBand === 'entrenched';
  });

  check('a08_codification_04', () => {
    const band = classifyNationalCodificationBand(0.82, 1, 'established');
    return band === 'codified';
  });

  check('a08_codification_05', () => {
    const codification = computeNationalProductionTransitionCodification({
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
      codification.schemaVersion === AGENT08_TRANSITION_CODIFICATION_SCHEMA_VERSION &&
      codification.firmCodifications.length >= 1 &&
      codification.nationalCodificationPressure >= 0 &&
      codification.nationalCodificationPressure <= 1
    );
  });

  return results;
}
