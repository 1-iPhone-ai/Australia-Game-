import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioRenewal } from './scenario-renewal-rank.ts';
import { rankMacroScenarioMitigation } from './scenario-mitigation-rank.ts';

export interface MacroScenarioRevivalRow {
  scenarioId: string;
  revivalPriority: number;
}

/** Rank overlays for revival planning (renewal cushion plus mitigation headroom). */
export function rankMacroScenarioRevival(rows: MacroScenarioCompareRow[]): MacroScenarioRevivalRow[] {
  const renewal = rankMacroScenarioRenewal(rows);
  const mitigation = rankMacroScenarioMitigation(rows);
  const renMax = Math.max(1, ...renewal.map(r => r.renewalPriority));
  const mitMax = Math.max(1, ...mitigation.map(m => m.mitigationPriority));

  return rows
    .map(row => {
      const ren = renewal.find(r => r.scenarioId === row.scenarioId)?.renewalPriority ?? 0;
      const mit = mitigation.find(m => m.scenarioId === row.scenarioId)?.mitigationPriority ?? 0;
      const revivalPriority =
        Math.round(((ren / renMax) * 0.55 + (mit / mitMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, revivalPriority };
    })
    .sort((a, b) => b.revivalPriority - a.revivalPriority);
}
