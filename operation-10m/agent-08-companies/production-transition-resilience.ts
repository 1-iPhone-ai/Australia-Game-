/**
 * Agent 08 round 22 — transition resilience posture from sustainment bands.
 * Non-authoritative planning layer (resilience bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionSustainment,
  type FirmProductionTransitionSustainment,
  type NationalProductionTransitionSustainment,
  type TransitionSustainmentBand,
} from './production-transition-sustainment';

export const AGENT08_TRANSITION_RESILIENCE_SCHEMA_VERSION = '1.0.0';

export type TransitionResilienceBand = 'exposed' | 'hedged' | 'resilient' | 'hardened';

export interface FirmProductionTransitionResilience {
  companyId: string;
  regionId: string;
  resilienceBand: TransitionResilienceBand;
  sustainmentBand: TransitionSustainmentBand;
  resilientLever: ProductionRecoveryLever;
  turnsToHarden: number;
  resilienceScore: number;
  resilienceRank: number;
  resilienceSummary: string;
}

export interface RegionalTransitionResilienceSummary {
  regionId: string;
  firmCount: number;
  hardenedCount: number;
  resilientCount: number;
  avgResilienceScore: number;
  regionalResiliencePressure: number;
  dominantBand: TransitionResilienceBand;
}

export interface NationalProductionTransitionResilience {
  schemaVersion: typeof AGENT08_TRANSITION_RESILIENCE_SCHEMA_VERSION;
  turn: number;
  sustainmentTurn: number;
  nationalResiliencePressure: number;
  nationalResilienceBand: TransitionResilienceBand;
  firmsHardened: number;
  firmResiliences: FirmProductionTransitionResilience[];
  regions: RegionalTransitionResilienceSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RES_BAND_ORDER: TransitionResilienceBand[] = ['exposed', 'hedged', 'resilient', 'hardened'];

function resilienceBandFromSustainment(sustainment: FirmProductionTransitionSustainment): TransitionResilienceBand {
  switch (sustainment.sustainmentBand) {
    case 'durable':
      return 'hardened';
    case 'sustained':
      return 'resilient';
    case 'holding':
      return 'hedged';
    default:
      return 'exposed';
  }
}

function resilienceScoreFromSignals(
  band: TransitionResilienceBand,
  sustainment: FirmProductionTransitionSustainment,
): number {
  const bandBase =
    band === 'hardened' ? 0.99 : band === 'resilient' ? 0.76 : band === 'hedged' ? 0.48 : 0.1;
  const sustainmentAdj = sustainment.sustainmentScore * 0.1;
  const urgencyAdj =
    sustainment.sustainmentBand === 'durable'
      ? 0.042
      : sustainment.sustainmentBand === 'sustained'
        ? 0.026
        : sustainment.sustainmentBand === 'holding'
          ? 0.011
          : 0;
  return clamp(Math.round((bandBase + sustainmentAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionResilience(
  sustainment: FirmProductionTransitionSustainment,
): FirmProductionTransitionResilience {
  const resilienceBand = resilienceBandFromSustainment(sustainment);
  const resilienceScore = resilienceScoreFromSignals(resilienceBand, sustainment);
  const rankBase =
    resilienceBand === 'hardened'
      ? 1800
      : resilienceBand === 'resilient'
        ? 1160
        : resilienceBand === 'hedged'
          ? 640
          : 160;
  const resilienceRank = Math.round(
    rankBase + sustainment.sustainmentRank * 0.2 + resilienceScore * 80,
  );

  const leverLabel = sustainment.sustainedLever.replace(/_/g, ' ');
  const resilienceSummary =
    resilienceBand === 'hardened'
      ? `hardened ${leverLabel} buffer after ${sustainment.turnsToSteady} steady turns`
      : resilienceBand === 'resilient'
        ? `resilient ${leverLabel} from ${sustainment.sustainmentBand} sustainment`
        : resilienceBand === 'hedged'
          ? `hedged ${leverLabel} while holding gains`
          : `exposed — ${sustainment.sustainmentSummary}`;

  const turnsToHarden =
    resilienceBand === 'hardened'
      ? Math.max(1, Math.min(sustainment.turnsToSteady, 1))
      : resilienceBand === 'resilient'
        ? Math.max(1, sustainment.turnsToSteady + 1)
        : resilienceBand === 'hedged'
          ? sustainment.turnsToSteady + 4
          : sustainment.turnsToSteady + 9;

  return {
    companyId: sustainment.companyId,
    regionId: sustainment.regionId,
    resilienceBand,
    sustainmentBand: sustainment.sustainmentBand,
    resilientLever: sustainment.sustainedLever,
    turnsToHarden,
    resilienceScore,
    resilienceRank,
    resilienceSummary,
  };
}

export function summarizeRegionalTransitionResilience(
  regionId: string,
  rows: FirmProductionTransitionResilience[],
): RegionalTransitionResilienceSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const hardenedCount = regional.filter(r => r.resilienceBand === 'hardened').length;
  const resilientCount = regional.filter(
    r => r.resilienceBand === 'resilient' || r.resilienceBand === 'hardened',
  ).length;
  const avgResilienceScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.resilienceScore, 0) / regional.length;

  const counts: Record<TransitionResilienceBand, number> = {
    exposed: 0,
    hedged: 0,
    resilient: 0,
    hardened: 0,
  };
  for (const r of regional) counts[r.resilienceBand] += 1;

  let dominantBand: TransitionResilienceBand = 'exposed';
  let max = -1;
  for (const b of [...RES_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalResiliencePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.resilienceBand === 'hardened'
              ? 1
              : r.resilienceBand === 'resilient'
                ? 0.6
                : r.resilienceBand === 'hedged'
                  ? 0.28
                  : 0.05;
          return acc + w * r.resilienceScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    hardenedCount,
    resilientCount,
    avgResilienceScore: Math.round(avgResilienceScore * 1000) / 1000,
    regionalResiliencePressure: Math.round(regionalResiliencePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalResilienceBand(
  pressure: number,
  firmsHardened: number,
  nationalSustainmentBand: TransitionSustainmentBand,
): TransitionResilienceBand {
  if (firmsHardened >= 2 || nationalSustainmentBand === 'durable' || pressure > 0.9) return 'hardened';
  if (firmsHardened >= 1 || nationalSustainmentBand === 'sustained' || pressure > 0.68) return 'resilient';
  if (nationalSustainmentBand === 'holding' || pressure > 0.46) return 'hedged';
  return 'exposed';
}

export function computeNationalResiliencePressure(rows: FirmProductionTransitionResilience[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.resilienceBand === 'hardened'
        ? 1
        : r.resilienceBand === 'resilient'
          ? 0.54
          : r.resilienceBand === 'hedged'
            ? 0.22
            : 0.03;
    return acc + bandW * 0.44 + r.resilienceScore * 0.56;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionResilience(params: {
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
}): NationalProductionTransitionResilience {
  const sustainment =
    params.sustainment ??
    computeNationalProductionTransitionSustainment({
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
    });

  const firmResiliences = sustainment.firmSustainments
    .map(buildFirmProductionTransitionResilience)
    .sort((a, b) => b.resilienceRank - a.resilienceRank);

  const regionIds = [...new Set(firmResiliences.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionResilience(rid, firmResiliences));

  const nationalResiliencePressure = computeNationalResiliencePressure(firmResiliences);
  const firmsHardened = firmResiliences.filter(r => r.resilienceBand === 'hardened').length;
  const nationalResilienceBand = classifyNationalResilienceBand(
    nationalResiliencePressure,
    firmsHardened,
    sustainment.nationalSustainmentBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_RESILIENCE_SCHEMA_VERSION,
    turn: params.turn,
    sustainmentTurn: sustainment.turn,
    nationalResiliencePressure,
    nationalResilienceBand,
    firmsHardened,
    firmResiliences,
    regions,
  };
}

export function runAgent08TransitionResilienceSelfTests(): Array<{
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

  check('a08_resilience_01', () => {
    const row = buildFirmProductionTransitionResilience({
      companyId: 'f1',
      regionId: 'NSW',
      sustainmentBand: 'durable',
      consolidationBand: 'embedded',
      sustainedLever: 'relieve_upstream',
      turnsToSteady: 1,
      sustainmentScore: 0.97,
      sustainmentRank: 1650,
      sustainmentSummary: 's',
    });
    return row.resilienceBand === 'hardened' && row.resilientLever === 'relieve_upstream';
  });

  check('a08_resilience_02', () => {
    const row = buildFirmProductionTransitionResilience({
      companyId: 'f2',
      regionId: 'VIC',
      sustainmentBand: 'drifting',
      consolidationBand: 'fragile',
      sustainedLever: 'sector_rebalance',
      turnsToSteady: 32,
      sustainmentScore: 0.13,
      sustainmentRank: 120,
      sustainmentSummary: 's',
    });
    return row.resilienceBand === 'exposed';
  });

  check('a08_resilience_03', () => {
    const summary = summarizeRegionalTransitionResilience('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        resilienceBand: 'hardened',
        sustainmentBand: 'durable',
        resilientLever: 'capacity_buffer',
        turnsToHarden: 1,
        resilienceScore: 0.95,
        resilienceRank: 1700,
        resilienceSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        resilienceBand: 'exposed',
        sustainmentBand: 'drifting',
        resilientLever: 'sector_rebalance',
        turnsToHarden: 36,
        resilienceScore: 0.12,
        resilienceRank: 150,
        resilienceSummary: 's',
      },
    ]);
    return summary.hardenedCount === 1 && summary.dominantBand === 'hardened';
  });

  check('a08_resilience_04', () => {
    const band = classifyNationalResilienceBand(0.72, 1, 'sustained');
    return band === 'resilient';
  });

  check('a08_resilience_05', () => {
    const resilience = computeNationalProductionTransitionResilience({
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
      resilience.schemaVersion === AGENT08_TRANSITION_RESILIENCE_SCHEMA_VERSION &&
      resilience.firmResiliences.length >= 1 &&
      resilience.nationalResiliencePressure >= 0 &&
      resilience.nationalResiliencePressure <= 1
    );
  });

  return results;
}
