import type { MacroFinancialPersisted, NationalMacroFinancialState } from '../definitions/types.js';
import { computeNationalMacroFinancialConditions, makeDefaultMacroFinancialTestInputs } from '../compute/national-macro-financial.js';

export interface MacroFinancialTurnSimulationRow {
  turn: number;
  inflation: NationalMacroFinancialState['inflation'];
  credit: NationalMacroFinancialState['credit'];
  stability: NationalMacroFinancialState['stability'];
  costMult: number;
  spreadMult: number;
  eventCount: number;
}

export interface MacroFinancialTurnSimulationResult {
  rows: MacroFinancialTurnSimulationRow[];
  finalPersisted: MacroFinancialPersisted;
  finalState: NationalMacroFinancialState;
}

/** Multi-turn deterministic harness for regression / Agent 25 smoke (no wallet mutation). */
export function simulateMacroFinancialTurns(
  turnCount: number,
  mutate?: (turn: number, base: ReturnType<typeof makeDefaultMacroFinancialTestInputs>) => ReturnType<typeof makeDefaultMacroFinancialTestInputs>,
): MacroFinancialTurnSimulationResult {
  const rows: MacroFinancialTurnSimulationRow[] = [];
  let persisted: MacroFinancialPersisted | null = null;
  let prev: NationalMacroFinancialState | null = null;
  for (let t = 1; t <= turnCount; t++) {
    let inputs = makeDefaultMacroFinancialTestInputs({ turn: t });
    if (mutate) inputs = mutate(t, inputs);
    const r = computeNationalMacroFinancialConditions(inputs, persisted, prev);
    persisted = r.persisted;
    prev = r.state;
    rows.push({
      turn: t,
      inflation: r.state.inflation,
      credit: r.state.credit,
      stability: r.state.stability,
      costMult: r.state.modifiers.costOfLivingMultiplier,
      spreadMult: r.state.modifiers.creditSpreadMultiplier,
      eventCount: r.events.length,
    });
  }
  return { rows, finalPersisted: persisted!, finalState: prev! };
}

export function detectSimulationStressSpiral(rows: MacroFinancialTurnSimulationRow[]): boolean {
  if (rows.length < 3) return false;
  const spreads = rows.map((r) => r.spreadMult);
  return spreads[spreads.length - 1] > spreads[0] + 0.08;
}
