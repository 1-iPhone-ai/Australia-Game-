import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessUiShellInflationAttentionLatch,
  uiShellInflationAttentionLatchScoreAdjustment,
} from '../inflation/ui-shell-inflation-attention-latch.js';
import {
  assessDashboardRegionalInflationOverlaySurge,
  dashboardRegionalInflationOverlaySurgeScoreAdjustment,
} from '../inflation/dashboard-regional-inflation-overlay-surge.js';
import type { Agent22UiSnapshot } from '../integration/agent22-ui-bridge.js';
import type { Agent23DashboardsSnapshot } from '../integration/agent23-dashboards-bridge.js';

export interface UiDashboardWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent22?: Agent22UiSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function UiDashboardWaveInflationPanel(props: UiDashboardWaveInflationPanelProps) {
  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.householdInflationScenarioActive ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.creditShockActive,
    wave43ShellAttentionLatch: props.inputs.householdInflationScenarioActive,
    playerSaliencePressureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.highInflationScenario,
    mapLayerCostPressureScore: 0.7,
    dashboardRefreshUrgency: props.inputs.creditShockActive ? ('critical' as const) : ('elevated' as const),
    wave43HeatmapOverlayLatch: props.inputs.creditShockActive,
    regionalOverlaySurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('surge' as const) : ('widening' as const),
  };

  const attention = assessUiShellInflationAttentionLatch({
    inflationDashboardStressHighlight: ui.inflationDashboardStressHighlight,
    playerAttentionOnCostOfLiving: ui.playerAttentionOnCostOfLiving,
    wave43ShellAttentionLatch: ui.wave43ShellAttentionLatch === true,
    playerSaliencePressureBand: ui.playerSaliencePressureBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const overlay = assessDashboardRegionalInflationOverlaySurge({
    regionalHeatmapInflationAlert: dashboards.regionalHeatmapInflationAlert,
    mapLayerCostPressureScore: dashboards.mapLayerCostPressureScore,
    wave43HeatmapOverlayLatch: dashboards.wave43HeatmapOverlayLatch === true,
    regionalOverlaySurgeBand: dashboards.regionalOverlaySurgeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-ui-dashboard-wave-inflation" data-testid="ui-dashboard-wave-inflation-panel">
      <h4>UI shell attention latch & regional overlay surge (round 43)</h4>
      <p>
        UI {attention.latchBand} · index {attention.attentionIndex.toFixed(0)} · score adj{' '}
        {uiShellInflationAttentionLatchScoreAdjustment(attention.latchBand)}
      </p>
      <p>
        Dashboard {overlay.surgeBand} · index {overlay.overlayIndex.toFixed(0)} · score adj{' '}
        {dashboardRegionalInflationOverlaySurgeScoreAdjustment(overlay.surgeBand)}
      </p>
      <p data-testid="ui-dashboard-wave-note">{attention.narrative}</p>
      <p>{overlay.narrative}</p>
    </div>
  );
}
