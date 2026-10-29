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
import { nrDashBuildCapacityHeadroom } from '../core/capacity-headroom.ts';
import { nrDashBuildStrainDiversity } from '../core/strain-diversity.ts';
import { nrDashBuildOwnerStressGap } from '../core/owner-stress-gap.ts';
import { nrDashTopPeripheralRegions } from '../core/peripheral-isolation.ts';
import { nrDashBuildTrendCoherence } from '../core/trend-coherence.ts';
import {
  nrDashBuildBorderStressRows,
  nrDashHottestBorderRegion,
  nrDashTopBorderStress,
} from '../core/border-stress.ts';
import { nrDashBuildBottleneckConcentration } from '../core/bottleneck-concentration.ts';
import { nrDashBuildDependencyAsymmetry, nrDashTopDependencyAsymmetry } from '../core/dependency-asymmetry.ts';
import { nrDashBuildOwnedMomentumSkew } from '../core/owned-momentum-skew.ts';
import { nrDashBuildUtilAlignmentDrift } from '../core/util-alignment-drift.ts';
import { nrDashBuildTrendAcceleration } from '../core/trend-acceleration.ts';
import { nrDashBuildHubCorridorLoad } from '../core/hub-corridor-load.ts';
import { nrDashBuildOpenNeedsConcentration } from '../core/open-needs-concentration.ts';
import { nrDashBuildCriticalCellDensity } from '../core/critical-cell-density.ts';
import { nrDashBuildEconomyMomentumDrift, nrDashTopEconomyMomentumDrift } from '../core/economy-momentum-drift.ts';
import { nrDashBuildMomentumHistoryVolatility } from '../core/momentum-history-volatility.ts';
import { nrDashBuildDependencyInboundConcentration } from '../core/dependency-inbound-concentration.ts';
import { nrDashBuildPeripheralCorridorGap } from '../core/peripheral-corridor-gap.ts';
import { nrDashBuildRiskExposureConcentration } from '../core/risk-exposure-concentration.ts';
import { nrDashBuildHighRiskRegionDensity } from '../core/high-risk-region-density.ts';
import { nrDashBuildDependencyOutboundConcentration } from '../core/dependency-outbound-concentration.ts';
import { nrDashBuildNationalNetworkUtilSpread } from '../core/national-network-util-spread.ts';
import { nrDashBuildResilienceUtilizationGap } from '../core/resilience-utilization-gap.ts';
import { nrDashBuildLinkStressDispersion } from '../core/link-stress-dispersion.ts';
import { nrDashBuildMomentumDeltaSpread } from '../core/momentum-delta-spread.ts';
import { nrDashBuildConstraintConcentration } from '../core/constraint-concentration.ts';
import { nrDashBuildBottleneckNetworkSpan } from '../core/bottleneck-network-span.ts';
import { nrDashBuildDependencyImportanceSpread } from '../core/dependency-importance-spread.ts';
import { nrDashBuildMapPulseConcentration } from '../core/map-pulse-concentration.ts';
import { nrDashBuildEconomyResilienceDrift } from '../core/economy-resilience-drift.ts';
import { nrDashBuildOwnedRiskExposureShare } from '../core/owned-risk-exposure-share.ts';
import { nrDashBuildCorridorStressConcentration } from '../core/corridor-stress-concentration.ts';
import { nrDashBuildDevelopmentTierDiversity } from '../core/development-tier-diversity.ts';
import { nrDashBuildRegionalHeadroomSpread } from '../core/regional-headroom-spread.ts';
import { nrDashBuildNationalNeedsPressure } from '../core/national-needs-pressure.ts';
import { nrDashBuildDependencyConsumerLoad } from '../core/dependency-consumer-load.ts';
import { nrDashBuildActivityWeightSpread } from '../core/activity-weight-spread.ts';
import { nrDashBuildParityGapSpread } from '../core/parity-gap-spread.ts';
import { nrDashBuildHeatStrainedDensity } from '../core/heat-strained-density.ts';
import { nrDashBuildNetworkUtilConcentration } from '../core/network-util-concentration.ts';
import { nrDashBuildDependencyProviderLoad } from '../core/dependency-provider-load.ts';
import { nrDashBuildOwnedResilienceShare } from '../core/owned-resilience-share.ts';
import { nrDashBuildMomentumBandDiversity } from '../core/momentum-band-diversity.ts';
import { nrDashBuildEconomyBandDiversity } from '../core/economy-band-diversity.ts';
import { nrDashBuildMapHubConcentration } from '../core/map-hub-concentration.ts';
import { nrDashBuildChokepointScoreSpread } from '../core/chokepoint-score-spread.ts';
import { nrDashBuildOwnedOpenNeedsShare } from '../core/owned-open-needs-share.ts';
import { nrDashBuildNationalStrainedBarCount } from '../core/national-strained-bar-count.ts';
import { nrDashBuildHistorySnippetLoad } from '../core/history-snippet-load.ts';
import { nrDashBuildNetworkStressConcentration } from '../core/network-stress-concentration.ts';
import { nrDashBuildNetworkCouplingSpread } from '../core/network-coupling-spread.ts';
import { nrDashBuildResilienceBandDiversity } from '../core/resilience-band-diversity.ts';
import { nrDashBuildBottleneckSeverityLoad } from '../core/bottleneck-severity-load.ts';
import { nrDashBuildRivalRiskExposureShare } from '../core/rival-risk-exposure-share.ts';
import { nrDashBuildHeatRowStrainConcentration } from '../core/heat-row-strain-concentration.ts';
import { nrDashBuildHighRiskConcentration } from '../core/high-risk-concentration.ts';
import { nrDashBuildDependencyNetworkSpan } from '../core/dependency-network-span.ts';
import { nrDashBuildNationalBottleneckDensity } from '../core/national-bottleneck-density.ts';
import { nrDashBuildNeutralRiskExposureShare } from '../core/neutral-risk-exposure-share.ts';
import { nrDashBuildUtilHeadroomDivergence } from '../core/util-headroom-divergence.ts';
import { nrDashBuildBorderStressConcentration } from '../core/border-stress-concentration.ts';
import { nrDashBuildConstraintProfileSpread } from '../core/constraint-profile-spread.ts';
import { nrDashBuildBottleneckNetworkShare } from '../core/bottleneck-network-share.ts';
import { nrDashBuildDependencyCriticalShare } from '../core/dependency-critical-share.ts';
import { nrDashBuildMomentumLeaderGap } from '../core/momentum-leader-gap.ts';
import { nrDashBuildDerivedEventLoad } from '../core/derived-event-load.ts';
import { nrDashBuildOwnerConcentrationIndex } from '../core/owner-concentration-index.ts';
import { nrDashBuildOpenNeedsSpread } from '../core/open-needs-spread.ts';
import { nrDashBuildCriticalNeedsShare } from '../core/critical-needs-share.ts';
import { nrDashBuildNationalResilienceGap } from '../core/national-resilience-gap.ts';
import { nrDashBuildDependencyHighShare } from '../core/dependency-high-share.ts';
import { nrDashBuildBottleneckRegionSpan } from '../core/bottleneck-region-span.ts';
import { nrDashBuildMomentumHistorySpan } from '../core/momentum-history-span.ts';
import { nrDashBuildHighRiskSpread } from '../core/high-risk-spread.ts';
import { nrDashBuildHighNeedsShare } from '../core/high-needs-share.ts';
import { nrDashBuildNationalUtilizationGap } from '../core/national-utilization-gap.ts';
import { nrDashBuildDependencyModerateShare } from '../core/dependency-moderate-share.ts';
import { nrDashBuildBottleneckSeveritySpan } from '../core/bottleneck-severity-span.ts';
import { nrDashBuildDevelopmentTierSpan } from '../core/development-tier-span.ts';
import { nrDashBuildLowNeedsShare } from '../core/low-needs-share.ts';
import { nrDashBuildCriticalRiskShare } from '../core/critical-risk-share.ts';
import { nrDashBuildNationalConditionGap } from '../core/national-condition-gap.ts';
import { nrDashBuildDependencyLowShare } from '../core/dependency-low-share.ts';
import { nrDashBuildBottleneckNetworkSeverityLoadSpread } from '../core/bottleneck-network-severity-load-spread.ts';
import { nrDashBuildMomentumBandSpan } from '../core/momentum-band-span.ts';
import { nrDashBuildEconomyBandSpan } from '../core/economy-band-span.ts';
import { nrDashBuildResilienceBandSpan } from '../core/resilience-band-span.ts';
import { nrDashBuildModerateRiskShare } from '../core/moderate-risk-share.ts';
import { nrDashBuildNationalBottleneckGap } from '../core/national-bottleneck-gap.ts';
import { nrDashBuildDependencyConsumerSpan } from '../core/dependency-consumer-span.ts';
import { nrDashBuildMapPulseSpan } from '../core/map-pulse-span.ts';
import { nrDashBuildLowRiskShare } from '../core/low-risk-share.ts';
import { nrDashBuildNationalDependencyGap } from '../core/national-dependency-gap.ts';
import { nrDashBuildDependencyProviderSpan } from '../core/dependency-provider-span.ts';
import { nrDashBuildEconomyResilienceSpan } from '../core/economy-resilience-span.ts';
import { nrDashBuildCorridorPulseSpread } from '../core/corridor-pulse-spread.ts';
import { nrDashBuildHistoryTurnSpan } from '../core/history-turn-span.ts';
import { nrDashBuildModerateNeedsSpread } from '../core/moderate-needs-spread.ts';
import { nrDashBuildNationalHistoryGap } from '../core/national-history-gap.ts';
import { nrDashBuildLinkPulseSpan } from '../core/link-pulse-span.ts';
import { nrDashBuildOwnerPortfolioSpan } from '../core/owner-portfolio-span.ts';
import { nrDashBuildConstraintBandSpan } from '../core/constraint-band-span.ts';
import { nrDashBuildDerivedEventTurnSpan } from '../core/derived-event-turn-span.ts';
import { nrDashBuildCriticalNeedsSpread } from '../core/critical-needs-spread.ts';
import { nrDashBuildNationalSnippetGap } from '../core/national-snippet-gap.ts';
import { nrDashBuildHubPulseSpan } from '../core/hub-pulse-span.ts';
import { nrDashBuildRivalPortfolioSpan } from '../core/rival-portfolio-span.ts';
import { nrDashBuildNetworkConditionSpan } from '../core/network-condition-span.ts';
import { nrDashBuildNsHistoryTurnSpan } from '../core/ns-history-turn-span.ts';
import { nrDashBuildLrHistoryTurnSpan } from '../core/lr-history-turn-span.ts';
import { nrDashBuildOpenNeedsTierSpread } from '../core/open-needs-tier-spread.ts';
import { nrDashBuildSnippetSaturationShare } from '../core/snippet-saturation-share.ts';
import { nrDashBuildPulseAsymmetryGap } from '../core/pulse-asymmetry-gap.ts';
import { nrDashBuildRegionalOwnerSkew } from '../core/regional-owner-skew.ts';
import { nrDashBuildCombinedDerivedHistoryGap } from '../core/combined-derived-history-gap.ts';
import { nrDashBuildMeaningfulDerivedTurnSpan } from '../core/meaningful-derived-turn-span.ts';
import { nrDashBuildNationalSnippetSaturationGap } from '../core/national-snippet-saturation-gap.ts';
import { nrDashBuildCorridorPulseAsymmetry } from '../core/corridor-pulse-asymmetry.ts';
import { nrDashBuildNeutralOwnerPortfolioSkew } from '../core/neutral-owner-portfolio-skew.ts';
import { nrDashBuildMultiTierNeedsConcentration } from '../core/multi-tier-needs-concentration.ts';
import { nrDashBuildLrNsHistoryOverlapGap } from '../core/lr-ns-history-overlap-gap.ts';
import { nrDashBuildUnknownOwnerPortfolioSkew } from '../core/unknown-owner-portfolio-skew.ts';
import { nrDashBuildHighTierNeedsConcentration } from '../core/high-tier-needs-concentration.ts';
import { nrDashBuildLinkPulseAsymmetry } from '../core/link-pulse-asymmetry.ts';
import { nrDashBuildNsOnlySnippetHeadroom } from '../core/ns-only-snippet-headroom.ts';
import { nrDashBuildDerivedMajorOverlapGap } from '../core/derived-major-overlap-gap.ts';
import { nrDashBuildCorridorSaturationShare } from '../core/corridor-saturation-share.ts';
import { nrDashBuildRivalOwnerPortfolioSkew } from '../core/rival-owner-portfolio-skew.ts';
import { nrDashBuildCriticalTierNeedsConcentration } from '../core/critical-tier-needs-concentration.ts';
import { nrDashBuildHubPulseAsymmetry } from '../core/hub-pulse-asymmetry.ts';
import { nrDashBuildLrOnlySnippetHeadroom } from '../core/lr-only-snippet-headroom.ts';
import { nrDashBuildMeaningfulDerivedOverlapGap } from '../core/meaningful-derived-overlap-gap.ts';
import { nrDashBuildLinkSaturationShare } from '../core/link-saturation-share.ts';
import { nrDashBuildYouOwnerMomentumGap } from '../core/you-owner-momentum-gap.ts';
import { nrDashBuildModerateTierNeedsConcentration } from '../core/moderate-tier-needs-concentration.ts';
import { nrDashBuildMapPulseSaturationShare } from '../core/map-pulse-saturation-share.ts';
import { nrDashBuildMergedSnippetOverlapGap } from '../core/merged-snippet-overlap-gap.ts';
import { nrDashBuildDependencyPulseAsymmetry } from '../core/dependency-pulse-asymmetry.ts';
import { nrDashBuildBorderCorridorSaturationShare } from '../core/border-corridor-saturation-share.ts';
import { nrDashBuildRivalOwnerMomentumGap } from '../core/rival-owner-momentum-gap.ts';
import { nrDashBuildLowTierNeedsConcentration } from '../core/low-tier-needs-concentration.ts';
import { nrDashBuildAdjacencyPulseAsymmetry } from '../core/adjacency-pulse-asymmetry.ts';
import { nrDashBuildSnippetTurnSpan } from '../core/snippet-turn-span.ts';
import { nrDashBuildHubCorridorSaturationShare } from '../core/hub-corridor-saturation-share.ts';
import { nrDashBuildNationalDerivedOverlapGap } from '../core/national-derived-overlap-gap.ts';
import { nrDashBuildNeutralOwnerMomentumGap } from '../core/neutral-owner-momentum-gap.ts';
import { nrDashBuildOpenNeedsSeveritySpan } from '../core/open-needs-severity-span.ts';
import { nrDashBuildPeripheralPulseAsymmetry } from '../core/peripheral-pulse-asymmetry.ts';
import { nrDashBuildHistorySnippetTurnGap } from '../core/history-snippet-turn-gap.ts';
import { nrDashBuildDependencyCorridorSaturationShare } from '../core/dependency-corridor-saturation-share.ts';
import { nrDashBuildLrMajorSnippetOverlapGap } from '../core/lr-major-snippet-overlap-gap.ts';
import { nrDashBuildUnknownOwnerMomentumGap } from '../core/unknown-owner-momentum-gap.ts';
import { nrDashBuildRegionalNeedsSeverityConcentration } from '../core/regional-needs-severity-concentration.ts';
import { nrDashBuildHubPeripheralSaturationShare } from '../core/hub-peripheral-saturation-share.ts';
import { nrDashBuildSnippetSourceTurnGap } from '../core/snippet-source-turn-gap.ts';
import { nrDashBuildAdjacencyCorridorSaturationShare } from '../core/adjacency-corridor-saturation-share.ts';
import { nrDashBuildNsHistorySnippetOverlapGap } from '../core/ns-history-snippet-overlap-gap.ts';
import { nrDashBuildOwnedOpenNeedsMomentumSkewGap } from '../core/owned-open-needs-momentum-skew-gap.ts';
import { nrDashBuildNationalSeverityTierSpread } from '../core/national-severity-tier-spread.ts';
import { nrDashBuildChokepointPulseAsymmetry } from '../core/chokepoint-pulse-asymmetry.ts';
import { nrDashBuildLrDerivedSnippetTurnGap } from '../core/lr-derived-snippet-turn-gap.ts';
import { nrDashBuildMergedCorridorSaturationShare } from '../core/merged-corridor-saturation-share.ts';
import { nrDashBuildMajorHistoryOverlapGap } from '../core/major-history-overlap-gap.ts';
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

  check('a23_capacity_headroom', 'Capacity headroom complements utilization skew', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const head = nrDashBuildCapacityHeadroom(snap)!;
    const skew = nrDashBuildUtilizationSkew(snap)!;
    return head.sampleSize === 5 && head.meanHeadroom + skew.meanUtilization > 0.9 && head.spread >= 0;
  });

  check('a23_strain_diversity', 'Strain diversity covers heat grid cells', () => {
    const div = nrDashBuildStrainDiversity(createAgent23NsFixture())!;
    return div.cellCount === 40 && div.diversityIndex >= 0 && div.dominantCondition != null;
  });

  check('a23_owner_stress_gap', 'Owner stress gap compares NSW player row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you' })!;
    const gap = nrDashBuildOwnerStressGap(snap)!;
    return gap.ownedRegionCount === 1 && gap.openNeedsGap === 0 && gap.resilienceGap != null;
  });

  check('a23_peripheral_isolation', 'Peripheral isolation ranks TAS or WA highly', () => {
    const rows = nrDashTopPeripheralRegions(createAgent23NsFixture(), 3);
    return rows.length === 3 && rows.some(r => r.regionId === 'TAS' || r.regionId === 'WA');
  });

  check('a23_trend_coherence', 'Trend coherence uses momentum history deltas', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const c = nrDashBuildTrendCoherence(snap)!;
    return c.sampleSize === 8 && c.coherenceScore >= 0 && c.coherenceScore <= 1;
  });

  check('a23_border_stress', 'Border stress marks NSW fixture corridor hot', () => {
    const ns = createAgent23NsFixture();
    const rows = nrDashTopBorderStress(ns, 3);
    return (
      rows.length === 3 &&
      nrDashBuildBorderStressRows(ns).length >= 8 &&
      nrDashHottestBorderRegion(ns) === 'NSW'
    );
  });

  check('a23_bottleneck_conc', 'Bottleneck concentration peaks on NSW fixture', () => {
    const conc = nrDashBuildBottleneckConcentration(createAgent23NsFixture())!;
    return conc.activeCount === 1 && conc.topRegionId === 'NSW' && conc.concentrationIndex === 1;
  });

  check('a23_dep_asymmetry', 'Dependency asymmetry ranks net consumers', () => {
    const ns = createAgent23NsFixture();
    const summary = nrDashBuildDependencyAsymmetry(ns)!;
    const top = nrDashTopDependencyAsymmetry(ns, 2);
    return summary.rows.length === 8 && top.length === 2 && top.some(r => r.netImportWeight > 0);
  });

  check('a23_owned_mom_skew', 'Owned momentum skew compares player portfolio', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you', VIC: 'you' })!;
    const skew = nrDashBuildOwnedMomentumSkew(snap)!;
    return skew.ownedRegionCount === 2 && skew.rankSkew === 0;
  });

  check('a23_util_drift', 'Util alignment drift spans five networks', () => {
    const drift = nrDashBuildUtilAlignmentDrift(createAgent23NsFixture())!;
    return drift.rows.length === 5 && drift.meanDrift >= 0;
  });

  check('a23_trend_accel', 'Trend acceleration uses three-point history', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const acc = nrDashBuildTrendAcceleration(snap)!;
    return acc.sampleSize === 8 && acc.coherenceScore >= 0 && acc.coherenceScore <= 1;
  });

  check('a23_hub_load', 'Hub corridor load aggregates touching link stress', () => {
    const load = nrDashBuildHubCorridorLoad(createAgent23NsFixture())!;
    return load.hubRegionId != null && load.touchingLinkCount >= 1 && load.peakLinkStress >= 0;
  });

  check('a23_open_needs_conc', 'Open needs concentration is uniform on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildOpenNeedsConcentration(snap)!;
    return conc.totalOpenNeeds === 8 && conc.concentrationIndex === 0.125;
  });

  check('a23_critical_density', 'Critical cell density counts VIC energy cell', () => {
    const density = nrDashBuildCriticalCellDensity(createAgent23NsFixture())!;
    return density.cellCount === 40 && density.criticalPlusCount === 1 && density.worstRegionId === 'VIC';
  });

  check('a23_econ_mom_drift', 'Economy momentum drift spans eight regions', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const drift = nrDashBuildEconomyMomentumDrift(snap)!;
    return drift.rows.length === 8 && nrDashTopEconomyMomentumDrift(snap, 2).length === 2;
  });

  check('a23_history_vol', 'Momentum history volatility finds ACT outlier', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const vol = nrDashBuildMomentumHistoryVolatility(snap)!;
    return vol.sampleSize === 8 && vol.maxVolatility >= vol.meanVolatility && vol.outlierRegionId === 'ACT';
  });

  check('a23_dep_inbound_conc', 'Dependency inbound concentration peaks on NT fixture', () => {
    const conc = nrDashBuildDependencyInboundConcentration(createAgent23NsFixture())!;
    return conc.edgeCount === 3 && conc.topConsumerId === 'NT' && conc.concentrationIndex > 0;
  });

  check('a23_peripheral_gap', 'Peripheral corridor gap compares hub vs rim stress', () => {
    const gap = nrDashBuildPeripheralCorridorGap(createAgent23NsFixture())!;
    return gap.hubRegionId != null && gap.peripheralLinkCount >= 1;
  });

  check('a23_risk_exposure_conc', 'Risk exposure concentration peaks on NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildRiskExposureConcentration(snap)!;
    return conc.topRegionId === 'NSW' && conc.concentrationIndex === 0.16;
  });

  check('a23_high_risk_density', 'High-risk region density counts one NSW hotspot', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const density = nrDashBuildHighRiskRegionDensity(snap)!;
    return density.highRiskRegionCount === 1 && density.density === 0.125;
  });

  check('a23_dep_outbound_conc', 'Dependency outbound concentration peaks on QLD fixture', () => {
    const conc = nrDashBuildDependencyOutboundConcentration(createAgent23NsFixture())!;
    return conc.edgeCount === 3 && conc.topProviderId === 'QLD' && conc.concentrationIndex > 0;
  });

  check('a23_national_util_spread', 'National network util spread spans five networks', () => {
    const spread = nrDashBuildNationalNetworkUtilSpread(createAgent23NsFixture())!;
    return spread.networkCount === 5 && spread.stdDev > 0 && spread.maxUtilNetwork === 'digital';
  });

  check('a23_resilience_util_gap', 'Resilience utilization gap covers eight NS regions', () => {
    const gap = nrDashBuildResilienceUtilizationGap(createAgent23NsFixture())!;
    return gap.sampleSize === 8 && gap.meanAbsGap > 0 && gap.maxGapRegionId != null;
  });

  check('a23_link_stress_disp', 'Link stress dispersion aggregates map links', () => {
    const disp = nrDashBuildLinkStressDispersion(createAgent23NsFixture())!;
    return disp.linkCount >= 10 && disp.stdDev >= 0 && disp.hottestLinkId != null;
  });

  check('a23_momentum_delta_spread', 'Momentum delta spread covers eight LR regions', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildMomentumDeltaSpread(snap)!;
    return spread.sampleSize === 8 && spread.meanAbsDelta === 0.15 && spread.stdDev === 0;
  });

  check('a23_constraint_conc', 'Primary constraint concentration is uniform freight fixture', () => {
    const conc = nrDashBuildConstraintConcentration(createAgent23NsFixture())!;
    return conc.regionCount === 8 && conc.dominantNetwork === 'freight' && conc.concentrationIndex === 1;
  });

  check('a23_bottleneck_span', 'Bottleneck network span counts freight on fixture', () => {
    const span = nrDashBuildBottleneckNetworkSpan(createAgent23NsFixture())!;
    return span.bottleneckCount === 1 && span.distinctNetworks === 1 && span.networks[0] === 'freight';
  });

  check('a23_dep_importance_spread', 'Dependency importance spread spans three edges', () => {
    const spread = nrDashBuildDependencyImportanceSpread(createAgent23NsFixture())!;
    return spread.edgeCount === 3 && spread.stdDev > 0 && spread.maxWeight === 1.5;
  });

  check('a23_pulse_conc', 'Map pulse concentration peaks on NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildMapPulseConcentration(snap)!;
    return conc.regionCount === 8 && conc.topRegionId === 'NSW' && conc.concentrationIndex > 0.12;
  });

  check('a23_econ_resilience_drift', 'Economy resilience drift covers merged NS rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const drift = nrDashBuildEconomyResilienceDrift(snap)!;
    return drift.rows.length === 8 && drift.meanAbsDrift === 0.2;
  });

  check('a23_owned_risk_share', 'Owned risk exposure share tracks NSW player row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const share = nrDashBuildOwnedRiskExposureShare(snap)!;
    return share.ownedRegionCount === 1 && share.ownedShare === 0.3;
  });

  check('a23_corridor_stress_conc', 'Corridor stress concentration ranks NSW corridors', () => {
    const conc = nrDashBuildCorridorStressConcentration(createAgent23NsFixture())!;
    return conc.corridorCount >= 8 && conc.concentrationIndex > 0 && (conc.topCorridorKey ?? '').includes('NSW');
  });

  check('a23_dev_tier_diversity', 'Development tier diversity splits fixture tiers', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const tiers = nrDashBuildDevelopmentTierDiversity(snap)!;
    return tiers.distinctTiers === 2 && tiers.diversityIndex === 0.5;
  });

  check('a23_regional_headroom_spread', 'Regional headroom spread marks NSW tightest', () => {
    const spread = nrDashBuildRegionalHeadroomSpread(createAgent23NsFixture())!;
    return spread.regionCount === 8 && spread.stdDev > 0 && spread.tightestRegionId === 'NSW';
  });

  check('a23_national_needs_pressure', 'National needs pressure uses merged resilience', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const pressure = nrDashBuildNationalNeedsPressure(snap)!;
    return pressure.totalOpenNeeds === 8 && pressure.nationalResilience === 58 && pressure.pressureIndex === 1.379;
  });

  check('a23_dep_consumer_load', 'Dependency consumer load covers three consumers', () => {
    const load = nrDashBuildDependencyConsumerLoad(createAgent23NsFixture())!;
    return load.edgeCount === 3 && load.meanEdgesPerConsumer === 1 && load.stdDev === 0;
  });

  check('a23_activity_weight_spread', 'Activity weight spread covers eight map nodes', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildActivityWeightSpread(snap)!;
    return spread.regionCount === 8 && spread.meanWeight > 0 && spread.outlierRegionId === 'NSW';
  });

  check('a23_parity_gap_spread', 'Parity gap spread is flat on uniform fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const spread = nrDashBuildParityGapSpread(snap)!;
    return spread.sampleSize === 8 && spread.meanAbsGap === 15 && spread.stdDev === 0;
  });

  check('a23_heat_strained_density', 'Heat strained density counts NSW and VIC cells', () => {
    const density = nrDashBuildHeatStrainedDensity(createAgent23NsFixture())!;
    return density.cellCount === 40 && density.strainedPlusCount === 2 && density.density === 0.05;
  });

  check('a23_network_util_conc', 'Network util concentration peaks on digital bar', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const conc = nrDashBuildNetworkUtilConcentration(snap)!;
    return conc.networkCount === 5 && conc.topNetwork === 'digital' && conc.concentrationIndex > 0.2;
  });

  check('a23_dep_provider_load', 'Dependency provider load covers three providers', () => {
    const load = nrDashBuildDependencyProviderLoad(createAgent23NsFixture())!;
    return load.edgeCount === 3 && load.meanEdgesPerProvider === 1 && load.stdDev === 0;
  });

  check('a23_owned_resilience_share', 'Owned resilience share tracks NSW player portfolio', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you' })!;
    const share = nrDashBuildOwnedResilienceShare(snap)!;
    return share.ownedRegionCount === 1 && share.ownedShare === 0.125;
  });

  check('a23_momentum_band_diversity', 'Momentum band diversity is uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const bands = nrDashBuildMomentumBandDiversity(snap)!;
    return bands.distinctBands === 1 && bands.diversityIndex === 1;
  });

  check('a23_economy_band_diversity', 'Economy band diversity is uniform moderate fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const econ = nrDashBuildEconomyBandDiversity(snap)!;
    return econ.distinctBands === 1 && econ.diversityIndex === 1;
  });

  check('a23_map_hub_conc', 'Map hub concentration peaks on SA fixture', () => {
    const conc = nrDashBuildMapHubConcentration(createAgent23NsFixture())!;
    return conc.topRegionId === 'SA' && conc.concentrationIndex > 0.05;
  });

  check('a23_chokepoint_spread', 'Chokepoint score spread spans three dependencies', () => {
    const spread = nrDashBuildChokepointScoreSpread(createAgent23NsFixture())!;
    return spread.edgeCount === 3 && spread.stdDev > 0 && spread.maxScore > spread.meanScore;
  });

  check('a23_owned_open_needs_share', 'Owned open needs share tracks NSW player row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const share = nrDashBuildOwnedOpenNeedsShare(snap)!;
    return share.ownedRegionCount === 1 && share.ownedShare === 0.125;
  });

  check('a23_national_strained_bars', 'National strained bar count is zero on healthy fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const bars = nrDashBuildNationalStrainedBarCount(snap)!;
    return bars.networkCount === 5 && bars.strainedPlusCount === 0;
  });

  check('a23_history_snippet_load', 'History snippet load merges NS and LR majors', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const load = nrDashBuildHistorySnippetLoad(snap)!;
    return load.snippetCount === 2 && load.loadRatio === 0.25;
  });

  check('a23_network_stress_conc', 'Network stress concentration peaks on freight', () => {
    const conc = nrDashBuildNetworkStressConcentration(createAgent23NsFixture())!;
    return conc.topNetwork === 'freight' && conc.concentrationIndex > 0.2;
  });

  check('a23_network_coupling_spread', 'Network coupling spread marks NSW max region', () => {
    const spread = nrDashBuildNetworkCouplingSpread(createAgent23NsFixture())!;
    return spread.regionCount === 8 && spread.stdDev > 0 && spread.maxCouplingRegionId === 'NSW';
  });

  check('a23_resilience_band_diversity', 'Resilience band diversity is uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const bands = nrDashBuildResilienceBandDiversity(snap)!;
    return bands.distinctBands === 1 && bands.diversityIndex === 1;
  });

  check('a23_bottleneck_severity_load', 'Bottleneck severity load counts NSW meaningful', () => {
    const load = nrDashBuildBottleneckSeverityLoad(createAgent23NsFixture())!;
    return load.activeCount === 1 && load.weightedLoad === 1 && load.topRegionId === 'NSW';
  });

  check('a23_rival_risk_share', 'Rival risk exposure share tracks NSW rival row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const share = nrDashBuildRivalRiskExposureShare(snap)!;
    return share.rivalRegionCount === 1 && share.rivalShare === 0.3;
  });

  check('a23_heat_row_strain_conc', 'Heat row strain concentration splits NSW and VIC', () => {
    const conc = nrDashBuildHeatRowStrainConcentration(createAgent23NsFixture())!;
    return conc.concentrationIndex === 0.5 && conc.topRegionShare === 0.5;
  });

  check('a23_high_risk_conc', 'High-risk concentration peaks on NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildHighRiskConcentration(snap)!;
    return conc.topRegionId === 'NSW' && conc.concentrationIndex === 1;
  });

  check('a23_dep_network_span', 'Dependency network span covers three networks', () => {
    const span = nrDashBuildDependencyNetworkSpan(createAgent23NsFixture())!;
    return span.edgeCount === 3 && span.distinctNetworks === 3;
  });

  check('a23_bottleneck_density', 'National bottleneck density counts one active', () => {
    const density = nrDashBuildNationalBottleneckDensity(createAgent23NsFixture())!;
    return density.activeBottlenecks === 1 && density.density === 0.125;
  });

  check('a23_neutral_risk_share', 'Neutral risk exposure share tracks VIC neutral row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { VIC: 'neutral' })!;
    const share = nrDashBuildNeutralRiskExposureShare(snap)!;
    return share.neutralRegionCount === 1 && share.neutralShare === 0.1;
  });

  check('a23_util_headroom_div', 'Util headroom divergence compares national spreads', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const div = nrDashBuildUtilHeadroomDivergence(snap)!;
    return div.utilizationSpread === 0.2 && div.headroomSpread === 0.2 && div.divergence === 0;
  });

  check('a23_border_stress_conc', 'Border stress concentration peaks on NSW fixture', () => {
    const conc = nrDashBuildBorderStressConcentration(createAgent23NsFixture())!;
    return conc.topRegionId === 'NSW' && conc.concentrationIndex > 0.1;
  });

  check('a23_constraint_profile_spread', 'Constraint profile spread is zero on uniform freight fixture', () => {
    const spread = nrDashBuildConstraintProfileSpread(createAgent23NsFixture())!;
    return spread.networkKinds === 1 && spread.stdDev === 0;
  });

  check('a23_bottleneck_network_share', 'Bottleneck network share is all freight on fixture', () => {
    const share = nrDashBuildBottleneckNetworkShare(createAgent23NsFixture())!;
    return share.topNetwork === 'freight' && share.concentrationIndex === 1;
  });

  check('a23_dep_critical_share', 'Dependency critical share counts one of three edges', () => {
    const share = nrDashBuildDependencyCriticalShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.criticalCount === 1 && share.criticalShare > 0.3;
  });

  check('a23_momentum_leader_gap', 'Momentum leader gap is zero when all bands stable', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildMomentumLeaderGap(snap, createAgent23NsFixture())!;
    return gap.rankGap === 0 && gap.leaderRegionId.length > 0;
  });

  check('a23_derived_event_load', 'Derived event load counts one major LR event', () => {
    const load = nrDashBuildDerivedEventLoad(createAgent23LrFixture())!;
    return load.eventCount === 1 && load.majorCount === 1 && load.latestTurn === 4;
  });

  check('a23_owner_concentration', 'Owner concentration tracks rival portfolio on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const idx = nrDashBuildOwnerConcentrationIndex(snap)!;
    return idx.dominantOwner === 'unknown' && idx.concentrationIndex > 0.75;
  });

  check('a23_open_needs_spread', 'Open needs spread is zero on uniform fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildOpenNeedsSpread(snap)!;
    return spread.totalOpenNeeds === 8 && spread.stdDev === 0;
  });

  check('a23_critical_needs_share', 'Critical needs share is zero on moderate fixture', () => {
    const share = nrDashBuildCriticalNeedsShare(createAgent23LrFixture())!;
    return share.openNeedCount === 8 && share.criticalCount === 0 && share.criticalShare === 0;
  });

  check('a23_national_resilience_gap', 'National resilience gap compares NS score to regional mean', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNationalResilienceGap(snap)!;
    return gap.nationalScore === 58 && gap.regionalMean === 55 && gap.gap === 3;
  });

  check('a23_dep_high_share', 'Dependency high share counts two of three edges', () => {
    const share = nrDashBuildDependencyHighShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.highPlusCount === 2 && share.highPlusShare > 0.6;
  });

  check('a23_bottleneck_region_span', 'Bottleneck region span touches NSW only', () => {
    const span = nrDashBuildBottleneckRegionSpan(createAgent23NsFixture())!;
    return span.distinctRegions === 1 && span.spanRatio === 0.125;
  });

  check('a23_momentum_history_span', 'Momentum history span is zero on uniform lengths', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildMomentumHistorySpan(snap)!;
    return span.minLength === 3 && span.maxLength === 3 && span.lengthSpread === 0;
  });

  check('a23_high_risk_spread', 'High-risk spread peaks on NSW-only fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildHighRiskSpread(snap)!;
    return spread.totalHighRisks === 1 && spread.stdDev > 0.3 && spread.meanHighRisks === 0.125;
  });

  check('a23_high_needs_share', 'High needs share is zero on moderate fixture', () => {
    const share = nrDashBuildHighNeedsShare(createAgent23LrFixture())!;
    return share.openNeedCount === 8 && share.highCount === 0 && share.highShare === 0;
  });

  check('a23_national_util_gap', 'National utilization gap compares NS national and regional means', () => {
    const gap = nrDashBuildNationalUtilizationGap(createAgent23NsFixture())!;
    return gap.nationalMean === 0.45 && gap.regionalMean === 0.425 && gap.gap === 0.025;
  });

  check('a23_dep_moderate_share', 'Dependency moderate share counts one of three edges', () => {
    const share = nrDashBuildDependencyModerateShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.moderateCount === 1 && share.moderateShare > 0.3;
  });

  check('a23_bottleneck_severity_span', 'Bottleneck severity span is zero on single meaningful bottleneck', () => {
    const span = nrDashBuildBottleneckSeveritySpan(createAgent23NsFixture())!;
    return span.activeCount === 1 && span.rankSpread === 0 && span.minRank === 1;
  });

  check('a23_dev_tier_span', 'Development tier span spans developing and advanced fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildDevelopmentTierSpan(snap)!;
    return span.rankSpread === 1 && span.regionCount === 8;
  });

  check('a23_low_needs_share', 'Low needs share is zero on moderate fixture', () => {
    const share = nrDashBuildLowNeedsShare(createAgent23LrFixture())!;
    return share.openNeedCount === 8 && share.lowCount === 0 && share.lowShare === 0;
  });

  check('a23_critical_risk_share', 'Critical risk share is zero on high-only NSW fixture', () => {
    const share = nrDashBuildCriticalRiskShare(createAgent23LrFixture())!;
    return share.riskCount === 1 && share.criticalCount === 0 && share.criticalShare === 0;
  });

  check('a23_national_condition_gap', 'National condition gap compares NS national and regional ranks', () => {
    const gap = nrDashBuildNationalConditionGap(createAgent23NsFixture())!;
    return gap.nationalMeanRank === 1 && gap.regionalMeanRank === 1.125 && gap.gap === -0.125;
  });

  check('a23_dep_low_share', 'Dependency low share is zero on mixed-importance fixture', () => {
    const share = nrDashBuildDependencyLowShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.lowCount === 0 && share.lowShare === 0;
  });

  check('a23_bottleneck_net_sev_load_spread', 'Bottleneck network severity load spread peaks on freight', () => {
    const spread = nrDashBuildBottleneckNetworkSeverityLoadSpread(createAgent23NsFixture())!;
    return spread.topNetwork === 'freight' && spread.stdDev === 0.4 && spread.meanLoad === 0.2;
  });

  check('a23_momentum_band_span', 'Momentum band span is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildMomentumBandSpan(snap)!;
    return span.rankSpread === 0 && span.minRank === 2 && span.maxRank === 2;
  });

  check('a23_economy_band_span', 'Economy band span is zero on uniform moderate fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildEconomyBandSpan(snap)!;
    return span.rankSpread === 0 && span.minRank === 2 && span.maxRank === 2;
  });

  check('a23_resilience_band_span', 'Resilience band span is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildResilienceBandSpan(snap)!;
    return span.rankSpread === 0 && span.minRank === 2 && span.maxRank === 2;
  });

  check('a23_moderate_risk_share', 'Moderate risk share is zero on high-only NSW fixture', () => {
    const share = nrDashBuildModerateRiskShare(createAgent23LrFixture())!;
    return share.riskCount === 1 && share.moderateCount === 0 && share.moderateShare === 0;
  });

  check('a23_national_bottleneck_gap', 'National bottleneck gap contrasts bar totals and active list', () => {
    const gap = nrDashBuildNationalBottleneckGap(createAgent23NsFixture())!;
    return gap.nationalBarTotal === 0 && gap.activeListCount === 1 && gap.gap === -1;
  });

  check('a23_dep_consumer_span', 'Dependency consumer span covers three consumer slots', () => {
    const span = nrDashBuildDependencyConsumerSpan(createAgent23NsFixture())!;
    return span.distinctConsumers === 3 && span.spanRatio === 0.375;
  });

  check('a23_map_pulse_span', 'Map pulse span is positive on NSW hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildMapPulseSpan(nrDashBuildRegionMapNodes(snap))!;
    return span.regionCount === 8 && span.intensitySpread > 0.05;
  });

  check('a23_low_risk_share', 'Low risk share is zero on high-only NSW fixture', () => {
    const share = nrDashBuildLowRiskShare(createAgent23LrFixture())!;
    return share.riskCount === 1 && share.lowCount === 0 && share.lowShare === 0;
  });

  check('a23_national_dep_gap', 'National dependency gap is zero when list matches snapshot', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), ns, null)!;
    const gap = nrDashBuildNationalDependencyGap(ns, snap)!;
    return gap.listCount === 3 && gap.snapshotCount === 3 && gap.gap === 0;
  });

  check('a23_dep_provider_span', 'Dependency provider span covers three provider slots', () => {
    const span = nrDashBuildDependencyProviderSpan(createAgent23NsFixture())!;
    return span.distinctProviders === 3 && span.spanRatio === 0.375;
  });

  check('a23_economy_resilience_span', 'Economy resilience span is flat on uniform fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildEconomyResilienceSpan(snap)!;
    return span.driftSpread === 0 && span.regionCount === 8;
  });

  check('a23_corridor_pulse_spread', 'Corridor pulse spread is positive on NSW hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const spread = nrDashBuildCorridorPulseSpread(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return spread.corridorCount > 0 && spread.stdDev > 0.01;
  });

  check('a23_history_turn_span', 'History turn span covers LR derived and NS history', () => {
    const span = nrDashBuildHistoryTurnSpan(createAgent23LrFixture(), createAgent23NsFixture())!;
    return span.eventCount === 2 && span.turnSpread === 1 && span.minTurn === 4;
  });

  check('a23_moderate_needs_spread', 'Moderate needs spread is zero on uniform fixture', () => {
    const spread = nrDashBuildModerateNeedsSpread(createAgent23LrFixture())!;
    return spread.totalModerateNeeds === 8 && spread.stdDev === 0;
  });

  check('a23_national_history_gap', 'National history gap is zero when sources match snippets', () => {
    const lr = createAgent23LrFixture();
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildNationalHistoryGap(lr, ns, snap)!;
    return gap.sourceEventCount === 2 && gap.surfacedSnippetCount === 2 && gap.gap === 0;
  });

  check('a23_link_pulse_span', 'Link pulse span is positive on merged map links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const span = nrDashBuildLinkPulseSpan(links, nodes)!;
    return span.linkCount > 0 && span.intensitySpread > 0.02;
  });

  check('a23_owner_portfolio_span', 'Owner portfolio span is eight on all-unknown fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildOwnerPortfolioSpan(snap)!;
    return span.portfolioSpread === 8 && span.maxPortfolio === 8;
  });

  check('a23_constraint_band_span', 'Constraint band span is zero on uniform freight fixture', () => {
    const span = nrDashBuildConstraintBandSpan(createAgent23NsFixture())!;
    return span.rankSpread === 0 && span.regionCount === 8;
  });

  check('a23_derived_event_turn_span', 'Derived event turn span is zero on single major event', () => {
    const span = nrDashBuildDerivedEventTurnSpan(createAgent23LrFixture())!;
    return span.eventCount === 1 && span.turnSpread === 0 && span.minTurn === 4;
  });

  check('a23_critical_needs_spread', 'Critical needs spread is null without critical open needs', () =>
    nrDashBuildCriticalNeedsSpread(createAgent23LrFixture()) === null
  );

  check('a23_national_snippet_gap', 'National snippet gap reports unused dashboard slots', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNationalSnippetGap(snap)!;
    return gap.maxSnippets === 8 && gap.surfacedCount === 2 && gap.unusedSlots === 6;
  });

  check('a23_hub_pulse_span', 'Hub pulse span is positive on connectivity hubs', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildHubPulseSpan(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return span.hubRegionCount > 0 && span.intensitySpread > 0.02;
  });

  check('a23_rival_portfolio_span', 'Rival portfolio span tracks NSW rival ownership', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const span = nrDashBuildRivalPortfolioSpan(snap)!;
    return span.rivalCount === 1 && span.portfolioSpread === 1;
  });

  check('a23_network_condition_span', 'Network condition span is positive on strained fixture', () => {
    const span = nrDashBuildNetworkConditionSpan(createAgent23NsFixture())!;
    return span.cellCount === 40 && span.stdDev > 0.1;
  });

  check('a23_ns_history_turn_span', 'NS history turn span is zero on single entry fixture', () => {
    const span = nrDashBuildNsHistoryTurnSpan(createAgent23NsFixture())!;
    return span.eventCount === 1 && span.turnSpread === 0 && span.minTurn === 5;
  });

  check('a23_lr_history_turn_span', 'LR history turn span covers major derived on fixture', () => {
    const span = nrDashBuildLrHistoryTurnSpan(createAgent23LrFixture())!;
    return span.eventCount === 1 && span.turnSpread === 0 && span.minTurn === 4;
  });

  check('a23_open_needs_tier_spread', 'Open needs tier spread is zero on uniform moderate fixture', () => {
    const spread = nrDashBuildOpenNeedsTierSpread(createAgent23LrFixture())!;
    return spread.tierSpread === 0 && spread.maxTierCount === 8;
  });

  check('a23_snippet_saturation_share', 'Snippet saturation share matches surfaced buffer on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildSnippetSaturationShare(snap)!;
    return sat.maxSnippets === 8 && sat.snippetCount === 2 && sat.saturationShare === 0.25;
  });

  check('a23_pulse_asymmetry_gap', 'Pulse asymmetry gap is positive on NSW hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const gap = nrDashBuildPulseAsymmetryGap(nrDashBuildRegionMapNodes(snap))!;
    return gap.regionCount === 8 && gap.asymmetryGap > 0.02;
  });

  check('a23_regional_owner_skew', 'Regional owner skew favors player on NSW ownership fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const skew = nrDashBuildRegionalOwnerSkew(snap)!;
    return skew.ownershipSkew === 0.125 && skew.youShare === 0.125 && skew.rivalShare === 0;
  });

  check('a23_combined_derived_history_gap', 'Combined derived-history gap counts unsurfaced meaningful events', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 3, text: 'Minor tick', significance: 'meaningful' });
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildCombinedDerivedHistoryGap(lr, ns, snap)!;
    return gap.combinedSourceCount === 3 && gap.surfacedSnippetCount === 2 && gap.gap === 1;
  });

  check('a23_meaningful_derived_turn_span', 'Meaningful derived turn span spans fixture ticks', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Soft shift', significance: 'meaningful' });
    lr.state.derived.push({ turn: 6, text: 'Late note', significance: 'meaningful' });
    const span = nrDashBuildMeaningfulDerivedTurnSpan(lr)!;
    return span.eventCount === 2 && span.turnSpread === 4 && span.minTurn === 2;
  });

  check('a23_national_snippet_saturation_gap', 'National snippet saturation gap requires merged LR+NS snapshot', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNationalSnippetSaturationGap(snap)!;
    return gap.saturationGap === 6 && gap.headroomShare === 0.75 && gap.maxSnippets === 8;
  });

  check('a23_corridor_pulse_asymmetry', 'Corridor pulse asymmetry is positive on merged map fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildCorridorPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.corridorCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_neutral_owner_portfolio_skew', 'Neutral owner portfolio skew tracks neutral VIC fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { VIC: 'neutral' })!;
    const skew = nrDashBuildNeutralOwnerPortfolioSkew(snap)!;
    return skew.neutralShare === 0.125 && skew.portfolioSkew === 0.125;
  });

  check('a23_multi_tier_needs_concentration', 'Multi-tier needs concentration splits mixed severities', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'energy', status: 'open', severity: 'critical' });
    lr.state.regions.VIC!.needs[0]!.severity = 'low';
    const conc = nrDashBuildMultiTierNeedsConcentration(lr)!;
    return conc.activeTierCount === 3 && conc.concentrationIndex < 0.9 && conc.openNeedCount === 9;
  });

  check('a23_lr_ns_history_overlap_gap', 'LR–NS history overlap gap counts duplicate turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Same turn echo', significance: 'meaningful' });
    const gap = nrDashBuildLrNsHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.totalEntries === 3 && gap.uniqueTurnCount === 2 && gap.overlapGap === 1;
  });

  check('a23_unknown_owner_portfolio_skew', 'Unknown owner portfolio skew is one on default fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const skew = nrDashBuildUnknownOwnerPortfolioSkew(snap)!;
    return skew.unknownShare === 1 && skew.portfolioSkew === 1;
  });

  check('a23_high_tier_needs_concentration', 'High-tier needs concentration splits high and critical mix', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'security', status: 'open', severity: 'critical' });
    lr.state.regions.VIC!.needs.push({ category: 'trade', status: 'open', severity: 'high' });
    const conc = nrDashBuildHighTierNeedsConcentration(lr)!;
    return conc.highTierOpenCount === 2 && conc.activeHighTierSlots === 2 && conc.concentrationIndex === 0.5;
  });

  check('a23_link_pulse_asymmetry', 'Link pulse asymmetry is positive on merged map links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const asym = nrDashBuildLinkPulseAsymmetry(links, nodes)!;
    return asym.linkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_ns_only_snippet_headroom', 'NS-only snippet headroom reports four-slot lane', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const head = nrDashBuildNsOnlySnippetHeadroom(snap)!;
    return head.nsSnippetCap === 4 && head.surfacedCount === 1 && head.headroomSlots === 3;
  });

  check('a23_derived_major_overlap_gap', 'Derived-major overlap gap ignores meaningful derived turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Same turn echo', significance: 'meaningful' });
    const gap = nrDashBuildDerivedMajorOverlapGap(lr, createAgent23NsFixture())!;
    return gap.totalEntries === 2 && gap.overlapGap === 0;
  });

  check('a23_corridor_saturation_share', 'Corridor saturation share is below one on hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildCorridorSaturationShare(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return sat.corridorCount > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_rival_owner_portfolio_skew', 'Rival owner portfolio skew tracks NSW rival fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const skew = nrDashBuildRivalOwnerPortfolioSkew(snap)!;
    return skew.rivalShare === 0.125 && skew.portfolioSkew === 0.125;
  });

  check('a23_critical_tier_needs_concentration', 'Critical-tier needs concentration splits two-region fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'security', status: 'open', severity: 'critical' });
    lr.state.regions.VIC!.needs.push({ category: 'health', status: 'open', severity: 'critical' });
    const conc = nrDashBuildCriticalTierNeedsConcentration(lr)!;
    return conc.criticalOpenCount === 2 && conc.concentrationIndex === 0.5;
  });

  check('a23_hub_pulse_asymmetry', 'Hub pulse asymmetry is positive on connectivity hubs', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildHubPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.hubRegionCount > 0 && asym.asymmetryGap > 0.01;
  });

  check('a23_lr_only_snippet_headroom', 'LR-only snippet headroom reports three-slot major lane', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const head = nrDashBuildLrOnlySnippetHeadroom(snap)!;
    return head.lrSnippetCap === 3 && head.surfacedCount === 1 && head.headroomSlots === 2;
  });

  check('a23_meaningful_derived_overlap_gap', 'Meaningful-derived overlap gap counts duplicate NS turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Echo', significance: 'meaningful' });
    const gap = nrDashBuildMeaningfulDerivedOverlapGap(lr, createAgent23NsFixture())!;
    return gap.totalEntries === 2 && gap.uniqueTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_link_saturation_share', 'Link saturation share is below one on merged map links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildLinkSaturationShare(links, nodes)!;
    return sat.linkCount > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_you_owner_momentum_gap', 'You-owner momentum gap is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const gap = nrDashBuildYouOwnerMomentumGap(snap)!;
    return gap.ownedRegionCount === 1 && gap.momentumGap === 0;
  });

  check('a23_moderate_tier_needs_concentration', 'Moderate-tier needs concentration is uniform on fixture', () => {
    const conc = nrDashBuildModerateTierNeedsConcentration(createAgent23LrFixture())!;
    return conc.moderateOpenCount === 8 && conc.concentrationIndex === 0.125;
  });

  check('a23_map_pulse_saturation_share', 'Map pulse saturation share is below one on hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const sat = nrDashBuildMapPulseSaturationShare(nrDashBuildRegionMapNodes(snap))!;
    return sat.regionCount === 8 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_merged_snippet_overlap_gap', 'Merged snippet overlap gap counts duplicate snippet turns', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    snap.historySnippets.push(snap.historySnippets[0]!);
    const gap = nrDashBuildMergedSnippetOverlapGap(snap)!;
    return gap.snippetCount === 3 && gap.uniqueTurnCount === 2 && gap.overlapGap === 1;
  });

  check('a23_dependency_pulse_asymmetry', 'Dependency pulse asymmetry is positive on dependency links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const asym = nrDashBuildDependencyPulseAsymmetry(links, nodes)!;
    return asym.linkCount === 3 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_border_corridor_saturation_share', 'Border corridor saturation share is below one on fixture', () => {
    const sat = nrDashBuildBorderCorridorSaturationShare(createAgent23NsFixture())!;
    return sat.borderRegionCount === 8 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_rival_owner_momentum_gap', 'Rival-owner momentum gap is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const gap = nrDashBuildRivalOwnerMomentumGap(snap)!;
    return gap.rivalRegionCount === 1 && gap.momentumGap === 0;
  });

  check('a23_low_tier_needs_concentration', 'Low-tier needs concentration splits two-region fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'water', status: 'open', severity: 'low' });
    lr.state.regions.VIC!.needs.push({ category: 'trade', status: 'open', severity: 'low' });
    const conc = nrDashBuildLowTierNeedsConcentration(lr)!;
    return conc.lowOpenCount === 2 && conc.concentrationIndex === 0.5;
  });

  check('a23_adjacency_pulse_asymmetry', 'Adjacency pulse asymmetry is positive on land links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const asym = nrDashBuildAdjacencyPulseAsymmetry(links, nodes)!;
    return asym.linkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_snippet_turn_span', 'Snippet turn span covers merged LR and NS snippets', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildSnippetTurnSpan(snap)!;
    return span.snippetCount === 2 && span.turnSpread === 1 && span.minTurn === 4;
  });

  check('a23_hub_corridor_saturation_share', 'Hub corridor saturation share is below one on fixture', () => {
    const sat = nrDashBuildHubCorridorSaturationShare(createAgent23NsFixture())!;
    return sat.touchingLinkCount > 0 && sat.saturationShare > 0 && sat.saturationShare <= 1;
  });

  check('a23_national_derived_overlap_gap', 'National derived overlap gap counts same-turn NS and LR entries', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'National echo', significance: 'major' });
    const gap = nrDashBuildNationalDerivedOverlapGap(lr, createAgent23NsFixture())!;
    return gap.nationalTurn === 5 && gap.nsEntryCount === 1 && gap.derivedEntryCount === 1 && gap.overlapGap === 1;
  });

  check('a23_neutral_owner_momentum_gap', 'Neutral-owner momentum gap is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { VIC: 'neutral' })!;
    const gap = nrDashBuildNeutralOwnerMomentumGap(snap)!;
    return gap.neutralRegionCount === 1 && gap.momentumGap === 0;
  });

  check('a23_open_needs_severity_span', 'Open needs severity span separates critical NSW fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'security', status: 'open', severity: 'critical' });
    const span = nrDashBuildOpenNeedsSeveritySpan(lr)!;
    return span.severitySpread === 2 && span.maxSeverityRank === 3;
  });

  check('a23_peripheral_pulse_asymmetry', 'Peripheral pulse asymmetry is positive off-hub links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildPeripheralPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.peripheralLinkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_history_snippet_turn_gap', 'History snippet turn gap is zero when spans align', () => {
    const lr = createAgent23LrFixture();
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildHistorySnippetTurnGap(lr, ns, snap)!;
    return gap.sourceTurnSpread === 1 && gap.snippetTurnSpread === 1 && gap.turnGap === 0;
  });

  check('a23_dependency_corridor_saturation_share', 'Dependency corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildDependencyCorridorSaturationShare(links, nodes)!;
    return sat.linkCount === 3 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_lr_major_snippet_overlap_gap', 'LR major snippet overlap gap counts duplicate major turns', () => {
    const lr = createAgent23LrFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    const gap = nrDashBuildLrMajorSnippetOverlapGap(lr, snap)!;
    return gap.majorEventCount === 1 && gap.snippetTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_unknown_owner_momentum_gap', 'Unknown-owner momentum gap is zero on default unknown fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const gap = nrDashBuildUnknownOwnerMomentumGap(snap)!;
    return gap.unknownRegionCount === 8 && gap.momentumGap === 0;
  });

  check('a23_regional_needs_severity_concentration', 'Regional needs severity concentration is uniform on fixture', () => {
    const conc = nrDashBuildRegionalNeedsSeverityConcentration(createAgent23LrFixture())!;
    return conc.weightedSeverityTotal === 16 && conc.concentrationIndex === 0.125;
  });

  check('a23_hub_peripheral_saturation_share', 'Hub peripheral saturation share is below one on fixture', () => {
    const sat = nrDashBuildHubPeripheralSaturationShare(createAgent23NsFixture())!;
    return sat.hubMeanStress > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_snippet_source_turn_gap', 'Snippet source turn gap counts unsurfaced derived events', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Tick', significance: 'meaningful' });
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildSnippetSourceTurnGap(lr, ns, snap)!;
    return gap.sourceEventCount === 3 && gap.snippetLabelCount === 2 && gap.sourceTurnGap === 1;
  });

  check('a23_adjacency_corridor_saturation_share', 'Adjacency corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildAdjacencyCorridorSaturationShare(links, nodes)!;
    return sat.linkCount > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_ns_history_snippet_overlap_gap', 'NS history snippet overlap gap counts duplicate NS turns', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNsHistorySnippetOverlapGap(createAgent23NsFixture(), snap)!;
    return gap.nsHistoryCount === 1 && gap.matchingSnippetCount === 1 && gap.overlapGap === 1;
  });

  check('a23_owned_open_needs_momentum_skew_gap', 'Owned open-needs momentum skew gap is zero on uniform NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const gap = nrDashBuildOwnedOpenNeedsMomentumSkewGap(snap)!;
    return gap.ownedRegionCount === 1 && gap.portfolioSkewGap === 0;
  });

  check('a23_national_severity_tier_spread', 'National severity tier spread separates low VIC fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.VIC!.needs[0]!.severity = 'low';
    const spread = nrDashBuildNationalSeverityTierSpread(lr)!;
    return spread.tierSpread > 0 && spread.maxMeanRank > spread.minMeanRank;
  });

  check('a23_chokepoint_pulse_asymmetry', 'Chokepoint pulse asymmetry is positive on dependency endpoints', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildChokepointPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.chokepointCount === 3 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_lr_derived_snippet_turn_gap', 'LR derived snippet turn gap counts unsurfaced derived turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Early', significance: 'meaningful' });
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    const gap = nrDashBuildLrDerivedSnippetTurnGap(lr, snap)!;
    return gap.derivedTurnSpread === 2 && gap.lrSnippetTurnSpread === 0 && gap.turnGap === 2;
  });

  check('a23_merged_corridor_saturation_share', 'Merged corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildMergedCorridorSaturationShare(links, nodes)!;
    return sat.linkCount > 3 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_major_history_overlap_gap', 'Major-history overlap gap counts shared NS and major turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'National beat', significance: 'major' });
    const gap = nrDashBuildMajorHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.sharedTurnCount === 1 && gap.overlapGap === 1;
  });

  return results;
}

/** Merge hook name expected by Agent 25 assembly. */
export function runAgent23NationalRegionalDashboardSelfTests(): Agent23TestResult[] {
  return runAgent23SelfTests();
}
