/**
 * Agent 08 round 28 (O10-187) — transition stewardship posture from codification bands.
 * Non-authoritative planning layer (stewardship bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionCodification,
  type FirmProductionTransitionCodification,
  type NationalProductionTransitionCodification,
  type TransitionCodificationBand,
} from './production-transition-codification';

export const AGENT08_TRANSITION_STEWARDSHIP_SCHEMA_VERSION = '1.0.0';

export type TransitionStewardshipBand = 'neglected' | 'tending' | 'stewarded' | 'custodial';

export interface FirmProductionTransitionStewardship {
  companyId: string;
  regionId: string;
  stewardshipBand: TransitionStewardshipBand;
  codificationBand: TransitionCodificationBand;
  stewardedLever: ProductionRecoveryLever;
  turnsToCustodial: number;
  stewardshipScore: number;
  stewardshipRank: number;
  stewardshipSummary: string;
}

export interface RegionalTransitionStewardshipSummary {
  regionId: string;
  firmCount: number;
  custodialCount: number;
  stewardedCount: number;
  avgStewardshipScore: number;
  regionalStewardshipPressure: number;
  dominantBand: TransitionStewardshipBand;
}

export interface NationalProductionTransitionStewardship {
  schemaVersion: typeof AGENT08_TRANSITION_STEWARDSHIP_SCHEMA_VERSION;
  turn: number;
  codificationTurn: number;
  nationalStewardshipPressure: number;
  nationalStewardshipBand: TransitionStewardshipBand;
  firmsCustodial: number;
  firmStewardships: FirmProductionTransitionStewardship[];
  regions: RegionalTransitionStewardshipSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const STEW_BAND_ORDER: TransitionStewardshipBand[] = ['neglected', 'tending', 'stewarded', 'custodial'];

function stewardshipBandFromCodification(
  codification: FirmProductionTransitionCodification,
): TransitionStewardshipBand {
  switch (codification.codificationBand) {
    case 'entrenched':
      return 'custodial';
    case 'codified':
      return 'stewarded';
    case 'codifying':
      return 'tending';
    default:
      return 'neglected';
  }
}

function stewardshipScoreFromSignals(
  band: TransitionStewardshipBand,
  codification: FirmProductionTransitionCodification,
): number {
  const bandBase =
    band === 'custodial' ? 0.999 : band === 'stewarded' ? 0.82 : band === 'tending' ? 0.54 : 0.04;
  const codificationAdj = codification.codificationScore * 0.07;
  const urgencyAdj =
    codification.codificationBand === 'entrenched'
      ? 0.03
      : codification.codificationBand === 'codified'
        ? 0.014
        : codification.codificationBand === 'codifying'
          ? 0.005
          : 0;
  return clamp(Math.round((bandBase + codificationAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionStewardship(
  codification: FirmProductionTransitionCodification,
): FirmProductionTransitionStewardship {
  const stewardshipBand = stewardshipBandFromCodification(codification);
  const stewardshipScore = stewardshipScoreFromSignals(stewardshipBand, codification);
  const rankBase =
    stewardshipBand === 'custodial'
      ? 2400
      : stewardshipBand === 'stewarded'
        ? 1520
        : stewardshipBand === 'tending'
          ? 880
          : 220;
  const stewardshipRank = Math.round(
    rankBase + codification.codificationRank * 0.09 + stewardshipScore * 68,
  );

  const leverLabel = codification.codifiedLever.replace(/_/g, ' ');
  const stewardshipSummary =
    stewardshipBand === 'custodial'
      ? `custodial ${leverLabel} stewardship after ${codification.turnsToEntrench} entrenched turns`
      : stewardshipBand === 'stewarded'
        ? `stewarded ${leverLabel} from ${codification.codificationBand} codification`
        : stewardshipBand === 'tending'
          ? `tending ${leverLabel} practice while codifying`
          : `neglected — ${codification.codificationSummary}`;

  const turnsToCustodial =
    stewardshipBand === 'custodial'
      ? Math.max(1, Math.min(codification.turnsToEntrench, 1))
      : stewardshipBand === 'stewarded'
        ? Math.max(1, codification.turnsToEntrench + 1)
        : stewardshipBand === 'tending'
          ? codification.turnsToEntrench + 6
          : codification.turnsToEntrench + 15;

  return {
    companyId: codification.companyId,
    regionId: codification.regionId,
    stewardshipBand,
    codificationBand: codification.codificationBand,
    stewardedLever: codification.codifiedLever,
    turnsToCustodial,
    stewardshipScore,
    stewardshipRank,
    stewardshipSummary,
  };
}

export function summarizeRegionalTransitionStewardship(
  regionId: string,
  rows: FirmProductionTransitionStewardship[],
): RegionalTransitionStewardshipSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const custodialCount = regional.filter(r => r.stewardshipBand === 'custodial').length;
  const stewardedCount = regional.filter(
    r => r.stewardshipBand === 'stewarded' || r.stewardshipBand === 'custodial',
  ).length;
  const avgStewardshipScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.stewardshipScore, 0) / regional.length;

  const counts: Record<TransitionStewardshipBand, number> = {
    neglected: 0,
    tending: 0,
    stewarded: 0,
    custodial: 0,
  };
  for (const r of regional) counts[r.stewardshipBand] += 1;

  let dominantBand: TransitionStewardshipBand = 'neglected';
  let max = -1;
  for (const b of [...STEW_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalStewardshipPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.stewardshipBand === 'custodial'
              ? 1
              : r.stewardshipBand === 'stewarded'
                ? 0.48
                : r.stewardshipBand === 'tending'
                  ? 0.16
                  : 0.01;
          return acc + w * r.stewardshipScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    custodialCount,
    stewardedCount,
    avgStewardshipScore: Math.round(avgStewardshipScore * 1000) / 1000,
    regionalStewardshipPressure: Math.round(regionalStewardshipPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalStewardshipBand(
  pressure: number,
  firmsCustodial: number,
  nationalCodificationBand: TransitionCodificationBand,
): TransitionStewardshipBand {
  if (firmsCustodial >= 2 || nationalCodificationBand === 'entrenched' || pressure > 0.96) return 'custodial';
  if (firmsCustodial >= 1 || nationalCodificationBand === 'codified' || pressure > 0.8) return 'stewarded';
  if (nationalCodificationBand === 'codifying' || pressure > 0.58) return 'tending';
  return 'neglected';
}

export function computeNationalStewardshipPressure(
  rows: FirmProductionTransitionStewardship[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.stewardshipBand === 'custodial'
        ? 1
        : r.stewardshipBand === 'stewarded'
          ? 0.42
          : r.stewardshipBand === 'tending'
            ? 0.1
            : 0.006;
    return acc + bandW * 0.32 + r.stewardshipScore * 0.68;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionStewardship(params: {
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
}): NationalProductionTransitionStewardship {
  const codification =
    params.codification ??
    computeNationalProductionTransitionCodification({
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
    });

  const firmStewardships = codification.firmCodifications
    .map(buildFirmProductionTransitionStewardship)
    .sort((a, b) => b.stewardshipRank - a.stewardshipRank);

  const regionIds = [...new Set(firmStewardships.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionStewardship(rid, firmStewardships));

  const nationalStewardshipPressure = computeNationalStewardshipPressure(firmStewardships);
  const firmsCustodial = firmStewardships.filter(r => r.stewardshipBand === 'custodial').length;
  const nationalStewardshipBand = classifyNationalStewardshipBand(
    nationalStewardshipPressure,
    firmsCustodial,
    codification.nationalCodificationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_STEWARDSHIP_SCHEMA_VERSION,
    turn: params.turn,
    codificationTurn: codification.turn,
    nationalStewardshipPressure,
    nationalStewardshipBand,
    firmsCustodial,
    firmStewardships,
    regions,
  };
}

export function runAgent08TransitionStewardshipSelfTests(): Array<{
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

  check('a08_stewardship_01', () => {
    const row = buildFirmProductionTransitionStewardship({
      companyId: 'f1',
      regionId: 'NSW',
      codificationBand: 'entrenched',
      heritageBand: 'legacy',
      codifiedLever: 'relieve_upstream',
      turnsToEntrench: 1,
      codificationScore: 0.999,
      codificationRank: 2250,
      codificationSummary: 's',
    });
    return row.stewardshipBand === 'custodial' && row.stewardedLever === 'relieve_upstream';
  });

  check('a08_stewardship_02', () => {
    const row = buildFirmProductionTransitionStewardship({
      companyId: 'f2',
      regionId: 'VIC',
      codificationBand: 'draft',
      heritageBand: 'provisional',
      codifiedLever: 'sector_rebalance',
      turnsToEntrench: 68,
      codificationScore: 0.03,
      codificationRank: 180,
      codificationSummary: 's',
    });
    return row.stewardshipBand === 'neglected';
  });

  check('a08_stewardship_03', () => {
    const summary = summarizeRegionalTransitionStewardship('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        stewardshipBand: 'custodial',
        codificationBand: 'entrenched',
        stewardedLever: 'capacity_buffer',
        turnsToCustodial: 1,
        stewardshipScore: 0.998,
        stewardshipRank: 2300,
        stewardshipSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        stewardshipBand: 'neglected',
        codificationBand: 'draft',
        stewardedLever: 'sector_rebalance',
        turnsToCustodial: 72,
        stewardshipScore: 0.03,
        stewardshipRank: 210,
        stewardshipSummary: 's',
      },
    ]);
    return summary.custodialCount === 1 && summary.dominantBand === 'custodial';
  });

  check('a08_stewardship_04', () => {
    const band = classifyNationalStewardshipBand(0.84, 1, 'codified');
    return band === 'stewarded';
  });

  check('a08_stewardship_05', () => {
    const stewardship = computeNationalProductionTransitionStewardship({
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
      stewardship.schemaVersion === AGENT08_TRANSITION_STEWARDSHIP_SCHEMA_VERSION &&
      stewardship.firmStewardships.length >= 1 &&
      stewardship.nationalStewardshipPressure >= 0 &&
      stewardship.nationalStewardshipPressure <= 1
    );
  });

  return results;
}
