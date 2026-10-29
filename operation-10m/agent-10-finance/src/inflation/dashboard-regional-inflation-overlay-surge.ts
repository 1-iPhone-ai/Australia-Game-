import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type DashboardRegionalInflationOverlaySurgeBand = 'routine' | 'widening' | 'surge' | 'heatmap_crisis';

export interface DashboardRegionalInflationOverlaySurgeAssessment {
  surgeBand: DashboardRegionalInflationOverlaySurgeBand;
  overlayIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dashboard regional inflation overlay surge (Agent 23, round 43). */
export function assessDashboardRegionalInflationOverlaySurge(input: {
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  wave43HeatmapOverlayLatch: boolean;
  regionalOverlaySurgeBand: 'routine' | 'widening' | 'surge';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DashboardRegionalInflationOverlaySurgeAssessment {
  let pressure = 0;
  if (input.regionalHeatmapInflationAlert) pressure += 0.19;
  pressure += finClamp(input.mapLayerCostPressureScore, 0, 1) * 0.21;
  if (input.wave43HeatmapOverlayLatch) pressure += 0.13;
  if (input.regionalOverlaySurgeBand === 'surge') pressure += 0.22;
  else if (input.regionalOverlaySurgeBand === 'widening') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const overlayIndex = finRound(100 + pressure * 16, 1);

  let surgeBand: DashboardRegionalInflationOverlaySurgeBand = 'routine';
  if (pressure >= 0.58) surgeBand = 'heatmap_crisis';
  else if (pressure >= 0.38) surgeBand = 'surge';
  else if (pressure >= 0.17) surgeBand = 'widening';

  const inflationScoreNudge =
    surgeBand === 'heatmap_crisis'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'widening'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'heatmap_crisis' || surgeBand === 'surge'
      ? 'Regional overlay surge feeding CPI dashboard metadata.'
      : surgeBand === 'widening'
        ? 'Heatmap overlay latch building under map pressure.'
        : 'Dashboard regional overlay surge routine versus headline CPI.';

  return { surgeBand, overlayIndex, inflationScoreNudge, narrative };
}

export function dashboardRegionalInflationOverlaySurgeScoreAdjustment(
  band: DashboardRegionalInflationOverlaySurgeBand,
): number {
  if (band === 'heatmap_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'widening') return 2;
  return 0;
}
