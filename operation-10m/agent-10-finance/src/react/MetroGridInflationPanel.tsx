import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessMetroUrbanRentInflationSurge,
  metroUrbanRentInflationSurgeScoreAdjustment,
} from '../inflation/metro-urban-rent-inflation-surge.js';
import {
  assessWholesaleGridEnergyInflationCascade,
  wholesaleGridEnergyInflationCascadeScoreAdjustment,
} from '../inflation/wholesale-grid-energy-inflation-cascade.js';
import type { Agent11CitiesSnapshot } from '../integration/agent11-cities-bridge.js';
import type { Agent13EnergySnapshot } from '../integration/agent13-energy-bridge.js';

export interface MetroGridInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent11?: Agent11CitiesSnapshot | null;
  agent13?: Agent13EnergySnapshot | null;
}

export function MetroGridInflationPanel(props: MetroGridInflationPanelProps) {
  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: props.inputs.highInflationScenario ? ('critical' as const) : ('tight' as const),
    rentGrowthBand: props.inputs.householdInflationScenarioActive ? ('surging' as const) : ('strong' as const),
    urbanizationPressure: 'high' as const,
    regionalDispersionScore: 0.62,
    urbanRentInflationLatch: props.inputs.creditShockActive,
    metroDispersionStressBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('widening' as const),
  };

  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: props.inputs.highInflationScenario ? ('crisis' as const) : ('severe' as const),
    retailTariffShock: props.inputs.creditShockActive,
    gridReliabilityBand: props.inputs.systemicLiquidityBand === 'critical' ? ('fragile' as const) : ('strained' as const),
    emissionsTransitionCostBand: 'medium' as const,
    gridTariffInflationLatch: props.inputs.householdInflationScenarioActive,
    wholesaleStressCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('stressed' as const),
  };

  const surge = assessMetroUrbanRentInflationSurge({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    urbanizationPressure: cities.urbanizationPressure,
    urbanRentInflationLatch: cities.urbanRentInflationLatch === true,
    metroDispersionStressBand: cities.metroDispersionStressBand ?? 'aligned',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessWholesaleGridEnergyInflationCascade({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    gridReliabilityBand: energy.gridReliabilityBand,
    gridTariffInflationLatch: energy.gridTariffInflationLatch === true,
    wholesaleStressCascadeBand: energy.wholesaleStressCascadeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-metro-grid-inflation" data-testid="metro-grid-inflation-panel">
      <h4>Metro rent surge & grid energy cascade (round 32)</h4>
      <p>
        Metro {surge.surgeBand} · index {surge.metroIndex.toFixed(0)} · score adj{' '}
        {metroUrbanRentInflationSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p>
        Grid {cascade.cascadeBand} · index {cascade.energyIndex.toFixed(0)} · score adj{' '}
        {wholesaleGridEnergyInflationCascadeScoreAdjustment(cascade.cascadeBand)}
      </p>
      <p data-testid="metro-grid-note">{surge.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}
