import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTurnsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.2 turns / temporal cadence spillover (never mutates turn state). */
export function readMacroTurnsSpilloverFromV102(inputs: MacroEconomyInputs): MacroTurnsSpillover {
  const tt: any =
    inputs.turnsTime ??
    inputs.temporalCadence ??
    inputs.gameClock ??
    inputs.nationalSystems?.turnsTime ??
    inputs.nationalSystems?.temporal;
  if (!tt && !inputs.turn) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pace = String(tt?.paceBand ?? tt?.turnPace?.band ?? tt?.cadenceBand ?? '');
  const season = String(tt?.season ?? tt?.currentSeason ?? '');
  const phase = String(tt?.macroPhaseBand ?? tt?.cycleCadence?.band ?? tt?.economicSeason?.band ?? '');
  const backlog = String(tt?.deferredTurnLoad?.band ?? tt?.turnBacklogBand ?? '');

  if (pace === 'accelerated' || pace === 'compressed') {
    cycleNudge += 1;
    investmentNudge += 0.5;
    summary = `Accelerated turn cadence (${pace}) lifts short-horizon macro cycle read.`;
  } else if (pace === 'stalled' || pace === 'frozen' || pace === 'deferred') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Stalled turn cadence (${pace}) drags macro investment and cycle interpretation.`;
  }

  if (season === 'Winter' || season === 'Autumn') {
    cycleNudge -= season === 'Winter' ? 1 : 0.5;
    summary = (summary ? summary + ' ' : '') + `${season} seasonal cadence weighs on macro cycle read.`;
  } else if (season === 'Spring' || season === 'Summer') {
    cycleNudge += 0.5;
  }

  if (phase === 'late_cycle' || phase === 'overheating') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Late-cycle temporal phase tightens macro read.';
  } else if (phase === 'early_recovery' || phase === 'expansionary_cadence') {
    cycleNudge += 1;
    investmentNudge += 1;
  }

  if (backlog === 'elevated' || backlog === 'critical') {
    productivityNudge -= 1;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Deferred turn backlog signals administrative macro drag.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTurnsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTurnsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
