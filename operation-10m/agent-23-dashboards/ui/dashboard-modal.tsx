import React, { useEffect, useMemo, useState } from 'react';
import { nrDashBuildAuthSnapshot } from '../core/auth-snapshot.ts';
import { nrDashBuildCompareInsights } from '../core/analytics.ts';
import { nrDashBuildConditionCatalog } from '../core/condition-catalog.ts';
import { nrDashBuildMomentumDivergence } from '../core/momentum-divergence.ts';
import { nrDashApplyMapFocus, nrDashLinksTouchingRegion } from '../core/map-focus.ts';
import { nrDashTopTrendMovers } from '../core/trend-delta.ts';
import { AGENT23_REGION_MAP_LAYOUT } from '../core/constants.ts';
import { nrDashBuildHeatCells } from '../core/heat-matrix.ts';
import {
  nrDashBuildAdjacencyLinks,
  nrDashBuildDependencyLinks,
  nrDashMergeMapLinks,
} from '../core/map-links.ts';
import { nrDashBuildRegionMapNodes } from '../core/region-map-model.ts';
import { nrDashBuildBottleneckRollup } from '../core/bottleneck-rollup.ts';
import { nrDashBuildConstraintProfile } from '../core/constraint-profile.ts';
import { nrDashBuildDependencyProfile } from '../core/dependency-profile.ts';
import { nrDashBuildHeatRowSummaries } from '../core/heat-summary.ts';
import { nrDashTopParityOutliers } from '../core/parity-gap.ts';
import { nrDashBuildResilienceSpread } from '../core/resilience-spread.ts';
import { nrDashTopCorridorStress } from '../core/corridor-stress.ts';
import { nrDashBuildNetworkCoupling } from '../core/network-coupling.ts';
import { nrDashTopDependencyChokepoints } from '../core/dependency-chokepoint.ts';
import { nrDashBuildNeedsImbalance } from '../core/needs-imbalance.ts';
import { nrDashApplyMapPulse, nrDashHottestPulseRegion } from '../core/map-pulse.ts';
import { nrDashBuildRiskExposure } from '../core/risk-exposure.ts';
import { nrDashBuildUtilizationSkew } from '../core/utilization-skew.ts';
import { nrDashTopTensionOutliers } from '../core/momentum-resilience-tension.ts';
import { nrDashEnrichMapLinkStress, nrDashHottestMapLinkStress } from '../core/link-stress.ts';
import { nrDashPrimaryMapHub, nrDashTopMapHubs } from '../core/map-hub-index.ts';
import { nrDashBuildCapacityHeadroom } from '../core/capacity-headroom.ts';
import { nrDashBuildStrainDiversity } from '../core/strain-diversity.ts';
import { nrDashBuildOwnerStressGap } from '../core/owner-stress-gap.ts';
import { nrDashTopPeripheralRegions } from '../core/peripheral-isolation.ts';
import { nrDashBuildTrendCoherence } from '../core/trend-coherence.ts';
import { nrDashHottestBorderRegion, nrDashTopBorderStress } from '../core/border-stress.ts';
import { nrDashBuildOwnedMomentumSkew } from '../core/owned-momentum-skew.ts';
import { nrDashTopDependencyAsymmetry } from '../core/dependency-asymmetry.ts';
import { nrDashBuildBottleneckConcentration } from '../core/bottleneck-concentration.ts';
import { nrDashBuildUtilAlignmentDrift } from '../core/util-alignment-drift.ts';
import { nrDashBuildTrendAcceleration } from '../core/trend-acceleration.ts';
import { nrDashBuildHubCorridorLoad } from '../core/hub-corridor-load.ts';
import { nrDashBuildOpenNeedsConcentration } from '../core/open-needs-concentration.ts';
import { nrDashBuildCriticalCellDensity } from '../core/critical-cell-density.ts';
import { nrDashTopEconomyMomentumDrift, nrDashBuildEconomyMomentumDrift } from '../core/economy-momentum-drift.ts';
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
import { nrDashTopEconomyResilienceDrift, nrDashBuildEconomyResilienceDrift } from '../core/economy-resilience-drift.ts';
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
import { nrDashBuildRivalOpenNeedsSkewGap } from '../core/rival-open-needs-skew-gap.ts';
import { nrDashBuildPeakSeverityConcentration } from '../core/peak-severity-concentration.ts';
import { nrDashBuildBorderPulseAsymmetry } from '../core/border-pulse-asymmetry.ts';
import { nrDashBuildNsSnippetSourceGap } from '../core/ns-snippet-source-gap.ts';
import { nrDashBuildHubLinkSaturationShare } from '../core/hub-link-saturation-share.ts';
import { nrDashBuildMeaningfulHistoryOverlapGap } from '../core/meaningful-history-overlap-gap.ts';
import { nrDashBuildYouOpenNeedsSkewGap } from '../core/you-open-needs-skew-gap.ts';
import { nrDashBuildNationalPeakTierSpread } from '../core/national-peak-tier-spread.ts';
import { nrDashBuildChokepointCorridorSaturationShare } from '../core/chokepoint-corridor-saturation-share.ts';
import { nrDashBuildLrDerivedSnippetSourceGap } from '../core/lr-derived-snippet-source-gap.ts';
import { nrDashBuildPeripheralLinkSaturationShare } from '../core/peripheral-link-saturation-share.ts';
import { nrDashBuildNsMajorHistoryOverlapGap } from '../core/ns-major-history-overlap-gap.ts';
import { nrDashBuildNeutralOpenNeedsSkewGap } from '../core/neutral-open-needs-skew-gap.ts';
import { nrDashBuildNationalOpenNeedsPeakSpread } from '../core/national-open-needs-peak-spread.ts';
import { nrDashBuildDependencyLinkSaturationShare } from '../core/dependency-link-saturation-share.ts';
import { nrDashBuildNsDerivedSnippetSourceGap } from '../core/ns-derived-snippet-source-gap.ts';
import { nrDashBuildRimCorridorSaturationShare } from '../core/rim-corridor-saturation-share.ts';
import { nrDashBuildCriticalHistoryOverlapGap } from '../core/critical-history-overlap-gap.ts';
import { nrDashBuildUnknownOpenNeedsSkewGap } from '../core/unknown-open-needs-skew-gap.ts';
import { nrDashBuildRegionalPeakSeveritySpread } from '../core/regional-peak-severity-spread.ts';
import { nrDashBuildAdjacencyLinkSaturationShare } from '../core/adjacency-link-saturation-share.ts';
import { nrDashBuildCombinedSnippetSourceGap } from '../core/combined-snippet-source-gap.ts';
import { nrDashBuildHubRimPulseAsymmetry } from '../core/hub-rim-pulse-asymmetry.ts';
import { nrDashBuildMajorDerivedHistoryOverlapGap } from '../core/major-derived-history-overlap-gap.ts';
import { nrDashBuildRivalOpenNeedsPeakSpread } from '../core/rival-open-needs-peak-spread.ts';
import { nrDashBuildNationalSeverityPeakConcentration } from '../core/national-severity-peak-concentration.ts';
import { nrDashBuildBorderLinkSaturationShare } from '../core/border-link-saturation-share.ts';
import { nrDashBuildLrMajorSnippetSourceGap } from '../core/lr-major-snippet-source-gap.ts';
import { nrDashBuildMergedRimPulseAsymmetry } from '../core/merged-rim-pulse-asymmetry.ts';
import { nrDashBuildMeaningfulDerivedHistoryOverlapGap } from '../core/meaningful-derived-history-overlap-gap.ts';
import {
  NATIONAL_NETWORKS,
  NATIONAL_NETWORK_ICON,
  NATIONAL_NETWORK_LABEL,
  NR_DASH_COND_COLOR,
  NR_DASH_TAB_LABELS,
  NR_DASH_TAB_ORDER,
} from '../core/constants.ts';
import { nrDashOwnerLabel } from '../core/util.ts';
import type {
  LivingRegionsWorldView,
  NationalNetworkKind,
  NationalSystemsState,
  NationalSystemsWorldView,
  NrDashAuthSnapshot,
  NrDashProvenance,
  NrDashTabId,
} from '../types.ts';
import { NrDashBarChart, NrDashHeatMatrix, NrDashSparkline } from './charts.tsx';
import { NrDashCompareInsightsPanel } from './compare-insights.tsx';
import { NrDashMapLegend } from './map-legend.tsx';
import { NrDashNetworkDepthPanel } from './network-depth-panel.tsx';
import { NrDashRegionsDepthStrip } from './regions-depth-strip.tsx';
import { NrDashCorridorStressStrip } from './corridor-stress-strip.tsx';
import { NrDashNeedsImbalanceCard } from './needs-imbalance-card.tsx';
import { NrDashRiskExposureCard } from './risk-exposure-card.tsx';
import { NrDashUtilizationSkewStrip } from './utilization-skew-strip.tsx';
import { NrDashMapHubStrip } from './map-hub-strip.tsx';
import { NrDashCapacityHeadroomStrip } from './capacity-headroom-strip.tsx';
import { NrDashOwnerStressGapCard } from './owner-stress-gap-card.tsx';
import { NrDashPeripheralIsolationStrip } from './peripheral-isolation-strip.tsx';
import { NrDashBorderStressStrip } from './border-stress-strip.tsx';
import { NrDashOwnedMomentumSkewCard } from './owned-momentum-skew-card.tsx';
import { NrDashDependencyAsymmetryStrip } from './dependency-asymmetry-strip.tsx';
import { NrDashUtilAlignmentStrip } from './util-alignment-strip.tsx';
import { NrDashOpenNeedsConcentrationCard } from './open-needs-concentration-card.tsx';
import { NrDashRiskExposureConcentrationCard } from './risk-exposure-concentration-card.tsx';
import { NrDashEconomyMomentumDriftStrip } from './economy-momentum-drift-strip.tsx';
import { RegionPositionMap } from './region-position-map.tsx';

