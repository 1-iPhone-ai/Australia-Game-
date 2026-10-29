import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioRebalance } from './scenario-rebalance-rank.ts';
import { rankMacroScenarioRecovery } from './scenario-recovery-rank.ts';

export interface MacroScenarioRestorationRow {
  scenarioId: string;
  restorationPriority: number;
}

/** Rank overlays for restoration planning (rebalance cushion plus recovery convergence). */
export function rankMacroScenarioRestoration(rows: MacroScenarioCompareRow[]): MacroScenarioRestorationRow[] {
  const rebalance = rankMacroScenarioRebalance(rows);
  const recovery = rankMacroScenarioRecovery(rows);
  const rebMax = Math.max(1, ...rebalance.map(r => r.rebalancePriority));
  const recMax = Math.max(1, ...recovery.map(r => r.recoveryPriority));

  return rows
    .map(row => {
      const reb = rebalance.find(r => r.scenarioId === row.scenarioId)?.rebalancePriority ?? 0;
      const rec = recovery.find(r => r.scenarioId === row.scenarioId)?.recoveryPriority ?? 0;
      const restorationPriority =
        Math.round(((reb / rebMax) * 0.5 + (rec / recMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, restorationPriority };
    })
    .sort((a, b) => b.restorationPriority - a.restorationPriority);
}
