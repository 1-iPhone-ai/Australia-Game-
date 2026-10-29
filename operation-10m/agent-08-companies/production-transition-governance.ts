/**
 * Agent 08 round 29 (O10-189) — transition governance posture from stewardship bands.
 * Non-authoritative planning layer (governance bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionStewardship,
  type FirmProductionTransitionStewardship,
  type NationalProductionTransitionStewardship,
  type TransitionStewardshipBand,
} from './production-transition-stewardship';

export const AGENT08_TRANSITION_GOVERNANCE_SCHEMA_VERSION = '1.0.0';

export type TransitionGovernanceBand = 'informal' | 'guided' | 'governed' | 'constitutional';

export interface FirmProductionTransitionGovernance {
  companyId: string;
  regionId: string;
  governanceBand: TransitionGovernanceBand;
  stewardshipBand: TransitionStewardshipBand;
  governedLever: ProductionRecoveryLever;
  turnsToConstitutional: number;
  governanceScore: number;
  governanceRank: number;
  governanceSummary: string;
}

export interface RegionalTransitionGovernanceSummary {
  regionId: string;
  firmCount: number;
  constitutionalCount: number;
  governedCount: number;
  avgGovernanceScore: number;
  regionalGovernancePressure: number;
  dominantBand: TransitionGovernanceBand;
}

export interface NationalProductionTransitionGovernance {
  schemaVersion: typeof AGENT08_TRANSITION_GOVERNANCE_SCHEMA_VERSION;
  turn: number;
  stewardshipTurn: number;
  nationalGovernancePressure: number;
  nationalGovernanceBand: TransitionGovernanceBand;
  firmsConstitutional: number;
  firmGovernances: FirmProductionTransitionGovernance[];
  regions: RegionalTransitionGovernanceSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const GOV_BAND_ORDER: TransitionGovernanceBand[] = ['informal', 'guided', 'governed', 'constitutional'];

function governanceBandFromStewardship(stewardship: FirmProductionTransitionStewardship): TransitionGovernanceBand {
  switch (stewardship.stewardshipBand) {
    case 'custodial':
      return 'constitutional';
    case 'stewarded':
      return 'governed';
    case 'tending':
      return 'guided';
    default:
      return 'informal';
  }
}

function governanceScoreFromSignals(
  band: TransitionGovernanceBand,
  stewardship: FirmProductionTransitionStewardship,
): number {
  const bandBase =
    band === 'constitutional' ? 0.999 : band === 'governed' ? 0.83 : band === 'guided' ? 0.55 : 0.03;
  const stewardshipAdj = stewardship.stewardshipScore * 0.065;
  const urgencyAdj =
    stewardship.stewardshipBand === 'custodial'
      ? 0.028
      : stewardship.stewardshipBand === 'stewarded'
        ? 0.012
        : stewardship.stewardshipBand === 'tending'
          ? 0.004
          : 0;
  return clamp(Math.round((bandBase + stewardshipAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionGovernance(
  stewardship: FirmProductionTransitionStewardship,
): FirmProductionTransitionGovernance {
  const governanceBand = governanceBandFromStewardship(stewardship);
  const governanceScore = governanceScoreFromSignals(governanceBand, stewardship);
  const rankBase =
    governanceBand === 'constitutional'
      ? 2500
      : governanceBand === 'governed'
        ? 1580
        : governanceBand === 'guided'
          ? 920
          : 230;
  const governanceRank = Math.round(
    rankBase + stewardship.stewardshipRank * 0.08 + governanceScore * 66,
  );

  const leverLabel = stewardship.stewardedLever.replace(/_/g, ' ');
  const governanceSummary =
    governanceBand === 'constitutional'
      ? `constitutional ${leverLabel} governance after ${stewardship.turnsToCustodial} custodial turns`
      : governanceBand === 'governed'
        ? `governed ${leverLabel} from ${stewardship.stewardshipBand} stewardship`
        : governanceBand === 'guided'
          ? `guided ${leverLabel} practice while tending`
          : `informal — ${stewardship.stewardshipSummary}`;

  const turnsToConstitutional =
    governanceBand === 'constitutional'
      ? Math.max(1, Math.min(stewardship.turnsToCustodial, 1))
      : governanceBand === 'governed'
        ? Math.max(1, stewardship.turnsToCustodial + 1)
        : governanceBand === 'guided'
          ? stewardship.turnsToCustodial + 6
          : stewardship.turnsToCustodial + 16;

  return {
    companyId: stewardship.companyId,
    regionId: stewardship.regionId,
    governanceBand,
    stewardshipBand: stewardship.stewardshipBand,
    governedLever: stewardship.stewardedLever,
    turnsToConstitutional,
    governanceScore,
    governanceRank,
    governanceSummary,
  };
}

export function summarizeRegionalTransitionGovernance(
  regionId: string,
  rows: FirmProductionTransitionGovernance[],
): RegionalTransitionGovernanceSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const constitutionalCount = regional.filter(r => r.governanceBand === 'constitutional').length;
  const governedCount = regional.filter(
    r => r.governanceBand === 'governed' || r.governanceBand === 'constitutional',
  ).length;
  const avgGovernanceScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.governanceScore, 0) / regional.length;

  const counts: Record<TransitionGovernanceBand, number> = {
    informal: 0,
    guided: 0,
    governed: 0,
    constitutional: 0,
  };
  for (const r of regional) counts[r.governanceBand] += 1;

  let dominantBand: TransitionGovernanceBand = 'informal';
  let max = -1;
  for (const b of [...GOV_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalGovernancePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.governanceBand === 'constitutional'
              ? 1
              : r.governanceBand === 'governed'
                ? 0.46
                : r.governanceBand === 'guided'
                  ? 0.14
                  : 0.008;
          return acc + w * r.governanceScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    constitutionalCount,
    governedCount,
    avgGovernanceScore: Math.round(avgGovernanceScore * 1000) / 1000,
    regionalGovernancePressure: Math.round(regionalGovernancePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalGovernanceBand(
  pressure: number,
  firmsConstitutional: number,
  nationalStewardshipBand: TransitionStewardshipBand,
): TransitionGovernanceBand {
  if (firmsConstitutional >= 2 || nationalStewardshipBand === 'custodial' || pressure > 0.97) {
    return 'constitutional';
  }
  if (firmsConstitutional >= 1 || nationalStewardshipBand === 'stewarded' || pressure > 0.82) {
    return 'governed';
  }
  if (nationalStewardshipBand === 'tending' || pressure > 0.6) return 'guided';
  return 'informal';
}

export function computeNationalGovernancePressure(rows: FirmProductionTransitionGovernance[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.governanceBand === 'constitutional'
        ? 1
        : r.governanceBand === 'governed'
          ? 0.4
          : r.governanceBand === 'guided'
            ? 0.08
            : 0.004;
    return acc + bandW * 0.3 + r.governanceScore * 0.7;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionGovernance(params: {
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
}): NationalProductionTransitionGovernance {
  const stewardship =
    params.stewardship ??
    computeNationalProductionTransitionStewardship({
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
    });

  const firmGovernances = stewardship.firmStewardships
    .map(buildFirmProductionTransitionGovernance)
    .sort((a, b) => b.governanceRank - a.governanceRank);

  const regionIds = [...new Set(firmGovernances.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionGovernance(rid, firmGovernances));

  const nationalGovernancePressure = computeNationalGovernancePressure(firmGovernances);
  const firmsConstitutional = firmGovernances.filter(r => r.governanceBand === 'constitutional').length;
  const nationalGovernanceBand = classifyNationalGovernanceBand(
    nationalGovernancePressure,
    firmsConstitutional,
    stewardship.nationalStewardshipBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_GOVERNANCE_SCHEMA_VERSION,
    turn: params.turn,
    stewardshipTurn: stewardship.turn,
    nationalGovernancePressure,
    nationalGovernanceBand,
    firmsConstitutional,
    firmGovernances,
    regions,
  };
}

export function runAgent08TransitionGovernanceSelfTests(): Array<{
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

  check('a08_governance_01', () => {
    const row = buildFirmProductionTransitionGovernance({
      companyId: 'f1',
      regionId: 'NSW',
      stewardshipBand: 'custodial',
      codificationBand: 'entrenched',
      stewardedLever: 'relieve_upstream',
      turnsToCustodial: 1,
      stewardshipScore: 0.999,
      stewardshipRank: 2350,
      stewardshipSummary: 's',
    });
    return row.governanceBand === 'constitutional' && row.governedLever === 'relieve_upstream';
  });

  check('a08_governance_02', () => {
    const row = buildFirmProductionTransitionGovernance({
      companyId: 'f2',
      regionId: 'VIC',
      stewardshipBand: 'neglected',
      codificationBand: 'draft',
      stewardedLever: 'sector_rebalance',
      turnsToCustodial: 74,
      stewardshipScore: 0.02,
      stewardshipRank: 190,
      stewardshipSummary: 's',
    });
    return row.governanceBand === 'informal';
  });

  check('a08_governance_03', () => {
    const summary = summarizeRegionalTransitionGovernance('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        governanceBand: 'constitutional',
        stewardshipBand: 'custodial',
        governedLever: 'capacity_buffer',
        turnsToConstitutional: 1,
        governanceScore: 0.998,
        governanceRank: 2400,
        governanceSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        governanceBand: 'informal',
        stewardshipBand: 'neglected',
        governedLever: 'sector_rebalance',
        turnsToConstitutional: 78,
        governanceScore: 0.02,
        governanceRank: 220,
        governanceSummary: 's',
      },
    ]);
    return summary.constitutionalCount === 1 && summary.dominantBand === 'constitutional';
  });

  check('a08_governance_04', () => {
    const band = classifyNationalGovernanceBand(0.86, 1, 'stewarded');
    return band === 'governed';
  });

  check('a08_governance_05', () => {
    const governance = computeNationalProductionTransitionGovernance({
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
      governance.schemaVersion === AGENT08_TRANSITION_GOVERNANCE_SCHEMA_VERSION &&
      governance.firmGovernances.length >= 1 &&
      governance.nationalGovernancePressure >= 0 &&
      governance.nationalGovernancePressure <= 1
    );
  });

  return results;
}
