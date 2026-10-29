import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeStellaratorHelium3ExportByRegion,
  nationalStellaratorHelium3ExportIndex,
  stellaratorHelium3ExportProductivityMultiplier,
} from '../network/stellarator-helium3-export-index.ts';
import {
  computeRemoteBurnCenterSupplyStagingByRegion,
  computeRemoteBurnCenterSupplyStagingShare,
  nationalRemoteBurnCenterSupplyStagingIndex,
  remoteBurnCenterSupplyStagingProductivityMultiplier,
} from '../operations/remote-burn-center-supply-staging-index.ts';
import {
  computePortGreenAmmoniaEfuelBunkeringLogisticsShare,
  computePortGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion,
  nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex,
  portGreenAmmoniaEfuelBunkeringLogisticsProductivityMultiplier,
} from '../productivity/port-green-ammonia-efuel-bunkering-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 52 catalog', () => {
  it('meets 733+ assets, 173+ corridors, 283+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 733);
    assert.ok(TRANSPORT_CORRIDORS.length >= 173);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 283);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 52 systems', () => {
  it('returns agent12/56 with stellarator helium-3, Burn Center, green ammonia e-fuel bunkering', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(750), {
      stellaratorHelium3ExportPolicy: 'accelerate',
      remoteBurnCenterSupplyStagingPolicy: 'surge',
      portGreenAmmoniaEfuelBunkeringLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/56');
    assert.ok(state.nationalStellaratorHelium3ExportIndex >= 5);
    assert.ok(state.nationalRemoteBurnCenterSupplyStagingIndex >= 6);
    assert.ok(state.portGreenAmmoniaEfuelBunkeringLogisticsShare >= 0.03);
    assert.ok(
      state.stellaratorHelium3ExportByRegion.NSW > 3 || state.stellaratorHelium3ExportByRegion.VIC > 3,
    );
  });

  it('activates NSW–VIC stellarator helium-3 corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(751));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_vic_stellarator_helium3');
    assert.ok(corridor?.active);
  });

  it('reflects stellarator helium-3 policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(752);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeStellaratorHelium3ExportByRegion(ops);
    const national = nationalStellaratorHelium3ExportIndex(byRegion);
    assert.ok(
      stellaratorHelium3ExportProductivityMultiplier(national, 'accelerate') >=
        stellaratorHelium3ExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes Burn Center staging from critical care logistics assets', () => {
    const inputs = defaultInfrastructureInputs(753);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteBurnCenterSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteBurnCenterSupplyStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteBurnCenterSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteBurnCenterSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteBurnCenterSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes green ammonia e-fuel bunkering from green-ammonia assets', () => {
    const inputs = defaultInfrastructureInputs(754);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.WA > 0.2 || byRegion.QLD > 0.2);
    const share = computePortGreenAmmoniaEfuelBunkeringLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortGreenAmmoniaEfuelBunkeringLogisticsShare(ops, 'baseline'));
    const national = nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex(byRegion);
    assert.ok(portGreenAmmoniaEfuelBunkeringLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-52 NSW stellarator helium-3 export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_stellarator_helium3_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
