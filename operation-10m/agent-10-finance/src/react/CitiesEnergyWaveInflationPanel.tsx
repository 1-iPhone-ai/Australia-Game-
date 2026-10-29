import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessMetroCapacityRentInflationLatch,
  metroCapacityRentInflationLatchScoreAdjustment,
} from '../inflation/metro-capacity-rent-inflation-latch.js';
import {
  assessGridWholesaleTariffInflationSurge,
  gridWholesaleTariffInflationSurgeScoreAdjustment,
} from '../inflation/grid-wholesale-tariff-inflation-surge.js';
import type { Agent11CitiesSnapshot } from '../integration/agent11-cities-bridge.js';
import type { Agent13EnergySnapshot } from '../integration/agent13-energy-bridge.js';

export interface CitiesEnergyWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent11?: Agent11CitiesSnapshot | null;
  agent13?: Agent13EnergySnapshot | null;
}

export function CitiesEnergyWaveInflationPanel(props: CitiesEnergyWaveInflationPanelProps) {
  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: props.inputs.householdInflationScenarioActive ? ('critical' as const) : ('tight' as const),
    rentGrowthBand: props.inputs.highInflationScenario ? ('surging' as const) : ('strong' as const),
    urbanizationPressure: 'high' as const,
    regionalDispersionScore: 0.6,
    wave40UrbanRentLatch: props.inputs.householdInflationScenarioActive,
    metroCapacityStressBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('strained' as const),
  };

  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: props.inputs.systemicLiquidityBand === 'critical' ? ('crisis' as const) : ('severe' as const),
    retailTariffShock: props.inputs.creditShockActive,
    gridReliabilityBand: props.inputs.publicStability < 40 ? ('fragile' as const) : ('strained' as const),
    emissionsTransitionCostBand: 'medium' as const,
    wave40GridTariffLatch: props.inputs.creditShockActive,
    wholesaleTariffCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('stressed' as const),
  };

  const metro = assessMetroCapacityRentInflationLatch({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    wave40UrbanRentLatch: cities.wave40UrbanRentLatch === true,
    metroCapacityStressBand: cities.metroCapacityStressBand ?? 'aligned',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const grid = assessGridWholesaleTariffInflationSurge({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    wave40GridTariffLatch: energy.wave40GridTariffLatch === true,
    wholesaleTariffCascadeBand: energy.wholesaleTariffCascadeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-cities-energy-wave-inflation" data-testid="cities-energy-wave-inflation-panel">
      <h4>Metro capacity latch & grid tariff surge (round 40)</h4>
      <p>
        Metro {metro.latchBand} · index {metro.capacityIndex.toFixed(0)} · score adj{' '}
        {metroCapacityRentInflationLatchScoreAdjustment(metro.latchBand)}
      </p>
      <p>
        Grid {grid.surgeBand} · index {grid.tariffIndex.toFixed(0)} · score adj{' '}
        {gridWholesaleTariffInflationSurgeScoreAdjustment(grid.surgeBand)}
      </p>
      <p data-testid="cities-energy-wave-note">{metro.narrative}</p>
      <p>{grid.narrative}</p>
    </div>
  );
}
