/**
 * Agent 08 round 47 (O10-225) — transition veneration posture from commemoration bands.
 * Non-authoritative planning layer (veneration bands, not ledger enforcement).
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
import type { NationalProductionTransitionPrecedence } from './production-transition-precedence';
import type { NationalProductionTransitionRatification } from './production-transition-ratification';
import type { NationalProductionTransitionConfirmation } from './production-transition-confirmation';
import type { NationalProductionTransitionFinalization } from './production-transition-finalization';
import type { NationalProductionTransitionClosure } from './production-transition-closure';
import type { NationalProductionTransitionCompletion } from './production-transition-completion';
import type { NationalProductionTransitionResolution } from './production-transition-resolution';
import type { NationalProductionTransitionSettlement } from './production-transition-settlement';
import type { NationalProductionTransitionRetirement } from './production-transition-retirement';
import type { NationalProductionTransitionLegacy } from './production-transition-legacy';
import {
  computeNationalProductionTransitionCommemoration,
  type FirmProductionTransitionCommemoration,
  type NationalProductionTransitionCommemoration,
  type TransitionCommemorationBand,
} from './production-transition-commemoration';

export const AGENT08_TRANSITION_VENERATION_SCHEMA_VERSION = '1.0.0';

export type TransitionVenerationBand = 'muted' | 'revered' | 'venerated' | 'canonized';

export interface FirmProductionTransitionVeneration {
  companyId: string;
  regionId: string;
  venerationBand: TransitionVenerationBand;
  commemorationBand: TransitionCommemorationBand;
  veneratedLever: ProductionRecoveryLever;
  turnsToCanonized: number;
  venerationScore: number;
  venerationRank: number;
  venerationSummary: string;
}

export interface RegionalTransitionVenerationSummary {
  regionId: string;
  firmCount: number;
  canonizedCount: number;
  veneratedCount: number;
  avgVenerationScore: number;
  regionalVenerationPressure: number;
  dominantBand: TransitionVenerationBand;
}

export interface NationalProductionTransitionVeneration {
  schemaVersion: typeof AGENT08_TRANSITION_VENERATION_SCHEMA_VERSION;
  turn: number;
  commemorationTurn: number;
  nationalVenerationPressure: number;
  nationalVenerationBand: TransitionVenerationBand;
  firmsCanonized: number;
  firmVenerations: FirmProductionTransitionVeneration[];
  regions: RegionalTransitionVenerationSummary[];
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const VENER_BAND_ORDER: TransitionVenerationBand[] = ['muted', 'revered', 'venerated', 'canonized'];

function venerationBandFromCommemoration(
  commemoration: FirmProductionTransitionCommemoration,
): TransitionVenerationBand {
  switch (commemoration.commemorationBand) {
    case 'sanctified':
      return 'canonized';
    case 'commemorated':
      return 'venerated';
    case 'observed':
      return 'revered';
    default:
      return 'muted';
  }
}

function venerationScoreFromSignals(
  band: TransitionVenerationBand,
  commemoration: FirmProductionTransitionCommemoration,
): number {
  const bandBase =
    band === 'canonized' ? 0.999 : band === 'venerated' ? 0.985 : band === 'revered' ? 0.71 : 0.001;
  const legacyAdj = commemoration.commemorationScore * 0.024;
  const urgencyAdj =
    commemoration.commemorationBand === 'sanctified'
      ? 0.009
      : commemoration.commemorationBand === 'commemorated'
        ? 0.002
        : commemoration.commemorationBand === 'observed'
          ? 0.001
          : 0;
  return clamp(Math.round((bandBase + legacyAdj + urgencyAdj) * 1000) / 1000, 0, 1);
}

export function buildFirmProductionTransitionVeneration(
  commemoration: FirmProductionTransitionCommemoration,
): FirmProductionTransitionVeneration {
  const venerationBand = venerationBandFromCommemoration(commemoration);
  const venerationScore = venerationScoreFromSignals(venerationBand, commemoration);
  const rankBase =
    venerationBand === 'canonized'
      ? 4300
      : venerationBand === 'venerated'
        ? 3000
        : venerationBand === 'revered'
          ? 1400
          : 60;
  const venerationRank = Math.round(
    rankBase + commemoration.commemorationRank * 0.028 + venerationScore * 36,
  );

  const leverLabel = commemoration.commemoratedLever.replace(/_/g, ' ');
  const venerationSummary =
    venerationBand === 'canonized'
      ? `canonized ${leverLabel} veneration after ${commemoration.turnsToSanctified} sanctified turns`
      : venerationBand === 'venerated'
        ? `venerated ${leverLabel} from ${commemoration.commemorationBand} commemoration`
        : venerationBand === 'revered'
          ? `revered ${leverLabel} while commemoration is observed`
          : `muted — ${commemoration.commemorationSummary}`;

  const turnsToCanonized =
    venerationBand === 'canonized'
      ? Math.max(1, Math.min(commemoration.turnsToSanctified, 1))
      : venerationBand === 'venerated'
        ? Math.max(1, commemoration.turnsToSanctified + 1)
        : venerationBand === 'revered'
          ? commemoration.turnsToSanctified + 2
          : commemoration.turnsToSanctified + 5;

  return {
    companyId: commemoration.companyId,
    regionId: commemoration.regionId,
    venerationBand,
    commemorationBand: commemoration.commemorationBand,
    veneratedLever: commemoration.commemoratedLever,
    turnsToCanonized,
    venerationScore,
    venerationRank,
    venerationSummary,
  };
}

export function summarizeRegionalTransitionVeneration(
  regionId: string,
  rows: FirmProductionTransitionVeneration[],
): RegionalTransitionVenerationSummary {
  const regional = rows.filter(r => r.regionId === regionId);
  const canonizedCount = regional.filter(r => r.venerationBand === 'canonized').length;
  const veneratedCount = regional.filter(
    r => r.venerationBand === 'venerated' || r.venerationBand === 'canonized',
  ).length;
  const avgVenerationScore =
    regional.length === 0
      ? 0
      : regional.reduce((a, r) => a + r.venerationScore, 0) / regional.length;

  const counts: Record<TransitionVenerationBand, number> = {
    muted: 0,
    revered: 0,
    venerated: 0,
    canonized: 0,
  };
  for (const r of regional) counts[r.venerationBand] += 1;

  let dominantBand: TransitionVenerationBand = 'muted';
  let max = -1;
  for (const b of [...VENER_BAND_ORDER].reverse()) {
    if (counts[b] > max) {
      max = counts[b];
      dominantBand = b;
    }
  }

  const regionalVenerationPressure =
    regional.length === 0
      ? 0
      : regional.reduce((acc, r) => {
          const w =
            r.venerationBand === 'canonized'
              ? 1
              : r.venerationBand === 'venerated'
                ? 0.25
                : r.venerationBand === 'revered'
                  ? 0.024
                  : 0.00006;
          return acc + w * r.venerationScore;
        }, 0) / regional.length;

  return {
    regionId,
    firmCount: regional.length,
    canonizedCount,
    veneratedCount,
    avgVenerationScore: Math.round(avgVenerationScore * 1000) / 1000,
    regionalVenerationPressure: Math.round(regionalVenerationPressure * 1000) / 1000,
    dominantBand,
  };
}

export function classifyNationalVenerationBand(
  pressure: number,
  firmsCanonized: number,
  nationalCommemorationBand: TransitionCommemorationBand,
): TransitionVenerationBand {
  if (firmsCanonized >= 2 || nationalCommemorationBand === 'sanctified' || pressure > 0.999999)
    return 'canonized';
  if (firmsCanonized >= 1 || nationalCommemorationBand === 'commemorated' || pressure > 0.992)
    return 'venerated';
  if (nationalCommemorationBand === 'observed' || pressure > 0.79) return 'revered';
  return 'muted';
}

export function computeNationalVenerationPressure(
  rows: FirmProductionTransitionVeneration[],
): number {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce((acc, r) => {
    const bandW =
      r.venerationBand === 'canonized'
        ? 1
        : r.venerationBand === 'venerated'
          ? 0.22
          : r.venerationBand === 'revered'
            ? 0.011
            : 0.000009;
    return acc + bandW * 0.11 + r.venerationScore * 0.89;
  }, 0);
  return clamp(Math.round((weighted / rows.length) * 1000) / 1000, 0, 1);
}

export function computeNationalProductionTransitionVeneration(params: {
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
  ratification?: NationalProductionTransitionRatification;
  confirmation?: NationalProductionTransitionConfirmation;
  finalization?: NationalProductionTransitionFinalization;
  closure?: NationalProductionTransitionClosure;
  completion?: NationalProductionTransitionCompletion;
  resolution?: NationalProductionTransitionResolution;
  settlement?: NationalProductionTransitionSettlement;
  retirement?: NationalProductionTransitionRetirement;
  legacy?: NationalProductionTransitionLegacy;
  commemoration?: NationalProductionTransitionCommemoration;
}): NationalProductionTransitionVeneration {
  const commemoration =
    params.commemoration ??
    computeNationalProductionTransitionCommemoration({
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
      precedence: params.precedence,
      ratification: params.ratification,
      confirmation: params.confirmation,
      finalization: params.finalization,
      closure: params.closure,
      completion: params.completion,
      resolution: params.resolution,
      settlement: params.settlement,
      retirement: params.retirement,
      legacy: params.legacy,
    });

  const firmVenerations = commemoration.firmCommemorations
    .map(buildFirmProductionTransitionVeneration)
    .sort((a, b) => b.venerationRank - a.venerationRank);

  const regionIds = [...new Set(firmVenerations.map(r => r.regionId))];
  const regions = regionIds.map(rid => summarizeRegionalTransitionVeneration(rid, firmVenerations));

  const nationalVenerationPressure = computeNationalVenerationPressure(firmVenerations);
  const firmsCanonized = firmVenerations.filter(r => r.venerationBand === 'canonized').length;
  const nationalVenerationBand = classifyNationalVenerationBand(
    nationalVenerationPressure,
    firmsCanonized,
    commemoration.nationalCommemorationBand,
  );

  return {
    schemaVersion: AGENT08_TRANSITION_VENERATION_SCHEMA_VERSION,
    turn: params.turn,
    commemorationTurn: commemoration.turn,
    nationalVenerationPressure,
    nationalVenerationBand,
    firmsCanonized,
    firmVenerations,
    regions,
  };
}
export function runAgent08TransitionVenerationSelfTests(): Array<{
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

    check('a08_veneration_01', () => {
    const row = buildFirmProductionTransitionVeneration({
      companyId: 'f1',
      regionId: 'NSW',
      commemorationBand: 'sanctified',
      remembranceBand: 'eternal',
      commemoratedLever: 'relieve_upstream',
      turnsToSanctified: 1,
      commemorationScore: 0.999,
      commemorationRank: 4200,
      commemorationSummary: 's',
    });
    return row.venerationBand === 'canonized' && row.veneratedLever === 'relieve_upstream';
  });

  check('a08_veneration_02', () => {
    const row = buildFirmProductionTransitionVeneration({
      companyId: 'f2',
      regionId: 'VIC',
      commemorationBand: 'private',
      remembranceBand: 'faint',
      commemoratedLever: 'sector_rebalance',
      turnsToSanctified: 122,
      commemorationScore: 0.001,
      commemorationRank: 55,
      commemorationSummary: 's',
    });
    return row.venerationBand === 'muted';
  });

  check('a08_veneration_03', () => {
    const summary = summarizeRegionalTransitionVeneration('QLD', [
      {
        companyId: 'a',
        regionId: 'QLD',
        venerationBand: 'canonized',
        commemorationBand: 'sanctified',
        veneratedLever: 'capacity_buffer',
        turnsToCanonized: 1,
        venerationScore: 0.998,
        venerationRank: 4300,
        venerationSummary: 's',
      },
      {
        companyId: 'b',
        regionId: 'QLD',
        venerationBand: 'muted',
        commemorationBand: 'private',
        veneratedLever: 'sector_rebalance',
        turnsToCanonized: 126,
        venerationScore: 0.001,
        venerationRank: 60,
        venerationSummary: 's',
      },
    ]);
    return summary.canonizedCount === 1 && summary.dominantBand === 'canonized';
  });

  check('a08_veneration_04', () => {
    const band = classifyNationalVenerationBand(0.996, 1, 'commemorated');
    return band === 'venerated';
  });

  check('a08_veneration_05', () => {
    const veneration = computeNationalProductionTransitionVeneration({
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
      veneration.schemaVersion === AGENT08_TRANSITION_VENERATION_SCHEMA_VERSION &&
      veneration.firmVenerations.length >= 1 &&
      veneration.nationalVenerationPressure >= 0 &&
      veneration.nationalVenerationPressure <= 1
    );
  });

  return results;
}
