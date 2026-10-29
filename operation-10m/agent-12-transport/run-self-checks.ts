import { getAgent12TransportCatalog, getCatalogIntegrityReport, getDefaultOperationalAssetIds } from './catalog/all-catalog.ts';
import { computeTransportInfrastructureState, defaultInfrastructureInputs } from './productivity/compute-infrastructure-state.ts';
import { computeNationalTransportProductivity } from './productivity/compute-national-productivity.ts';

export interface SelfCheckResult {
  id: string;
  ok: boolean;
  detail: string;
}

export function runAgent12TransportSelfChecks(): SelfCheckResult[] {
  const results: SelfCheckResult[] = [];

  const integrity = getCatalogIntegrityReport();
  results.push({
    id: 'catalog_integrity',
    ok: integrity.duplicateIds.length === 0 && integrity.invalidRegions.length === 0 && integrity.totalAssets >= 100,
    detail: JSON.stringify(integrity),
  });

  const baseline = computeNationalTransportProductivity({
    turn: 1,
    assets: getAgent12TransportCatalog(),
    operationalAssetIds: getDefaultOperationalAssetIds(),
  });
  results.push({
    id: 'baseline_national_bonus_positive',
    ok: baseline.nationalProductivityIndexBonus > 40 && baseline.nationalFreightCapacityIndex > 5,
    detail: `bonus=${baseline.nationalProductivityIndexBonus.toFixed(1)} freightIdx=${baseline.nationalFreightCapacityIndex.toFixed(1)} ms=${baseline.computeMs.toFixed(1)}`,
  });

  const waBefore = baseline.byRegion.WA.productivityIndexBonus;
  const withProject = computeNationalTransportProductivity({
    turn: 2,
    assets: getAgent12TransportCatalog(),
    operationalAssetIds: getDefaultOperationalAssetIds(),
    activeProjectIds: new Set(['infra_v93_wa_freight_rail']),
  });
  const waAfter = withProject.byRegion.WA.productivityIndexBonus;
  results.push({
    id: 'active_project_boosts_wa',
    ok: waAfter >= waBefore,
    detail: `WA before=${waBefore.toFixed(2)} after=${waAfter.toFixed(2)}`,
  });

  const degraded = computeNationalTransportProductivity({
    turn: 3,
    assets: getAgent12TransportCatalog(),
    operationalAssetIds: getDefaultOperationalAssetIds(),
    conditionByAssetId: new Map([['road_nt_stuart', 'degraded']]),
    networkUtilization: { freight: 0.95 },
  });
  const ntDegraded = degraded.byRegion.NT.productivityIndexBonus;
  const ntBase = baseline.byRegion.NT.productivityIndexBonus;
  results.push({
    id: 'degraded_road_and_congestion_lower_nt',
    ok: ntDegraded < ntBase,
    detail: `NT base=${ntBase.toFixed(2)} degraded=${ntDegraded.toFixed(2)}`,
  });

  results.push({
    id: 'compute_performance',
    ok: baseline.computeMs < 500,
    detail: `${baseline.computeMs.toFixed(2)}ms`,
  });

  const infra = computeTransportInfrastructureState(defaultInfrastructureInputs(5));
  results.push({
    id: 'infrastructure_state_v9',
    ok:
      infra.schemaVersion === 'agent12/17' &&
      infra.corridorSynergyPoints > 0 &&
      infra.activeCorridors.some((c) => c.active) &&
      infra.scenarioStackFactor >= 1 &&
      infra.supplyChainResilienceIndex > 0.2 &&
      infra.nationalFreightLatencyMedian > 0 &&
      infra.intercapitalConnectivityIndex > 0.15 &&
      infra.modalBalanceIndex > 0.2 &&
      infra.nationalLastMileCoverage > 45 &&
      infra.nationalContainerThroughputIndex > 15 &&
      infra.coldChainReliabilityIndex > 0.35 &&
      infra.greenFreightShare > 0.12 &&
      infra.nationalBulkExportThroughputIndex > 18 &&
      infra.nationalIntermodalDwellMedian > 10 &&
      infra.nationalUrbanCongestionIndex > 15 &&
      infra.nationalAviationCargoThroughputIndex > 9 &&
      infra.nationalCustomsClearanceIndex > 35 &&
      infra.hydrogenFreightShare >= 0.04 &&
      infra.nationalHydrogenCorridorThroughputIndex > 2 &&
      infra.nationalCoastalShippingThroughputIndex > 8 &&
      infra.nationalBiosecurityClearanceIndex > 36 &&
      infra.autonomousFreightShare >= 0.05 &&
      infra.nationalAutonomousCorridorThroughputIndex >= 2 &&
      infra.nationalDeepSeaGatewayThroughputIndex > 10 &&
      infra.nationalInfrastructurePermittingIndex > 38 &&
      infra.electricFreightShare >= 0.06 &&
      infra.nationalElectricCorridorThroughputIndex >= 2 &&
      infra.nationalDefenceLogisticsReadinessIndex >= 8 &&
      infra.nationalWeatherResilienceRoutingIndex > 38 &&
      infra.digitalFreightVisibilityShare >= 0.07 &&
      infra.nationalDigitalFreightThroughputIndex >= 2 &&
      infra.nationalCriticalMineralsExportIndex >= 10 &&
      infra.nationalChannelMaintenanceIndex > 40 &&
      infra.indigenousRemoteSupplyShare >= 0.08 &&
      infra.nationalIndigenousRemoteSupplyThroughputIndex >= 2 &&
      infra.nationalGaugeInteroperabilityIndex >= 12 &&
      infra.nationalDisasterRecoveryStagingIndex > 37 &&
      infra.circularFreightShare >= 0.06 &&
      infra.nationalCircularFreightThroughputIndex >= 2 &&
      infra.nationalAgriculturalExportThroughputIndex >= 9 &&
      infra.nationalTrackPossessionEfficiencyIndex >= 38 &&
      infra.greenBunkeringShare >= 0.05 &&
      infra.nationalGreenBunkeringThroughputIndex >= 2 &&
      infra.nationalPacificFeederThroughputIndex >= 7 &&
      infra.nationalMedicalSupplyChainIndex >= 36 &&
      infra.dataCentreLogisticsShare >= 0.06 &&
      infra.nationalDataCentreLogisticsThroughputIndex >= 2 &&
      infra.nationalOffshoreWindLogisticsIndex >= 6 &&
      infra.nationalBatterySupplyChainIndex >= 18 &&
      infra.cruiseTurnaroundShare >= 0.04 &&
      infra.nationalCruiseTurnaroundThroughputIndex >= 2,
    detail: `synergy=${infra.corridorSynergyPoints.toFixed(1)} offshore=${infra.nationalOffshoreWindLogisticsIndex.toFixed(1)} battery=${infra.nationalBatterySupplyChainIndex.toFixed(1)} cruise=${infra.nationalCruiseTurnaroundThroughputIndex.toFixed(1)}`,
  });

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = runAgent12TransportSelfChecks();
  let failed = 0;
  for (const r of results) {
    const mark = r.ok ? 'OK' : 'FAIL';
    if (!r.ok) failed += 1;
    console.log(`${mark} ${r.id}: ${r.detail}`);
  }
  process.exit(failed > 0 ? 1 : 0);
}
