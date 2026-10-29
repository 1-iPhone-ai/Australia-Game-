import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessEnergyPricePassThrough,
  energyPassThroughInflationScoreAdjustment,
} from '../inflation/energy-price-pass-through.js';
import {
  assessShelterRentInflation,
  shelterRentInflationScoreAdjustment,
} from '../inflation/shelter-rent-inflation.js';
import type { Agent11CitiesSnapshot } from '../integration/agent11-cities-bridge.js';
import type { Agent13EnergySnapshot } from '../integration/agent13-energy-bridge.js';

export interface UrbanEnergyInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent11?: Agent11CitiesSnapshot | null;
  agent13?: Agent13EnergySnapshot | null;
}

export function UrbanEnergyInflationPanel(props: UrbanEnergyInflationPanelProps) {
  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: 'tight' as const,
    rentGrowthBand: 'moderate' as const,
    urbanizationPressure: 'medium' as const,
    regionalDispersionScore: 0.4,
  };

  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: 'elevated' as const,
    retailTariffShock: props.inputs.fiscalPressure === 'critical',
    gridReliabilityBand: 'strained' as const,
    emissionsTransitionCostBand: 'medium' as const,
  };

  const shelter = assessShelterRentInflation({
    vacancyBand: cities.vacancyBand,
    rentGrowthBand: cities.rentGrowthBand,
    urbanizationPressure: cities.urbanizationPressure,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const energyPass = assessEnergyPricePassThrough({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    retailTariffShock: energy.retailTariffShock,
    gridReliabilityBand: energy.gridReliabilityBand,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-urban-energy-inflation" data-testid="urban-energy-inflation-panel">
      <h4>Urban shelter & energy (round 8)</h4>
      <p>
        Shelter {shelter.pressureBand} · index {shelter.shelterIndex.toFixed(0)} · score adj{' '}
        {shelterRentInflationScoreAdjustment(shelter.pressureBand)}
      </p>
      <p>
        Energy {energyPass.passThroughBand} · index {energyPass.energyCostIndex.toFixed(0)} · score adj{' '}
        {energyPassThroughInflationScoreAdjustment(energyPass.passThroughBand)}
      </p>
      <p>{shelter.narrative}</p>
      <p data-testid="urban-energy-energy-note">{energyPass.narrative}</p>
    </div>
  );
}
