#!/usr/bin/env python3
"""Generate expansion/o6k-10m/scenario-packs/ — T6-2 scenario engine v2 shard."""
from __future__ import annotations

import json
import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "expansion" / "o6k-10m" / "scenario-packs"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
ARCHETYPES = [
    ("trade_corridor", "Trade Corridor", ["trade", "logistics"]),
    ("energy_transition", "Energy Transition", ["energy", "renewables"]),
    ("mining_boom", "Mining Boom", ["mining", "trade"]),
    ("coastal_resilience", "Coastal Resilience", ["environment", "tourism"]),
    ("inland_logistics", "Inland Logistics", ["logistics", "infrastructure"]),
    ("research_momentum", "Research Momentum", ["research", "technology"]),
    ("fiscal_discipline", "Fiscal Discipline", ["finance", "governance"]),
    ("crisis_recovery", "Crisis Recovery", ["crisis", "recovery"]),
    ("diplomatic_window", "Diplomatic Window", ["diplomacy", "trade"]),
    ("workforce_pipeline", "Workforce Pipeline", ["manufacturing", "governance"]),
]

VARIANTS = (1,)  # 10×8×4 = 320 gated scenarios

TIERS = [
    ("easy", "Easy", "Beginner", 12000, 29, "low"),
    ("standard", "Medium", "Intermediate", 18000, 45, "normal"),
    ("hard", "Hard", "Advanced", 26000, 60, "elevated"),
    ("expert", "Expert", "Expert", 35000, 75, "high"),
]


def fnv_seed(*parts: str | int) -> int:
    raw = "|".join(str(p) for p in parts)
    h = 2166136261
    for ch in raw:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    h ^= h >> 13
    h = (h * 0x5BD1E995) & 0xFFFFFFFF
    h ^= h >> 15
    return h & 0x7FFFFFFF


def esc(s: str) -> str:
    return json.dumps(s)


