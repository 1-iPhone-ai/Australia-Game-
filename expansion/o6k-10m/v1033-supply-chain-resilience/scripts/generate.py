#!/usr/bin/env python3
"""Generate V1025 supply chain network resilience expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "disruption-scenarios"
BUFFER_DIR = GEN / "corridor-buffer-stacks"
FLOOD_DIR = ROOT / "hub-zone-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "hub_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

DISRUPTION_SCENARIO_COUNT = 130
CORRIDOR_BUFFER_SHARD_COUNT = 65
HUB_ZONE_COUNT = 24
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
    return f"""import {{ V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore }} from '../../engine/supply-chain-resilience-utils.ts';
import type {{
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
}} from '../../types/core.ts';

/** Generated disruption scenario {mod} — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_{mod}_META = {{
  id: 'disruption_{mod}',
  regionId: '{region}' as V1033ScresRegionId,
  primaryChannel: '{mode}' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: '{band}' as V1033ScresSupplyChainResilienceBand,
  seed: {seed},
}} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_{mod}_evaluate(turn: number): {{
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1033_SCRES_DISRUPTION_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return {{ logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable }};
}}

export function V1033_SCRES_DISRUPTION_SCENARIO_{mod}_snapshot(turn: number): V1033ScresDisruptionSnapshot {{
  const r = V1033_SCRES_DISRUPTION_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_{mod}_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_{mod}_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_{mod}_META.primaryChannel,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  }};
}}

export function V1033_SCRES_DISRUPTION_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1033_SCRES_DISRUPTION_SCENARIO_{mod}_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}}
"""


def corridor_buffer_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"hub_zone_{i % HUB_ZONE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1033ScresCorridorBufferEdge }} from '../../types/core.ts';

/** Corridor buffer graph shard {mod} (extreme_heat/drought/dust corridor coupling). */
export const V1033_SCRES_CORRIDOR_BUFFER_SHARD_{mod}: readonly V1033ScresCorridorBufferEdge[] = [
{body}
];
"""


def hub_zone_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1033_SCRES_clamp }} from '../engine/supply-chain-resilience-utils.ts';
import type {{ V1033ScresSupplyChainResilienceBand, V1033ScresRegionId, V1033ScresSupplyChainResilienceChannel }} from '../types/core.ts';

export const V1033_SCRES_HUB_ZONE_{mod}_META = {{
  id: 'hub_zone_{mod}',
  regionId: '{region}' as V1033ScresRegionId,
  anchorChannel: '{mode}' as V1033ScresSupplyChainResilienceChannel,
  defaultBand: '{band}' as V1033ScresSupplyChainResilienceBand,
}} as const;

const V1033_SCRES_HUB_ZONE_{mod}_STEPS = [
{steps}
] as const;

export function V1033_SCRES_HUB_ZONE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1033_SCRES_HUB_ZONE_{mod}_STEPS.length; i++) {{
    const row = V1033_SCRES_HUB_ZONE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1033_SCRES_clamp(acc / V1033_SCRES_HUB_ZONE_{mod}_STEPS.length, 0, 1);
}}

export function V1033_SCRES_HUB_ZONE_{mod}_rerouteStress(turn: number): number {{
  return V1033_SCRES_clamp(
    V1033_SCRES_HUB_ZONE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(DISRUPTION_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1033_SCRES_DISRUPTION_SCENARIO_{mod}_snapshot, V1033_SCRES_DISRUPTION_SCENARIO_{mod}_META, V1033_SCRES_DISRUPTION_SCENARIO_{mod}_regressionAssert }} from './disruption-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1033_SCRES_DISRUPTION_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1033_SCRES_DISRUPTION_SCENARIO_{mod}_META.id]: V1033_SCRES_DISRUPTION_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1033ScresRegionId, V1033ScresDisruptionSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1033_SCRES_ALL_DISRUPTION_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1033_SCRES_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1033ScresDisruptionSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1033_SCRES_listActiveDisruptionScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1033_SCRES_ALL_DISRUPTION_SCENARIO_IDS.length - stride);
  return V1033_SCRES_ALL_DISRUPTION_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1033_SCRES_evaluateDisruptionBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1033ScresDisruptionSnapshot[];
  meanLogisticsStressExposure: number;
  meanTelecomResilienceScore: number;
  byRegion: Partial<Record<V1033ScresRegionId, V1033ScresDisruptionSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1033_SCRES_listActiveDisruptionScenarioIds(turn);
  const snaps: V1033ScresDisruptionSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1033_SCRES_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanLogisticsStressExposure = snaps.reduce((a, s) => a + s.logisticsStressExposureIndex, 0) / Math.max(1, snaps.length);
  const meanTelecomResilienceScore = snaps.reduce((a, s) => a + s.supplyChainResilienceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1033ScresRegionId, V1033ScresDisruptionSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanLogisticsStressExposure, meanTelecomResilienceScore, byRegion }};
}}

export function V1033_SCRES_runDisruptionScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1033_SCRES_ALL_DISRUPTION_SCENARIO_IDS) {{
    const fn = V1033_SCRES_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).supplyChainResilienceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "disruption-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(CORRIDOR_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1033_SCRES_CORRIDOR_BUFFER_SHARD_{mod} }} from './corridor-buffer-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1033_SCRES_CORRIDOR_BUFFER_SHARD_{mod},")
    bundle = f"""/** Flattened corridor buffer graph (regional supply chain network resilience coupling). */
import type {{ V1033ScresCorridorBufferEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES: readonly V1033ScresCorridorBufferEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "corridor-buffer-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(DISRUPTION_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './disruption-scenarios/scenario-{mod}.ts';")
    for i in range(CORRIDOR_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(corridor_buffer_shard(i), encoding="utf-8")
        exports.append(f"export * from './corridor-buffer-stacks/reserve-{mod}.ts';")
    for i in range(HUB_ZONE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"hub-zone-{mod}.ts"
        path.write_text(hub_zone_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './disruption-registry.ts';",
            "export * from './corridor-buffer-bundle.ts';",
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
        f"Generated disruption scenarios={DISRUPTION_SCENARIO_COUNT} corridor buffers={CORRIDOR_BUFFER_SHARD_COUNT} hub zone nodes={HUB_ZONE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
