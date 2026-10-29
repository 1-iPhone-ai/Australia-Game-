import type { StrategicActionDefinition } from '../types/strategic-action.ts';
import type { ConsequenceForecast } from '../types/strategic-action.ts';

function sumTreasuryFromAction(action: StrategicActionDefinition): number {
  let total = 0;
  const immediate = action.immediateEffects.economy;
  if (immediate?.cashDelta) total += immediate.cashDelta;
  if (immediate?.treasuryDelta) total += immediate.treasuryDelta;
  for (const trade of action.delayedTradeOffs) {
    total += trade.effects.economy?.cashDelta ?? 0;
    total += trade.effects.economy?.treasuryDelta ?? 0;
    total += trade.effects.economy?.debtDelta ?? 0;
  }
  return total;
}

function sumPopulationStressFromAction(action: StrategicActionDefinition): number {
  let total = 0;
  total += action.immediateEffects.population?.affordabilityStressDelta ?? 0;
  for (const trade of action.delayedTradeOffs) {
    total += trade.effects.population?.affordabilityStressDelta ?? 0;
  }
  return total;
}

export function buildConsequenceForecast(
  action: StrategicActionDefinition,
  currentDay: number,
  delayDays = 3,
): ConsequenceForecast {
  const immediateSummary: string[] = [];
  if (action.immediateEffects.economy?.ledgerNote) {
    immediateSummary.push(action.immediateEffects.economy.ledgerNote);
  }
  immediateSummary.push(
    `Up-front: cash ${action.cashCost.toLocaleString()}, treasury ${action.treasuryCost.toLocaleString()}, AP ${action.apCost}.`,
  );

  const delayedSummary = action.delayedTradeOffs.map(
    (t, i) => `Day ${currentDay + delayDays + i}: ${t.warning}`,
  );

  return {
    actionId: action.id,
    immediateSummary,
    delayedSummary,
    totalDelayedEffects: action.delayedTradeOffs.length,
    earliestTradeOffDay:
      action.delayedTradeOffs.length > 0 ? currentDay + delayDays : null,
    populationStressDelta: sumPopulationStressFromAction(action),
    treasuryDeltaEstimate: sumTreasuryFromAction(action),
  };
}

export function mergeConsequenceForecasts(
  forecasts: ConsequenceForecast[],
): ConsequenceForecast | null {
  if (forecasts.length === 0) return null;
  const first = forecasts[0];
  return forecasts.slice(1).reduce(
    (acc, f) => ({
      actionId: acc.actionId,
      immediateSummary: [...acc.immediateSummary, ...f.immediateSummary],
      delayedSummary: [...acc.delayedSummary, ...f.delayedSummary],
      totalDelayedEffects: acc.totalDelayedEffects + f.totalDelayedEffects,
      earliestTradeOffDay:
        acc.earliestTradeOffDay === null
          ? f.earliestTradeOffDay
          : f.earliestTradeOffDay === null
            ? acc.earliestTradeOffDay
            : Math.min(acc.earliestTradeOffDay, f.earliestTradeOffDay),
      populationStressDelta: acc.populationStressDelta + f.populationStressDelta,
      treasuryDeltaEstimate: acc.treasuryDeltaEstimate + f.treasuryDeltaEstimate,
    }),
    { ...first },
  );
}
