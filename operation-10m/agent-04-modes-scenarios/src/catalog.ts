import type { PresetScenario, ScenarioDefinition } from './types.js';
import { O10M_OPERATION_SCENARIOS } from './scenarios/o10m-presets.js';

export interface ScenarioCatalogMergeResult {
  scenarios: ScenarioDefinition[];
  o10mIds: string[];
  collisionIds: string[];
}

/** Append O10M presets after canonical `PRESET_GAME_SCENARIOS` without overwriting ids. */
export function mergePlayableScenarioCatalog(
  canonicalPresets: ScenarioDefinition[],
  o10mPresets: PresetScenario[] = O10M_OPERATION_SCENARIOS,
): ScenarioCatalogMergeResult {
  const canonicalIds = new Set(canonicalPresets.map(s => s.id));
  const collisionIds = o10mPresets.filter(s => canonicalIds.has(s.id)).map(s => s.id);
  const safeO10m = o10mPresets.filter(s => !canonicalIds.has(s.id));
  return {
    scenarios: [...canonicalPresets, ...safeO10m],
    o10mIds: safeO10m.map(s => s.id),
    collisionIds,
  };
}

export function indexScenariosById(scenarios: ScenarioDefinition[]): Map<string, ScenarioDefinition> {
  return new Map(scenarios.map(s => [s.id, s]));
}
