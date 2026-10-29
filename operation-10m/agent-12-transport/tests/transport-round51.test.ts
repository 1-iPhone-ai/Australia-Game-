import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeSuperconductingHvdcExportByRegion,
  nationalSuperconductingHvdcExportIndex,
  superconductingHvdcExportProductivityMultiplier,
} from '../network/superconducting-hvdc-export-index.ts';
import {
  computeRemoteNeonatalIcuSupplyStagingByRegion,
  computeRemoteNeonatalIcuSupplyStagingShare,
  nationalRemoteNeonatalIcuSupplyStagingIndex,
  remoteNeonatalIcuSupplyStagingProductivityMultiplier,
} from '../operations/remote-neonatal-icu-supply-staging-index.ts';
import {
  computePortMethanolDualFuelBunkeringLogisticsShare,
  computePortMethanolDualFuelBunkeringLogisticsThroughputByRegion,
  nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex,
  portMethanolDualFuelBunkeringLogisticsProductivityMultiplier,
} from '../productivity/port-methanol-dual-fuel-bunkering-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 51 catalog', () => {
  it('meets 703+ assets, 167+ corridors, 273+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 703);
    assert.ok(TRANSPORT_CORRIDORS.length >= 167);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 273);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 51 systems', () => {
  it('returns agent12/56 with superconducting HVDC, NICU, methanol dual-fuel bunkering', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(750), {
      superconductingHvdcExportPolicy: 'accelerate',
      remoteNeonatalIcuSupplyStagingPolicy: 'surge',
      portMethanolDualFuelBunkeringLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/56');
    assert.ok(state.nationalSuperconductingHvdcExportIndex >= 5);
    assert.ok(state.nationalRemoteNeonatalIcuSupplyStagingIndex >= 6);
    assert.ok(state.portMethanolDualFuelBunkeringLogisticsShare >= 0.03);
    assert.ok(
      state.superconductingHvdcExportByRegion.NSW > 3 || state.superconductingHvdcExportByRegion.VIC > 3,
    );
  });

  it('activates NSW–VIC superconducting HVDC corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(751));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_vic_superconducting_hvdc');
    assert.ok(corridor?.active);
  });

  it('reflects superconducting HVDC policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(752);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeSuperconductingHvdcExportByRegion(ops);
    const national = nationalSuperconductingHvdcExportIndex(byRegion);
    assert.ok(
      superconductingHvdcExportProductivityMultiplier(national, 'accelerate') >=
        superconductingHvdcExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes NICU staging from critical care logistics assets', () => {
    const inputs = defaultInfrastructureInputs(753);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteNeonatalIcuSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteNeonatalIcuSupplyStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteNeonatalIcuSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteNeonatalIcuSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteNeonatalIcuSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes methanol dual-fuel bunkering from green-ammonia assets', () => {
    const inputs = defaultInfrastructureInputs(754);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortMethanolDualFuelBunkeringLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.WA > 0.2 || byRegion.QLD > 0.2);
    const share = computePortMethanolDualFuelBunkeringLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortMethanolDualFuelBunkeringLogisticsShare(ops, 'baseline'));
    const national = nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex(byRegion);
    assert.ok(portMethanolDualFuelBunkeringLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-51 NSW superconducting HVDC export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_superconducting_hvdc_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
