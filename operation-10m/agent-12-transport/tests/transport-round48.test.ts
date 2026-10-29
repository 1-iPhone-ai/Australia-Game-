import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeGreenHydrogenElectrolyzerExportByRegion,
  greenHydrogenElectrolyzerExportProductivityMultiplier,
  nationalGreenHydrogenElectrolyzerExportIndex,
} from '../network/green-hydrogen-electrolyzer-export-index.ts';
import {
  computeRemoteOrganTransplantSupplyStagingByRegion,
  computeRemoteOrganTransplantSupplyStagingShare,
  nationalRemoteOrganTransplantSupplyStagingIndex,
  remoteOrganTransplantSupplyStagingProductivityMultiplier,
} from '../operations/remote-organ-transplant-supply-staging-index.ts';
import {
  computePortShorePowerColdIroningLogisticsShare,
  computePortShorePowerColdIroningLogisticsThroughputByRegion,
  nationalPortShorePowerColdIroningLogisticsThroughputIndex,
  portShorePowerColdIroningLogisticsProductivityMultiplier,
} from '../productivity/port-shore-power-cold-ironing-logistics-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 48 catalog', () => {
  it('meets 653+ assets, 158+ corridors, 258+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 653);
    assert.ok(TRANSPORT_CORRIDORS.length >= 158);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 258);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 48 systems', () => {
  it('returns agent12/56 with green H2, organ transplant, shore power', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(720), {
      greenHydrogenElectrolyzerExportPolicy: 'accelerate',
      remoteOrganTransplantSupplyStagingPolicy: 'surge',
      portShorePowerColdIroningLogisticsPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/56');
    assert.ok(state.nationalGreenHydrogenElectrolyzerExportIndex >= 5);
    assert.ok(state.nationalRemoteOrganTransplantSupplyStagingIndex >= 6);
    assert.ok(state.portShorePowerColdIroningLogisticsShare >= 0.03);
    assert.ok(
      state.greenHydrogenElectrolyzerExportByRegion.WA > 3 ||
        state.greenHydrogenElectrolyzerExportByRegion.QLD > 3,
    );
  });

  it('activates WA–QLD green H2 corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(721));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_green_h2_electrolyzer');
    assert.ok(corridor?.active);
  });

  it('reflects H2 policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(722);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGreenHydrogenElectrolyzerExportByRegion(ops);
    const national = nationalGreenHydrogenElectrolyzerExportIndex(byRegion);
    assert.ok(
      greenHydrogenElectrolyzerExportProductivityMultiplier(national, 'accelerate') >=
        greenHydrogenElectrolyzerExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes organ transplant staging from cold-chain assets', () => {
    const inputs = defaultInfrastructureInputs(723);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRemoteOrganTransplantSupplyStagingByRegion(ops, 0.5);
    const national = nationalRemoteOrganTransplantSupplyStagingIndex(byRegion);
    assert.ok(byRegion.NSW > 5.5 || byRegion.ACT >= 6);
    assert.ok(national >= 6);
    const share = computeRemoteOrganTransplantSupplyStagingShare(ops, 'surge');
    assert.ok(share >= computeRemoteOrganTransplantSupplyStagingShare(ops, 'baseline'));
    assert.ok(remoteOrganTransplantSupplyStagingProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes shore power from cold ironing assets', () => {
    const inputs = defaultInfrastructureInputs(724);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePortShorePowerColdIroningLogisticsThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.2 || byRegion.VIC > 0.2);
    const share = computePortShorePowerColdIroningLogisticsShare(ops, 'expand');
    assert.ok(share >= computePortShorePowerColdIroningLogisticsShare(ops, 'baseline'));
    const national = nationalPortShorePowerColdIroningLogisticsThroughputIndex(byRegion);
    assert.ok(portShorePowerColdIroningLogisticsProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-48 WA H2 export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_h2_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
