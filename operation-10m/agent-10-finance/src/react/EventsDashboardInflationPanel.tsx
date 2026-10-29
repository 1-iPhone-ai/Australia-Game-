import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessDynamicEventsInflationSpillover,
  dynamicEventsInflationSpilloverScoreAdjustment,
} from '../inflation/dynamic-events-inflation-spillover.js';
import {
  assessDashboardMapInflationOverlay,
  dashboardMapInflationOverlayScoreAdjustment,
} from '../inflation/dashboard-map-inflation-overlay.js';
import type { Agent05EventsSnapshot } from '../integration/agent05-events-bridge.js';
import type { Agent23DashboardsSnapshot } from '../integration/agent23-dashboards-bridge.js';

export interface EventsDashboardInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function EventsDashboardInflationPanel(props: EventsDashboardInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.creditShockActive ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('uneasy' as const),
    stagedEventCostShockBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('active' as const),
    macroEventInflationSpilloverActive: props.inputs.highInflationScenario,
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.householdInflationScenarioActive,
    mapLayerCostPressureScore: props.inputs.householdAffordability === 'severe_pressure' ? 0.78 : 0.45,
    dashboardRefreshUrgency:
      props.inputs.publicStability < 40 ? ('critical' as const) : props.inputs.highInflationScenario ? ('elevated' as const) : ('routine' as const),
    dashboardInflationHeatmapSevere: props.inputs.householdInflationScenarioActive && props.inputs.publicStability < 48,
    mapLayerCostOfLivingStressActive: props.inputs.householdAffordability === 'severe_pressure',
  };

  const spillover = assessDynamicEventsInflationSpillover({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    confidenceShockBand: events.confidenceShockBand,
    stagedEventCostShockBand: events.stagedEventCostShockBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const overlay = assessDashboardMapInflationOverlay({
    regionalHeatmapInflationAlert: dashboards.regionalHeatmapInflationAlert,
    mapLayerCostPressureScore: dashboards.mapLayerCostPressureScore,
    dashboardRefreshUrgency: dashboards.dashboardRefreshUrgency,
    dashboardInflationHeatmapSevere: dashboards.dashboardInflationHeatmapSevere === true,
    mapLayerCostOfLivingStressActive: dashboards.mapLayerCostOfLivingStressActive === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-dashboard-inflation" data-testid="events-dashboard-inflation-panel">
      <h4>Events spillover & dashboard map (round 19)</h4>
      <p>
        Events {spillover.spilloverBand} · index {spillover.eventIndex.toFixed(0)} · score adj{' '}
        {dynamicEventsInflationSpilloverScoreAdjustment(spillover.spilloverBand)}
      </p>
      <p>
        Map overlay {overlay.overlayBand} · index {overlay.presentationIndex.toFixed(0)} · score adj{' '}
        {dashboardMapInflationOverlayScoreAdjustment(overlay.overlayBand)}
      </p>
      <p data-testid="events-dashboard-note">{spillover.narrative}</p>
      <p>{overlay.narrative}</p>
    </div>
  );
}
