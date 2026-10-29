import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type GridWholesaleTariffInflationSurgeBand = 'stable' | 'stressed' | 'cascade' | 'grid_crisis';

export interface GridWholesaleTariffInflationSurgeAssessment {
  surgeBand: GridWholesaleTariffInflationSurgeBand;
  tariffIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Grid wholesale tariff inflation surge (Agent 13). */
export function assessGridWholesaleTariffInflationSurge(input: {
  wholesaleEnergyStress: 'calm' | 'elevated' | 'severe' | 'crisis';
  retailTariffShock: boolean;
  wave40GridTariffLatch: boolean;
  wholesaleTariffCascadeBand: 'stable' | 'stressed' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): GridWholesaleTariffInflationSurgeAssessment {
  let pressure = 0;
  if (input.wholesaleEnergyStress === 'crisis') pressure += 0.25;
  else if (input.wholesaleEnergyStress === 'severe') pressure += 0.14;
  else if (input.wholesaleEnergyStress === 'elevated') pressure += 0.08;
  if (input.retailTariffShock) pressure += 0.14;
  if (input.wave40GridTariffLatch) pressure += 0.12;
  if (input.wholesaleTariffCascadeBand === 'cascade') pressure += 0.22;
  else if (input.wholesaleTariffCascadeBand === 'stressed') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const tariffIndex = finRound(100 + pressure * 16, 1);

  let surgeBand: GridWholesaleTariffInflationSurgeBand = 'stable';
  if (pressure >= 0.57) surgeBand = 'grid_crisis';
  else if (pressure >= 0.38) surgeBand = 'cascade';
  else if (pressure >= 0.17) surgeBand = 'stressed';

  const inflationScoreNudge =
    surgeBand === 'grid_crisis'
      ? 0.091
      : surgeBand === 'cascade'
        ? 0.058
        : surgeBand === 'stressed'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'grid_crisis' || surgeBand === 'cascade'
      ? 'Wholesale tariff surge feeding CPI grid metadata.'
      : surgeBand === 'stressed'
        ? 'Grid tariff latch building under wholesale stress.'
        : 'Grid wholesale tariff surge stable versus headline CPI.';

  return { surgeBand, tariffIndex, inflationScoreNudge, narrative };
}

export function gridWholesaleTariffInflationSurgeScoreAdjustment(band: GridWholesaleTariffInflationSurgeBand): number {
  if (band === 'grid_crisis') return 4;
  if (band === 'cascade') return 3;
  if (band === 'stressed') return 2;
  return 0;
}
