import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioStabilization } from './scenario-stabilization-rank.ts';
import { rankMacroScenarioTriage } from './scenario-triage-rank.ts';

export interface MacroScenarioMitigationRow {
  scenarioId: string;
  mitigationPriority: number;
}

/** Rank overlays for mitigation planning (stabilization plus triage urgency). */
export function rankMacroScenarioMitigation(rows: MacroScenarioCompareRow[]): MacroScenarioMitigationRow[] {
  const stabilization = rankMacroScenarioStabilization(rows);
  const triage = rankMacroScenarioTriage(rows);
  const stabMax = Math.max(1, ...stabilization.map(s => s.stabilizationPriority));
  const triMax = Math.max(1, ...triage.map(t => t.triagePriority));

  return rows
    .map(row => {
      const stab = stabilization.find(s => s.scenarioId === row.scenarioId)?.stabilizationPriority ?? 0;
      const tri = triage.find(t => t.scenarioId === row.scenarioId)?.triagePriority ?? 0;
      const mitigationPriority =
        Math.round(((stab / stabMax) * 0.5 + (tri / triMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, mitigationPriority };
    })
    .sort((a, b) => b.mitigationPriority - a.mitigationPriority);
}
