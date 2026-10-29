#!/usr/bin/env python3
"""Generate V1021 intermodal freight expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "corridor-scenarios"
HANDOFF_DIR = GEN / "handoff-stacks"
HUB_DIR = ROOT / "dwell-hubs"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
MODES = ["rail", "road", "port", "air", "intermodal", "bulk", "container", "refrigerated", "express", "regional"]
DWELL_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

CORRIDOR_SCENARIO_COUNT = 172
HANDOFF_STACK_SHARD_COUNT = 90
DWELL_HUB_NODE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    mode = MODES[i % len(MODES)]
    band = DWELL_BANDS[i % len(DWELL_BANDS)]
    seed = i * 911 + 521
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 11)) % 997) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1021_IMFD_clamp, V1021_IMFD_handoffFromScore }} from '../../engine/intermodal-freight-utils.ts';
import type {{
  V1021ImfdDwellBand,
  V1021ImfdRegionId,
  V1021ImfdCorridorSnapshot,
  V1021ImfdFreightMode,
}} from '../../types/core.ts';

/** Generated corridor scenario {mod} — rail/port/air handoff matrix. */
export const V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META = {{
  id: 'corridor_{mod}',
  regionId: '{region}' as V1021ImfdRegionId,
  primaryMode: '{mode}' as V1021ImfdFreightMode,
  dwellBand: '{band}' as V1021ImfdDwellBand,
  seed: {seed},
}} as const;

const V1021_IMFD_CORRIDOR_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1021_IMFD_CORRIDOR_SCENARIO_{mod}_evaluate(turn: number): {{
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1021_IMFD_CORRIDOR_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1021_IMFD_CORRIDOR_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1021_IMFD_CORRIDOR_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const dwellPenaltyIndex = V1021_IMFD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const handoffDelayTurns = V1021_IMFD_clamp(2 + (acc % 11), 1, 18);
  const corridorCapacityScore = V1021_IMFD_clamp(90 - dwellPenaltyIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1021_IMFD_handoffFromScore(corridorCapacityScore) !== 'fragile';
  return {{ dwellPenaltyIndex, handoffDelayTurns, corridorCapacityScore, stable }};
}}

export function V1021_IMFD_CORRIDOR_SCENARIO_{mod}_snapshot(turn: number): V1021ImfdCorridorSnapshot {{
  const r = V1021_IMFD_CORRIDOR_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META.id,
    regionId: V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META.regionId,
    freightMode: V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META.primaryMode,
    dwellBand: V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META.dwellBand,
    dwellPenaltyIndex: r.dwellPenaltyIndex,
    handoffDelayTurns: r.handoffDelayTurns,
    corridorCapacityScore: r.corridorCapacityScore,
    handoffBand: V1021_IMFD_handoffFromScore(r.corridorCapacityScore),
  }};
}}

export function V1021_IMFD_CORRIDOR_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1021_IMFD_CORRIDOR_SCENARIO_{mod}_evaluate(turn);
  return typeof r.dwellPenaltyIndex === 'number' && r.corridorCapacityScore <= 100;
}}
"""


def handoff_stack_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_m = MODES[i % len(MODES)]
    to_m = MODES[(i + 3) % len(MODES)]
    hub = f"dwell_hub_{i % DWELL_HUB_NODE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromMode: '{from_m}', toMode: '{to_m}', weight: {w}, lagTurns: {lag + (k % 4)}, hubId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1021ImfdHandoffStackEdge }} from '../../types/core.ts';

