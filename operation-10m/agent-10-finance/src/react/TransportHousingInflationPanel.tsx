import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessFreightLogisticsInflationCongestion,
  freightLogisticsInflationCongestionScoreAdjustment,
} from '../inflation/freight-logistics-inflation-congestion.js';
import {
  assessHousingWellbeingInflationEssentialStress,
  housingWellbeingInflationEssentialStressScoreAdjustment,
} from '../inflation/housing-wellbeing-inflation-essential-stress.js';
import type { Agent12TransportSnapshot } from '../integration/agent12-transport-bridge.js';
import type { Agent14HousingSnapshot } from '../integration/agent14-housing-bridge.js';

export interface TransportHousingInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent12?: Agent12TransportSnapshot | null;
  agent14?: Agent14HousingSnapshot | null;
}

export function TransportHousingInflationPanel(props: TransportHousingInflationPanelProps) {
  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.creditShockActive ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.highInflationScenario,
    portBacklogBand: props.inputs.fiscalPressure === 'critical' ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    logisticsInflationLatch: props.inputs.creditShockActive,
    freightCongestionBand: props.inputs.systemicLiquidityBand === 'critical' ? ('gridlocked' as const) : ('building' as const),
  };

  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand: props.inputs.householdInflationScenarioActive ? ('severe' as const) : ('elevated' as const),
    wellbeingCostBand: props.inputs.publicStability < 45 ? ('critical' as const) : ('strained' as const),
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
    shelterEssentialInflationLatch: props.inputs.creditShockActive,
    mortgageWellbeingStressBand: props.inputs.fiscalPressure === 'critical' ? ('acute' as const) : ('strained' as const),
  };

  const congestion = assessFreightLogisticsInflationCongestion({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    portBacklogBand: transport.portBacklogBand,
    logisticsInflationLatch: transport.logisticsInflationLatch === true,
    freightCongestionBand: transport.freightCongestionBand ?? 'clear',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const stress = assessHousingWellbeingInflationEssentialStress({
    mortgageStressBand: housing.mortgageStressBand,
    wellbeingCostBand: housing.wellbeingCostBand,
    essentialServicesInflationFlag: housing.essentialServicesInflationFlag,
    shelterEssentialInflationLatch: housing.shelterEssentialInflationLatch === true,
    mortgageWellbeingStressBand: housing.mortgageWellbeingStressBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-transport-housing-inflation" data-testid="transport-housing-inflation-panel">
      <h4>Freight congestion & housing essential stress (round 28)</h4>
      <p>
        Logistics {congestion.congestionBand} · index {congestion.logisticsIndex.toFixed(0)} · score adj{' '}
        {freightLogisticsInflationCongestionScoreAdjustment(congestion.congestionBand)}
      </p>
      <p>
        Shelter {stress.stressBand} · index {stress.shelterIndex.toFixed(0)} · score adj{' '}
        {housingWellbeingInflationEssentialStressScoreAdjustment(stress.stressBand)}
      </p>
      <p data-testid="transport-housing-note">{congestion.narrative}</p>
      <p>{stress.narrative}</p>
    </div>
  );
}
