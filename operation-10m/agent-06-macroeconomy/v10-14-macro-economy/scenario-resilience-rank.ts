import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioHedge } from './scenario-hedge-rank.ts';
import { rankMacroScenarioRecovery } from './scenario-recovery-rank.ts';

export interface MacroScenarioResilienceRow {
  scenarioId: string;
  resiliencePriority: number;
}

/** Rank overlays for resilience planning (recovery plus hedge cushion). */
export function rankMacroScenarioResilience(rows: MacroScenarioCompareRow[]): MacroScenarioResilienceRow[] {
  const recovery = rankMacroScenarioRecovery(rows);
  const hedge = rankMacroScenarioHedge(rows);
  const recMax = Math.max(1, ...recovery.map(r => r.recoveryPriority));
  const hedgeMax = Math.max(1, ...hedge.map(h => h.hedgeIndex));

  return rows
    .map(row => {
      const rec = recovery.find(r => r.scenarioId === row.scenarioId)?.recoveryPriority ?? 0;
      const hed = hedge.find(h => h.scenarioId === row.scenarioId)?.hedgeIndex ?? 0;
      const resiliencePriority =
        Math.round(((rec / recMax) * 0.55 + (hed / hedgeMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, resiliencePriority };
    })
    .sort((a, b) => b.resiliencePriority - a.resiliencePriority);
}
