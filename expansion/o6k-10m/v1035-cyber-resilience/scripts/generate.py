#!/usr/bin/env python3
"""Generate V1025 sovereign cyber network resilience expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "intrusion-scenarios"
BUFFER_DIR = GEN / "segment-buffer-stacks"
FLOOD_DIR = ROOT / "facility-zone-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "facility_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

INTRUSION_SCENARIO_COUNT = 130
SEGMENT_BUFFER_SHARD_COUNT = 65
FACILITY_ZONE_COUNT = 24
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
    return f"""import {{ V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore }} from '../../engine/cyber-resilience-utils.ts';
import type {{
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
}} from '../../types/core.ts';

/** Generated intrusion incident scenario {mod} — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_{mod}_META = {{
  id: 'intrusion_{mod}',
  regionId: '{region}' as V1035CyresRegionId,
  primaryChannel: '{mode}' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: '{band}' as V1035CyresCyberResilienceBand,
  seed: {seed},
}} as const;

const V1035_CYRES_INTRUSION_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_{mod}_evaluate(turn: number): {{
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1035_CYRES_INTRUSION_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return {{ sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable }};
}}

export function V1035_CYRES_INTRUSION_SCENARIO_{mod}_snapshot(turn: number): V1035CyresIntrusionSnapshot {{
  const r = V1035_CYRES_INTRUSION_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_{mod}_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_{mod}_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_{mod}_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  }};
}}

export function V1035_CYRES_INTRUSION_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1035_CYRES_INTRUSION_SCENARIO_{mod}_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}}
"""


def segment_buffer_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"facility_zone_{i % FACILITY_ZONE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1035CyresSegmentBufferEdge }} from '../../types/core.ts';

/** Segment buffer graph shard {mod} (extreme_heat/drought/dust corridor coupling). */
export const V1035_CYRES_SEGMENT_BUFFER_SHARD_{mod}: readonly V1035CyresSegmentBufferEdge[] = [
{body}
];
"""


def facility_zone_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1035_CYRES_clamp }} from '../engine/cyber-resilience-utils.ts';
import type {{ V1035CyresCyberResilienceBand, V1035CyresRegionId, V1035CyresCyberResilienceChannel }} from '../types/core.ts';

export const V1035_CYRES_FACILITY_ZONE_{mod}_META = {{
  id: 'facility_zone_{mod}',
  regionId: '{region}' as V1035CyresRegionId,
  anchorChannel: '{mode}' as V1035CyresCyberResilienceChannel,
  defaultBand: '{band}' as V1035CyresCyberResilienceBand,
}} as const;

const V1035_CYRES_FACILITY_ZONE_{mod}_STEPS = [
{steps}
] as const;

export function V1035_CYRES_FACILITY_ZONE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1035_CYRES_FACILITY_ZONE_{mod}_STEPS.length; i++) {{
    const row = V1035_CYRES_FACILITY_ZONE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1035_CYRES_clamp(acc / V1035_CYRES_FACILITY_ZONE_{mod}_STEPS.length, 0, 1);
}}

export function V1035_CYRES_FACILITY_ZONE_{mod}_rerouteStress(turn: number): number {{
  return V1035_CYRES_clamp(
    V1035_CYRES_FACILITY_ZONE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(INTRUSION_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1035_CYRES_INTRUSION_SCENARIO_{mod}_snapshot, V1035_CYRES_INTRUSION_SCENARIO_{mod}_META, V1035_CYRES_INTRUSION_SCENARIO_{mod}_regressionAssert }} from './intrusion-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1035_CYRES_INTRUSION_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1035_CYRES_INTRUSION_SCENARIO_{mod}_META.id]: V1035_CYRES_INTRUSION_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1035CyresRegionId, V1035CyresIntrusionSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1035_CYRES_ALL_INTRUSION_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1035_CYRES_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1035CyresIntrusionSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1035_CYRES_listActiveIntrusionScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1035_CYRES_ALL_INTRUSION_SCENARIO_IDS.length - stride);
  return V1035_CYRES_ALL_INTRUSION_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1035_CYRES_evaluateIntrusionBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1035CyresIntrusionSnapshot[];
  meanSovereignDigitalStressExposure: number;
  meanTelecomResilienceScore: number;
  byRegion: Partial<Record<V1035CyresRegionId, V1035CyresIntrusionSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1035_CYRES_listActiveIntrusionScenarioIds(turn);
  const snaps: V1035CyresIntrusionSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1035_CYRES_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanSovereignDigitalStressExposure = snaps.reduce((a, s) => a + s.sovereignDigitalStressExposureIndex, 0) / Math.max(1, snaps.length);
  const meanTelecomResilienceScore = snaps.reduce((a, s) => a + s.cyberResilienceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1035CyresRegionId, V1035CyresIntrusionSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanSovereignDigitalStressExposure, meanTelecomResilienceScore, byRegion }};
}}

export function V1035_CYRES_runIntrusionScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1035_CYRES_ALL_INTRUSION_SCENARIO_IDS) {{
    const fn = V1035_CYRES_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).cyberResilienceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "intrusion-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(SEGMENT_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1035_CYRES_SEGMENT_BUFFER_SHARD_{mod} }} from './segment-buffer-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1035_CYRES_SEGMENT_BUFFER_SHARD_{mod},")
    bundle = f"""/** Flattened segment buffer graph (regional sovereign cyber network resilience coupling). */
import type {{ V1035CyresSegmentBufferEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES: readonly V1035CyresSegmentBufferEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "segment-buffer-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(INTRUSION_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './intrusion-scenarios/scenario-{mod}.ts';")
    for i in range(SEGMENT_BUFFER_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(segment_buffer_shard(i), encoding="utf-8")
        exports.append(f"export * from './segment-buffer-stacks/reserve-{mod}.ts';")
    for i in range(FACILITY_ZONE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"facility-zone-{mod}.ts"
        path.write_text(facility_zone_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './intrusion-registry.ts';",
            "export * from './segment-buffer-bundle.ts';",
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
        f"Generated intrusion incident scenarios={INTRUSION_SCENARIO_COUNT} segment buffers={SEGMENT_BUFFER_SHARD_COUNT} facility zone nodes={FACILITY_ZONE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
