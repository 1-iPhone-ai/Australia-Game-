import { V1014_SCENARIO_V2_CATALOG, V1014_SCENARIO_V2_GRAPH_BY_ID } from './v1014-scenario-v2-catalog-aggregate';
import {
  advanceV1014ScenarioV2MissionNode,
  initializeV1014ScenarioV2Run,
  validateV1014ScenarioV2MissionGraph,
  v1014ScenarioV2ReplaySeed,
} from './v1014-scenario-v2-engine';
import { buildV1014ScenarioV2CrosswireDigest } from './v1014-scenario-v2-crosswire';

export interface V1014ScenarioV2FixtureRun {
  id: string;
  scenarioId: string;
  passed: boolean;
  detail: string;
}

export function runV1014ScenarioV2Fixture(id: string, scenarioId: string, succeedPrimary: boolean): V1014ScenarioV2FixtureRun {
  const scenario = V1014_SCENARIO_V2_CATALOG.find(s => s.id === scenarioId);
  if (!scenario) return { id, scenarioId, passed: false, detail: 'missing_scenario' };
  const graph = V1014_SCENARIO_V2_GRAPH_BY_ID[scenario.missionGraphId];
  if (!graph) return { id, scenarioId, passed: false, detail: 'missing_graph' };
  const issues = validateV1014ScenarioV2MissionGraph(graph);
  if (issues.length) return { id, scenarioId, passed: false, detail: issues.join(',') };
  let persisted = initializeV1014ScenarioV2Run(scenario, graph, 1);
  const replay = v1014ScenarioV2ReplaySeed(scenario.id, scenario.replaySafeSeed);
  if (persisted.replaySeed !== replay) return { id, scenarioId, passed: false, detail: 'replay_seed_mismatch' };
  const firstObjNode = graph.nodes.find(n => n.kind === 'objective');
  if (firstObjNode) {
    persisted = advanceV1014ScenarioV2MissionNode(persisted, graph, firstObjNode.id, 2, succeedPrimary);
  }
  const digest = buildV1014ScenarioV2CrosswireDigest(scenario, graph, persisted);
  return { id, scenarioId, passed: digest.includes('scenario='), detail: digest };
}

export const V1014_SCENARIO_V2_FIXTURE_RUNS: V1014ScenarioV2FixtureRun[] = (() => {
  const picks = V1014_SCENARIO_V2_CATALOG.filter((_, i) => i % 6 === 0).slice(0, 64);
  return picks.map((s, i) => runV1014ScenarioV2Fixture(`fx${String(i + 1).padStart(2, '0')}`, s.id, i % 3 !== 1));
})();

export function summarizeV1014ScenarioV2Fixtures(): { passed: number; total: number } {
  const passed = V1014_SCENARIO_V2_FIXTURE_RUNS.filter(r => r.passed).length;
  return { passed, total: V1014_SCENARIO_V2_FIXTURE_RUNS.length };
}
