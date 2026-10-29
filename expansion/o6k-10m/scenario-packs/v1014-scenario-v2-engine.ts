import type {
  V1014ScenarioV2Definition,
  V1014ScenarioV2FailForwardRule,
  V1014ScenarioV2MissionEdge,
  V1014ScenarioV2MissionGraph,
  V1014ScenarioV2MissionNode,
  V1014ScenarioV2Persisted,
  V1014ScenarioV2RuntimeNodeState,
  V1014ScenarioV2RunPhase,
} from './v1014-scenario-v2-types';
import { V1014_SCENARIO_V2_SCHEMA_VERSION } from './v1014-scenario-v2-types';

export const V1014_SCENARIO_V2_LIMITS = {
  graphs: 2048,
  nodesPerGraph: 24,
  edgesPerGraph: 48,
  history: 64,
  failForwardPerGraph: 8,
  gateStack: 32,
} as const;

const v1014ScenarioV2Hash = (...parts: Array<string | number | boolean | null>): string => {
  const raw = JSON.stringify(parts);
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
};

export const v1014ScenarioV2ReplaySeed = (scenarioId: string, baseSeed: number): number => {
  const mixed = v1014ScenarioV2Hash(scenarioId, baseSeed, V1014_SCENARIO_V2_SCHEMA_VERSION);
  let n = parseInt(mixed.slice(0, 8), 36) || baseSeed;
  return (n ^ baseSeed) >>> 0;
};

export function createEmptyV1014ScenarioV2Persisted(): V1014ScenarioV2Persisted {
  return {
    schemaVersion: V1014_SCENARIO_V2_SCHEMA_VERSION,
    revision: 0,
    activeScenarioId: null,
    missionGraphId: null,
    nodeStates: {},
    completedGateIds: [],
    replaySeed: 0,
    inputHash: '',
    history: [],
  };
}

export function validateV1014ScenarioV2MissionGraph(graph: V1014ScenarioV2MissionGraph): string[] {
  const issues: string[] = [];
  const nodeIds = new Set(graph.nodes.map(n => n.id));
  if (!nodeIds.has(graph.entryNodeId)) issues.push('missing_entry');
  for (const e of graph.edges) {
    if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) issues.push(`edge_orphan:${e.from}->${e.to}`);
  }
  for (const n of graph.nodes) {
    if (n.kind === 'objective' && !n.objectiveId) issues.push(`objective_node_missing_ref:${n.id}`);
    if (n.kind === 'gate' && !n.gateId) issues.push(`gate_node_missing_ref:${n.id}`);
  }
  return issues;
}

export function buildV1014ScenarioV2InputHash(
  scenario: V1014ScenarioV2Definition,
  graph: V1014ScenarioV2MissionGraph,
  turn: number,
): string {
  return v1014ScenarioV2Hash(
    scenario.id,
    scenario.replaySafeSeed,
    graph.id,
    graph.entryNodeId,
    turn,
    scenario.objectives.map(o => [o.id, o.targetType, o.targetValue]),
  );
}

export function initializeV1014ScenarioV2Run(
  scenario: V1014ScenarioV2Definition,
  graph: V1014ScenarioV2MissionGraph,
  turn: number,
): V1014ScenarioV2Persisted {
  const replaySeed = v1014ScenarioV2ReplaySeed(scenario.id, scenario.replaySafeSeed);
  const entry: V1014ScenarioV2RuntimeNodeState = {
    nodeId: graph.entryNodeId,
    phase: 'active',
    enteredTurn: turn,
    completedTurn: null,
    failForwardApplied: false,
  };
  return {
    schemaVersion: V1014_SCENARIO_V2_SCHEMA_VERSION,
    revision: 1,
    activeScenarioId: scenario.id,
    missionGraphId: graph.id,
    nodeStates: { [graph.entryNodeId]: entry },
    completedGateIds: [],
    replaySeed,
    inputHash: buildV1014ScenarioV2InputHash(scenario, graph, turn),
    history: [{ turn, note: 'run_started', nodeId: graph.entryNodeId }],
  };
}

export function lookupV1014ScenarioV2FailForward(
  graph: V1014ScenarioV2MissionGraph,
  nodeId: string,
): V1014ScenarioV2FailForwardRule | null {
  return graph.failForwardRules.find(r => r.triggerNodeId === nodeId) ?? null;
}

export function advanceV1014ScenarioV2MissionNode(
  persisted: V1014ScenarioV2Persisted,
  graph: V1014ScenarioV2MissionGraph,
  completedNodeId: string,
  turn: number,
  objectiveMet: boolean,
): V1014ScenarioV2Persisted {
  const next = { ...persisted, nodeStates: { ...persisted.nodeStates }, history: [...persisted.history] };
  const cur = next.nodeStates[completedNodeId];
  if (!cur) return next;
  next.nodeStates[completedNodeId] = {
    ...cur,
    phase: objectiveMet ? 'completed' : 'failed_forward',
    completedTurn: turn,
  };
  if (!objectiveMet) {
    const ff = lookupV1014ScenarioV2FailForward(graph, completedNodeId);
    if (ff) {
      next.nodeStates[ff.fallbackNodeId] = {
        nodeId: ff.fallbackNodeId,
        phase: 'active',
        enteredTurn: turn,
        completedTurn: null,
        failForwardApplied: true,
      };
      next.history.push({ turn, note: `fail_forward:${ff.id}`, nodeId: ff.fallbackNodeId });
    }
    return next;
  }
  const outs = graph.edges.filter(e => e.from === completedNodeId).sort((a, b) => b.priority - a.priority);
  const chosen = outs[0];
  if (chosen) {
    next.nodeStates[chosen.to] = {
      nodeId: chosen.to,
      phase: 'active',
      enteredTurn: turn,
      completedTurn: null,
      failForwardApplied: false,
    };
    next.history.push({ turn, note: `edge:${chosen.condition}`, nodeId: chosen.to });
  }
  next.revision += 1;
  return next;
}

