import type { MacroScenarioCompareRow } from './scenario-compare.ts';
import { rankMacroScenarioRegeneration } from './scenario-regeneration-rank.ts';
import { rankMacroScenarioContainment } from './scenario-containment-rank.ts';

export interface MacroScenarioReconstitutionRow {
  scenarioId: string;
  reconstitutionPriority: number;
}

/** Rank overlays for reconstitution planning (regeneration plus containment). */
export function rankMacroScenarioReconstitution(rows: MacroScenarioCompareRow[]): MacroScenarioReconstitutionRow[] {
  const regeneration = rankMacroScenarioRegeneration(rows);
  const containment = rankMacroScenarioContainment(rows);
  const regMax = Math.max(1, ...regeneration.map(r => r.regenerationPriority));
  const conMax = Math.max(1, ...containment.map(c => c.containmentPriority));

  return rows
    .map(row => {
      const reg = regeneration.find(r => r.scenarioId === row.scenarioId)?.regenerationPriority ?? 0;
      const con = containment.find(c => c.scenarioId === row.scenarioId)?.containmentPriority ?? 0;
      const reconstitutionPriority =
        Math.round(((reg / regMax) * 0.55 + (con / conMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, reconstitutionPriority };
    })
    .sort((a, b) => b.reconstitutionPriority - a.reconstitutionPriority);
}
