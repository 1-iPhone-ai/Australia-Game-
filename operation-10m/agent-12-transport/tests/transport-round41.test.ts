import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeMoltenSaltSolarExportByRegion,
  moltenSaltSolarExportProductivityMultiplier,
  nationalMoltenSaltSolarExportIndex,
} from '../network/molten-salt-solar-export-index.ts';
import {
  alpineSkiResortSupplyStagingProductivityMultiplier,
  computeAlpineSkiResortSupplyStagingByRegion,
  computeAlpineSkiResortSupplyStagingShare,
  nationalAlpineSkiResortSupplyStagingIndex,
} from '../operations/alpine-ski-resort-supply-staging-index.ts';
import {
  computeRailAutonomousShuntingLogisticsShare,
  computeRailAutonomousShuntingLogisticsThroughputByRegion,
  nationalRailAutonomousShuntingLogisticsThroughputIndex,
  railAutonomousShuntingLogisticsProductivityMultiplier,
} from '../productivity/rail-autonomous-shunting-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 41 catalog', () => {
  it('meets 560+ assets, 137+ corridors, 223+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 560);
    assert.ok(TRANSPORT_CORRIDORS.length >= 137);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 223);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 41 systems', () => {
  it('returns agent12/48 with molten salt, alpine ski, rail shunting', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(380), {
      moltenSaltSolarExportPolicy: 'accelerate',
      alpineSkiResortSupplyStagingPolicy: 'surge',
      railAutonomousShuntingLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/48');
    assert.ok(state.nationalMoltenSaltSolarExportIndex >= 5);
    assert.ok(state.nationalAlpineSkiResortSupplyStagingIndex >= 6);
    assert.ok(state.railAutonomousShuntingLogisticsShare >= 0.03);
    assert.ok(state.moltenSaltSolarExportByRegion.SA > 3 || state.moltenSaltSolarExportByRegion.NSW > 3);
  });

  it('activates SA–NSW molten salt solar corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(381));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_sa_nsw_molten_salt_solar');
    assert.ok(corridor?.active);
  });

  it('reflects molten salt policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(382);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeMoltenSaltSolarExportByRegion(ops);
    const national = nationalMoltenSaltSolarExportIndex(byRegion);
    assert.ok(
      moltenSaltSolarExportProductivityMultiplier(national, 'accelerate') >=
        moltenSaltSolarExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes alpine ski staging from resort freight assets', () => {
    const inputs = defaultInfrastructureInputs(383);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAlpineSkiResortSupplyStagingByRegion(ops, 0.5);
    const national = nationalAlpineSkiResortSupplyStagingIndex(byRegion);
    assert.ok(byRegion.VIC > 5.5 || byRegion.NSW >= 6);
    assert.ok(national >= 6);
    const share = computeAlpineSkiResortSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeAlpineSkiResortSupplyStagingShare(ops, 'baseline'));
    assert.ok(alpineSkiResortSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes rail shunting from yard robot assets', () => {
    const inputs = defaultInfrastructureInputs(384);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRailAutonomousShuntingLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.QLD > 0.2);
    const share = computeRailAutonomousShuntingLogisticsShare(ops, 'expand');
    assert.ok(share >= computeRailAutonomousShuntingLogisticsShare(ops, 'baseline'));
    const national = nationalRailAutonomousShuntingLogisticsThroughputIndex(byRegion);
    assert.ok(railAutonomousShuntingLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-41 CSP export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_sa_csp_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'SA');
  });
});
