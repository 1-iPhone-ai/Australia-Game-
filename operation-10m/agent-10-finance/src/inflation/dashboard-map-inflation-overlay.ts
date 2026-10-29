import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type DashboardMapInflationOverlayBand = 'routine' | 'highlighted' | 'severe' | 'map_critical';

export interface DashboardMapInflationOverlayAssessment {
  overlayBand: DashboardMapInflationOverlayBand;
  presentationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Regional dashboards and map layers elevating inflation presentation (Agent 23). */
export function assessDashboardMapInflationOverlay(input: {
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  dashboardRefreshUrgency: 'routine' | 'elevated' | 'critical';
  dashboardInflationHeatmapSevere: boolean;
  mapLayerCostOfLivingStressActive: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): DashboardMapInflationOverlayAssessment {
  let pressure = 0;
  if (input.regionalHeatmapInflationAlert) {
    pressure += 0.2;
  }
  if (input.dashboardInflationHeatmapSevere) {
    pressure += 0.24;
  }
  if (input.mapLayerCostOfLivingStressActive) {
    pressure += 0.18;
  }
  pressure += finClamp(input.mapLayerCostPressureScore, 0, 1) * 0.22;

  if (input.dashboardRefreshUrgency === 'critical') {
    pressure += 0.16;
  } else if (input.dashboardRefreshUrgency === 'elevated') {
    pressure += 0.08;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const presentationIndex = finRound(100 + pressure * 15, 1);

  let overlayBand: DashboardMapInflationOverlayBand = 'routine';
  if (pressure >= 0.55) overlayBand = 'map_critical';
  else if (pressure >= 0.36) overlayBand = 'severe';
  else if (pressure >= 0.18) overlayBand = 'highlighted';

  const inflationScoreNudge =
    overlayBand === 'map_critical'
      ? 0.082
      : overlayBand === 'severe'
        ? 0.054
        : overlayBand === 'highlighted'
          ? 0.025
          : 0;

  const narrative =
    overlayBand === 'map_critical' || overlayBand === 'severe'
      ? 'Dashboard and map overlays are amplifying perceived inflation pressure across regions.'
      : overlayBand === 'highlighted'
        ? 'Regional heatmaps highlighting cost-of-living stress on CPI presentation layers.'
        : 'Dashboard map inflation overlay routine versus headline CPI.';

  return { overlayBand, presentationIndex, inflationScoreNudge, narrative };
}

export function dashboardMapInflationOverlayScoreAdjustment(band: DashboardMapInflationOverlayBand): number {
  if (band === 'map_critical') return 4;
  if (band === 'severe') return 3;
  if (band === 'highlighted') return 2;
  return 0;
}
