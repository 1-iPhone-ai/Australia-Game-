import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeRareEarthMagnetExportByRegion,
  nationalRareEarthMagnetExportIndex,
  rareEarthMagnetExportProductivityMultiplier,
} from '../network/rare-earth-magnet-export-index.ts';
import {
  computeTransTasmanReeferExpressByRegion,
  computeTransTasmanReeferExpressShare,
  nationalTransTasmanReeferExpressIndex,
  transTasmanReeferExpressProductivityMultiplier,
} from '../operations/trans-tasman-reefer-express-index.ts';
import {
  computeZeroEmissionTruckCorridorShare,
  computeZeroEmissionTruckCorridorThroughputByRegion,
  nationalZeroEmissionTruckCorridorThroughputIndex,
  zeroEmissionTruckCorridorProductivityMultiplier,
} from '../productivity/zero-emission-truck-corridor-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 19 catalog', () => {
  it('meets 272+ assets, 71+ corridors, 113+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 272);
    assert.ok(TRANSPORT_CORRIDORS.length >= 71);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 113);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 19 systems', () => {
  it('returns agent12/35 with rare earth, trans-Tasman reefer, zero-emission truck', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(160), {
      rareEarthMagnetExportPolicy: 'accelerate',
      transTasmanReeferExpressPolicy: 'surge',
      zeroEmissionTruckCorridorPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/35');
    assert.ok(state.nationalRareEarthMagnetExportIndex >= 6);
    assert.ok(state.nationalTransTasmanReeferExpressIndex >= 8);
    assert.ok(state.zeroEmissionTruckCorridorShare >= 0.034);
    assert.ok(state.rareEarthMagnetExportByRegion.WA > 5);
  });

  it('activates WA–QLD rare-earth corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(161));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_qld_rare_earth_chain');
    assert.ok(corridor?.active);
  });

  it('reflects rare-earth policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(162);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeRareEarthMagnetExportByRegion(ops);
    const national = nationalRareEarthMagnetExportIndex(byRegion);
    assert.ok(
      rareEarthMagnetExportProductivityMultiplier(national, 'accelerate') >=
        rareEarthMagnetExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes trans-Tasman reefer from cold-chain assets', () => {
    const inputs = defaultInfrastructureInputs(163);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeTransTasmanReeferExpressByRegion(ops, 0.5);
    const national = nationalTransTasmanReeferExpressIndex(byRegion);
    assert.ok(byRegion.VIC > 8);
    assert.ok(national >= 8);
    const share = computeTransTasmanReeferExpressShare(ops, 'surge');
    assert.ok(share >= computeTransTasmanReeferExpressShare(ops, 'baseline'));
    assert.ok(transTasmanReeferExpressProductivityMultiplier(share, 'surge') >= 1);
  });

  it('computes zero-emission truck corridor from ZET assets', () => {
    const inputs = defaultInfrastructureInputs(164);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeZeroEmissionTruckCorridorThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 1 || byRegion.SA > 1.5);
    const share = computeZeroEmissionTruckCorridorShare(ops, 'expand');
    assert.ok(share >= computeZeroEmissionTruckCorridorShare(ops, 'baseline'));
    const national = nationalZeroEmissionTruckCorridorThroughputIndex(byRegion);
    assert.ok(zeroEmissionTruckCorridorProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-19 magnet export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_magnet_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