const NrDashProvenanceStrip: React.FC<{ items: NrDashProvenance[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2 text-[10px] opacity-75" data-testid="nr-dash-provenance">
    {items.map((p, i) => (
      <span key={`${p.source}_${i}`} className="px-1.5 py-0.5 rounded border border-slate-600">
        {p.source === 'living_regions' ? '🗺 LR' : '🔗 NS'} rev {String(p.revision ?? '—')} · {p.detail}
      </span>
    ))}
  </div>
);

export const NrDashOverviewTab: React.FC<{
  snap: NrDashAuthSnapshot;
  nsState: NationalSystemsState | null;
  lrView: LivingRegionsWorldView | null;
  onAsk?: (q: string) => void;
}> = ({ snap, nsState, lrView, onAsk }) => (
  <div className="space-y-4" data-testid="nr-dash-tab-overview">
    <NrDashProvenanceStrip items={snap.provenance} />
    <NrDashCompareInsightsPanel
      insights={nrDashBuildCompareInsights(snap, nsState)}
      divergence={nrDashBuildMomentumDivergence(snap)}
      conditionBuckets={nrDashBuildConditionCatalog(nsState)}
    />
    <NrDashNeedsImbalanceCard imbalance={nrDashBuildNeedsImbalance(snap)} />
    <NrDashOpenNeedsConcentrationCard conc={nrDashBuildOpenNeedsConcentration(snap)} />
    <NrDashRiskExposureCard exposure={nrDashBuildRiskExposure(snap)} />
    <NrDashRiskExposureConcentrationCard conc={nrDashBuildRiskExposureConcentration(snap)} />
    {(() => {
      const density = nrDashBuildHighRiskRegionDensity(snap);
      return density ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-risk-density">
          High-risk region density {density.density} · {density.highRiskRegionCount}/{density.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const conc = nrDashBuildHighRiskConcentration(snap);
      return conc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-risk-concentration">
          High-risk concentration {conc.concentrationIndex} · top {conc.topRegionId ?? '—'} ({conc.totalHighRisks} risks)
        </div>
      ) : null;
    })()}
    {(() => {
      const riskSpread = nrDashBuildHighRiskSpread(snap);
      return riskSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-risk-spread">
          High-risk spread σ {riskSpread.stdDev} · μ {riskSpread.meanHighRisks} across {riskSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    <NrDashOwnerStressGapCard gap={nrDashBuildOwnerStressGap(snap)} />
    <NrDashOwnedMomentumSkewCard skew={nrDashBuildOwnedMomentumSkew(snap)} />
    {(() => {
      const ownedShare = nrDashBuildOwnedRiskExposureShare(snap);
      return ownedShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-risk-share">
          Owned risk exposure share {ownedShare.ownedShare} · {ownedShare.ownedExposure}/{ownedShare.totalExposure} index
        </div>
      ) : null;
    })()}
    {(() => {
      const pressure = nrDashBuildNationalNeedsPressure(snap);
      return pressure ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-needs-pressure">
          National needs pressure {pressure.pressureIndex} · {pressure.totalOpenNeeds} open needs vs resilience{' '}
          {pressure.nationalResilience}
        </div>
      ) : null;
    })()}
    {(() => {
      const utilConc = nrDashBuildNetworkUtilConcentration(snap);
      return utilConc && nsState ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-util-concentration">
          Network util concentration {utilConc.concentrationIndex} · top {utilConc.topNetwork ?? '—'} (
          {Math.round(utilConc.topNetworkShare * 100)}%)
        </div>
      ) : null;
    })()}
    {(() => {
      const ownedRes = nrDashBuildOwnedResilienceShare(snap);
      return ownedRes ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-resilience-share">
          Owned resilience share {ownedRes.ownedShare} · {ownedRes.ownedResilience}/{ownedRes.totalResilience}
        </div>
      ) : null;
    })()}
    {(() => {
      const needsShare = nrDashBuildOwnedOpenNeedsShare(snap);
      return needsShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-open-needs-share">
          Owned open-needs share {needsShare.ownedShare} · {needsShare.ownedOpenNeeds}/{needsShare.totalOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const youNeedsSkew = nrDashBuildYouOpenNeedsSkewGap(snap);
      return youNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-you-open-needs-skew-gap">
          You open-needs skew gap {youNeedsSkew.openNeedsSkewGap} · ownership skew {youNeedsSkew.ownershipSkew} · you μ{' '}
          {youNeedsSkew.youMeanOpenNeeds} vs national μ {youNeedsSkew.nationalMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const skewGap = nrDashBuildOwnedOpenNeedsMomentumSkewGap(snap);
      return skewGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-open-needs-momentum-skew-gap">
          Owned open-needs momentum skew gap {skewGap.portfolioSkewGap} · needs Δ {skewGap.openNeedsGap} · momentum Δ{' '}
          {skewGap.momentumGap}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalShare = nrDashBuildRivalRiskExposureShare(snap);
      return rivalShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-risk-share">
          Rival risk exposure share {rivalShare.rivalShare} · {rivalShare.rivalExposure}/{rivalShare.totalExposure} index
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalNeedsSkew = nrDashBuildRivalOpenNeedsSkewGap(snap);
      return rivalNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-open-needs-skew-gap">
          Rival open-needs skew gap {rivalNeedsSkew.openNeedsSkewGap} · ownership skew {rivalNeedsSkew.ownershipSkew} · rival μ{' '}
          {rivalNeedsSkew.rivalMeanOpenNeeds} vs national μ {rivalNeedsSkew.nationalMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalNeedsPeak = nrDashBuildRivalOpenNeedsPeakSpread(snap);
      return rivalNeedsPeak && rivalNeedsPeak.peakSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-open-needs-peak-spread">
          Rival open-needs peak spread {rivalNeedsPeak.peakSpread} · {rivalNeedsPeak.minOpenNeeds}–{rivalNeedsPeak.maxOpenNeeds}{' '}
          across {rivalNeedsPeak.rivalRegionCount} rival regions
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralShare = nrDashBuildNeutralRiskExposureShare(snap);
      return neutralShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-risk-share">
          Neutral risk exposure share {neutralShare.neutralShare} · {neutralShare.neutralExposure}/{neutralShare.totalExposure}{' '}
          index
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralNeedsSkew = nrDashBuildNeutralOpenNeedsSkewGap(snap);
      return neutralNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-open-needs-skew-gap">
          Neutral open-needs skew gap {neutralNeedsSkew.openNeedsSkewGap} · ownership skew {neutralNeedsSkew.ownershipSkew} ·
          neutral μ {neutralNeedsSkew.neutralMeanOpenNeeds} vs national μ {neutralNeedsSkew.nationalMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const ownerConc = nrDashBuildOwnerConcentrationIndex(snap);
      return ownerConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owner-concentration">
          Owner concentration {ownerConc.concentrationIndex} · dominant {nrDashOwnerLabel(ownerConc.dominantOwner)} (
          {Math.round(ownerConc.dominantShare * 100)}%)
        </div>
      ) : null;
    })()}
    {(() => {
      const portfolioSpan = nrDashBuildOwnerPortfolioSpan(snap);
      return portfolioSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owner-portfolio-span">
          Owner portfolio span {portfolioSpan.portfolioSpread} · min {portfolioSpan.minPortfolio} · max{' '}
          {portfolioSpan.maxPortfolio} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const derivedLoad = nrDashBuildDerivedEventLoad(lrView);
      return derivedLoad ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-derived-event-load">
          Derived event load {derivedLoad.eventCount} · {derivedLoad.majorCount} major · latest R{derivedLoad.latestTurn ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const criticalShare = nrDashBuildCriticalNeedsShare(lrView);
      return criticalShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-needs-share">
          Critical needs share {criticalShare.criticalShare} · {criticalShare.criticalCount}/{criticalShare.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const highShare = nrDashBuildHighNeedsShare(lrView);
      return highShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-needs-share">
          High needs share {highShare.highShare} · {highShare.highCount}/{highShare.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const lowShare = nrDashBuildLowNeedsShare(lrView);
      return lowShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-low-needs-share">
          Low needs share {lowShare.lowShare} · {lowShare.lowCount}/{lowShare.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const critRisk = nrDashBuildCriticalRiskShare(lrView);
      return critRisk ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-risk-share">
          Critical risk share {critRisk.criticalShare} · {critRisk.criticalCount}/{critRisk.riskCount} risks
        </div>
      ) : null;
    })()}
    {(() => {
      const modRisk = nrDashBuildModerateRiskShare(lrView);
      return modRisk ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-moderate-risk-share">
          Moderate risk share {modRisk.moderateShare} · {modRisk.moderateCount}/{modRisk.riskCount} risks
        </div>
      ) : null;
    })()}
    {(() => {
      const lowRisk = nrDashBuildLowRiskShare(lrView);
      return lowRisk ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-low-risk-share">
          Low risk share {lowRisk.lowShare} · {lowRisk.lowCount}/{lowRisk.riskCount} risks
        </div>
      ) : null;
    })()}
    {(() => {
      const bnGap = nrDashBuildNationalBottleneckGap(nsState);
      return bnGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-bottleneck-gap">
          National bottleneck gap {bnGap.gap} · national bars {bnGap.nationalBarTotal} vs list {bnGap.activeListCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const depGap = nrDashBuildNationalDependencyGap(nsState, snap);
      return depGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-dependency-gap">
          National dependency gap {depGap.gap} · list {depGap.listCount} vs snapshot {depGap.snapshotCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const needsSpread = nrDashBuildOpenNeedsSpread(snap);
      return needsSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-spread">
          Open needs spread σ {needsSpread.stdDev} · μ {needsSpread.meanOpenNeeds} across {needsSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const needsPeakSpread = nrDashBuildNationalOpenNeedsPeakSpread(snap);
      return needsPeakSpread && needsPeakSpread.peakSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-open-needs-peak-spread">
          National open-needs peak spread {needsPeakSpread.peakSpread} · {needsPeakSpread.minOpenNeeds}–
          {needsPeakSpread.maxOpenNeeds} across {needsPeakSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const modNeedsSpread = nrDashBuildModerateNeedsSpread(lrView);
      return modNeedsSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-moderate-needs-spread">
          Moderate needs spread σ {modNeedsSpread.stdDev} · μ {modNeedsSpread.meanModerateNeeds} across{' '}
          {modNeedsSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const critNeedsSpread = nrDashBuildCriticalNeedsSpread(lrView);
      return critNeedsSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-needs-spread-metric">
          Critical needs spread σ {critNeedsSpread.stdDev} · μ {critNeedsSpread.meanCriticalNeeds} across{' '}
          {critNeedsSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const resGap = nrDashBuildNationalResilienceGap(snap);
      return resGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-resilience-gap">
          National resilience gap {resGap.gap} · national {resGap.nationalScore} vs regional μ {resGap.regionalMean}
        </div>
      ) : null;
    })()}
    {(() => {
      const utilGap = nrDashBuildNationalUtilizationGap(nsState);
      return utilGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-utilization-gap">
          National utilization gap {utilGap.gap} · national μ {utilGap.nationalMean} vs regional μ {utilGap.regionalMean}
        </div>
      ) : null;
    })()}
    {(() => {
      const condGap = nrDashBuildNationalConditionGap(nsState);
      return condGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-condition-gap">
          National condition gap {condGap.gap} · national rank μ {condGap.nationalMeanRank} vs regional μ{' '}
          {condGap.regionalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const historyLoad = nrDashBuildHistorySnippetLoad(snap);
      return historyLoad && historyLoad.snippetCount > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-snippet-load">
          History snippet load {historyLoad.loadRatio} · {historyLoad.snippetCount}/{historyLoad.maxSnippets} slots
        </div>
      ) : null;
    })()}
    {(() => {
      const histGap = nrDashBuildNationalHistoryGap(lrView, nsState, snap);
      return histGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-history-gap">
          National history gap {histGap.gap} · sources {histGap.sourceEventCount} vs surfaced {histGap.surfacedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const snippetGap = nrDashBuildNationalSnippetGap(snap);
      return snippetGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-snippet-gap">
          National snippet gap {snippetGap.unusedSlots} unused · {snippetGap.surfacedCount}/{snippetGap.maxSnippets} slots
        </div>
      ) : null;
    })()}
    {(() => {
      const saturation = nrDashBuildSnippetSaturationShare(snap);
      return saturation ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-snippet-saturation-share">
          Snippet saturation {saturation.saturationShare} · {saturation.snippetCount}/{saturation.maxSnippets} buffer
        </div>
      ) : null;
    })()}
    {(() => {
      const combinedGap = nrDashBuildCombinedDerivedHistoryGap(lrView, nsState, snap);
      return combinedGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-combined-derived-history-gap">
          Combined derived-history gap {combinedGap.gap} · sources {combinedGap.combinedSourceCount} vs surfaced{' '}
          {combinedGap.surfacedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const tierSpread = nrDashBuildOpenNeedsTierSpread(lrView);
      return tierSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-tier-spread">
          Open needs tier spread {tierSpread.tierSpread} · tier counts {tierSpread.minTierCount}–{tierSpread.maxTierCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const ownerSkew = nrDashBuildRegionalOwnerSkew(snap);
      return ownerSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-owner-skew">
          Regional owner skew {ownerSkew.ownershipSkew} · you {ownerSkew.youShare} · rival {ownerSkew.rivalShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralSkew = nrDashBuildNeutralOwnerPortfolioSkew(snap);
      return neutralSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-owner-portfolio-skew">
          Neutral owner portfolio skew {neutralSkew.portfolioSkew} · neutral {neutralSkew.neutralShare} · you{' '}
          {neutralSkew.youShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const tierConc = nrDashBuildMultiTierNeedsConcentration(lrView);
      return tierConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-multi-tier-needs-concentration">
          Multi-tier needs concentration {tierConc.concentrationIndex} · {tierConc.activeTierCount} tiers ·{' '}
          {tierConc.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const satGap = nrDashBuildNationalSnippetSaturationGap(snap);
      return satGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-snippet-saturation-gap">
          National snippet saturation gap {satGap.saturationGap} · headroom {satGap.headroomShare} · {satGap.snippetCount}/
          {satGap.maxSnippets}
        </div>
      ) : null;
    })()}
    {(() => {
      const overlapGap = nrDashBuildLrNsHistoryOverlapGap(lrView, nsState);
      return overlapGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-ns-history-overlap-gap">
          LR–NS history overlap gap {overlapGap.overlapGap} · {overlapGap.totalEntries} entries · {overlapGap.uniqueTurnCount}{' '}
          unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const majorOverlap = nrDashBuildDerivedMajorOverlapGap(lrView, nsState);
      return majorOverlap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-derived-major-overlap-gap">
          Derived-major overlap gap {majorOverlap.overlapGap} · {majorOverlap.totalEntries} entries ·{' '}
          {majorOverlap.uniqueTurnCount} unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const nsHeadroom = nrDashBuildNsOnlySnippetHeadroom(snap);
      return nsHeadroom ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-only-snippet-headroom">
          NS-only snippet headroom {nsHeadroom.headroomSlots} · share {nsHeadroom.headroomShare} · {nsHeadroom.surfacedCount}/
          {nsHeadroom.nsSnippetCap}
        </div>
      ) : null;
    })()}
    {(() => {
      const unknownSkew = nrDashBuildUnknownOwnerPortfolioSkew(snap);
      return unknownSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-unknown-owner-portfolio-skew">
          Unknown owner portfolio skew {unknownSkew.portfolioSkew} · unknown {unknownSkew.unknownShare} · you{' '}
          {unknownSkew.youShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const unknownNeedsSkew = nrDashBuildUnknownOpenNeedsSkewGap(snap);
      return unknownNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-unknown-open-needs-skew-gap">
          Unknown open-needs skew gap {unknownNeedsSkew.openNeedsSkewGap} · ownership skew {unknownNeedsSkew.ownershipSkew}{' '}
          · unknown μ {unknownNeedsSkew.unknownMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const highConc = nrDashBuildHighTierNeedsConcentration(lrView);
      return highConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-tier-needs-concentration">
          High-tier needs concentration {highConc.concentrationIndex} · {highConc.activeHighTierSlots} slots ·{' '}
          {highConc.highTierOpenCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const critConc = nrDashBuildCriticalTierNeedsConcentration(lrView);
      return critConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-tier-needs-concentration">
          Critical-tier needs concentration {critConc.concentrationIndex} · {critConc.criticalOpenCount} critical across{' '}
          {critConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const lrHeadroom = nrDashBuildLrOnlySnippetHeadroom(snap);
      return lrHeadroom ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-only-snippet-headroom">
          LR-only snippet headroom {lrHeadroom.headroomSlots} · share {lrHeadroom.headroomShare} · {lrHeadroom.surfacedCount}/
          {lrHeadroom.lrSnippetCap}
        </div>
      ) : null;
    })()}
    {(() => {
      const meaningfulOverlap = nrDashBuildMeaningfulDerivedOverlapGap(lrView, nsState);
      return meaningfulOverlap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-derived-overlap-gap">
          Meaningful-derived overlap gap {meaningfulOverlap.overlapGap} · {meaningfulOverlap.totalEntries} entries ·{' '}
          {meaningfulOverlap.uniqueTurnCount} unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalSkew = nrDashBuildRivalOwnerPortfolioSkew(snap);
      return rivalSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-owner-portfolio-skew">
          Rival owner portfolio skew {rivalSkew.portfolioSkew} · rival {rivalSkew.rivalShare} · you {rivalSkew.youShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const youMomGap = nrDashBuildYouOwnerMomentumGap(snap);
      return youMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-you-owner-momentum-gap">
          You-owner momentum gap {youMomGap.momentumGap} · owned μ {youMomGap.ownedMeanRank} · national μ{' '}
          {youMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalMomGap = nrDashBuildRivalOwnerMomentumGap(snap);
      return rivalMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-owner-momentum-gap">
          Rival-owner momentum gap {rivalMomGap.momentumGap} · rival μ {rivalMomGap.rivalMeanRank} · national μ{' '}
          {rivalMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralMomGap = nrDashBuildNeutralOwnerMomentumGap(snap);
      return neutralMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-owner-momentum-gap">
          Neutral-owner momentum gap {neutralMomGap.momentumGap} · neutral μ {neutralMomGap.neutralMeanRank} · national μ{' '}
          {neutralMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const unknownMomGap = nrDashBuildUnknownOwnerMomentumGap(snap);
      return unknownMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-unknown-owner-momentum-gap">
          Unknown-owner momentum gap {unknownMomGap.momentumGap} · unknown μ {unknownMomGap.unknownMeanRank} · national μ{' '}
          {unknownMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const sevSpan = nrDashBuildOpenNeedsSeveritySpan(lrView);
      return sevSpan && sevSpan.severitySpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-severity-span">
          Open needs severity span {sevSpan.severitySpread} · rank {sevSpan.minSeverityRank}–{sevSpan.maxSeverityRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const regionalPeakSpread = nrDashBuildRegionalPeakSeveritySpread(lrView);
      return regionalPeakSpread && regionalPeakSpread.peakSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-peak-severity-spread">
          Regional peak severity spread {regionalPeakSpread.peakSpread} · peak rank {regionalPeakSpread.minPeakRank}–
          {regionalPeakSpread.maxPeakRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const sevConc = nrDashBuildRegionalNeedsSeverityConcentration(lrView);
      return sevConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-needs-severity-concentration">
          Regional needs severity concentration {sevConc.concentrationIndex} · weight {sevConc.weightedSeverityTotal} across{' '}
          {sevConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const tierSpread = nrDashBuildNationalSeverityTierSpread(lrView);
      return tierSpread && tierSpread.tierSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-severity-tier-spread">
          National severity tier spread {tierSpread.tierSpread} · mean rank {tierSpread.minMeanRank}–{tierSpread.maxMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const peakConc = nrDashBuildPeakSeverityConcentration(lrView);
      return peakConc && peakConc.concentrationIndex > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-peak-severity-concentration">
          Peak severity concentration {peakConc.concentrationIndex} · peak weight {peakConc.peakSeverityTotal} across{' '}
          {peakConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const nationalPeakConc = nrDashBuildNationalSeverityPeakConcentration(lrView);
      return nationalPeakConc && nationalPeakConc.concentrationIndex > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-severity-peak-concentration">
          National severity peak concentration {nationalPeakConc.concentrationIndex} · peak weight{' '}
          {nationalPeakConc.peakSeverityTotal}
        </div>
      ) : null;
    })()}
    {(() => {
      const peakTierSpread = nrDashBuildNationalPeakTierSpread(lrView);
      return peakTierSpread && peakTierSpread.tierSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-peak-tier-spread">
          National peak tier spread {peakTierSpread.tierSpread} · peak rank {peakTierSpread.minPeakRank}–
          {peakTierSpread.maxPeakRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const lowConc = nrDashBuildLowTierNeedsConcentration(lrView);
      return lowConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-low-tier-needs-concentration">
          Low-tier needs concentration {lowConc.concentrationIndex} · {lowConc.lowOpenCount} low across {lowConc.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const modConc = nrDashBuildModerateTierNeedsConcentration(lrView);
      return modConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-moderate-tier-needs-concentration">
          Moderate-tier needs concentration {modConc.concentrationIndex} · {modConc.moderateOpenCount} moderate across{' '}
          {modConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const snippetOverlap = nrDashBuildMergedSnippetOverlapGap(snap);
      return snippetOverlap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-merged-snippet-overlap-gap">
          Merged snippet overlap gap {snippetOverlap.overlapGap} · {snippetOverlap.snippetCount} snippets ·{' '}
          {snippetOverlap.uniqueTurnCount} unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const snippetTurnSpan = nrDashBuildSnippetTurnSpan(snap);
      return snippetTurnSpan && snippetTurnSpan.turnSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-snippet-turn-span">
          Snippet turn span {snippetTurnSpan.turnSpread} · R{snippetTurnSpan.minTurn}–R{snippetTurnSpan.maxTurn} ·{' '}
          {snippetTurnSpan.snippetCount} snippets
        </div>
      ) : null;
    })()}
    {(() => {
      const nationalDerivedGap = nrDashBuildNationalDerivedOverlapGap(lrView, nsState);
      return nationalDerivedGap && nationalDerivedGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-derived-overlap-gap">
          National derived overlap gap {nationalDerivedGap.overlapGap} · R{nationalDerivedGap.nationalTurn} · NS{' '}
          {nationalDerivedGap.nsEntryCount} · LR {nationalDerivedGap.derivedEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const histSnippetGap = nrDashBuildHistorySnippetTurnGap(lrView, nsState, snap);
      return histSnippetGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-snippet-turn-gap">
          History snippet turn gap {histSnippetGap.turnGap} · source {histSnippetGap.sourceTurnSpread} · snippet{' '}
          {histSnippetGap.snippetTurnSpread}
        </div>
      ) : null;
    })()}
    {(() => {
      const sourceGap = nrDashBuildSnippetSourceTurnGap(lrView, nsState, snap);
      return sourceGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-snippet-source-turn-gap">
          Snippet source turn gap {sourceGap.sourceTurnGap} · sources {sourceGap.sourceEventCount} · labels{' '}
          {sourceGap.snippetLabelCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const combinedSourceGap = nrDashBuildCombinedSnippetSourceGap(lrView, nsState, snap);
      return combinedSourceGap && combinedSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-combined-snippet-source-gap">
          Combined snippet source gap {combinedSourceGap.sourceGap} · sources {combinedSourceGap.combinedSourceCount} · matched{' '}
          {combinedSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsSourceGap = nrDashBuildNsSnippetSourceGap(nsState, snap);
      return nsSourceGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-snippet-source-gap">
          NS snippet source gap {nsSourceGap.sourceGap} · history {nsSourceGap.nsSourceCount} · matched{' '}
          {nsSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsDerivedSourceGap = nrDashBuildNsDerivedSnippetSourceGap(nsState, snap);
      return nsDerivedSourceGap && nsDerivedSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-derived-snippet-source-gap">
          NS derived snippet source gap {nsDerivedSourceGap.sourceGap} · derived {nsDerivedSourceGap.nsDerivedCount} · matched{' '}
          {nsDerivedSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsSnippetOverlap = nrDashBuildNsHistorySnippetOverlapGap(nsState, snap);
      return nsSnippetOverlap && nsSnippetOverlap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-history-snippet-overlap-gap">
          NS history snippet overlap gap {nsSnippetOverlap.overlapGap} · history {nsSnippetOverlap.nsHistoryCount} · matches{' '}
          {nsSnippetOverlap.matchingSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const majorSnippetGap = nrDashBuildLrMajorSnippetOverlapGap(lrView, snap);
      return majorSnippetGap && majorSnippetGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-major-snippet-overlap-gap">
          LR major snippet overlap gap {majorSnippetGap.overlapGap} · {majorSnippetGap.majorEventCount} majors ·{' '}
          {majorSnippetGap.snippetTurnCount} snippet hits
        </div>
      ) : null;
    })()}
    {(() => {
      const lrMajorSourceGap = nrDashBuildLrMajorSnippetSourceGap(lrView, snap);
      return lrMajorSourceGap && lrMajorSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-major-snippet-source-gap">
          LR major snippet source gap {lrMajorSourceGap.sourceGap} · majors {lrMajorSourceGap.majorSourceCount} · matched{' '}
          {lrMajorSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const lrDerivedGap = nrDashBuildLrDerivedSnippetTurnGap(lrView, snap);
      return lrDerivedGap && lrDerivedGap.turnGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-derived-snippet-turn-gap">
          LR derived snippet turn gap {lrDerivedGap.turnGap} · derived {lrDerivedGap.derivedTurnSpread} · snippet{' '}
          {lrDerivedGap.lrSnippetTurnSpread}
        </div>
      ) : null;
    })()}
    {(() => {
      const lrDerivedSourceGap = nrDashBuildLrDerivedSnippetSourceGap(lrView, snap);
      return lrDerivedSourceGap && lrDerivedSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-derived-snippet-source-gap">
          LR derived snippet source gap {lrDerivedSourceGap.sourceGap} · derived {lrDerivedSourceGap.derivedSourceCount} ·
          matched {lrDerivedSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const majorHistGap = nrDashBuildMajorHistoryOverlapGap(lrView, nsState);
      return majorHistGap && majorHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-major-history-overlap-gap">
          Major-history overlap gap {majorHistGap.overlapGap} · shared turns {majorHistGap.sharedTurnCount} · NS{' '}
          {majorHistGap.nsEntryCount} · majors {majorHistGap.majorEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsMajorHistGap = nrDashBuildNsMajorHistoryOverlapGap(lrView, nsState);
      return nsMajorHistGap && nsMajorHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-major-history-overlap-gap">
          NS major history overlap gap {nsMajorHistGap.overlapGap} · shared {nsMajorHistGap.sharedTurnCount} · NS{' '}
          {nsMajorHistGap.nsEntryCount} · majors {nsMajorHistGap.majorEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const meaningfulHistGap = nrDashBuildMeaningfulHistoryOverlapGap(lrView, nsState);
      return meaningfulHistGap && meaningfulHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-history-overlap-gap">
          Meaningful-history overlap gap {meaningfulHistGap.overlapGap} · shared {meaningfulHistGap.sharedTurnCount} · NS{' '}
          {meaningfulHistGap.nsEntryCount} · meaningful {meaningfulHistGap.meaningfulEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const meaningfulDerivedHistGap = nrDashBuildMeaningfulDerivedHistoryOverlapGap(lrView, nsState);
      return meaningfulDerivedHistGap && meaningfulDerivedHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-derived-history-overlap-gap">
          Meaningful-derived history overlap gap {meaningfulDerivedHistGap.overlapGap} · shared{' '}
          {meaningfulDerivedHistGap.sharedTurnCount} · NS {meaningfulDerivedHistGap.nsEntryCount} · derived{' '}
          {meaningfulDerivedHistGap.meaningfulDerivedCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const criticalHistGap = nrDashBuildCriticalHistoryOverlapGap(lrView, nsState);
      return criticalHistGap && criticalHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-history-overlap-gap">
          Critical-history overlap gap {criticalHistGap.overlapGap} · shared {criticalHistGap.sharedTurnCount} · NS{' '}
          {criticalHistGap.nsEntryCount} · critical {criticalHistGap.criticalEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const majorDerivedHistGap = nrDashBuildMajorDerivedHistoryOverlapGap(lrView, nsState);
      return majorDerivedHistGap && majorDerivedHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-major-derived-history-overlap-gap">
          Major-derived history overlap gap {majorDerivedHistGap.overlapGap} · shared {majorDerivedHistGap.sharedTurnCount} · NS{' '}
          {majorDerivedHistGap.nsEntryCount} · derived {majorDerivedHistGap.derivedEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalSpan = nrDashBuildRivalPortfolioSpan(snap);
      return rivalSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-portfolio-span">
          Rival portfolio span {rivalSpan.portfolioSpread} · you {rivalSpan.youCount} · rival {rivalSpan.rivalCount}
        </div>
      ) : null;
    })()}
    <div className="grid md:grid-cols-3 gap-3 text-sm">
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">National resilience</div>
        <div className="text-xl font-bold">{snap.nationalResilienceBand ?? '—'}</div>
        <div className="text-xs opacity-80">
          {snap.nationalResilience != null ? `${snap.nationalResilience}/100` : 'National Systems off'}
        </div>
      </div>
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">Active bottlenecks</div>
        <div className="text-xl font-bold">{snap.bottleneckCount}</div>
        {onAsk && (
          <button type="button" className="text-xs underline mt-1" onClick={() => onAsk('Where are the national bottlenecks?')}>
            Ask Game AI
          </button>
        )}
      </div>
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">Interregional dependencies</div>
        <div className="text-xl font-bold">{snap.dependencyCount}</div>
      </div>
    </div>
    {snap.networks.length > 0 && (
      <div>
        <h4 className="font-bold text-sm mb-2">Network utilization (authoritative)</h4>
        <NrDashBarChart
          items={snap.networks.map(n => ({
            key: n.network,
            label: `${n.icon} ${n.label}`,
            value: n.utilization,
            color: NR_DASH_COND_COLOR[n.condition],
          }))}
          maxValue={1}
        />
      </div>
    )}
  </div>
);

export const NrDashRegionsTab: React.FC<{
  snap: NrDashAuthSnapshot;
  nsState: NationalSystemsState | null;
  focusRegionId: string | null;
  onFocusRegion?: (id: string) => void;
}> = ({ snap, nsState, focusRegionId, onFocusRegion }) => (
  <div className="space-y-2" data-testid="nr-dash-tab-regions">
    <NrDashProvenanceStrip items={snap.provenance.filter(p => p.source === 'living_regions')} />
    {(() => {
      const tiers = nrDashBuildDevelopmentTierDiversity(snap);
      return tiers ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dev-tier-diversity">
          Development tier diversity {tiers.diversityIndex} · {tiers.distinctTiers} tiers · dominant {tiers.dominantTier ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const tierSpan = nrDashBuildDevelopmentTierSpan(snap);
      return tierSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dev-tier-span">
          Development tier span {tierSpan.rankSpread} · rank {tierSpan.minRank}–{tierSpan.maxRank} across {tierSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const econSpan = nrDashBuildEconomyBandSpan(snap);
      return econSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-band-span">
          Economy band span {econSpan.rankSpread} · rank {econSpan.minRank}–{econSpan.maxRank} across {econSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const resSpan = nrDashBuildResilienceBandSpan(snap);
      return resSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-resilience-band-span">
          Resilience band span {resSpan.rankSpread} · rank {resSpan.minRank}–{resSpan.maxRank} across {resSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    <NrDashRegionsDepthStrip
      spread={nrDashBuildResilienceSpread(snap)}
      outliers={nrDashTopParityOutliers(snap, 3)}
    />
    <NrDashPeripheralIsolationStrip rows={nrDashTopPeripheralRegions(nsState, 3)} />
    <NrDashDependencyAsymmetryStrip rows={nrDashTopDependencyAsymmetry(nsState, 3)} />
    {(() => {
      const inboundConc = nrDashBuildDependencyInboundConcentration(nsState);
      return inboundConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-inbound-concentration">
          Dependency inbound concentration {inboundConc.concentrationIndex} · top consumer {inboundConc.topConsumerId ?? '—'} (
          {Math.round(inboundConc.topConsumerShare * 100)}%)
        </div>
      ) : null;
    })()}
    {(() => {
      const outboundConc = nrDashBuildDependencyOutboundConcentration(nsState);
      return outboundConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-outbound-concentration">
          Dependency outbound concentration {outboundConc.concentrationIndex} · top provider {outboundConc.topProviderId ?? '—'} (
          {Math.round(outboundConc.topProviderShare * 100)}%)
        </div>
      ) : null;
    })()}
    <NrDashEconomyMomentumDriftStrip
      meanAbsDrift={nrDashBuildEconomyMomentumDrift(snap)?.meanAbsDrift ?? 0}
      rows={nrDashTopEconomyMomentumDrift(snap, 3)}
    />
    {(() => {
      const drift = nrDashBuildEconomyResilienceDrift(snap);
      return drift ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-resilience-drift">
          Economy ↔ resilience drift μ |Δ| {drift.meanAbsDrift}
          {drift.outlierRegionId ? ` · outlier ${drift.outlierRegionId}` : ''}
          {nrDashTopEconomyResilienceDrift(snap, 2).length > 0
            ? ` · top ${nrDashTopEconomyResilienceDrift(snap, 2).map(r => r.regionId).join(', ')}`
            : ''}
        </div>
      ) : null;
    })()}
    {(() => {
      const spread = nrDashBuildDependencyImportanceSpread(nsState);
      return spread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-importance-spread">
          Dependency importance spread σ {spread.stdDev} · μ weight {spread.meanWeight} ({spread.edgeCount} edges)
        </div>
      ) : null;
    })()}
      {(() => {
        const load = nrDashBuildDependencyConsumerLoad(nsState);
        return load ? (
          <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-consumer-load">
            Dependency consumer load σ {load.stdDev} · μ {load.meanEdgesPerConsumer} edges/consumer ({load.edgeCount} edges)
          </div>
        ) : null;
      })()}
      {(() => {
        const consumerSpan = nrDashBuildDependencyConsumerSpan(nsState);
        return consumerSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-consumer-span">
            Dependency consumer span {consumerSpan.spanRatio} · {consumerSpan.distinctConsumers}/{consumerSpan.regionSlots}{' '}
            slots
          </div>
        ) : null;
      })()}
      {(() => {
        const providerSpan = nrDashBuildDependencyProviderSpan(nsState);
        return providerSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-provider-span">
            Dependency provider span {providerSpan.spanRatio} · {providerSpan.distinctProviders}/{providerSpan.regionSlots}{' '}
            slots
          </div>
        ) : null;
      })()}
      {(() => {
        const providers = nrDashBuildDependencyProviderLoad(nsState);
      return providers ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-provider-load">
          Dependency provider load σ {providers.stdDev} · μ {providers.meanEdgesPerProvider} edges/provider ({providers.edgeCount}{' '}
          edges)
        </div>
      ) : null;
    })()}
    {(() => {
      const span = nrDashBuildDependencyNetworkSpan(nsState);
      return span ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-network-span">
          Dependency network span {span.distinctNetworks}/{span.edgeCount} · {span.networks.join(', ')}
        </div>
      ) : null;
    })()}
    {(() => {
      const spread = nrDashBuildConstraintProfileSpread(nsState);
      return spread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-constraint-profile-spread">
          Constraint profile spread σ {spread.stdDev} · μ {spread.meanRegionsPerConstraint} across {spread.networkKinds} kinds
        </div>
      ) : null;
    })()}
    {(() => {
      const bandSpan = nrDashBuildConstraintBandSpan(nsState);
      return bandSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-constraint-band-span">
          Constraint band span {bandSpan.rankSpread} · rank {bandSpan.minRank}–{bandSpan.maxRank} across {bandSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const gap = nrDashBuildMomentumLeaderGap(snap, nsState);
      return gap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-momentum-leader-gap">
          Momentum leader gap {gap.rankGap} · {gap.leaderRegionId} vs {gap.laggardRegionId}
        </div>
      ) : null;
    })()}
    {(() => {
      const bands = nrDashBuildMomentumBandDiversity(snap);
      return bands ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-momentum-band-diversity">
          Momentum band diversity {bands.diversityIndex} · {bands.distinctBands} bands · dominant {bands.dominantBand ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const econ = nrDashBuildEconomyBandDiversity(snap);
      return econ ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-band-diversity">
          Economy band diversity {econ.diversityIndex} · {econ.distinctBands} bands · dominant {econ.dominantBand ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const resBands = nrDashBuildResilienceBandDiversity(snap);
      return resBands ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-resilience-band-diversity">
          Resilience band diversity {resBands.diversityIndex} · {resBands.distinctBands} bands · dominant{' '}
          {resBands.dominantBand ?? '—'}
        </div>
      ) : null;
    })()}
    {nrDashTopTensionOutliers(snap, 3).length > 0 && (
      <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-tension-outliers">
        <div className="font-semibold mb-1">Momentum ↔ resilience tension</div>
        <ul className="list-disc list-inside opacity-90">
          {nrDashTopTensionOutliers(snap, 3).map(t => (
            <li key={t.regionId}>
              {t.regionId}: tension {t.tensionScore} (mom rank {t.momentumRank}, resilience {t.resilience})
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="opacity-70 text-left border-b border-slate-700">
            <th className="py-1 pr-2">Region</th>
            <th className="py-1 pr-2">Owner</th>
            <th className="py-1 pr-2">Economy</th>
            <th className="py-1 pr-2">Momentum</th>
            <th className="py-1 pr-2">Trend</th>
            <th className="py-1 pr-2">Needs</th>
            <th className="py-1 pr-2">Resilience</th>
          </tr>
        </thead>
        <tbody>
          {snap.regions.map(r => {
            const focused = focusRegionId === r.regionId;
            return (
              <tr
                key={r.regionId}
                className={`border-b border-slate-800/80 ${focused ? 'bg-sky-950/40' : ''}`}
                data-testid={`nr-dash-region-row-${r.regionId}`}
              >
                <td className="py-1 pr-2">
                  <button type="button" className="font-semibold underline" onClick={() => onFocusRegion?.(r.regionId)}>
                    {r.name}
                  </button>
                  <div className="opacity-60">{r.developmentTier}</div>
                </td>
                <td className="py-1 pr-2">{nrDashOwnerLabel(r.owner)}</td>
                <td className="py-1 pr-2">{r.economyBand}</td>
                <td className="py-1 pr-2">{r.momentumBand}</td>
                <td className="py-1 pr-2">
                  <NrDashSparkline values={r.momentumHistory} ariaLabel={`${r.name} momentum history`} width={100} height={24} />
                </td>
                <td className="py-1 pr-2">{r.openNeeds || '—'}</td>
                <td className="py-1 pr-2">{r.resilienceBand ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export const NrDashNetworksTab: React.FC<{
  ns: NationalSystemsState | null;
  onMapNetwork?: (n: NationalNetworkKind) => void;
}> = ({ ns, onMapNetwork }) => {
  if (!ns) {
    return (
      <p className="text-sm opacity-80" data-testid="nr-dash-networks-empty">
        National Systems data is not available in this match.
      </p>
    );
  }
  const heat = nrDashBuildHeatCells(ns);
  const bottlenecks = nrDashBuildBottleneckRollup(ns);
  const coupling = nrDashBuildNetworkCoupling(ns);
  const chokepoints = nrDashTopDependencyChokepoints(ns, 3);
  const snapSkew = nrDashBuildUtilizationSkew(
    nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null)
  );
  const headroom = nrDashBuildCapacityHeadroom(
    nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null)
  );
  const strainDiv = nrDashBuildStrainDiversity(ns);
  const bottleneckConc = nrDashBuildBottleneckConcentration(ns);
  const utilDrift = nrDashBuildUtilAlignmentDrift(ns);
  const criticalDensity = nrDashBuildCriticalCellDensity(ns);
  const nationalSpread = nrDashBuildNationalNetworkUtilSpread(ns);
  const resilienceUtilGap = nrDashBuildResilienceUtilizationGap(ns);
  const constraintConc = nrDashBuildConstraintConcentration(ns);
  const bottleneckSpan = nrDashBuildBottleneckNetworkSpan(ns);
  const regionalHeadroom = nrDashBuildRegionalHeadroomSpread(ns);
  const heatStrained = nrDashBuildHeatStrainedDensity(ns);
  const chokeSpread = nrDashBuildChokepointScoreSpread(ns);
  const strainedBars = nrDashBuildNationalStrainedBarCount(
    nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null)
  );
  const stressConc = nrDashBuildNetworkStressConcentration(ns);
  const couplingSpread = nrDashBuildNetworkCouplingSpread(ns);
  const bottleneckLoad = nrDashBuildBottleneckSeverityLoad(ns);
  const heatStrainConc = nrDashBuildHeatRowStrainConcentration(ns);
  const nsSnap = nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null);
  const bottleneckDensity = nrDashBuildNationalBottleneckDensity(ns);
  const utilHeadroomDiv = nrDashBuildUtilHeadroomDivergence(nsSnap);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-networks">
      <NrDashUtilAlignmentStrip drift={utilDrift} />
      <NrDashUtilizationSkewStrip skew={snapSkew} />
      <NrDashCapacityHeadroomStrip headroom={headroom} />
      {strainDiv && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-strain-diversity">
          Strain diversity index {strainDiv.diversityIndex} · dominant {strainDiv.dominantCondition ?? '—'} · μ weight{' '}
          {strainDiv.meanWeight}
        </div>
      )}
      {criticalDensity && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-cell-density">
          Critical+ cell density {criticalDensity.density} · {criticalDensity.criticalPlusCount}/{criticalDensity.cellCount}
          {criticalDensity.worstRegionId ? ` · worst ${criticalDensity.worstRegionId}` : ''}
        </div>
      )}
      {nationalSpread && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-network-spread">
          National network util spread σ {nationalSpread.stdDev} · μ {nationalSpread.meanUtilization}
          {nationalSpread.maxUtilNetwork ? ` · peak ${nationalSpread.maxUtilNetwork}` : ''}
        </div>
      )}
      {(() => {
        const condSpan = nrDashBuildNetworkConditionSpan(ns);
        return condSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-condition-span">
            Network condition span σ {condSpan.stdDev} · μ rank {condSpan.meanRank} · {condSpan.cellCount} cells
          </div>
        ) : null;
      })()}
      {resilienceUtilGap && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-resilience-util-gap">
          Resilience ↔ util gap μ |Δ| {resilienceUtilGap.meanAbsGap}
          {resilienceUtilGap.maxGapRegionId ? ` · max ${resilienceUtilGap.maxGapRegionId}` : ''}
        </div>
      )}
      {constraintConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-constraint-concentration">
          Primary constraint concentration {constraintConc.concentrationIndex} · dominant {constraintConc.dominantNetwork ?? '—'} (
          {Math.round(constraintConc.dominantShare * 100)}%)
        </div>
      )}
      {(() => {
        const bandSpan = nrDashBuildConstraintBandSpan(ns);
        return bandSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-constraint-band-span-networks">
            Constraint band span {bandSpan.rankSpread} · rank {bandSpan.minRank}–{bandSpan.maxRank} across {bandSpan.regionCount}{' '}
            regions
          </div>
        ) : null;
      })()}
      {bottleneckSpan && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-network-span">
          Bottleneck network span {bottleneckSpan.distinctNetworks}/{bottleneckSpan.bottleneckCount} ·{' '}
          {bottleneckSpan.networks.join(', ') || '—'}
        </div>
      )}
      {regionalHeadroom && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-headroom-spread">
          Regional headroom spread σ {regionalHeadroom.stdDev} · μ {regionalHeadroom.meanHeadroom}
          {regionalHeadroom.tightestRegionId ? ` · tightest ${regionalHeadroom.tightestRegionId}` : ''}
        </div>
      )}
      {heatStrained && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-heat-strained-density">
          Heat strained+ density {heatStrained.density} · {heatStrained.strainedPlusCount}/{heatStrained.cellCount} cells
        </div>
      )}
      {chokeSpread && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-chokepoint-spread">
          Dependency chokepoint spread σ {chokeSpread.stdDev} · μ score {chokeSpread.meanScore}
        </div>
      )}
      {strainedBars && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-strained-bars">
          National strained+ bars {strainedBars.strainedPlusCount}/{strainedBars.networkCount}
        </div>
      )}
      {stressConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-stress-concentration">
          Peak util concentration {stressConc.concentrationIndex} · top {stressConc.topNetwork ?? '—'} (
          {Math.round(stressConc.topNetworkShare * 100)}%)
        </div>
      )}
      {couplingSpread && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-coupling-spread">
          Network coupling spread σ {couplingSpread.stdDev} · μ {couplingSpread.meanCoupling}
          {couplingSpread.maxCouplingRegionId ? ` · max ${couplingSpread.maxCouplingRegionId}` : ''}
        </div>
      )}
      {bottleneckLoad && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-severity-load">
          Bottleneck severity load {bottleneckLoad.weightedLoad} · {bottleneckLoad.activeCount} active
          {bottleneckLoad.topRegionId ? ` · top ${bottleneckLoad.topRegionId}` : ''}
        </div>
      )}
      {heatStrainConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-heat-row-strain-concentration">
          Heat row strain concentration {heatStrainConc.concentrationIndex} · top {heatStrainConc.topRegionId ?? '—'}
        </div>
      )}
      {bottleneckDensity && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-density">
          National bottleneck density {bottleneckDensity.density} · {bottleneckDensity.activeBottlenecks}/
          {bottleneckDensity.regionCount} regions
        </div>
      )}
      {utilHeadroomDiv && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-util-headroom-divergence">
          Util ↔ headroom divergence {utilHeadroomDiv.divergence} · util spread {utilHeadroomDiv.utilizationSpread} · headroom{' '}
          {utilHeadroomDiv.headroomSpread}
        </div>
      )}
      {(() => {
        const share = nrDashBuildBottleneckNetworkShare(ns);
        return share ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-network-share">
            Bottleneck network share {share.concentrationIndex} · top {share.topNetwork ?? '—'} (
            {Math.round(share.topNetworkShare * 100)}%)
          </div>
        ) : null;
      })()}
      {(() => {
        const critical = nrDashBuildDependencyCriticalShare(ns);
        return critical ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-critical-share">
            Dependency critical share {critical.criticalShare} · {critical.criticalCount}/{critical.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const highShare = nrDashBuildDependencyHighShare(ns);
        return highShare ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-high-share">
            Dependency high+ share {highShare.highPlusShare} · {highShare.highPlusCount}/{highShare.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const regionSpan = nrDashBuildBottleneckRegionSpan(ns);
        return regionSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-region-span">
            Bottleneck region span {regionSpan.spanRatio} · {regionSpan.distinctRegions}/{regionSpan.regionSlots} slots
          </div>
        ) : null;
      })()}
      {(() => {
        const sevSpan = nrDashBuildBottleneckSeveritySpan(ns);
        return sevSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-severity-span">
            Bottleneck severity span {sevSpan.rankSpread} · ranks {sevSpan.minRank}–{sevSpan.maxRank} ·{' '}
            {sevSpan.distinctSeverities} levels
          </div>
        ) : null;
      })()}
      {(() => {
        const modShare = nrDashBuildDependencyModerateShare(ns);
        return modShare ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-moderate-share">
            Dependency moderate share {modShare.moderateShare} · {modShare.moderateCount}/{modShare.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const lowDep = nrDashBuildDependencyLowShare(ns);
        return lowDep ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-low-share">
            Dependency low share {lowDep.lowShare} · {lowDep.lowCount}/{lowDep.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const loadSpread = nrDashBuildBottleneckNetworkSeverityLoadSpread(ns);
        return loadSpread ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-network-severity-load-spread">
            Bottleneck network severity load spread σ {loadSpread.stdDev} · μ load {loadSpread.meanLoad} · top{' '}
            {loadSpread.topNetwork ?? '—'}
          </div>
        ) : null;
      })()}
      {bottleneckConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-concentration">
          Bottleneck concentration {bottleneckConc.concentrationIndex} · top {bottleneckConc.topRegionId ?? '—'} (
          {Math.round(bottleneckConc.topRegionShare * 100)}% of {bottleneckConc.activeCount})
        </div>
      )}
      {coupling && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-coupling">
          Network coupling μ {coupling.meanCoupling} · hottest {coupling.maxCouplingRegionId ?? '—'}
        </div>
      )}
      {chokepoints.length > 0 && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dependency-chokepoints">
          <div className="font-semibold mb-1">Dependency chokepoints (endpoint stress)</div>
          <ul className="list-disc list-inside">
            {chokepoints.map(c => (
              <li key={c.dependencyId}>
                {c.label}: score {c.chokeScore}
              </li>
            ))}
          </ul>
        </div>
      )}
      <NrDashNetworkDepthPanel
        constraints={nrDashBuildConstraintProfile(ns)}
        dependencies={nrDashBuildDependencyProfile(ns)}
        heatRows={nrDashBuildHeatRowSummaries(ns)}
      />
      <div className="flex flex-wrap gap-2">
        {NATIONAL_NETWORKS.map(n => (
          <button
            key={n}
            type="button"
            className="text-xs px-2 py-1 rounded border border-slate-600 hover:border-sky-500"
            onClick={() => onMapNetwork?.(n)}
          >
            {NATIONAL_NETWORK_ICON[n]} Map {NATIONAL_NETWORK_LABEL[n]}
          </button>
        ))}
      </div>
      <NrDashHeatMatrix cells={heat.cells} rowLabels={heat.rows} colLabels={heat.cols} />
      {bottlenecks.length > 0 && (
        <div className="text-xs" data-testid="nr-dash-bottleneck-list">
          <div className="font-semibold mb-1">Active bottlenecks (authoritative)</div>
          <ul className="list-disc list-inside opacity-90">
            {bottlenecks.map(b => (
              <li key={b.id}>{b.label}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-[10px] opacity-70">Cell color reflects network condition from National Systems (not Living Regions).</p>
    </div>
  );
};

export const NrDashTrendsTab: React.FC<{
  snap: NrDashAuthSnapshot;
  lrView: LivingRegionsWorldView | null;
  nsState: NationalSystemsState | null;
}> = ({ snap, lrView, nsState }) => {
  const movers = nrDashTopTrendMovers(snap.regions, 5);
  const coherence = nrDashBuildTrendCoherence(snap);
  const acceleration = nrDashBuildTrendAcceleration(snap);
  const historyVol = nrDashBuildMomentumHistoryVolatility(snap);
  const deltaSpread = nrDashBuildMomentumDeltaSpread(snap);
  const activitySpread = nrDashBuildActivityWeightSpread(snap);
  const paritySpread = nrDashBuildParityGapSpread(snap);
  return (
    <div data-testid="nr-dash-tab-trends">
      <NrDashProvenanceStrip items={snap.provenance} />
      {coherence && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-trend-coherence">
          <div className="font-semibold mb-1">National momentum coherence</div>
          <div>
            score {coherence.coherenceScore} · σ {coherence.stdDev}
            {coherence.divergentRegionId ? ` · outlier ${coherence.divergentRegionId}` : ''}
          </div>
        </div>
      )}
      {historyVol && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-volatility">
          <div className="font-semibold mb-1">Momentum history volatility</div>
          <div>
            μ range {historyVol.meanVolatility} · max {historyVol.maxVolatility}
            {historyVol.outlierRegionId ? ` · outlier ${historyVol.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {deltaSpread && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-delta-spread">
          <div className="font-semibold mb-1">Momentum delta spread</div>
          <div>
            μ |Δ| {deltaSpread.meanAbsDelta} · σ {deltaSpread.stdDev}
            {deltaSpread.outlierRegionId ? ` · mover ${deltaSpread.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {activitySpread && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-activity-weight-spread">
          <div className="font-semibold mb-1">Momentum activity weight spread</div>
          <div>
            μ {activitySpread.meanWeight} · σ {activitySpread.stdDev}
            {activitySpread.outlierRegionId ? ` · outlier ${activitySpread.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {paritySpread && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-parity-gap-spread">
          <div className="font-semibold mb-1">Parity gap spread</div>
          <div>
            μ |gap| {paritySpread.meanAbsGap} · σ {paritySpread.stdDev}
            {paritySpread.outlierRegionId ? ` · outlier ${paritySpread.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {acceleration && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-trend-acceleration">
          <div className="font-semibold mb-1">Momentum acceleration coherence</div>
          <div>
            score {acceleration.coherenceScore} · μ acc {acceleration.meanAcceleration}
            {acceleration.outlierRegionId ? ` · outlier ${acceleration.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {(() => {
        const histSpan = nrDashBuildMomentumHistorySpan(snap);
        return histSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-history-span">
            <div className="font-semibold mb-1">Momentum history span</div>
            <div>
              length spread {histSpan.lengthSpread} · min {histSpan.minLength} · max {histSpan.maxLength} across{' '}
              {histSpan.regionCount} regions
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const bandSpan = nrDashBuildMomentumBandSpan(snap);
        return bandSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-band-span">
            <div className="font-semibold mb-1">Momentum band span</div>
            <div>
              rank spread {bandSpan.rankSpread} · min {bandSpan.minRank} · max {bandSpan.maxRank} across{' '}
              {bandSpan.regionCount} regions
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const erSpan = nrDashBuildEconomyResilienceSpan(snap);
        return erSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-economy-resilience-span">
            <div className="font-semibold mb-1">Economy ↔ resilience span</div>
            <div>
              drift spread {erSpan.driftSpread} · min {erSpan.minDrift} · max {erSpan.maxDrift} across {erSpan.regionCount}{' '}
              regions
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const turnSpan = nrDashBuildHistoryTurnSpan(lrView, nsState);
        return turnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-turn-span">
            <div className="font-semibold mb-1">History turn span</div>
            <div>
              turn spread {turnSpan.turnSpread} · min R{turnSpan.minTurn} · max R{turnSpan.maxTurn} · {turnSpan.eventCount}{' '}
              events
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const derivedTurnSpan = nrDashBuildDerivedEventTurnSpan(lrView);
        return derivedTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-derived-event-turn-span">
            <div className="font-semibold mb-1">Derived event turn span</div>
            <div>
              turn spread {derivedTurnSpan.turnSpread} · min R{derivedTurnSpan.minTurn} · max R{derivedTurnSpan.maxTurn} ·{' '}
              {derivedTurnSpan.eventCount} events
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const nsTurnSpan = nrDashBuildNsHistoryTurnSpan(nsState);
        return nsTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-history-turn-span">
            <div className="font-semibold mb-1">NS history turn span</div>
            <div>
              turn spread {nsTurnSpan.turnSpread} · min R{nsTurnSpan.minTurn} · max R{nsTurnSpan.maxTurn} · {nsTurnSpan.eventCount}{' '}
              entries
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const lrTurnSpan = nrDashBuildLrHistoryTurnSpan(lrView);
        return lrTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-history-turn-span">
            <div className="font-semibold mb-1">LR history turn span</div>
            <div>
              turn spread {lrTurnSpan.turnSpread} · min R{lrTurnSpan.minTurn} · max R{lrTurnSpan.maxTurn} · {lrTurnSpan.eventCount}{' '}
              major events
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const meaningfulTurnSpan = nrDashBuildMeaningfulDerivedTurnSpan(lrView);
        return meaningfulTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-derived-turn-span">
            <div className="font-semibold mb-1">Meaningful derived turn span</div>
            <div>
              turn spread {meaningfulTurnSpan.turnSpread} · min R{meaningfulTurnSpan.minTurn} · max R{meaningfulTurnSpan.maxTurn} ·{' '}
              {meaningfulTurnSpan.eventCount} events
            </div>
          </div>
        ) : null;
      })()}
      {movers.length > 0 && (
        <div className="text-xs mb-3" data-testid="nr-dash-trend-movers">
          <div className="font-semibold mb-1">Largest momentum history deltas (authoritative)</div>
          <ul className="list-disc list-inside">
            {movers.map(m => (
              <li key={m.regionId}>
                {m.name}: Δ {m.delta} (last {m.last})
              </li>
            ))}
          </ul>
        </div>
      )}
    {snap.historySnippets.length ? (
      <ol className="text-xs space-y-1 mt-2 list-decimal list-inside">
        {snap.historySnippets.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>
    ) : (
      <p className="text-sm opacity-80">No national or major regional turning points recorded yet.</p>
    )}
    </div>
  );
};

export const NrDashMapTab: React.FC<{
  snap: NrDashAuthSnapshot;
  nsState: NationalSystemsState | null;
  focusRegionId: string | null;
  onFocusRegion?: (id: string) => void;
}> = ({ snap, nsState, focusRegionId, onFocusRegion }) => {
  const baseNodes = useMemo(() => nrDashBuildRegionMapNodes(snap), [snap]);
  const nodes = useMemo(
    () => nrDashApplyMapPulse(nrDashApplyMapFocus(baseNodes, focusRegionId)),
    [baseNodes, focusRegionId]
  );
  const pulseHot = useMemo(() => nrDashHottestPulseRegion(nodes), [nodes]);
  const allLinks = useMemo(
    () =>
      nrDashMergeMapLinks(
        nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
        nrDashBuildDependencyLinks(nsState, AGENT23_REGION_MAP_LAYOUT)
      ),
    [nsState]
  );
  const stressedLinks = useMemo(() => nrDashEnrichMapLinkStress(allLinks, nsState), [allLinks, nsState]);
  const links = useMemo(
    () => (focusRegionId ? nrDashLinksTouchingRegion(stressedLinks, focusRegionId) : stressedLinks),
    [stressedLinks, focusRegionId]
  );
  const hottestLink = useMemo(() => nrDashHottestMapLinkStress(stressedLinks), [stressedLinks]);
  const hubRows = useMemo(() => nrDashTopMapHubs(nsState, 3), [nsState]);
  const primaryHub = useMemo(() => nrDashPrimaryMapHub(nsState), [nsState]);
  const hubLoad = useMemo(() => nrDashBuildHubCorridorLoad(nsState), [nsState]);
  const peripheralGap = useMemo(() => nrDashBuildPeripheralCorridorGap(nsState), [nsState]);
  const linkDispersion = useMemo(() => nrDashBuildLinkStressDispersion(nsState), [nsState]);
  const pulseConc = useMemo(() => nrDashBuildMapPulseConcentration(snap), [snap]);
  const hubConc = useMemo(() => nrDashBuildMapHubConcentration(nsState), [nsState]);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-map">
      <NrDashProvenanceStrip items={snap.provenance} />
      <RegionPositionMap nodes={nodes} links={links} focusRegionId={focusRegionId} onSelect={onFocusRegion} />
      <NrDashCorridorStressStrip corridors={nrDashTopCorridorStress(nsState, 4)} />
      {(() => {
        const conc = nrDashBuildCorridorStressConcentration(nsState);
        return conc ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-stress-concentration">
            Corridor stress concentration {conc.concentrationIndex} · top {conc.topCorridorKey ?? '—'} (
            {Math.round(conc.topCorridorShare * 100)}%)
          </p>
        ) : null;
      })()}
      {(() => {
        const borderConc = nrDashBuildBorderStressConcentration(nsState);
        return borderConc ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-stress-concentration">
            Border stress concentration {borderConc.concentrationIndex} · top {borderConc.topRegionId ?? '—'} (
            {Math.round(borderConc.topRegionShare * 100)}%)
          </p>
        ) : null;
      })()}
      <NrDashBorderStressStrip rows={nrDashTopBorderStress(nsState, 3)} />
      <NrDashMapHubStrip hubs={hubRows} primaryHubId={primaryHub} />
      {peripheralGap && peripheralGap.peripheralLinkCount > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-peripheral-corridor-gap">
          Hub vs peripheral corridor gap: hub μ {Math.round(peripheralGap.hubMeanStress * 100)}% · rim μ{' '}
          {Math.round(peripheralGap.peripheralMeanStress * 100)}% · Δ {Math.round(peripheralGap.gap * 100)}%
        </p>
      )}
      {hubLoad && hubLoad.touchingLinkCount > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-hub-load">
          Hub {hubLoad.hubRegionId} corridor load: μ stress {Math.round(hubLoad.meanLinkStress * 100)}% · peak{' '}
          {hubLoad.peakLinkLabel} ({Math.round(hubLoad.peakLinkStress * 100)}%)
        </p>
      )}
      {hottestLink && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-link-stress-hot">
          Hottest link stress: {hottestLink.label} ({Math.round((hottestLink.stressLevel ?? 0) * 100)}%)
        </p>
      )}
      {linkDispersion && linkDispersion.linkCount > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-link-stress-dispersion">
          Link stress dispersion: μ {Math.round(linkDispersion.meanStress * 100)}% · σ{' '}
          {Math.round(linkDispersion.stdDev * 100)}% across {linkDispersion.linkCount} links
        </p>
      )}
      {nrDashHottestBorderRegion(nsState) && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-border-hot">
          Hottest border stress: {nrDashHottestBorderRegion(nsState)}
        </p>
      )}
      {pulseHot && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-hot">
          Pulse hotspot: {pulseHot} (momentum activity + needs + risks)
        </p>
      )}
      {pulseConc && pulseConc.concentrationIndex > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-concentration">
          Pulse concentration {pulseConc.concentrationIndex} · top {pulseConc.topRegionId ?? '—'} (
          {Math.round(pulseConc.topRegionShare * 100)}%)
        </p>
      )}
      {(() => {
        const pulseSpan = nrDashBuildMapPulseSpan(baseNodes);
        return pulseSpan && pulseSpan.intensitySpread > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-span">
            Map pulse span {pulseSpan.intensitySpread} · min {pulseSpan.minIntensity} · max {pulseSpan.maxIntensity} across{' '}
            {pulseSpan.regionCount} nodes
          </p>
        ) : null;
      })()}
      {(() => {
        const corridorPulse = nrDashBuildCorridorPulseSpread(nsState, baseNodes);
        return corridorPulse && corridorPulse.stdDev > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-pulse-spread">
            Corridor pulse spread σ {corridorPulse.stdDev} · μ blend {corridorPulse.meanBlend} · {corridorPulse.corridorCount}{' '}
            corridors
          </p>
        ) : null;
      })()}
      {(() => {
        const corridorAsym = nrDashBuildCorridorPulseAsymmetry(nsState, baseNodes);
        return corridorAsym && corridorAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-pulse-asymmetry">
            Corridor pulse asymmetry μΔ {corridorAsym.meanEndpointDelta} · peak {corridorAsym.maxEndpointDelta} ·{' '}
            {corridorAsym.corridorCount} corridors
          </p>
        ) : null;
      })()}
      {(() => {
        const corridorSat = nrDashBuildCorridorSaturationShare(nsState, baseNodes);
        return corridorSat && corridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-saturation-share">
            Corridor saturation share {corridorSat.saturationShare} · μ {corridorSat.meanBlend} · peak {corridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const linkPulse = nrDashBuildLinkPulseSpan(stressedLinks, baseNodes);
        return linkPulse && linkPulse.intensitySpread > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-link-pulse-span">
            Link pulse span {linkPulse.intensitySpread} · min {linkPulse.minBlend} · max {linkPulse.maxBlend} ·{' '}
            {linkPulse.linkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const linkAsym = nrDashBuildLinkPulseAsymmetry(stressedLinks, baseNodes);
        return linkAsym && linkAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-link-pulse-asymmetry">
            Link pulse asymmetry μΔ {linkAsym.meanEndpointDelta} · peak {linkAsym.maxEndpointDelta} · {linkAsym.linkCount}{' '}
            links
          </p>
        ) : null;
      })()}
      {(() => {
        const linkSat = nrDashBuildLinkSaturationShare(stressedLinks, baseNodes);
        return linkSat && linkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-link-saturation-share">
            Link saturation share {linkSat.saturationShare} · μ {linkSat.meanBlend} · peak {linkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubPulse = nrDashBuildHubPulseSpan(nsState, baseNodes);
        return hubPulse && hubPulse.intensitySpread > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-pulse-span">
            Hub pulse span {hubPulse.intensitySpread} · min {hubPulse.minIntensity} · max {hubPulse.maxIntensity} ·{' '}
            {hubPulse.hubRegionCount} hubs
          </p>
        ) : null;
      })()}
      {(() => {
        const hubAsym = nrDashBuildHubPulseAsymmetry(nsState, baseNodes);
        return hubAsym && hubAsym.asymmetryGap > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-pulse-asymmetry">
            Hub pulse asymmetry {hubAsym.asymmetryGap} · max {hubAsym.maxIntensity} vs μ {hubAsym.meanIntensity} ·{' '}
            {hubAsym.hubRegionCount} hubs
          </p>
        ) : null;
      })()}
      {(() => {
        const pulseGap = nrDashBuildPulseAsymmetryGap(baseNodes);
        return pulseGap && pulseGap.asymmetryGap > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-pulse-asymmetry-gap">
            Pulse asymmetry gap {pulseGap.asymmetryGap} · max {pulseGap.maxIntensity} vs μ {pulseGap.meanIntensity}
          </p>
        ) : null;
      })()}
      {(() => {
        const mapSat = nrDashBuildMapPulseSaturationShare(baseNodes);
        return mapSat && mapSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-saturation-share">
            Map pulse saturation share {mapSat.saturationShare} · μ {mapSat.meanIntensity} · peak {mapSat.peakIntensity}
          </p>
        ) : null;
      })()}
      {(() => {
        const depAsym = nrDashBuildDependencyPulseAsymmetry(stressedLinks, baseNodes);
        return depAsym && depAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-dependency-pulse-asymmetry">
            Dependency pulse asymmetry μΔ {depAsym.meanEndpointDelta} · peak {depAsym.maxEndpointDelta} · {depAsym.linkCount}{' '}
            deps
          </p>
        ) : null;
      })()}
      {(() => {
        const borderSat = nrDashBuildBorderCorridorSaturationShare(nsState);
        return borderSat && borderSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-corridor-saturation-share">
            Border corridor saturation share {borderSat.saturationShare} · μ {borderSat.meanStress} · peak{' '}
            {borderSat.peakStress}
          </p>
        ) : null;
      })()}
      {(() => {
        const borderPulseAsym = nrDashBuildBorderPulseAsymmetry(nsState, baseNodes);
        return borderPulseAsym && borderPulseAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-pulse-asymmetry">
            Border pulse asymmetry μΔ {borderPulseAsym.meanEndpointDelta} · peak {borderPulseAsym.maxEndpointDelta} ·{' '}
            {borderPulseAsym.borderLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const borderLinkSat = nrDashBuildBorderLinkSaturationShare(nsState, baseNodes);
        return borderLinkSat && borderLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-link-saturation-share">
            Border link saturation share {borderLinkSat.saturationShare} · border {borderLinkSat.borderRegionId ?? '—'} · μ{' '}
            {borderLinkSat.meanBlend} · peak {borderLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubCorridorSat = nrDashBuildHubCorridorSaturationShare(nsState);
        return hubCorridorSat && hubCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-corridor-saturation-share">
            Hub corridor saturation share {hubCorridorSat.saturationShare} · hub {hubCorridorSat.hubRegionId ?? '—'} · μ{' '}
            {hubCorridorSat.meanLinkStress} · peak {hubCorridorSat.peakLinkStress}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubLinkSat = nrDashBuildHubLinkSaturationShare(nsState, baseNodes);
        return hubLinkSat && hubLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-link-saturation-share">
            Hub link saturation share {hubLinkSat.saturationShare} · hub {hubLinkSat.hubRegionId ?? '—'} · μ{' '}
            {hubLinkSat.meanBlend} · peak {hubLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const peripheralLinkSat = nrDashBuildPeripheralLinkSaturationShare(nsState, baseNodes);
        return peripheralLinkSat && peripheralLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-peripheral-link-saturation-share">
            Peripheral link saturation share {peripheralLinkSat.saturationShare} · μ {peripheralLinkSat.meanBlend} · peak{' '}
            {peripheralLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const rimCorridorSat = nrDashBuildRimCorridorSaturationShare(nsState, baseNodes);
        return rimCorridorSat && rimCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-rim-corridor-saturation-share">
            Rim corridor saturation share {rimCorridorSat.saturationShare} · μ {rimCorridorSat.meanBlend} · peak{' '}
            {rimCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubRimAsym = nrDashBuildHubRimPulseAsymmetry(nsState, baseNodes);
        return hubRimAsym && hubRimAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-rim-pulse-asymmetry">
            Hub rim pulse asymmetry μΔ {hubRimAsym.meanEndpointDelta} · peak {hubRimAsym.maxEndpointDelta} ·{' '}
            {hubRimAsym.hubRimLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const hubPeripheralSat = nrDashBuildHubPeripheralSaturationShare(nsState);
        return hubPeripheralSat && hubPeripheralSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-peripheral-saturation-share">
            Hub peripheral saturation share {hubPeripheralSat.saturationShare} · rim μ {hubPeripheralSat.peripheralMeanStress}{' '}
            · hub μ {hubPeripheralSat.hubMeanStress}
          </p>
        ) : null;
      })()}
      {(() => {
        const adjAsym = nrDashBuildAdjacencyPulseAsymmetry(stressedLinks, baseNodes);
        return adjAsym && adjAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-adjacency-pulse-asymmetry">
            Adjacency pulse asymmetry μΔ {adjAsym.meanEndpointDelta} · peak {adjAsym.maxEndpointDelta} · {adjAsym.linkCount}{' '}
            links
          </p>
        ) : null;
      })()}
      {(() => {
        const peripheralAsym = nrDashBuildPeripheralPulseAsymmetry(nsState, baseNodes);
        return peripheralAsym && peripheralAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-peripheral-pulse-asymmetry">
            Peripheral pulse asymmetry μΔ {peripheralAsym.meanEndpointDelta} · peak {peripheralAsym.maxEndpointDelta} ·{' '}
            {peripheralAsym.peripheralLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const mergedRimAsym = nrDashBuildMergedRimPulseAsymmetry(nsState, baseNodes);
        return mergedRimAsym && mergedRimAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-merged-rim-pulse-asymmetry">
            Merged rim pulse asymmetry μΔ {mergedRimAsym.meanEndpointDelta} · peak {mergedRimAsym.maxEndpointDelta} ·{' '}
            {mergedRimAsym.rimLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const depCorridorSat = nrDashBuildDependencyCorridorSaturationShare(stressedLinks, baseNodes);
        return depCorridorSat && depCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-dependency-corridor-saturation-share">
            Dependency corridor saturation share {depCorridorSat.saturationShare} · μ {depCorridorSat.meanBlend} · peak{' '}
            {depCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const depLinkSat = nrDashBuildDependencyLinkSaturationShare(stressedLinks, baseNodes);
        return depLinkSat && depLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-dependency-link-saturation-share">
            Dependency link saturation share {depLinkSat.saturationShare} · μ {depLinkSat.meanBlend} · peak{' '}
            {depLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const adjCorridorSat = nrDashBuildAdjacencyCorridorSaturationShare(stressedLinks, baseNodes);
        return adjCorridorSat && adjCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-adjacency-corridor-saturation-share">
            Adjacency corridor saturation share {adjCorridorSat.saturationShare} · μ {adjCorridorSat.meanBlend} · peak{' '}
            {adjCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const adjLinkSat = nrDashBuildAdjacencyLinkSaturationShare(stressedLinks, baseNodes);
        return adjLinkSat && adjLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-adjacency-link-saturation-share">
            Adjacency link saturation share {adjLinkSat.saturationShare} · μ {adjLinkSat.meanBlend} · peak {adjLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const mergedCorridorSat = nrDashBuildMergedCorridorSaturationShare(stressedLinks, baseNodes);
        return mergedCorridorSat && mergedCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-merged-corridor-saturation-share">
            Merged corridor saturation share {mergedCorridorSat.saturationShare} · μ {mergedCorridorSat.meanBlend} · peak{' '}
            {mergedCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const chokeAsym = nrDashBuildChokepointPulseAsymmetry(nsState, baseNodes);
        return chokeAsym && chokeAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-chokepoint-pulse-asymmetry">
            Chokepoint pulse asymmetry μΔ {chokeAsym.meanEndpointDelta} · peak {chokeAsym.maxEndpointDelta} ·{' '}
            {chokeAsym.chokepointCount} deps
          </p>
        ) : null;
      })()}
      {(() => {
        const chokeCorridorSat = nrDashBuildChokepointCorridorSaturationShare(nsState, baseNodes);
        return chokeCorridorSat && chokeCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-chokepoint-corridor-saturation-share">
            Chokepoint corridor saturation share {chokeCorridorSat.saturationShare} · μ {chokeCorridorSat.meanBlend} · peak{' '}
            {chokeCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {hubConc && hubConc.concentrationIndex > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-hub-concentration">
          Hub score concentration {hubConc.concentrationIndex} · top {hubConc.topRegionId ?? '—'} (
          {Math.round(hubConc.topRegionShare * 100)}%)
        </p>
      )}
      <NrDashMapLegend />
      <p className="text-[10px] opacity-70">
        Dashed lines: land adjacency. Solid colored lines: interregional dependencies from National Systems.
      </p>
    </div>
  );
};

export interface NationalRegionalDashboardModalProps {
  open: boolean;
  onClose: () => void;
  theme: { card?: string; border?: string; button?: string; buttonSecondary?: string; scrollbar?: string };
  turn: number;
  lrView: LivingRegionsWorldView | null;
  nsState: NationalSystemsState | null;
  nsView: NationalSystemsWorldView | null;
  focusRegionId?: string | null;
  onFocusRegion?: (id: string) => void;
  onAsk?: (q: string) => void;
  onMapNetwork?: (n: NationalNetworkKind) => void;
}

export const NationalRegionalDashboardModal: React.FC<NationalRegionalDashboardModalProps> = ({
  open,
  onClose,
  theme,
  turn,
  lrView,
  nsState,
  nsView,
  focusRegionId = null,
  onFocusRegion,
  onAsk,
  onMapNetwork,
}) => {
  const [tab, setTab] = useState<NrDashTabId>('overview');
  useEffect(() => {
    if (open) setTab('overview');
  }, [open]);
  const snap = useMemo(
    () => nrDashBuildAuthSnapshot(turn, lrView, nsState, nsView?.regionOwners || null),
    [turn, lrView, nsState, nsView]
  );
  if (!open) return null;
  const card = theme.card || '';
  const border = theme.border || 'border-slate-700';
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 overflow-y-auto z-[9600]"
      data-testid="national-regional-dashboard-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nr-dash-title"
    >
      <div
        className={`${card} ${border} border rounded-xl max-w-5xl w-full max-h-[calc(100dvh-2rem)] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-4 border-b ${border}`}>
          <div>
            <h2 id="nr-dash-title" className="text-xl font-bold">
              📊 National & regional dashboard
            </h2>
            <p className="text-xs opacity-75">Round {turn} · authoritative Living Regions + National Systems</p>
          </div>
          <button
            type="button"
            className={`${theme.buttonSecondary || ''} px-3 py-1 rounded`}
            onClick={onClose}
            aria-label="Close dashboard"
          >
            ✕
          </button>
        </div>
        <div className={`flex flex-wrap gap-1 px-4 pt-3 border-b ${border}`} role="tablist">
          {NR_DASH_TAB_ORDER.map(id => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`px-3 py-1.5 text-xs rounded-t border-b-2 ${tab === id ? 'border-sky-400 font-bold' : 'border-transparent opacity-70'}`}
              onClick={() => setTab(id)}
            >
              {NR_DASH_TAB_LABELS[id]}
            </button>
          ))}
        </div>
        <div className={`flex-1 overflow-y-auto p-4 ${theme.scrollbar || ''}`}>
          {!snap ? (
            <p className="text-sm opacity-80">Enable Living Regions or National Systems to populate this dashboard.</p>
          ) : tab === 'overview' ? (
            <NrDashOverviewTab snap={snap} nsState={nsState} lrView={lrView} onAsk={onAsk} />
          ) : tab === 'regions' ? (
            <NrDashRegionsTab
              snap={snap}
              nsState={nsState}
              focusRegionId={focusRegionId}
              onFocusRegion={onFocusRegion}
            />
          ) : tab === 'networks' ? (
            <NrDashNetworksTab ns={nsState} onMapNetwork={onMapNetwork} />
          ) : tab === 'map' ? (
            <NrDashMapTab snap={snap} nsState={nsState} focusRegionId={focusRegionId} onFocusRegion={onFocusRegion} />
          ) : (
            <NrDashTrendsTab snap={snap} lrView={lrView} nsState={nsState} />
          )}
        </div>
        <div className={`p-3 border-t ${border} flex justify-end`}>
          <button type="button" className={`${theme.button || ''} px-4 py-2 rounded`} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