export function listActiveV1014ScenarioV2Nodes(
  persisted: V1014ScenarioV2Persisted,
): V1014ScenarioV2RuntimeNodeState[] {
  return Object.values(persisted.nodeStates).filter(s => s.phase === 'active' || s.phase === 'branching');
}

export function summarizeV1014ScenarioV2Run(persisted: V1014ScenarioV2Persisted): string {
  const active = listActiveV1014ScenarioV2Nodes(persisted).map(n => n.nodeId).join(',');
  return `scenario=${persisted.activeScenarioId ?? 'none'} active=[${active}] gates=${persisted.completedGateIds.length}`;
}

export function buildV1014ScenarioV2MissionGraphForDefinition(
  scenario: V1014ScenarioV2Definition,
): V1014ScenarioV2MissionGraph {
  const graphId = scenario.missionGraphId;
  const entry = `${graphId}_entry`;
  const gateId = scenario.registryGateIds[0] ?? 'V1014_SCENARIO_V2_GATE_UNKNOWN';
  const nodes: V1014ScenarioV2MissionNode[] = [
    { id: entry, kind: 'milestone', label: 'Briefing', summary: 'Deterministic mission entry.', evidence: ['seed_locked'] },
  ];
  const edges: V1014ScenarioV2MissionEdge[] = [];
  let prev = entry;
  scenario.objectives.forEach((obj, idx) => {
    const nid = `${graphId}_n${idx}`;
    nodes.push({
      id: nid, kind: 'objective', label: obj.label, summary: obj.description, objectiveId: obj.id,
      cohesionFocusSource: 'objective', evidence: [obj.isPrimary ? 'primary' : 'optional', obj.targetType],
    });
    edges.push({ from: prev, to: nid, condition: `sequence_${idx}`, priority: 10 - idx, failForward: false });
    prev = nid;
  });
  const gateNode = `${graphId}_gate`;
  nodes.push({ id: gateNode, kind: 'gate', label: 'Registry gate', summary: 'Gated checkpoint', gateId, evidence: ['gate_registry'] });
  edges.push({ from: prev, to: gateNode, condition: 'gate_check', priority: 5, failForward: false });
  const react = `${graphId}_wr`;
  nodes.push({
    id: react, kind: 'reaction_hook', label: 'World reaction', summary: 'SECTION 20I / 20AH cross-wire',
    requiredWorldReactionKinds: ['objective_completed', 'region_reinforced'],
    strategicPolicyIds: ['fiscal_discipline'], evidence: ['20I', '20AH'],
  });
  edges.push({ from: gateNode, to: react, condition: 'world_reaction', priority: 3, failForward: true });
  const recovery = `${graphId}_recovery`;
  nodes.push({ id: recovery, kind: 'fail_forward', label: 'Recovery', summary: 'Fail-forward lane', onFailForwardTo: gateNode, evidence: ['fail_forward'] });
  const primary = scenario.objectives.find(o => o.isPrimary) ?? scenario.objectives[0];
  const failForwardRules: V1014ScenarioV2FailForwardRule[] = primary ? [{
    id: `${graphId}_ff_0`, triggerNodeId: `${graphId}_n0`, fallbackNodeId: recovery,
    reason: 'Primary objective delayed — softened target via fail-forward.', preservePrimaryObjective: true,
    adjustTargetType: primary.targetType, adjustTargetDelta: -Math.round(primary.targetValue * 0.12),
  }] : [];
  return { id: graphId, scenarioId: scenario.id, entryNodeId: entry, nodes, edges, failForwardRules };
}

export function buildV1014ScenarioV2MissionGraphIndex(
  catalog: V1014ScenarioV2Definition[],
): Record<string, V1014ScenarioV2MissionGraph> {
  return Object.fromEntries(catalog.map(s => [s.missionGraphId, buildV1014ScenarioV2MissionGraphForDefinition(s)]));
}

export function v1014ScenarioV2GraphMetric1(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 2;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric2(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 3;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric3(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 4;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric4(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 5;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric5(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 6;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric6(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 7;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric7(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 1;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric8(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 2;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric9(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 3;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric10(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 4;
  return nodeWeight + edgeWeight + ffWeight;
}

export function v1014ScenarioV2GraphMetric11(graph: V1014ScenarioV2MissionGraph): number {
  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);
  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);
  const ffWeight = graph.failForwardRules.length * 5;
  return nodeWeight + edgeWeight + ffWeight;
}
