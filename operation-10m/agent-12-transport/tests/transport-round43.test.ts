import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeTidalLagoonExportByRegion,
  nationalTidalLagoonExportIndex,
  tidalLagoonExportProductivityMultiplier,
} from '../network/tidal-lagoon-export-index.ts';
import {
  computeRemoteTelehealthSupplyStagingByRegion,
  computeRemoteTelehealthSupplyStagingShare,
  nationalRemoteTelehealthSupplyStagingIndex,
  remoteTelehealthSupplyStagingProductivityMultiplier,
} from '../operations/remote-telehealth-supply-staging-index.ts';
import {
  computeWarehouseVerticalFulfillmentLogisticsShare,
  computeWarehouseVerticalFulfillmentLogisticsThroughputByRegion,
  nationalWarehouseVerticalFulfillmentLogisticsThroughputIndex,
  warehouseVerticalFulfillmentLogisticsProductivityMultiplier,
} from '../productivity/warehouse-vertical-fulfillment-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 43 catalog', () => {
  it('meets 586+ assets, 143+ corridors, 233+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 586);
    assert.ok(TRANSPORT_CORRIDORS.length >= 143);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 233);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 43 systems', () => {
  it('returns agent12/55 with tidal lagoon, telehealth, vertical fulfillment', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(400), {
      tidalLagoonExportPolicy: 'accelerate',
      remoteTelehealthSupplyStagingPolicy: 'surge',
      warehouseVerticalFulfillmentLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/55');
    assert.ok(state.nationalTidalLagoonExportIndex >= 5);
    assert.ok(state.nationalRemoteTelehealthSupplyStagingIndex >= 6);
    assert.ok(state.warehouseVerticalFulfillmentLogisticsShare >= 0.03);
    assert.ok(state.tidalLagoonExportByRegion.TAS > 3 || state.tidalLagoonExportByRegion.VIC > 3);
  });

  it('activates TAS–VIC tidal lagoon corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(401));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_tas_vic_tidal_lagoon');
    assert.ok(corridor?.active);
  });

  it('reflects tidal lagoon policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(402);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeTidalLagoonExportByRegion(ops);
    const national = nationalTidalLagoonExportIndex(byRegion);
    assert.ok(
      tidalLagoonExportProductivityMultiplier(national, 'accelerate') >=
        tidalLagoonExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes telehealth staging from remote health assets', () => {
    const inputs = defaultInfrastructureInputs(403);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteTelehealthSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteTelehealthSupplyStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteTelehealthSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteTelehealthSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteTelehealthSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes vertical fulfillment from tower hub assets', () => {
    const inputs = defaultInfrastructureInputs(404);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeWarehouseVerticalFulfillmentLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computeWarehouseVerticalFulfillmentLogisticsShare(ops, 'expand');
    assert.ok(share >= computeWarehouseVerticalFulfillmentLogisticsShare(ops, 'baseline'));
    const national = nationalWarehouseVerticalFulfillmentLogisticsThroughputIndex(byRegion);
    assert.ok(warehouseVerticalFulfillmentLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-43 tidal export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_tas_tidal_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'TAS');
  });
});
