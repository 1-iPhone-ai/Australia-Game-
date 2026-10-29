import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessFoodGroceryPassThrough,
  foodGroceryPassThroughInflationScoreAdjustment,
} from '../inflation/food-grocery-pass-through.js';
import {
  assessTransportLogisticsInflation,
  transportLogisticsInflationScoreAdjustment,
} from '../inflation/transport-logistics-inflation.js';
import type { Agent14HousingSnapshot } from '../integration/agent14-housing-bridge.js';
import type { Agent12TransportSnapshot } from '../integration/agent12-transport-bridge.js';

export interface TransportFoodInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent14?: Agent14HousingSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function TransportFoodInflationPanel(props: TransportFoodInflationPanelProps) {
  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand: 'elevated' as const,
    wellbeingCostBand: 'strained' as const,
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: 'tight' as const,
    fuelSurchargeActive: props.inputs.highInflationScenario,
    portBacklogBand: 'moderate' as const,
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
  };

  const food = assessFoodGroceryPassThrough({
    harvestStressBand: props.inputs.fiscalPressure === 'critical' ? 'severe' : 'weak',
    retailMarginPressure: housing.wellbeingCostBand === 'critical' ? 'high' : 'medium',
    supplyChainDisruption: transport.portBacklogBand === 'severe' || transport.freightCapacityBand === 'critical',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const logistics = assessTransportLogisticsInflation({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    portBacklogBand: transport.portBacklogBand,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-transport-food-inflation" data-testid="transport-food-inflation-panel">
      <h4>Food, transport & wellbeing (round 9)</h4>
      <p>
        Grocery {food.passThroughBand} · index {food.groceryIndex.toFixed(0)} · score adj{' '}
        {foodGroceryPassThroughInflationScoreAdjustment(food.passThroughBand)}
      </p>
      <p>
        Logistics {logistics.pressureBand} · index {logistics.freightIndex.toFixed(0)} · score adj{' '}
        {transportLogisticsInflationScoreAdjustment(logistics.pressureBand)}
      </p>
      <p data-testid="transport-food-food-note">{food.narrative}</p>
      <p>{logistics.narrative}</p>
    </div>
  );
}
