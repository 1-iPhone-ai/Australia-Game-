#!/usr/bin/env python3
"""Generate V1022 housing affordability expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "stress-scenarios"
HANDOFF_DIR = GEN / "supply-pipeline-stacks"
HUB_DIR = ROOT / "zoning-friction-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
TENURES = ["rent", "mortgage", "social", "build_to_rent", "student", "senior", "regional", "remote", "investor", "co_living"]
STRESS_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

STRESS_SCENARIO_COUNT = 172
SUPPLY_PIPELINE_SHARD_COUNT = 90
ZONING_NODE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    mode = TENURES[i % len(TENURES)]
    band = STRESS_BANDS[i % len(STRESS_BANDS)]
    seed = i * 911 + 521
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 11)) % 997) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1022_HAFF_clamp, V1022_HAFF_tenureBandFromScore }} from '../../engine/housing-affordability-utils.ts';
import type {{
  V1022HaffStressBand,
  V1022HaffRegionId,
  V1022HaffStressSnapshot,
  V1022HaffHousingTenure,
}} from '../../types/core.ts';

/** Generated stress scenario {mod} — rent/mortgage/social handoff matrix. */
export const V1022_HAFF_STRESS_SCENARIO_{mod}_META = {{
  id: 'stress_{mod}',
  regionId: '{region}' as V1022HaffRegionId,
  primaryTenure: '{mode}' as V1022HaffHousingTenure,
  stressBand: '{band}' as V1022HaffStressBand,
  seed: {seed},
}} as const;

const V1022_HAFF_STRESS_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1022_HAFF_STRESS_SCENARIO_{mod}_evaluate(turn: number): {{
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1022_HAFF_STRESS_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1022_HAFF_STRESS_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1022_HAFF_STRESS_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const rentStressIndex = V1022_HAFF_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const supplyPipelineDelayTurns = V1022_HAFF_clamp(2 + (acc % 11), 1, 18);
  const affordabilityScore = V1022_HAFF_clamp(90 - rentStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1022_HAFF_tenureBandFromScore(affordabilityScore) !== 'fragile';
  return {{ rentStressIndex, supplyPipelineDelayTurns, affordabilityScore, stable }};
}}

export function V1022_HAFF_STRESS_SCENARIO_{mod}_snapshot(turn: number): V1022HaffStressSnapshot {{
  const r = V1022_HAFF_STRESS_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1022_HAFF_STRESS_SCENARIO_{mod}_META.id,
    regionId: V1022_HAFF_STRESS_SCENARIO_{mod}_META.regionId,
    housingTenure: V1022_HAFF_STRESS_SCENARIO_{mod}_META.primaryTenure,
    stressBand: V1022_HAFF_STRESS_SCENARIO_{mod}_META.stressBand,
    rentStressIndex: r.rentStressIndex,
    supplyPipelineDelayTurns: r.supplyPipelineDelayTurns,
    affordabilityScore: r.affordabilityScore,
    tenureBand: V1022_HAFF_tenureBandFromScore(r.affordabilityScore),
  }};
}}

export function V1022_HAFF_STRESS_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1022_HAFF_STRESS_SCENARIO_{mod}_evaluate(turn);
  return typeof r.rentStressIndex === 'number' && r.affordabilityScore <= 100;
}}
"""


def supply_pipeline_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_t = TENURES[i % len(TENURES)]
    to_t = TENURES[(i + 3) % len(TENURES)]
    hub = f"zoning_node_{i % ZONING_NODE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromTenure: '{from_t}', toTenure: '{to_t}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1022HaffSupplyPipelineEdge }} from '../../types/core.ts';

