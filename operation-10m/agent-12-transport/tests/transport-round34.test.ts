import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getCatalogIntegrityReport } from '../catalog/all-catalog.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import { TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import {
  computeTitaniumSpongeExportByRegion,
  nationalTitaniumSpongeExportIndex,
  titaniumSpongeExportProductivityMultiplier,
} from '../network/titanium-sponge-export-index.ts';
import {
  computeHeatwaveRailSpeedRestrictionByRegion,
  computeHeatwaveRailSpeedRestrictionShare,
  heatwaveRailSpeedRestrictionProductivityMultiplier,
  nationalHeatwaveRailSpeedRestrictionIndex,
} from '../operations/heatwave-rail-speed-restriction-index.ts';
import {
  computeAutomatedLivestockExportYardShare,
  computeAutomatedLivestockExportYardThroughputByRegion,
  automatedLivestockExportYardProductivityMultiplier,
  nationalAutomatedLivestockExportYardThroughputIndex,
} from '../productivity/automated-livestock-export-yard-index.ts';
import {
  computeTransportInfrastructureState,
  defaultInfrastructureInputs,
} from '../productivity/compute-infrastructure-state.ts';

describe('Agent 12 round 34 catalog', () => {
  it('meets 468+ assets, 116+ corridors, 188+ scenarios', () => {
    const integrity = getCatalogIntegrityReport();
    assert.ok(integrity.totalAssets >= 468);
    assert.ok(TRANSPORT_CORRIDORS.length >= 116);
    assert.ok(TRANSPORT_STRESS_SCENARIOS.length >= 188);
    assert.equal(integrity.duplicateIds.length, 0);
  });
});

describe('Agent 12 round 34 systems', () => {
  it('returns agent12/44 with titanium sponge, heatwave rail, livestock yard', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(310), {
      titaniumSpongeExportPolicy: 'accelerate',
      heatwaveRailSpeedRestrictionPolicy: 'relax',
      automatedLivestockExportYardPolicy: 'expand',
    });
    assert.equal(state.schemaVersion, 'agent12/44');
    assert.ok(state.nationalTitaniumSpongeExportIndex >= 5);
    assert.ok(state.nationalHeatwaveRailSpeedRestrictionIndex >= 6);
    assert.ok(state.automatedLivestockExportYardShare >= 0.03);
    assert.ok(state.titaniumSpongeExportByRegion.WA > 3 || state.titaniumSpongeExportByRegion.SA > 3);
  });

  it('activates WA–SA titanium sponge corridor', () => {
    const state = computeTransportInfrastructureState(defaultInfrastructureInputs(311));
    const corridor = state.activeCorridors.find((c) => c.corridorId === 'corr_wa_sa_titanium_sponge');
    assert.ok(corridor?.active);
  });

  it('reflects titanium sponge policy in multiplier', () => {
    const inputs = defaultInfrastructureInputs(312);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeTitaniumSpongeExportByRegion(ops);
    const national = nationalTitaniumSpongeExportIndex(byRegion);
    assert.ok(
      titaniumSpongeExportProductivityMultiplier(national, 'accelerate') >=
        titaniumSpongeExportProductivityMultiplier(national, 'baseline'),
    );
  });

  it('computes heatwave rail restriction from thermal assets', () => {
    const inputs = defaultInfrastructureInputs(313);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeHeatwaveRailSpeedRestrictionByRegion(ops, 0.5);
    const national = nationalHeatwaveRailSpeedRestrictionIndex(byRegion);
    assert.ok(byRegion.NSW > 5.5 || byRegion.SA >= 6);
    assert.ok(national >= 6);
    const share = computeHeatwaveRailSpeedRestrictionShare(ops, 'relax');
    assert.ok(share >= computeHeatwaveRailSpeedRestrictionShare(ops, 'baseline'));
    assert.ok(heatwaveRailSpeedRestrictionProductivityMultiplier(share, 'relax') >= 1);
  });

  it('computes livestock export yard from quarantine assets', () => {
    const inputs = defaultInfrastructureInputs(314);
    const ops = inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
    const byRegion = computeAutomatedLivestockExportYardThroughputByRegion(ops);
    assert.ok(byRegion.QLD > 0.2 || byRegion.NT > 0.2);
    const share = computeAutomatedLivestockExportYardShare(ops, 'expand');
    assert.ok(share >= computeAutomatedLivestockExportYardShare(ops, 'baseline'));
    const national = nationalAutomatedLivestockExportYardThroughputIndex(byRegion);
    assert.ok(automatedLivestockExportYardProductivityMultiplier(share, 'expand') >= 1);
    assert.ok(national >= 2);
  });

  it('registers round-34 titanium export surge scenario', () => {
    const scenario = TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === 'scn_wa_titanium_export_surge');
    assert.ok(scenario);
    assert.equal(scenario?.targetRegions[0], 'WA');
  });
});
