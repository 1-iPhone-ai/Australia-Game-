import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeGraphiteBatteryAnodeExportByRegion,
  graphiteBatteryAnodeExportProductivityMultiplier,
  nationalGraphiteBatteryAnodeExportIndex,
} from '../network/graphite-battery-anode-export-index.ts';
import {
  computeCycloneResilientCoastalFreightByRegion,
  computeCycloneResilientCoastalFreightShare,
  cycloneResilientCoastalFreightProductivityMultiplier,
  nationalCycloneResilientCoastalFreightIndex,
} from '../operations/cyclone-resilient-coastal-freight-index.ts';
import {
  computeElectricBusDepotChargingLogisticsShare,
  computeElectricBusDepotChargingLogisticsThroughputByRegion,
  electricBusDepotChargingLogisticsProductivityMultiplier,
  nationalElectricBusDepotChargingLogisticsThroughputIndex,
} from '../productivity/electric-bus-depot-charging-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 31 catalog', () => {
  it('meets 429+ assets, 107+ corridors, 173+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 429);
    assert.ok(TRANSPORT_CORRIDORS.length >= 107);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 173);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 31 systems', () => {
  it('returns agent12/36 with graphite anode, cyclone coastal, e-bus depot', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(280), {
      graphiteBatteryAnodeExportPolicy: 'accelerate',
      cycloneResilientCoastalFreightPolicy: 'harden',
      electricBusDepotChargingLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/36');
    assert.ok(state.nationalGraphiteBatteryAnodeExportIndex >= 5);
    assert.ok(state.nationalCycloneResilientCoastalFreightIndex >= 6);
    assert.ok(state.electricBusDepotChargingLogisticsShare >= 0.03);
    assert.ok(state.graphiteBatteryAnodeExportByRegion.WA > 3 || state.graphiteBatteryAnodeExportByRegion.QLD > 3);
  });

  it('activates WA–QLD graphite anode corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(281));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_graphite_anode');
    assert.ok(corridor?.active);
  });

  it('reflects graphite anode policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(282);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGraphiteBatteryAnodeExportByRegion(ops);
    const national = nationalGraphiteBatteryAnodeExportIndex(byRegion);
    assert.ok(
      graphiteBatteryAnodeExportProductivityMultiplier(national, 'accelerate') >=
        graphiteBatteryAnodeExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes cyclone coastal freight from tropical assets', () => {
    const inputs = defaultInfrastructureInputs(283);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCycloneResilientCoastalFreightByRegion(ops, 0.5);
    const national = nationalCycloneResilientCoastalFreightIndex(byRegion);
    assert.ok(byRegion.QLD > 6 || byRegion.NT > 6);
    assert.ok(national >= 6);
    const share = computeCycloneResilientCoastalFreightShare(ops, 'harden');
    assert.ok(share >= computeCycloneResilientCoastalFreightShare(ops, 'baseline'));
    assert.ok(cycloneResilientCoastalFreightProductivityMultiplier(share, 'harden') >= 1);
  });

  it('computes e-bus depot charging from staging assets', () => {
    const inputs = defaultInfrastructureInputs(284);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeElectricBusDepotChargingLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computeElectricBusDepotChargingLogisticsShare(ops, 'expand');
    assert.ok(share >= computeElectricBusDepotChargingLogisticsShare(ops, 'baseline'));
    const national = nationalElectricBusDepotChargingLogisticsThroughputIndex(byRegion);
    assert.ok(electricBusDepotChargingLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 1.8);
  });

  it('registers round-31 graphite anode surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_graphite_anode_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
