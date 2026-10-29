import { AGENT14_HOUSING_REGION_BASELINE } from './constants.ts';
import { advancePublicServicesTurn } from './turn-advance.ts';
import type { CapacityAndSpendingInputs, WellbeingMultiTurnForecast, WellbeingTurnForecastPoint } from './types.ts';
import { AGENT14_HOUSING_SCENARIOS, simulateAgent14HousingScenario, type Agent14HousingScenarioId } from './scenario-sweep.ts';

export function forecastAgent14WellbeingTurns(
  scenarioId: Agent14HousingScenarioId,
  horizonTurns: number,
  startTurn = 1
): WellbeingMultiTurnForecast {
  const sim = simulateAgent14HousingScenario(scenarioId, startTurn + horizonTurns - 1);
  const points: WellbeingTurnForecastPoint[] = sim.turns.slice(-horizonTurns).map((inp) => ({
    turn: inp.turn,
    affordabilityIndex: inp.housingWellbeing?.nationalAffordabilityIndex ?? 0,
    deliveryCapacityIndex: inp.capacity.deliveryCapacityIndex,
    fiscalLoad: inp.fiscalLoadFromActivePrograms,
    equityGap: inp.housingWellbeing?.regionalEquityGap ?? 0,
  }));
  return { scenarioId, horizonTurns, points };
}

export function forecastFromInputs(
  baseInputs: CapacityAndSpendingInputs,
  horizonTurns: number
): WellbeingTurnForecastPoint[] {
  const remoteShareByRegion = Object.fromEntries(
    Object.entries(AGENT14_HOUSING_REGION_BASELINE).map(([k, v]) => [k, v.remoteShare])
  );
  void remoteShareByRegion;
  let spendingPersisted = null;
  const points: WellbeingTurnForecastPoint[] = [];
  const start = Math.max(1, baseInputs.turn || 1);
  for (let t = start; t < start + horizonTurns; t += 1) {
    const r = advancePublicServicesTurn({
      inputs: { ...baseInputs, turn: t },
      spendingPersisted,
    });
    spendingPersisted = r.spendingPersisted;
    points.push({
      turn: t,
      affordabilityIndex: r.inputs.housingWellbeing?.nationalAffordabilityIndex ?? 0,
      deliveryCapacityIndex: r.inputs.capacity.deliveryCapacityIndex,
      fiscalLoad: r.inputs.fiscalLoadFromActivePrograms,
      equityGap: r.inputs.housingWellbeing?.regionalEquityGap ?? 0,
    });
  }
  return points;
}

export function listAgent14ScenarioIds(): Agent14HousingScenarioId[] {
  return AGENT14_HOUSING_SCENARIOS.map((s) => s.id);
}
