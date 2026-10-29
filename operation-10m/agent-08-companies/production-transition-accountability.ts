/**
 * Agent 08 round 30 (O10-191) — transition accountability posture from governance bands.
 * Non-authoritative planning layer (accountability bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionGovernance,
  type FirmProductionTransitionGovernance,
  type NationalProductionTransitionGovernance,
  type TransitionGovernanceBand,
} from './production-transition-governance';

export const AGENT08_TRANSITION_ACCOUNTABILITY_SCHEMA_VERSION = '1.0.0';

export type TransitionAccountabilityBand = 'opaque' | 'disclosed' | 'accountable' | 'attested';

export interface FirmProductionTransitionAccountability {
  companyId: string;
  regionId: string;
  accountabilityBand: TransitionAccountabilityBand;
  governanceBand: TransitionGovernanceBand;
  accountableLever: ProductionRecoveryLever;
  turnsToAttest: number;
  accountabilityScore: number;
  accountabilityRank: number;
  accountabilitySummary: string;
}

export interface RegionalTransitionAccountabilitySummary {
  regionId: string;
  firmCount: number;
  attestedCount: number;
  accountableCount: number;
  avgAccountabilityScore: number;
  regionalAccountabilityPressure: number;
  dominantBand: TransitionAccountabilityBand;
}

export interface NationalProductionTransitionAccountability {
  schemaVersion: typeof AGENT08_TRANSITION_ACCOUNTABILITY_SCHEMA_VERSION;
  turn: number;
  governanceTurn: number;
  nationalAccountabilityPressure: number;
  nationalAccountabilityBand: TransitionAccountabilityBand;
  firmsAttested: number;
  firmAccountabilities: FirmProductionTransitionAccountability[];
  regions: RegionalTransitionAccountabilitySummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const ACC_BAND_ORDER: TransitionAccountabilityBand[] = ['opaque', 'disclosed', 'accountable', 'attested'];

function accountabilityBandFromGovernance(
  governance: FirmProductionTransitionGovernance,
): TransitionAccountabilityBand {
  switch (governance.governanceBand) {
    case 'constitutional':
      return 'attested';
    case 'governed':
      return 'accountable';
    case 'guided':
      return 'disclosed';
    default:
      return 'opaque';
  }
}

function accountabilityScoreFromSignals(
  band: TransitionAccountabilityBand,
  governance: FirmProductionTransitionGovernance,
): number {
  const bandBase =
    band === 'attested' ? 0.999 : band === 'accountable' ? 0.84 : band === 'disclosed' ? 0.56 : 0.02;
  const governanceAdj = governance.governanceScore * 0.06;
  const urgencyAdj =
    governance.governanceBand === 'constitutional'
      ? 0.026
      : governance.governanceBand === 'governed'
        ? 0.01
        : governance.governanceBand === 'guided'
          ? 0.003
          : 0;
  return clamp(Math.round((bandBase + governanceAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionAccountability(
  governance: FirmProductionTransitionGovernance,
): FirmProductionTransitionAccountability {
  const accountabilityBand = accountabilityBandFromGovernance(governance);
  const accountabilityScore = accountabilityScoreFromSignals(accountabilityBand, governance);
  const rankBase =
    accountabilityBand === 'attested'
      ? 2600
      : accountabilityBand === 'accountable'
        ? 1640
        : accountabilityBand === 'disclosed'
          ? 960
          : 240;
  const accountabilityRank = Math.round(
    rankBase + governance.governanceRank * 0.07 + accountabilityScore * 64,
  );

  const leverLabel = governance.governedLever.replace(/_/g, ' ');
  const accountabilitySummary =
    accountabilityBand === 'attested'
      ? `attested ${leverLabel} accountability after ${governance.turnsToConstitutional} constitutional turns`
      : accountabilityBand === 'accountable'
        ? `accountable ${leverLabel} from ${governance.governanceBand} governance`
        : accountabilityBand === 'disclosed'
          ? `disclosed ${leverLabel} practice while guided`
          : `opaque — ${governance.governanceSummary}`;

  const turnsToAttest =
    accountabilityBand === 'attested'
      ? Math.max(1, Math.min(governance.turnsToConstitutional, 1))
      : accountabilityBand === 'accountable'
        ? Math.max(1, governance.turnsToConstitutional + 1)
        : accountabilityBand === 'disclosed'
          ? governance.turnsToConstitutional + 6
          : governance.turnsToConstitutional + 17;

  return {
    companyId: governance.companyId,
    regionId: governance.regionId,
    accountabilityBand,
    governanceBand: governance.governanceBand,
    accountableLever: governance.governedLever,
    turnsToAttest,
    accountabilityScore,
    accountabilityRank,
    accountabilitySummary,
  };
}

export function summarizeRegionalTransitionAccountability(
  regionId: string,
  rows: FirmProductionTransitionAccountability[],
): RegionalTransitionAccountabilitySummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const attestedCount = regional.filter(r => r.accountabilityBand === 'attested').length;
  const accountableCount = regional.filter(
    r => r.accountabilityBand === 'accountable' || r.accountabilityBand === 'attested',
  ).length;
  const avgAccountabilityScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.accountabilityScore, 0) / regional.length;

  const counts: Record<TransitionAccountabilityBand, number> = {
    opaque: 0,
    disclosed: 0,
    accountable: 0,
    attested: 0,
  };
  for (const r of regional) counts[r.accountabilityBand] += 1;

  let dominantBand: TransitionAccountabilityBand = 'opaque';
  let max = -1;
  for (const b of [...ACC_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalAccountabilityPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.accountabilityBand === 'attested'
              ? 1
              : r.accountabilityBand === 'accountable'
                ? 0.44
                : r.accountabilityBand === 'disclosed'
                  ? 0.12
                  : 0.006;
          return acc + w * r.accountabilityScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    attestedCount,
    accountableCount,
    avgAccountabilityScore: Math.round(avgAccountabilityScore * 1000) / 1000,
    regionalAccountabilityPressure: Math.round(regionalAccountabilityPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalAccountabilityBand(
  pressure: number,
  firmsAttested: number,
  nationalGovernanceBand: TransitionGovernanceBand,
): TransitionAccountabilityBand {
  if (firmsAttested >= 2 || nationalGovernanceBand === 'constitutional' || pressure > 0.98) {
    return 'attested';
  }
  if (firmsAttested >= 1 || nationalGovernanceBand === 'governed' || pressure > 0.84) {
    return 'accountable';
  }
  if (nationalGovernanceBand === 'guided' || pressure > 0.62) return 'disclosed';
  return 'opaque';
}

export function computeNationalAccountabilityPressure(
  rows: FirmProductionTransitionAccountability[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.accountabilityBand === 'attested'
        ? 1
        : r.accountabilityBand === 'accountable'
          ? 0.38
          : r.accountabilityBand === 'disclosed'
            ? 0.06
            : 0.002;
    return acc + bandW * 0.28 + r.accountabilityScore * 0.72;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionAccountability(params: {
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
}): NationalProductionTransitionAccountability {
  const governance =
    params.governance ??
    computeNationalProductionTransitionGovernance({
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
    });

  const firmAccountabilities = governance.firmGovernances
    .map(buildFirmProductionTransitionAccountability)
    .sort((a, b) => b.accountabilityRank - a.accountabilityRank);

  const regionIds = [...new Set(firmAccountabilities.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionAccountability(rid, firmAccountabilities));

  const nationalAccountabilityPressure = computeNationalAccountabilityPressure(firmAccountabilities);
  const firmsAttested = firmAccountabilities.filter(r => r.accountabilityBand === 'attested').length;
  const nationalAccountabilityBand = classifyNationalAccountabilityBand(
    nationalAccountabilityPressure,
    firmsAttested,
    governance.nationalGovernanceBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_ACCOUNTABILITY_SCHEMA_VERSION,
    turn: params.turn,
    governanceTurn: governance.turn,
    nationalAccountabilityPressure,
    nationalAccountabilityBand,
    firmsAttested,
    firmAccountabilities,
    regions,
  };
}

export function runAgent08TransitionAccountabilitySelfTests(): Array<{
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

  check('a08_accountability_01', () => {
    const row = buildFirmProductionTransitionAccountability({
      companyId: 'f1',
      regionId: 'NSW',
      governanceBand: 'constitutional',
      stewardshipBand: 'custodial',
      governedLever: 'relieve_upstream',
      turnsToConstitutional: 1,
      governanceScore: 0.999,
      governanceRank: 2450,
      governanceSummary: 's',
    });
    return row.accountabilityBand === 'attested' && row.accountableLever === 'relieve_upstream';
  });

  check('a08_accountability_02', () => {
    const row = buildFirmProductionTransitionAccountability({
      companyId: 'f2',
      regionId: 'VIC',
      governanceBand: 'informal',
      stewardshipBand: 'neglected',
      governedLever: 'sector_rebalance',
      turnsToConstitutional: 80,
      governanceScore: 0.01,
      governanceRank: 200,
      governanceSummary: 's',
    });
    return row.accountabilityBand === 'opaque';
  });

  check('a08_accountability_03', () => {
    const summary = summarizeRegionalTransitionAccountability('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        accountabilityBand: 'attested',
        governanceBand: 'constitutional',
        accountableLever: 'capacity_buffer',
        turnsToAttest: 1,
        accountabilityScore: 0.998,
        accountabilityRank: 2500,
        accountabilitySummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        accountabilityBand: 'opaque',
        governanceBand: 'informal',
        accountableLever: 'sector_rebalance',
        turnsToAttest: 84,
        accountabilityScore: 0.01,
        accountabilityRank: 230,
        accountabilitySummary: 's',
      },
    ]);
    return summary.attestedCount === 1 && summary.dominantBand === 'attested';
  });

  check('a08_accountability_04', () => {
    const band = classifyNationalAccountabilityBand(0.88, 1, 'governed');
    return band === 'accountable';
  });

  check('a08_accountability_05', () => {
    const accountability = computeNationalProductionTransitionAccountability({
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
      accountability.schemaVersion === AGENT08_TRANSITION_ACCOUNTABILITY_SCHEMA_VERSION &&
      accountability.firmAccountabilities.length >= 1 &&
      accountability.nationalAccountabilityPressure >= 0 &&
      accountability.nationalAccountabilityPressure <= 1
    );
  });

  return results;
}
