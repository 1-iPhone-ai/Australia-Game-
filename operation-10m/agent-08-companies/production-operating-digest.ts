/**
 * Agent 08 round 13 — national operating digest from priorities and reconciliation posture.
 * Non-authoritative executive summary layer for private-sector production planning.
 */

import type { NationalPrivateSectorState } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, LivingRegionsState, NationalWorkforceState } from './upstream-stubs';
import type { Agent08FiscalRegionSlice } from './tax-labor-capacity-linkage';
import type { NationalIntegratedProductionBrief } from './integrated-production-synthesis';
import type { NationalProductionCoordinationMandate } from './production-coordination-mandate';
import type { NationalProductionMandateCompliance } from './production-mandate-compliance';
import {
  computeNationalProductionOperatingPriorities,
  type FirmProductionOperatingPriority,
  type NationalProductionOperatingPriorities,
  type OperatingPriorityBand,
  type RegionalProductionOperatingSummary,
} from './production-operating-priorities';
import type { CapacityReconciliationBand } from './production-capacity-reconciliation';

export const AGENT08_OPERATING_DIGEST_SCHEMA_VERSION = '1.0.0';

export type NationalOperatingPostureBand = 'stable' | 'managed' | 'stressed' | 'critical';

export interface FirmOperatingDigestEntry {
  companyId: string;
  regionId: string;
  postureSlice: 'core' | 'watch' | 'action';
  priorityBand: OperatingPriorityBand;
  reconciliationBand: CapacityReconciliationBand;
  digestRank: number;
  headline: string;
}

export interface RegionalOperatingDigestSlice {
  regionId: string;
  postureBand: NationalOperatingPostureBand;
  actionFirmCount: number;
  watchFirmCount: number;
  coreFirmCount: number;
  avgOperatingPressure: number;
  digestNote: string;
}

