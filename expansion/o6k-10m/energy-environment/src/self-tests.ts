import type { V1014EnergyDepthSelfTestReport } from './types';
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
  return `v1014_energy_depth: ${report.passed}/${report.total} passed\n` +
    report.results.map(r => `  [${r.passed ? 'OK' : 'FAIL'}] ${r.id}: ${r.detail}`).join('\n');
}
