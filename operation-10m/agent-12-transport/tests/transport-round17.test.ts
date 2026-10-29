import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeSubseaCableLandingByRegion,
  nationalSubseaCableLandingIndex,
  subseaCableLandingProductivityMultiplier,
} from '../network/subsea-cable-landing-index.ts';
import {
  computeGreenAmmoniaExportByRegion,
  greenAmmoniaExportProductivityMultiplier,
  nationalGreenAmmoniaExportIndex,
} from '../operations/green-ammonia-export-index.ts';
import {
  airportExpressRailProductivityMultiplier,
  computeAirportExpressRailShare,
  computeAirportExpressRailThroughputByRegion,
  nationalAirportExpressRailThroughputIndex,
} from '../productivity/airport-express-rail-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 17 catalog', () => {
  it('meets 246+ assets, 65+ corridors, 103+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 246);
    assert.ok(TRANSPORT_CORRIDORS.length >= 65);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 103);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 17 systems', () => {
  it('returns agent12/38 with subsea cable, green ammonia, airport express rail', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(140), {
      subseaCableLandingPolicy: 'expand',
      greenAmmoniaExportPolicy: 'accelerate',
      airportExpressRailPolicy: 'deploy',
    });
    assert.equal(state.schemaVersion, 'agent12/38');
    assert.ok(state.nationalSubseaCableLandingIndex >= 5);
    assert.ok(state.nationalGreenAmmoniaExportIndex >= 12);
    assert.ok(state.airportExpressRailShare >= 0.04);
    assert.ok(state.subseaCableLandingByRegion.NSW > 4);
  });

  it('activates NSW–QLD subsea cable corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(141));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_nsw_qld_subsea_cable_chain');
    assert.ok(corridor?.active);
  });

  it('reflects subsea cable policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(142);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeSubseaCableLandingByRegion(ops);
    const national = nationalSubseaCableLandingIndex(byRegion);
    assert.ok(
      subseaCableLandingProductivityMultiplier(national, 'expand') >=
        subseaCableLandingProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes green ammonia export from renewable port assets', () => {
    const inputs = defaultInfrastructureInputs(143);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeGreenAmmoniaExportByRegion(ops, 0.5);
    const national = nationalGreenAmmoniaExportIndex(byRegion);
    assert.ok(byRegion.WA > 12);
    assert.ok(national >= 12);
    assert.ok(greenAmmoniaExportProductivityMultiplier(national, 'accelerate') >= 1);
  });

  it('computes airport express rail from air-rail assets', () => {
    const inputs = defaultInfrastructureInputs(144);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAirportExpressRailThroughputByRegion(ops);
    assert.ok(byRegion.NSW > 2);
    const share = computeAirportExpressRailShare(ops, 'deploy');
    assert.ok(share >= computeAirportExpressRailShare(ops, 'baseline'));
    const national = nationalAirportExpressRailThroughputIndex(byRegion);
    assert.ok(airportExpressRailProductivityMultiplier(share, 'deploy') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-17 subsea cable lay surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_subsea_cable_lay_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
