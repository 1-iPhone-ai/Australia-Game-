import type {
  V1014ScenarioV2Definition,
  V1014ScenarioV2MissionGraph,
  V1014ScenarioV2Persisted,
} from './v1014-scenario-v2-types';
import { summarizeV1014ScenarioV2Run } from './v1014-scenario-v2-engine';

/** SECTION 20O — content / preset registry cross-reference (read-only ids). */
export const V1014_SCENARIO_V2_CONTENT20O_HOOKS = {
  presetPrefix: 'v93_',
  v94PresetPrefix: 'v94_',
  v2PresetPrefix: 'v1014_scenario_v2_',
  themeKey: 'v93ContentThemes',
  openingKey: 'v93RegionalOpening',
} as const;

export function mapV1014ScenarioV2ToContent20OThemes(scenario: V1014ScenarioV2Definition): string[] {
  const themes = scenario.forcedSettings[V1014_SCENARIO_V2_CONTENT20O_HOOKS.themeKey];
  if (Array.isArray(themes)) return themes.filter(t => typeof t === 'string');
  return [scenario.packArchetype.split('_')[0]];
}

/** SECTION 20L — cohesion focus projection (pure). */
export interface V1014ScenarioV2Cohesion20LProjection {
  focusSource: 'objective' | 'crisis' | 'strategy' | 'decision';
  title: string;
  detail: string | null;
  progress: string | null;
  next: string | null;
}

export function projectV1014ScenarioV2Cohesion20L(
  scenario: V1014ScenarioV2Definition,
  graph: V1014ScenarioV2MissionGraph,
  persisted: V1014ScenarioV2Persisted,
): V1014ScenarioV2Cohesion20LProjection {
  const primary = scenario.objectives.find(o => o.isPrimary);
  const activeNode = graph.nodes.find(n => persisted.nodeStates[n.id]?.phase === 'active');
  const focusSource = activeNode?.cohesionFocusSource ?? 'objective';
  return {
    focusSource,
    title: primary?.label ?? scenario.title,
    detail: activeNode?.summary ?? scenario.description,
    progress: primary ? `target ${primary.targetType}=${primary.targetValue}` : null,
    next: activeNode?.label ?? null,
  };
}

/** SECTION 20I — world reaction kinds expected while mission node active. */
export function collectV1014ScenarioV2WorldReaction20IKinds(graph: V1014ScenarioV2MissionGraph, nodeId: string): string[] {
  const node = graph.nodes.find(n => n.id === nodeId);
  return node?.requiredWorldReactionKinds ?? [];
}

/** SECTION 20AH — strategic decision architecture policy ids referenced by mission graph. */
export function collectV1014ScenarioV2Strategic20AHPolicyIds(
  graph: V1014ScenarioV2MissionGraph,
  nodeId: string,
): string[] {
  const node = graph.nodes.find(n => n.id === nodeId);
  return node?.strategicPolicyIds ?? [];
}

export function buildV1014ScenarioV2CrosswireDigest(
  scenario: V1014ScenarioV2Definition,
  graph: V1014ScenarioV2MissionGraph,
  persisted: V1014ScenarioV2Persisted,
): string {
  const cohesion = projectV1014ScenarioV2Cohesion20L(scenario, graph, persisted);
  const wr = collectV1014ScenarioV2WorldReaction20IKinds(graph, graph.entryNodeId);
  const sda = collectV1014ScenarioV2Strategic20AHPolicyIds(graph, graph.entryNodeId);
  return [
    summarizeV1014ScenarioV2Run(persisted),
    `cohesion=${cohesion.focusSource}`,
    `wr=${wr.join('|')}`,
    `sda=${sda.join('|')}`,
    `themes=${mapV1014ScenarioV2ToContent20OThemes(scenario).join('|')}`,
  ].join('; ');
}
