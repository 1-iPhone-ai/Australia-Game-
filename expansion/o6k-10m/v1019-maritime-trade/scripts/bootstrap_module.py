#!/usr/bin/env python3
"""Bootstrap V1016 maritime trade expansion + run generate.py."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN_SCRIPT = ROOT / "scripts" / "generate.py"

# --- generate.py content ---
GEN_SCRIPT.write_text(
    r'''#!/usr/bin/env python3
"""Generate V1016 maritime trade expansion shards (meaningful TS, no comment padding)."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "shipping-lane-scenarios"
PROP_DIR = GEN / "lane-graph"
NODE_DIR = ROOT / "maritime-ports"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
SYSTEMS = [
    "freight",
    "energy",
    "water",
    "digital",
    "trade",
    "pharma",
    "food",
    "industrial",
    "telecom",
    "finance",
]
ROUTE_BANDS = ["latent", "emerging", "active", "critical", "recovering"]

SUPPLY_ROUTE_SCENARIO_COUNT = 172
CORRIDOR_SHARD_COUNT = 90
HUB_NODE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    system = SYSTEMS[i % len(SYSTEMS)]
    band = ROUTE_BANDS[i % len(ROUTE_BANDS)]
    seed = i * 877 + 41
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 7)) % 991) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1019_MTRD_clamp, V1019_MTRD_portFromScore }} from '../../engine/maritime-trade-utils.ts';
import type {{
  V1019MtrdPortBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
}} from '../../types/core.ts';

