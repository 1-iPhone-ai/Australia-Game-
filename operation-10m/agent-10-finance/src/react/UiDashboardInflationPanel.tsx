import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessUiShellInflationSalienceEscalation,
  uiShellInflationSalienceEscalationScoreAdjustment,
} from '../inflation/ui-shell-inflation-salience-escalation.js';
import {
  assessDashboardHeatmapInflationOverlayCascade,
  dashboardHeatmapInflationOverlayCascadeScoreAdjustment,
} from '../inflation/dashboard-heatmap-inflation-overlay-cascade.js';
import type { Agent22UiSnapshot } from '../integration/agent22-ui-bridge.js';
import type { Agent23DashboardsSnapshot } from '../integration/agent23-dashboards-bridge.js';

export interface UiDashboardInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent22?: Agent22UiSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function UiDashboardInflationPanel(props: UiDashboardInflationPanelProps) {
  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.householdInflationScenarioActive ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.creditShockActive,
    wave35SalienceEscalationLatch: props.inputs.householdInflationScenarioActive,
    shellExpectationsEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('building' as const),
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.highInflationScenario,
    mapLayerCostPressureScore: props.inputs.actorCreditStressIndex ?? 0.55,
    dashboardRefreshUrgency: props.inputs.publicStability < 42 ? ('critical' as const) : ('elevated' as const),
    regionalInflationOverlayLatch: props.inputs.creditShockActive,
    heatmapOverlayCascadeBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('widening' as const),
  };

  const salience = assessUiShellInflationSalienceEscalation({
    inflationDashboardStressHighlight: ui.inflationDashboardStressHighlight,
    playerAttentionOnCostOfLiving: ui.playerAttentionOnCostOfLiving,
    uiNudgeInflationExpectationsUp: ui.uiNudgeInflationExpectationsUp,
    wave35SalienceEscalationLatch: ui.wave35SalienceEscalationLatch === true,
    shellExpectationsEscalationBand: ui.shellExpectationsEscalationBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const overlay = assessDashboardHeatmapInflationOverlayCascade({
    regionalHeatmapInflationAlert: dashboards.regionalHeatmapInflationAlert,
    mapLayerCostPressureScore: dashboards.mapLayerCostPressureScore,
    dashboardRefreshUrgency: dashboards.dashboardRefreshUrgency,
    regionalInflationOverlayLatch: dashboards.regionalInflationOverlayLatch === true,
    heatmapOverlayCascadeBand: dashboards.heatmapOverlayCascadeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-ui-dashboard-inflation" data-testid="ui-dashboard-inflation-panel">
      <h4>UI salience escalation & heatmap overlay (round 35)</h4>
      <p>
        UI {salience.escalationBand} · index {salience.salienceIndex.toFixed(0)} · score adj{' '}
        {uiShellInflationSalienceEscalationScoreAdjustment(salience.escalationBand)}
      </p>
      <p>
        Dashboard {overlay.cascadeBand} · index {overlay.overlayIndex.toFixed(0)} · score adj{' '}
        {dashboardHeatmapInflationOverlayCascadeScoreAdjustment(overlay.cascadeBand)}
      </p>
      <p data-testid="ui-dashboard-note">{salience.narrative}</p>
      <p>{overlay.narrative}</p>
    </div>
  );
}
