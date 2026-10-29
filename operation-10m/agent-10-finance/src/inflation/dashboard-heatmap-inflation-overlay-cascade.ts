import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type DashboardHeatmapInflationOverlayCascadeBand =
  | 'routine'
  | 'widening'
  | 'critical'
  | 'overlay_cascade';

export interface DashboardHeatmapInflationOverlayCascadeAssessment {
  cascadeBand: DashboardHeatmapInflationOverlayCascadeBand;
  overlayIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dashboard regional heatmap inflation overlay cascade (Agent 23). */
export function assessDashboardHeatmapInflationOverlayCascade(input: {
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  dashboardRefreshUrgency: 'routine' | 'elevated' | 'critical';
  regionalInflationOverlayLatch: boolean;
  heatmapOverlayCascadeBand: 'routine' | 'widening' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DashboardHeatmapInflationOverlayCascadeAssessment {
  let pressure = 0;
  if (input.regionalHeatmapInflationAlert) pressure += 0.18;
  pressure += finClamp(input.mapLayerCostPressureScore, 0, 1) * 0.22;
  if (input.dashboardRefreshUrgency === 'critical') pressure += 0.2;
  else if (input.dashboardRefreshUrgency === 'elevated') pressure += 0.1;
  if (input.regionalInflationOverlayLatch) pressure += 0.12;
  if (input.heatmapOverlayCascadeBand === 'critical') pressure += 0.21;
  else if (input.heatmapOverlayCascadeBand === 'widening') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const overlayIndex = finRound(100 + pressure * 17, 1);

  let cascadeBand: DashboardHeatmapInflationOverlayCascadeBand = 'routine';
  if (pressure >= 0.58) cascadeBand = 'overlay_cascade';
  else if (pressure >= 0.39) cascadeBand = 'critical';
  else if (pressure >= 0.18) cascadeBand = 'widening';

  const inflationScoreNudge =
    cascadeBand === 'overlay_cascade'
      ? 0.091
      : cascadeBand === 'critical'
        ? 0.058
        : cascadeBand === 'widening'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'overlay_cascade' || cascadeBand === 'critical'
      ? 'Regional heatmap overlay cascade elevating CPI map-layer metadata.'
      : cascadeBand === 'widening'
        ? 'Dashboard refresh urgency building inflation overlay latch.'
        : 'Heatmap inflation overlay routine versus headline CPI.';

  return { cascadeBand, overlayIndex, inflationScoreNudge, narrative };
}

export function dashboardHeatmapInflationOverlayCascadeScoreAdjustment(
  band: DashboardHeatmapInflationOverlayCascadeBand,
): number {
  if (band === 'overlay_cascade') return 4;
  if (band === 'critical') return 3;
  if (band === 'widening') return 2;
  return 0;
}
