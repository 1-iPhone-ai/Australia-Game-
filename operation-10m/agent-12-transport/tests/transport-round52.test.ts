import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeFusionTritiumBreedingExportByRegion,
  nationalFusionTritiumBreedingExportIndex,
  fusionTritiumBreedingExportProductivityMultiplier,
} from '../network/fusion-tritium-breeding-export-index.ts';
import {
  computeRemotePediatricOncologySupplyStagingByRegion,
  computeRemotePediatricOncologySupplyStagingShare,
  nationalRemotePediatricOncologySupplyStagingIndex,
  remotePediatricOncologySupplyStagingProductivityMultiplier,
} from '../operations/remote-pediatric-oncology-supply-staging-index.ts';
import {
  computePortBioLngBunkeringLogisticsShare,
  computePortBioLngBunkeringLogisticsThroughputByRegion,
  nationalPortBioLngBunkeringLogisticsThroughputIndex,
  portBioLngBunkeringLogisticsProductivityMultiplier,
} from '../productivity/port-bio-lng-bunkering-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 52 catalog', () => {
  it('meets 718+ assets, 170+ corridors, 278+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 718);
    assert.ok(TRANSPORT_CORRIDORS.length >= 170);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 278);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 52 systems', () => {
  it('returns agent12/54 with fusion tritium breeding, Pediatric Oncology, bio-LNG bunkering', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(750), {
      fusionTritiumBreedingExportPolicy: 'accelerate',
      remotePediatricOncologySupplyStagingPolicy: 'surge',
      portBioLngBunkeringLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/54');
    assert.ok(state.nationalFusionTritiumBreedingExportIndex >= 5);
    assert.ok(state.nationalRemotePediatricOncologySupplyStagingIndex >= 6);
    assert.ok(state.portBioLngBunkeringLogisticsShare >= 0.03);
    assert.ok(
      state.fusionTritiumBreedingExportByRegion.NSW > 3 || state.fusionTritiumBreedingExportByRegion.VIC > 3,
    );
  });

  it('activates NSW–VIC fusion tritium breeding corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(751));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_vic_superconducting_hvdc');
    assert.ok(corridor?.active);
  });

  it('reflects fusion tritium breeding policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(752);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeFusionTritiumBreedingExportByRegion(ops);
    const national = nationalFusionTritiumBreedingExportIndex(byRegion);
    assert.ok(
      fusionTritiumBreedingExportProductivityMultiplier(national, 'accelerate') >=
        fusionTritiumBreedingExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes Pediatric Oncology staging from critical care logistics assets', () => {
    const inputs = defaultInfrastructureInputs(753);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemotePediatricOncologySupplyStagingByRegion(ops, 0.5);
    const national = nationalRemotePediatricOncologySupplyStagingIndex(byRegion);
    assert.ok(byRegion.NT > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeRemotePediatricOncologySupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemotePediatricOncologySupplyStagingShare(ops, 'baseline'));
    assert.ok(remotePediatricOncologySupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes bio-LNG bunkering from green-ammonia assets', () => {
    const inputs = defaultInfrastructureInputs(754);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortBioLngBunkeringLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.WA > 0.2 || byRegion.QLD > 0.2);
    const share = computePortBioLngBunkeringLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortBioLngBunkeringLogisticsShare(ops, 'baseline'));
    const national = nationalPortBioLngBunkeringLogisticsThroughputIndex(byRegion);
    assert.ok(portBioLngBunkeringLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-52 NSW fusion tritium breeding export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_nsw_fusion_tritium_breeding_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'NSW');
  });
});
