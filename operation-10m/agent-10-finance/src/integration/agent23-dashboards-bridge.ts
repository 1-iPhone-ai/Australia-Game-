import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only dashboards / maps snapshot from Agent 23 (contract only). */
export interface Agent23DashboardsSnapshot {
  turn: number;
  regionalHeatmapInflationAlert: boolean;
  mapLayerCostPressureScore: number;
  dashboardRefreshUrgency: 'routine' | 'elevated' | 'critical';
  /** Round 19: severe regional inflation heatmap band. */
  dashboardInflationHeatmapSevere?: boolean;
  /** Round 19: map layer cost-of-living stress active. */
  mapLayerCostOfLivingStressActive?: boolean;
  /** Round 35: regional inflation overlay latch. */
  regionalInflationOverlayLatch?: boolean;
  /** Round 35: heatmap overlay cascade band. */
  heatmapOverlayCascadeBand?: 'routine' | 'widening' | 'critical';
}

export function mergeAgent23IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent23DashboardsSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.regionalHeatmapInflationAlert) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.mapLayerCostPressureScore > 0.65) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.dashboardRefreshUrgency === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.regionalHeatmapInflationAlert && snapshot.dashboardRefreshUrgency === 'critical') {
    highInflationScenario = true;
  }
  if (snapshot.dashboardInflationHeatmapSevere && snapshot.mapLayerCostOfLivingStressActive) {
    highInflationScenario = true;
  }

  let householdInflationScenarioActive = base.householdInflationScenarioActive;
  if (snapshot.mapLayerCostOfLivingStressActive) {
    householdInflationScenarioActive = true;
  }

  if (snapshot.regionalInflationOverlayLatch && snapshot.heatmapOverlayCascadeBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.heatmapOverlayCascadeBand === 'widening' && snapshot.regionalHeatmapInflationAlert) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
    householdInflationScenarioActive,
  };
}

export function agent23DashboardsBridgeIntegrationNote(): string {
  return 'Agent 23 dashboards snapshot adjusts regional inflation alert flags; no map tile writes.';
}
