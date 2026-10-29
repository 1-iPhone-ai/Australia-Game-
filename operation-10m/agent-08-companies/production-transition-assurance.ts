/**
 * Agent 08 round 31 (O10-193) — transition assurance posture from accountability bands.
 * Non-authoritative planning layer (assurance bands, not ledger enforcement).
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
import {
  computeNationalProductionTransitionAccountability,
  type FirmProductionTransitionAccountability,
  type NationalProductionTransitionAccountability,
  type TransitionAccountabilityBand,
} from './production-transition-accountability';

export const AGENT08_TRANSITION_ASSURANCE_SCHEMA_VERSION = '1.0.0';

export type TransitionAssuranceBand = 'unverified' | 'monitoring' | 'assured' | 'certified';

export interface FirmProductionTransitionAssurance {
  companyId: string;
  regionId: string;
  assuranceBand: TransitionAssuranceBand;
  accountabilityBand: TransitionAccountabilityBand;
  assuredLever: ProductionRecoveryLever;
  turnsToCertify: number;
  assuranceScore: number;
  assuranceRank: number;
  assuranceSummary: string;
}

export interface RegionalTransitionAssuranceSummary {
  regionId: string;
  firmCount: number;
  certifiedCount: number;
  assuredCount: number;
  avgAssuranceScore: number;
  regionalAssurancePressure: number;
  dominantBand: TransitionAssuranceBand;
}

export interface NationalProductionTransitionAssurance {
  schemaVersion: typeof AGENT08_TRANSITION_ASSURANCE_SCHEMA_VERSION;
  turn: number;
  accountabilityTurn: number;
  nationalAssurancePressure: number;
  nationalAssuranceBand: TransitionAssuranceBand;
  firmsCertified: number;
  firmAssurances: FirmProductionTransitionAssurance[];
  regions: RegionalTransitionAssuranceSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const ASU_BAND_ORDER: TransitionAssuranceBand[] = ['unverified', 'monitoring', 'assured', 'certified'];

function assuranceBandFromAccountability(
  accountability: FirmProductionTransitionAccountability,
): TransitionAssuranceBand {
  switch (accountability.accountabilityBand) {
    case 'attested':
      return 'certified';
    case 'accountable':
      return 'assured';
    case 'disclosed':
      return 'monitoring';
    default:
      return 'unverified';
  }
}

function assuranceScoreFromSignals(
  band: TransitionAssuranceBand,
  accountability: FirmProductionTransitionAccountability,
): number {
  const bandBase =
    band === 'certified' ? 0.999 : band === 'assured' ? 0.85 : band === 'monitoring' ? 0.57 : 0.015;
  const accountabilityAdj = accountability.accountabilityScore * 0.055;
  const urgencyAdj =
    accountability.accountabilityBand === 'attested'
      ? 0.024
      : accountability.accountabilityBand === 'accountable'
        ? 0.009
        : accountability.accountabilityBand === 'disclosed'
          ? 0.002
          : 0;
  return clamp(Math.round((bandBase + accountabilityAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionAssurance(
  accountability: FirmProductionTransitionAccountability,
): FirmProductionTransitionAssurance {
  const assuranceBand = assuranceBandFromAccountability(accountability);
  const assuranceScore = assuranceScoreFromSignals(assuranceBand, accountability);
  const rankBase =
    assuranceBand === 'certified'
      ? 2700
      : assuranceBand === 'assured'
        ? 1720
        : assuranceBand === 'monitoring'
          ? 1000
          : 250;
  const assuranceRank = Math.round(
    rankBase + accountability.accountabilityRank * 0.065 + assuranceScore * 62,
  );

  const leverLabel = accountability.accountableLever.replace(/_/g, ' ');
  const assuranceSummary =
    assuranceBand === 'certified'
      ? `certified ${leverLabel} assurance after ${accountability.turnsToAttest} attested turns`
      : assuranceBand === 'assured'
        ? `assured ${leverLabel} from ${accountability.accountabilityBand} accountability`
        : assuranceBand === 'monitoring'
          ? `monitoring ${leverLabel} signals while disclosed`
          : `unverified — ${accountability.accountabilitySummary}`;

  const turnsToCertify =
    assuranceBand === 'certified'
      ? Math.max(1, Math.min(accountability.turnsToAttest, 1))
      : assuranceBand === 'assured'
        ? Math.max(1, accountability.turnsToAttest + 1)
        : assuranceBand === 'monitoring'
          ? accountability.turnsToAttest + 6
          : accountability.turnsToAttest + 18;

  return {
    companyId: accountability.companyId,
    regionId: accountability.regionId,
    assuranceBand,
    accountabilityBand: accountability.accountabilityBand,
    assuredLever: accountability.accountableLever,
    turnsToCertify,
    assuranceScore,
    assuranceRank,
    assuranceSummary,
  };
}

export function summarizeRegionalTransitionAssurance(
  regionId: string,
  rows: FirmProductionTransitionAssurance[],
): RegionalTransitionAssuranceSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const certifiedCount = regional.filter(r => r.assuranceBand === 'certified').length;
  const assuredCount = regional.filter(
    r => r.assuranceBand === 'assured' || r.assuranceBand === 'certified',
  ).length;
  const avgAssuranceScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.assuranceScore, 0) / regional.length;

  const counts: Record<TransitionAssuranceBand, number> = {
    unverified: 0,
    monitoring: 0,
    assured: 0,
    certified: 0,
  };
  for (const r of regional) counts[r.assuranceBand] += 1;

  let dominantBand: TransitionAssuranceBand = 'unverified';
  let max = -1;
  for (const b of [...ASU_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalAssurancePressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.assuranceBand === 'certified'
              ? 1
              : r.assuranceBand === 'assured'
                ? 0.42
                : r.assuranceBand === 'monitoring'
                  ? 0.1
                  : 0.004;
          return acc + w * r.assuranceScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    certifiedCount,
    assuredCount,
    avgAssuranceScore: Math.round(avgAssuranceScore * 1000) / 1000,
    regionalAssurancePressure: Math.round(regionalAssurancePressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalAssuranceBand(
  pressure: number,
  firmsCertified: number,
  nationalAccountabilityBand: TransitionAccountabilityBand,
): TransitionAssuranceBand {
  if (firmsCertified >= 2 || nationalAccountabilityBand === 'attested' || pressure > 0.99) {
    return 'certified';
  }
  if (firmsCertified >= 1 || nationalAccountabilityBand === 'accountable' || pressure > 0.86) {
    return 'assured';
  }
  if (nationalAccountabilityBand === 'disclosed' || pressure > 0.64) return 'monitoring';
  return 'unverified';
}

export function computeNationalAssurancePressure(rows: FirmProductionTransitionAssurance[]): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.assuranceBand === 'certified'
        ? 1
        : r.assuranceBand === 'assured'
          ? 0.36
          : r.assuranceBand === 'monitoring'
            ? 0.05
            : 0.001;
    return acc + bandW * 0.26 + r.assuranceScore * 0.74;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionAssurance(params: {
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
}): NationalProductionTransitionAssurance {
  const accountability =
    params.accountability ??
    computeNationalProductionTransitionAccountability({
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
    });

  const firmAssurances = accountability.firmAccountabilities
    .map(buildFirmProductionTransitionAssurance)
    .sort((a, b) => b.assuranceRank - a.assuranceRank);

  const regionIds = [...new Set(firmAssurances.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionAssurance(rid, firmAssurances));

  const nationalAssurancePressure = computeNationalAssurancePressure(firmAssurances);
  const firmsCertified = firmAssurances.filter(r => r.assuranceBand === 'certified').length;
  const nationalAssuranceBand = classifyNationalAssuranceBand(
    nationalAssurancePressure,
    firmsCertified,
    accountability.nationalAccountabilityBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_ASSURANCE_SCHEMA_VERSION,
    turn: params.turn,
    accountabilityTurn: accountability.turn,
    nationalAssurancePressure,
    nationalAssuranceBand,
    firmsCertified,
    firmAssurances,
    regions,
  };
}

export function runAgent08TransitionAssuranceSelfTests(): Array<{
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

  check('a08_assurance_01', () => {
    const row = buildFirmProductionTransitionAssurance({
      companyId: 'f1',
      regionId: 'NSW',
      accountabilityBand: 'attested',
      governanceBand: 'constitutional',
      accountableLever: 'relieve_upstream',
      turnsToAttest: 1,
      accountabilityScore: 0.999,
      accountabilityRank: 2550,
      accountabilitySummary: 's',
    });
    return row.assuranceBand === 'certified' && row.assuredLever === 'relieve_upstream';
  });

  check('a08_assurance_02', () => {
    const row = buildFirmProductionTransitionAssurance({
      companyId: 'f2',
      regionId: 'VIC',
      accountabilityBand: 'opaque',
      governanceBand: 'informal',
      accountableLever: 'sector_rebalance',
      turnsToAttest: 86,
      accountabilityScore: 0.008,
      accountabilityRank: 210,
      accountabilitySummary: 's',
    });
    return row.assuranceBand === 'unverified';
  });

  check('a08_assurance_03', () => {
    const summary = summarizeRegionalTransitionAssurance('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        assuranceBand: 'certified',
        accountabilityBand: 'attested',
        assuredLever: 'capacity_buffer',
        turnsToCertify: 1,
        assuranceScore: 0.998,
        assuranceRank: 2600,
        assuranceSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        assuranceBand: 'unverified',
        accountabilityBand: 'opaque',
        assuredLever: 'sector_rebalance',
        turnsToCertify: 90,
        assuranceScore: 0.008,
        assuranceRank: 240,
        assuranceSummary: 's',
      },
    ]);
    return summary.certifiedCount === 1 && summary.dominantBand === 'certified';
  });

  check('a08_assurance_04', () => {
    const band = classifyNationalAssuranceBand(0.9, 1, 'accountable');
    return band === 'assured';
  });

  check('a08_assurance_05', () => {
    const assurance = computeNationalProductionTransitionAssurance({
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
      assurance.schemaVersion === AGENT08_TRANSITION_ASSURANCE_SCHEMA_VERSION &&
      assurance.firmAssurances.length >= 1 &&
      assurance.nationalAssurancePressure >= 0 &&
      assurance.nationalAssurancePressure <= 1
    );
  });

  return results;
}
