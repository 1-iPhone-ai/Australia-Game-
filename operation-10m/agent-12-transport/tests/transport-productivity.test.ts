import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  computeNationalTransportProductivity,
  getAgent12TransportCatalog,
  getCatalogIntegrityReport,
  getDefaultOperationalAssetIds,
  assetFreightCapacityIndex,
  ROAD_CATALOG,
} from '../index.ts';
import { deriveOperationalAssetsFromProjects, mapReportToMacroProductivityDeltas } from '../integration/v94-productivity-bridge.ts';
import { runAgent12TransportSelfChecks } from '../run-self-checks.ts';

describe('Agent 12 catalog', () => {
  it('has four categories with unique ids', () => {
    const report = getCatalogIntegrityReport();
    assert.equal(report.duplicateIds.length, 0);
    assert.equal(report.invalidRegions.length, 0);
    assert.ok(report.byCategory.road >= 10);
    assert.ok(report.byCategory.rail >= 6);
    assert.ok(report.byCategory.port >= 6);
    assert.ok(report.byCategory.logistics >= 6);
    assert.ok(report.totalAssets >= 71);
  });

  it('assigns measurable freight indices to roads', () => {
    const hume = ROAD_CATALOG.find((r) => r.id === 'road_nsw_hume');
    assert.ok(hume);
    const idx = assetFreightCapacityIndex(hume!);
    assert.ok(idx > 10 && idx <= 100);
  });
});

describe('Agent 12 productivity engine', () => {
  it('computes positive national metrics for baseline catalog', () => {
    const report = computeNationalTransportProductivity({
      turn: 10,
      assets: getAgent12TransportCatalog(),
      operationalAssetIds: getDefaultOperationalAssetIds(),
    });
    assert.equal(report.schemaVersion, 'agent12/1');
    assert.ok(report.nationalProductivityIndexBonus > 50);
    assert.ok(report.nationalLogisticsCostMultiplier < 1);
    assert.ok(report.byRegion.NSW.assetCount > 0);
    assert.ok(report.byRegion.VIC.assetCount > 0);
  });

  it('spills corridor benefits into served regions', () => {
    const report = computeNationalTransportProductivity({
      turn: 11,
      assets: getAgent12TransportCatalog(),
      operationalAssetIds: new Set(['road_nsw_hume']),
    });
    assert.ok(report.byRegion.VIC.productivityIndexBonus > 0);
  });

  it('maps to macro productivity deltas with caps', () => {
    const report = computeNationalTransportProductivity({
      turn: 12,
      assets: getAgent12TransportCatalog(),
      operationalAssetIds: getDefaultOperationalAssetIds(),
    });
    const macro = mapReportToMacroProductivityDeltas(report);
    assert.ok(macro.NSW.productivityIndexDelta <= 18);
    assert.ok(macro.NSW.logisticsCostMultiplier >= 0.5 && macro.NSW.logisticsCostMultiplier <= 1.05);
  });

  it('boosts linked assets when canonical projects are active', () => {
    const projects = [
      { id: 'infra_hsr_nsw_vic', projectType: 'high_speed_rail', regionId: 'NSW', status: 'active' },
      { id: 'infra_inland_rail_qld', projectType: 'inland_rail_hub', regionId: 'QLD', status: 'active' },
    ];
    const report = deriveOperationalAssetsFromProjects(projects, 5);
    assert.ok(report.nationalProductivityIndexBonus > 0);
    const humeContrib = report.byRegion.NSW.contributions.find((c) => c.assetId === 'road_nsw_hume');
    assert.ok(humeContrib && humeContrib.evidence.some((e) => e.includes('activeProjectBoost')));
  });
});

describe('Agent 12 self-check runner', () => {
  it('passes bundled self checks', () => {
    const results = runAgent12TransportSelfChecks();
    const failures = results.filter((r) => !r.ok);
    assert.equal(failures.length, 0, failures.map((f) => `${f.id}: ${f.detail}`).join('; '));
  });
});
