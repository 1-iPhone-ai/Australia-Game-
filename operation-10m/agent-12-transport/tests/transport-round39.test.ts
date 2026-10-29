import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeOffshoreWaveEnergyExportByRegion,
  nationalOffshoreWaveEnergyExportIndex,
  offshoreWaveEnergyExportProductivityMultiplier,
} from '../network/offshore-wave-energy-export-index.ts';
import {
  computeRemoteSchoolSupplyStagingByRegion,
  computeRemoteSchoolSupplyStagingShare,
  nationalRemoteSchoolSupplyStagingIndex,
  remoteSchoolSupplyStagingProductivityMultiplier,
} from '../operations/remote-school-supply-staging-index.ts';
import {
  computePortLithiumHydroxideLogisticsShare,
  computePortLithiumHydroxideLogisticsThroughputByRegion,
  nationalPortLithiumHydroxideLogisticsThroughputIndex,
  portLithiumHydroxideLogisticsProductivityMultiplier,
} from '../productivity/port-lithium-hydroxide-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 39 catalog', () => {
  it('meets 533+ assets, 131+ corridors, 213+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 533);
    assert.ok(TRANSPORT_CORRIDORS.length >= 131);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 213);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 39 systems', () => {
  it('returns agent12/46 with wave energy, school supply, lithium hydroxide', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(360), {
      offshoreWaveEnergyExportPolicy: 'accelerate',
      remoteSchoolSupplyStagingPolicy: 'surge',
      portLithiumHydroxideLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/46');
    assert.ok(state.nationalOffshoreWaveEnergyExportIndex >= 5);
    assert.ok(state.nationalRemoteSchoolSupplyStagingIndex >= 6);
    assert.ok(state.portLithiumHydroxideLogisticsShare >= 0.03);
    assert.ok(state.offshoreWaveEnergyExportByRegion.TAS > 3 || state.offshoreWaveEnergyExportByRegion.VIC > 3);
  });

  it('activates TAS–VIC offshore wave energy corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(361));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_tas_vic_offshore_wave_energy');
    assert.ok(corridor?.active);
  });

  it('reflects wave energy policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(362);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeOffshoreWaveEnergyExportByRegion(ops);
    const national = nationalOffshoreWaveEnergyExportIndex(byRegion);
    assert.ok(
      offshoreWaveEnergyExportProductivityMultiplier(national, 'accelerate') >=
        offshoreWaveEnergyExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes remote school supply from outback education assets', () => {
    const inputs = defaultInfrastructureInputs(363);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteSchoolSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteSchoolSupplyStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.WA >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteSchoolSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteSchoolSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteSchoolSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes lithium hydroxide logistics from cathode hub assets', () => {
    const inputs = defaultInfrastructureInputs(364);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortLithiumHydroxideLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.WA > 0.2 || byRegion.QLD > 0.2);
    const share = computePortLithiumHydroxideLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortLithiumHydroxideLogisticsShare(ops, 'baseline'));
    const national = nationalPortLithiumHydroxideLogisticsThroughputIndex(byRegion);
    assert.ok(portLithiumHydroxideLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-39 wave export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_tas_wave_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'TAS');
  });
});
