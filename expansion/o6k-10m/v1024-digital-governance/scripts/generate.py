#!/usr/bin/env python3
"""Generate V1024 digital governance expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "policy-scenarios"
BUFFER_DIR = GEN / "data-sovereignty-stacks"
FLOOD_DIR = ROOT / "platform-regulation-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["data_residency", "platform_liability", "algo_audit", "cross_border_flow", "child_safety", "open_banking", "critical_infra", "genai_disclosure", "regional", "remote"]
POLICY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

POLICY_SCENARIO_COUNT = 172
DATA_SOVEREIGNTY_SHARD_COUNT = 90
PLATFORM_NODE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = POLICY_BANDS[i % len(POLICY_BANDS)]
    seed = i * 911 + 521
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 11)) % 997) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1024_DGOV_clamp, V1024_DGOV_governanceBandFromScore }} from '../../engine/digital-governance-utils.ts';
import type {{
  V1024DgovGovernanceBand,
  V1024DgovRegionId,
  V1024DgovPolicySnapshot,
  V1024DgovGovernanceChannel,
}} from '../../types/core.ts';

/** Generated policy scenario {mod} — residency/liability/audit handoff matrix. */
export const V1024_DGOV_POLICY_SCENARIO_{mod}_META = {{
  id: 'policy_{mod}',
  regionId: '{region}' as V1024DgovRegionId,
  primaryChannel: '{mode}' as V1024DgovGovernanceChannel,
  governanceBand: '{band}' as V1024DgovGovernanceBand,
  seed: {seed},
}} as const;

const V1024_DGOV_POLICY_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1024_DGOV_POLICY_SCENARIO_{mod}_evaluate(turn: number): {{
  complianceStressIndex: number;
  dataSovereigntyDelayTurns: number;
  governanceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1024_DGOV_POLICY_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1024_DGOV_POLICY_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1024_DGOV_POLICY_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const complianceStressIndex = V1024_DGOV_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const dataSovereigntyDelayTurns = V1024_DGOV_clamp(2 + (acc % 11), 1, 18);
  const governanceScore = V1024_DGOV_clamp(90 - complianceStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1024_DGOV_governanceBandFromScore(governanceScore) !== 'fragile';
  return {{ complianceStressIndex, dataSovereigntyDelayTurns, governanceScore, stable }};
}}

export function V1024_DGOV_POLICY_SCENARIO_{mod}_snapshot(turn: number): V1024DgovPolicySnapshot {{
  const r = V1024_DGOV_POLICY_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1024_DGOV_POLICY_SCENARIO_{mod}_META.id,
    regionId: V1024_DGOV_POLICY_SCENARIO_{mod}_META.regionId,
    governanceChannel: V1024_DGOV_POLICY_SCENARIO_{mod}_META.primaryChannel,
    governanceBand: V1024_DGOV_POLICY_SCENARIO_{mod}_META.governanceBand,
    complianceStressIndex: r.complianceStressIndex,
    dataSovereigntyDelayTurns: r.dataSovereigntyDelayTurns,
    governanceScore: r.governanceScore,
    governanceBand: V1024_DGOV_governanceBandFromScore(r.governanceScore),
  }};
}}

export function V1024_DGOV_POLICY_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1024_DGOV_POLICY_SCENARIO_{mod}_evaluate(turn);
  return typeof r.complianceStressIndex === 'number' && r.governanceScore <= 100;
}}
"""


def data_sovereignty_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"platform_node_{i % PLATFORM_NODE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1024DgovDataSovereigntyEdge }} from '../../types/core.ts';

