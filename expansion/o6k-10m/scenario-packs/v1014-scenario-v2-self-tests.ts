import {
  V1014_SCENARIO_V2_CATALOG,
  V1014_SCENARIO_V2_CATALOG_BY_ID,
  V1014_SCENARIO_V2_MISSION_GRAPHS,
  V1014_SCENARIO_V2_GRAPH_BY_ID,
} from './v1014-scenario-v2-catalog-aggregate';
import { V1014_SCENARIO_V2_GATE_REGISTRY, isV1014ScenarioV2GateOpen } from './v1014-scenario-v2-gates';
import {
  validateV1014ScenarioV2MissionGraph,
  v1014ScenarioV2ReplaySeed,
  v1014ScenarioV2GraphMetric1,
} from './v1014-scenario-v2-engine';
import { migrateV1014ScenarioV2Persisted, parseV1014ScenarioV2Persisted } from './v1014-scenario-v2-persistence';
import { V1014_SCENARIO_V2_FIXTURE_RUNS, summarizeV1014ScenarioV2Fixtures } from './v1014-scenario-v2-fixtures';
import type { V1014ScenarioV2SelfTestResult } from './v1014-scenario-v2-types';

export function runV1014ScenarioV2SelfTests(): V1014ScenarioV2SelfTestResult[] {
  const out: V1014ScenarioV2SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail: string) =>
    out.push({ id, name, passed, detail });

  push('sv2_catalog_min', 'At least 100 gated scenario definitions', V1014_SCENARIO_V2_CATALOG.length >= 100, String(V1014_SCENARIO_V2_CATALOG.length));
  push('sv2_graph_parity', 'Each scenario references a mission graph', V1014_SCENARIO_V2_CATALOG.every(s => V1014_SCENARIO_V2_GRAPH_BY_ID[s.missionGraphId]), 'missing');
  push('sv2_gate_registry', 'Gate registry has 100+ ids', V1014_SCENARIO_V2_GATE_REGISTRY.length >= 100, String(V1014_SCENARIO_V2_GATE_REGISTRY.length));
  push('sv2_graph_validate', 'All mission graphs validate', V1014_SCENARIO_V2_MISSION_GRAPHS.every(g => validateV1014ScenarioV2MissionGraph(g).length === 0), 'issues');
  push('sv2_replay_stable', 'Replay seed stable for sample', (() => {
    const s = V1014_SCENARIO_V2_CATALOG[0];
    const a = v1014ScenarioV2ReplaySeed(s.id, s.replaySafeSeed);
    const b = v1014ScenarioV2ReplaySeed(s.id, s.replaySafeSeed);
    return a === b;
  })(), 'ok');
  push('sv2_gate_open', 'Starter gate opens with minimum missions', isV1014ScenarioV2GateOpen(V1014_SCENARIO_V2_GATE_REGISTRY[0].id, [], V1014_SCENARIO_V2_GATE_REGISTRY[0].minCompletedMissions), 'closed');
  push('sv2_migration', 'Legacy migration path', migrateV1014ScenarioV2Persisted({ schemaVersion: 'v94_scenario_missions', revision: 0 }).ok, 'fail');
  push('sv2_parse', 'Parse round-trip', parseV1014ScenarioV2Persisted('{"schemaVersion":"10.14.0-scenario-v2","revision":0,"activeScenarioId":null,"missionGraphId":null,"nodeStates":{},"completedGateIds":[],"replaySeed":0,"inputHash":"","history":[]}').ok, 'fail');
  push('sv2_fixture_runs', 'At least 50 fixture runs', V1014_SCENARIO_V2_FIXTURE_RUNS.length >= 50, String(V1014_SCENARIO_V2_FIXTURE_RUNS.length));
  const fx = summarizeV1014ScenarioV2Fixtures();
  push('sv2_fixture_pass_rate', 'Fixture pass rate healthy', fx.passed >= Math.min(40, fx.total - 1), `${fx.passed}/${fx.total}`);
  push('sv2_metric', 'Graph metric helper', v1014ScenarioV2GraphMetric1(V1014_SCENARIO_V2_MISSION_GRAPHS[0]) > 0, 'zero');
  push('sv2_unique_ids', 'Scenario ids unique', Object.keys(V1014_SCENARIO_V2_CATALOG_BY_ID).length === V1014_SCENARIO_V2_CATALOG.length, 'dup');
  return out;
}