export interface NationalProductionOperatingDigest {
  schemaVersion: typeof AGENT08_OPERATING_DIGEST_SCHEMA_VERSION;
  turn: number;
  prioritiesTurn: number;
  nationalPostureBand: NationalOperatingPostureBand;
  nationalOperatingPressure: number;
  interventionQueueSize: number;
  watchlistSize: number;
  stableCoreSize: number;
  firmEntries: FirmOperatingDigestEntry[];
  regions: RegionalOperatingDigestSlice[];
  highestPressureRegionId: string | null;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

function postureSliceFromPriority(priority: FirmProductionOperatingPriority): FirmOperatingDigestEntry['postureSlice'] {
  if (priority.priorityBand === 'intervene' || priority.priorityBand === 'escalate') return 'action';
  if (priority.priorityBand === 'monitor') return 'watch';
  return 'core';
}

function digestHeadline(priority: FirmProductionOperatingPriority): string {
  const slice = postureSliceFromPriority(priority);
  if (slice === 'core') return 'stable operating slice — maintain course';
  if (slice === 'watch') return `watch — ${priority.kind.replace(/_/g, ' ')}`;
  return priority.prioritySummary;
}

export function buildFirmOperatingDigestEntry(
  priority: FirmProductionOperatingPriority,
): FirmOperatingDigestEntry {
  const postureSlice = postureSliceFromPriority(priority);
  const digestRank =
    priority.priorityRank +
    (postureSlice === 'action' ? 200 : postureSlice === 'watch' ? 80 : 0) +
    (priority.reconciliationBand === 'conflict' ? 150 : priority.reconciliationBand === 'drift' ? 60 : 0);

  return {
    companyId: priority.companyId,
    regionId: priority.regionId,
    postureSlice,
    priorityBand: priority.priorityBand,
    reconciliationBand: priority.reconciliationBand,
    digestRank,
    headline: digestHeadline(priority),
  };
}

export function classifyRegionalOperatingPosture(
  summary: RegionalProductionOperatingSummary,
): NationalOperatingPostureBand {
  if (summary.interveneCount >= 2 || summary.avgOperatingPressure > 0.72) return 'critical';
  if (summary.interveneCount >= 1 || summary.escalateCount >= 2 || summary.avgOperatingPressure > 0.55) {
    return 'stressed';
  }
  if (summary.escalateCount >= 1 || summary.monitorCount >= 2 || summary.avgOperatingPressure > 0.35) {
    return 'managed';
  }
  return 'stable';
}

export function summarizeRegionalOperatingDigest(
  regionId: string,
  firmEntries: FirmOperatingDigestEntry[],
  operatingSummary: RegionalProductionOperatingSummary | undefined,
): RegionalOperatingDigestSlice {
  const regional = firmEntries.filter(e => e.regionId === regionId);
  const actionFirmCount = regional.filter(e => e.postureSlice === 'action').length;
  const watchFirmCount = regional.filter(e => e.postureSlice === 'watch').length;
  const coreFirmCount = regional.filter(e => e.postureSlice === 'core').length;
  const avgOperatingPressure = operatingSummary?.avgOperatingPressure ?? 0;
  const postureBand = operatingSummary
    ? classifyRegionalOperatingPosture(operatingSummary)
    : actionFirmCount >= 1
      ? 'stressed'
      : watchFirmCount >= 1
        ? 'managed'
        : 'stable';

  const digestNote =
    postureBand === 'critical'
      ? `${regionId}: critical — ${actionFirmCount} firms in action queue`
      : postureBand === 'stressed'
        ? `${regionId}: stressed — escalate operating attention`
        : postureBand === 'managed'
          ? `${regionId}: managed drift — monitor watchlist`
          : `${regionId}: stable private production posture`;

  return {
    regionId,
    postureBand,
    actionFirmCount,
    watchFirmCount,
    coreFirmCount,
    avgOperatingPressure,
    digestNote,
  };
}

export function classifyNationalOperatingPosture(params: {
  nationalOperatingPressure: number;
  interventionQueueSize: number;
  watchlistSize: number;
  regions: RegionalOperatingDigestSlice[];
}): NationalOperatingPostureBand {
  const criticalRegions = params.regions.filter(r => r.postureBand === 'critical').length;
  const stressedRegions = params.regions.filter(r => r.postureBand === 'stressed').length;

  if (criticalRegions >= 1 || params.interventionQueueSize >= 3 || params.nationalOperatingPressure > 0.68) {
    return 'critical';
  }
  if (
    params.interventionQueueSize >= 1 ||
    stressedRegions >= 1 ||
    params.nationalOperatingPressure > 0.48 ||
    params.watchlistSize >= 4
  ) {
    return 'stressed';
  }
  if (params.watchlistSize >= 1 || params.nationalOperatingPressure > 0.28) {
    return 'managed';
  }
  return 'stable';
}

export function computeNationalProductionOperatingDigest(params: {
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
  priorities?: NationalProductionOperatingPriorities;
}): NationalProductionOperatingDigest {
  const priorities =
    params.priorities ??
    computeNationalProductionOperatingPriorities({
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
    });

  const summaryByRegion = new Map(priorities.regions.map(r => [r.regionId, r] as const));

  const firmEntries = priorities.firmPriorities
    .map(buildFirmOperatingDigestEntry)
    .sort((a, b) => b.digestRank - a.digestRank);

  const regionIds = [...new Set(firmEntries.map(e => e.regionId))];
  const regions = regionIds.map(rid =>
    summarizeRegionalOperatingDigest(rid, firmEntries, summaryByRegion.get(rid)),
  );

  const interventionQueueSize = firmEntries.filter(e => e.postureSlice === 'action').length;
  const watchlistSize = firmEntries.filter(e => e.postureSlice === 'watch').length;
  const stableCoreSize = firmEntries.filter(e => e.postureSlice === 'core').length;

  const nationalPostureBand = classifyNationalOperatingPosture({
    nationalOperatingPressure: priorities.nationalOperatingPressure,
    interventionQueueSize,
    watchlistSize,
    regions,
  });

  const highestPressureRegionId =
    regions.length === 0
      ? null
      : regions.reduce(
          (max, r) => (r.avgOperatingPressure > max.avgOperatingPressure ? r : max),
          regions[0],
        ).regionId;

  return {
    schemaVersion: AGENT08_OPERATING_DIGEST_SCHEMA_VERSION,
    turn: params.turn,
    prioritiesTurn: priorities.turn,
    nationalPostureBand,
    nationalOperatingPressure: priorities.nationalOperatingPressure,
    interventionQueueSize,
    watchlistSize,
    stableCoreSize,
    firmEntries,
    regions,
    highestPressureRegionId,
  };
}

export function runAgent08OperatingDigestSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_digest_01', () => {
    const entry = buildFirmOperatingDigestEntry({
      companyId: 'f1',
      regionId: 'NSW',
      priorityBand: 'intervene',
      kind: 'relieve_capacity_bind',
      suggestedLever: 'relieve_upstream',
      priorityRank: 1100,
      reconciliationBand: 'conflict',
      operatingPressure: 0.8,
      prioritySummary: 'intervene now',
    });
    return entry.postureSlice === 'action' && entry.digestRank > 1100;
  });

  check('a08_digest_02', () => {
    const posture = classifyRegionalOperatingPosture({
      regionId: 'VIC',
      firmCount: 3,
      interveneCount: 2,
      escalateCount: 0,
      monitorCount: 1,
      avgOperatingPressure: 0.75,
      dominantPriorityBand: 'intervene',
      topLever: 'relieve_upstream',
    });
    return posture === 'critical';
  });

  check('a08_digest_03', () => {
    const national = classifyNationalOperatingPosture({
      nationalOperatingPressure: 0.3,
      interventionQueueSize: 0,
      watchlistSize: 2,
      regions: [
        {
          regionId: 'QLD',
          postureBand: 'managed',
          actionFirmCount: 0,
          watchFirmCount: 2,
          coreFirmCount: 1,
          avgOperatingPressure: 0.32,
          digestNote: 'n',
        },
      ],
    });
    return national === 'managed';
  });

  check('a08_digest_04', () => {
    const slice = summarizeRegionalOperatingDigest(
      'SA',
      [
        {
          companyId: 'a',
          regionId: 'SA',
          postureSlice: 'watch',
          priorityBand: 'monitor',
          reconciliationBand: 'drift',
          digestRank: 400,
          headline: 'h',
        },
        {
          companyId: 'b',
          regionId: 'SA',
          postureSlice: 'core',
          priorityBand: 'defer',
          reconciliationBand: 'aligned',
          digestRank: 100,
          headline: 'h',
        },
      ],
      undefined,
    );
    return slice.watchFirmCount === 1 && slice.coreFirmCount === 1 && slice.postureBand === 'managed';
  });

  check('a08_digest_05', () => {
    const digest = computeNationalProductionOperatingDigest({
      turn: 4,
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
            links: [
              {
                id: 'lk',
                fromRegionId: 'QLD',
                toRegionId: 'NSW',
                supply: 'energy',
                strength: 85,
                fragile: true,
                reason: 'dep',
              },
            ],
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
          QLD: {
            regionId: 'QLD',
            name: 'QLD',
            maturity: 'forming',
            anchorArchetype: 'energy',
            companyCount: 0,
            activeProduction: 12,
            supplyChainRole: 'provider',
            resilience: 'exposed',
            primaryConstraint: 'energy',
            revision: 1,
            links: [],
            companies: [],
          },
        },
        national: {
          leadingRegions: [],
          constrainedRegions: ['QLD'],
          dominantArchetypes: [],
          criticalDependencies: [],
          ecosystemOpportunity: null,
          ecosystemRisk: null,
          totalCompanies: 1,
          avgVitality: 1,
        },
        history: [],
        lastUpdatedTurn: 4,
        inputHash: 's',
        computeMs: 0,
      },
      livingRegions: {
        revision: 1,
        regions: { NSW: { momentum: { band: 'softening' }, sectors: { manufacturing: 70 } } },
      },
      industries: {
        revision: 1,
        regions: {
          QLD: {
            regionId: 'QLD',
            industries: {
              energy: {
                industry: 'energy',
                strength: 16,
                effectiveOutput: 7,
                utilization: 0.22,
                constraint: { kind: 'production_constraint' },
                outputs: [{ supply: 'energy', amount: 7 }],
              },
            },
            suppliedBy: [],
            primaryIndustrialConstraint: 'energy',
            resilience: 'exposed',
          },
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
      digest.schemaVersion === AGENT08_OPERATING_DIGEST_SCHEMA_VERSION &&
      digest.firmEntries.length >= 1 &&
      digest.interventionQueueSize + digest.watchlistSize + digest.stableCoreSize === digest.firmEntries.length
    );
  });

  return results;
}
