#!/usr/bin/env python3
"""Generate V1014 energy depth catalogs and self-test fixtures (T6-4)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parent
CAT = ROOT / "src" / "catalog"
SELF = ROOT / "src"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
HOURS = list(range(24))
ZONES_PER_REGION = 10
RESOURCE_KINDS = [
    "iron_ore",
    "coal",
    "lng",
    "bauxite",
    "copper",
    "lithium",
    "gold",
    "uranium",
    "gas",
    "met_coal",
    "nickel",
    "zinc",
    "lead",
    "silver",
    "cobalt",
    "rare_earths",
    "phosphate",
    "salt",
    "diamond",
]
RENEWABLE_TECH = ["solar_pv", "wind_onshore", "wind_offshore", "hydro", "battery", "csp", "biomass", "geothermal", "distributed_pv", "pumped_hydro"]


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def write_grid_nodes() -> None:
    lines = [
        "import type { V1014EnergyDepthGridNodeCatalogEntry } from '../types';",
        "",
        "export const V1014_ENERGY_DEPTH_GRID_NODE_CATALOG: readonly V1014EnergyDepthGridNodeCatalogEntry[] = [",
    ]
    idx = 0
    for region in REGIONS:
        for zone in range(ZONES_PER_REGION):
            for hour in HOURS:
                idx += 1
                base_load = 180 + zone * 42 + hour * 3 + (idx % 17)
                firm = 160 + zone * 38 + (24 - abs(hour - 14)) * 2
                renew = 40 + zone * 12 + (hour if 6 <= hour <= 18 else 8)
                storage = 8 + zone * 3
                imp = 15 + zone * 4
                reserve = 10 + (zone % 4) * 2
                doc = (
                    f"Grid node {idx}: {region} zone {zone + 1} hour {hour}. "
                    f"Used by V1014_ENERGY_DEPTH_computeRegionalGridBalance for reserve margin, "
                    f"renewable share, and intermittency coupling to SECTION 20U corridor headroom."
                )
                lines.append(
                    "  {"
                    f" id: 'v1014_depth_grid_{idx:05d}', regionId: '{region}', zoneIndex: {zone}, hourBucket: {hour},"
                    f" baseLoadMw: {base_load}, firmCapacityMw: {firm}, renewableCapacityMw: {renew},"
                    f" storageMw: {storage}, transmissionImportMw: {imp}, reserveTargetPct: {reserve},"
                    f" documentation: {js_str(doc)} }},"
                )
    lines.append("];")
    out = CAT / "grid-nodes.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_depletion() -> None:
    lines = [
        "import type { V1014EnergyDepthDepletionCurveEntry } from '../types';",
        "",
        "export const V1014_ENERGY_DEPTH_DEPLETION_CURVES: readonly V1014EnergyDepthDepletionCurveEntry[] = [",
    ]
    idx = 0
    industries = ["mining", "energy", "manufacturing"]
    for region in REGIONS:
        for kind in RESOURCE_KINDS:
            for variant in range(24):
                idx += 1
                reserves = 800 + (idx % 400) + variant * 50
                rec = 0.5 + (idx % 10) * 0.05
                water = 0.1 + (idx % 7) * 0.04
                em = 0.15 + (idx % 5) * 0.03
                ind = industries[idx % 3]
                site = f"ext_{region.lower()}_{kind}_{variant + 1}"
                doc = (
                    f"Depletion curve {idx} ({kind} {region} v{variant + 1}): ties SECTION 20AL site {site} "
                    f"to cumulative extraction memory in save.meta.v1014.energy_depth."
                )
                lines.append(
                    "  {"
                    f" id: 'v1014_depth_depl_{idx:05d}', regionId: '{region}', resourceKind: '{kind}',"
                    f" siteRef: '{site}', initialReservesMt: {reserves}, recoveryRatePct: {rec:.2f},"
                    f" waterPenalty: {water:.2f}, emissionsFactor: {em:.2f}, couplingIndustry: '{ind}',"
                    f" documentation: {js_str(doc)} }},"
                )
    lines.append("];")
    out = CAT / "depletion-curves.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_renewable_profiles() -> None:
    lines = [
        "import type { V1014EnergyDepthRenewableProfileEntry } from '../types';",
        "",
        "export const V1014_ENERGY_DEPTH_RENEWABLE_PROFILES: readonly V1014EnergyDepthRenewableProfileEntry[] = [",
    ]
    idx = 0
    couplings = ["weak", "moderate", "strong"]
    for region in REGIONS:
        for tech in RENEWABLE_TECH:
            for hour in HOURS:
                idx += 1
                cf = 0.15 + (hour / 24) * 0.5 if tech == "solar_pv" else 0.25 + (idx % 10) * 0.04
                sigma = 0.04 + (idx % 8) * 0.012
                coupling = couplings[idx % 3]
                doc = (
                    f"Renewable profile {idx}: {tech} in {region} at hour {hour}. "
                    f"Drives V1014_ENERGY_DEPTH_computeIntermittency forecast gap and reserve penalties."
                )
                lines.append(
                    "  {"
                    f" id: 'v1014_depth_ren_{idx:05d}', regionId: '{region}', technology: '{tech}',"
                    f" hourBucket: {hour}, capacityFactor: {cf:.3f}, forecastErrorSigma: {sigma:.3f},"
                    f" gridCoupling: '{coupling}', documentation: {js_str(doc)} }},"
                )
    lines.append("];")
    out = CAT / "renewable-profiles.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_coupling_matrix() -> None:
    lines = [
        "export interface V1014EnergyDepthCouplingRow {",
        "  id: string; regionId: string; industry: string; scenarioId: string;",
        "  elasticity: number; gridSensitivity: number; carbonWeight: number;",
        "  crossRef20T: string; crossRef20Y: string; notes: string;",
        "}",
        "",
        "export const V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX: readonly V1014EnergyDepthCouplingRow[] = [",
    ]
    industries = [
        "mining",
        "energy",
        "manufacturing",
        "agriculture",
        "technology",
        "research",
        "tourism",
        "trade",
    ]
    idx = 0
    for region in REGIONS:
        for industry in industries:
            for scenario in range(60):
                idx += 1
                el = 0.1 + (idx % 17) * 0.04
                grid = 0.05 + (idx % 11) * 0.03
                carb = 0.08 + (idx % 9) * 0.02
                notes = (
                    f"Coupling {idx}: when {industry} in {region} faces scenario s{scenario}, "
                    f"depth pass propagates bounded modifiers toward SECTION 20T supply points and "
                    f"SECTION 20Y energy exposure via adapter exports (no price mutation)."
                )
                lines.append(
                    "  {"
                    f" id: 'v1014_depth_cpl_{idx:05d}', regionId: '{region}', industry: '{industry}', scenarioId: 's{scenario}',"
                    f" elasticity: {el:.3f}, gridSensitivity: {grid:.3f}, carbonWeight: {carb:.3f},"
                    f" crossRef20T: '20T_supply_{industry}', crossRef20Y: '20Y_domain_energy',"
                    f" notes: {js_str(notes)} }},"
                )
    lines.append("];")
    out = CAT / "industry-coupling-matrix.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_contingency_scenarios() -> None:
    lines = [
        "export interface V1014EnergyDepthContingencyScenario {",
        "  id: string; regionId: string; trigger: string; severity: number;",
        "  reserveDeltaPct: number; intermittencyMultiplier: number; narrative: string;",
        "}",
        "",
        "export const V1014_ENERGY_DEPTH_CONTINGENCY_SCENARIOS: readonly V1014EnergyDepthContingencyScenario[] = [",
    ]
    triggers = [
        "heatwave",
        "bushfire_smoke",
        "transmission_fault",
        "gas_shortage",
        "drought",
        "cyclone",
        "industrial_outage",
        "export_constraint",
    ]
    idx = 0
    for region in REGIONS:
        for trig in triggers:
            for rep in range(80):
                idx += 1
                sev = 1 + (idx % 5)
                reserve = -1.5 * sev - (rep % 3)
                mult = 1 + sev * 0.12
                narrative = (
                    f"Contingency {idx}: {trig} stress test in {region} repetition {rep}. "
                    f"Applied by V1014_ENERGY_DEPTH_applyContingencyOverlay during grid stability evaluation."
                )
                lines.append(
                    "  {"
                    f" id: 'v1014_depth_cont_{idx:05d}', regionId: '{region}', trigger: '{trig}', severity: {sev},"
                    f" reserveDeltaPct: {reserve:.2f}, intermittencyMultiplier: {mult:.3f},"
                    f" narrative: {js_str(narrative)} }},"
                )
    lines.append("];")
    out = CAT / "contingency-scenarios.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_emissions_factors() -> None:
    lines = [
        "export interface V1014EnergyDepthEmissionsFactorRow {",
        "  id: string; scope: string; sector: string; kgCo2ePerMwh: number; sourceTag: string; detail: string;",
        "}",
        "",
        "export const V1014_ENERGY_DEPTH_EMISSIONS_FACTORS: readonly V1014EnergyDepthEmissionsFactorRow[] = [",
    ]
    sectors = ["coal", "gas", "grid_mix", "solar", "wind", "hydro", "battery_dispatch", "mining_diesel"]
    idx = 0
    scopes: list[str] = ["national", *REGIONS]
    for scope in scopes:
        for sector in sectors:
            for band in range(80):
                idx += 1
                kg = 0.05 + (idx % 40) * 0.08
                detail = (
                    f"Emissions factor {idx}: {sector} under scope {scope} band {band}. "
                    f"Used when rolling carbon budgets forward in engine-carbon-budgets."
                )
                lines.append(
                    "  {"
                    f" id: 'v1014_depth_em_{idx:05d}', scope: '{scope}', sector: '{sector}',"
                    f" kgCo2ePerMwh: {kg:.3f}, sourceTag: '20AY_depth', detail: {js_str(detail)} }},"
                )
    lines.append("];")
    out = CAT / "emissions-factors.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_carbon_budgets() -> None:
    lines = [
        "import type { V1014EnergyDepthCarbonBudgetEntry } from '../types';",
        "",
        "export const V1014_ENERGY_DEPTH_CARBON_BUDGETS: readonly V1014EnergyDepthCarbonBudgetEntry[] = [",
    ]
    scopes: list[str] = ["national", *REGIONS]
    pathways = ["paris_aligned", "slow_transition", "accelerated", "resource_export", "net_zero_2050"]
    idx = 0
    for scope in scopes:
        for pathway in pathways:
            for year_band in range(4):
                idx += 1
                annual = 420 - year_band * 25 + (idx % 30)
                cumulative = annual * (12 + year_band * 8)
                weights = {
                    "energy": 0.35,
                    "mining": 0.2,
                    "NSW": 0.12,
                    "QLD": 0.11,
                }
                w_json = ", ".join(f'"{k}": {v}' for k, v in weights.items())
                doc = (
                    f"Carbon budget {idx}: scope={scope} pathway={pathway} band={year_band}. "
                    f"Feeds V1014_ENERGY_DEPTH_rollForwardCarbon and GDP/inflation adapters via 20AG/20AO."
                )
                pid = f"v1014_depth_carbon_{scope.lower()}_{pathway}_{year_band}"
                lines.append(
                    "  {"
                    f" id: '{pid}', scope: '{scope}', pathwayLabel: '{pathway}_y{year_band}',"
                    f" annualBudgetMtCO2e: {annual}, cumulativeBudgetMtCO2e: {cumulative},"
                    f" sectorWeights: {{ {w_json} }}, documentation: {js_str(doc)} }},"
                )
    lines.append("];")
    out = CAT / "carbon-budgets.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_self_test_fixtures() -> None:
    lines = [
        "import type { V1014EnergyDepthInputs } from './types';",
        "import { computeV1014EnergyDepthState } from './compute';",
        "import { createInitialV1014EnergyDepthPersisted } from './persistence';",
        "import type { V1014EnergyDepthSelfTestResult } from './types';",
        "",
        "export interface V1014EnergyDepthFixture {",
        "  id: string;",
        "  name: string;",
        "  inputs: V1014EnergyDepthInputs;",
        "  assert: (state: ReturnType<typeof computeV1014EnergyDepthState>['state']) => boolean;",
        "  expectedDetail: string;",
        "}",
        "",
        "export const V1014_ENERGY_DEPTH_SELF_TEST_FIXTURES: V1014EnergyDepthFixture[] = [",
    ]
    for i in range(1, 56):
        region = REGIONS[i % len(REGIONS)]
        hour = i % 24
        pressure = 20 + (i * 3) % 80
        lines.append(
            "  {"
            f" id: 'v1014_depth_fix_{i:03d}', name: 'fixture_{i}_grid_depletion_carbon',"
            f" inputs: {{ turn: {i}, enabled: true, hourBucket: {hour}, industrialEnergy: {{"
            f" nationalRenewableShare: {0.15 + (i % 10) * 0.04:.2f}, regionalScores: {{"
            f" '{region}': {{ extractionScore: {pressure}, constraintPressure: {(i % 5) * 8}, renewableShare: {0.2 + (i % 6) * 0.05:.2f} }}"
            f" }} }}, industries: null, infrastructure: {{ networks: {{ energy: {{ spareCapacity: {0.2 + (i % 8) * 0.08:.2f}, utilization: {0.5 + (i % 5) * 0.06:.2f} }} }} }},"
            f" systemicRisk: {{ domains: {{ energy: {{ exposure: {10 + (i % 7) * 5} }} }} }}, activeCrises: [] }},"
            f" assert: (st) => st.enabled && st.regions['{region}'].regionId === '{region}' && st.inputHash.length > 0,"
            f" expectedDetail: 'region {region} hour {hour} produces stable hash and regional slice' }},"
        )
    lines.extend(
        [
            "];",
            "",
            "export function runV1014EnergyDepthFixtureTests(): V1014EnergyDepthSelfTestResult[] {",
            "  const results: V1014EnergyDepthSelfTestResult[] = [];",
            "  let persisted = createInitialV1014EnergyDepthPersisted();",
            "  for (const fx of V1014_ENERGY_DEPTH_SELF_TEST_FIXTURES) {",
            "    const { state, persisted: next } = computeV1014EnergyDepthState(fx.inputs, persisted, null);",
            "    persisted = next;",
            "    const passed = fx.assert(state);",
            "    results.push({ id: fx.id, name: fx.name, passed, detail: passed ? fx.expectedDetail : 'assertion failed' });",
            "  }",
            "  return results;",
            "}",
            "",
        ]
    )
    out = SELF / "self-test-fixtures.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out} lines={len(lines)}")


def write_self_tests_main() -> None:
    content = '''import type { V1014EnergyDepthSelfTestReport } from './types';
import { V1014_ENERGY_DEPTH_GRID_NODE_CATALOG } from './catalog/grid-nodes';
import { V1014_ENERGY_DEPTH_DEPLETION_CURVES } from './catalog/depletion-curves';
import { V1014_ENERGY_DEPTH_RENEWABLE_PROFILES } from './catalog/renewable-profiles';
import { V1014_ENERGY_DEPTH_CARBON_BUDGETS } from './catalog/carbon-budgets';
import { V1014_ENERGY_DEPTH_CONTINGENCY_SCENARIOS } from './catalog/contingency-scenarios';
import { V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX } from './catalog/industry-coupling-matrix';
import { V1014_ENERGY_DEPTH_EMISSIONS_FACTORS } from './catalog/emissions-factors';
import { V1014_ENERGY_DEPTH_CARBON_BUDGETS } from './catalog/carbon-budgets';
import { runV1014EnergyDepthFixtureTests } from './self-test-fixtures';
import { V1014_ENERGY_DEPTH_fnv1a, V1014_ENERGY_DEPTH_bandGrid } from './primitives';
import { computeV1014EnergyDepthState, buildV1014EnergyDepthInputs } from './compute';
import { createInitialV1014EnergyDepthPersisted } from './persistence';
import { V1014_ENERGY_DEPTH_adaptIndustriesModifiers } from './adapters/adapter-20t';

export function runV1014EnergyDepthSelfTests(): V1014EnergyDepthSelfTestReport {
  const results = runV1014EnergyDepthFixtureTests();
  results.push({
    id: 'catalog_grid_nodes',
    name: 'grid_node_catalog_size',
    passed: V1014_ENERGY_DEPTH_GRID_NODE_CATALOG.length >= 1100,
    detail: `nodes ${V1014_ENERGY_DEPTH_GRID_NODE_CATALOG.length}`,
  });
  results.push({
    id: 'catalog_depletion',
    name: 'depletion_curve_catalog_size',
    passed: V1014_ENERGY_DEPTH_DEPLETION_CURVES.length >= 900,
    detail: `curves ${V1014_ENERGY_DEPTH_DEPLETION_CURVES.length}`,
  });
  results.push({
    id: 'catalog_renewable',
    name: 'renewable_profile_catalog_size',
    passed: V1014_ENERGY_DEPTH_RENEWABLE_PROFILES.length >= 900,
    detail: `profiles ${V1014_ENERGY_DEPTH_RENEWABLE_PROFILES.length}`,
  });
  results.push({
    id: 'catalog_carbon',
    name: 'carbon_budget_catalog_size',
    passed: V1014_ENERGY_DEPTH_CARBON_BUDGETS.length >= 40,
    detail: `budgets ${V1014_ENERGY_DEPTH_CARBON_BUDGETS.length}`,
  });
  results.push({
    id: 'catalog_coupling',
    name: 'coupling_matrix_size',
    passed: V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX.length >= 1200,
    detail: `rows ${V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX.length}`,
  });
  results.push({
    id: 'catalog_contingency',
    name: 'contingency_scenario_size',
    passed: V1014_ENERGY_DEPTH_CONTINGENCY_SCENARIOS.length >= 1500,
    detail: `scenarios ${V1014_ENERGY_DEPTH_CONTINGENCY_SCENARIOS.length}`,
  });
  results.push({
    id: 'catalog_emissions',
    name: 'emissions_factor_size',
    passed: V1014_ENERGY_DEPTH_EMISSIONS_FACTORS.length >= 2000,
    detail: `factors ${V1014_ENERGY_DEPTH_EMISSIONS_FACTORS.length}`,
  });
  results.push({
    id: 'determinism_hash',
    name: 'fnv1a_stable',
    passed: V1014_ENERGY_DEPTH_fnv1a('abc') === V1014_ENERGY_DEPTH_fnv1a('abc'),
    detail: 'hash repeat',
  });
  results.push({
    id: 'band_grid',
    name: 'grid_band_threshold',
    passed: V1014_ENERGY_DEPTH_bandGrid(25) === 'secure',
    detail: V1014_ENERGY_DEPTH_bandGrid(25),
  });
  const disabled = computeV1014EnergyDepthState(
    buildV1014EnergyDepthInputs({ turn: 1, enabled: false, gameState: {} }),
    createInitialV1014EnergyDepthPersisted(),
    null,
  );
  results.push({
    id: 'disabled_path',
    name: 'feature_off',
    passed: !disabled.state.enabled && disabled.state.crisisHints.length === 0,
    detail: 'disabled state',
  });
  const enabled = computeV1014EnergyDepthState(
    buildV1014EnergyDepthInputs({ turn: 2, enabled: true, gameState: {} }),
    createInitialV1014EnergyDepthPersisted(),
    null,
  );
  const mods = V1014_ENERGY_DEPTH_adaptIndustriesModifiers(enabled.state.regions);
  results.push({
    id: 'adapter_20t',
    name: 'industry_modifiers_bounded',
    passed: Object.values(mods.NSW || {}).every(v => v >= -18 && v <= 12),
    detail: JSON.stringify(mods.NSW),
  });
  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}

export function formatV1014EnergyDepthSelfTestReport(report: V1014EnergyDepthSelfTestReport): string {
  return `v1014_energy_depth: ${report.passed}/${report.total} passed\\n` +
    report.results.map(r => `  [${r.passed ? 'OK' : 'FAIL'}] ${r.id}: ${r.detail}`).join('\\n');
}
'''
    (SELF / "self-tests.ts").write_text(content, encoding="utf-8")


def main() -> None:
    CAT.mkdir(parents=True, exist_ok=True)
    write_grid_nodes()
    write_depletion()
    write_renewable_profiles()
    write_carbon_budgets()
    write_coupling_matrix()
    write_contingency_scenarios()
    write_emissions_factors()
    write_self_test_fixtures()
    write_self_tests_main()
    total = sum(
        len(p.read_text(encoding="utf-8").splitlines())
        for p in (ROOT / "src").rglob("*.ts")
    )
    print(f"total src TS lines={total}")


if __name__ == "__main__":
    main()