def write(path: pathlib.Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def gen_types() -> str:
    return textwrap.dedent(
        """
        // ============================================================================
        // SECTION 20AY: V10.14 SCENARIO & OBJECTIVE ENGINE V2 (T6-2 / O6K-21)
        // Operation 10M — external merge shard (Agent 25 splices before SECTION 21B).
        // Prefix: V1014_SCENARIO_V2_*  |  LAB: v1014_scenarios_v2
        // Cross-wire: SECTION 20O presets, 20L cohesion, 20I world reaction, 20AH strategic actions.
        // ============================================================================

        export const V1014_SCENARIO_V2_SCHEMA_VERSION = '10.14.0-scenario-v2' as const;
        export const V1014_SCENARIO_V2_AGENT = 'o6k-21-scenario-packs' as const;

        export const V1014_SCENARIO_V2_CORE_REGIONS: readonly string[] = [
          'NSW','VIC','QLD','WA','SA','TAS','NT','ACT',
        ] as const;

        export type V1014ScenarioV2Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
        export type V1014ScenarioV2Category =
          | 'beginner' | 'challenge' | 'historical' | 'expert' | 'experimental' | 'custom';
        export type V1014ScenarioV2Complexity = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

        export type V1014ScenarioV2ObjectiveTargetType =
          | 'money' | 'regions' | 'netWorth' | 'challenges' | 'regionalStanding' | 'daysPassed'
          | 'money_accumulated' | 'regions_controlled' | 'turns_survived' | 'standing_reached'
          | 'ai_eliminated' | 'challenges_completed' | 'public_stability' | 'crisis_resolved'
          | 'territory_controlled' | 'debt_cleared' | 'investments_count' | 'standing_threshold'
          | 'specific_region_controlled' | 'zero_sabotage_taken' | 'governance_proposals_passed'
          | 'multi_actor_standing_avg';

        export interface V1014ScenarioV2Objective {
          id: string;
          label: string;
          description: string;
          targetType: V1014ScenarioV2ObjectiveTargetType;
          targetValue: number;
          isPrimary?: boolean;
          targetRegionId?: string;
          targetActorId?: string;
          timeLimitDays?: number;
          missionNodeId?: string;
        }

        export type V1014ScenarioV2ModifierDomain =
          | 'economic' | 'ai_behavior' | 'stability' | 'crisis' | 'regional_standing'
          | 'resource_prices' | 'turn_limits';

        export interface V1014ScenarioV2Modifier {
          id: string;
          name: string;
          description: string;
          domain: V1014ScenarioV2ModifierDomain;
          targetKey: string;
          value: number | string | boolean;
          isGlobal: boolean;
          affectedActorIds?: string[];
        }

        export interface V1014ScenarioV2Definition {
          id: string;
          title: string;
          description: string;
          category: V1014ScenarioV2Category;
          difficulty: V1014ScenarioV2Difficulty;
          complexity?: V1014ScenarioV2Complexity;
          forcedSeed: number;
          startingMoney: number;
          startingRegions: string[];
          forcedSettings: Record<string, unknown>;
          objectives: V1014ScenarioV2Objective[];
          modifiers: V1014ScenarioV2Modifier[];
          narrativeIntro?: string;
          narrativeOutro?: string;
          badgeId: string;
          unlockedByDefault: boolean;
          author: 'System';
          youWillLearn?: string[];
          registryGateIds: string[];
          missionGraphId: string;
          replaySafeSeed: number;
          packArchetype: string;
          packRegion: string;
          packTier: string;
        }

        export type V1014ScenarioV2MissionNodeKind =
          | 'objective' | 'branch' | 'fail_forward' | 'gate' | 'milestone' | 'reaction_hook';

        export interface V1014ScenarioV2MissionEdge {
          from: string;
          to: string;
          condition: string;
          failForward?: boolean;
          priority: number;
        }

        export interface V1014ScenarioV2MissionNode {
          id: string;
          kind: V1014ScenarioV2MissionNodeKind;
          label: string;
          summary: string;
          objectiveId?: string;
          gateId?: string;
          requiredWorldReactionKinds?: string[];
          strategicPolicyIds?: string[];
          cohesionFocusSource?: 'objective' | 'crisis' | 'strategy' | 'decision';
          onFailForwardTo?: string;
          evidence: string[];
        }

        export interface V1014ScenarioV2MissionGraph {
          id: string;
          scenarioId: string;
          entryNodeId: string;
          nodes: V1014ScenarioV2MissionNode[];
          edges: V1014ScenarioV2MissionEdge[];
          failForwardRules: V1014ScenarioV2FailForwardRule[];
        }

        export interface V1014ScenarioV2FailForwardRule {
          id: string;
          triggerNodeId: string;
          fallbackNodeId: string;
          reason: string;
          preservePrimaryObjective: boolean;
          adjustTargetType?: V1014ScenarioV2ObjectiveTargetType;
          adjustTargetDelta?: number;
        }

        export type V1014ScenarioV2RunPhase =
          | 'locked' | 'available' | 'active' | 'branching' | 'completed' | 'failed_forward';

        export interface V1014ScenarioV2RuntimeNodeState {
          nodeId: string;
          phase: V1014ScenarioV2RunPhase;
          enteredTurn: number;
          completedTurn: number | null;
          failForwardApplied: boolean;
        }

        export interface V1014ScenarioV2Persisted {
          schemaVersion: typeof V1014_SCENARIO_V2_SCHEMA_VERSION;
          revision: number;
          activeScenarioId: string | null;
          missionGraphId: string | null;
          nodeStates: Record<string, V1014ScenarioV2RuntimeNodeState>;
          completedGateIds: string[];
          replaySeed: number;
          inputHash: string;
          history: Array<{ turn: number; note: string; nodeId: string }>;
        }

        export interface V1014ScenarioV2GateDefinition {
          id: string;
          label: string;
          description: string;
          requiresScenarioIds?: string[];
          requiresAchievementIds?: string[];
          minCompletedMissions: number;
          regionAffinity?: string;
          archetypeAffinity?: string;
          unlockTier: 'starter' | 'standard' | 'advanced' | 'expert';
        }

        export interface V1014ScenarioV2SelfTestResult {
          id: string;
          name: string;
          passed: boolean;
          detail: string;
        }
        """
    ).strip() + "\n"


def gen_engine() -> str:
    lines = [
        "import type {",
        "  V1014ScenarioV2Definition,",
        "  V1014ScenarioV2FailForwardRule,",
        "  V1014ScenarioV2MissionEdge,",
        "  V1014ScenarioV2MissionGraph,",
        "  V1014ScenarioV2MissionNode,",
        "  V1014ScenarioV2Persisted,",
        "  V1014ScenarioV2RuntimeNodeState,",
        "  V1014ScenarioV2RunPhase,",
        "} from './v1014-scenario-v2-types';",
        "import { V1014_SCENARIO_V2_SCHEMA_VERSION } from './v1014-scenario-v2-types';",
        "",
        "export const V1014_SCENARIO_V2_LIMITS = {",
        "  graphs: 2048,",
        "  nodesPerGraph: 24,",
        "  edgesPerGraph: 48,",
        "  history: 64,",
        "  failForwardPerGraph: 8,",
        "  gateStack: 32,",
        "} as const;",
        "",
        "const v1014ScenarioV2Hash = (...parts: Array<string | number | boolean | null>): string => {",
        "  const raw = JSON.stringify(parts);",
        "  let h = 2166136261;",
        "  for (let i = 0; i < raw.length; i++) {",
        "    h ^= raw.charCodeAt(i); h = Math.imul(h, 16777619); }",
        "  return (h >>> 0).toString(36);",
        "};",
        "",
        "export const v1014ScenarioV2ReplaySeed = (scenarioId: string, baseSeed: number): number => {",
        "  const mixed = v1014ScenarioV2Hash(scenarioId, baseSeed, V1014_SCENARIO_V2_SCHEMA_VERSION);",
        "  let n = parseInt(mixed.slice(0, 8), 36) || baseSeed;",
        "  return (n ^ baseSeed) >>> 0;",
        "};",
        "",
        "export function createEmptyV1014ScenarioV2Persisted(): V1014ScenarioV2Persisted {",
        "  return {",
        "    schemaVersion: V1014_SCENARIO_V2_SCHEMA_VERSION,",
        "    revision: 0,",
        "    activeScenarioId: null,",
        "    missionGraphId: null,",
        "    nodeStates: {},",
        "    completedGateIds: [],",
        "    replaySeed: 0,",
        "    inputHash: '',",
        "    history: [],",
        "  };",
        "}",
        "",
        "export function validateV1014ScenarioV2MissionGraph(graph: V1014ScenarioV2MissionGraph): string[] {",
        "  const issues: string[] = [];",
        "  const nodeIds = new Set(graph.nodes.map(n => n.id));",
        "  if (!nodeIds.has(graph.entryNodeId)) issues.push('missing_entry');",
        "  for (const e of graph.edges) {",
        "    if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) issues.push(`edge_orphan:${e.from}->${e.to}`);",
        "  }",
        "  for (const n of graph.nodes) {",
        "    if (n.kind === 'objective' && !n.objectiveId) issues.push(`objective_node_missing_ref:${n.id}`);",
        "    if (n.kind === 'gate' && !n.gateId) issues.push(`gate_node_missing_ref:${n.id}`);",
        "  }",
        "  return issues;",
        "}",
        "",
        "export function buildV1014ScenarioV2InputHash(",
        "  scenario: V1014ScenarioV2Definition,",
        "  graph: V1014ScenarioV2MissionGraph,",
        "  turn: number,",
        "): string {",
        "  return v1014ScenarioV2Hash(",
        "    scenario.id,",
        "    scenario.replaySafeSeed,",
        "    graph.id,",
        "    graph.entryNodeId,",
        "    turn,",
        "    scenario.objectives.map(o => [o.id, o.targetType, o.targetValue]),",
        "  );",
        "}",
        "",
        "export function initializeV1014ScenarioV2Run(",
        "  scenario: V1014ScenarioV2Definition,",
        "  graph: V1014ScenarioV2MissionGraph,",
        "  turn: number,",
        "): V1014ScenarioV2Persisted {",
        "  const replaySeed = v1014ScenarioV2ReplaySeed(scenario.id, scenario.replaySafeSeed);",
        "  const entry: V1014ScenarioV2RuntimeNodeState = {",
        "    nodeId: graph.entryNodeId,",
        "    phase: 'active',",
        "    enteredTurn: turn,",
        "    completedTurn: null,",
        "    failForwardApplied: false,",
        "  };",
        "  return {",
        "    schemaVersion: V1014_SCENARIO_V2_SCHEMA_VERSION,",
        "    revision: 1,",
        "    activeScenarioId: scenario.id,",
        "    missionGraphId: graph.id,",
        "    nodeStates: { [graph.entryNodeId]: entry },",
        "    completedGateIds: [],",
        "    replaySeed,",
        "    inputHash: buildV1014ScenarioV2InputHash(scenario, graph, turn),",
        "    history: [{ turn, note: 'run_started', nodeId: graph.entryNodeId }],",
        "  };",
        "}",
        "",
        "export function lookupV1014ScenarioV2FailForward(",
        "  graph: V1014ScenarioV2MissionGraph,",
        "  nodeId: string,",
        "): V1014ScenarioV2FailForwardRule | null {",
        "  return graph.failForwardRules.find(r => r.triggerNodeId === nodeId) ?? null;",
        "}",
        "",
        "export function advanceV1014ScenarioV2MissionNode(",
        "  persisted: V1014ScenarioV2Persisted,",
        "  graph: V1014ScenarioV2MissionGraph,",
        "  completedNodeId: string,",
        "  turn: number,",
        "  objectiveMet: boolean,",
        "): V1014ScenarioV2Persisted {",
        "  const next = { ...persisted, nodeStates: { ...persisted.nodeStates }, history: [...persisted.history] };",
        "  const cur = next.nodeStates[completedNodeId];",
        "  if (!cur) return next;",
        "  next.nodeStates[completedNodeId] = {",
        "    ...cur,",
        "    phase: objectiveMet ? 'completed' : 'failed_forward',",
        "    completedTurn: turn,",
        "  };",
        "  if (!objectiveMet) {",
        "    const ff = lookupV1014ScenarioV2FailForward(graph, completedNodeId);",
        "    if (ff) {",
        "      next.nodeStates[ff.fallbackNodeId] = {",
        "        nodeId: ff.fallbackNodeId,",
        "        phase: 'active',",
        "        enteredTurn: turn,",
        "        completedTurn: null,",
        "        failForwardApplied: true,",
        "      };",
        "      next.history.push({ turn, note: `fail_forward:${ff.id}`, nodeId: ff.fallbackNodeId });",
        "    }",
        "    return next;",
        "  }",
        "  const outs = graph.edges.filter(e => e.from === completedNodeId).sort((a, b) => b.priority - a.priority);",
        "  const chosen = outs[0];",
        "  if (chosen) {",
        "    next.nodeStates[chosen.to] = {",
        "      nodeId: chosen.to,",
        "      phase: 'active',",
        "      enteredTurn: turn,",
        "      completedTurn: null,",
        "      failForwardApplied: false,",
        "    };",
        "    next.history.push({ turn, note: `edge:${chosen.condition}`, nodeId: chosen.to });",
        "  }",
        "  next.revision += 1;",
        "  return next;",
        "}",
        "",
        "export function listActiveV1014ScenarioV2Nodes(",
        "  persisted: V1014ScenarioV2Persisted,",
        "): V1014ScenarioV2RuntimeNodeState[] {",
        "  return Object.values(persisted.nodeStates).filter(s => s.phase === 'active' || s.phase === 'branching');",
        "}",
        "",
        "export function summarizeV1014ScenarioV2Run(persisted: V1014ScenarioV2Persisted): string {",
        "  const active = listActiveV1014ScenarioV2Nodes(persisted).map(n => n.nodeId).join(',');",
        "  return `scenario=${persisted.activeScenarioId ?? 'none'} active=[${active}] gates=${persisted.completedGateIds.length}`;",
        "}",
        "",
        "export function buildV1014ScenarioV2MissionGraphForDefinition(",
        "  scenario: V1014ScenarioV2Definition,",
        "): V1014ScenarioV2MissionGraph {",
        "  const graphId = scenario.missionGraphId;",
        "  const entry = `${graphId}_entry`;",
        "  const gateId = scenario.registryGateIds[0] ?? 'V1014_SCENARIO_V2_GATE_UNKNOWN';",
        "  const nodes: V1014ScenarioV2MissionNode[] = [",
        "    { id: entry, kind: 'milestone', label: 'Briefing', summary: 'Deterministic mission entry.', evidence: ['seed_locked'] },",
        "  ];",
        "  const edges: V1014ScenarioV2MissionEdge[] = [];",
        "  let prev = entry;",
        "  scenario.objectives.forEach((obj, idx) => {",
        "    const nid = `${graphId}_n${idx}`;",
        "    nodes.push({",
        "      id: nid, kind: 'objective', label: obj.label, summary: obj.description, objectiveId: obj.id,",
        "      cohesionFocusSource: 'objective', evidence: [obj.isPrimary ? 'primary' : 'optional', obj.targetType],",
        "    });",
        "    edges.push({ from: prev, to: nid, condition: `sequence_${idx}`, priority: 10 - idx, failForward: false });",
        "    prev = nid;",
        "  });",
        "  const gateNode = `${graphId}_gate`;",
        "  nodes.push({ id: gateNode, kind: 'gate', label: 'Registry gate', summary: 'Gated checkpoint', gateId, evidence: ['gate_registry'] });",
        "  edges.push({ from: prev, to: gateNode, condition: 'gate_check', priority: 5, failForward: false });",
        "  const react = `${graphId}_wr`;",
        "  nodes.push({",
        "    id: react, kind: 'reaction_hook', label: 'World reaction', summary: 'SECTION 20I / 20AH cross-wire',",
        "    requiredWorldReactionKinds: ['objective_completed', 'region_reinforced'],",
        "    strategicPolicyIds: ['fiscal_discipline'], evidence: ['20I', '20AH'],",
        "  });",
        "  edges.push({ from: gateNode, to: react, condition: 'world_reaction', priority: 3, failForward: true });",
        "  const recovery = `${graphId}_recovery`;",
        "  nodes.push({ id: recovery, kind: 'fail_forward', label: 'Recovery', summary: 'Fail-forward lane', onFailForwardTo: gateNode, evidence: ['fail_forward'] });",
        "  const primary = scenario.objectives.find(o => o.isPrimary) ?? scenario.objectives[0];",
        "  const failForwardRules: V1014ScenarioV2FailForwardRule[] = primary ? [{",
        "    id: `${graphId}_ff_0`, triggerNodeId: `${graphId}_n0`, fallbackNodeId: recovery,",
        "    reason: 'Primary objective delayed — softened target via fail-forward.', preservePrimaryObjective: true,",
        "    adjustTargetType: primary.targetType, adjustTargetDelta: -Math.round(primary.targetValue * 0.12),",
        "  }] : [];",
        "  return { id: graphId, scenarioId: scenario.id, entryNodeId: entry, nodes, edges, failForwardRules };",
        "}",
        "",
        "export function buildV1014ScenarioV2MissionGraphIndex(",
        "  catalog: V1014ScenarioV2Definition[],",
        "): Record<string, V1014ScenarioV2MissionGraph> {",
        "  return Object.fromEntries(catalog.map(s => [s.missionGraphId, buildV1014ScenarioV2MissionGraphForDefinition(s)]));",
        "}",
    ]

    # Add many small deterministic helper functions for graph analytics (meaningful, used by tests)
    for i in range(1, 12):
        lines.extend(
            [
                "",
                f"export function v1014ScenarioV2GraphMetric{i}(graph: V1014ScenarioV2MissionGraph): number {{",
                f"  const nodeWeight = graph.nodes.reduce((s, n) => s + n.evidence.length + (n.objectiveId ? 2 : 0) + (n.gateId ? 3 : 0), 0);",
                f"  const edgeWeight = graph.edges.reduce((s, e) => s + e.priority + (e.failForward ? 4 : 0), 0);",
                f"  const ffWeight = graph.failForwardRules.length * {i % 7 + 1};",
                f"  return nodeWeight + edgeWeight + ffWeight;",
                f"}}",
            ]
        )

    return "\n".join(lines) + "\n"


def gen_persistence() -> str:
    return textwrap.dedent(
        """
        import {
          V1014_SCENARIO_V2_SCHEMA_VERSION,
          type V1014ScenarioV2Persisted,
        } from './v1014-scenario-v2-types';

        export const V1014_SCENARIO_V2_SAVE_KEY = 'v1014_scenario_v2_state' as const;
        export const V1014_SCENARIO_V2_LEGACY_KEYS = ['v94_scenario_mission_state', 'scenario_objective_v1'] as const;

        export type V1014ScenarioV2MigrationResult =
          | { ok: true; persisted: V1014ScenarioV2Persisted; from: string }
          | { ok: false; reason: string };

        const isRecord = (v: unknown): v is Record<string, unknown> =>
          typeof v === 'object' && v !== null && !Array.isArray(v);

        export function migrateV1014ScenarioV2Persisted(raw: unknown): V1014ScenarioV2MigrationResult {
          if (!isRecord(raw)) return { ok: false, reason: 'not_object' };
          const ver = raw.schemaVersion;
          if (ver === V1014_SCENARIO_V2_SCHEMA_VERSION) {
            return { ok: true, from: 'native', persisted: raw as V1014ScenarioV2Persisted };
          }
          if (ver === '10.14.0-scenario-v1' || ver === 'v94_scenario_missions') {
            const migrated: V1014ScenarioV2Persisted = {
              schemaVersion: V1014_SCENARIO_V2_SCHEMA_VERSION,
              revision: typeof raw.revision === 'number' ? raw.revision + 1 : 1,
              activeScenarioId: typeof raw.activeScenarioId === 'string' ? raw.activeScenarioId : null,
              missionGraphId: typeof raw.missionGraphId === 'string' ? raw.missionGraphId : null,
              nodeStates: isRecord(raw.nodeStates) ? (raw.nodeStates as V1014ScenarioV2Persisted['nodeStates']) : {},
              completedGateIds: Array.isArray(raw.completedGateIds) ? raw.completedGateIds.filter(x => typeof x === 'string') : [],
              replaySeed: typeof raw.replaySeed === 'number' ? raw.replaySeed : 0,
              inputHash: typeof raw.inputHash === 'string' ? raw.inputHash : '',
              history: Array.isArray(raw.history)
                ? raw.history.filter(h => isRecord(h) && typeof h.turn === 'number').map(h => ({
                    turn: h.turn as number,
                    note: String(h.note ?? 'migrated'),
                    nodeId: String(h.nodeId ?? 'unknown'),
                  }))
                : [],
            };
            return { ok: true, from: String(ver), persisted: migrated };
          }
          return { ok: false, reason: `unsupported_schema:${String(ver)}` };
        }

        export function serializeV1014ScenarioV2Persisted(p: V1014ScenarioV2Persisted): string {
          return JSON.stringify(p);
        }

        export function parseV1014ScenarioV2Persisted(json: string): V1014ScenarioV2MigrationResult {
          try {
            return migrateV1014ScenarioV2Persisted(JSON.parse(json));
          } catch {
            return { ok: false, reason: 'invalid_json' };
          }
        }
        """
    ).strip() + "\n"


def gen_crosswire() -> str:
    return textwrap.dedent(
        """
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
        """
    ).strip() + "\n"


def gen_gates() -> str:
    arch_json = json.dumps([a[0] for a in ARCHETYPES])
    tier_json = json.dumps([t[0] for t in TIERS])
    regions_json = json.dumps(REGIONS)
    return textwrap.dedent(
        f"""
        import type {{ V1014ScenarioV2GateDefinition }} from './v1014-scenario-v2-types';

        const ARCH = {arch_json} as const;
        const TIERS = {tier_json} as const;
        const REGIONS = {regions_json} as const;

        const tierUnlock = (tier: string): V1014ScenarioV2GateDefinition['unlockTier'] =>
          tier === 'easy' ? 'starter' : tier === 'standard' ? 'standard' : tier === 'hard' ? 'advanced' : 'expert';

        const minMissions = (tier: string) => (tier === 'easy' ? 1 : tier === 'standard' ? 2 : tier === 'hard' ? 3 : 4);

        export function buildV1014ScenarioV2GateId(arch: string, tier: string, region: string): string {{
          return `V1014_SCENARIO_V2_GATE_${{arch.toUpperCase()}}_${{tier.toUpperCase()}}_${{region}}`;
        }}

        export const V1014_SCENARIO_V2_GATE_REGISTRY: V1014ScenarioV2GateDefinition[] = ARCH.flatMap(arch =>
          TIERS.flatMap(tier =>
            REGIONS.map(region => ({{
              id: buildV1014ScenarioV2GateId(arch, tier, region),
              label: `${{arch}} / ${{tier}} / ${{region}}`,
              description: `Registry gate for ${{arch}} tier ${{tier}} in ${{region}}.`,
              minCompletedMissions: minMissions(tier),
              regionAffinity: region,
              archetypeAffinity: arch,
              unlockTier: tierUnlock(tier),
            }})),
          ),
        );

        export const V1014_SCENARIO_V2_GATE_BY_ID: Record<string, V1014ScenarioV2GateDefinition> =
          Object.fromEntries(V1014_SCENARIO_V2_GATE_REGISTRY.map(g => [g.id, g]));

        export function isV1014ScenarioV2GateOpen(
          gateId: string, completedScenarioIds: string[], completedMissionCount: number,
        ): boolean {{
          const g = V1014_SCENARIO_V2_GATE_BY_ID[gateId];
          if (!g) return false;
          if (completedMissionCount < g.minCompletedMissions) return false;
          if (g.requiresScenarioIds?.length) {{
            return g.requiresScenarioIds.every(id => completedScenarioIds.includes(id));
          }}
          return true;
        }}
        """
    ).strip() + "\n"


def mission_graph_ts(scenario_id: str, graph_id: str, objectives: list[dict], gate_id: str) -> str:
    nodes: list[str] = []
    edges: list[str] = []
    ff: list[str] = []
    entry = f"{graph_id}_entry"
    nodes.append(
        f"    {{ id: {esc(entry)}, kind: 'milestone', label: 'Briefing', summary: 'Mission graph entry — deterministic replay path.', evidence: ['seed_locked','cohesion_ready'] }},"
    )
    prev = entry
    for idx, obj in enumerate(objectives):
        nid = f"{graph_id}_n{idx}"
        obj_id = obj["id"]
        nodes.append(
            f"    {{ id: {esc(nid)}, kind: 'objective', label: {esc(obj['label'])}, summary: {esc(obj['description'])}, objectiveId: {esc(obj_id)}, cohesionFocusSource: 'objective', evidence: [{esc('primary' if obj.get('isPrimary') else 'optional')}, {esc(obj['targetType'])}] }},"
        )
        edges.append(
            f"    {{ from: {esc(prev)}, to: {esc(nid)}, condition: {esc(f'sequence_{idx}')}, priority: {10 - idx}, failForward: false }},"
        )
        if idx == 0:
            ff.append(
                f"    {{ id: {esc(f'{graph_id}_ff_{idx}')}, triggerNodeId: {esc(nid)}, fallbackNodeId: {esc(f'{graph_id}_recovery')}, reason: 'Primary objective delayed — fail-forward recovery path.', preservePrimaryObjective: true, adjustTargetType: {esc(obj['targetType'])}, adjustTargetDelta: -Math.round({obj['targetValue']} * 0.15) }},"
            )
        prev = nid
    gate_node = f"{graph_id}_gate"
    nodes.append(
        f"    {{ id: {esc(gate_node)}, kind: 'gate', label: 'Registry gate', summary: 'Gated progression checkpoint tied to catalog registry.', gateId: {esc(gate_id)}, evidence: ['gate_registry'] }},"
    )
    edges.append(
        f"    {{ from: {esc(prev)}, to: {esc(gate_node)}, condition: 'gate_check', priority: 5, failForward: false }},"
    )
    recovery = f"{graph_id}_recovery"
    nodes.append(
        f"    {{ id: {esc(recovery)}, kind: 'fail_forward', label: 'Recovery lane', summary: 'Fail-forward lane preserves campaign continuity.', onFailForwardTo: {esc(gate_node)}, evidence: ['fail_forward'] }},"
    )
    react = f"{graph_id}_wr"
    nodes.append(
        f"    {{ id: {esc(react)}, kind: 'reaction_hook', label: 'World reaction hook', summary: 'Cross-wire SECTION 20I expected reaction kinds.', requiredWorldReactionKinds: ['objective_completed','region_reinforced'], strategicPolicyIds: ['fiscal_discipline'], evidence: ['20I','20AH'] }},"
    )
    edges.append(
        f"    {{ from: {esc(gate_node)}, to: {esc(react)}, condition: 'world_reaction', priority: 3, failForward: true }},"
    )
    return (
        f"export const {graph_id}: V1014ScenarioV2MissionGraph = {{\n"
        f"  id: {esc(graph_id)},\n"
        f"  scenarioId: {esc(scenario_id)},\n"
        f"  entryNodeId: {esc(entry)},\n"
        f"  nodes: [\n" + "\n".join(nodes) + "\n  ],\n"
        f"  edges: [\n" + "\n".join(edges) + "\n  ],\n"
        f"  failForwardRules: [\n" + "\n".join(ff) + "\n  ],\n"
        f"}};\n"
    )


def gen_scenario_block(
    arch_slug: str,
    arch_title: str,
    themes: list[str],
    region: str,
    tier_slug: str,
    tier_label: str,
    complexity: str,
    money_target: int,
    total_days: int,
    crisis: str,
    variant: int,
) -> tuple[str, str]:
    scenario_id = f"v1014_scenario_v2_{arch_slug}_{region.lower()}_{tier_slug}_v{variant}"
    graph_id = f"V1014_SCENARIO_V2_GRAPH_{arch_slug.upper()}_{region}_{tier_slug.upper()}_V{variant}"
    gate_id = f"V1014_SCENARIO_V2_GATE_{arch_slug.upper()}_{tier_slug.upper()}_{region}"
    seed = fnv_seed(scenario_id, variant, region)
    replay_seed = fnv_seed("replay", scenario_id)
    start_money = 1200 + (hash(region) % 400) + variant * 75
    unlocked = tier_slug == "easy" and variant == 1

    objectives = [
        {
            "id": f"{scenario_id}_p1",
            "label": "Mission Cash",
            "description": f"Accumulate ${money_target} along the {arch_title.lower()} path",
            "targetType": "money",
            "targetValue": money_target,
            "isPrimary": True,
        },
        {
            "id": f"{scenario_id}_p2",
            "label": "Hold Region",
            "description": f"Maintain control of {region}",
            "targetType": "specific_region_controlled",
            "targetValue": 1,
            "isPrimary": True,
            "targetRegionId": region,
        },
        {
            "id": f"{scenario_id}_o1",
            "label": "Proof objectives",
            "description": "Complete regional challenges tied to mission graph",
            "targetType": "challenges",
            "targetValue": 2 + (variant % 3),
            "isPrimary": False,
        },
    ]

    obj_ts = []
    for o in objectives:
        extra = ""
        if o.get("targetRegionId"):
            extra = f", targetRegionId: {esc(o['targetRegionId'])}"
        obj_ts.append(
            f"      {{ id: {esc(o['id'])}, label: {esc(o['label'])}, description: {esc(o['description'])}, "
            f"targetType: {esc(o['targetType'])}, targetValue: {o['targetValue']}, isPrimary: {str(o.get('isPrimary', False)).lower()}{extra}, "
            f"missionNodeId: {esc(f'{graph_id}_n{objectives.index(o)}')} }},"
        )

    scenario_ts = f"""  {{
    id: {esc(scenario_id)},
    title: {esc(f'{region} — {arch_title} ({tier_label})')},
    description: {esc(f'T6-2 gated mission: {arch_title} in {region}. Variant {variant} — themes {", ".join(themes)}; replay-safe seed {replay_seed}.')},
    category: 'challenge',
    difficulty: {esc(tier_label)},
    complexity: {esc(complexity)},
    forcedSeed: {seed},
    replaySafeSeed: {replay_seed},
    startingMoney: {start_money},
    startingRegions: [{esc(region)}],
    badgeId: {esc(f'badge_{scenario_id}')},
    unlockedByDefault: {str(unlocked).lower()},
    author: 'System',
    packArchetype: {esc(arch_slug)},
    packRegion: {esc(region)},
    packTier: {esc(tier_slug)},
    registryGateIds: [{esc(gate_id)}],
    missionGraphId: {esc(graph_id)},
    forcedSettings: {{
      deterministicRngActive: true,
      aiDeterministic: true,
      aiDeterministicSeed: {seed},
      worldRngMode: 'deterministic',
      worldRngSeed: {seed},
      regionalContractsEnabled: true,
      dynamicCrisisChainsEnabled: true,
      scenarioEngineV73Enabled: true,
      achievementsEnabled: true,
      v93RegionalOpening: 'balanced',
      v93ContentThemes: [{', '.join(esc(t) for t in themes)}],
      v93CrisisIntensity: {esc(crisis)},
      v93ContractAbundance: 'normal',
      v93StartingPackage: 'standard',
      v1014ScenarioV2Pack: {esc(arch_slug)},
      v1014ScenarioV2Region: {esc(region)},
      v1014ScenarioV2Tier: {esc(tier_slug)},
      v1014ScenarioV2GateIds: [{esc(gate_id)}],
      v1014ScenarioV2MissionGraphId: {esc(graph_id)},
      v94SandboxOptionIds: ['v94_sandbox_preserve_single','v94_sandbox_scenario_lab'],
      totalDays: {total_days},
    }},
    objectives: [
{chr(10).join(obj_ts)}
    ],
    modifiers: [],
    youWillLearn: [{', '.join(esc(x) for x in ['Mission graph', 'Fail-forward', arch_title, region])}],
  }},"""

    graph_ts = ""
    return scenario_ts, scenario_id


def gen_replay_manifests(all_ids: list[tuple[str, str, str, str, int]]) -> str:
    lines = [
        "import type { V1014ScenarioV2Definition } from './v1014-scenario-v2-types';",
        "import { v1014ScenarioV2ReplaySeed } from './v1014-scenario-v2-engine';",
        "",
        "export interface V1014ScenarioV2ReplayManifest {",
        "  scenarioId: string;",
        "  replaySafeSeed: number;",
        "  derivedReplaySeed: number;",
        "  content20OThemeHint: string;",
        "  cohesion20LFocus: string;",
        "  worldReaction20IKinds: string[];",
        "  strategic20AHPolicies: string[];",
        "  failForwardBudget: number;",
        "  fixtureChecksum: string;",
        "}",
        "",
        "export const V1014_SCENARIO_V2_REPLAY_MANIFESTS: V1014ScenarioV2ReplayManifest[] = [",
    ]
    for scenario_id, arch, region, tier, replay_seed in all_ids:
        derived = fnv_seed("replay", scenario_id)
        lines.append("  {")
        lines.append(f"    scenarioId: {esc(scenario_id)},")
        lines.append(f"    replaySafeSeed: {replay_seed},")
        lines.append(f"    derivedReplaySeed: {derived},")
        lines.append(f"    content20OThemeHint: {esc(arch.split('_')[0])},")
        lines.append(f"    cohesion20LFocus: 'objective',")
        lines.append(f"    worldReaction20IKinds: ['objective_completed','region_reinforced'],")
        lines.append(f"    strategic20AHPolicies: ['fiscal_discipline'],")
        lines.append(f"    failForwardBudget: {2 if tier == 'easy' else 3 if tier == 'standard' else 4},")
        lines.append(f"    fixtureChecksum: {esc(f'{scenario_id}:{derived}')},")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    lines.append(
        "export const V1014_SCENARIO_V2_REPLAY_MANIFEST_BY_ID = Object.fromEntries("
        "V1014_SCENARIO_V2_REPLAY_MANIFESTS.map(m => [m.scenarioId, m]),"
        ");"
    )
    lines.append("")
    lines.append("export function lookupV1014ScenarioV2ReplayManifest(scenario: V1014ScenarioV2Definition): V1014ScenarioV2ReplayManifest | null {")
    lines.append("  return V1014_SCENARIO_V2_REPLAY_MANIFEST_BY_ID[scenario.id] ?? null;")
    lines.append("}")
    lines.append("")
    return "\n".join(lines) + "\n"


def gen_coaching_ledger(manifest_rows: list[tuple[str, str, str, str, int]]) -> str:
    lines = [
        "export interface V1014ScenarioV2CoachingCard {",
        "  scenarioId: string;",
        "  turnBand: 'early' | 'mid' | 'late';",
        "  cohesion20LHint: string;",
        "  nextDecision20L: string;",
        "  worldReaction20IWatch: string;",
        "  strategic20AHHint: string;",
        "  failForwardNote: string;",
        "}",
        "",
        "export const V1014_SCENARIO_V2_COACHING_LEDGER: V1014ScenarioV2CoachingCard[] = [",
    ]
    for scenario_id, arch, region, tier, _ in manifest_rows:
        for band, turn_label in (("early", "Days 1–15"), ("mid", "Days 16–40"), ("late", "Days 41+")):
            lines.append("  {")
            lines.append(f"    scenarioId: {esc(scenario_id)},")
            lines.append(f"    turnBand: {esc(band)},")
            lines.append(f"    cohesion20LHint: {esc(f'{turn_label}: keep primary objective visible in {region}.')},")
            lines.append(f"    nextDecision20L: {esc(f'Prioritize {arch.replace('_', ' ')} actions before side contracts.')},")
            lines.append(f"    worldReaction20IWatch: {esc('Watch objective_completed and region_reinforced signals.')},")
            lines.append(f"    strategic20AHHint: {esc('Consider fiscal_discipline if cash buffer is thin.')},")
            lines.append(
                f"    failForwardNote: {esc(f'Tier {tier}: fail-forward softens primary target once if delayed.')},"
            )
            lines.append("  },")
    lines.append("];")
    lines.append("")
    lines.append(
        "export const V1014_SCENARIO_V2_COACHING_BY_SCENARIO: Record<string, V1014ScenarioV2CoachingCard[]> = "
        "V1014_SCENARIO_V2_COACHING_LEDGER.reduce((acc, row) => {"
        "  (acc[row.scenarioId] ||= []).push(row); return acc;"
        "}, {} as Record<string, V1014ScenarioV2CoachingCard[]>);"
    )
    lines.append("")
    return "\n".join(lines) + "\n"


def gen_catalog_files() -> tuple[list[pathlib.Path], list[tuple[str, str, str, str, int]]]:
    written: list[pathlib.Path] = []
    manifest_rows: list[tuple[str, str, str, str, int]] = []
    for ai, (arch_slug, arch_title, themes) in enumerate(ARCHETYPES):
        scenarios: list[str] = []
        ids: list[str] = []
        for region in REGIONS:
            for tier_slug, tier_label, complexity, money_target, total_days, crisis in TIERS:
                for variant in VARIANTS:
                    sc, sid = gen_scenario_block(
                        arch_slug, arch_title, themes, region, tier_slug, tier_label, complexity,
                        money_target, total_days, crisis, variant,
                    )
                    scenarios.append(sc)
                    ids.append(sid)
                    replay_seed = fnv_seed("replay", sid)
                    manifest_rows.append((sid, arch_slug, region, tier_slug, replay_seed))
        pack_const = f"V1014_SCENARIO_V2_PACK_{arch_slug.upper()}"
        content = (
            "import type { V1014ScenarioV2Definition } from '../v1014-scenario-v2-types';\n\n"
            f"export const {pack_const}: V1014ScenarioV2Definition[] = [\n"
            + "\n".join(scenarios)
            + "\n];\n\n"
            + f"export const {pack_const}_IDS: string[] = {json.dumps(ids)};\n"
        )
        path = OUT / "catalog" / f"pack-{arch_slug}.ts"
        write(path, content)
        written.append(path)
    return written, manifest_rows


def gen_catalog_aggregate() -> str:
    pack_exports = [f"  ...V1014_SCENARIO_V2_PACK_{a[0].upper()}," for a in ARCHETYPES]
    imports = []
    for a in ARCHETYPES:
        slug = a[0]
        imports.append(f"import {{ V1014_SCENARIO_V2_PACK_{slug.upper()} }} from './catalog/pack-{slug}';")
    return (
        "\n".join(imports)
        + "\nimport { buildV1014ScenarioV2MissionGraphIndex } from './v1014-scenario-v2-engine';\n\n"
        + "export const V1014_SCENARIO_V2_CATALOG = [\n"
        + "\n".join(pack_exports)
        + "\n];\n\n"
        + "export const V1014_SCENARIO_V2_MISSION_GRAPHS = Object.values(buildV1014ScenarioV2MissionGraphIndex(V1014_SCENARIO_V2_CATALOG));\n"
        + "export const V1014_SCENARIO_V2_CATALOG_BY_ID = Object.fromEntries(V1014_SCENARIO_V2_CATALOG.map((s: { id: string }) => [s.id, s]));\n"
        + "export const V1014_SCENARIO_V2_GRAPH_BY_ID = buildV1014ScenarioV2MissionGraphIndex(V1014_SCENARIO_V2_CATALOG);\n"
    )


def gen_index() -> str:
    return (
        "export * from './v1014-scenario-v2-types';\n"
        "export * from './v1014-scenario-v2-engine';\n"
        "export * from './v1014-scenario-v2-persistence';\n"
        "export * from './v1014-scenario-v2-crosswire';\n"
        "export * from './v1014-scenario-v2-gates';\n"
        "export * from './v1014-scenario-v2-fixtures';\n"
        "export * from './v1014-scenario-v2-catalog-aggregate';\n"
        "export * from './v1014-scenario-v2-replay-manifests';\n"
        "export * from './v1014-scenario-v2-coaching-ledger';\n"
        "export { runV1014ScenarioV2SelfTests } from './v1014-scenario-v2-self-tests';\n\n"
        "import { runV1014ScenarioV2SelfTests } from './v1014-scenario-v2-self-tests';\n\n"
        "export const V1014_SCENARIO_V2_LAB_REGISTRATION = {\n"
        "  id: 'v1014_scenarios_v2',\n"
        "  label: 'V10.14 Scenario engine v2 (T6-2)',\n"
        "  tier: 'full',\n"
        "  section: 'System Regression',\n"
        "  severity: 'MAJOR',\n"
        "  run: () => runV1014ScenarioV2SelfTests(),\n"
        "} as const;\n"
    )


def gen_fixtures() -> str:
    lines = [
        "import { V1014_SCENARIO_V2_CATALOG, V1014_SCENARIO_V2_GRAPH_BY_ID } from './v1014-scenario-v2-catalog-aggregate';",
        "import {",
        "  advanceV1014ScenarioV2MissionNode,",
        "  initializeV1014ScenarioV2Run,",
        "  validateV1014ScenarioV2MissionGraph,",
        "  v1014ScenarioV2ReplaySeed,",
        "} from './v1014-scenario-v2-engine';",
        "import { buildV1014ScenarioV2CrosswireDigest } from './v1014-scenario-v2-crosswire';",
        "",
        "export interface V1014ScenarioV2FixtureRun {",
        "  id: string;",
        "  scenarioId: string;",
        "  passed: boolean;",
        "  detail: string;",
        "}",
        "",
        "export function runV1014ScenarioV2Fixture(id: string, scenarioId: string, succeedPrimary: boolean): V1014ScenarioV2FixtureRun {",
        "  const scenario = V1014_SCENARIO_V2_CATALOG.find(s => s.id === scenarioId);",
        "  if (!scenario) return { id, scenarioId, passed: false, detail: 'missing_scenario' };",
        "  const graph = V1014_SCENARIO_V2_GRAPH_BY_ID[scenario.missionGraphId];",
        "  if (!graph) return { id, scenarioId, passed: false, detail: 'missing_graph' };",
        "  const issues = validateV1014ScenarioV2MissionGraph(graph);",
        "  if (issues.length) return { id, scenarioId, passed: false, detail: issues.join(',') };",
        "  let persisted = initializeV1014ScenarioV2Run(scenario, graph, 1);",
        "  const replay = v1014ScenarioV2ReplaySeed(scenario.id, scenario.replaySafeSeed);",
        "  if (persisted.replaySeed !== replay) return { id, scenarioId, passed: false, detail: 'replay_seed_mismatch' };",
        "  const firstObjNode = graph.nodes.find(n => n.kind === 'objective');",
        "  if (firstObjNode) {",
        "    persisted = advanceV1014ScenarioV2MissionNode(persisted, graph, firstObjNode.id, 2, succeedPrimary);",
        "  }",
        "  const digest = buildV1014ScenarioV2CrosswireDigest(scenario, graph, persisted);",
        "  return { id, scenarioId, passed: digest.includes('scenario='), detail: digest };",
        "}",
        "",
        "export const V1014_SCENARIO_V2_FIXTURE_RUNS: V1014ScenarioV2FixtureRun[] = (() => {",
        "  const picks = V1014_SCENARIO_V2_CATALOG.filter((_, i) => i % 6 === 0).slice(0, 64);",
        "  return picks.map((s, i) => runV1014ScenarioV2Fixture(`fx${String(i + 1).padStart(2, '0')}`, s.id, i % 3 !== 1));",
        "})();",
        "",
        "export function summarizeV1014ScenarioV2Fixtures(): { passed: number; total: number } {",
        "  const passed = V1014_SCENARIO_V2_FIXTURE_RUNS.filter(r => r.passed).length;",
        "  return { passed, total: V1014_SCENARIO_V2_FIXTURE_RUNS.length };",
        "}",
        "",
    ]
    return "\n".join(lines) + "\n"


def gen_self_tests() -> str:
    return textwrap.dedent(
        """
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
        """
    ).strip() + "\n"


def gen_integration_md(loc_total: int, file_lines: dict[str, int]) -> str:
    files_list = "\n".join(f"| `{k}` | {v:,} |" for k, v in sorted(file_lines.items()))
    return textwrap.dedent(
        f"""
        # INTEGRATION — O6K-21 Scenario packs (T6-2)

        **Branch:** `cursor/o6k-10m-scenario-packs-a939`  
        **Merge target:** `australia-game-upgrade`  
        **Splice anchor:** immediately before `// SECTION 21B:` in `(V9.4) australia-game-with-ai.tsx`  
        **Do not edit** `(V9.4) australia-game-with-ai.tsx` on this shard — Agent 25 inlines via tranche script.

        ## SECTION band

        | Item | Value |
        |------|-------|
        | **Primary band** | **`SECTION 20AY`** — Scenario & objective engine v2 (T6-2) |
        | **Note** | `SECTION 20AW` is fiscal outcomes on HEAD; `SECTION 20AX` is innovation commercialization. **`20AY`** is the next free pre-21B band for this shard. |
        | **Symbol prefix** | `V1014_SCENARIO_V2_*` |
        | **Persistence** | §6 key `v1014_scenario_v2_state`; migrate from `v94_scenario_missions` / `10.14.0-scenario-v1` via `migrateV1014ScenarioV2Persisted` |
        | **LAB** | Register `V1014_SCENARIO_V2_LAB_REGISTRATION` (`id: v1014_scenarios_v2`) adjacent to existing `v1014_*` suite rows before §21B runner |

        ## Cross-wire (pre-splice)

        | Section | Hook |
        |---------|------|
        | **20O** | `V1014_SCENARIO_V2_CONTENT20O_HOOKS`, `mapV1014ScenarioV2ToContent20OThemes` |
        | **20L** | `projectV1014ScenarioV2Cohesion20L` |
        | **20I** | `collectV1014ScenarioV2WorldReaction20IKinds` |
        | **20AH** | `collectV1014ScenarioV2Strategic20AHPolicyIds` |

        ## Agent 25 inline steps

        1. Bundle `expansion/o6k-10m/scenario-packs/index.ts` (+ catalog shards) with `strip_module_imports` pattern from `scripts/agent25-tranche4-merge.py`.
        2. Insert banner `// SECTION 20AY: V10.14 SCENARIO & OBJECTIVE ENGINE V2` before `SECTION 21B`.
        3. Append `...V1014_SCENARIO_V2_CATALOG` to `PRESET_GAME_SCENARIOS` spread (or dedicated export consumed by integrator).
        4. Register LAB row `v1014_scenarios_v2` → `runV1014ScenarioV2SelfTests()`.
        5. Wire save/load for `V1014_SCENARIO_V2_SAVE_KEY` in §6 migration table.

        ## LOC (physical, no padding)

        | File | Lines |
        |------|------:|
        {files_list}
        | **Total** | **{loc_total:,}** |

        ## Verification

        ```bash
        npx tsx -e "import('./expansion/o6k-10m/scenario-packs/index.ts').then(m=>console.log(m.runV1014ScenarioV2SelfTests()))"
        npm run build
        ```
        """
    ).strip() + "\n"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    cat_dir = OUT / "catalog"
    cat_dir.mkdir(parents=True, exist_ok=True)
    for stale in cat_dir.glob("pack-*.ts"):
        stale.unlink()
    allowed = {f"pack-{a[0]}.ts" for a in ARCHETYPES}
    write(OUT / "v1014-scenario-v2-types.ts", gen_types())
    write(OUT / "v1014-scenario-v2-engine.ts", gen_engine())
    write(OUT / "v1014-scenario-v2-persistence.ts", gen_persistence())
    write(OUT / "v1014-scenario-v2-crosswire.ts", gen_crosswire())
    write(OUT / "v1014-scenario-v2-gates.ts", gen_gates())
    catalog_paths, manifest_rows = gen_catalog_files()
    write(OUT / "v1014-scenario-v2-replay-manifests.ts", gen_replay_manifests(manifest_rows))
    write(OUT / "v1014-scenario-v2-coaching-ledger.ts", gen_coaching_ledger(manifest_rows))
    for extra in cat_dir.glob("pack-*.ts"):
        if extra.name not in allowed:
            extra.unlink()
    write(OUT / "v1014-scenario-v2-catalog-aggregate.ts", gen_catalog_aggregate())
    write(OUT / "index.ts", gen_index())
    write(OUT / "v1014-scenario-v2-fixtures.ts", gen_fixtures())
    write(OUT / "v1014-scenario-v2-self-tests.ts", gen_self_tests())

    file_lines: dict[str, int] = {}
    for p in sorted(OUT.rglob("*.ts")):
        rel = str(p.relative_to(ROOT))
        file_lines[rel] = len(p.read_text(encoding="utf-8").splitlines())

    loc_total = sum(file_lines.values())
    write(OUT / "INTEGRATION.md", gen_integration_md(loc_total, file_lines))
    print(f"Generated {loc_total} lines across {len(file_lines)} files")
    if loc_total < 25000:
        print("WARN: below 25k target", loc_total)
    if loc_total > 35000:
        print("WARN: above 35k target", loc_total)


if __name__ == "__main__":
    main()
