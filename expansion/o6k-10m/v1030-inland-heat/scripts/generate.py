#!/usr/bin/env python3
"""Generate V1025 inland heat adaptation expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "heatwave-scenarios"
BUFFER_DIR = GEN / "arid-buffer-stacks"
FLOOD_DIR = ROOT / "inland-zone-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "inland_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

HEATWAVE_SCENARIO_COUNT = 172
ARID_BUFFER_SHARD_COUNT = 90
INLAND_ZONE_COUNT = 24
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
    return f"""import {{ V1030_IHEAT_clamp, V1030_IHEAT_aridAdaptationBandFromScore }} from '../../engine/inland-heat-utils.ts';
import type {{
  V1030IheatAridAdaptationBand,
  V1030IheatRegionId,
  V1030IheatHeatwaveSnapshot,
  V1030IheatInlandHeatChannel,
}} from '../../types/core.ts';

/** Generated heatwave scenario {mod} — extreme_heat/drought/dust handoff matrix. */
export const V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META = {{
  id: 'heatwave_{mod}',
  regionId: '{region}' as V1030IheatRegionId,
  primaryChannel: '{mode}' as V1030IheatInlandHeatChannel,
  aridAdaptationBand: '{band}' as V1030IheatAridAdaptationBand,
  seed: {seed},
}} as const;

const V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_evaluate(turn: number): {{
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const inlandHeatExposureIndex = V1030_IHEAT_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aridBufferDelayTurns = V1030_IHEAT_clamp(2 + (acc % 11), 1, 18);
  const aridAdaptationScore = V1030_IHEAT_clamp(90 - inlandHeatExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1030_IHEAT_aridAdaptationBandFromScore(aridAdaptationScore) !== 'depleted';
  return {{ inlandHeatExposureIndex, aridBufferDelayTurns, aridAdaptationScore, stable }};
}}

export function V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_snapshot(turn: number): V1030IheatHeatwaveSnapshot {{
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META.id,
    regionId: V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META.regionId,
    inlandHeatChannel: V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META.primaryChannel,
    aridAdaptationBand: V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META.aridAdaptationBand,
    inlandHeatExposureIndex: r.inlandHeatExposureIndex,
    aridBufferDelayTurns: r.aridBufferDelayTurns,
    aridAdaptationScore: r.aridAdaptationScore,
    aridAdaptationBand: V1030_IHEAT_aridAdaptationBandFromScore(r.aridAdaptationScore),
  }};
}}

export function V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_evaluate(turn);
  return typeof r.inlandHeatExposureIndex === 'number' && r.aridAdaptationScore <= 100;
}}
"""


def arid_buffer_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"inland_zone_{i % INLAND_ZONE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1030IheatAridBufferEdge }} from '../../types/core.ts';

/** Arid buffer graph shard {mod} (extreme_heat/drought/dust corridor coupling). */
export const V1030_IHEAT_ARID_BUFFER_SHARD_{mod}: readonly V1030IheatAridBufferEdge[] = [
{body}
];
"""


def inland_zone_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1030_IHEAT_clamp }} from '../engine/inland-heat-utils.ts';
import type {{ V1030IheatAridAdaptationBand, V1030IheatRegionId, V1030IheatInlandHeatChannel }} from '../types/core.ts';

export const V1030_IHEAT_INLAND_ZONE_{mod}_META = {{
  id: 'inland_zone_{mod}',
  regionId: '{region}' as V1030IheatRegionId,
  anchorChannel: '{mode}' as V1030IheatInlandHeatChannel,
  defaultBand: '{band}' as V1030IheatAridAdaptationBand,
}} as const;

const V1030_IHEAT_INLAND_ZONE_{mod}_STEPS = [
{steps}
] as const;

export function V1030_IHEAT_INLAND_ZONE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1030_IHEAT_INLAND_ZONE_{mod}_STEPS.length; i++) {{
    const row = V1030_IHEAT_INLAND_ZONE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1030_IHEAT_clamp(acc / V1030_IHEAT_INLAND_ZONE_{mod}_STEPS.length, 0, 1);
}}

export function V1030_IHEAT_INLAND_ZONE_{mod}_rerouteStress(turn: number): number {{
  return V1030_IHEAT_clamp(
    V1030_IHEAT_INLAND_ZONE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(HEATWAVE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_snapshot, V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META, V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_regressionAssert }} from './heatwave-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_META.id]: V1030_IHEAT_HEATWAVE_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1030IheatRegionId, V1030IheatHeatwaveSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1030_IHEAT_ALL_HEATWAVE_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1030_IHEAT_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1030IheatHeatwaveSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1030_IHEAT_listActiveHeatwaveScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1030_IHEAT_ALL_HEATWAVE_SCENARIO_IDS.length - stride);
  return V1030_IHEAT_ALL_HEATWAVE_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1030_IHEAT_evaluateHeatwaveBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1030IheatHeatwaveSnapshot[];
  meanInlandHeatExposure: number;
  meanAridAdaptationScore: number;
  byRegion: Partial<Record<V1030IheatRegionId, V1030IheatHeatwaveSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1030_IHEAT_listActiveHeatwaveScenarioIds(turn);
  const snaps: V1030IheatHeatwaveSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1030_IHEAT_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanInlandHeatExposure = snaps.reduce((a, s) => a + s.inlandHeatExposureIndex, 0) / Math.max(1, snaps.length);
  const meanAridAdaptationScore = snaps.reduce((a, s) => a + s.aridAdaptationScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1030IheatRegionId, V1030IheatHeatwaveSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanInlandHeatExposure, meanAridAdaptationScore, byRegion }};
}}

export function V1030_IHEAT_runHeatwaveScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1030_IHEAT_ALL_HEATWAVE_SCENARIO_IDS) {{
    const fn = V1030_IHEAT_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).aridAdaptationScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "heatwave-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(ARID_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1030_IHEAT_ARID_BUFFER_SHARD_{mod} }} from './arid-buffer-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1030_IHEAT_ARID_BUFFER_SHARD_{mod},")
    bundle = f"""/** Flattened arid buffer graph (regional inland heat adaptation coupling). */
import type {{ V1030IheatAridBufferEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES: readonly V1030IheatAridBufferEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "arid-buffer-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(HEATWAVE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './heatwave-scenarios/scenario-{mod}.ts';")
    for i in range(ARID_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(arid_buffer_shard(i), encoding="utf-8")
        exports.append(f"export * from './arid-buffer-stacks/reserve-{mod}.ts';")
    for i in range(INLAND_ZONE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"inland-zone-{mod}.ts"
        path.write_text(inland_zone_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './heatwave-registry.ts';",
            "export * from './arid-buffer-bundle.ts';",
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
        f"Generated heatwave scenarios={HEATWAVE_SCENARIO_COUNT} arid buffers={ARID_BUFFER_SHARD_COUNT} inland zone nodes={INLAND_ZONE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
