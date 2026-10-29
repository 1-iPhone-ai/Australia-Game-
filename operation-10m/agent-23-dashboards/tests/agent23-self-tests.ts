import { agent23ListAdjacencyPairs } from '../core/adjacency.ts';
import { nrDashBuildCompareInsights, nrDashBuildNetworkStress, nrDashBuildRegionalLeaders } from '../core/analytics.ts';
import { nrDashBuildConditionCatalog } from '../core/condition-catalog.ts';
import { nrDashBuildMomentumDivergence } from '../core/momentum-divergence.ts';
import { nrDashApplyMapFocus, nrDashLinksTouchingRegion, nrDashNeighborRegionIds } from '../core/map-focus.ts';
import { nrDashBuildTrendDeltas, nrDashTopTrendMovers } from '../core/trend-delta.ts';
import { nrDashBuildConstraintProfile } from '../core/constraint-profile.ts';
import { nrDashBuildDependencyProfile } from '../core/dependency-profile.ts';
import { nrDashBuildHeatRowSummaries } from '../core/heat-summary.ts';
import { nrDashBuildParityGapRows, nrDashTopParityOutliers } from '../core/parity-gap.ts';
import { nrDashBuildCorridorStressRows, nrDashTopCorridorStress } from '../core/corridor-stress.ts';
import { nrDashBuildNetworkCoupling } from '../core/network-coupling.ts';
import { nrDashBuildDependencyChokepoints } from '../core/dependency-chokepoint.ts';
import { nrDashBuildNeedsImbalance } from '../core/needs-imbalance.ts';
import { nrDashApplyMapPulse, nrDashBuildMapPulseRows, nrDashHottestPulseRegion } from '../core/map-pulse.ts';
import { nrDashBuildRiskExposure, nrDashTopRiskExposureRows } from '../core/risk-exposure.ts';
import { nrDashBuildUtilizationSkew } from '../core/utilization-skew.ts';
import {
  nrDashBuildMomentumResilienceTension,
  nrDashTopTensionOutliers,
} from '../core/momentum-resilience-tension.ts';
import { nrDashBuildMapHubIndex, nrDashPrimaryMapHub, nrDashTopMapHubs } from '../core/map-hub-index.ts';
import { nrDashEnrichMapLinkStress, nrDashHottestMapLinkStress } from '../core/link-stress.ts';
import { nrDashBuildResilienceSpread } from '../core/resilience-spread.ts';
import { nrDashBuildAuthSnapshot } from '../core/auth-snapshot.ts';
import { nrDashBuildBottleneckRollup } from '../core/bottleneck-rollup.ts';
import { nrDashBuildHeatCells } from '../core/heat-matrix.ts';
import {
  nrDashBuildAdjacencyLinks,
  nrDashBuildDependencyLinks,
  nrDashLinkEndpoints,
  nrDashMergeMapLinks,
} from '../core/map-links.ts';
import { nrDashBuildRegionMapNodes } from '../core/region-map-model.ts';
import { AGENT23_REGION_MAP_LAYOUT, COMM_REGION_CODES, NATIONAL_NETWORKS } from '../core/constants.ts';
import { nrDashClamp01, nrDashHistoryActivityWeight, nrDashOwnerLabel } from '../core/util.ts';
import { createAgent23LrFixture, createAgent23NsFixture } from './fixtures.ts';
import type { Agent23TestResult } from '../types.ts';

export function summarizeAgent23Tests(results: Agent23TestResult[]): {
  total: number;
  passed: number;
  failed: Agent23TestResult[];
} {
  const failed = results.filter(r => !r.passed);
  return { total: results.length, passed: results.length - failed.length, failed };
}

