import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  biomethaneGridExportProductivityMultiplier,
  computeBiomethaneGridExportByRegion,
  nationalBiomethaneGridExportIndex,
} from '../network/biomethane-grid-export-index.ts';
import {
  computeMiningCampResupplyStagingByRegion,
  computeMiningCampResupplyStagingShare,
  miningCampResupplyStagingProductivityMultiplier,
  nationalMiningCampResupplyStagingIndex,
} from '../operations/mining-camp-resupply-staging-index.ts';
import {
  computePortContainerReeferLogisticsShare,
  computePortContainerReeferLogisticsThroughputByRegion,
  nationalPortContainerReeferLogisticsThroughputIndex,
  portContainerReeferLogisticsProductivityMultiplier,
} from '../productivity/port-container-reefer-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 42 catalog', () => {
  it('meets 573+ assets, 140+ corridors, 228+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 573);
    assert.ok(TRANSPORT_CORRIDORS.length >= 140);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 228);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 42 systems', () => {
  it('returns agent12/56 with biomethane, mining camp, container reefer', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(390), {
      biomethaneGridExportPolicy: 'accelerate',
      miningCampResupplyStagingPolicy: 'surge',
      portContainerReeferLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/56');
    assert.ok(state.nationalBiomethaneGridExportIndex >= 5);
    assert.ok(state.nationalMiningCampResupplyStagingIndex >= 6);
    assert.ok(state.portContainerReeferLogisticsShare >= 0.03);
    assert.ok(state.biomethaneGridExportByRegion.QLD > 3 || state.biomethaneGridExportByRegion.NSW > 3);
  });

  it('activates QLD–NSW biomethane grid corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(391));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_qld_nsw_biomethane_grid');
    assert.ok(corridor?.active);
  });

  it('reflects biomethane policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(392);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeBiomethaneGridExportByRegion(ops);
    const national = nationalBiomethaneGridExportIndex(byRegion);
    assert.ok(
      biomethaneGridExportProductivityMultiplier(national, 'accelerate') >=
        biomethaneGridExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes mining camp staging from FIFO assets', () => {
    const inputs = defaultInfrastructureInputs(393);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeMiningCampResupplyStagingByRegion(ops, 0.5);
    const national = nationalMiningCampResupplyStagingIndex(byRegion);
    assert.ok(byRegion.WA > 5.5 || byRegion.NT >= 6);
    assert.ok(national >= 6);
    const share = computeMiningCampResupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeMiningCampResupplyStagingShare(ops, 'baseline'));
    assert.ok(miningCampResupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes container reefer from cold chain hub assets', () => {
    const inputs = defaultInfrastructureInputs(394);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortContainerReeferLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.VIC > 0.2 || byRegion.SA > 0.2);
    const share = computePortContainerReeferLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortContainerReeferLogisticsShare(ops, 'baseline'));
    const national = nationalPortContainerReeferLogisticsThroughputIndex(byRegion);
    assert.ok(portContainerReeferLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-42 biomethane export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_qld_biomethane_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'QLD');
  });
});
