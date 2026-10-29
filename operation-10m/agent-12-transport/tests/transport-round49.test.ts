import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeAdvancedSemiconductorPackagingExportByRegion,
  advancedSemiconductorPackagingExportProductivityMultiplier,
  nationalAdvancedSemiconductorPackagingExportIndex,
} from '../network/advanced-semiconductor-packaging-export-index.ts';
import {
  computeRemoteBurnUnitSupplyStagingByRegion,
  computeRemoteBurnUnitSupplyStagingShare,
  nationalRemoteBurnUnitSupplyStagingIndex,
  remoteBurnUnitSupplyStagingProductivityMultiplier,
} from '../operations/remote-burn-unit-supply-staging-index.ts';
import {
  computePortWindAssistedShipBerthingLogisticsShare,
  computePortWindAssistedShipBerthingLogisticsThroughputByRegion,
  nationalPortWindAssistedShipBerthingLogisticsThroughputIndex,
  portWindAssistedShipBerthingLogisticsProductivityMultiplier,
} from '../productivity/port-wind-assisted-ship-berthing-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 49 catalog', () => {
  it('meets 668+ assets, 161+ corridors, 263+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 668);
    assert.ok(TRANSPORT_CORRIDORS.length >= 161);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 263);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 49 systems', () => {
  it('returns agent12/55 with semiconductor, burn unit, wind berthing', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(730), {
      advancedSemiconductorPackagingExportPolicy: 'accelerate',
      remoteBurnUnitSupplyStagingPolicy: 'surge',
      portWindAssistedShipBerthingLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/55');
    assert.ok(state.nationalAdvancedSemiconductorPackagingExportIndex >= 5);
    assert.ok(state.nationalRemoteBurnUnitSupplyStagingIndex >= 6);
    assert.ok(state.portWindAssistedShipBerthingLogisticsShare >= 0.03);
    assert.ok(
      state.advancedSemiconductorPackagingExportByRegion.NSW > 3 ||
        state.advancedSemiconductorPackagingExportByRegion.VIC > 3,
    );
  });

  it('activates NSW–VIC semiconductor packaging corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(731));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_vic_semiconductor_packaging');
    assert.ok(corridor?.active);
  });

  it('reflects semiconductor policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(732);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAdvancedSemiconductorPackagingExportByRegion(ops);
    const national = nationalAdvancedSemiconductorPackagingExportIndex(byRegion);
    assert.ok(
      advancedSemiconductorPackagingExportProductivityMultiplier(national, 'accelerate') >=
        advancedSemiconductorPackagingExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes burn unit staging from trauma logistics assets', () => {
    const inputs = defaultInfrastructureInputs(733);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteBurnUnitSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteBurnUnitSupplyStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteBurnUnitSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteBurnUnitSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteBurnUnitSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes wind berthing from kite-tow assets', () => {
    const inputs = defaultInfrastructureInputs(734);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortWindAssistedShipBerthingLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.WA > 0.2 || byRegion.QLD > 0.2);
    const share = computePortWindAssistedShipBerthingLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortWindAssistedShipBerthingLogisticsShare(ops, 'baseline'));
    const national = nationalPortWindAssistedShipBerthingLogisticsThroughputIndex(byRegion);
    assert.ok(portWindAssistedShipBerthingLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-49 NSW semiconductor export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_semiconductor_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
