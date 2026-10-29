import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeQuantumCryogenicExportByRegion,
  nationalQuantumCryogenicExportIndex,
  quantumCryogenicExportProductivityMultiplier,
} from '../network/quantum-cryogenic-export-index.ts';
import {
  computeRemoteEcmoSupplyStagingByRegion,
  computeRemoteEcmoSupplyStagingShare,
  nationalRemoteEcmoSupplyStagingIndex,
  remoteEcmoSupplyStagingProductivityMultiplier,
} from '../operations/remote-ecmo-supply-staging-index.ts';
import {
  computePortAmmoniaBunkeringLogisticsShare,
  computePortAmmoniaBunkeringLogisticsThroughputByRegion,
  nationalPortAmmoniaBunkeringLogisticsThroughputIndex,
  portAmmoniaBunkeringLogisticsProductivityMultiplier,
} from '../productivity/port-ammonia-bunkering-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 50 catalog', () => {
  it('meets 688+ assets, 164+ corridors, 268+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 688);
    assert.ok(TRANSPORT_CORRIDORS.length >= 164);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 268);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 50 systems', () => {
  it('returns agent12/51 with quantum cryogenic, ECMO, ammonia bunkering', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(740), {
      quantumCryogenicExportPolicy: 'accelerate',
      remoteEcmoSupplyStagingPolicy: 'surge',
      portAmmoniaBunkeringLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/51');
    assert.ok(state.nationalQuantumCryogenicExportIndex >= 5);
    assert.ok(state.nationalRemoteEcmoSupplyStagingIndex >= 6);
    assert.ok(state.portAmmoniaBunkeringLogisticsShare >= 0.03);
    assert.ok(
      state.quantumCryogenicExportByRegion.NSW > 3 || state.quantumCryogenicExportByRegion.VIC > 3,
    );
  });

  it('activates NSW–VIC quantum cryogenic corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(741));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_vic_quantum_cryogenic');
    assert.ok(corridor?.active);
  });

  it('reflects quantum cryogenic policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(742);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeQuantumCryogenicExportByRegion(ops);
    const national = nationalQuantumCryogenicExportIndex(byRegion);
    assert.ok(
      quantumCryogenicExportProductivityMultiplier(national, 'accelerate') >=
        quantumCryogenicExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes ECMO staging from critical care logistics assets', () => {
    const inputs = defaultInfrastructureInputs(743);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteEcmoSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteEcmoSupplyStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteEcmoSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteEcmoSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteEcmoSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes ammonia bunkering from green-ammonia assets', () => {
    const inputs = defaultInfrastructureInputs(744);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortAmmoniaBunkeringLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.WA > 0.2 || byRegion.QLD > 0.2);
    const share = computePortAmmoniaBunkeringLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortAmmoniaBunkeringLogisticsShare(ops, 'baseline'));
    const national = nationalPortAmmoniaBunkeringLogisticsThroughputIndex(byRegion);
    assert.ok(portAmmoniaBunkeringLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-50 NSW quantum cryogenic export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_quantum_cryogenic_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
