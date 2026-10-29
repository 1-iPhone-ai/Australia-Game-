import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeRecycledSteelExportByRegion,
  nationalRecycledSteelExportIndex,
  recycledSteelExportProductivityMultiplier,
} from '../network/recycled-steel-export-index.ts';
import {
  computeRemotePathologySupplyStagingByRegion,
  computeRemotePathologySupplyStagingShare,
  nationalRemotePathologySupplyStagingIndex,
  remotePathologySupplyStagingProductivityMultiplier,
} from '../operations/remote-pathology-supply-staging-index.ts';
import {
  airportDroneCargoLogisticsProductivityMultiplier,
  computeAirportDroneCargoLogisticsShare,
  computeAirportDroneCargoLogisticsThroughputByRegion,
  nationalAirportDroneCargoLogisticsThroughputIndex,
} from '../productivity/airport-drone-cargo-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 46 catalog', () => {
  it('meets 625+ assets, 152+ corridors, 248+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 625);
    assert.ok(TRANSPORT_CORRIDORS.length >= 152);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 248);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 46 systems', () => {
  it('returns agent12/51 with recycled steel, pathology, drone cargo', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(700), {
      recycledSteelExportPolicy: 'accelerate',
      remotePathologySupplyStagingPolicy: 'surge',
      airportDroneCargoLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/51');
    assert.ok(state.nationalRecycledSteelExportIndex >= 5);
    assert.ok(state.nationalRemotePathologySupplyStagingIndex >= 6);
    assert.ok(state.airportDroneCargoLogisticsShare >= 0.03);
    assert.ok(state.recycledSteelExportByRegion.VIC > 3 || state.recycledSteelExportByRegion.SA > 3);
  });

  it('activates VIC–SA recycled steel corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(701));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_vic_sa_recycled_steel');
    assert.ok(corridor?.active);
  });

  it('reflects recycled steel policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(702);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRecycledSteelExportByRegion(ops);
    const national = nationalRecycledSteelExportIndex(byRegion);
    assert.ok(
      recycledSteelExportProductivityMultiplier(national, 'accelerate') >=
        recycledSteelExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes pathology staging from lab sample assets', () => {
    const inputs = defaultInfrastructureInputs(703);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemotePathologySupplyStagingByRegion(ops, 0.5);
    const national = nationalRemotePathologySupplyStagingIndex(byRegion);
    assert.ok(byRegion.SA > 5.5 || byRegion.NT >= 6);
    assert.ok(national >= 6);
    const share = computeRemotePathologySupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemotePathologySupplyStagingShare(ops, 'baseline'));
    assert.ok(remotePathologySupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes drone cargo from UAV hub assets', () => {
    const inputs = defaultInfrastructureInputs(704);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAirportDroneCargoLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.ACT > 0.2);
    const share = computeAirportDroneCargoLogisticsShare(ops, 'expand');
    assert.ok(share >= computeAirportDroneCargoLogisticsShare(ops, 'baseline'));
    const national = nationalAirportDroneCargoLogisticsThroughputIndex(byRegion);
    assert.ok(airportDroneCargoLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-46 recycled steel export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_vic_recycled_steel_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'VIC');
  });
});
