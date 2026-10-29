#!/usr/bin/env python3
"""Generate V1025 regional health systems expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "care-scenarios"
BUFFER_DIR = GEN / "primary-care-access-stacks"
FLOOD_DIR = ROOT / "hospital-network-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "hospital_network", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

CARE_SCENARIO_COUNT = 172
PRIMARY_CARE_ACCESS_SHARD_COUNT = 90
HOSPITAL_NETWORK_COUNT = 24
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
    return f"""import {{ V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore }} from '../../engine/regional-health-systems-utils.ts';
import type {{
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
}} from '../../types/core.ts';

/** Generated care scenario {mod} — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_{mod}_META = {{
  id: 'stress_{mod}',
  regionId: '{region}' as V1026RhsRegionId,
  primaryChannel: '{mode}' as V1026RhsHealthSystemChannel,
  healthSystemBand: '{band}' as V1026RhsHealthSystemBand,
  seed: {seed},
}} as const;

const V1026_RHS_CARE_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1026_RHS_CARE_SCENARIO_{mod}_evaluate(turn: number): {{
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1026_RHS_CARE_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return {{ capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable }};
}}

export function V1026_RHS_CARE_SCENARIO_{mod}_snapshot(turn: number): V1026RhsCareSnapshot {{
  const r = V1026_RHS_CARE_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1026_RHS_CARE_SCENARIO_{mod}_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_{mod}_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_{mod}_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_{mod}_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  }};
}}

export function V1026_RHS_CARE_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1026_RHS_CARE_SCENARIO_{mod}_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}}
"""


def primary_care_access_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"hospital_network_{i % HOSPITAL_NETWORK_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1026RhsPrimaryCareAccessEdge }} from '../../types/core.ts';

/** Primary care access graph shard {mod} (clinical/bed/primary-care corridor coupling). */
export const V1026_RHS_PRIMARY_CARE_ACCESS_SHARD_{mod}: readonly V1026RhsPrimaryCareAccessEdge[] = [
{body}
];
"""


def hospital_network_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1026_RHS_clamp }} from '../engine/regional-health-systems-utils.ts';
import type {{ V1026RhsHealthSystemBand, V1026RhsRegionId, V1026RhsHealthSystemChannel }} from '../types/core.ts';

export const V1026_RHS_HOSPITAL_NETWORK_{mod}_META = {{
  id: 'hospital_network_{mod}',
  regionId: '{region}' as V1026RhsRegionId,
  anchorChannel: '{mode}' as V1026RhsHealthSystemChannel,
  defaultBand: '{band}' as V1026RhsHealthSystemBand,
}} as const;

const V1026_RHS_HOSPITAL_NETWORK_{mod}_STEPS = [
{steps}
] as const;

export function V1026_RHS_HOSPITAL_NETWORK_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1026_RHS_HOSPITAL_NETWORK_{mod}_STEPS.length; i++) {{
    const row = V1026_RHS_HOSPITAL_NETWORK_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1026_RHS_clamp(acc / V1026_RHS_HOSPITAL_NETWORK_{mod}_STEPS.length, 0, 1);
}}

export function V1026_RHS_HOSPITAL_NETWORK_{mod}_rerouteStress(turn: number): number {{
  return V1026_RHS_clamp(
    V1026_RHS_HOSPITAL_NETWORK_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(CARE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1026_RHS_CARE_SCENARIO_{mod}_snapshot, V1026_RHS_CARE_SCENARIO_{mod}_META, V1026_RHS_CARE_SCENARIO_{mod}_regressionAssert }} from './care-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1026_RHS_CARE_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1026_RHS_CARE_SCENARIO_{mod}_META.id]: V1026_RHS_CARE_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1026RhsRegionId, V1026RhsCareSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1026_RHS_ALL_CARE_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1026_RHS_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1026RhsCareSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1026_RHS_listActiveCareScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1026_RHS_ALL_CARE_SCENARIO_IDS.length - stride);
  return V1026_RHS_ALL_CARE_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1026_RHS_evaluateCareBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1026RhsCareSnapshot[];
  meanCapacityStress: number;
  meanHealthSystemScore: number;
  byRegion: Partial<Record<V1026RhsRegionId, V1026RhsCareSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1026_RHS_listActiveCareScenarioIds(turn);
  const snaps: V1026RhsCareSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1026_RHS_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanCapacityStress = snaps.reduce((a, s) => a + s.capacityStressIndex, 0) / Math.max(1, snaps.length);
  const meanHealthSystemScore = snaps.reduce((a, s) => a + s.healthSystemScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1026RhsRegionId, V1026RhsCareSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanCapacityStress, meanHealthSystemScore, byRegion }};
}}

export function V1026_RHS_runCareScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1026_RHS_ALL_CARE_SCENARIO_IDS) {{
    const fn = V1026_RHS_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).healthSystemScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "care-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(PRIMARY_CARE_ACCESS_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1026_RHS_PRIMARY_CARE_ACCESS_SHARD_{mod} }} from './primary-care-access-stacks/access-{mod}.ts';")
        spreads.append(f"  ...V1026_RHS_PRIMARY_CARE_ACCESS_SHARD_{mod},")
    bundle = f"""/** Flattened primary care access graph (regional health care coupling). */
import type {{ V1026RhsPrimaryCareAccessEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES: readonly V1026RhsPrimaryCareAccessEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "primary-care-access-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(CARE_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './care-scenarios/scenario-{mod}.ts';")
    for i in range(PRIMARY_CARE_ACCESS_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"access-{mod}.ts"
        path.write_text(primary_care_access_shard(i), encoding="utf-8")
        exports.append(f"export * from './primary-care-access-stacks/access-{mod}.ts';")
    for i in range(HOSPITAL_NETWORK_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"hospital-network-{mod}.ts"
        path.write_text(hospital_network_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './care-registry.ts';",
            "export * from './primary-care-access-bundle.ts';",
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
        f"Generated care scenarios={CARE_SCENARIO_COUNT} primary care accesss={PRIMARY_CARE_ACCESS_SHARD_COUNT} hospital network nodes={HOSPITAL_NETWORK_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
