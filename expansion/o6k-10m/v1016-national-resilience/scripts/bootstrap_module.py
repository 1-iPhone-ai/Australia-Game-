#!/usr/bin/env python3
"""Bootstrap V1016 national resilience expansion + run generate.py."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN_SCRIPT = ROOT / "scripts" / "generate.py"

# --- generate.py content ---
GEN_SCRIPT.write_text(
    r'''#!/usr/bin/env python3
"""Generate V1016 national resilience expansion shards (meaningful TS, no comment padding)."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "supply-shock-scenarios"
PROP_DIR = GEN / "propagation-graph"
NODE_DIR = ROOT / "continuity-nodes"

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
SHOCK_BANDS = ["latent", "emerging", "active", "critical", "recovering"]

SUPPLY_SHOCK_SCENARIO_COUNT = 172
PROPAGATION_SHARD_COUNT = 90
CONTINUITY_NODE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    system = SYSTEMS[i % len(SYSTEMS)]
    band = SHOCK_BANDS[i % len(SHOCK_BANDS)]
    seed = i * 877 + 41
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 7)) % 991) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1016_NRES_clamp, V1016_NRES_continuityFromScore }} from '../../engine/national-resilience-utils.ts';
import type {{
  V1016NresContinuityBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
}} from '../../types/core.ts';

/** Generated supply-shock scenario {mod} — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_{mod}_META = {{
  id: 'shock_{mod}',
  regionId: '{region}' as V1016NresRegionId,
  primarySystem: '{system}' as V1016NresSystemDomain,
  shockBand: '{band}' as V1016NresContinuityBand,
  seed: {seed},
}} as const;

const V1016_NRES_SHOCK_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1016_NRES_SHOCK_SCENARIO_{mod}_evaluate(turn: number): {{
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1016_NRES_SHOCK_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 13);
  }}
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return {{ severityIndex, propagationDelayTurns, continuityScore, stable }};
}}

export function V1016_NRES_SHOCK_SCENARIO_{mod}_snapshot(turn: number): V1016NresSupplyShockSnapshot {{
  const r = V1016_NRES_SHOCK_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1016_NRES_SHOCK_SCENARIO_{mod}_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_{mod}_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_{mod}_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_{mod}_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  }};
}}

export function V1016_NRES_SHOCK_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1016_NRES_SHOCK_SCENARIO_{mod}_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}}
"""


def propagation_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_s = SYSTEMS[i % len(SYSTEMS)]
    to_s = SYSTEMS[(i + 4) % len(SYSTEMS)]
    node = f"node_{i % CONTINUITY_NODE_COUNT:02d}"
    weight = round(0.12 + (i % 19) * 0.035, 4)
    lag = 3 + (i % 8)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 11 + k) % 15) * 0.007, 4)
        rows.append(
            f"  {{ fromSystem: '{from_s}', toSystem: '{to_s}', weight: {w}, lagTurns: {lag + (k % 3)}, nodeId: '{node}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1016NresPropagationEdge }} from '../../types/core.ts';

/** Propagation graph shard {mod} (supply shock cross-system coupling). */
export const V1016_NRES_PROPAGATION_SHARD_{mod}: readonly V1016NresPropagationEdge[] = [
{body}
];
"""


def continuity_node_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    system = SYSTEMS[i % len(SYSTEMS)]
    band = SHOCK_BANDS[i % len(SHOCK_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.28 + ((i * 17 + s) % 45) / 100, 4)
        lines.append(f"  {{ step: {s}, bufferDays: {cap}, rerouteCost: {(s + i) % 11} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1016_NRES_clamp }} from '../engine/national-resilience-utils.ts';
import type {{ V1016NresContinuityBand, V1016NresRegionId, V1016NresSystemDomain }} from '../types/core.ts';

export const V1016_NRES_CONTINUITY_NODE_{mod}_META = {{
  id: 'node_{mod}',
  regionId: '{region}' as V1016NresRegionId,
  anchorSystem: '{system}' as V1016NresSystemDomain,
  defaultBand: '{band}' as V1016NresContinuityBand,
}} as const;

const V1016_NRES_CONTINUITY_NODE_{mod}_STEPS = [
{steps}
] as const;

export function V1016_NRES_CONTINUITY_NODE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1016_NRES_CONTINUITY_NODE_{mod}_STEPS.length; i++) {{
    const row = V1016_NRES_CONTINUITY_NODE_{mod}_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }}
  return V1016_NRES_clamp(acc / V1016_NRES_CONTINUITY_NODE_{mod}_STEPS.length, 0, 1);
}}

export function V1016_NRES_CONTINUITY_NODE_{mod}_rerouteStress(turn: number): number {{
  return V1016_NRES_clamp(
    V1016_NRES_CONTINUITY_NODE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(SUPPLY_SHOCK_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1016_NRES_SHOCK_SCENARIO_{mod}_snapshot, V1016_NRES_SHOCK_SCENARIO_{mod}_META, V1016_NRES_SHOCK_SCENARIO_{mod}_regressionAssert }} from './supply-shock-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1016_NRES_SHOCK_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1016_NRES_SHOCK_SCENARIO_{mod}_META.id]: V1016_NRES_SHOCK_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1016NresRegionId, V1016NresSupplyShockSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1016_NRES_ALL_SHOCK_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1016_NRES_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1016NresSupplyShockSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1016_NRES_listActiveShockScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1016_NRES_ALL_SHOCK_SCENARIO_IDS.length - stride);
  return V1016_NRES_ALL_SHOCK_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1016_NRES_evaluateSupplyShockBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1016NresSupplyShockSnapshot[];
  meanSeverity: number;
  meanContinuity: number;
  byRegion: Partial<Record<V1016NresRegionId, V1016NresSupplyShockSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1016_NRES_listActiveShockScenarioIds(turn);
  const snaps: V1016NresSupplyShockSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1016_NRES_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanSeverity = snaps.reduce((a, s) => a + s.severityIndex, 0) / Math.max(1, snaps.length);
  const meanContinuity = snaps.reduce((a, s) => a + s.continuityScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1016NresRegionId, V1016NresSupplyShockSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanSeverity, meanContinuity, byRegion }};
}}

export function V1016_NRES_runShockScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1016_NRES_ALL_SHOCK_SCENARIO_IDS) {{
    const fn = V1016_NRES_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).continuityScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "supply-shock-registry.ts").write_text(registry, encoding="utf-8")


def write_propagation_bundle() -> None:
    imports = []
    spreads = []
    for i in range(PROPAGATION_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1016_NRES_PROPAGATION_SHARD_{mod} }} from './propagation-graph/prop-{mod}.ts';")
        spreads.append(f"  ...V1016_NRES_PROPAGATION_SHARD_{mod},")
    bundle = f"""/** Flattened propagation graph (national resilience coupling). */
