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
      infra.schemaVersion === 'agent12/55' &&
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
      infra.nationalCruiseTurnaroundThroughputIndex >= 2 &&
      infra.nationalSubseaCableLandingIndex >= 5 &&
      infra.nationalGreenAmmoniaExportIndex >= 12 &&
      infra.airportExpressRailShare >= 0.04 &&
      infra.nationalAirportExpressRailThroughputIndex >= 2 &&
      infra.nationalLithiumBrineExportIndex >= 6 &&
      infra.nationalInlandRailExpressIndex >= 10 &&
      infra.spaceLaunchLogisticsShare >= 0.03 &&
      infra.nationalSpaceLaunchLogisticsThroughputIndex >= 1.5 &&
      infra.nationalRareEarthMagnetExportIndex >= 6 &&
      infra.nationalTransTasmanReeferExpressIndex >= 8 &&
      infra.zeroEmissionTruckCorridorShare >= 0.034 &&
      infra.nationalZeroEmissionTruckCorridorThroughputIndex >= 2 &&
      infra.nationalOffshoreCcsLogisticsIndex >= 5 &&
      infra.nationalHydrogenLngExportIndex >= 11 &&
      infra.urbanMicrofreightHubShare >= 0.035 &&
      infra.nationalUrbanMicrofreightHubThroughputIndex >= 2 &&
      infra.nationalFloatingOffshoreWindStagingIndex >= 6 &&
      infra.nationalCriticalMedicineAirliftIndex >= 8 &&
      infra.regionalFreightDroneShare >= 0.03 &&
      infra.nationalRegionalFreightDroneThroughputIndex >= 1.5 &&
      infra.nationalGridBatteryLogisticsIndex >= 5 &&
      infra.nationalPacificHumanitarianSealiftIndex >= 8 &&
      infra.autonomousPortTractorShare >= 0.033 &&
      infra.nationalAutonomousPortTractorThroughputIndex >= 2 &&
      infra.nationalAutonomousHeavyHaulIndex >= 6 &&
      infra.nationalGbrBiosecurityLogisticsIndex >= 8 &&
      infra.nightUrbanFreightWindowShare >= 0.03 &&
      infra.nationalNightUrbanFreightWindowThroughputIndex >= 1.5 &&
      infra.nationalMethanolBunkeringExportIndex >= 5 &&
      infra.nationalAntarcticResupplyLogisticsIndex >= 6 &&
      infra.smartBorderPreclearanceShare >= 0.03 &&
      infra.nationalSmartBorderPreclearanceThroughputIndex >= 2 &&
      infra.nationalSustainableAviationFuelSupplyIndex >= 5 &&
      infra.nationalOutbackDieselSecurityIndex >= 5 &&
      infra.railDoubleStackContainerShare >= 0.03 &&
      infra.nationalRailDoubleStackContainerThroughputIndex >= 1.8 &&
      infra.nationalGreenSteelExportIndex >= 5 &&
      infra.nationalIndigenousCommunityAirliftIndex >= 5 &&
      infra.portBerthSlotOptimizerShare >= 0.03 &&
      infra.nationalPortBerthSlotOptimizerThroughputIndex >= 2 &&
      infra.nationalOffshoreWindTowInstallIndex >= 5 &&
      infra.nationalEvBatteryRecyclingLogisticsIndex >= 5 &&
      infra.urbanCourierMicrohubShare >= 0.03 &&
      infra.nationalUrbanCourierMicrohubThroughputIndex >= 1.6 &&
      infra.nationalCopperConcentrateExportIndex >= 5 &&
      infra.nationalPharmaceuticalColdChainIndex >= 6 &&
      infra.railPassengerFreightPathShare >= 0.03 &&
      infra.nationalRailPassengerFreightPathThroughputIndex >= 1.7 &&
      infra.nationalAluminaRefineryExportIndex >= 5 &&
      infra.nationalDisasterReliefAirBridgeIndex >= 6 &&
      infra.containerYardAutomationShare >= 0.03 &&
      infra.nationalContainerYardAutomationThroughputIndex >= 2 &&
      infra.nationalNickelCobaltBatteryPrecursorIndex >= 5 &&
      infra.nationalRemoteIslandSealiftIndex >= 6 &&
      infra.railInlandTerminalAutomationShare >= 0.03 &&
      infra.nationalRailInlandTerminalAutomationThroughputIndex >= 1.8 &&
      infra.nationalGraphiteBatteryAnodeExportIndex >= 5 &&
      infra.nationalCycloneResilientCoastalFreightIndex >= 6 &&
      infra.electricBusDepotChargingLogisticsShare >= 0.03 &&
      infra.nationalElectricBusDepotChargingLogisticsThroughputIndex >= 1.8 &&
      infra.nationalVanadiumFlowBatteryExportIndex >= 5 &&
      infra.nationalBushfireEvacuationRailBridgeIndex >= 6 &&
      infra.automatedGrainSiloRailLoadoutShare >= 0.03 &&
      infra.nationalAutomatedGrainSiloRailLoadoutThroughputIndex >= 1.9 &&
      infra.nationalGreenIronPelletExportIndex >= 5 &&
      infra.nationalFloodLeveeRailProtectionIndex >= 6 &&
      infra.portZeroEmissionDrayageShare >= 0.03 &&
      infra.nationalPortZeroEmissionDrayageThroughputIndex >= 2 &&
      infra.nationalTitaniumSpongeExportIndex >= 5 &&
      infra.nationalHeatwaveRailSpeedRestrictionIndex >= 6 &&
      infra.automatedLivestockExportYardShare >= 0.03 &&
      infra.nationalAutomatedLivestockExportYardThroughputIndex >= 2 &&
      infra.nationalSiliconSolarWaferExportIndex >= 5 &&
      infra.nationalRailCoalPhaseoutStagingIndex >= 6 &&
      infra.airportBaggageRobotLogisticsShare >= 0.03 &&
      infra.nationalAirportBaggageRobotLogisticsThroughputIndex >= 2 &&
      infra.nationalOffshoreWindCableExportIndex >= 5 &&
      infra.nationalMedevacHelicopterStagingIndex >= 6 &&
      infra.reefRestorationLogisticsShare >= 0.03 &&
      infra.nationalReefRestorationLogisticsThroughputIndex >= 2 &&
      infra.nationalPumpedHydroRenewableExportIndex >= 5 &&
      infra.nationalWildfireAirtankerStagingIndex >= 6 &&
      infra.suburbanMicroFulfillmentLogisticsShare >= 0.03 &&
      infra.nationalSuburbanMicroFulfillmentLogisticsThroughputIndex >= 2 &&
      infra.nationalDeepGeothermalExportIndex >= 5 &&
      infra.nationalCoastalFloodEvacStagingIndex >= 6 &&
      infra.warehouseRobotSortationLogisticsShare >= 0.03 &&
      infra.nationalWarehouseRobotSortationLogisticsThroughputIndex >= 2 &&
      infra.nationalOffshoreWaveEnergyExportIndex >= 5 &&
      infra.nationalRemoteSchoolSupplyStagingIndex >= 6 &&
      infra.portLithiumHydroxideLogisticsShare >= 0.03 &&
      infra.nationalPortLithiumHydroxideLogisticsThroughputIndex >= 2 &&
      infra.nationalDesalinationBrineExportIndex >= 5 &&
      infra.nationalWildlifeRescueAirliftStagingIndex >= 6 &&
      infra.urbanEvFreightChargingLogisticsShare >= 0.03 &&
      infra.nationalUrbanEvFreightChargingLogisticsThroughputIndex >= 2 &&
      infra.nationalMoltenSaltSolarExportIndex >= 5 &&
      infra.nationalAlpineSkiResortSupplyStagingIndex >= 6 &&
      infra.railAutonomousShuntingLogisticsShare >= 0.03 &&
      infra.nationalRailAutonomousShuntingLogisticsThroughputIndex >= 2 &&
      infra.nationalBiomethaneGridExportIndex >= 5 &&
      infra.nationalMiningCampResupplyStagingIndex >= 6 &&
      infra.portContainerReeferLogisticsShare >= 0.03 &&
      infra.nationalPortContainerReeferLogisticsThroughputIndex >= 2 &&
      infra.nationalWarehouseVerticalFulfillmentLogisticsThroughputIndex >= 2 &&
      infra.nationalRailAutomatedInspectionLogisticsThroughputIndex >= 2 &&
      infra.nationalPortBatterySwappingLogisticsThroughputIndex >= 2 &&
      infra.nationalRecycledSteelExportIndex >= 5 &&
      infra.nationalRemotePathologySupplyStagingIndex >= 6 &&
      infra.airportDroneCargoLogisticsShare >= 0.03 &&
      infra.nationalAirportDroneCargoLogisticsThroughputIndex >= 2 &&
      infra.nationalEWasteCriticalMineralsRecoveryExportIndex >= 5 &&
      infra.nationalRegionalOncologyRadiotherapySupplyStagingIndex >= 6 &&
      infra.portAutonomousTugBerthingLogisticsShare >= 0.03 &&
      infra.nationalPortAutonomousTugBerthingLogisticsThroughputIndex >= 2 &&
      infra.nationalGreenHydrogenElectrolyzerExportIndex >= 5 &&
      infra.nationalRemoteOrganTransplantSupplyStagingIndex >= 6 &&
      infra.portShorePowerColdIroningLogisticsShare >= 0.03 &&
      infra.nationalPortShorePowerColdIroningLogisticsThroughputIndex >= 2 &&
      infra.nationalAdvancedSemiconductorPackagingExportIndex >= 5 &&
      infra.nationalRemoteBurnUnitSupplyStagingIndex >= 6 &&
      infra.portWindAssistedShipBerthingLogisticsShare >= 0.03 &&
      infra.nationalPortWindAssistedShipBerthingLogisticsThroughputIndex >= 2 &&
      infra.nationalQuantumCryogenicExportIndex >= 5 &&
      infra.nationalRemoteEcmoSupplyStagingIndex >= 6 &&
      infra.portAmmoniaBunkeringLogisticsShare >= 0.03 &&
      infra.nationalPortAmmoniaBunkeringLogisticsThroughputIndex >= 2 &&
      infra.nationalSuperconductingHvdcExportIndex >= 5 &&
      infra.nationalRemoteNeonatalIcuSupplyStagingIndex >= 6 &&
      infra.portMethanolDualFuelBunkeringLogisticsShare >= 0.03 &&
      infra.nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex >= 2 &&
      infra.nationalFusionTritiumBreedingExportIndex >= 5 &&
      infra.nationalRemotePediatricOncologySupplyStagingIndex >= 6 &&
      infra.portBioLngBunkeringLogisticsShare >= 0.03 &&
      infra.nationalPortBioLngBunkeringLogisticsThroughputIndex >= 2,
    detail: `synergy=${infra.corridorSynergyPoints.toFixed(1)} eWaste=${infra.nationalEWasteCriticalMineralsRecoveryExportIndex.toFixed(1)} oncology=${infra.nationalRegionalOncologyRadiotherapySupplyStagingIndex.toFixed(1)} tug=${infra.nationalPortAutonomousTugBerthingLogisticsThroughputIndex.toFixed(1)} h2=${infra.nationalGreenHydrogenElectrolyzerExportIndex.toFixed(1)} semi=${infra.nationalAdvancedSemiconductorPackagingExportIndex.toFixed(1)} hvdc=${infra.nationalSuperconductingHvdcExportIndex.toFixed(1)} fusion=${infra.nationalFusionTritiumBreedingExportIndex.toFixed(1)}`,
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
