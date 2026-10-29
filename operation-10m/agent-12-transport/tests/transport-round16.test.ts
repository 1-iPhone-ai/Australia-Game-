import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeOffshoreWindLogisticsByRegion,
  nationalOffshoreWindLogisticsIndex,
  offshoreWindLogisticsProductivityMultiplier,
} from '../network/offshore-wind-logistics-index.ts';
import {
  batterySupplyProductivityMultiplier,
  computeBatterySupplyChainByRegion,
  nationalBatterySupplyChainIndex,
} from '../operations/battery-supply-chain-index.ts';
import {
  computeCruiseTurnaroundShare,
  computeCruiseTurnaroundThroughputByRegion,
  cruiseTurnaroundProductivityMultiplier,
  nationalCruiseTurnaroundThroughputIndex,
} from '../productivity/cruise-turnaround-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 16 catalog', () => {
  it('meets 233+ assets, 62+ corridors, 98+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 233);
    assert.ok(TRANSPORT_CORRIDORS.length >= 62);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 98);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 16 systems', () => {
  it('returns agent12/33 with offshore wind, battery supply, cruise turnaround', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(130), {
      offshoreWindLogisticsPolicy: 'deploy',
      batterySupplyChainPolicy: 'accelerate',
      cruiseTurnaroundPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/33');
    assert.ok(state.nationalOffshoreWindLogisticsIndex >= 6);
    assert.ok(state.nationalBatterySupplyChainIndex >= 18);
    assert.ok(state.cruiseTurnaroundShare >= 0.04);
    assert.ok(state.offshoreWindLogisticsByRegion.WA > 5);
  });

  it('activates WA–SA offshore wind corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(131));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_sa_offshore_wind_chain');
    assert.ok(corridor?.active);
  });

  it('reflects offshore wind policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(132);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeOffshoreWindLogisticsByRegion(ops);
    const national = nationalOffshoreWindLogisticsIndex(byRegion);
    assert.ok(
      offshoreWindLogisticsProductivityMultiplier(national, 'deploy') >=
        offshoreWindLogisticsProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes battery supply from lithium logistics assets', () => {
    const inputs = defaultInfrastructureInputs(133);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeBatterySupplyChainByRegion(ops, 0.5);
    const national = nationalBatterySupplyChainIndex(byRegion);
    assert.ok(byRegion.WA > 18);
    assert.ok(national >= 18);
    assert.ok(batterySupplyProductivityMultiplier(national, 'accelerate') >= 1);
  });

  it('computes cruise turnaround from tourism port assets', () => {
    const inputs = defaultInfrastructureInputs(134);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCruiseTurnaroundThroughputByRegion(ops);
    assert.ok(byRegion.QLD > 2);
    const share = computeCruiseTurnaroundShare(ops, 'expand');
    assert.ok(share >= computeCruiseTurnaroundShare(ops, 'baseline'));
    const national = nationalCruiseTurnaroundThroughputIndex(byRegion);
    assert.ok(cruiseTurnaroundProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-16 offshore wind install surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_offshore_wind_install_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