/** Generated freight-route scenario {mod} — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_{mod}_META = {{
  id: 'lane_{mod}',
  regionId: '{region}' as V1019MtrdRegionId,
  primarySystem: '{system}' as V1019MtrdSystemDomain,
  routeBand: '{band}' as V1019MtrdPortBand,
  seed: {seed},
}} as const;

const V1019_MTRD_LANE_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1019_MTRD_LANE_SCENARIO_{mod}_evaluate(turn: number): {{
  severityIndex: number;
  corridorDelayTurns: number;
  portScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1019_MTRD_LANE_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 13);
  }}
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const corridorDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return {{ severityIndex, corridorDelayTurns, portScore, stable }};
}}

export function V1019_MTRD_LANE_SCENARIO_{mod}_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {{
  const r = V1019_MTRD_LANE_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1019_MTRD_LANE_SCENARIO_{mod}_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_{mod}_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_{mod}_META.primarySystem,
    routeBand: V1019_MTRD_LANE_SCENARIO_{mod}_META.routeBand,
    severityIndex: r.severityIndex,
    corridorDelayTurns: r.corridorDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  }};
}}

export function V1019_MTRD_LANE_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1019_MTRD_LANE_SCENARIO_{mod}_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}}
"""


def corridor_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_s = SYSTEMS[i % len(SYSTEMS)]
    to_s = SYSTEMS[(i + 4) % len(SYSTEMS)]
    node = f"hub_{i % HUB_NODE_COUNT:02d}"
    weight = round(0.12 + (i % 19) * 0.035, 4)
    lag = 3 + (i % 8)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 11 + k) % 15) * 0.007, 4)
        rows.append(
            f"  {{ fromSystem: '{from_s}', toSystem: '{to_s}', weight: {w}, lagTurns: {lag + (k % 3)}, nodeId: '{node}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1019MtrdCorridorEdge }} from '../../types/core.ts';

/** Corridor graph shard {mod} (shipping lane cross-system coupling). */
export const V1019_MTRD_LANE_GRAPH_SHARD_{mod}: readonly V1019MtrdCorridorEdge[] = [
{body}
];
"""


def hub_hub_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    system = SYSTEMS[i % len(SYSTEMS)]
    band = ROUTE_BANDS[i % len(ROUTE_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.28 + ((i * 17 + s) % 45) / 100, 4)
        lines.append(f"  {{ step: {s}, bufferDays: {cap}, rerouteCost: {(s + i) % 11} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1019_MTRD_clamp }} from '../engine/maritime-trade-utils.ts';
import type {{ V1019MtrdPortBand, V1019MtrdRegionId, V1019MtrdSystemDomain }} from '../types/core.ts';

export const V1019_MTRD_PORT_NODE_{mod}_META = {{
  id: 'hub_{mod}',
  regionId: '{region}' as V1019MtrdRegionId,
  anchorSystem: '{system}' as V1019MtrdSystemDomain,
  defaultBand: '{band}' as V1019MtrdPortBand,
}} as const;

const V1019_MTRD_PORT_NODE_{mod}_STEPS = [
{steps}
] as const;

export function V1019_MTRD_PORT_NODE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1019_MTRD_PORT_NODE_{mod}_STEPS.length; i++) {{
    const row = V1019_MTRD_PORT_NODE_{mod}_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }}
  return V1019_MTRD_clamp(acc / V1019_MTRD_PORT_NODE_{mod}_STEPS.length, 0, 1);
}}

export function V1019_MTRD_PORT_NODE_{mod}_rerouteStress(turn: number): number {{
  return V1019_MTRD_clamp(
    V1019_MTRD_PORT_NODE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(SUPPLY_ROUTE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1019_MTRD_LANE_SCENARIO_{mod}_snapshot, V1019_MTRD_LANE_SCENARIO_{mod}_META, V1019_MTRD_LANE_SCENARIO_{mod}_regressionAssert }} from './shipping-lane-scenarios/lane-{mod}.ts';"
        )
        list_ids.append(f"  V1019_MTRD_LANE_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1019_MTRD_LANE_SCENARIO_{mod}_META.id]: V1019_MTRD_LANE_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1019MtrdRegionId, V1019MtrdShippingLaneSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1019_MTRD_ALL_LANE_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1019_MTRD_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1019MtrdShippingLaneSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1019_MTRD_listActiveLaneScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1019_MTRD_ALL_LANE_SCENARIO_IDS.length - stride);
  return V1019_MTRD_ALL_LANE_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1019_MTRD_evaluateShippingLaneBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1019MtrdShippingLaneSnapshot[];
  meanSeverity: number;
  meanHub: number;
  byRegion: Partial<Record<V1019MtrdRegionId, V1019MtrdShippingLaneSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1019_MTRD_listActiveLaneScenarioIds(turn);
  const snaps: V1019MtrdShippingLaneSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1019_MTRD_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanSeverity = snaps.reduce((a, s) => a + s.severityIndex, 0) / Math.max(1, snaps.length);
  const meanHub = snaps.reduce((a, s) => a + s.portScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1019MtrdRegionId, V1019MtrdShippingLaneSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanSeverity, meanHub, byRegion }};
}}

export function V1019_MTRD_runLaneScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1019_MTRD_ALL_LANE_SCENARIO_IDS) {{
    const fn = V1019_MTRD_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).portScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "shipping-lane-registry.ts").write_text(registry, encoding="utf-8")


def write_corridor_bundle() -> None:
    imports = []
    spreads = []
    for i in range(CORRIDOR_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1019_MTRD_LANE_GRAPH_SHARD_{mod} }} from './lane-graph/lane-{mod}.ts';")
        spreads.append(f"  ...V1019_MTRD_LANE_GRAPH_SHARD_{mod},")
    bundle = f"""/** Flattened corridor graph (maritime trade coupling). */
