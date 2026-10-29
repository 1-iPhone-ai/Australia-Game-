import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroForecastProjectionSyncSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast projection sync spillover (Agent 21 wave 35 baseline handoff). */
export function readMacroForecastProjectionSyncSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastProjectionSyncSpillover {
  const sync: any =
    inputs.forecastProjectionSync ??
    inputs.forecastingLab?.projectionSync ??
    inputs.macroForecasts?.projectionSync ??
    inputs.nationalForecasts?.wave35Sync;
  if (!sync) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const ledger = String(sync.ledgerBand ?? sync.baselineBand ?? sync.integrationBand ?? '');
  const drift = String(sync.driftBand ?? sync.offsetBand ?? sync.skewBand ?? '');
  const syncBand = String(sync.syncBand ?? sync.alignmentBand ?? sync.handoffBand ?? '');

  if (ledger === 'stale' || ledger === 'critical' || ledger === 'orphaned') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Stale forecast projection ledger (${ledger}) drags macro productivity read.`;
  } else if (ledger === 'latched' || ledger === 'synced') {
    investmentNudge += 1;
    summary = `Synced projection ledger (${ledger}) supports macro investment interpretation.`;
  }

  if (drift === 'runaway' || drift === 'critical' || drift === 'unbounded') {
    cycleNudge -= 3;
    summary = (summary ? summary + ' ' : '') + 'Runaway projection drift amplifies macro downside transmission.';
  }

  if (syncBand === 'broken' || syncBand === 'critical' || syncBand === 'desynced') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Broken forecast projection sync weakens macro productivity spillover.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastProjectionSyncSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastProjectionSyncSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
