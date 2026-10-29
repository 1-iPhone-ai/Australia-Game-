import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeCopperConcentrateExportByRegion,
  copperConcentrateExportProductivityMultiplier,
  nationalCopperConcentrateExportIndex,
} from '../network/copper-concentrate-export-index.ts';
import {
  computePharmaceuticalColdChainByRegion,
  computePharmaceuticalColdChainShare,
  nationalPharmaceuticalColdChainIndex,
  pharmaceuticalColdChainProductivityMultiplier,
} from '../operations/pharmaceutical-cold-chain-index.ts';
import {
  computeRailPassengerFreightPathShare,
  computeRailPassengerFreightPathThroughputByRegion,
  nationalRailPassengerFreightPathThroughputIndex,
  railPassengerFreightPathProductivityMultiplier,
} from '../productivity/rail-passenger-freight-path-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 28 catalog', () => {
  it('meets 390+ assets, 98+ corridors, 158+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 390);
    assert.ok(TRANSPORT_CORRIDORS.length >= 98);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 158);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 28 systems', () => {
  it('returns agent12/36 with copper export, pharma cold chain, pax–freight path', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(250), {
      copperConcentrateExportPolicy: 'accelerate',
      pharmaceuticalColdChainPolicy: 'surge',
      railPassengerFreightPathPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/36');
    assert.ok(state.nationalCopperConcentrateExportIndex >= 5);
    assert.ok(state.nationalPharmaceuticalColdChainIndex >= 6);
    assert.ok(state.railPassengerFreightPathShare >= 0.03);
    assert.ok(state.copperConcentrateExportByRegion.WA > 3 || state.copperConcentrateExportByRegion.QLD > 3);
  });

  it('activates WA–QLD copper concentrate corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(251));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_copper_concentrate');
    assert.ok(corridor?.active);
  });

  it('reflects copper concentrate policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(252);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeCopperConcentrateExportByRegion(ops);
    const national = nationalCopperConcentrateExportIndex(byRegion);
    assert.ok(
      copperConcentrateExportProductivityMultiplier(national, 'accelerate') >=
        copperConcentrateExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes pharma cold chain from GMP logistics assets', () => {
    const inputs = defaultInfrastructureInputs(253);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computePharmaceuticalColdChainByRegion(ops, 0.5);
    const national = nationalPharmaceuticalColdChainIndex(byRegion);
    assert.ok(byRegion.NSW > 6 || byRegion.VIC > 6);
    assert.ok(national >= 6);
    const share = computePharmaceuticalColdChainShare(ops, 'surge');
    assert.ok(share >= computePharmaceuticalColdChainShare(ops, 'baseline'));
    assert.ok(pharmaceuticalColdChainProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes pax–freight path from shared corridor assets', () => {
    const inputs = defaultInfrastructureInputs(254);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRailPassengerFreightPathThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 0.15 || byRegion.VIC > 0.15);
    const share = computeRailPassengerFreightPathShare(ops, 'expand');
    assert.ok(share >= computeRailPassengerFreightPathShare(ops, 'baseline'));
    const national = nationalRailPassengerFreightPathThroughputIndex(byRegion);
    assert.ok(railPassengerFreightPathProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 1.7);
  });

  it('registers round-28 copper export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_copper_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
