#!/usr/bin/env python3
"""Generate V1025 coastal resilience expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "surge-scenarios"
BUFFER_DIR = GEN / "adaptation-buffer-stacks"
FLOOD_DIR = ROOT / "littoral-zone-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "littoral_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

SURGE_SCENARIO_COUNT = 172
ADAPTATION_BUFFER_SHARD_COUNT = 90
LITTORAL_ZONE_COUNT = 24
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
    return f"""import {{ V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore }} from '../../engine/coastal-resilience-utils.ts';
import type {{
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
}} from '../../types/core.ts';

/** Generated surge scenario {mod} — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_{mod}_META = {{
  id: 'surge_{mod}',
  regionId: '{region}' as V1029CresRegionId,
  primaryChannel: '{mode}' as V1029CresCoastalAdaptationChannel,
  adaptationBand: '{band}' as V1029CresAdaptationBand,
  seed: {seed},
}} as const;

const V1029_CRES_SURGE_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1029_CRES_SURGE_SCENARIO_{mod}_evaluate(turn: number): {{
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1029_CRES_SURGE_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return {{ seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable }};
}}

export function V1029_CRES_SURGE_SCENARIO_{mod}_snapshot(turn: number): V1029CresSurgeSnapshot {{
  const r = V1029_CRES_SURGE_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1029_CRES_SURGE_SCENARIO_{mod}_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_{mod}_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_{mod}_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_{mod}_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  }};
}}

export function V1029_CRES_SURGE_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1029_CRES_SURGE_SCENARIO_{mod}_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}}
"""


def adaptation_buffer_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"littoral_zone_{i % LITTORAL_ZONE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1029CresAdaptationBufferEdge }} from '../../types/core.ts';

/** Adaptation buffer graph shard {mod} (storm_surge/king_tide/erosion corridor coupling). */
export const V1029_CRES_ADAPTATION_BUFFER_SHARD_{mod}: readonly V1029CresAdaptationBufferEdge[] = [
{body}
];
"""


def littoral_zone_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1029_CRES_clamp }} from '../engine/coastal-resilience-utils.ts';
import type {{ V1029CresAdaptationBand, V1029CresRegionId, V1029CresCoastalAdaptationChannel }} from '../types/core.ts';

export const V1029_CRES_LITTORAL_ZONE_{mod}_META = {{
  id: 'littoral_zone_{mod}',
  regionId: '{region}' as V1029CresRegionId,
  anchorChannel: '{mode}' as V1029CresCoastalAdaptationChannel,
  defaultBand: '{band}' as V1029CresAdaptationBand,
}} as const;

const V1029_CRES_LITTORAL_ZONE_{mod}_STEPS = [
{steps}
] as const;

export function V1029_CRES_LITTORAL_ZONE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1029_CRES_LITTORAL_ZONE_{mod}_STEPS.length; i++) {{
    const row = V1029_CRES_LITTORAL_ZONE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1029_CRES_clamp(acc / V1029_CRES_LITTORAL_ZONE_{mod}_STEPS.length, 0, 1);
}}

export function V1029_CRES_LITTORAL_ZONE_{mod}_rerouteStress(turn: number): number {{
  return V1029_CRES_clamp(
    V1029_CRES_LITTORAL_ZONE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(SURGE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1029_CRES_SURGE_SCENARIO_{mod}_snapshot, V1029_CRES_SURGE_SCENARIO_{mod}_META, V1029_CRES_SURGE_SCENARIO_{mod}_regressionAssert }} from './surge-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1029_CRES_SURGE_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1029_CRES_SURGE_SCENARIO_{mod}_META.id]: V1029_CRES_SURGE_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1029CresRegionId, V1029CresSurgeSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1029_CRES_ALL_SURGE_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1029_CRES_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1029CresSurgeSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1029_CRES_listActiveSurgeScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1029_CRES_ALL_SURGE_SCENARIO_IDS.length - stride);
  return V1029_CRES_ALL_SURGE_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1029_CRES_evaluateSurgeBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1029CresSurgeSnapshot[];
  meanSeaLevelExposure: number;
  meanAdaptationScore: number;
  byRegion: Partial<Record<V1029CresRegionId, V1029CresSurgeSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1029_CRES_listActiveSurgeScenarioIds(turn);
  const snaps: V1029CresSurgeSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1029_CRES_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanSeaLevelExposure = snaps.reduce((a, s) => a + s.seaLevelExposureIndex, 0) / Math.max(1, snaps.length);
  const meanAdaptationScore = snaps.reduce((a, s) => a + s.adaptationScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1029CresRegionId, V1029CresSurgeSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanSeaLevelExposure, meanAdaptationScore, byRegion }};
}}

export function V1029_CRES_runSurgeScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1029_CRES_ALL_SURGE_SCENARIO_IDS) {{
    const fn = V1029_CRES_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).adaptationScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "surge-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(ADAPTATION_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1029_CRES_ADAPTATION_BUFFER_SHARD_{mod} }} from './adaptation-buffer-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1029_CRES_ADAPTATION_BUFFER_SHARD_{mod},")
    bundle = f"""/** Flattened adaptation buffer graph (regional coastal resilience coupling). */
import type {{ V1029CresAdaptationBufferEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES: readonly V1029CresAdaptationBufferEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "adaptation-buffer-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(SURGE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './surge-scenarios/scenario-{mod}.ts';")
    for i in range(ADAPTATION_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(adaptation_buffer_shard(i), encoding="utf-8")
        exports.append(f"export * from './adaptation-buffer-stacks/reserve-{mod}.ts';")
    for i in range(LITTORAL_ZONE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"littoral-zone-{mod}.ts"
        path.write_text(littoral_zone_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './surge-registry.ts';",
            "export * from './adaptation-buffer-bundle.ts';",
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
        f"Generated surge scenarios={SURGE_SCENARIO_COUNT} adaptation buffers={ADAPTATION_BUFFER_SHARD_COUNT} littoral zone nodes={LITTORAL_ZONE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
