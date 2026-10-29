import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessMacroOutputGapInflationPressureLatch,
  macroOutputGapInflationPressureLatchScoreAdjustment,
} from '../inflation/macro-output-gap-inflation-pressure-latch.js';
import {
  assessCorporateCapacityMarkupInflationSurge,
  corporateCapacityMarkupInflationSurgeScoreAdjustment,
} from '../inflation/corporate-capacity-markup-inflation-surge.js';
import type { Agent06MacroSnapshot } from '../integration/agent06-macro-bridge.js';
import type { Agent08CorporateSnapshot } from '../integration/agent08-corporate-bridge.js';

export interface MacroCorporateWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent06?: Agent06MacroSnapshot | null;
  agent08?: Agent08CorporateSnapshot | null;
}

export function MacroCorporateWaveInflationPanel(props: MacroCorporateWaveInflationPanelProps) {
  const macro = props.agent06 ?? {
    turn: props.inputs.turn,
    gdpGrowthBand: props.inputs.highInflationScenario ? ('strong' as const) : ('steady' as const),
    unemploymentBand: 'moderate' as const,
    outputGap: props.inputs.highInflationScenario ? 0.42 : 0.12,
    nominalDemandPressure: props.inputs.householdInflationScenarioActive ? 0.55 : 0.2,
    wave47MacroOutputGapLatch: props.inputs.householdInflationScenarioActive,
    outputGapEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('dominant' as const) : ('strong' as const),
    marginCompression: 'none' as const,
    passThroughIntent: props.inputs.creditShockActive ? ('full' as const) : ('partial' as const),
    wave47CorporateCapacityLatch: props.inputs.creditShockActive,
    capacityMarkupSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const latch = assessMacroOutputGapInflationPressureLatch({
    gdpGrowthBand: macro.gdpGrowthBand,
    outputGap: macro.outputGap,
    wave47MacroOutputGapLatch: macro.wave47MacroOutputGapLatch === true,
    outputGapEscalationBand: macro.outputGapEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const surge = assessCorporateCapacityMarkupInflationSurge({
    pricingPowerBand: corporate.pricingPowerBand,
    marginCompression: corporate.marginCompression,
    wave47CorporateCapacityLatch: corporate.wave47CorporateCapacityLatch === true,
    capacityMarkupSurgeBand: corporate.capacityMarkupSurgeBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-macro-corporate-wave-inflation" data-testid="macro-corporate-wave-inflation-panel">
      <h4>Macro output-gap latch & corporate capacity markup surge (round 47)</h4>
      <p>
        Macro {latch.latchBand} · index {latch.pressureIndex.toFixed(0)} · score adj{' '}
        {macroOutputGapInflationPressureLatchScoreAdjustment(latch.latchBand)}
      </p>
      <p>
        Corporate {surge.surgeBand} · index {surge.stressIndex.toFixed(0)} · score adj{' '}
        {corporateCapacityMarkupInflationSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p data-testid="macro-corporate-wave-note">{latch.narrative}</p>
      <p>{surge.narrative}</p>
    </div>
  );
}
