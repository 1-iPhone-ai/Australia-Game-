import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioRestoration } from './scenario-restoration-rank.ts';
import { rankMacroScenarioAdaptation } from './scenario-adaptation-rank.ts';

export interface MacroScenarioRenewalRow {
  scenarioId: string;
  renewalPriority: number;
}

/** Rank overlays for renewal planning (restoration plus adaptation headroom). */
export function rankMacroScenarioRenewal(rows: MacroScenarioCompareRow[]): MacroScenarioRenewalRow[] {
  const restoration = rankMacroScenarioRestoration(rows);
  const adaptation = rankMacroScenarioAdaptation(rows);
  const resMax = Math.max(1, ...restoration.map(r => r.restorationPriority));
  const adMax = Math.max(1, ...adaptation.map(a => a.adaptationPriority));

  return rows
    .map(row => {
      const res = restoration.find(r => r.scenarioId === row.scenarioId)?.restorationPriority ?? 0;
      const ad = adaptation.find(a => a.scenarioId === row.scenarioId)?.adaptationPriority ?? 0;
      const renewalPriority =
        Math.round(((res / resMax) * 0.55 + (ad / adMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, renewalPriority };
    })
    .sort((a, b) => b.renewalPriority - a.renewalPriority);
}
