/**
 * Agent 08 round 20 — transition consolidation posture from validation bands.
 * Non-authoritative planning layer (consolidation bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionValidation,
  type FirmProductionTransitionValidation,
  type NationalProductionTransitionValidation,
  type TransitionValidationBand,
} from './production-transition-validation';

export const AGENT08_TRANSITION_CONSOLIDATION_SCHEMA_VERSION = '1.0.0';

export type TransitionConsolidationBand = 'fragile' | 'stabilizing' | 'consolidated' | 'embedded';

export interface FirmProductionTransitionConsolidation {
  companyId: string;
  regionId: string;
  consolidationBand: TransitionConsolidationBand;
  validationBand: TransitionValidationBand;
  consolidatedLever: ProductionRecoveryLever;
  turnsToEmbed: number;
  consolidationScore: number;
  consolidationRank: number;
  consolidationSummary: string;
}

export interface RegionalTransitionConsolidationSummary {
  regionId: string;
  firmCount: number;
  embeddedCount: number;
  consolidatedCount: number;
  avgConsolidationScore: number;
  regionalConsolidationPressure: number;
  dominantBand: TransitionConsolidationBand;
}

export interface NationalProductionTransitionConsolidation {
  schemaVersion: typeof AGENT08_TRANSITION_CONSOLIDATION_SCHEMA_VERSION;
  turn: number;
  validationTurn: number;
  nationalConsolidationPressure: number;
  nationalConsolidationBand: TransitionConsolidationBand;
  firmsEmbedded: number;
  firmConsolidations: FirmProductionTransitionConsolidation[];
  regions: RegionalTransitionConsolidationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const CON_BAND_ORDER: TransitionConsolidationBand[] = ['fragile', 'stabilizing', 'consolidated', 'embedded'];

function consolidationBandFromValidation(
  validation: FirmProductionTransitionValidation,
): TransitionConsolidationBand {
  switch (validation.validationBand) {
    case 'anchored':
      return 'embedded';
    case 'verified':
      return 'consolidated';
    case 'review':
      return 'stabilizing';
    default:
      return 'fragile';
  }
}

function consolidationScoreFromSignals(
  band: TransitionConsolidationBand,
  validation: FirmProductionTransitionValidation,
): number {
  const bandBase =
    band === 'embedded' ? 0.97 : band === 'consolidated' ? 0.74 : band === 'stabilizing' ? 0.46 : 0.12;
  const validationAdj = validation.validationScore * 0.12;
  const urgencyAdj =
    validation.validationBand === 'anchored'
      ? 0.048
      : validation.validationBand === 'verified'
        ? 0.03
        : validation.validationBand === 'review'
          ? 0.014
          : 0;
  return clamp(Math.round((bandBase + validationAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionConsolidation(
  validation: FirmProductionTransitionValidation,
): FirmProductionTransitionConsolidation {
  const consolidationBand = consolidationBandFromValidation(validation);
  const consolidationScore = consolidationScoreFromSignals(consolidationBand, validation);
  const rankBase =
    consolidationBand === 'embedded'
      ? 1600
      : consolidationBand === 'consolidated'
        ? 1040
        : consolidationBand === 'stabilizing'
          ? 560
          : 140;
  const consolidationRank = Math.round(
    rankBase + validation.validationRank * 0.24 + consolidationScore * 84,
  );

  const leverLabel = validation.validatedLever.replace(/_/g, ' ');
  const consolidationSummary =
    consolidationBand === 'embedded'
      ? `embedded ${leverLabel} after ${validation.turnsToAnchor} turn anchor`
      : consolidationBand === 'consolidated'
        ? `consolidated ${leverLabel} from ${validation.validationBand} validation`
        : consolidationBand === 'stabilizing'
          ? `stabilizing ${leverLabel} gains under review`
          : `fragile — ${validation.validationSummary}`;

  const turnsToEmbed =
    consolidationBand === 'embedded'
      ? Math.max(1, Math.min(validation.turnsToAnchor, 1))
      : consolidationBand === 'consolidated'
        ? Math.max(1, validation.turnsToAnchor + 1)
        : consolidationBand === 'stabilizing'
          ? validation.turnsToAnchor + 3
          : validation.turnsToAnchor + 7;

  return {
    companyId: validation.companyId,
    regionId: validation.regionId,
    consolidationBand,
    validationBand: validation.validationBand,
    consolidatedLever: validation.validatedLever,
    turnsToEmbed,
    consolidationScore,
    consolidationRank,
    consolidationSummary,
  };
}

export function summarizeRegionalTransitionConsolidation(
  regionId: string,
  rows: FirmProductionTransitionConsolidation[],
): RegionalTransitionConsolidationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const embeddedCount = regional.filter(r => r.consolidationBand === 'embedded').length;
  const consolidatedCount = regional.filter(
    r => r.consolidationBand === 'consolidated' || r.consolidationBand === 'embedded',
  ).length;
  const avgConsolidationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.consolidationScore, 0) / regional.length;

  const counts: Record<TransitionConsolidationBand, number> = {
    fragile: 0,
    stabilizing: 0,
    consolidated: 0,
    embedded: 0,
  };
  for (const r of regional) counts[r.consolidationBand] += 1;

  let dominantBand: TransitionConsolidationBand = 'fragile';
  let max = -1;
  for (const b of [...CON_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalConsolidationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.consolidationBand === 'embedded'
              ? 1
              : r.consolidationBand === 'consolidated'
                ? 0.64
                : r.consolidationBand === 'stabilizing'
                  ? 0.32
                  : 0.07;
          return acc + w * r.consolidationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    embeddedCount,
    consolidatedCount,
    avgConsolidationScore: Math.round(avgConsolidationScore * 1000) / 1000,
    regionalConsolidationPressure: Math.round(regionalConsolidationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalConsolidationBand(
  pressure: number,
  firmsEmbedded: number,
  nationalValidationBand: TransitionValidationBand,
): TransitionConsolidationBand {
  if (firmsEmbedded >= 2 || nationalValidationBand === 'anchored' || pressure > 0.86) return 'embedded';
  if (firmsEmbedded >= 1 || nationalValidationBand === 'verified' || pressure > 0.64) return 'consolidated';
  if (nationalValidationBand === 'review' || pressure > 0.42) return 'stabilizing';
  return 'fragile';
}

export function computeNationalConsolidationPressure(
  rows: FirmProductionTransitionConsolidation[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.consolidationBand === 'embedded'
        ? 1
        : r.consolidationBand === 'consolidated'
          ? 0.58
          : r.consolidationBand === 'stabilizing'
            ? 0.26
            : 0.05;
    return acc + bandW * 0.48 + r.consolidationScore * 0.52;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionConsolidation(params: {
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
}): NationalProductionTransitionConsolidation {
  const validation =
    params.validation ??
    computeNationalProductionTransitionValidation({
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
    });

  const firmConsolidations = validation.firmValidations
    .map(buildFirmProductionTransitionConsolidation)
    .sort((a, b) => b.consolidationRank - a.consolidationRank);

  const regionIds = [...new Set(firmConsolidations.map(r => r.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalTransitionConsolidation(rid, firmConsolidations),
  );

  const nationalConsolidationPressure = computeNationalConsolidationPressure(firmConsolidations);
  const firmsEmbedded = firmConsolidations.filter(r => r.consolidationBand === 'embedded').length;
  const nationalConsolidationBand = classifyNationalConsolidationBand(
    nationalConsolidationPressure,
    firmsEmbedded,
    validation.nationalValidationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_CONSOLIDATION_SCHEMA_VERSION,
    turn: params.turn,
    validationTurn: validation.turn,
    nationalConsolidationPressure,
    nationalConsolidationBand,
    firmsEmbedded,
    firmConsolidations,
    regions,
  };
}

export function runAgent08TransitionConsolidationSelfTests(): Array<{
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

  check('a08_consolidation_01', () => {
    const row = buildFirmProductionTransitionConsolidation({
      companyId: 'f1',
      regionId: 'NSW',
      validationBand: 'anchored',
      deploymentBand: 'live',
      validatedLever: 'relieve_upstream',
      turnsToAnchor: 1,
      validationScore: 0.95,
      validationRank: 1450,
      validationSummary: 's',
    });
    return row.consolidationBand === 'embedded' && row.consolidatedLever === 'relieve_upstream';
  });

  check('a08_consolidation_02', () => {
    const row = buildFirmProductionTransitionConsolidation({
      companyId: 'f2',
      regionId: 'VIC',
      validationBand: 'pending',
      deploymentBand: 'staged',
      validatedLever: 'sector_rebalance',
      turnsToAnchor: 22,
      validationScore: 0.16,
      validationRank: 100,
      validationSummary: 's',
    });
    return row.consolidationBand === 'fragile';
  });

  check('a08_consolidation_03', () => {
    const summary = summarizeRegionalTransitionConsolidation('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        consolidationBand: 'embedded',
        validationBand: 'anchored',
        consolidatedLever: 'capacity_buffer',
        turnsToEmbed: 1,
        consolidationScore: 0.93,
        consolidationRank: 1500,
        consolidationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        consolidationBand: 'fragile',
        validationBand: 'pending',
        consolidatedLever: 'sector_rebalance',
        turnsToEmbed: 24,
        consolidationScore: 0.15,
        consolidationRank: 130,
        consolidationSummary: 's',
      },
    ]);
    return summary.embeddedCount === 1 && summary.dominantBand === 'embedded';
  });

  check('a08_consolidation_04', () => {
    const band = classifyNationalConsolidationBand(0.68, 1, 'verified');
    return band === 'consolidated';
  });

  check('a08_consolidation_05', () => {
    const consolidation = computeNationalProductionTransitionConsolidation({
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
      consolidation.schemaVersion === AGENT08_TRANSITION_CONSOLIDATION_SCHEMA_VERSION &&
      consolidation.firmConsolidations.length >= 1 &&
      consolidation.nationalConsolidationPressure >= 0 &&
      consolidation.nationalConsolidationPressure <= 1
    );
  });

  return results;
}