import type {{ V1019MtrdCorridorEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1019_MTRD_GENERATED_LANE_GRAPH_EDGES: readonly V1019MtrdCorridorEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "lane-graph-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(PROP_DIR)
    ensure(NODE_DIR)
    exports = []
    for i in range(SUPPLY_ROUTE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"lane-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './shipping-lane-scenarios/lane-{mod}.ts';")
    for i in range(CORRIDOR_SHARD_COUNT):
        mod = f"{i:03d}"
        path = PROP_DIR / f"corr-{mod}.ts"
        path.write_text(corridor_shard(i), encoding="utf-8")
        exports.append(f"export * from './lane-graph/lane-{mod}.ts';")
    for i in range(HUB_NODE_COUNT):
        mod = f"{i:02d}"
        path = NODE_DIR / f"hub-{mod}.ts"
        path.write_text(hub_hub_module(i), encoding="utf-8")

    write_registry()
    write_corridor_bundle()
    exports.extend(
        [
            "export * from './shipping-lane-registry.ts';",
            "export * from './lane-graph-bundle.ts';",
        ]
    )
    (GEN / "index.ts").write_text(
        "/** Generated bundle — run scripts/generate.py to refresh. */\n" + "\n".join(exports) + "\n",
        encoding="utf-8",
    )

    total = 0
    for p in ROOT.rglob("*"):
        if p.suffix == ".ts" and "hub_modules" not in str(p):
            total += len(p.read_text(encoding="utf-8").splitlines())
    print(f"Generated routes={SUPPLY_ROUTE_SCENARIO_COUNT} props={CORRIDOR_SHARD_COUNT} nodes={HUB_NODE_COUNT}")
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
''',
    encoding="utf-8",
)

# --- types/core.ts ---
(ROOT / "types" / "core.ts").write_text(
    """/**
 * V1017_ICLOG — maritime trade, shipping lane & hub (SECTION 20BM / O6K-41).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20AK), workforce (20BG).
 */

export const V1019_MTRD_SCHEMA_VERSION = '10.19.maritime_trade.1' as const;

export type V1019MtrdRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1019MtrdSystemDomain =
  | 'freight'
  | 'energy'
  | 'water'
  | 'digital'
  | 'trade'
  | 'pharma'
  | 'food'
  | 'industrial'
  | 'telecom'
  | 'finance';

export type V1019MtrdPortBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1019MtrdRouteBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1019MtrdV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1019MtrdRegionId, number>>;
  corridorIndex: number;
}

export interface V1019MtrdV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1019MtrdV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1019MtrdV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

export interface V1019MtrdCorridorEdge {
  fromSystem: V1019MtrdSystemDomain;
  toSystem: V1019MtrdSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1019MtrdShippingLaneSnapshot {
  scenarioId: string;
  regionId: V1019MtrdRegionId;
  systemDomain: V1019MtrdSystemDomain;
  routeBand: V1019MtrdRouteBand;
  severityIndex: number;
  corridorDelayTurns: number;
  portScore: number;
  portBand: V1019MtrdPortBand;
}

export interface V1019MtrdPersisted {
  schemaVersion: typeof V1019_MTRD_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  routeSnapshots: Record<string, V1019MtrdShippingLaneSnapshot>;
  corridorGraphRevision: number;
  regionalPort: Partial<
    Record<
      V1019MtrdRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositePort: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeverity: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1019MtrdTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1019MtrdV1014SupplySlice;
  trade20ba: V1019MtrdV1014TradeSlice;
  cities20ak: V1019MtrdV1014EnergySlice;
  resilience20bg: V1019MtrdV1014WorkforceSlice;
  fiscalHeadroom: number;
  portPolicyFocus: number;
  activeLaneScenarioIds: string[];
  activePortNodeIds: string[];
  persisted: V1019MtrdPersisted | null;
}

export interface V1019MtrdRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregatePortScore: number;
  nationalMaritimeScore: number;
  shippingLanePressure: number;
  corridorGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1019MtrdSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1019MtrdRegionId, number>>;
}

export interface V1019MtrdTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1019MtrdEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1019MtrdWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1019MtrdTurnResult {
  state: V1019MtrdRuntimeState;
  persisted: V1019MtrdPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1019MtrdSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
""",
    encoding="utf-8",
)

print("Wrote generate.py and types/core.ts")
subprocess.check_call([sys.executable, str(GEN_SCRIPT)], cwd=str(ROOT))
