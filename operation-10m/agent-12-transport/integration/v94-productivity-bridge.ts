import type { AuRegionCode, NationalTransportProductivityReport, V94ProjectSnapshot } from '../types.ts';
import { getAgent12TransportCatalog, getDefaultOperationalAssetIds } from '../catalog/all-catalog.ts';
import { computeNationalTransportProductivity } from '../productivity/compute-national-productivity.ts';

export const AGENT12_CATALOG_VERSION = '2026-10-29.1';

const ACTIVE_STATUSES = new Set(['active', 'upgraded', 'under_construction']);

/** Canonical project types Agent 12 treats as transport productivity levers. */
export const AGENT12_TRANSPORT_PROJECT_TYPES = new Set([
  'high_speed_rail',
  'inland_rail_hub',
  'freight_rail_upgrade',
  'remote_logistics_base',
  'automated_port',
  'port_expansion',
]);

/**
 * Merges baseline catalog operations with boosts when matching V9.4 infra projects are active.
 * Linked catalog assets receive activeProjectIds boost inside the productivity engine.
 */
export function deriveOperationalAssetsFromProjects(
  projects: V94ProjectSnapshot[],
  turn: number,
  options?: {
    includeBaselineCatalog?: boolean;
    networkUtilization?: Partial<Record<'freight' | 'trade' | 'mobility', number>>;
  },
): NationalTransportProductivityReport {
  const activeProjectIds = new Set<string>();
  for (const p of projects) {
    if (!ACTIVE_STATUSES.has(p.status)) continue;
    if (!AGENT12_TRANSPORT_PROJECT_TYPES.has(p.projectType)) continue;
    activeProjectIds.add(p.id);
  }

  const operationalAssetIds = options?.includeBaselineCatalog === false
    ? new Set<string>()
    : getDefaultOperationalAssetIds();

  // When a project completes, ensure its linked catalog asset is counted even if baseline disabled.
  const catalog = getAgent12TransportCatalog();
  for (const asset of catalog) {
    if (asset.linkedProjectId && activeProjectIds.has(asset.linkedProjectId)) {
      operationalAssetIds.add(asset.id);
    }
  }

  return computeNationalTransportProductivity({
    turn,
    assets: catalog,
    operationalAssetIds,
    activeProjectIds,
    networkUtilization: options?.networkUtilization,
  });
}

/**
 * Maps Agent 12 regional productivity bonuses into V10.14-style regional productivity index deltas
 * (additive points per region, capped).
 */
export function mapReportToMacroProductivityDeltas(
  report: NationalTransportProductivityReport,
): Record<AuRegionCode, { productivityIndexDelta: number; logisticsCostMultiplier: number }> {
  const out = {} as Record<AuRegionCode, { productivityIndexDelta: number; logisticsCostMultiplier: number }>;
  for (const [regionId, regional] of Object.entries(report.byRegion)) {
    out[regionId as AuRegionCode] = {
      productivityIndexDelta: Math.min(18, regional.productivityIndexBonus),
      logisticsCostMultiplier: regional.logisticsCostMultiplier,
    };
  }
  return out;
}

export function integrationContractSummary(): string {
  return [
    'Agent 12 transport productivity bridge',
    `catalogVersion=${AGENT12_CATALOG_VERSION}`,
    `projectTypes=${[...AGENT12_TRANSPORT_PROJECT_TYPES].join(',')}`,
    'assemblyAnchor=SECTION 20U / V10.14 macro productivity inputs',
  ].join(' | ');
}
