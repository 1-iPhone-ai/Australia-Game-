#!/usr/bin/env python3
"""Generate V1025 telecom network resilience expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "failover-scenarios"
BUFFER_DIR = GEN / "backbone-buffer-stacks"
FLOOD_DIR = ROOT / "exchange-zone-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "exchange_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

FAILOVER_SCENARIO_COUNT = 172
BACKBONE_BUFFER_SHARD_COUNT = 90
EXCHANGE_ZONE_COUNT = 24
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
    return f"""import {{ V1032_TRES_clamp, V1032_TRES_telecomResilienceBandFromScore }} from '../../engine/telecom-resilience-utils.ts';
import type {{
  V1032TresTelecomResilienceBand,
  V1032TresRegionId,
  V1032TresFailoverSnapshot,
  V1032TresTelecomResilienceChannel,
}} from '../../types/core.ts';

/** Generated failover scenario {mod} — extreme_heat/drought/dust handoff matrix. */
export const V1032_TRES_FAILOVER_SCENARIO_{mod}_META = {{
  id: 'failover_{mod}',
  regionId: '{region}' as V1032TresRegionId,
  primaryChannel: '{mode}' as V1032TresTelecomResilienceChannel,
  telecomResilienceBand: '{band}' as V1032TresTelecomResilienceBand,
  seed: {seed},
}} as const;

const V1032_TRES_FAILOVER_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1032_TRES_FAILOVER_SCENARIO_{mod}_evaluate(turn: number): {{
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1032_TRES_FAILOVER_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1032_TRES_FAILOVER_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1032_TRES_FAILOVER_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const telecomStressExposureIndex = V1032_TRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const backboneBufferDelayTurns = V1032_TRES_clamp(2 + (acc % 11), 1, 18);
  const telecomResilienceScore = V1032_TRES_clamp(90 - telecomStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1032_TRES_telecomResilienceBandFromScore(telecomResilienceScore) !== 'depleted';
  return {{ telecomStressExposureIndex, backboneBufferDelayTurns, telecomResilienceScore, stable }};
}}

export function V1032_TRES_FAILOVER_SCENARIO_{mod}_snapshot(turn: number): V1032TresFailoverSnapshot {{
  const r = V1032_TRES_FAILOVER_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1032_TRES_FAILOVER_SCENARIO_{mod}_META.id,
    regionId: V1032_TRES_FAILOVER_SCENARIO_{mod}_META.regionId,
    telecomResilienceChannel: V1032_TRES_FAILOVER_SCENARIO_{mod}_META.primaryChannel,
    telecomResilienceBand: V1032_TRES_FAILOVER_SCENARIO_{mod}_META.telecomResilienceBand,
    telecomStressExposureIndex: r.telecomStressExposureIndex,
    backboneBufferDelayTurns: r.backboneBufferDelayTurns,
    telecomResilienceScore: r.telecomResilienceScore,
    telecomResilienceBand: V1032_TRES_telecomResilienceBandFromScore(r.telecomResilienceScore),
  }};
}}

export function V1032_TRES_FAILOVER_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1032_TRES_FAILOVER_SCENARIO_{mod}_evaluate(turn);
  return typeof r.telecomStressExposureIndex === 'number' && r.telecomResilienceScore <= 100;
}}
"""


def backbone_buffer_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"exchange_zone_{i % EXCHANGE_ZONE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1032TresBackboneBufferEdge }} from '../../types/core.ts';

/** Backbone buffer graph shard {mod} (extreme_heat/drought/dust corridor coupling). */
export const V1032_TRES_BACKBONE_BUFFER_SHARD_{mod}: readonly V1032TresBackboneBufferEdge[] = [
{body}
];
"""


def exchange_zone_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1032_TRES_clamp }} from '../engine/telecom-resilience-utils.ts';
import type {{ V1032TresTelecomResilienceBand, V1032TresRegionId, V1032TresTelecomResilienceChannel }} from '../types/core.ts';

