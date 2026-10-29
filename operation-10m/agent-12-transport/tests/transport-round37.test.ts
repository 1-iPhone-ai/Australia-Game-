import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computePumpedHydroRenewableExportByRegion,
  nationalPumpedHydroRenewableExportIndex,
  pumpedHydroRenewableExportProductivityMultiplier,
} from '../network/pumped-hydro-renewable-export-index.ts';
import {
  computeWildfireAirtankerStagingByRegion,
  computeWildfireAirtankerStagingShare,
  nationalWildfireAirtankerStagingIndex,
  wildfireAirtankerStagingProductivityMultiplier,
} from '../operations/wildfire-airtanker-staging-index.ts';
import {
  computeSuburbanMicroFulfillmentLogisticsShare,
  computeSuburbanMicroFulfillmentLogisticsThroughputByRegion,
  nationalSuburbanMicroFulfillmentLogisticsThroughputIndex,
  suburbanMicroFulfillmentLogisticsProductivityMultiplier,
} from '../productivity/suburban-micro-fulfillment-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 37 catalog', () => {
  it('meets 507+ assets, 125+ corridors, 203+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 507);
    assert.ok(TRANSPORT_CORRIDORS.length >= 125);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 203);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 37 systems', () => {
  it('returns agent12/42 with pumped hydro, wildfire tanker, micro fulfillment', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(340), {
      pumpedHydroRenewableExportPolicy: 'accelerate',
      wildfireAirtankerStagingPolicy: 'surge',
      suburbanMicroFulfillmentLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/42');
    assert.ok(state.nationalPumpedHydroRenewableExportIndex >= 5);
    assert.ok(state.nationalWildfireAirtankerStagingIndex >= 6);
    assert.ok(state.suburbanMicroFulfillmentLogisticsShare >= 0.03);
    assert.ok(state.pumpedHydroRenewableExportByRegion.NSW > 3 || state.pumpedHydroRenewableExportByRegion.SA > 3);
  });

  it('activates NSW–SA pumped hydro renewable corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(341));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_sa_pumped_hydro_renewable');
    assert.ok(corridor?.active);
  });

  it('reflects pumped hydro policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(342);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePumpedHydroRenewableExportByRegion(ops);
    const national = nationalPumpedHydroRenewableExportIndex(byRegion);
    assert.ok(
      pumpedHydroRenewableExportProductivityMultiplier(national, 'accelerate') >=
        pumpedHydroRenewableExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes wildfire airtanker staging from fire base assets', () => {
    const inputs = defaultInfrastructureInputs(343);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeWildfireAirtankerStagingByRegion(ops, 0.5);
    const national = nationalWildfireAirtankerStagingIndex(byRegion);
    assert.ok(byRegion.VIC > 5.5 || byRegion.NSW >= 6);
    assert.ok(national >= 6);
    const share = computeWildfireAirtankerStagingShare(ops, 'surge');
    assert.ok(share >= computeWildfireAirtankerStagingShare(ops, 'baseline'));
    assert.ok(wildfireAirtankerStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes suburban micro fulfillment from e-commerce assets', () => {
    const inputs = defaultInfrastructureInputs(344);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeSuburbanMicroFulfillmentLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.QLD > 0.2);
    const share = computeSuburbanMicroFulfillmentLogisticsShare(ops, 'expand');
    assert.ok(share >= computeSuburbanMicroFulfillmentLogisticsShare(ops, 'baseline'));
    const national = nationalSuburbanMicroFulfillmentLogisticsThroughputIndex(byRegion);
    assert.ok(suburbanMicroFulfillmentLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-37 pumped export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_pumped_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
