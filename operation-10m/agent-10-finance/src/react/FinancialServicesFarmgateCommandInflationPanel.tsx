import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessFinancialServicesFeeInflation,
  financialServicesFeeInflationScoreAdjustment,
} from '../inflation/financial-services-fee-inflation.js';
import {
  assessAgriculturalFarmgateInflation,
  agriculturalFarmgateInflationScoreAdjustment,
} from '../inflation/agricultural-farmgate-inflation.js';
import type { Agent16GuardianSnapshot } from '../integration/agent16-guardian-bridge.js';
import type { Agent17CommandSnapshot } from '../integration/agent17-command-bridge.js';

export interface FinancialServicesFarmgateCommandInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent17?: Agent17CommandSnapshot | null;
}

export function FinancialServicesFarmgateCommandInflationPanel(props: FinancialServicesFarmgateCommandInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.fiscalPressure === 'critical' ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.creditShockActive ? ('high' as const) : ('medium' as const),
    financialServicesFeeShockActive: props.inputs.creditShockActive,
  };

  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: props.inputs.householdInflationScenarioActive ? 0.78 : 0.52,
    coordinatedTighteningSuggested: props.inputs.fiscalPressure === 'critical',
    farmgateSupplyAlertActive: props.inputs.systemicLiquidityBand === 'critical',
  };

  const fees = assessFinancialServicesFeeInflation({
    fundingCostPassThrough: guardian.financialServicesFeeShockActive ? 'high' : props.inputs.creditShockActive ? 'medium' : 'low',
    complianceCostStackActive: guardian.inflationGuardrailTripped,
    depositRateCompetitionBand: command.coordinatedTighteningSuggested ? 'intense' : 'normal',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const farmgate = assessAgriculturalFarmgateInflation({
    harvestStressBand: command.farmgateSupplyAlertActive ? 'severe' : props.inputs.fiscalPressure === 'critical' ? 'weak' : 'normal',
    transportToMarketBand: props.inputs.systemicLiquidityBand === 'critical' ? 'critical' : 'strained',
    inputCostPassThrough: guardian.narrativeShockSeverity === 'high',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-financial-farmgate-command-inflation" data-testid="financial-farmgate-command-inflation-panel">
      <h4>Financial services, farmgate & command (round 16)</h4>
      <p>
        Fees {fees.feeBand} · index {fees.servicesIndex.toFixed(0)} · score adj{' '}
        {financialServicesFeeInflationScoreAdjustment(fees.feeBand)}
      </p>
      <p>
        Farmgate {farmgate.pressureBand} · index {farmgate.farmgateIndex.toFixed(0)} · score adj{' '}
        {agriculturalFarmgateInflationScoreAdjustment(farmgate.pressureBand)}
      </p>
      <p data-testid="financial-farmgate-fees-note">{fees.narrative}</p>
      <p>{farmgate.narrative}</p>
    </div>
  );
}
