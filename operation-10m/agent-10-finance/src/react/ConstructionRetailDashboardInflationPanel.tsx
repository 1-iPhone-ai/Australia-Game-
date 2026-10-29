import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessConstructionMaterialsInflation,
  constructionMaterialsInflationScoreAdjustment,
} from '../inflation/construction-materials-inflation.js';
import {
  assessRetailTradeMarginInflation,
  retailTradeMarginInflationScoreAdjustment,
} from '../inflation/retail-trade-margin-inflation.js';
import type { Agent22UiSnapshot } from '../integration/agent22-ui-bridge.js';
import type { Agent23DashboardsSnapshot } from '../integration/agent23-dashboards-bridge.js';

export interface ConstructionRetailDashboardInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent22?: Agent22UiSnapshot | null;
  agent23?: Agent23DashboardsSnapshot | null;
}

export function ConstructionRetailDashboardInflationPanel(props: ConstructionRetailDashboardInflationPanelProps) {
  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.householdAffordability === 'severe_pressure' ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.householdInflationScenarioActive,
  };

  const dashboards = props.agent23 ?? {
    turn: props.inputs.turn,
    regionalHeatmapInflationAlert: props.inputs.highInflationScenario,
    mapLayerCostPressureScore: 0.58,
    dashboardRefreshUrgency: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const materials = assessConstructionMaterialsInflation({
    supplyChainStressBand: dashboards.regionalHeatmapInflationAlert ? 'severe' : 'elevated',
    laborShortagePassThrough: props.inputs.fiscalPressure === 'critical',
    importContentShare: 0.28,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const retail = assessRetailTradeMarginInflation({
    discountingIntensity: ui.playerAttentionOnCostOfLiving === 'high' ? 'light' : 'moderate',
    inventoryClearanceActive: false,
    wageBillPressure: dashboards.dashboardRefreshUrgency === 'critical' ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-construction-retail-dashboard-inflation" data-testid="construction-retail-dashboard-inflation-panel">
      <h4>Construction, retail & dashboards (round 15)</h4>
      <p>
        Materials {materials.pressureBand} · index {materials.materialsIndex.toFixed(0)} · score adj{' '}
        {constructionMaterialsInflationScoreAdjustment(materials.pressureBand)}
      </p>
      <p>
        Retail {retail.marginBand} · index {retail.retailIndex.toFixed(0)} · score adj{' '}
        {retailTradeMarginInflationScoreAdjustment(retail.marginBand)}
      </p>
      <p data-testid="construction-retail-materials-note">{materials.narrative}</p>
      <p>{retail.narrative}</p>
    </div>
  );
}
