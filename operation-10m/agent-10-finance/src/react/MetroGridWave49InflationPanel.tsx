import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessMetroRegionalRentInflationEscalationLatch,
  metroRegionalRentInflationEscalationLatchScoreAdjustment,
} from '../inflation/metro-regional-rent-inflation-escalation-latch.js';
import {
  assessWholesaleGridTransitionInflationSurge,
  wholesaleGridTransitionInflationSurgeScoreAdjustment,
} from '../inflation/wholesale-grid-transition-inflation-surge.js';
import type { Agent11CitiesSnapshot } from '../integration/agent11-cities-bridge.js';
import type { Agent13EnergySnapshot } from '../integration/agent13-energy-bridge.js';

export interface MetroGridWave49InflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent11?: Agent11CitiesSnapshot | null;
  agent13?: Agent13EnergySnapshot | null;
}

export function MetroGridWave49InflationPanel(props: MetroGridWave49InflationPanelProps) {
  const cities = props.agent11 ?? {
    turn: props.inputs.turn,
    vacancyBand: 'tight' as const,
    rentGrowthBand: props.inputs.highInflationScenario ? ('surging' as const) : ('strong' as const),
    urbanizationPressure: 'high' as const,
    regionalDispersionScore: props.inputs.householdInflationScenarioActive ? 0.62 : 0.38,
    wave49MetroRegionalRentLatch: props.inputs.householdInflationScenarioActive,
    regionalRentEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('building' as const),
  };

  const energy = props.agent13 ?? {
    turn: props.inputs.turn,
    wholesaleEnergyStress: props.inputs.fiscalPressure === 'critical' ? ('crisis' as const) : ('severe' as const),
    retailTariffShock: props.inputs.creditShockActive,
    gridReliabilityBand: 'strained' as const,
    emissionsTransitionCostBand: 'high' as const,
    wave49GridTransitionSurgeLatch: props.inputs.creditShockActive,
    gridTransitionStressBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('stressed' as const),
  };

  const metro = assessMetroRegionalRentInflationEscalationLatch({
    rentGrowthBand: cities.rentGrowthBand,
    regionalDispersionScore: cities.regionalDispersionScore,
    wave49MetroRegionalRentLatch: cities.wave49MetroRegionalRentLatch === true,
    regionalRentEscalationBand: cities.regionalRentEscalationBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const grid = assessWholesaleGridTransitionInflationSurge({
    wholesaleEnergyStress: energy.wholesaleEnergyStress,
    emissionsTransitionCostBand: energy.emissionsTransitionCostBand,
    wave49GridTransitionSurgeLatch: energy.wave49GridTransitionSurgeLatch === true,
    gridTransitionStressBand: energy.gridTransitionStressBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-metro-grid-wave49-inflation" data-testid="metro-grid-wave49-inflation-panel">
      <h4>Metro regional rent escalation & wholesale grid transition surge (round 49)</h4>
      <p>
        Metro {metro.latchBand} · index {metro.escalationIndex.toFixed(0)} · score adj{' '}
        {metroRegionalRentInflationEscalationLatchScoreAdjustment(metro.latchBand)}
      </p>
      <p>
        Grid {grid.surgeBand} · index {grid.stressIndex.toFixed(0)} · score adj{' '}
        {wholesaleGridTransitionInflationSurgeScoreAdjustment(grid.surgeBand)}
      </p>
      <p data-testid="metro-grid-wave49-note">{metro.narrative}</p>
      <p>{grid.narrative}</p>
    </div>
  );
}
