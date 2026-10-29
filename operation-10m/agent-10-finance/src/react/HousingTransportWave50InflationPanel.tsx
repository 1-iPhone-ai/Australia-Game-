import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessHousingWellbeingMortgageInflationEscalationLatch,
  housingWellbeingMortgageInflationEscalationLatchScoreAdjustment,
} from '../inflation/housing-wellbeing-mortgage-inflation-escalation-latch.js';
import {
  assessTransportCorridorFreightInflationSurgeLatch,
  transportCorridorFreightInflationSurgeLatchScoreAdjustment,
} from '../inflation/transport-corridor-freight-inflation-surge-latch.js';
import type { Agent14HousingSnapshot } from '../integration/agent14-housing-bridge.js';
import type { Agent12TransportSnapshot } from '../integration/agent12-transport-bridge.js';

export interface HousingTransportWave50InflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent14?: Agent14HousingSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function HousingTransportWave50InflationPanel(props: HousingTransportWave50InflationPanelProps) {
  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand: props.inputs.householdInflationScenarioActive ? ('severe' as const) : ('elevated' as const),
    wellbeingCostBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('strained' as const),
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
    wave50HousingWellbeingEscalationLatch: props.inputs.householdInflationScenarioActive,
    mortgageWellbeingEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('acute' as const) : ('building' as const),
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.creditShockActive ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.creditShockActive,
    portBacklogBand: props.inputs.systemicLiquidityBand === 'critical' ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    wave50FreightCorridorSurgeLatch: props.inputs.creditShockActive,
    corridorFreightSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const wellbeing = assessHousingWellbeingMortgageInflationEscalationLatch({
    mortgageStressBand: housing.mortgageStressBand,
    wellbeingCostBand: housing.wellbeingCostBand,
    wave50HousingWellbeingEscalationLatch: housing.wave50HousingWellbeingEscalationLatch === true,
    mortgageWellbeingEscalationBand: housing.mortgageWellbeingEscalationBand ?? 'contained',
    essentialServicesInflationFlag: housing.essentialServicesInflationFlag,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const corridor = assessTransportCorridorFreightInflationSurgeLatch({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    wave50FreightCorridorSurgeLatch: transport.wave50FreightCorridorSurgeLatch === true,
    corridorFreightSurgeBand: transport.corridorFreightSurgeBand ?? 'clear',
    portBacklogBand: transport.portBacklogBand,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-housing-transport-wave50-inflation" data-testid="housing-transport-wave50-inflation-panel">
      <h4>Housing wellbeing mortgage escalation & transport corridor freight surge (round 50)</h4>
      <p>
        Housing {wellbeing.latchBand} · index {wellbeing.escalationIndex.toFixed(0)} · score adj{' '}
        {housingWellbeingMortgageInflationEscalationLatchScoreAdjustment(wellbeing.latchBand)}
      </p>
      <p>
        Corridor {corridor.surgeBand} · index {corridor.corridorIndex.toFixed(0)} · score adj{' '}
        {transportCorridorFreightInflationSurgeLatchScoreAdjustment(corridor.surgeBand)}
      </p>
      <p data-testid="housing-transport-wave50-note">{wellbeing.narrative}</p>
      <p>{corridor.narrative}</p>
    </div>
  );
}
