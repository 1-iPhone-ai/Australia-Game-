import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessWholesaleEnergyTransitionInflation,
  wholesaleEnergyTransitionInflationScoreAdjustment,
} from '../inflation/wholesale-energy-transition-inflation.js';
import {
  assessUrbanRentDispersionInflation,
  urbanRentDispersionInflationScoreAdjustment,
} from '../inflation/urban-rent-dispersion-inflation.js';
import type { Agent13EnergySnapshot } from '../integration/agent13-energy-bridge.js';
import type { Agent11CitiesSnapshot } from '../integration/agent11-cities-bridge.js';

export interface EnergyCitiesInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent13?: Agent13EnergySnapshot | null;
  agent11?: Agent11CitiesSnapshot | null;
}

export function EnergyCitiesInflationPanel(props: EnergyCitiesInflationPanelProps) {
  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: props.inputs.systemicLiquidityBand === 'critical' ? ('crisis' as const) : ('severe' as const),
    retailTariffShock: props.inputs.highInflationScenario,
    gridReliabilityBand: props.inputs.systemicLiquidityBand === 'strained' ? ('fragile' as const) : ('strained' as const),
    emissionsTransitionCostBand: props.inputs.fiscalPressure === 'critical' ? ('high' as const) : ('medium' as const),
    renewableShortfallInflationFlag: props.inputs.creditShockActive,
    wholesaleCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('cascade' as const) : ('stressed' as const),
  };

  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: props.inputs.householdAffordability === 'severe_pressure' ? ('critical' as const) : ('tight' as const),
    rentGrowthBand: props.inputs.householdInflationScenarioActive ? ('surging' as const) : ('strong' as const),
    urbanizationPressure: props.inputs.publicStability < 50 ? ('high' as const) : ('medium' as const),
    regionalDispersionScore: props.inputs.householdAffordability === 'severe_pressure' ? 0.72 : 0.48,
    metroRentDispersionCritical: props.inputs.householdAffordability === 'severe_pressure',
    regionalHousingInflationSync: props.inputs.householdInflationScenarioActive,
  };

  const transition = assessWholesaleEnergyTransitionInflation({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    gridReliabilityBand: energy.gridReliabilityBand,
    emissionsTransitionCostBand: energy.emissionsTransitionCostBand,
    renewableShortfallInflationFlag: energy.renewableShortfallInflationFlag === true,
    wholesaleCascadeBand: energy.wholesaleCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const dispersion = assessUrbanRentDispersionInflation({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    urbanizationPressure: cities.urbanizationPressure,
    regionalDispersionScore: cities.regionalDispersionScore,
    metroRentDispersionCritical: cities.metroRentDispersionCritical === true,
    regionalHousingInflationSync: cities.regionalHousingInflationSync === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-energy-cities-inflation" data-testid="energy-cities-inflation-panel">
      <h4>Energy transition & urban rent dispersion (round 21)</h4>
      <p>
        Energy {transition.transitionBand} · index {transition.energyIndex.toFixed(0)} · score adj{' '}
        {wholesaleEnergyTransitionInflationScoreAdjustment(transition.transitionBand)}
      </p>
      <p>
        Urban {dispersion.dispersionBand} · index {dispersion.urbanIndex.toFixed(0)} · score adj{' '}
        {urbanRentDispersionInflationScoreAdjustment(dispersion.dispersionBand)}
      </p>
      <p data-testid="energy-cities-note">{transition.narrative}</p>
      <p>{dispersion.narrative}</p>
    </div>
  );
}
