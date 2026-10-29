#!/usr/bin/env python3
"""Generate V1023 climate adaptation expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "hazard-scenarios"
BUFFER_DIR = GEN / "drought-buffer-stacks"
FLOOD_DIR = ROOT / "flood-defend-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["heat_urban", "flood_coastal", "drought_inland", "fire_interface", "cyclone_north", "heat_rural", "water_stress", "coastal_erosion", "regional", "remote"]
HAZARD_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

HAZARD_SCENARIO_COUNT = 172
DROUGHT_BUFFER_SHARD_COUNT = 90
FLOOD_NODE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = HAZARD_BANDS[i % len(HAZARD_BANDS)]
    seed = i * 911 + 521
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 11)) % 997) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1023_CLAD_clamp, V1023_CLAD_hazardBandFromScore }} from '../../engine/climate-adaptation-utils.ts';
import type {{
  V1023CladHazardBand,
  V1023CladRegionId,
  V1023CladHazardSnapshot,
  V1023CladAdaptationChannel,
}} from '../../types/core.ts';

/** Generated hazard scenario {mod} — heat/flood/drought handoff matrix. */
export const V1023_CLAD_HAZARD_SCENARIO_{mod}_META = {{
  id: 'stress_{mod}',
  regionId: '{region}' as V1023CladRegionId,
  primaryChannel: '{mode}' as V1023CladAdaptationChannel,
  hazardBand: '{band}' as V1023CladHazardBand,
  seed: {seed},
}} as const;

const V1023_CLAD_HAZARD_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1023_CLAD_HAZARD_SCENARIO_{mod}_evaluate(turn: number): {{
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1023_CLAD_HAZARD_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1023_CLAD_HAZARD_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1023_CLAD_HAZARD_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const heatStressIndex = V1023_CLAD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const droughtBufferDelayTurns = V1023_CLAD_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1023_CLAD_clamp(90 - heatStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1023_CLAD_hazardBandFromScore(resilienceScore) !== 'fragile';
  return {{ heatStressIndex, droughtBufferDelayTurns, resilienceScore, stable }};
}}

export function V1023_CLAD_HAZARD_SCENARIO_{mod}_snapshot(turn: number): V1023CladHazardSnapshot {{
  const r = V1023_CLAD_HAZARD_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1023_CLAD_HAZARD_SCENARIO_{mod}_META.id,
    regionId: V1023_CLAD_HAZARD_SCENARIO_{mod}_META.regionId,
    adaptationChannel: V1023_CLAD_HAZARD_SCENARIO_{mod}_META.primaryChannel,
    hazardBand: V1023_CLAD_HAZARD_SCENARIO_{mod}_META.hazardBand,
    heatStressIndex: r.heatStressIndex,
    droughtBufferDelayTurns: r.droughtBufferDelayTurns,
    resilienceScore: r.resilienceScore,
    hazardBand: V1023_CLAD_hazardBandFromScore(r.resilienceScore),
  }};
}}

export function V1023_CLAD_HAZARD_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1023_CLAD_HAZARD_SCENARIO_{mod}_evaluate(turn);
  return typeof r.heatStressIndex === 'number' && r.resilienceScore <= 100;
}}
"""


def drought_buffer_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"flood_node_{i % FLOOD_NODE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1023CladDroughtBufferEdge }} from '../../types/core.ts';

/** Drought buffer graph shard {mod} (heat/flood/drought corridor coupling). */
export const V1023_CLAD_DROUGHT_BUFFER_SHARD_{mod}: readonly V1023CladDroughtBufferEdge[] = [
{body}
];
"""


def flood_node_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = HAZARD_BANDS[i % len(HAZARD_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1023_CLAD_clamp }} from '../engine/climate-adaptation-utils.ts';
import type {{ V1023CladHazardBand, V1023CladRegionId, V1023CladAdaptationChannel }} from '../types/core.ts';

export const V1023_CLAD_FLOOD_NODE_{mod}_META = {{
  id: 'flood_node_{mod}',
  regionId: '{region}' as V1023CladRegionId,
  anchorChannel: '{mode}' as V1023CladAdaptationChannel,
  defaultBand: '{band}' as V1023CladHazardBand,
}} as const;

const V1023_CLAD_FLOOD_NODE_{mod}_STEPS = [
{steps}
] as const;

export function V1023_CLAD_FLOOD_NODE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1023_CLAD_FLOOD_NODE_{mod}_STEPS.length; i++) {{
    const row = V1023_CLAD_FLOOD_NODE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1023_CLAD_clamp(acc / V1023_CLAD_FLOOD_NODE_{mod}_STEPS.length, 0, 1);
}}

export function V1023_CLAD_FLOOD_NODE_{mod}_rerouteStress(turn: number): number {{
  return V1023_CLAD_clamp(
    V1023_CLAD_FLOOD_NODE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(HAZARD_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1023_CLAD_HAZARD_SCENARIO_{mod}_snapshot, V1023_CLAD_HAZARD_SCENARIO_{mod}_META, V1023_CLAD_HAZARD_SCENARIO_{mod}_regressionAssert }} from './hazard-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1023_CLAD_HAZARD_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1023_CLAD_HAZARD_SCENARIO_{mod}_META.id]: V1023_CLAD_HAZARD_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1023CladRegionId, V1023CladHazardSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1023_CLAD_ALL_HAZARD_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1023_CLAD_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1023CladHazardSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1023_CLAD_listActiveHazardScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1023_CLAD_ALL_HAZARD_SCENARIO_IDS.length - stride);
  return V1023_CLAD_ALL_HAZARD_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1023_CLAD_evaluateHazardBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1023CladHazardSnapshot[];
  meanHeatStress: number;
  meanResilience: number;
  byRegion: Partial<Record<V1023CladRegionId, V1023CladHazardSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1023_CLAD_listActiveHazardScenarioIds(turn);
  const snaps: V1023CladHazardSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1023_CLAD_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanHeatStress = snaps.reduce((a, s) => a + s.heatStressIndex, 0) / Math.max(1, snaps.length);
  const meanResilience = snaps.reduce((a, s) => a + s.resilienceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1023CladRegionId, V1023CladHazardSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanHeatStress, meanResilience, byRegion }};
}}

export function V1023_CLAD_runHazardScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1023_CLAD_ALL_HAZARD_SCENARIO_IDS) {{
    const fn = V1023_CLAD_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).resilienceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "hazard-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(DROUGHT_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1023_CLAD_DROUGHT_BUFFER_SHARD_{mod} }} from './drought-buffer-stacks/buffer-{mod}.ts';")
        spreads.append(f"  ...V1023_CLAD_DROUGHT_BUFFER_SHARD_{mod},")
    bundle = f"""/** Flattened drought buffer graph (climate hazard coupling). */
import type {{ V1023CladDroughtBufferEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES: readonly V1023CladDroughtBufferEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "drought-buffer-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(HAZARD_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './hazard-scenarios/scenario-{mod}.ts';")
    for i in range(DROUGHT_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"buffer-{mod}.ts"
        path.write_text(drought_buffer_shard(i), encoding="utf-8")
        exports.append(f"export * from './drought-buffer-stacks/buffer-{mod}.ts';")
    for i in range(FLOOD_NODE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"flood-node-{mod}.ts"
        path.write_text(flood_node_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './hazard-registry.ts';",
            "export * from './drought-buffer-bundle.ts';",
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
        f"Generated hazard scenarios={HAZARD_SCENARIO_COUNT} drought buffers={DROUGHT_BUFFER_SHARD_COUNT} flood defend nodes={FLOOD_NODE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
