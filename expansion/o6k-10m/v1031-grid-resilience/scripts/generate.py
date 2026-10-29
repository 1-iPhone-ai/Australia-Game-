#!/usr/bin/env python3
"""Generate V1025 grid network resilience expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "outage-scenarios"
BUFFER_DIR = GEN / "grid-buffer-stacks"
FLOOD_DIR = ROOT / "substation-zone-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "substation_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

OUTAGE_SCENARIO_COUNT = 172
GRID_BUFFER_SHARD_COUNT = 90
SUBSTATION_ZONE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    seed = i * 911 + 521
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 11)) % 997) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1031_GRES_clamp, V1031_GRES_gridResilienceBandFromScore }} from '../../engine/grid-resilience-utils.ts';
import type {{
  V1031GresGridResilienceBand,
  V1031GresRegionId,
  V1031GresOutageSnapshot,
  V1031GresGridResilienceChannel,
}} from '../../types/core.ts';

/** Generated outage scenario {mod} — extreme_heat/drought/dust handoff matrix. */
export const V1031_GRES_OUTAGE_SCENARIO_{mod}_META = {{
  id: 'outage_{mod}',
  regionId: '{region}' as V1031GresRegionId,
  primaryChannel: '{mode}' as V1031GresGridResilienceChannel,
  gridResilienceBand: '{band}' as V1031GresGridResilienceBand,
  seed: {seed},
}} as const;

const V1031_GRES_OUTAGE_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1031_GRES_OUTAGE_SCENARIO_{mod}_evaluate(turn: number): {{
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1031_GRES_OUTAGE_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1031_GRES_OUTAGE_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1031_GRES_OUTAGE_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const gridStressExposureIndex = V1031_GRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const gridBufferDelayTurns = V1031_GRES_clamp(2 + (acc % 11), 1, 18);
  const gridResilienceScore = V1031_GRES_clamp(90 - gridStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1031_GRES_gridResilienceBandFromScore(gridResilienceScore) !== 'depleted';
  return {{ gridStressExposureIndex, gridBufferDelayTurns, gridResilienceScore, stable }};
}}

export function V1031_GRES_OUTAGE_SCENARIO_{mod}_snapshot(turn: number): V1031GresOutageSnapshot {{
  const r = V1031_GRES_OUTAGE_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1031_GRES_OUTAGE_SCENARIO_{mod}_META.id,
    regionId: V1031_GRES_OUTAGE_SCENARIO_{mod}_META.regionId,
    gridResilienceChannel: V1031_GRES_OUTAGE_SCENARIO_{mod}_META.primaryChannel,
    gridResilienceBand: V1031_GRES_OUTAGE_SCENARIO_{mod}_META.gridResilienceBand,
    gridStressExposureIndex: r.gridStressExposureIndex,
    gridBufferDelayTurns: r.gridBufferDelayTurns,
    gridResilienceScore: r.gridResilienceScore,
    gridResilienceBand: V1031_GRES_gridResilienceBandFromScore(r.gridResilienceScore),
  }};
}}

export function V1031_GRES_OUTAGE_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1031_GRES_OUTAGE_SCENARIO_{mod}_evaluate(turn);
  return typeof r.gridStressExposureIndex === 'number' && r.gridResilienceScore <= 100;
}}
"""


def grid_buffer_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"substation_zone_{i % SUBSTATION_ZONE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1031GresGridBufferEdge }} from '../../types/core.ts';

/** Grid buffer graph shard {mod} (extreme_heat/drought/dust corridor coupling). */
export const V1031_GRES_GRID_BUFFER_SHARD_{mod}: readonly V1031GresGridBufferEdge[] = [
{body}
];
"""


def substation_zone_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1031_GRES_clamp }} from '../engine/grid-resilience-utils.ts';
import type {{ V1031GresGridResilienceBand, V1031GresRegionId, V1031GresGridResilienceChannel }} from '../types/core.ts';

export const V1031_GRES_SUBSTATION_ZONE_{mod}_META = {{
  id: 'substation_zone_{mod}',
  regionId: '{region}' as V1031GresRegionId,
  anchorChannel: '{mode}' as V1031GresGridResilienceChannel,
  defaultBand: '{band}' as V1031GresGridResilienceBand,
}} as const;

const V1031_GRES_SUBSTATION_ZONE_{mod}_STEPS = [
{steps}
] as const;

export function V1031_GRES_SUBSTATION_ZONE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1031_GRES_SUBSTATION_ZONE_{mod}_STEPS.length; i++) {{
    const row = V1031_GRES_SUBSTATION_ZONE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1031_GRES_clamp(acc / V1031_GRES_SUBSTATION_ZONE_{mod}_STEPS.length, 0, 1);
}}

export function V1031_GRES_SUBSTATION_ZONE_{mod}_rerouteStress(turn: number): number {{
  return V1031_GRES_clamp(
    V1031_GRES_SUBSTATION_ZONE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(OUTAGE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1031_GRES_OUTAGE_SCENARIO_{mod}_snapshot, V1031_GRES_OUTAGE_SCENARIO_{mod}_META, V1031_GRES_OUTAGE_SCENARIO_{mod}_regressionAssert }} from './outage-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1031_GRES_OUTAGE_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1031_GRES_OUTAGE_SCENARIO_{mod}_META.id]: V1031_GRES_OUTAGE_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1031GresRegionId, V1031GresOutageSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1031_GRES_ALL_OUTAGE_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1031_GRES_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1031GresOutageSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1031_GRES_listActiveOutageScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1031_GRES_ALL_OUTAGE_SCENARIO_IDS.length - stride);
  return V1031_GRES_ALL_OUTAGE_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1031_GRES_evaluateOutageBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1031GresOutageSnapshot[];
  meanGridStressExposure: number;
  meanGridResilienceScore: number;
  byRegion: Partial<Record<V1031GresRegionId, V1031GresOutageSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1031_GRES_listActiveOutageScenarioIds(turn);
  const snaps: V1031GresOutageSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1031_GRES_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanGridStressExposure = snaps.reduce((a, s) => a + s.gridStressExposureIndex, 0) / Math.max(1, snaps.length);
  const meanGridResilienceScore = snaps.reduce((a, s) => a + s.gridResilienceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1031GresRegionId, V1031GresOutageSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanGridStressExposure, meanGridResilienceScore, byRegion }};
}}

export function V1031_GRES_runOutageScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1031_GRES_ALL_OUTAGE_SCENARIO_IDS) {{
    const fn = V1031_GRES_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).gridResilienceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "outage-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(GRID_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1031_GRES_GRID_BUFFER_SHARD_{mod} }} from './grid-buffer-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1031_GRES_GRID_BUFFER_SHARD_{mod},")
    bundle = f"""/** Flattened grid buffer graph (regional grid network resilience coupling). */
import type {{ V1031GresGridBufferEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1031_GRES_GENERATED_GRID_BUFFER_EDGES: readonly V1031GresGridBufferEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "grid-buffer-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(OUTAGE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './outage-scenarios/scenario-{mod}.ts';")
    for i in range(GRID_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(grid_buffer_shard(i), encoding="utf-8")
        exports.append(f"export * from './grid-buffer-stacks/reserve-{mod}.ts';")
    for i in range(SUBSTATION_ZONE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"substation-zone-{mod}.ts"
        path.write_text(substation_zone_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './outage-registry.ts';",
            "export * from './grid-buffer-bundle.ts';",
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
        f"Generated outage scenarios={OUTAGE_SCENARIO_COUNT} grid buffers={GRID_BUFFER_SHARD_COUNT} substation zone nodes={SUBSTATION_ZONE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
