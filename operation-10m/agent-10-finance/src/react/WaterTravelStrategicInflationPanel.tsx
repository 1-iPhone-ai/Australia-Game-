import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessWaterUtilitiesInflation,
  waterUtilitiesInflationScoreAdjustment,
} from '../inflation/water-utilities-inflation.js';
import {
  assessDomesticTravelInflation,
  domesticTravelInflationScoreAdjustment,
} from '../inflation/domestic-travel-inflation.js';
import type { Agent01StrategicSnapshot } from '../integration/agent01-strategic-bridge.js';
import type { Agent19MemorySnapshot } from '../integration/agent19-memory-bridge.js';

export interface WaterTravelStrategicInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent01?: Agent01StrategicSnapshot | null;
  agent19?: Agent19MemorySnapshot | null;
}

export function WaterTravelStrategicInflationPanel(props: WaterTravelStrategicInflationPanelProps) {
  const strategic = props.agent01 ?? {
    turn: props.inputs.turn,
    nationalPriorityInflationBias: props.inputs.highInflationScenario ? ('expansionary' as const) : ('neutral' as const),
    strategicStockpileStress: props.inputs.creditShockActive,
    geopoliticalRiskPremium: 0.45,
  };

  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: 0.6,
    narrativeDriftTowardHigherInflation: props.inputs.highInflationScenario,
    explainabilityAlertActive: props.inputs.fiscalPressure === 'critical',
  };

  const water = assessWaterUtilitiesInflation({
    droughtStressBand: strategic.strategicStockpileStress ? 'severe' : 'moderate',
    infrastructureTariffShock: props.inputs.systemicLiquidityBand === 'critical',
    recyclingCostPassThrough: memory.explainabilityAlertActive ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const travel = assessDomesticTravelInflation({
    routeCapacityBand: strategic.nationalPriorityInflationBias === 'expansionary' ? 'constrained' : 'balanced',
    fuelSurchargePassThrough: props.inputs.highInflationScenario,
    accommodationOccupancyBand: memory.narrativeDriftTowardHigherInflation ? 'full' : 'normal',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-water-travel-strategic-inflation" data-testid="water-travel-strategic-inflation-panel">
      <h4>Water, travel & strategic memory (round 14)</h4>
      <p>
        Water {water.pressureBand} · index {water.utilitiesIndex.toFixed(0)} · score adj{' '}
        {waterUtilitiesInflationScoreAdjustment(water.pressureBand)}
      </p>
      <p>
        Travel {travel.pressureBand} · index {travel.travelIndex.toFixed(0)} · score adj{' '}
        {domesticTravelInflationScoreAdjustment(travel.pressureBand)}
      </p>
      <p data-testid="water-travel-water-note">{water.narrative}</p>
      <p>{travel.narrative}</p>
    </div>
  );
}