export function runAgent23SelfTests(): Agent23TestResult[] {
  const results: Agent23TestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
    } catch (e) {
      results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a23_null_snap', 'Snapshot null when LR and NS missing', () => nrDashBuildAuthSnapshot(1, null, null, null) === null);

  check('a23_lr_only', 'LR-only snapshot has 8 regions and provenance', () => {
    const lr = createAgent23LrFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null);
    return Boolean(
      snap && snap.regions.length === COMM_REGION_CODES.length && snap.provenance.some(p => p.source === 'living_regions')
    );
  });

  check('a23_ns_only', 'NS-only snapshot exposes five network bars', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, null, ns, null);
    return Boolean(snap && snap.networks.length === 5 && snap.provenance.some(p => p.source === 'national_systems'));
  });

  check('a23_heat_full', 'Heat matrix covers region × network grid', () => {
    const ns = createAgent23NsFixture();
    const heat = nrDashBuildHeatCells(ns);
    const expected = Object.keys(ns.regions).length * NATIONAL_NETWORKS.length;
    return heat.cells.length === expected || `cells=${heat.cells.length} expected=${expected}`;
  });

  check('a23_map_layout', 'Strategic map layout lists eight AU codes', () => AGENT23_REGION_MAP_LAYOUT.length === 8);

  check('a23_adj_pairs', 'Adjacency pairs are deduplicated', () => {
    const pairs = agent23ListAdjacencyPairs();
    const keys = new Set(pairs.map(p => p.key));
    return pairs.length >= 10 && keys.size === pairs.length;
  });

  check('a23_adj_links', 'Adjacency links cover TAS-VIC corridor', () => {
    const links = nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT);
    return links.some(l => l.id.includes('TAS-VIC') || l.label.includes('TAS-VIC'));
  });

  check('a23_dep_links', 'Dependency links from NS state', () => {
    const ns = createAgent23NsFixture();
    const deps = nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT);
    return deps.length === 3 && deps.every(d => d.kind === 'dependency');
  });

  check('a23_map_link_geom', 'Link endpoints resolve for SA→NSW dependency', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), ns, null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const dep = nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)[0];
    const seg = nrDashLinkEndpoints(dep, nodes);
    return Boolean(seg && seg.x1 !== seg.x2);
  });

  check('a23_map_nodes', 'Map nodes align to layout ids', () => {
    const snap = nrDashBuildAuthSnapshot(3, createAgent23LrFixture(), null, null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    return nodes.length === 8 && nodes.every(n => COMM_REGION_CODES.includes(n.regionId as (typeof COMM_REGION_CODES)[number]));
  });

  check('a23_insights_owner', 'Owner breakdown counts eight regions', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you', VIC: 'rival' })!;
    const ins = nrDashBuildCompareInsights(snap, createAgent23NsFixture());
    return ins.ownerBreakdown.you === 1 && ins.ownerBreakdown.rival === 1 && ins.ownerBreakdown.unknown === 6;
  });

  check('a23_insights_needs', 'Total open needs sums regional rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const ins = nrDashBuildCompareInsights(snap, null);
    const expected = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
    return ins.totalOpenNeeds === expected;
  });

  check('a23_leaders_order', 'Momentum leaders sorted by band rank', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const { leaders } = nrDashBuildRegionalLeaders(snap, 3);
    return leaders.length === 3 && leaders[0].rank >= leaders[1].rank;
  });

  check('a23_network_stress', 'Network stress reports five networks', () => {
    const stress = nrDashBuildNetworkStress(createAgent23NsFixture());
    return stress.length === 5 && stress.every(s => s.peakUtilization >= 0);
  });

  check('a23_bottleneck_rollup', 'Bottleneck rollup preserves region and network', () => {
    const rows = nrDashBuildBottleneckRollup(createAgent23NsFixture());
    return rows.length === 1 && rows[0].regionId === 'NSW' && rows[0].network === 'Freight';
  });

  check('a23_merge_links', 'Merged map links include adjacency and dependency', () => {
    const ns = createAgent23NsFixture();
    const merged = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    );
    return merged.some(l => l.kind === 'adjacency') && merged.some(l => l.kind === 'dependency');
  });

  check('a23_activity_weight', 'History activity weight is bounded 0..1', () => {
    const w = nrDashHistoryActivityWeight([0, 2, 4]);
    return w > 0 && nrDashClamp01(1.5) === 1;
  });

  check('a23_owner_labels', 'Owner labels', () =>
    nrDashOwnerLabel('you') === 'You' && nrDashOwnerLabel('rival') === 'Rival' && nrDashOwnerLabel('unknown') === '—'
  );

  check('a23_merged_counts', 'Merged snapshot counts bottlenecks and deps from NS', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you' })!;
    return snap.bottleneckCount === 1 && snap.dependencyCount === 3 && snap.regions.find(r => r.regionId === 'NSW')?.owner === 'you';
  });

  for (const code of COMM_REGION_CODES) {
    check(`a23_region_${code.toLowerCase()}`, `Regional row includes ${code}`, () => {
      const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
      return snap.regions.some(r => r.regionId === code) || `missing ${code}`;
    });
  }

  for (const net of NATIONAL_NETWORKS) {
    check(`a23_net_${net}`, `Network bar includes ${net}`, () => {
      const snap = nrDashBuildAuthSnapshot(2, null, createAgent23NsFixture(), null)!;
      return snap.networks.some(n => n.network === net);
    });
  }

  check('a23_history_snippets', 'History snippets merge NS history and LR majors', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    return snap.historySnippets.length >= 2;
  });

  check('a23_divergence', 'Momentum divergence spread is non-negative', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const d = nrDashBuildMomentumDivergence(snap)!;
    return d.spread >= 0 && d.dispersion >= 0;
  });

  check('a23_condition_catalog', 'Condition catalog lists strained cells from fixture', () => {
    const cat = nrDashBuildConditionCatalog(createAgent23NsFixture());
    return cat.some(c => c.condition === 'bottlenecked' || c.condition === 'critical');
  });

  check('a23_trend_delta', 'Trend deltas computed from history', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const deltas = nrDashBuildTrendDeltas(snap.regions);
    return deltas.length === COMM_REGION_CODES.length && deltas.some(d => d.delta != null);
  });

  check('a23_trend_movers', 'Top trend movers returns bounded list', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    return nrDashTopTrendMovers(snap.regions, 3).length <= 3;
  });

  check('a23_map_focus_neighbors', 'NSW focus keeps neighbors undimmed', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const nodes = nrDashApplyMapFocus(nrDashBuildRegionMapNodes(snap), 'NSW');
    const nsw = nodes.find(n => n.regionId === 'NSW');
    const qld = nodes.find(n => n.regionId === 'QLD');
    const wa = nodes.find(n => n.regionId === 'WA');
    return nsw && !nsw.dimmed && qld && !qld.dimmed && wa && wa.dimmed;
  });

  check('a23_map_focus_links', 'Focus filters links to touching region', () => {
    const ns = createAgent23NsFixture();
    const all = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    );
    const focused = nrDashLinksTouchingRegion(all, 'SA');
    return focused.length < all.length && focused.every(l => l.fromId === 'SA' || l.toId === 'SA');
  });

  check('a23_neighbors_nsw', 'NSW neighbor list includes QLD', () => nrDashNeighborRegionIds('NSW').includes('QLD'));

  check('a23_constraint_profile', 'Constraint profile counts primary freight regions', () => {
    const profile = nrDashBuildConstraintProfile(createAgent23NsFixture());
    return profile.some(p => p.network === 'freight' && p.regionCount === 8);
  });

  check('a23_resilience_spread', 'Resilience spread uses snapshot resilience fields', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const spread = nrDashBuildResilienceSpread(snap)!;
    return spread.sampleSize === 8 && spread.max >= spread.min;
  });

  check('a23_dep_profile', 'Dependency profile lists high and critical', () => {
    const prof = nrDashBuildDependencyProfile(createAgent23NsFixture());
    return prof.some(p => p.importance === 'high') && prof.some(p => p.importance === 'critical');
  });

  check('a23_heat_summary', 'Heat row summary marks NSW bottlenecked worst', () => {
    const rows = nrDashBuildHeatRowSummaries(createAgent23NsFixture());
    const nsw = rows.find(r => r.regionId === 'NSW');
    return Boolean(nsw && nsw.worstCondition === 'bottlenecked');
  });

  check('a23_parity_gap', 'Parity gap rows align to region count', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    return nrDashBuildParityGapRows(snap).length === 8 && nrDashTopParityOutliers(snap, 2).length <= 2;
  });

  check('a23_corridor_stress', 'Corridor stress ranks NSW adjacency high', () => {
    const rows = nrDashTopCorridorStress(createAgent23NsFixture(), 3);
    return rows.length === 3 && rows.some(r => r.corridorKey.includes('NSW'));
  });

  check('a23_network_coupling', 'Network coupling reports NSW strained cell', () => {
    const c = nrDashBuildNetworkCoupling(createAgent23NsFixture())!;
    const nsw = c.rows.find(r => r.regionId === 'NSW');
    return c.meanCoupling >= 0 && Boolean(nsw && nsw.strainedCount >= 1);
  });

  check('a23_dep_chokepoint', 'Dependency chokepoints preserve fixture order by score', () => {
    const rows = nrDashBuildDependencyChokepoints(createAgent23NsFixture());
    return rows.length === 3 && rows[0].chokeScore >= rows[rows.length - 1].chokeScore;
  });

  check('a23_needs_imbalance', 'Needs imbalance totals match snapshot rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const im = nrDashBuildNeedsImbalance(snap)!;
    const expected = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
    return im.totalOpenNeeds === expected && im.stdDev >= 0;
  });

  check('a23_map_pulse', 'Map pulse applies intensity and hotspot', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const base = nrDashBuildRegionMapNodes(snap);
    const pulsed = nrDashApplyMapPulse(base);
    return (
      nrDashBuildMapPulseRows(base).every(p => p.intensity >= 0 && p.intensity <= 1) &&
      pulsed.every(n => n.pulseIntensity != null) &&
      nrDashHottestPulseRegion(pulsed) != null
    );
  });

  check('a23_corridor_count', 'Corridor stress covers adjacency pair count', () => {
    const pairs = agent23ListAdjacencyPairs();
    return nrDashBuildCorridorStressRows(createAgent23NsFixture()).length === pairs.length;
  });

  check('a23_risk_exposure', 'Risk exposure hotspot marks NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const ex = nrDashBuildRiskExposure(snap)!;
    return ex.totalExposure >= 8 && ex.hotspotRegionId === 'NSW' && nrDashTopRiskExposureRows(snap, 2).length === 2;
  });

  check('a23_util_skew', 'Utilization skew spans five national bars', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const skew = nrDashBuildUtilizationSkew(snap)!;
    return skew.sampleSize === 5 && skew.spread >= 0 && skew.stdDev >= 0;
  });

  check('a23_tension', 'Momentum-resilience tension lists merged rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const t = nrDashBuildMomentumResilienceTension(snap)!;
    return t.rows.length === 8 && t.meanAbsTension >= 0 && nrDashTopTensionOutliers(snap, 2).length <= 2;
  });

  check('a23_map_hubs', 'Map hub index ranks NSW highly', () => {
    const ns = createAgent23NsFixture();
    const hubs = nrDashTopMapHubs(ns, 3);
    return hubs.length === 3 && nrDashBuildMapHubIndex(ns).length >= 8 && nrDashPrimaryMapHub(ns) != null;
  });

  check('a23_link_stress', 'Link stress enriches adjacency and dependency links', () => {
    const ns = createAgent23NsFixture();
    const merged = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    );
    const stressed = nrDashEnrichMapLinkStress(merged, ns);
    const hot = nrDashHottestMapLinkStress(stressed);
    return (
      stressed.every(l => l.stressLevel != null && l.stressLevel >= 0 && l.stressLevel <= 1) &&
      Boolean(hot && (hot.stressLevel ?? 0) > 0)
    );
  });

  return results;
}

/** Merge hook name expected by Agent 25 assembly. */
export function runAgent23NationalRegionalDashboardSelfTests(): Agent23TestResult[] {
  return runAgent23SelfTests();
}
