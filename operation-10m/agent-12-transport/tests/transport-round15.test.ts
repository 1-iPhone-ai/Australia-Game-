import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computePacificFeederThroughputByRegion,
  nationalPacificFeederThroughputIndex,
  pacificFeederProductivityMultiplier,
} from '../network/pacific-feeder-tradelane-index.ts';
import {
  computeMedicalSupplyChainByRegion,
  medicalSupplyProductivityMultiplier,
  nationalMedicalSupplyChainIndex,
} from '../operations/medical-supply-chain-index.ts';
import {
  computeDataCentreLogisticsShare,
  computeDataCentreLogisticsThroughputByRegion,
  dataCentreLogisticsProductivityMultiplier,
} from '../productivity/data-centre-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 15 catalog', () => {
  it('meets 220+ assets, 59+ corridors, 93+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 220);
    assert.ok(TRANSPORT_CORRIDORS.length >= 59);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 93);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 15 systems', () => {
  it('returns agent12/48 with Pacific feeder, medical supply, data-centre logistics', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(120), {
      pacificFeederPolicy: 'expand',
      medicalSupplyPolicy: 'surge',
      dataCentreLogisticsPolicy: 'accelerate',
    });
    assert.equal(state.schemaVersion, 'agent12/48');
    assert.ok(state.nationalPacificFeederThroughputIndex >= 7);
    assert.ok(state.nationalMedicalSupplyChainIndex >= 36);
    assert.ok(state.dataCentreLogisticsShare >= 0.06);
    assert.ok(state.pacificFeederThroughputByRegion.QLD > 5);
  });

  it('activates Queensland Pacific feeder corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(121));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_qld_pacific_feeder_chain');
    assert.ok(corridor?.active);
  });

  it('reflects Pacific feeder policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(122);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePacificFeederThroughputByRegion(ops);
    const national = nationalPacificFeederThroughputIndex(byRegion);
    assert.ok(
      pacificFeederProductivityMultiplier(national, 'expand') >=
        pacificFeederProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes medical supply from pharma cold hubs', () => {
    const inputs = defaultInfrastructureInputs(123);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeMedicalSupplyChainByRegion(ops, 0.5);
    const national = nationalMedicalSupplyChainIndex(byRegion);
    assert.ok(byRegion.NSW > 36);
    assert.ok(national >= 36);
    assert.ok(medicalSupplyProductivityMultiplier(national, 'surge') >= 1);
  });

  it('computes data-centre logistics from hyperscale assets', () => {
    const inputs = defaultInfrastructureInputs(124);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeDataCentreLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 2);
    const share = computeDataCentreLogisticsShare(ops, 'accelerate');
    assert.ok(share >= computeDataCentreLogisticsShare(ops, 'baseline'));
    assert.ok(dataCentreLogisticsProductivityMultiplier(share, 'accelerate') >= 1);
  });

  it('registers round-15 Pacific feeder surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_qld_pacific_feeder_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'QLD');
  });
});