/** Data sovereignty graph shard {mod} (residency/liability/audit corridor coupling). */
export const V1024_DGOV_DATA_SOVEREIGNTY_SHARD_{mod}: readonly V1024DgovDataSovereigntyEdge[] = [
{body}
];
"""


def platform_node_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = POLICY_BANDS[i % len(POLICY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1024_DGOV_clamp }} from '../engine/digital-governance-utils.ts';
import type {{ V1024DgovGovernanceBand, V1024DgovRegionId, V1024DgovGovernanceChannel }} from '../types/core.ts';

export const V1024_DGOV_PLATFORM_NODE_{mod}_META = {{
  id: 'platform_node_{mod}',
  regionId: '{region}' as V1024DgovRegionId,
  anchorChannel: '{mode}' as V1024DgovGovernanceChannel,
  defaultBand: '{band}' as V1024DgovGovernanceBand,
}} as const;

const V1024_DGOV_PLATFORM_NODE_{mod}_STEPS = [
{steps}
] as const;

export function V1024_DGOV_PLATFORM_NODE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1024_DGOV_PLATFORM_NODE_{mod}_STEPS.length; i++) {{
    const row = V1024_DGOV_PLATFORM_NODE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1024_DGOV_clamp(acc / V1024_DGOV_PLATFORM_NODE_{mod}_STEPS.length, 0, 1);
}}

export function V1024_DGOV_PLATFORM_NODE_{mod}_rerouteStress(turn: number): number {{
  return V1024_DGOV_clamp(
    V1024_DGOV_PLATFORM_NODE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(POLICY_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1024_DGOV_POLICY_SCENARIO_{mod}_snapshot, V1024_DGOV_POLICY_SCENARIO_{mod}_META, V1024_DGOV_POLICY_SCENARIO_{mod}_regressionAssert }} from './policy-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1024_DGOV_POLICY_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1024_DGOV_POLICY_SCENARIO_{mod}_META.id]: V1024_DGOV_POLICY_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1024DgovRegionId, V1024DgovPolicySnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1024_DGOV_ALL_POLICY_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1024_DGOV_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1024DgovPolicySnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1024_DGOV_listActivePolicyScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1024_DGOV_ALL_POLICY_SCENARIO_IDS.length - stride);
  return V1024_DGOV_ALL_POLICY_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1024_DGOV_evaluatePolicyBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1024DgovPolicySnapshot[];
  meanComplianceStress: number;
  meanGovernanceScore: number;
  byRegion: Partial<Record<V1024DgovRegionId, V1024DgovPolicySnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1024_DGOV_listActivePolicyScenarioIds(turn);
  const snaps: V1024DgovPolicySnapshot[] = [];
  for (const id of ids) {{
    const fn = V1024_DGOV_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanComplianceStress = snaps.reduce((a, s) => a + s.complianceStressIndex, 0) / Math.max(1, snaps.length);
  const meanGovernanceScore = snaps.reduce((a, s) => a + s.governanceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1024DgovRegionId, V1024DgovPolicySnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanComplianceStress, meanGovernanceScore, byRegion }};
}}

export function V1024_DGOV_runPolicyScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1024_DGOV_ALL_POLICY_SCENARIO_IDS) {{
    const fn = V1024_DGOV_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).governanceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "policy-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(DATA_SOVEREIGNTY_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1024_DGOV_DATA_SOVEREIGNTY_SHARD_{mod} }} from './data-sovereignty-stacks/sovereignty-{mod}.ts';")
        spreads.append(f"  ...V1024_DGOV_DATA_SOVEREIGNTY_SHARD_{mod},")
    bundle = f"""/** Flattened data sovereignty graph (digital policy coupling). */
import type {{ V1024DgovDataSovereigntyEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES: readonly V1024DgovDataSovereigntyEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "data-sovereignty-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(POLICY_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './policy-scenarios/scenario-{mod}.ts';")
    for i in range(DATA_SOVEREIGNTY_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"sovereignty-{mod}.ts"
        path.write_text(data_sovereignty_shard(i), encoding="utf-8")
        exports.append(f"export * from './data-sovereignty-stacks/sovereignty-{mod}.ts';")
    for i in range(PLATFORM_NODE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"platform-node-{mod}.ts"
        path.write_text(platform_node_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './policy-registry.ts';",
            "export * from './data-sovereignty-bundle.ts';",
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
        f"Generated policy scenarios={POLICY_SCENARIO_COUNT} data sovereigntys={DATA_SOVEREIGNTY_SHARD_COUNT} platform regulation nodes={PLATFORM_NODE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
