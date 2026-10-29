import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioMitigation } from './scenario-mitigation-rank.ts';
import { rankMacroScenarioRecovery } from './scenario-recovery-rank.ts';

export interface MacroScenarioAdaptationRow {
  scenarioId: string;
  adaptationPriority: number;
}

/** Rank overlays for adaptation planning (mitigation plus recovery cushion). */
export function rankMacroScenarioAdaptation(rows: MacroScenarioCompareRow[]): MacroScenarioAdaptationRow[] {
  const mitigation = rankMacroScenarioMitigation(rows);
  const recovery = rankMacroScenarioRecovery(rows);
  const mitMax = Math.max(1, ...mitigation.map(m => m.mitigationPriority));
  const recMax = Math.max(1, ...recovery.map(r => r.recoveryPriority));

  return rows
    .map(row => {
      const mit = mitigation.find(m => m.scenarioId === row.scenarioId)?.mitigationPriority ?? 0;
      const rec = recovery.find(r => r.scenarioId === row.scenarioId)?.recoveryPriority ?? 0;
      const adaptationPriority =
        Math.round(((mit / mitMax) * 0.55 + (rec / recMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, adaptationPriority };
    })
    .sort((a, b) => b.adaptationPriority - a.adaptationPriority);
}
