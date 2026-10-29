import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeFloatingSolarArrayExportByRegion,
  floatingSolarArrayExportProductivityMultiplier,
  nationalFloatingSolarArrayExportIndex,
} from '../network/floating-solar-array-export-index.ts';
import {
  coastalRescueHelicopterStagingProductivityMultiplier,
  computeCoastalRescueHelicopterStagingByRegion,
  computeCoastalRescueHelicopterStagingShare,
  nationalCoastalRescueHelicopterStagingIndex,
} from '../operations/coastal-rescue-helicopter-staging-index.ts';
import {
  computePortBatterySwappingLogisticsShare,
  computePortBatterySwappingLogisticsThroughputByRegion,
  nationalPortBatterySwappingLogisticsThroughputIndex,
  portBatterySwappingLogisticsProductivityMultiplier,
} from '../productivity/port-battery-swapping-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 45 catalog', () => {
  it('meets 612+ assets, 149+ corridors, 243+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 612);
    assert.ok(TRANSPORT_CORRIDORS.length >= 149);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 243);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 45 systems', () => {
  it('returns agent12/54 with floating solar, coastal rescue, battery swap', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(600), {
      floatingSolarArrayExportPolicy: 'accelerate',
      coastalRescueHelicopterStagingPolicy: 'surge',
      portBatterySwappingLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/54');
    assert.ok(state.nationalFloatingSolarArrayExportIndex >= 5);
    assert.ok(state.nationalCoastalRescueHelicopterStagingIndex >= 6);
    assert.ok(state.portBatterySwappingLogisticsShare >= 0.03);
    assert.ok(state.floatingSolarArrayExportByRegion.WA > 3 || state.floatingSolarArrayExportByRegion.QLD > 3);
  });

  it('activates WA–QLD floating solar corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(601));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_floating_solar');
    assert.ok(corridor?.active);
  });

  it('reflects floating solar policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(602);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeFloatingSolarArrayExportByRegion(ops);
    const national = nationalFloatingSolarArrayExportIndex(byRegion);
    assert.ok(
      floatingSolarArrayExportProductivityMultiplier(national, 'accelerate') >=
        floatingSolarArrayExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes coastal rescue staging from SAR assets', () => {
    const inputs = defaultInfrastructureInputs(603);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCoastalRescueHelicopterStagingByRegion(ops, 0.5);
    const national = nationalCoastalRescueHelicopterStagingIndex(byRegion);
    assert.ok(byRegion.NSW > 5.5 || byRegion.VIC >= 6);
    assert.ok(national >= 6);
    const share = computeCoastalRescueHelicopterStagingShare(ops, 'surge');
    assert.ok(share >= computeCoastalRescueHelicopterStagingShare(ops, 'baseline'));
    assert.ok(coastalRescueHelicopterStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes battery swap from shore power assets', () => {
    const inputs = defaultInfrastructureInputs(604);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortBatterySwappingLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.QLD > 0.2);
    const share = computePortBatterySwappingLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortBatterySwappingLogisticsShare(ops, 'baseline'));
    const national = nationalPortBatterySwappingLogisticsThroughputIndex(byRegion);
    assert.ok(portBatterySwappingLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-45 floating solar export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_floating_solar_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