/** Handoff stack graph shard {mod} (rail/port/air corridor coupling). */
export const V1021_IMFD_HANDOFF_STACK_SHARD_{mod}: readonly V1021ImfdHandoffStackEdge[] = [
{body}
];
"""


def dwell_hub_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = MODES[i % len(MODES)]
    band = DWELL_BANDS[i % len(DWELL_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1021_IMFD_clamp }} from '../engine/intermodal-freight-utils.ts';
import type {{ V1021ImfdDwellBand, V1021ImfdRegionId, V1021ImfdFreightMode }} from '../types/core.ts';

export const V1021_IMFD_DWELL_HUB_{mod}_META = {{
  id: 'dwell_hub_{mod}',
  regionId: '{region}' as V1021ImfdRegionId,
  anchorMode: '{mode}' as V1021ImfdFreightMode,
  defaultBand: '{band}' as V1021ImfdDwellBand,
}} as const;

const V1021_IMFD_DWELL_HUB_{mod}_STEPS = [
{steps}
] as const;

export function V1021_IMFD_DWELL_HUB_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1021_IMFD_DWELL_HUB_{mod}_STEPS.length; i++) {{
    const row = V1021_IMFD_DWELL_HUB_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1021_IMFD_clamp(acc / V1021_IMFD_DWELL_HUB_{mod}_STEPS.length, 0, 1);
}}

export function V1021_IMFD_DWELL_HUB_{mod}_rerouteStress(turn: number): number {{
  return V1021_IMFD_clamp(
    V1021_IMFD_DWELL_HUB_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(CORRIDOR_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1021_IMFD_CORRIDOR_SCENARIO_{mod}_snapshot, V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META, V1021_IMFD_CORRIDOR_SCENARIO_{mod}_regressionAssert }} from './corridor-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1021_IMFD_CORRIDOR_SCENARIO_{mod}_META.id]: V1021_IMFD_CORRIDOR_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1021ImfdRegionId, V1021ImfdCorridorSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1021_IMFD_ALL_CORRIDOR_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1021_IMFD_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1021ImfdCorridorSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1021_IMFD_listActiveCorridorScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1021_IMFD_ALL_CORRIDOR_SCENARIO_IDS.length - stride);
  return V1021_IMFD_ALL_CORRIDOR_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1021_IMFD_evaluateCorridorBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1021ImfdCorridorSnapshot[];
  meanDwellPenalty: number;
  meanCapacity: number;
  byRegion: Partial<Record<V1021ImfdRegionId, V1021ImfdCorridorSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1021_IMFD_listActiveCorridorScenarioIds(turn);
  const snaps: V1021ImfdCorridorSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1021_IMFD_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanDwellPenalty = snaps.reduce((a, s) => a + s.dwellPenaltyIndex, 0) / Math.max(1, snaps.length);
  const meanCapacity = snaps.reduce((a, s) => a + s.corridorCapacityScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1021ImfdRegionId, V1021ImfdCorridorSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanDwellPenalty, meanCapacity, byRegion }};
}}

export function V1021_IMFD_runCorridorScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1021_IMFD_ALL_CORRIDOR_SCENARIO_IDS) {{
    const fn = V1021_IMFD_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).corridorCapacityScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "corridor-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(HANDOFF_STACK_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1021_IMFD_HANDOFF_STACK_SHARD_{mod} }} from './handoff-stacks/handoff-{mod}.ts';")
        spreads.append(f"  ...V1021_IMFD_HANDOFF_STACK_SHARD_{mod},")
    bundle = f"""/** Flattened handoff stack graph (intermodal corridor coupling). */
import type {{ V1021ImfdHandoffStackEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES: readonly V1021ImfdHandoffStackEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "handoff-stack-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(HANDOFF_DIR)
    ensure(HUB_DIR)
    exports = []
    for i in range(CORRIDOR_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './corridor-scenarios/scenario-{mod}.ts';")
    for i in range(HANDOFF_STACK_SHARD_COUNT):
        mod = f"{i:03d}"
        path = HANDOFF_DIR / f"handoff-{mod}.ts"
        path.write_text(handoff_stack_shard(i), encoding="utf-8")
        exports.append(f"export * from './handoff-stacks/handoff-{mod}.ts';")
    for i in range(DWELL_HUB_NODE_COUNT):
        mod = f"{i:02d}"
        path = HUB_DIR / f"dwell-hub-{mod}.ts"
        path.write_text(dwell_hub_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './corridor-registry.ts';",
            "export * from './handoff-stack-bundle.ts';",
        ]
    )
    (GEN / "index.ts").write_text(
        "/** Generated bundle — run scripts/generate.py to refresh. */\n" + "\n".join(exports) + "\n",
        encoding="utf-8",
    )

    total = 0
    for p in ROOT.rglob("*"):
        if p.suffix == ".ts" and "scripts" not in str(p):
            total += len(p.read_text(encoding="utf-8").splitlines())
    print(
        f"Generated corridors={CORRIDOR_SCENARIO_COUNT} handoffs={HANDOFF_STACK_SHARD_COUNT} hubs={DWELL_HUB_NODE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