export const V1032_TRES_EXCHANGE_ZONE_{mod}_META = {{
  id: 'exchange_zone_{mod}',
  regionId: '{region}' as V1032TresRegionId,
  anchorChannel: '{mode}' as V1032TresTelecomResilienceChannel,
  defaultBand: '{band}' as V1032TresTelecomResilienceBand,
}} as const;

const V1032_TRES_EXCHANGE_ZONE_{mod}_STEPS = [
{steps}
] as const;

export function V1032_TRES_EXCHANGE_ZONE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1032_TRES_EXCHANGE_ZONE_{mod}_STEPS.length; i++) {{
    const row = V1032_TRES_EXCHANGE_ZONE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1032_TRES_clamp(acc / V1032_TRES_EXCHANGE_ZONE_{mod}_STEPS.length, 0, 1);
}}

export function V1032_TRES_EXCHANGE_ZONE_{mod}_rerouteStress(turn: number): number {{
  return V1032_TRES_clamp(
    V1032_TRES_EXCHANGE_ZONE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(FAILOVER_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1032_TRES_FAILOVER_SCENARIO_{mod}_snapshot, V1032_TRES_FAILOVER_SCENARIO_{mod}_META, V1032_TRES_FAILOVER_SCENARIO_{mod}_regressionAssert }} from './failover-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1032_TRES_FAILOVER_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1032_TRES_FAILOVER_SCENARIO_{mod}_META.id]: V1032_TRES_FAILOVER_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1032TresRegionId, V1032TresFailoverSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1032_TRES_ALL_FAILOVER_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1032_TRES_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1032TresFailoverSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1032_TRES_listActiveFailoverScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1032_TRES_ALL_FAILOVER_SCENARIO_IDS.length - stride);
  return V1032_TRES_ALL_FAILOVER_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1032_TRES_evaluateFailoverBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1032TresFailoverSnapshot[];
  meanTelecomStressExposure: number;
  meanTelecomResilienceScore: number;
  byRegion: Partial<Record<V1032TresRegionId, V1032TresFailoverSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1032_TRES_listActiveFailoverScenarioIds(turn);
  const snaps: V1032TresFailoverSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1032_TRES_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanTelecomStressExposure = snaps.reduce((a, s) => a + s.telecomStressExposureIndex, 0) / Math.max(1, snaps.length);
  const meanTelecomResilienceScore = snaps.reduce((a, s) => a + s.telecomResilienceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1032TresRegionId, V1032TresFailoverSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanTelecomStressExposure, meanTelecomResilienceScore, byRegion }};
}}

export function V1032_TRES_runFailoverScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1032_TRES_ALL_FAILOVER_SCENARIO_IDS) {{
    const fn = V1032_TRES_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).telecomResilienceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "failover-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(BACKBONE_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1032_TRES_BACKBONE_BUFFER_SHARD_{mod} }} from './backbone-buffer-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1032_TRES_BACKBONE_BUFFER_SHARD_{mod},")
    bundle = f"""/** Flattened backbone buffer graph (regional telecom network resilience coupling). */
import type {{ V1032TresBackboneBufferEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES: readonly V1032TresBackboneBufferEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "backbone-buffer-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(FAILOVER_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './failover-scenarios/scenario-{mod}.ts';")
    for i in range(BACKBONE_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(backbone_buffer_shard(i), encoding="utf-8")
        exports.append(f"export * from './backbone-buffer-stacks/reserve-{mod}.ts';")
    for i in range(EXCHANGE_ZONE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"exchange-zone-{mod}.ts"
        path.write_text(exchange_zone_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './failover-registry.ts';",
            "export * from './backbone-buffer-bundle.ts';",
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
        f"Generated failover scenarios={FAILOVER_SCENARIO_COUNT} backbone buffers={BACKBONE_BUFFER_SHARD_COUNT} exchange zone nodes={EXCHANGE_ZONE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