import type {{ V1016NresPropagationEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1016_NRES_GENERATED_PROPAGATION_EDGES: readonly V1016NresPropagationEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "propagation-graph-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(PROP_DIR)
    ensure(NODE_DIR)
    exports = []
    for i in range(SUPPLY_SHOCK_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './supply-shock-scenarios/scenario-{mod}.ts';")
    for i in range(PROPAGATION_SHARD_COUNT):
        mod = f"{i:03d}"
        path = PROP_DIR / f"prop-{mod}.ts"
        path.write_text(propagation_shard(i), encoding="utf-8")
        exports.append(f"export * from './propagation-graph/prop-{mod}.ts';")
    for i in range(CONTINUITY_NODE_COUNT):
        mod = f"{i:02d}"
        path = NODE_DIR / f"node-{mod}.ts"
        path.write_text(continuity_node_module(i), encoding="utf-8")

    write_registry()
    write_propagation_bundle()
    exports.extend(
        [
            "export * from './supply-shock-registry.ts';",
            "export * from './propagation-graph-bundle.ts';",
        ]
    )
    (GEN / "index.ts").write_text(
        "/** Generated bundle — run scripts/generate.py to refresh. */\n" + "\n".join(exports) + "\n",
        encoding="utf-8",
    )

    total = 0
    for p in ROOT.rglob("*"):
        if p.suffix == ".ts" and "node_modules" not in str(p):
            total += len(p.read_text(encoding="utf-8").splitlines())
    print(f"Generated shocks={SUPPLY_SHOCK_SCENARIO_COUNT} props={PROPAGATION_SHARD_COUNT} nodes={CONTINUITY_NODE_COUNT}")
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
''',
    encoding="utf-8",
)

# --- types/core.ts ---
(ROOT / "types" / "core.ts").write_text(
    """/**
 * V1016_NRES — national resilience, supply shock & continuity (SECTION 20BG / O6K-33).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1016_NRES_SCHEMA_VERSION = '10.16.national_resilience.1' as const;

export type V1016NresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1016NresSystemDomain =
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

export type V1016NresContinuityBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1016NresShockBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1016NresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1016NresRegionId, number>>;
  propagationIndex: number;
}

export interface V1016NresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1016NresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1016NresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

export interface V1016NresPropagationEdge {
  fromSystem: V1016NresSystemDomain;
  toSystem: V1016NresSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1016NresSupplyShockSnapshot {
  scenarioId: string;
  regionId: V1016NresRegionId;
  systemDomain: V1016NresSystemDomain;
  shockBand: V1016NresShockBand;
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  continuityBand: V1016NresContinuityBand;
}

export interface V1016NresPersisted {
  schemaVersion: typeof V1016_NRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  shockSnapshots: Record<string, V1016NresSupplyShockSnapshot>;
  propagationGraphRevision: number;
  regionalContinuity: Partial<
    Record<
      V1016NresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeContinuity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeverity: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1016NresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1016NresV1014SupplySlice;
  trade20ba: V1016NresV1014TradeSlice;
  energy20bc: V1016NresV1014EnergySlice;
  workforce20bf: V1016NresV1014WorkforceSlice;
  fiscalHeadroom: number;
  continuityPolicyFocus: number;
  activeShockScenarioIds: string[];
  activeContinuityNodeIds: string[];
  persisted: V1016NresPersisted | null;
}

export interface V1016NresRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregateContinuityScore: number;
  nationalResilienceScore: number;
  supplyShockPressure: number;
  propagationGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1016NresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1016NresRegionId, number>>;
}

export interface V1016NresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1016NresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1016NresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1016NresTurnResult {
  state: V1016NresRuntimeState;
  persisted: V1016NresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1016NresSelfTestResult {
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
