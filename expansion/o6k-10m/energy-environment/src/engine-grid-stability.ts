import type {
  V1014EnergyDepthGridNodeCatalogEntry,
  V1014EnergyDepthRegionalSlice,
  V1014EnergyDepthRegionId,
} from './types';
import { V1014_ENERGY_DEPTH_bandGrid, V1014_ENERGY_DEPTH_clamp } from './primitives';
import { V1014_ENERGY_DEPTH_GRID_NODE_CATALOG } from './catalog/grid-nodes';

function V1014_ENERGY_DEPTH_nodeRenewableFactor(n: V1014EnergyDepthGridNodeCatalogEntry): number {
  const r = n.renewableCapacityMw / (n.firmCapacityMw + n.renewableCapacityMw + 1);
  return V1014_ENERGY_DEPTH_clamp(0.12 + r * 0.55, 0.05, 0.92);
}

export function V1014_ENERGY_DEPTH_lookupGridNodes(
  regionId: V1014EnergyDepthRegionId,
  hourBucket: number,
): V1014EnergyDepthGridNodeCatalogEntry[] {
  return V1014_ENERGY_DEPTH_GRID_NODE_CATALOG.filter(
    n => n.regionId === regionId && n.hourBucket === hourBucket % 24,
  );
}

export function V1014_ENERGY_DEPTH_computeRegionalGridBalance(
  regionId: V1014EnergyDepthRegionId,
  hourBucket: number,
  renewableShareBoost: number,
  infraSpare: number,
): Pick<
  V1014EnergyDepthRegionalSlice,
  'loadMw' | 'generationMw' | 'reserveMarginPct' | 'gridBand' | 'renewableShare'
> {
  const nodes = V1014_ENERGY_DEPTH_lookupGridNodes(regionId, hourBucket);
  let load = 0;
  let gen = 0;
  let renewCap = 0;
  let firm = 0;
  for (const n of nodes) {
    const cf = V1014_ENERGY_DEPTH_nodeRenewableFactor(n);
    load += n.baseLoadMw;
    firm += n.firmCapacityMw + n.storageMw * 0.85;
    renewCap += n.renewableCapacityMw * cf;
    gen += n.firmCapacityMw + n.storageMw * 0.6 + n.transmissionImportMw;
    gen += n.renewableCapacityMw * cf * (0.9 + renewableShareBoost * 0.1);
  }
  const renewableShare = load > 0 ? V1014_ENERGY_DEPTH_clamp(renewCap / (load + 1), 0, 1) : 0;
  const reserveTarget =
    nodes.length > 0
      ? nodes.reduce((s, n) => s + n.reserveTargetPct, 0) / nodes.length
      : 12;
  const spare = V1014_ENERGY_DEPTH_clamp(infraSpare, 0, 1);
  const effectiveGen = gen * (0.92 + spare * 0.08);
  const reserveMarginPct = load > 0 ? ((effectiveGen - load) / load) * 100 : firm > 0 ? 20 : 0;
  const adjustedMargin = reserveMarginPct - (1 - renewableShare) * 3 + reserveTarget * 0.05;
  const gridBand = V1014_ENERGY_DEPTH_bandGrid(adjustedMargin);
  return {
    loadMw: Math.round(load),
    generationMw: Math.round(effectiveGen),
    reserveMarginPct: Math.round(adjustedMargin * 10) / 10,
    gridBand,
    renewableShare,
  };
}

export function V1014_ENERGY_DEPTH_aggregateNationalGridBand(
  regions: Record<V1014EnergyDepthRegionId, V1014EnergyDepthRegionalSlice>,
): V1014EnergyDepthRegionalSlice['gridBand'] {
  const rank = { secure: 5, comfortable: 4, strained: 3, critical: 2, blackout_risk: 1 };
  let worst: V1014EnergyDepthRegionalSlice['gridBand'] = 'secure';
  for (const r of Object.values(regions)) {
    if (rank[r.gridBand] < rank[worst]) worst = r.gridBand;
  }
  return worst;
}
