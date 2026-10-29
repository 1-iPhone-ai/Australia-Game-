import { evaluateScenarioObjectiveProgress } from './objective-evaluator.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mPersistedObjectiveRow,
  ScenarioEvalContext,
} from './types.js';

export function sanitizeObjectiveProgress(raw: unknown): O10mPersistedObjectiveRow[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(r => r && typeof r === 'object')
    .map(r => {
      const row = r as Record<string, unknown>;
      return {
        objectiveId: String(row.objectiveId || ''),
        currentValue: typeof row.currentValue === 'number' ? row.currentValue : 0,
        targetValue: typeof row.targetValue === 'number' ? row.targetValue : 0,
        completed: row.completed === true,
        lastUpdatedTurn: typeof row.lastUpdatedTurn === 'number' ? row.lastUpdatedTurn : 0,
      };
    })
    .filter(r => r.objectiveId.length > 0)
    .slice(-48);
}

export function captureObjectiveProgressFromContext(
  state: O10mModesPersistedState,
  scenarioId: string,
  context: ScenarioEvalContext,
  turn: number,
): O10mModesPersistedState {
  const scenario = findO10mScenario(scenarioId);
  if (!scenario) return state;

  const rows: O10mPersistedObjectiveRow[] = scenario.objectives.map(objective => {
    const progress = evaluateScenarioObjectiveProgress(objective, context);
    return {
      objectiveId: objective.id,
      currentValue: progress.currentValue,
      targetValue: progress.targetValue,
      completed: progress.completed,
      lastUpdatedTurn: turn,
    };
  });

  const other = (state.objectiveProgress ?? []).filter(r => !rows.some(n => n.objectiveId === r.objectiveId));
  return {
    ...state,
    objectiveProgress: [...other, ...rows].slice(-48),
  };
}

export function readObjectiveProgressForScenario(
  state: O10mModesPersistedState,
  scenarioId: string,
): O10mPersistedObjectiveRow[] {
  const scenario = findO10mScenario(scenarioId);
  if (!scenario) return [];
  const ids = new Set(scenario.objectives.map(o => o.id));
  return (state.objectiveProgress ?? []).filter(r => ids.has(r.objectiveId));
}

export function objectiveProgressCompletionRatio(state: O10mModesPersistedState, scenarioId: string): number {
  const rows = readObjectiveProgressForScenario(state, scenarioId);
  if (rows.length === 0) return 0;
  const done = rows.filter(r => r.completed).length;
  return done / rows.length;
}

export function mergeObjectiveProgressOnImport(
  primary: O10mPersistedObjectiveRow[],
  secondary: O10mPersistedObjectiveRow[],
): O10mPersistedObjectiveRow[] {
  const map = new Map<string, O10mPersistedObjectiveRow>();
  for (const row of [...primary, ...secondary]) {
    const prev = map.get(row.objectiveId);
    if (!prev || row.lastUpdatedTurn >= prev.lastUpdatedTurn) map.set(row.objectiveId, row);
  }
  return [...map.values()].sort((a, b) => a.objectiveId.localeCompare(b.objectiveId));
}
