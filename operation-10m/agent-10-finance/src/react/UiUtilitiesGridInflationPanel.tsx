import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessPublicUtilitiesGridTariffInflation,
  publicUtilitiesGridTariffInflationScoreAdjustment,
} from '../inflation/public-utilities-grid-tariff-inflation.js';
import {
  assessUiInflationSaliencePassThrough,
  uiInflationSaliencePassThroughScoreAdjustment,
} from '../inflation/ui-inflation-salience-pass-through.js';
import type { Agent12TransportSnapshot } from '../integration/agent12-transport-bridge.js';
import type { Agent22UiSnapshot } from '../integration/agent22-ui-bridge.js';

export interface UiUtilitiesGridInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent12?: Agent12TransportSnapshot | null;
  agent22?: Agent22UiSnapshot | null;
}

export function UiUtilitiesGridInflationPanel(props: UiUtilitiesGridInflationPanelProps) {
  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.highInflationScenario,
    portBacklogBand: props.inputs.fiscalPressure === 'critical' ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.creditShockActive,
    utilitiesGridCapacityMarginThin: props.inputs.systemicLiquidityBand === 'strained',
    utilitiesOutageBandSevere: props.inputs.systemicLiquidityBand === 'critical',
  };

  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.householdInflationScenarioActive,
    playerAttentionOnCostOfLiving: props.inputs.householdAffordability === 'severe_pressure' ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.highInflationScenario,
    utilitiesStressBannerActive: props.inputs.fiscalPressure === 'critical',
    phaseShellCostOfLivingCoachActive: props.inputs.householdInflationScenarioActive,
  };

  const grid = assessPublicUtilitiesGridTariffInflation({
    serviceReliabilityBand:
      transport.utilitiesOutageBandSevere ? 'critical' : transport.utilitiesGridCapacityMarginThin ? 'fragile' : 'strained',
    outageRiskBand: transport.utilitiesOutageBandSevere ? 'severe' : transport.portBacklogBand === 'severe' ? 'rolling' : 'moderate',
    capacityMarginBand: transport.utilitiesGridCapacityMarginThin ? 'thin' : 'balanced',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const salience = assessUiInflationSaliencePassThrough({
    dashboardStressHighlight: ui.inflationDashboardStressHighlight || ui.utilitiesStressBannerActive === true,
    playerAttentionBand: ui.playerAttentionOnCostOfLiving,
    uiExpectationsNudgeUp: ui.uiNudgeInflationExpectationsUp,
    phaseShellCoachActive: ui.phaseShellCostOfLivingCoachActive === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-ui-utilities-grid-inflation" data-testid="ui-utilities-grid-inflation-panel">
      <h4>UI salience & utilities grid (round 17)</h4>
      <p>
        Grid {grid.tariffBand} · index {grid.gridIndex.toFixed(0)} · score adj{' '}
        {publicUtilitiesGridTariffInflationScoreAdjustment(grid.tariffBand)}
      </p>
      <p>
        UI salience {salience.salienceBand} · index {salience.presentationIndex.toFixed(0)} · score adj{' '}
        {uiInflationSaliencePassThroughScoreAdjustment(salience.salienceBand)}
      </p>
      <p data-testid="ui-utilities-grid-note">{grid.narrative}</p>
      <p>{salience.narrative}</p>
    </div>
  );
}
