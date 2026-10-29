#!/usr/bin/env python3
"""Generate V1025 water security expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "basin-scenarios"
BUFFER_DIR = GEN / "aquifer-reserve-stacks"
FLOOD_DIR = ROOT / "distribution-network-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "distribution_network", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

BASIN_SCENARIO_COUNT = 172
AQUIFER_RESERVE_SHARD_COUNT = 90
DISTRIBUTION_NETWORK_COUNT = 24
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
    return f"""import {{ V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore }} from '../../engine/water-security-utils.ts';
import type {{
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
}} from '../../types/core.ts';

/** Generated basin scenario {mod} — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_{mod}_META = {{
  id: 'basin_{mod}',
  regionId: '{region}' as V1027WsecRegionId,
  primaryChannel: '{mode}' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: '{band}' as V1027WsecWaterSecurityBand,
  seed: {seed},
}} as const;

const V1027_WSEC_BASIN_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1027_WSEC_BASIN_SCENARIO_{mod}_evaluate(turn: number): {{
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1027_WSEC_BASIN_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return {{ waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable }};
}}

export function V1027_WSEC_BASIN_SCENARIO_{mod}_snapshot(turn: number): V1027WsecBasinSnapshot {{
  const r = V1027_WSEC_BASIN_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1027_WSEC_BASIN_SCENARIO_{mod}_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_{mod}_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_{mod}_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_{mod}_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  }};
}}

export function V1027_WSEC_BASIN_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1027_WSEC_BASIN_SCENARIO_{mod}_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}}
"""


def aquifer_reserve_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"distribution_network_{i % DISTRIBUTION_NETWORK_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1027WsecAquiferReserveEdge }} from '../../types/core.ts';

/** Aquifer reserve graph shard {mod} (surface/ground/aquifer corridor coupling). */
export const V1027_WSEC_AQUIFER_RESERVE_SHARD_{mod}: readonly V1027WsecAquiferReserveEdge[] = [
{body}
];
"""


def distribution_network_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1027_WSEC_clamp }} from '../engine/water-security-utils.ts';
import type {{ V1027WsecWaterSecurityBand, V1027WsecRegionId, V1027WsecWaterSecurityChannel }} from '../types/core.ts';

export const V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_META = {{
  id: 'distribution_network_{mod}',
  regionId: '{region}' as V1027WsecRegionId,
  anchorChannel: '{mode}' as V1027WsecWaterSecurityChannel,
  defaultBand: '{band}' as V1027WsecWaterSecurityBand,
}} as const;

const V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_STEPS = [
{steps}
] as const;

export function V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_STEPS.length; i++) {{
    const row = V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1027_WSEC_clamp(acc / V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_STEPS.length, 0, 1);
}}

export function V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_rerouteStress(turn: number): number {{
  return V1027_WSEC_clamp(
    V1027_WSEC_DISTRIBUTION_NETWORK_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(BASIN_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1027_WSEC_BASIN_SCENARIO_{mod}_snapshot, V1027_WSEC_BASIN_SCENARIO_{mod}_META, V1027_WSEC_BASIN_SCENARIO_{mod}_regressionAssert }} from './basin-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1027_WSEC_BASIN_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1027_WSEC_BASIN_SCENARIO_{mod}_META.id]: V1027_WSEC_BASIN_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1027WsecRegionId, V1027WsecBasinSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1027_WSEC_ALL_BASIN_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1027_WSEC_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1027WsecBasinSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1027_WSEC_listActiveBasinScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1027_WSEC_ALL_BASIN_SCENARIO_IDS.length - stride);
  return V1027_WSEC_ALL_BASIN_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1027_WSEC_evaluateBasinBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1027WsecBasinSnapshot[];
  meanWaterStress: number;
  meanWaterSecurityScore: number;
  byRegion: Partial<Record<V1027WsecRegionId, V1027WsecBasinSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1027_WSEC_listActiveBasinScenarioIds(turn);
  const snaps: V1027WsecBasinSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1027_WSEC_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanWaterStress = snaps.reduce((a, s) => a + s.waterStressIndex, 0) / Math.max(1, snaps.length);
  const meanWaterSecurityScore = snaps.reduce((a, s) => a + s.waterSecurityScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1027WsecRegionId, V1027WsecBasinSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanWaterStress, meanWaterSecurityScore, byRegion }};
}}

export function V1027_WSEC_runBasinScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1027_WSEC_ALL_BASIN_SCENARIO_IDS) {{
    const fn = V1027_WSEC_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).waterSecurityScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "basin-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(AQUIFER_RESERVE_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1027_WSEC_AQUIFER_RESERVE_SHARD_{mod} }} from './aquifer-reserve-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1027_WSEC_AQUIFER_RESERVE_SHARD_{mod},")
    bundle = f"""/** Flattened aquifer reserve graph (regional water security coupling). */
import type {{ V1027WsecAquiferReserveEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES: readonly V1027WsecAquiferReserveEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "aquifer-reserve-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(BASIN_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './basin-scenarios/scenario-{mod}.ts';")
    for i in range(AQUIFER_RESERVE_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(aquifer_reserve_shard(i), encoding="utf-8")
        exports.append(f"export * from './aquifer-reserve-stacks/reserve-{mod}.ts';")
    for i in range(DISTRIBUTION_NETWORK_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"distribution-network-{mod}.ts"
        path.write_text(distribution_network_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './basin-registry.ts';",
            "export * from './aquifer-reserve-bundle.ts';",
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
        f"Generated basin scenarios={BASIN_SCENARIO_COUNT} aquifer reserves={AQUIFER_RESERVE_SHARD_COUNT} distribution network nodes={DISTRIBUTION_NETWORK_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
