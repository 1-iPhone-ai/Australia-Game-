import { describe, expect, it } from 'vitest';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';
import {
  buildConsequenceForecast,
  mergeConsequenceForecasts,
} from '../src/engine/consequence-forecast.ts';

describe('consequence forecast', () => {
  it('summarizes delayed trade-offs for water upgrade', () => {
    const action = getStrategicAction('sga_water_grid_upgrade')!;
    const forecast = buildConsequenceForecast(action, 10, 3);
    expect(forecast.totalDelayedEffects).toBe(1);
    expect(forecast.earliestTradeOffDay).toBe(13);
    expect(forecast.delayedSummary[0]).toContain('Day 13');
    expect(forecast.populationStressDelta).toBeGreaterThan(0);
    expect(forecast.treasuryDeltaEstimate).toBeLessThan(0);
  });

  it('merges forecasts for stacked commitments', () => {
    const a = buildConsequenceForecast(getStrategicAction('sga_supply_chain_buffer')!, 1);
    const b = buildConsequenceForecast(getStrategicAction('sga_economic_diversification_pilot')!, 1);
    const merged = mergeConsequenceForecasts([a, b]);
    expect(merged?.totalDelayedEffects).toBe(3);
    expect(merged!.delayedSummary.length).toBe(3);
  });
});
