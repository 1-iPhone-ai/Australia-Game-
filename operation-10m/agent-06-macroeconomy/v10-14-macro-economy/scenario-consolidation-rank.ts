import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioReconstitution } from './scenario-reconstitution-rank.ts';
import { rankMacroScenarioStabilization } from './scenario-stabilization-rank.ts';

export interface MacroScenarioConsolidationRow {
  scenarioId: string;
  consolidationPriority: number;
}

/** Rank overlays for consolidation planning (reconstitution plus stabilization). */
export function rankMacroScenarioConsolidation(rows: MacroScenarioCompareRow[]): MacroScenarioConsolidationRow[] {
  const reconstitution = rankMacroScenarioReconstitution(rows);
  const stabilization = rankMacroScenarioStabilization(rows);
  const recMax = Math.max(1, ...reconstitution.map(r => r.reconstitutionPriority));
  const stabMax = Math.max(1, ...stabilization.map(s => s.stabilizationPriority));

  return rows
    .map(row => {
      const rec = reconstitution.find(r => r.scenarioId === row.scenarioId)?.reconstitutionPriority ?? 0;
      const stab = stabilization.find(s => s.scenarioId === row.scenarioId)?.stabilizationPriority ?? 0;
      const consolidationPriority =
        Math.round(((rec / recMax) * 0.55 + (stab / stabMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, consolidationPriority };
    })
    .sort((a, b) => b.consolidationPriority - a.consolidationPriority);
}