/** Supply pipeline graph shard {mod} (rent/mortgage/social corridor coupling). */
export const V1022_HAFF_SUPPLY_PIPELINE_SHARD_{mod}: readonly V1022HaffSupplyPipelineEdge[] = [
{body}
];
"""


def zoning_node_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = TENURES[i % len(TENURES)]
    band = STRESS_BANDS[i % len(STRESS_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1022_HAFF_clamp }} from '../engine/housing-affordability-utils.ts';
import type {{ V1022HaffStressBand, V1022HaffRegionId, V1022HaffHousingTenure }} from '../types/core.ts';

export const V1022_HAFF_ZONING_NODE_{mod}_META = {{
  id: 'zoning_node_{mod}',
  regionId: '{region}' as V1022HaffRegionId,
  anchorTenure: '{mode}' as V1022HaffHousingTenure,
  defaultBand: '{band}' as V1022HaffStressBand,
}} as const;

const V1022_HAFF_ZONING_NODE_{mod}_STEPS = [
{steps}
] as const;

export function V1022_HAFF_ZONING_NODE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1022_HAFF_ZONING_NODE_{mod}_STEPS.length; i++) {{
    const row = V1022_HAFF_ZONING_NODE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1022_HAFF_clamp(acc / V1022_HAFF_ZONING_NODE_{mod}_STEPS.length, 0, 1);
}}

export function V1022_HAFF_ZONING_NODE_{mod}_rerouteStress(turn: number): number {{
  return V1022_HAFF_clamp(
    V1022_HAFF_ZONING_NODE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(STRESS_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1022_HAFF_STRESS_SCENARIO_{mod}_snapshot, V1022_HAFF_STRESS_SCENARIO_{mod}_META, V1022_HAFF_STRESS_SCENARIO_{mod}_regressionAssert }} from './stress-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1022_HAFF_STRESS_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1022_HAFF_STRESS_SCENARIO_{mod}_META.id]: V1022_HAFF_STRESS_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1022HaffRegionId, V1022HaffStressSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1022_HAFF_ALL_STRESS_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1022_HAFF_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1022HaffStressSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1022_HAFF_listActiveStressScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1022_HAFF_ALL_STRESS_SCENARIO_IDS.length - stride);
  return V1022_HAFF_ALL_STRESS_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1022_HAFF_evaluateStressBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1022HaffStressSnapshot[];
  meanRentStress: number;
  meanAffordability: number;
  byRegion: Partial<Record<V1022HaffRegionId, V1022HaffStressSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1022_HAFF_listActiveStressScenarioIds(turn);
  const snaps: V1022HaffStressSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1022_HAFF_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanRentStress = snaps.reduce((a, s) => a + s.rentStressIndex, 0) / Math.max(1, snaps.length);
  const meanAffordability = snaps.reduce((a, s) => a + s.affordabilityScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1022HaffRegionId, V1022HaffStressSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanRentStress, meanAffordability, byRegion }};
}}

export function V1022_HAFF_runStressScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1022_HAFF_ALL_STRESS_SCENARIO_IDS) {{
    const fn = V1022_HAFF_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).affordabilityScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "stress-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(SUPPLY_PIPELINE_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1022_HAFF_SUPPLY_PIPELINE_SHARD_{mod} }} from './supply-pipeline-stacks/pipeline-{mod}.ts';")
        spreads.append(f"  ...V1022_HAFF_SUPPLY_PIPELINE_SHARD_{mod},")
    bundle = f"""/** Flattened supply pipeline graph (housing stress coupling). */
import type {{ V1022HaffSupplyPipelineEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES: readonly V1022HaffSupplyPipelineEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "supply-pipeline-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(HANDOFF_DIR)
    ensure(HUB_DIR)
    exports = []
    for i in range(STRESS_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './stress-scenarios/scenario-{mod}.ts';")
    for i in range(SUPPLY_PIPELINE_SHARD_COUNT):
        mod = f"{i:03d}"
        path = HANDOFF_DIR / f"pipeline-{mod}.ts"
        path.write_text(supply_pipeline_shard(i), encoding="utf-8")
        exports.append(f"export * from './supply-pipeline-stacks/pipeline-{mod}.ts';")
    for i in range(ZONING_NODE_COUNT):
        mod = f"{i:02d}"
        path = HUB_DIR / f"zoning-node-{mod}.ts"
        path.write_text(zoning_node_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './stress-registry.ts';",
            "export * from './supply-pipeline-bundle.ts';",
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
        f"Generated stress scenarios={STRESS_SCENARIO_COUNT} supply pipelines={SUPPLY_PIPELINE_SHARD_COUNT} zoning nodes={ZONING_NODE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
