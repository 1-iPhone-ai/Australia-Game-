import {
  AU_REGION_CODES,
  type AuRegionCode,
  type NationalTransportProductivityReport,
  type TransportAsset,
  type TransportAssetCondition,
  type TransportInfrastructureOptions,
  type TransportInfrastructureState,
  type TransportProductivityInputs,
} from '../types.ts';
import { getAgent12TransportCatalog } from '../catalog/all-catalog.ts';
import {
  buildConditionMapFromMaintenance,
  maintenanceWarningsFromBacklog,
} from '../operations/maintenance-backlog.ts';
import {
  corridorLogisticsRelief,
  evaluateAllCorridors,
  totalCorridorSynergy,
} from '../network/evaluate-corridors.ts';
import { enrichInputsWithScenarios, resolveActiveScenarios } from '../scenarios/apply-transport-scenarios.ts';
import {
  applyScenarioStackToUtilization,
  computeScenarioStackFactor,
} from '../scenarios/scenario-stack-policy.ts';
import { computePortRailCouplingByRegion } from '../network/port-rail-coupling.ts';
import { computeResilienceScoreByRegion } from '../network/resilience-score.ts';
import { computeSpilloverBonusByRegion } from '../network/cross-region-spillover.ts';
import { applyClimateBandToInputs } from '../climate/apply-climate-band.ts';
import {
  aggregateNetworkStress,
  projectMaintenanceBacklogNextTurn,
} from '../operations/maintenance-decay.ts';
import { computePipelineUnlocks } from '../operations/investment-pipeline.ts';
import {
  computeInvestmentTierByRegion,
  tierProductivityMultiplier,
} from './regional-investment-tiers.ts';
import { computeIntermodalSynergyByRegion } from './intermodal-synergy.ts';
import { computeFleetCapacitySnapshot } from './fleet-capacity-planner.ts';
import { computeNationalTransportProductivity } from './compute-national-productivity.ts';
import { computeSupplyChainResilienceIndex } from './supply-chain-resilience.ts';
import { clamp } from './formulas.ts';
import {
  computeFreightLatencyByRegion,
  nationalMedianFreightLatency,
} from '../network/freight-latency-index.ts';
import { computeDisruptionRecovery } from '../operations/disruption-recovery.ts';
import {
  computeLastMileCoverageByRegion,
  nationalLastMileCoverage,
} from '../operations/last-mile-coverage.ts';
import {
  connectivityBonusByRegion,
  computeIntercapitalConnectivityIndex,
} from '../network/intercapital-connectivity.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import {
  computeElectrifiedFreightShare,
  computeModalBalanceIndex,
  modalBalanceProductivityMultiplier,
} from './modal-balance-index.ts';
import {
  computeGreenFreightShare,
  greenFreightProductivityMultiplier,
} from './green-freight-index.ts';
import {
  computeContainerThroughputByRegion,
  nationalContainerThroughputIndex,
} from '../network/container-throughput-index.ts';
import {
  computeColdChainReliabilityByRegion,
  nationalColdChainReliabilityIndex,
} from '../operations/cold-chain-reliability.ts';
import {
  computeIntermodalDwellByRegion,
  dwellProductivityPenalty,
  nationalIntermodalDwellMedian,
} from '../operations/intermodal-dwell-index.ts';
import {
  computeBulkExportThroughputByRegion,
  nationalBulkExportThroughputIndex,
} from '../network/bulk-export-throughput-index.ts';
import {
  computeUrbanCongestionByRegion,
  congestionReliefMultiplier,
  nationalUrbanCongestionIndex,
} from './congestion-relief-index.ts';
import {
  computeAviationCargoThroughputByRegion,
  nationalAviationCargoThroughputIndex,
} from '../network/aviation-cargo-throughput-index.ts';
import {
  computeCustomsClearanceByRegion,
  customsClearanceProductivityMultiplier,
  nationalCustomsClearanceIndex,
} from '../operations/customs-clearance-index.ts';
import {
  computeHydrogenCorridorThroughputByRegion,
  computeHydrogenFreightShare,
  hydrogenFreightProductivityMultiplier,
  nationalHydrogenCorridorThroughputIndex,
} from './hydrogen-freight-index.ts';
import {
  coastalShippingProductivityMultiplier,
  computeCoastalShippingThroughputByRegion,
  nationalCoastalShippingThroughputIndex,
} from '../network/coastal-shipping-throughput-index.ts';
import {
  biosecurityClearanceProductivityMultiplier,
  computeBiosecurityClearanceByRegion,
  nationalBiosecurityClearanceIndex,
} from '../operations/biosecurity-clearance-index.ts';
import {
  autonomousFreightProductivityMultiplier,
  computeAutonomousCorridorThroughputByRegion,
  computeAutonomousFreightShare,
  nationalAutonomousCorridorThroughputIndex,
} from './autonomous-freight-index.ts';
import {
  deepSeaGatewayProductivityMultiplier,
  computeDeepSeaGatewayThroughputByRegion,
  nationalDeepSeaGatewayThroughputIndex,
} from '../network/deep-sea-gateway-throughput-index.ts';
import {
  computeInfrastructurePermittingByRegion,
  infrastructurePermittingProductivityMultiplier,
  nationalInfrastructurePermittingIndex,
} from '../operations/infrastructure-permitting-index.ts';
import {
  computeElectricCorridorThroughputByRegion,
  computeElectricFreightShare,
  electricFreightProductivityMultiplier,
  nationalElectricCorridorThroughputIndex,
} from './electric-freight-index.ts';
import {
  computeDefenceLogisticsReadinessByRegion,
  defenceLogisticsProductivityMultiplier,
  nationalDefenceLogisticsReadinessIndex,
} from '../network/defence-logistics-readiness-index.ts';
import {
  computeWeatherResilienceRoutingByRegion,
  nationalWeatherResilienceRoutingIndex,
  weatherResilienceProductivityMultiplier,
} from '../operations/weather-resilience-routing-index.ts';
import {
  computeDigitalFreightThroughputByRegion,
  computeDigitalFreightVisibilityShare,
  digitalFreightProductivityMultiplier,
  nationalDigitalFreightThroughputIndex,
} from './digital-freight-visibility-index.ts';
import {
  computeCriticalMineralsExportByRegion,
  criticalMineralsProductivityMultiplier,
  nationalCriticalMineralsExportIndex,
} from '../network/critical-minerals-export-index.ts';
import {
  channelMaintenanceProductivityMultiplier,
  computeChannelMaintenanceByRegion,
  nationalChannelMaintenanceIndex,
} from '../operations/channel-maintenance-index.ts';
import {
  computeIndigenousRemoteSupplyThroughputByRegion,
  computeIndigenousRemoteSupplyShare,
  indigenousRemoteSupplyProductivityMultiplier,
  nationalIndigenousRemoteSupplyThroughputIndex,
} from './indigenous-remote-supply-index.ts';
import {
  computeGaugeInteroperabilityByRegion,
  gaugeInteroperabilityProductivityMultiplier,
  nationalGaugeInteroperabilityIndex,
} from '../network/gauge-interoperability-index.ts';
import {
  computeDisasterRecoveryStagingByRegion,
  disasterRecoveryStagingProductivityMultiplier,
  nationalDisasterRecoveryStagingIndex,
} from '../operations/disaster-recovery-staging-index.ts';
import {
  circularFreightProductivityMultiplier,
  computeCircularFreightShare,
  computeCircularFreightThroughputByRegion,
  nationalCircularFreightThroughputIndex,
} from './circular-freight-index.ts';
import {
  agriculturalExportProductivityMultiplier,
  computeAgriculturalExportThroughputByRegion,
  nationalAgriculturalExportThroughputIndex,
} from '../network/agricultural-export-throughput-index.ts';
import {
  computeTrackPossessionEfficiencyByRegion,
  nationalTrackPossessionEfficiencyIndex,
  trackPossessionProductivityMultiplier,
} from '../operations/track-possession-efficiency-index.ts';
import {
  computeGreenBunkeringShare,
  computeGreenBunkeringThroughputByRegion,
  greenBunkeringProductivityMultiplier,
  nationalGreenBunkeringThroughputIndex,
} from './green-bunkering-index.ts';
import {
  computePacificFeederThroughputByRegion,
  nationalPacificFeederThroughputIndex,
  pacificFeederProductivityMultiplier,
} from '../network/pacific-feeder-tradelane-index.ts';
import {
  computeMedicalSupplyChainByRegion,
  medicalSupplyProductivityMultiplier,
  nationalMedicalSupplyChainIndex,
} from '../operations/medical-supply-chain-index.ts';
import {
  computeDataCentreLogisticsShare,
  computeDataCentreLogisticsThroughputByRegion,
  dataCentreLogisticsProductivityMultiplier,
  nationalDataCentreLogisticsThroughputIndex,
} from './data-centre-logistics-index.ts';
import {
  computeOffshoreWindLogisticsByRegion,
  nationalOffshoreWindLogisticsIndex,
  offshoreWindLogisticsProductivityMultiplier,
} from '../network/offshore-wind-logistics-index.ts';
import {
  batterySupplyProductivityMultiplier,
  computeBatterySupplyChainByRegion,
  nationalBatterySupplyChainIndex,
} from '../operations/battery-supply-chain-index.ts';
import {
  computeCruiseTurnaroundShare,
  computeCruiseTurnaroundThroughputByRegion,
  cruiseTurnaroundProductivityMultiplier,
  nationalCruiseTurnaroundThroughputIndex,
} from './cruise-turnaround-index.ts';
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
} from './airport-express-rail-index.ts';
import {
  computeLithiumBrineExportByRegion,
  lithiumBrineExportProductivityMultiplier,
  nationalLithiumBrineExportIndex,
} from '../network/lithium-brine-export-index.ts';
import {
  computeInlandRailExpressByRegion,
  computeInlandRailExpressShare,
  inlandRailExpressProductivityMultiplier,
  nationalInlandRailExpressIndex,
} from '../operations/inland-rail-express-index.ts';
import {
  computeSpaceLaunchLogisticsShare,
  computeSpaceLaunchLogisticsThroughputByRegion,
  nationalSpaceLaunchLogisticsThroughputIndex,
  spaceLaunchLogisticsProductivityMultiplier,
} from './space-launch-logistics-index.ts';
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
} from './zero-emission-truck-corridor-index.ts';
import {
  computeOffshoreCcsLogisticsByRegion,
  nationalOffshoreCcsLogisticsIndex,
  offshoreCcsLogisticsProductivityMultiplier,
} from '../network/offshore-ccs-logistics-index.ts';
import {
  computeHydrogenLngExportByRegion,
  hydrogenLngExportProductivityMultiplier,
  nationalHydrogenLngExportIndex,
} from '../operations/hydrogen-lng-export-index.ts';
import {
  computeUrbanMicrofreightHubShare,
  computeUrbanMicrofreightHubThroughputByRegion,
  nationalUrbanMicrofreightHubThroughputIndex,
  urbanMicrofreightHubProductivityMultiplier,
} from './urban-microfreight-hub-index.ts';
import {
  computeFloatingOffshoreWindStagingByRegion,
  floatingOffshoreWindStagingProductivityMultiplier,
  nationalFloatingOffshoreWindStagingIndex,
} from '../network/floating-offshore-wind-staging-index.ts';
import {
  computeCriticalMedicineAirliftByRegion,
  computeCriticalMedicineAirliftShare,
  criticalMedicineAirliftProductivityMultiplier,
  nationalCriticalMedicineAirliftIndex,
} from '../operations/critical-medicine-airlift-index.ts';
import {
  computeRegionalFreightDroneShare,
  computeRegionalFreightDroneThroughputByRegion,
  nationalRegionalFreightDroneThroughputIndex,
  regionalFreightDroneProductivityMultiplier,
} from './regional-freight-drone-index.ts';
import {
  computeGridBatteryLogisticsByRegion,
  gridBatteryLogisticsProductivityMultiplier,
  nationalGridBatteryLogisticsIndex,
} from '../network/grid-battery-logistics-index.ts';
import {
  computePacificHumanitarianSealiftByRegion,
  computePacificHumanitarianSealiftShare,
  nationalPacificHumanitarianSealiftIndex,
  pacificHumanitarianSealiftProductivityMultiplier,
} from '../operations/pacific-humanitarian-sealift-index.ts';
import {
  autonomousPortTractorProductivityMultiplier,
  computeAutonomousPortTractorShare,
  computeAutonomousPortTractorThroughputByRegion,
  nationalAutonomousPortTractorThroughputIndex,
} from './autonomous-port-tractor-index.ts';
import {
  computeAutonomousHeavyHaulByRegion,
  autonomousHeavyHaulProductivityMultiplier,
  nationalAutonomousHeavyHaulIndex,
} from '../network/autonomous-heavy-haul-index.ts';
import {
  computeGbrBiosecurityLogisticsByRegion,
  computeGbrBiosecurityLogisticsShare,
  gbrBiosecurityLogisticsProductivityMultiplier,
  nationalGbrBiosecurityLogisticsIndex,
} from '../operations/gbr-biosecurity-logistics-index.ts';
import {
  computeNightUrbanFreightWindowShare,
  computeNightUrbanFreightWindowThroughputByRegion,
  nationalNightUrbanFreightWindowThroughputIndex,
  nightUrbanFreightWindowProductivityMultiplier,
} from './night-urban-freight-window-index.ts';
import {
  computeMethanolBunkeringExportByRegion,
  methanolBunkeringExportProductivityMultiplier,
  nationalMethanolBunkeringExportIndex,
} from '../network/methanol-bunkering-export-index.ts';
import {
  antarcticResupplyLogisticsProductivityMultiplier,
  computeAntarcticResupplyLogisticsByRegion,
  computeAntarcticResupplyLogisticsShare,
  nationalAntarcticResupplyLogisticsIndex,
} from '../operations/antarctic-resupply-logistics-index.ts';
import {
  computeSmartBorderPreclearanceShare,
  computeSmartBorderPreclearanceThroughputByRegion,
  nationalSmartBorderPreclearanceThroughputIndex,
  smartBorderPreclearanceProductivityMultiplier,
} from './smart-border-preclearance-index.ts';
import {
  computeSustainableAviationFuelSupplyByRegion,
  nationalSustainableAviationFuelSupplyIndex,
  sustainableAviationFuelSupplyProductivityMultiplier,
} from '../network/sustainable-aviation-fuel-supply-index.ts';
import {
  computeOutbackDieselSecurityByRegion,
  computeOutbackDieselSecurityShare,
  nationalOutbackDieselSecurityIndex,
  outbackDieselSecurityProductivityMultiplier,
} from '../operations/outback-diesel-security-logistics-index.ts';
import {
  computeRailDoubleStackContainerShare,
  computeRailDoubleStackContainerThroughputByRegion,
  nationalRailDoubleStackContainerThroughputIndex,
  railDoubleStackContainerProductivityMultiplier,
} from './rail-double-stack-container-index.ts';
import {
  computeGreenSteelExportByRegion,
  greenSteelExportProductivityMultiplier,
  nationalGreenSteelExportIndex,
} from '../network/green-steel-export-index.ts';
import {
  computeIndigenousCommunityAirliftByRegion,
  computeIndigenousCommunityAirliftShare,
  indigenousCommunityAirliftProductivityMultiplier,
  nationalIndigenousCommunityAirliftIndex,
} from '../operations/indigenous-community-airlift-index.ts';
import {
  computePortBerthSlotOptimizerShare,
  computePortBerthSlotOptimizerThroughputByRegion,
  nationalPortBerthSlotOptimizerThroughputIndex,
  portBerthSlotOptimizerProductivityMultiplier,
} from './port-berth-slot-optimizer-index.ts';
import {
  computeOffshoreWindTowInstallByRegion,
  nationalOffshoreWindTowInstallIndex,
  offshoreWindTowInstallProductivityMultiplier,
} from '../network/offshore-wind-tow-install-index.ts';
import {
  computeEvBatteryRecyclingLogisticsByRegion,
  computeEvBatteryRecyclingLogisticsShare,
  evBatteryRecyclingLogisticsProductivityMultiplier,
  nationalEvBatteryRecyclingLogisticsIndex,
} from '../operations/ev-battery-recycling-logistics-index.ts';
import {
  computeUrbanCourierMicrohubShare,
  computeUrbanCourierMicrohubThroughputByRegion,
  nationalUrbanCourierMicrohubThroughputIndex,
  urbanCourierMicrohubProductivityMultiplier,
} from './urban-courier-microhub-index.ts';
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
} from './rail-passenger-freight-path-index.ts';
import {
  computeAluminaRefineryExportByRegion,
  aluminaRefineryExportProductivityMultiplier,
  nationalAluminaRefineryExportIndex,
} from '../network/alumina-refinery-export-index.ts';
import {
  computeDisasterReliefAirBridgeByRegion,
  computeDisasterReliefAirBridgeShare,
  disasterReliefAirBridgeProductivityMultiplier,
  nationalDisasterReliefAirBridgeIndex,
} from '../operations/disaster-relief-air-bridge-index.ts';
import {
  computeContainerYardAutomationShare,
  computeContainerYardAutomationThroughputByRegion,
  containerYardAutomationProductivityMultiplier,
  nationalContainerYardAutomationThroughputIndex,
} from './container-yard-automation-index.ts';
import {
  computeNickelCobaltBatteryPrecursorByRegion,
  nickelCobaltBatteryPrecursorProductivityMultiplier,
  nationalNickelCobaltBatteryPrecursorIndex,
} from '../network/nickel-cobalt-battery-precursor-index.ts';
import {
  computeRemoteIslandSealiftByRegion,
  computeRemoteIslandSealiftShare,
  nationalRemoteIslandSealiftIndex,
  remoteIslandSealiftProductivityMultiplier,
} from '../operations/remote-island-sealift-index.ts';
import {
  computeRailInlandTerminalAutomationShare,
  computeRailInlandTerminalAutomationThroughputByRegion,
  nationalRailInlandTerminalAutomationThroughputIndex,
  railInlandTerminalAutomationProductivityMultiplier,
} from './rail-inland-terminal-automation-index.ts';
import {
  computeGraphiteBatteryAnodeExportByRegion,
  graphiteBatteryAnodeExportProductivityMultiplier,
  nationalGraphiteBatteryAnodeExportIndex,
} from '../network/graphite-battery-anode-export-index.ts';
import {
  computeCycloneResilientCoastalFreightByRegion,
  computeCycloneResilientCoastalFreightShare,
  cycloneResilientCoastalFreightProductivityMultiplier,
  nationalCycloneResilientCoastalFreightIndex,
} from '../operations/cyclone-resilient-coastal-freight-index.ts';
import {
  computeElectricBusDepotChargingLogisticsShare,
  computeElectricBusDepotChargingLogisticsThroughputByRegion,
  electricBusDepotChargingLogisticsProductivityMultiplier,
  nationalElectricBusDepotChargingLogisticsThroughputIndex,
} from './electric-bus-depot-charging-logistics-index.ts';
import {
  computeVanadiumFlowBatteryExportByRegion,
  nationalVanadiumFlowBatteryExportIndex,
  vanadiumFlowBatteryExportProductivityMultiplier,
} from '../network/vanadium-flow-battery-export-index.ts';
import {
  computeBushfireEvacuationRailBridgeByRegion,
  computeBushfireEvacuationRailBridgeShare,
  bushfireEvacuationRailBridgeProductivityMultiplier,
  nationalBushfireEvacuationRailBridgeIndex,
} from '../operations/bushfire-evacuation-rail-bridge-index.ts';
import {
  computeAutomatedGrainSiloRailLoadoutShare,
  computeAutomatedGrainSiloRailLoadoutThroughputByRegion,
  automatedGrainSiloRailLoadoutProductivityMultiplier,
  nationalAutomatedGrainSiloRailLoadoutThroughputIndex,
} from './automated-grain-silo-rail-loadout-index.ts';
import {
  computeGreenIronPelletExportByRegion,
  greenIronPelletExportProductivityMultiplier,
  nationalGreenIronPelletExportIndex,
} from '../network/green-iron-pellet-export-index.ts';
import {
  computeFloodLeveeRailProtectionByRegion,
  computeFloodLeveeRailProtectionShare,
  floodLeveeRailProtectionProductivityMultiplier,
  nationalFloodLeveeRailProtectionIndex,
} from '../operations/flood-levee-rail-protection-index.ts';
import {
  computePortZeroEmissionDrayageShare,
  computePortZeroEmissionDrayageThroughputByRegion,
  nationalPortZeroEmissionDrayageThroughputIndex,
  portZeroEmissionDrayageProductivityMultiplier,
} from './port-zero-emission-drayage-index.ts';
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
} from './automated-livestock-export-yard-index.ts';
import {
  computeSiliconSolarWaferExportByRegion,
  nationalSiliconSolarWaferExportIndex,
  siliconSolarWaferExportProductivityMultiplier,
} from '../network/silicon-solar-wafer-export-index.ts';
import {
  computeRailCoalPhaseoutStagingByRegion,
  computeRailCoalPhaseoutStagingShare,
  nationalRailCoalPhaseoutStagingIndex,
  railCoalPhaseoutStagingProductivityMultiplier,
} from '../operations/rail-coal-phaseout-staging-index.ts';
import {
  airportBaggageRobotLogisticsProductivityMultiplier,
  computeAirportBaggageRobotLogisticsShare,
  computeAirportBaggageRobotLogisticsThroughputByRegion,
  nationalAirportBaggageRobotLogisticsThroughputIndex,
} from './airport-baggage-robot-logistics-index.ts';
import {
  computeOffshoreWindCableExportByRegion,
  nationalOffshoreWindCableExportIndex,
  offshoreWindCableExportProductivityMultiplier,
} from '../network/offshore-wind-cable-export-index.ts';
import {
  computeMedevacHelicopterStagingByRegion,
  computeMedevacHelicopterStagingShare,
  medevacHelicopterStagingProductivityMultiplier,
  nationalMedevacHelicopterStagingIndex,
} from '../operations/medevac-helicopter-staging-index.ts';
import {
  computeReefRestorationLogisticsShare,
  computeReefRestorationLogisticsThroughputByRegion,
  nationalReefRestorationLogisticsThroughputIndex,
  reefRestorationLogisticsProductivityMultiplier,
} from './reef-restoration-logistics-index.ts';
import {
  computePumpedHydroRenewableExportByRegion,
  nationalPumpedHydroRenewableExportIndex,
  pumpedHydroRenewableExportProductivityMultiplier,
} from '../network/pumped-hydro-renewable-export-index.ts';
import {
  computeWildfireAirtankerStagingByRegion,
  computeWildfireAirtankerStagingShare,
  nationalWildfireAirtankerStagingIndex,
  wildfireAirtankerStagingProductivityMultiplier,
} from '../operations/wildfire-airtanker-staging-index.ts';
import {
  computeSuburbanMicroFulfillmentLogisticsShare,
  computeSuburbanMicroFulfillmentLogisticsThroughputByRegion,
  nationalSuburbanMicroFulfillmentLogisticsThroughputIndex,
  suburbanMicroFulfillmentLogisticsProductivityMultiplier,
} from './suburban-micro-fulfillment-logistics-index.ts';
import {
  computeDeepGeothermalExportByRegion,
  deepGeothermalExportProductivityMultiplier,
  nationalDeepGeothermalExportIndex,
} from '../network/deep-geothermal-export-index.ts';
import {
  coastalFloodEvacStagingProductivityMultiplier,
  computeCoastalFloodEvacStagingByRegion,
  computeCoastalFloodEvacStagingShare,
  nationalCoastalFloodEvacStagingIndex,
} from '../operations/coastal-flood-evac-staging-index.ts';
import {
  computeWarehouseRobotSortationLogisticsShare,
  computeWarehouseRobotSortationLogisticsThroughputByRegion,
  nationalWarehouseRobotSortationLogisticsThroughputIndex,
  warehouseRobotSortationLogisticsProductivityMultiplier,
} from './warehouse-robot-sortation-logistics-index.ts';
import {
  computeOffshoreWaveEnergyExportByRegion,
  nationalOffshoreWaveEnergyExportIndex,
  offshoreWaveEnergyExportProductivityMultiplier,
} from '../network/offshore-wave-energy-export-index.ts';
import {
  computeRemoteSchoolSupplyStagingByRegion,
  computeRemoteSchoolSupplyStagingShare,
  nationalRemoteSchoolSupplyStagingIndex,
  remoteSchoolSupplyStagingProductivityMultiplier,
} from '../operations/remote-school-supply-staging-index.ts';
import {
  computePortLithiumHydroxideLogisticsShare,
  computePortLithiumHydroxideLogisticsThroughputByRegion,
  nationalPortLithiumHydroxideLogisticsThroughputIndex,
  portLithiumHydroxideLogisticsProductivityMultiplier,
} from './port-lithium-hydroxide-logistics-index.ts';
import {
  computeDesalinationBrineExportByRegion,
  desalinationBrineExportProductivityMultiplier,
  nationalDesalinationBrineExportIndex,
} from '../network/desalination-brine-export-index.ts';
import {
  computeWildlifeRescueAirliftStagingByRegion,
  computeWildlifeRescueAirliftStagingShare,
  nationalWildlifeRescueAirliftStagingIndex,
  wildlifeRescueAirliftStagingProductivityMultiplier,
} from '../operations/wildlife-rescue-airlift-staging-index.ts';
import {
  computeUrbanEvFreightChargingLogisticsShare,
  computeUrbanEvFreightChargingLogisticsThroughputByRegion,
  nationalUrbanEvFreightChargingLogisticsThroughputIndex,
  urbanEvFreightChargingLogisticsProductivityMultiplier,
} from './urban-ev-freight-charging-logistics-index.ts';
import {
  computeMoltenSaltSolarExportByRegion,
  moltenSaltSolarExportProductivityMultiplier,
  nationalMoltenSaltSolarExportIndex,
} from '../network/molten-salt-solar-export-index.ts';
import {
  alpineSkiResortSupplyStagingProductivityMultiplier,
  computeAlpineSkiResortSupplyStagingByRegion,
  computeAlpineSkiResortSupplyStagingShare,
  nationalAlpineSkiResortSupplyStagingIndex,
} from '../operations/alpine-ski-resort-supply-staging-index.ts';
import {
  computeRailAutonomousShuntingLogisticsShare,
  computeRailAutonomousShuntingLogisticsThroughputByRegion,
  nationalRailAutonomousShuntingLogisticsThroughputIndex,
  railAutonomousShuntingLogisticsProductivityMultiplier,
} from './rail-autonomous-shunting-logistics-index.ts';
import {
  computeBiomethaneGridExportByRegion,
  biomethaneGridExportProductivityMultiplier,
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
} from './port-container-reefer-logistics-index.ts';
import {
  computeTidalLagoonExportByRegion,
  nationalTidalLagoonExportIndex,
  tidalLagoonExportProductivityMultiplier,
} from '../network/tidal-lagoon-export-index.ts';
import {
  computeRemoteTelehealthSupplyStagingByRegion,
  computeRemoteTelehealthSupplyStagingShare,
  nationalRemoteTelehealthSupplyStagingIndex,
  remoteTelehealthSupplyStagingProductivityMultiplier,
} from '../operations/remote-telehealth-supply-staging-index.ts';
import {
  computeWarehouseVerticalFulfillmentLogisticsShare,
  computeWarehouseVerticalFulfillmentLogisticsThroughputByRegion,
  nationalWarehouseVerticalFulfillmentLogisticsThroughputIndex,
  warehouseVerticalFulfillmentLogisticsProductivityMultiplier,
} from './warehouse-vertical-fulfillment-logistics-index.ts';
import type { SeasonalDemandBand } from '../types.ts';

function seasonalFreightUtilizationDelta(band?: SeasonalDemandBand): number {
  if (band === 'low') return -0.06;
  if (band === 'peak') return 0.09;
  return 0;
}

const CONDITION_RANK: TransportAssetCondition[] = [
  'excellent',
  'good',
  'fair',
  'degraded',
  'closed',
];

function harsherCondition(a: TransportAssetCondition, b: TransportAssetCondition): TransportAssetCondition {
  return CONDITION_RANK[Math.max(CONDITION_RANK.indexOf(a), CONDITION_RANK.indexOf(b))];
}

function operationalAssets(inputs: TransportProductivityInputs): TransportAsset[] {
  return inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
}

function detectBottlenecks(
  report: NationalTransportProductivityReport,
  assets: TransportAsset[],
  inputs: TransportProductivityInputs,
): string[] {
  const bottlenecks: string[] = [];
  for (const asset of assets) {
    const condition = inputs.conditionByAssetId?.get(asset.id) ?? 'good';
    if (condition === 'degraded' || condition === 'closed') {
      bottlenecks.push(asset.id);
      continue;
    }
    const regional = report.byRegion[asset.hostRegion];
    const contrib = regional.contributions.find((c) => c.assetId === asset.id);
    if (!contrib) continue;
    if (contrib.freightCapacityIndex < 8 && asset.category !== 'logistics') {
      bottlenecks.push(asset.id);
    }
  }
  return bottlenecks.sort();
}

function mergeConditions(
  base: ReadonlyMap<string, TransportAssetCondition> | undefined,
  maintenance: Map<string, TransportAssetCondition>,
): Map<string, TransportAssetCondition> {
  const out = new Map<string, TransportAssetCondition>(base ?? []);
  for (const [id, cond] of maintenance.entries()) {
    out.set(id, harsherCondition(out.get(id) ?? 'good', cond));
  }
  return out;
}

export function computeTransportInfrastructureState(
  baseInputs: TransportProductivityInputs,
  options?: TransportInfrastructureOptions,
): TransportInfrastructureState {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const maintenanceMap = buildConditionMapFromMaintenance(options?.maintenanceBacklogByAssetId);
  const mergedConditions = mergeConditions(baseInputs.conditionByAssetId, maintenanceMap);

  let inputs: TransportProductivityInputs = {
    ...baseInputs,
    conditionByAssetId: mergedConditions,
  };

  const { inputs: scenarioInputs, appliedScenarioIds } = enrichInputsWithScenarios(
    inputs,
    options?.activeScenarioIds,
  );
  const activeScenarios = resolveActiveScenarios(options?.activeScenarioIds);
  const scenarioStackFactor = computeScenarioStackFactor(activeScenarios);
  inputs = {
    ...scenarioInputs,
    networkUtilization: applyScenarioStackToUtilization(scenarioInputs.networkUtilization, scenarioStackFactor),
  };

  const seasonalDelta = seasonalFreightUtilizationDelta(options?.seasonalDemandBand);
  if (seasonalDelta !== 0) {
    const freight = clamp((inputs.networkUtilization?.freight ?? 0.5) + seasonalDelta, 0.05, 1.15);
    inputs = {
      ...inputs,
      networkUtilization: { ...inputs.networkUtilization, freight },
    };
  }

  const climateApplied = applyClimateBandToInputs(inputs, options?.climateBand);
  inputs = climateApplied.inputs;
  const climateModifierFactor = climateApplied.climateModifierFactor;

  const pipeline = computePipelineUnlocks(options?.fundedPipelineStageIds);

  let productivity = computeNationalTransportProductivity(inputs);
  const ops = operationalAssets(inputs);

  const portRailCouplingByRegion = computePortRailCouplingByRegion(ops);
  const investmentTierByRegion = computeInvestmentTierByRegion(ops, portRailCouplingByRegion);

  const corridorActivations = evaluateAllCorridors(ops);
  const corridorSynergyPoints = totalCorridorSynergy(corridorActivations);
  const logisticsRelief = corridorLogisticsRelief(corridorActivations);

  const intermodalSynergyByRegion = computeIntermodalSynergyByRegion(ops);
  const resilienceScoreByRegion = computeResilienceScoreByRegion(ops, corridorActivations);

  for (const code of AU_REGION_CODES) {
    const synergy = intermodalSynergyByRegion[code];
    const tierMul = tierProductivityMultiplier(investmentTierByRegion[code]);
    const couplingBoost = (portRailCouplingByRegion[code] ?? 0) * 0.04;
    const resilienceBoost = (resilienceScoreByRegion[code] ?? 0) * 0.05;
    const corridorShare =
      corridorActivations
        .filter((c) => c.active)
        .reduce((s, c) => s + c.synergyPoints, 0) / Math.max(1, AU_REGION_CODES.length);
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + synergy + corridorShare * 0.15 + couplingBoost + resilienceBoost) *
      tierMul;
    productivity.byRegion[code].logisticsCostMultiplier = clamp(
      productivity.byRegion[code].logisticsCostMultiplier - logisticsRelief * 0.2 - couplingBoost * 0.002,
      0.5,
      1.05,
    );
  }

  productivity.nationalLogisticsCostMultiplier = clamp(
    productivity.nationalLogisticsCostMultiplier - logisticsRelief - pipeline.logisticsRelief,
    0.5,
    1.05,
  );

  const spilloverBonusByRegion = computeSpilloverBonusByRegion(
    ops,
    Object.fromEntries(AU_REGION_CODES.map((c) => [c, productivity.byRegion[c].productivityIndexBonus])) as Record<
      AuRegionCode,
      number
    >,
  );

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus += spilloverBonusByRegion[code];
    productivity.byRegion[code].productivityIndexBonus *= climateModifierFactor;
  }

  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints;

  const fleetCapacity = computeFleetCapacitySnapshot(ops);

  const freightLatencyByRegion = computeFreightLatencyByRegion(
    ops,
    inputs.networkUtilization?.freight ?? 0.5,
  );
  const nationalFreightLatencyMedian = nationalMedianFreightLatency(freightLatencyByRegion);

  const maintenanceWarnings = maintenanceWarningsFromBacklog(options?.maintenanceBacklogByAssetId);
  const bottleneckAssetIds = detectBottlenecks(productivity, ops, inputs);
  const recovery = computeDisruptionRecovery(ops, resilienceScoreByRegion, bottleneckAssetIds.length);

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus *= 0.92 + recovery.nationalRecoveryFactor * 0.08;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints;

  const supplyChain = computeSupplyChainResilienceIndex({
    resilienceScoreByRegion,
    freightLatencyByRegion,
    recoveryFactor: recovery.nationalRecoveryFactor,
    corridorSynergyPoints,
  });

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus += supplyChain.byRegion[code] * 2.5;
  }
  productivity.nationalProductivityIndexBonus += supplyChain.nationalIndex * 3;

  const modalBalanceIndex = computeModalBalanceIndex(ops, options?.modalShiftPolicy ?? 'balanced');
  const electrifiedFreightShare = computeElectrifiedFreightShare(ops);
  const lastMileCoverageByRegion = computeLastMileCoverageByRegion(ops);
  const nationalLastMile = nationalLastMileCoverage(lastMileCoverageByRegion);
  const intercapitalConnectivityIndex = computeIntercapitalConnectivityIndex(
    corridorActivations,
    TRANSPORT_CORRIDORS,
  );
  const connectivityBonus = connectivityBonusByRegion(corridorActivations, TRANSPORT_CORRIDORS);
  const modalMult = modalBalanceProductivityMultiplier(modalBalanceIndex, options?.modalShiftPolicy ?? 'balanced');

  for (const code of AU_REGION_CODES) {
    const lastMileBoost = (lastMileCoverageByRegion[code] - 50) * 0.015;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + connectivityBonus[code] + lastMileBoost) *
      modalMult *
      (1 + intercapitalConnectivityIndex * 0.04);
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5;

  const containerThroughputByRegion = computeContainerThroughputByRegion(ops);
  const nationalContainerThroughput = nationalContainerThroughputIndex(containerThroughputByRegion);
  const coldChainReliabilityByRegion = computeColdChainReliabilityByRegion(ops);
  const coldChainReliabilityIndex = nationalColdChainReliabilityIndex(coldChainReliabilityByRegion);
  const greenFreightShare = computeGreenFreightShare(ops, options?.greenFreightPolicy ?? 'baseline');
  const greenMult = greenFreightProductivityMultiplier(greenFreightShare, options?.greenFreightPolicy ?? 'baseline');

  for (const code of AU_REGION_CODES) {
    const throughputBoost = (containerThroughputByRegion[code] - 20) * 0.008;
    const coldBoost = (coldChainReliabilityByRegion[code] - 0.45) * 1.8;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + throughputBoost + coldBoost) * greenMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04;

  const freightUtil = inputs.networkUtilization?.freight ?? 0.5;
  const bulkExportThroughputByRegion = computeBulkExportThroughputByRegion(ops);
  const nationalBulkExport = nationalBulkExportThroughputIndex(bulkExportThroughputByRegion);
  const intermodalDwellByRegion = computeIntermodalDwellByRegion(ops, freightUtil);
  const nationalIntermodalDwell = nationalIntermodalDwellMedian(intermodalDwellByRegion);
  const dwellMult = dwellProductivityPenalty(nationalIntermodalDwell);
  const urbanCongestionByRegion = computeUrbanCongestionByRegion(ops, freightUtil);
  const nationalUrbanCongestion = nationalUrbanCongestionIndex(urbanCongestionByRegion);
  const congestionMult = congestionReliefMultiplier(
    nationalUrbanCongestion,
    options?.congestionReliefPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const bulkBoost = (bulkExportThroughputByRegion[code] - 18) * 0.007;
    const dwellPenalty = (intermodalDwellByRegion[code] - 30) * 0.012;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + bulkBoost - dwellPenalty) *
      dwellMult *
      congestionMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035;

  const aviationCargoThroughputByRegion = computeAviationCargoThroughputByRegion(ops);
  const nationalAviationCargo = nationalAviationCargoThroughputIndex(aviationCargoThroughputByRegion);
  const customsClearanceByRegion = computeCustomsClearanceByRegion(ops, freightUtil);
  const nationalCustomsClearance = nationalCustomsClearanceIndex(customsClearanceByRegion);
  const customsMult = customsClearanceProductivityMultiplier(
    nationalCustomsClearance,
    options?.customsModernizationPolicy ?? 'baseline',
  );
  const hydrogenCorridorThroughputByRegion = computeHydrogenCorridorThroughputByRegion(ops);
  const nationalHydrogenCorridor = nationalHydrogenCorridorThroughputIndex(hydrogenCorridorThroughputByRegion);
  const hydrogenFreightShare = computeHydrogenFreightShare(ops, options?.hydrogenFreightPolicy ?? 'baseline');
  const hydrogenMult = hydrogenFreightProductivityMultiplier(
    hydrogenFreightShare,
    options?.hydrogenFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const aviationBoost = (aviationCargoThroughputByRegion[code] - 12) * 0.006;
    const customsBoost = (customsClearanceByRegion[code] - 40) * 0.005;
    const hydrogenBoost = (hydrogenCorridorThroughputByRegion[code] - 8) * 0.007;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + aviationBoost + customsBoost + hydrogenBoost) *
      customsMult *
      hydrogenMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028;

  const coastalShippingThroughputByRegion = computeCoastalShippingThroughputByRegion(ops);
  const nationalCoastalShipping = nationalCoastalShippingThroughputIndex(coastalShippingThroughputByRegion);
  const coastalMult = coastalShippingProductivityMultiplier(
    nationalCoastalShipping,
    options?.coastalShippingPolicy ?? 'baseline',
  );
  const biosecurityClearanceByRegion = computeBiosecurityClearanceByRegion(ops, freightUtil);
  const nationalBiosecurityClearance = nationalBiosecurityClearanceIndex(biosecurityClearanceByRegion);
  const biosecurityMult = biosecurityClearanceProductivityMultiplier(
    nationalBiosecurityClearance,
    options?.biosecurityStreamlinePolicy ?? 'baseline',
  );
  const autonomousCorridorThroughputByRegion = computeAutonomousCorridorThroughputByRegion(ops);
  const nationalAutonomousCorridor = nationalAutonomousCorridorThroughputIndex(autonomousCorridorThroughputByRegion);
  const autonomousFreightShare = computeAutonomousFreightShare(
    ops,
    options?.autonomousFreightPolicy ?? 'baseline',
  );
  const autonomousMult = autonomousFreightProductivityMultiplier(
    autonomousFreightShare,
    options?.autonomousFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const coastalBoost = (coastalShippingThroughputByRegion[code] - 10) * 0.006;
    const biosecurityBoost = (biosecurityClearanceByRegion[code] - 40) * 0.0045;
    const autonomousBoost = (autonomousCorridorThroughputByRegion[code] - 6) * 0.0065;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + coastalBoost + biosecurityBoost + autonomousBoost) *
      coastalMult *
      biosecurityMult *
      autonomousMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024;

  const networkStress = aggregateNetworkStress(inputs.networkUtilization);
  const deepSeaGatewayThroughputByRegion = computeDeepSeaGatewayThroughputByRegion(ops);
  const nationalDeepSeaGateway = nationalDeepSeaGatewayThroughputIndex(deepSeaGatewayThroughputByRegion);
  const deepSeaMult = deepSeaGatewayProductivityMultiplier(
    nationalDeepSeaGateway,
    options?.deepSeaGatewayPolicy ?? 'baseline',
  );
  const infrastructurePermittingByRegion = computeInfrastructurePermittingByRegion(ops, networkStress);
  const nationalInfrastructurePermitting = nationalInfrastructurePermittingIndex(infrastructurePermittingByRegion);
  const permittingMult = infrastructurePermittingProductivityMultiplier(
    nationalInfrastructurePermitting,
    options?.permittingStreamlinePolicy ?? 'baseline',
  );
  const electricCorridorThroughputByRegion = computeElectricCorridorThroughputByRegion(ops);
  const nationalElectricCorridor = nationalElectricCorridorThroughputIndex(electricCorridorThroughputByRegion);
  const electricFreightShare = computeElectricFreightShare(ops, options?.electricFreightPolicy ?? 'baseline');
  const electricMult = electricFreightProductivityMultiplier(
    electricFreightShare,
    options?.electricFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const deepSeaBoost = (deepSeaGatewayThroughputByRegion[code] - 12) * 0.006;
    const permittingBoost = (infrastructurePermittingByRegion[code] - 42) * 0.004;
    const electricBoost = (electricCorridorThroughputByRegion[code] - 5) * 0.006;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + deepSeaBoost + permittingBoost + electricBoost) *
      deepSeaMult *
      permittingMult *
      electricMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023;

  const climateStress = aggregateNetworkStress(inputs.networkUtilization);
  const defenceLogisticsReadinessByRegion = computeDefenceLogisticsReadinessByRegion(ops);
  const nationalDefenceLogistics = nationalDefenceLogisticsReadinessIndex(defenceLogisticsReadinessByRegion);
  const defenceMult = defenceLogisticsProductivityMultiplier(
    nationalDefenceLogistics,
    options?.defenceMobilityPolicy ?? 'baseline',
  );
  const weatherResilienceRoutingByRegion = computeWeatherResilienceRoutingByRegion(ops, climateStress);
  const nationalWeatherResilience = nationalWeatherResilienceRoutingIndex(weatherResilienceRoutingByRegion);
  const weatherMult = weatherResilienceProductivityMultiplier(
    nationalWeatherResilience,
    options?.weatherResiliencePolicy ?? 'baseline',
  );
  const digitalFreightThroughputByRegion = computeDigitalFreightThroughputByRegion(ops);
  const nationalDigitalFreight = nationalDigitalFreightThroughputIndex(digitalFreightThroughputByRegion);
  const digitalFreightVisibilityShare = computeDigitalFreightVisibilityShare(
    ops,
    options?.digitalFreightPolicy ?? 'baseline',
  );
  const digitalMult = digitalFreightProductivityMultiplier(
    digitalFreightVisibilityShare,
    options?.digitalFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const defenceBoost = (defenceLogisticsReadinessByRegion[code] - 8) * 0.0055;
    const weatherBoost = (weatherResilienceRoutingByRegion[code] - 38) * 0.0042;
    const digitalBoost = (digitalFreightThroughputByRegion[code] - 4) * 0.0058;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + defenceBoost + weatherBoost + digitalBoost) *
      defenceMult *
      weatherMult *
      digitalMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021;

  const tradeUtil = inputs.networkUtilization?.trade ?? freightUtil;
  const criticalMineralsExportByRegion = computeCriticalMineralsExportByRegion(ops);
  const nationalCriticalMinerals = nationalCriticalMineralsExportIndex(criticalMineralsExportByRegion);
  const mineralsMult = criticalMineralsProductivityMultiplier(
    nationalCriticalMinerals,
    options?.criticalMineralsPolicy ?? 'baseline',
  );
  const channelMaintenanceByRegion = computeChannelMaintenanceByRegion(ops, tradeUtil);
  const nationalChannelMaintenance = nationalChannelMaintenanceIndex(channelMaintenanceByRegion);
  const channelMult = channelMaintenanceProductivityMultiplier(
    nationalChannelMaintenance,
    options?.channelMaintenancePolicy ?? 'baseline',
  );
  const indigenousRemoteSupplyThroughputByRegion = computeIndigenousRemoteSupplyThroughputByRegion(ops);
  const nationalIndigenousRemoteSupply = nationalIndigenousRemoteSupplyThroughputIndex(
    indigenousRemoteSupplyThroughputByRegion,
  );
  const indigenousRemoteSupplyShare = computeIndigenousRemoteSupplyShare(
    ops,
    options?.indigenousRemoteSupplyPolicy ?? 'baseline',
  );
  const indigenousMult = indigenousRemoteSupplyProductivityMultiplier(
    indigenousRemoteSupplyShare,
    options?.indigenousRemoteSupplyPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const mineralsBoost = (criticalMineralsExportByRegion[code] - 9) * 0.0058;
    const channelBoost = (channelMaintenanceByRegion[code] - 42) * 0.004;
    const indigenousBoost = (indigenousRemoteSupplyThroughputByRegion[code] - 3) * 0.0055;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + mineralsBoost + channelBoost + indigenousBoost) *
      mineralsMult *
      channelMult *
      indigenousMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019;

  const gaugeInteroperabilityByRegion = computeGaugeInteroperabilityByRegion(ops);
  const nationalGaugeInteroperability = nationalGaugeInteroperabilityIndex(gaugeInteroperabilityByRegion);
  const gaugeMult = gaugeInteroperabilityProductivityMultiplier(
    nationalGaugeInteroperability,
    options?.gaugeInteroperabilityPolicy ?? 'baseline',
  );
  const disasterRecoveryStagingByRegion = computeDisasterRecoveryStagingByRegion(ops, networkStress);
  const nationalDisasterRecoveryStaging = nationalDisasterRecoveryStagingIndex(disasterRecoveryStagingByRegion);
  const disasterMult = disasterRecoveryStagingProductivityMultiplier(
    nationalDisasterRecoveryStaging,
    options?.disasterRecoveryStagingPolicy ?? 'baseline',
  );
  const circularFreightThroughputByRegion = computeCircularFreightThroughputByRegion(ops);
  const nationalCircularFreight = nationalCircularFreightThroughputIndex(circularFreightThroughputByRegion);
  const circularFreightShare = computeCircularFreightShare(ops, options?.circularFreightPolicy ?? 'baseline');
  const circularMult = circularFreightProductivityMultiplier(
    circularFreightShare,
    options?.circularFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const gaugeBoost = (gaugeInteroperabilityByRegion[code] - 12) * 0.005;
    const disasterBoost = (disasterRecoveryStagingByRegion[code] - 36) * 0.0043;
    const circularBoost = (circularFreightThroughputByRegion[code] - 3) * 0.0055;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + gaugeBoost + disasterBoost + circularBoost) *
      gaugeMult *
      disasterMult *
      circularMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018;

  const agriculturalExportThroughputByRegion = computeAgriculturalExportThroughputByRegion(ops);
  const nationalAgriculturalExport = nationalAgriculturalExportThroughputIndex(agriculturalExportThroughputByRegion);
  const agriculturalMult = agriculturalExportProductivityMultiplier(
    nationalAgriculturalExport,
    options?.agriculturalExportPolicy ?? 'baseline',
  );
  const trackPossessionEfficiencyByRegion = computeTrackPossessionEfficiencyByRegion(ops, networkStress);
  const nationalTrackPossession = nationalTrackPossessionEfficiencyIndex(trackPossessionEfficiencyByRegion);
  const trackPossessionMult = trackPossessionProductivityMultiplier(
    nationalTrackPossession,
    options?.trackPossessionPolicy ?? 'baseline',
  );
  const greenBunkeringThroughputByRegion = computeGreenBunkeringThroughputByRegion(ops);
  const nationalGreenBunkering = nationalGreenBunkeringThroughputIndex(greenBunkeringThroughputByRegion);
  const greenBunkeringShare = computeGreenBunkeringShare(ops, options?.greenBunkeringPolicy ?? 'baseline');
  const greenBunkeringMult = greenBunkeringProductivityMultiplier(
    greenBunkeringShare,
    options?.greenBunkeringPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const agriculturalBoost = (agriculturalExportThroughputByRegion[code] - 8) * 0.0056;
    const trackBoost = (trackPossessionEfficiencyByRegion[code] - 38) * 0.0041;
    const bunkeringBoost = (greenBunkeringThroughputByRegion[code] - 3) * 0.0054;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + agriculturalBoost + trackBoost + bunkeringBoost) *
      agriculturalMult *
      trackPossessionMult *
      greenBunkeringMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017;

  const pacificFeederThroughputByRegion = computePacificFeederThroughputByRegion(ops);
  const nationalPacificFeeder = nationalPacificFeederThroughputIndex(pacificFeederThroughputByRegion);
  const pacificMult = pacificFeederProductivityMultiplier(
    nationalPacificFeeder,
    options?.pacificFeederPolicy ?? 'baseline',
  );
  const medicalSupplyChainByRegion = computeMedicalSupplyChainByRegion(ops, networkStress);
  const nationalMedicalSupply = nationalMedicalSupplyChainIndex(medicalSupplyChainByRegion);
  const medicalMult = medicalSupplyProductivityMultiplier(
    nationalMedicalSupply,
    options?.medicalSupplyPolicy ?? 'baseline',
  );
  const dataCentreLogisticsThroughputByRegion = computeDataCentreLogisticsThroughputByRegion(ops);
  const nationalDataCentreLogistics = nationalDataCentreLogisticsThroughputIndex(
    dataCentreLogisticsThroughputByRegion,
  );
  const dataCentreLogisticsShare = computeDataCentreLogisticsShare(
    ops,
    options?.dataCentreLogisticsPolicy ?? 'baseline',
  );
  const dataCentreMult = dataCentreLogisticsProductivityMultiplier(
    dataCentreLogisticsShare,
    options?.dataCentreLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const pacificBoost = (pacificFeederThroughputByRegion[code] - 7) * 0.0055;
    const medicalBoost = (medicalSupplyChainByRegion[code] - 36) * 0.0044;
    const dataCentreBoost = (dataCentreLogisticsThroughputByRegion[code] - 3) * 0.0056;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + pacificBoost + medicalBoost + dataCentreBoost) *
      pacificMult *
      medicalMult *
      dataCentreMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017 +
    nationalPacificFeeder * 0.019 +
    nationalDataCentreLogistics * 0.018;

  const offshoreWindLogisticsByRegion = computeOffshoreWindLogisticsByRegion(ops);
  const nationalOffshoreWind = nationalOffshoreWindLogisticsIndex(offshoreWindLogisticsByRegion);
  const offshoreMult = offshoreWindLogisticsProductivityMultiplier(
    nationalOffshoreWind,
    options?.offshoreWindLogisticsPolicy ?? 'baseline',
  );
  const batterySupplyChainByRegion = computeBatterySupplyChainByRegion(ops, networkStress);
  const nationalBatterySupply = nationalBatterySupplyChainIndex(batterySupplyChainByRegion);
  const batteryMult = batterySupplyProductivityMultiplier(
    nationalBatterySupply,
    options?.batterySupplyChainPolicy ?? 'baseline',
  );
  const cruiseTurnaroundThroughputByRegion = computeCruiseTurnaroundThroughputByRegion(ops);
  const nationalCruiseTurnaround = nationalCruiseTurnaroundThroughputIndex(cruiseTurnaroundThroughputByRegion);
  const cruiseTurnaroundShare = computeCruiseTurnaroundShare(
    ops,
    options?.cruiseTurnaroundPolicy ?? 'baseline',
  );
  const cruiseMult = cruiseTurnaroundProductivityMultiplier(
    cruiseTurnaroundShare,
    options?.cruiseTurnaroundPolicy ?? 'baseline',
  );
  const subseaCableLandingByRegion = computeSubseaCableLandingByRegion(ops);
  const nationalSubseaCable = nationalSubseaCableLandingIndex(subseaCableLandingByRegion);
  const subseaMult = subseaCableLandingProductivityMultiplier(
    nationalSubseaCable,
    options?.subseaCableLandingPolicy ?? 'baseline',
  );
  const greenAmmoniaExportByRegion = computeGreenAmmoniaExportByRegion(ops, networkStress);
  const nationalGreenAmmonia = nationalGreenAmmoniaExportIndex(greenAmmoniaExportByRegion);
  const ammoniaMult = greenAmmoniaExportProductivityMultiplier(
    nationalGreenAmmonia,
    options?.greenAmmoniaExportPolicy ?? 'baseline',
  );
  const airportExpressRailThroughputByRegion = computeAirportExpressRailThroughputByRegion(ops);
  const nationalAirportExpress = nationalAirportExpressRailThroughputIndex(airportExpressRailThroughputByRegion);
  const airportExpressRailShare = computeAirportExpressRailShare(
    ops,
    options?.airportExpressRailPolicy ?? 'baseline',
  );
  const airportExpressMult = airportExpressRailProductivityMultiplier(
    airportExpressRailShare,
    options?.airportExpressRailPolicy ?? 'baseline',
  );
  const lithiumBrineExportByRegion = computeLithiumBrineExportByRegion(ops);
  const nationalLithiumBrine = nationalLithiumBrineExportIndex(lithiumBrineExportByRegion);
  const lithiumMult = lithiumBrineExportProductivityMultiplier(
    nationalLithiumBrine,
    options?.lithiumBrineExportPolicy ?? 'baseline',
  );
  const inlandRailExpressByRegion = computeInlandRailExpressByRegion(ops, networkStress);
  const nationalInlandRailExpress = nationalInlandRailExpressIndex(inlandRailExpressByRegion);
  const inlandRailExpressShare = computeInlandRailExpressShare(
    ops,
    options?.inlandRailExpressPolicy ?? 'baseline',
  );
  const inlandExpressMult = inlandRailExpressProductivityMultiplier(
    inlandRailExpressShare,
    options?.inlandRailExpressPolicy ?? 'baseline',
  );
  const spaceLaunchLogisticsThroughputByRegion = computeSpaceLaunchLogisticsThroughputByRegion(ops);
  const nationalSpaceLaunch = nationalSpaceLaunchLogisticsThroughputIndex(spaceLaunchLogisticsThroughputByRegion);
  const spaceLaunchLogisticsShare = computeSpaceLaunchLogisticsShare(
    ops,
    options?.spaceLaunchLogisticsPolicy ?? 'baseline',
  );
  const spaceLaunchMult = spaceLaunchLogisticsProductivityMultiplier(
    spaceLaunchLogisticsShare,
    options?.spaceLaunchLogisticsPolicy ?? 'baseline',
  );
  const rareEarthMagnetExportByRegion = computeRareEarthMagnetExportByRegion(ops);
  const nationalRareEarthMagnet = nationalRareEarthMagnetExportIndex(rareEarthMagnetExportByRegion);
  const rareEarthMult = rareEarthMagnetExportProductivityMultiplier(
    nationalRareEarthMagnet,
    options?.rareEarthMagnetExportPolicy ?? 'baseline',
  );
  const transTasmanReeferExpressByRegion = computeTransTasmanReeferExpressByRegion(ops, networkStress);
  const nationalTransTasmanReefer = nationalTransTasmanReeferExpressIndex(transTasmanReeferExpressByRegion);
  const transTasmanReeferExpressShare = computeTransTasmanReeferExpressShare(
    ops,
    options?.transTasmanReeferExpressPolicy ?? 'baseline',
  );
  const reeferMult = transTasmanReeferExpressProductivityMultiplier(
    transTasmanReeferExpressShare,
    options?.transTasmanReeferExpressPolicy ?? 'baseline',
  );
  const zeroEmissionTruckCorridorThroughputByRegion = computeZeroEmissionTruckCorridorThroughputByRegion(ops);
  const nationalZeroEmissionTruck = nationalZeroEmissionTruckCorridorThroughputIndex(
    zeroEmissionTruckCorridorThroughputByRegion,
  );
  const zeroEmissionTruckCorridorShare = computeZeroEmissionTruckCorridorShare(
    ops,
    options?.zeroEmissionTruckCorridorPolicy ?? 'baseline',
  );
  const zetMult = zeroEmissionTruckCorridorProductivityMultiplier(
    zeroEmissionTruckCorridorShare,
    options?.zeroEmissionTruckCorridorPolicy ?? 'baseline',
  );
  const offshoreCcsLogisticsByRegion = computeOffshoreCcsLogisticsByRegion(ops);
  const nationalOffshoreCcs = nationalOffshoreCcsLogisticsIndex(offshoreCcsLogisticsByRegion);
  const ccsMult = offshoreCcsLogisticsProductivityMultiplier(
    nationalOffshoreCcs,
    options?.offshoreCcsLogisticsPolicy ?? 'baseline',
  );
  const hydrogenLngExportByRegion = computeHydrogenLngExportByRegion(ops, networkStress);
  const nationalHydrogenLng = nationalHydrogenLngExportIndex(hydrogenLngExportByRegion);
  const h2LngMult = hydrogenLngExportProductivityMultiplier(
    nationalHydrogenLng,
    options?.hydrogenLngExportPolicy ?? 'baseline',
  );
  const urbanMicrofreightHubThroughputByRegion = computeUrbanMicrofreightHubThroughputByRegion(ops);
  const nationalUrbanMicrofreight = nationalUrbanMicrofreightHubThroughputIndex(
    urbanMicrofreightHubThroughputByRegion,
  );
  const urbanMicrofreightHubShare = computeUrbanMicrofreightHubShare(
    ops,
    options?.urbanMicrofreightHubPolicy ?? 'baseline',
  );
  const microfreightMult = urbanMicrofreightHubProductivityMultiplier(
    urbanMicrofreightHubShare,
    options?.urbanMicrofreightHubPolicy ?? 'baseline',
  );
  const floatingOffshoreWindStagingByRegion = computeFloatingOffshoreWindStagingByRegion(ops);
  const nationalFloatingWindStaging = nationalFloatingOffshoreWindStagingIndex(
    floatingOffshoreWindStagingByRegion,
  );
  const floatingWindMult = floatingOffshoreWindStagingProductivityMultiplier(
    nationalFloatingWindStaging,
    options?.floatingOffshoreWindStagingPolicy ?? 'baseline',
  );
  const criticalMedicineAirliftByRegion = computeCriticalMedicineAirliftByRegion(ops, networkStress);
  const nationalCriticalMedicineAirlift = nationalCriticalMedicineAirliftIndex(criticalMedicineAirliftByRegion);
  const criticalMedicineAirliftShare = computeCriticalMedicineAirliftShare(
    ops,
    options?.criticalMedicineAirliftPolicy ?? 'baseline',
  );
  const medicineAirliftMult = criticalMedicineAirliftProductivityMultiplier(
    criticalMedicineAirliftShare,
    options?.criticalMedicineAirliftPolicy ?? 'baseline',
  );
  const regionalFreightDroneThroughputByRegion = computeRegionalFreightDroneThroughputByRegion(ops);
  const nationalRegionalFreightDrone = nationalRegionalFreightDroneThroughputIndex(
    regionalFreightDroneThroughputByRegion,
  );
  const regionalFreightDroneShare = computeRegionalFreightDroneShare(
    ops,
    options?.regionalFreightDronePolicy ?? 'baseline',
  );
  const freightDroneMult = regionalFreightDroneProductivityMultiplier(
    regionalFreightDroneShare,
    options?.regionalFreightDronePolicy ?? 'baseline',
  );
  const gridBatteryLogisticsByRegion = computeGridBatteryLogisticsByRegion(ops);
  const nationalGridBattery = nationalGridBatteryLogisticsIndex(gridBatteryLogisticsByRegion);
  const gridBatteryMult = gridBatteryLogisticsProductivityMultiplier(
    nationalGridBattery,
    options?.gridBatteryLogisticsPolicy ?? 'baseline',
  );
  const pacificHumanitarianSealiftByRegion = computePacificHumanitarianSealiftByRegion(ops, networkStress);
  const nationalPacificSealift = nationalPacificHumanitarianSealiftIndex(pacificHumanitarianSealiftByRegion);
  const pacificHumanitarianSealiftShare = computePacificHumanitarianSealiftShare(
    ops,
    options?.pacificHumanitarianSealiftPolicy ?? 'baseline',
  );
  const sealiftMult = pacificHumanitarianSealiftProductivityMultiplier(
    pacificHumanitarianSealiftShare,
    options?.pacificHumanitarianSealiftPolicy ?? 'baseline',
  );
  const autonomousPortTractorThroughputByRegion = computeAutonomousPortTractorThroughputByRegion(ops);
  const nationalAutonomousPortTractor = nationalAutonomousPortTractorThroughputIndex(
    autonomousPortTractorThroughputByRegion,
  );
  const autonomousPortTractorShare = computeAutonomousPortTractorShare(
    ops,
    options?.autonomousPortTractorPolicy ?? 'baseline',
  );
  const portTractorMult = autonomousPortTractorProductivityMultiplier(
    autonomousPortTractorShare,
    options?.autonomousPortTractorPolicy ?? 'baseline',
  );
  const autonomousHeavyHaulByRegion = computeAutonomousHeavyHaulByRegion(ops);
  const nationalAutonomousHeavyHaul = nationalAutonomousHeavyHaulIndex(autonomousHeavyHaulByRegion);
  const heavyHaulMult = autonomousHeavyHaulProductivityMultiplier(
    nationalAutonomousHeavyHaul,
    options?.autonomousHeavyHaulPolicy ?? 'baseline',
  );
  const gbrBiosecurityLogisticsByRegion = computeGbrBiosecurityLogisticsByRegion(ops, networkStress);
  const nationalGbrBiosecurity = nationalGbrBiosecurityLogisticsIndex(gbrBiosecurityLogisticsByRegion);
  const gbrBiosecurityLogisticsShare = computeGbrBiosecurityLogisticsShare(
    ops,
    options?.gbrBiosecurityLogisticsPolicy ?? 'baseline',
  );
  const gbrMult = gbrBiosecurityLogisticsProductivityMultiplier(
    gbrBiosecurityLogisticsShare,
    options?.gbrBiosecurityLogisticsPolicy ?? 'baseline',
  );
  const nightUrbanFreightWindowThroughputByRegion = computeNightUrbanFreightWindowThroughputByRegion(ops);
  const nationalNightUrbanFreight = nationalNightUrbanFreightWindowThroughputIndex(
    nightUrbanFreightWindowThroughputByRegion,
  );
  const nightUrbanFreightWindowShare = computeNightUrbanFreightWindowShare(
    ops,
    options?.nightUrbanFreightWindowPolicy ?? 'baseline',
  );
  const nightFreightMult = nightUrbanFreightWindowProductivityMultiplier(
    nightUrbanFreightWindowShare,
    options?.nightUrbanFreightWindowPolicy ?? 'baseline',
  );
  const methanolBunkeringExportByRegion = computeMethanolBunkeringExportByRegion(ops);
  const nationalMethanolBunkering = nationalMethanolBunkeringExportIndex(methanolBunkeringExportByRegion);
  const methanolMult = methanolBunkeringExportProductivityMultiplier(
    nationalMethanolBunkering,
    options?.methanolBunkeringExportPolicy ?? 'baseline',
  );
  const antarcticResupplyLogisticsByRegion = computeAntarcticResupplyLogisticsByRegion(ops, networkStress);
  const nationalAntarcticResupply = nationalAntarcticResupplyLogisticsIndex(antarcticResupplyLogisticsByRegion);
  const antarcticResupplyLogisticsShare = computeAntarcticResupplyLogisticsShare(
    ops,
    options?.antarcticResupplyLogisticsPolicy ?? 'baseline',
  );
  const antarcticMult = antarcticResupplyLogisticsProductivityMultiplier(
    antarcticResupplyLogisticsShare,
    options?.antarcticResupplyLogisticsPolicy ?? 'baseline',
  );
  const smartBorderPreclearanceThroughputByRegion = computeSmartBorderPreclearanceThroughputByRegion(ops);
  const nationalSmartBorderPreclearance = nationalSmartBorderPreclearanceThroughputIndex(
    smartBorderPreclearanceThroughputByRegion,
  );
  const smartBorderPreclearanceShare = computeSmartBorderPreclearanceShare(
    ops,
    options?.smartBorderPreclearancePolicy ?? 'baseline',
  );
  const smartBorderMult = smartBorderPreclearanceProductivityMultiplier(
    smartBorderPreclearanceShare,
    options?.smartBorderPreclearancePolicy ?? 'baseline',
  );
  const sustainableAviationFuelSupplyByRegion = computeSustainableAviationFuelSupplyByRegion(ops);
  const nationalSafSupply = nationalSustainableAviationFuelSupplyIndex(sustainableAviationFuelSupplyByRegion);
  const safMult = sustainableAviationFuelSupplyProductivityMultiplier(
    nationalSafSupply,
    options?.sustainableAviationFuelSupplyPolicy ?? 'baseline',
  );
  const outbackDieselSecurityByRegion = computeOutbackDieselSecurityByRegion(ops, networkStress);
  const nationalOutbackDiesel = nationalOutbackDieselSecurityIndex(outbackDieselSecurityByRegion);
  const outbackDieselSecurityShare = computeOutbackDieselSecurityShare(
    ops,
    options?.outbackDieselSecurityPolicy ?? 'baseline',
  );
  const outbackDieselMult = outbackDieselSecurityProductivityMultiplier(
    outbackDieselSecurityShare,
    options?.outbackDieselSecurityPolicy ?? 'baseline',
  );
  const railDoubleStackContainerThroughputByRegion = computeRailDoubleStackContainerThroughputByRegion(ops);
  const nationalRailDoubleStack = nationalRailDoubleStackContainerThroughputIndex(
    railDoubleStackContainerThroughputByRegion,
  );
  const railDoubleStackContainerShare = computeRailDoubleStackContainerShare(
    ops,
    options?.railDoubleStackContainerPolicy ?? 'baseline',
  );
  const doubleStackMult = railDoubleStackContainerProductivityMultiplier(
    railDoubleStackContainerShare,
    options?.railDoubleStackContainerPolicy ?? 'baseline',
  );
  const greenSteelExportByRegion = computeGreenSteelExportByRegion(ops);
  const nationalGreenSteel = nationalGreenSteelExportIndex(greenSteelExportByRegion);
  const greenSteelMult = greenSteelExportProductivityMultiplier(
    nationalGreenSteel,
    options?.greenSteelExportPolicy ?? 'baseline',
  );
  const indigenousCommunityAirliftByRegion = computeIndigenousCommunityAirliftByRegion(ops, networkStress);
  const nationalIndigenousAirlift = nationalIndigenousCommunityAirliftIndex(indigenousCommunityAirliftByRegion);
  const indigenousCommunityAirliftShare = computeIndigenousCommunityAirliftShare(
    ops,
    options?.indigenousCommunityAirliftPolicy ?? 'baseline',
  );
  const indigenousAirliftMult = indigenousCommunityAirliftProductivityMultiplier(
    indigenousCommunityAirliftShare,
    options?.indigenousCommunityAirliftPolicy ?? 'baseline',
  );
  const portBerthSlotOptimizerThroughputByRegion = computePortBerthSlotOptimizerThroughputByRegion(ops);
  const nationalPortBerthSlot = nationalPortBerthSlotOptimizerThroughputIndex(
    portBerthSlotOptimizerThroughputByRegion,
  );
  const portBerthSlotOptimizerShare = computePortBerthSlotOptimizerShare(
    ops,
    options?.portBerthSlotOptimizerPolicy ?? 'baseline',
  );
  const berthSlotMult = portBerthSlotOptimizerProductivityMultiplier(
    portBerthSlotOptimizerShare,
    options?.portBerthSlotOptimizerPolicy ?? 'baseline',
  );
  const offshoreWindTowInstallByRegion = computeOffshoreWindTowInstallByRegion(ops);
  const nationalWindTow = nationalOffshoreWindTowInstallIndex(offshoreWindTowInstallByRegion);
  const windTowMult = offshoreWindTowInstallProductivityMultiplier(
    nationalWindTow,
    options?.offshoreWindTowInstallPolicy ?? 'baseline',
  );
  const evBatteryRecyclingLogisticsByRegion = computeEvBatteryRecyclingLogisticsByRegion(ops, networkStress);
  const nationalEvBatteryRecycle = nationalEvBatteryRecyclingLogisticsIndex(evBatteryRecyclingLogisticsByRegion);
  const evBatteryRecyclingLogisticsShare = computeEvBatteryRecyclingLogisticsShare(
    ops,
    options?.evBatteryRecyclingLogisticsPolicy ?? 'baseline',
  );
  const evBatteryMult = evBatteryRecyclingLogisticsProductivityMultiplier(
    evBatteryRecyclingLogisticsShare,
    options?.evBatteryRecyclingLogisticsPolicy ?? 'baseline',
  );
  const urbanCourierMicrohubThroughputByRegion = computeUrbanCourierMicrohubThroughputByRegion(ops);
  const nationalUrbanCourierMicrohub = nationalUrbanCourierMicrohubThroughputIndex(
    urbanCourierMicrohubThroughputByRegion,
  );
  const urbanCourierMicrohubShare = computeUrbanCourierMicrohubShare(
    ops,
    options?.urbanCourierMicrohubPolicy ?? 'baseline',
  );
  const courierMicrohubMult = urbanCourierMicrohubProductivityMultiplier(
    urbanCourierMicrohubShare,
    options?.urbanCourierMicrohubPolicy ?? 'baseline',
  );
  const copperConcentrateExportByRegion = computeCopperConcentrateExportByRegion(ops);
  const nationalCopperConcentrate = nationalCopperConcentrateExportIndex(copperConcentrateExportByRegion);
  const copperMult = copperConcentrateExportProductivityMultiplier(
    nationalCopperConcentrate,
    options?.copperConcentrateExportPolicy ?? 'baseline',
  );
  const pharmaceuticalColdChainByRegion = computePharmaceuticalColdChainByRegion(ops, networkStress);
  const nationalPharmaColdChain = nationalPharmaceuticalColdChainIndex(pharmaceuticalColdChainByRegion);
  const pharmaceuticalColdChainShare = computePharmaceuticalColdChainShare(
    ops,
    options?.pharmaceuticalColdChainPolicy ?? 'baseline',
  );
  const pharmaColdChainMult = pharmaceuticalColdChainProductivityMultiplier(
    pharmaceuticalColdChainShare,
    options?.pharmaceuticalColdChainPolicy ?? 'baseline',
  );
  const railPassengerFreightPathThroughputByRegion = computeRailPassengerFreightPathThroughputByRegion(ops);
  const nationalPaxFreightPath = nationalRailPassengerFreightPathThroughputIndex(
    railPassengerFreightPathThroughputByRegion,
  );
  const railPassengerFreightPathShare = computeRailPassengerFreightPathShare(
    ops,
    options?.railPassengerFreightPathPolicy ?? 'baseline',
  );
  const paxFreightPathMult = railPassengerFreightPathProductivityMultiplier(
    railPassengerFreightPathShare,
    options?.railPassengerFreightPathPolicy ?? 'baseline',
  );
  const aluminaRefineryExportByRegion = computeAluminaRefineryExportByRegion(ops);
  const nationalAluminaRefinery = nationalAluminaRefineryExportIndex(aluminaRefineryExportByRegion);
  const aluminaMult = aluminaRefineryExportProductivityMultiplier(
    nationalAluminaRefinery,
    options?.aluminaRefineryExportPolicy ?? 'baseline',
  );
  const disasterReliefAirBridgeByRegion = computeDisasterReliefAirBridgeByRegion(ops, networkStress);
  const nationalDisasterReliefAir = nationalDisasterReliefAirBridgeIndex(disasterReliefAirBridgeByRegion);
  const disasterReliefAirBridgeShare = computeDisasterReliefAirBridgeShare(
    ops,
    options?.disasterReliefAirBridgePolicy ?? 'baseline',
  );
  const reliefAirMult = disasterReliefAirBridgeProductivityMultiplier(
    disasterReliefAirBridgeShare,
    options?.disasterReliefAirBridgePolicy ?? 'baseline',
  );
  const containerYardAutomationThroughputByRegion = computeContainerYardAutomationThroughputByRegion(ops);
  const nationalContainerYardAuto = nationalContainerYardAutomationThroughputIndex(
    containerYardAutomationThroughputByRegion,
  );
  const containerYardAutomationShare = computeContainerYardAutomationShare(
    ops,
    options?.containerYardAutomationPolicy ?? 'baseline',
  );
  const yardAutoMult = containerYardAutomationProductivityMultiplier(
    containerYardAutomationShare,
    options?.containerYardAutomationPolicy ?? 'baseline',
  );
  const nickelCobaltBatteryPrecursorByRegion = computeNickelCobaltBatteryPrecursorByRegion(ops);
  const nationalNickelPrecursor = nationalNickelCobaltBatteryPrecursorIndex(nickelCobaltBatteryPrecursorByRegion);
  const nickelPrecursorMult = nickelCobaltBatteryPrecursorProductivityMultiplier(
    nationalNickelPrecursor,
    options?.nickelCobaltBatteryPrecursorPolicy ?? 'baseline',
  );
  const remoteIslandSealiftByRegion = computeRemoteIslandSealiftByRegion(ops, networkStress);
  const nationalRemoteSealift = nationalRemoteIslandSealiftIndex(remoteIslandSealiftByRegion);
  const remoteIslandSealiftShare = computeRemoteIslandSealiftShare(
    ops,
    options?.remoteIslandSealiftPolicy ?? 'baseline',
  );
  const remoteSealiftMult = remoteIslandSealiftProductivityMultiplier(
    remoteIslandSealiftShare,
    options?.remoteIslandSealiftPolicy ?? 'baseline',
  );
  const railInlandTerminalAutomationThroughputByRegion =
    computeRailInlandTerminalAutomationThroughputByRegion(ops);
  const nationalInlandTerminalAuto = nationalRailInlandTerminalAutomationThroughputIndex(
    railInlandTerminalAutomationThroughputByRegion,
  );
  const railInlandTerminalAutomationShare = computeRailInlandTerminalAutomationShare(
    ops,
    options?.railInlandTerminalAutomationPolicy ?? 'baseline',
  );
  const inlandTerminalAutoMult = railInlandTerminalAutomationProductivityMultiplier(
    railInlandTerminalAutomationShare,
    options?.railInlandTerminalAutomationPolicy ?? 'baseline',
  );
  const graphiteBatteryAnodeExportByRegion = computeGraphiteBatteryAnodeExportByRegion(ops);
  const nationalGraphiteAnode = nationalGraphiteBatteryAnodeExportIndex(graphiteBatteryAnodeExportByRegion);
  const graphiteAnodeMult = graphiteBatteryAnodeExportProductivityMultiplier(
    nationalGraphiteAnode,
    options?.graphiteBatteryAnodeExportPolicy ?? 'baseline',
  );
  const cycloneResilientCoastalFreightByRegion = computeCycloneResilientCoastalFreightByRegion(ops, networkStress);
  const nationalCycloneCoastal = nationalCycloneResilientCoastalFreightIndex(cycloneResilientCoastalFreightByRegion);
  const cycloneResilientCoastalFreightShare = computeCycloneResilientCoastalFreightShare(
    ops,
    options?.cycloneResilientCoastalFreightPolicy ?? 'baseline',
  );
  const cycloneCoastalMult = cycloneResilientCoastalFreightProductivityMultiplier(
    cycloneResilientCoastalFreightShare,
    options?.cycloneResilientCoastalFreightPolicy ?? 'baseline',
  );
  const electricBusDepotChargingLogisticsThroughputByRegion =
    computeElectricBusDepotChargingLogisticsThroughputByRegion(ops);
  const nationalEbusDepot = nationalElectricBusDepotChargingLogisticsThroughputIndex(
    electricBusDepotChargingLogisticsThroughputByRegion,
  );
  const electricBusDepotChargingLogisticsShare = computeElectricBusDepotChargingLogisticsShare(
    ops,
    options?.electricBusDepotChargingLogisticsPolicy ?? 'baseline',
  );
  const ebusDepotMult = electricBusDepotChargingLogisticsProductivityMultiplier(
    electricBusDepotChargingLogisticsShare,
    options?.electricBusDepotChargingLogisticsPolicy ?? 'baseline',
  );
  const vanadiumFlowBatteryExportByRegion = computeVanadiumFlowBatteryExportByRegion(ops);
  const nationalVanadiumFlow = nationalVanadiumFlowBatteryExportIndex(vanadiumFlowBatteryExportByRegion);
  const vanadiumFlowMult = vanadiumFlowBatteryExportProductivityMultiplier(
    nationalVanadiumFlow,
    options?.vanadiumFlowBatteryExportPolicy ?? 'baseline',
  );
  const bushfireEvacuationRailBridgeByRegion = computeBushfireEvacuationRailBridgeByRegion(ops, networkStress);
  const nationalBushfireEvac = nationalBushfireEvacuationRailBridgeIndex(bushfireEvacuationRailBridgeByRegion);
  const bushfireEvacuationRailBridgeShare = computeBushfireEvacuationRailBridgeShare(
    ops,
    options?.bushfireEvacuationRailBridgePolicy ?? 'baseline',
  );
  const bushfireEvacMult = bushfireEvacuationRailBridgeProductivityMultiplier(
    bushfireEvacuationRailBridgeShare,
    options?.bushfireEvacuationRailBridgePolicy ?? 'baseline',
  );
  const automatedGrainSiloRailLoadoutThroughputByRegion =
    computeAutomatedGrainSiloRailLoadoutThroughputByRegion(ops);
  const nationalGrainSiloAuto = nationalAutomatedGrainSiloRailLoadoutThroughputIndex(
    automatedGrainSiloRailLoadoutThroughputByRegion,
  );
  const automatedGrainSiloRailLoadoutShare = computeAutomatedGrainSiloRailLoadoutShare(
    ops,
    options?.automatedGrainSiloRailLoadoutPolicy ?? 'baseline',
  );
  const grainSiloAutoMult = automatedGrainSiloRailLoadoutProductivityMultiplier(
    automatedGrainSiloRailLoadoutShare,
    options?.automatedGrainSiloRailLoadoutPolicy ?? 'baseline',
  );
  const greenIronPelletExportByRegion = computeGreenIronPelletExportByRegion(ops);
  const nationalGreenPellet = nationalGreenIronPelletExportIndex(greenIronPelletExportByRegion);
  const greenPelletMult = greenIronPelletExportProductivityMultiplier(
    nationalGreenPellet,
    options?.greenIronPelletExportPolicy ?? 'baseline',
  );
  const floodLeveeRailProtectionByRegion = computeFloodLeveeRailProtectionByRegion(ops, networkStress);
  const nationalFloodLevee = nationalFloodLeveeRailProtectionIndex(floodLeveeRailProtectionByRegion);
  const floodLeveeRailProtectionShare = computeFloodLeveeRailProtectionShare(
    ops,
    options?.floodLeveeRailProtectionPolicy ?? 'baseline',
  );
  const floodLeveeMult = floodLeveeRailProtectionProductivityMultiplier(
    floodLeveeRailProtectionShare,
    options?.floodLeveeRailProtectionPolicy ?? 'baseline',
  );
  const portZeroEmissionDrayageThroughputByRegion = computePortZeroEmissionDrayageThroughputByRegion(ops);
  const nationalZeroDrayage = nationalPortZeroEmissionDrayageThroughputIndex(portZeroEmissionDrayageThroughputByRegion);
  const portZeroEmissionDrayageShare = computePortZeroEmissionDrayageShare(
    ops,
    options?.portZeroEmissionDrayagePolicy ?? 'baseline',
  );
  const zeroDrayageMult = portZeroEmissionDrayageProductivityMultiplier(
    portZeroEmissionDrayageShare,
    options?.portZeroEmissionDrayagePolicy ?? 'baseline',
  );
  const titaniumSpongeExportByRegion = computeTitaniumSpongeExportByRegion(ops);
  const nationalTitaniumSponge = nationalTitaniumSpongeExportIndex(titaniumSpongeExportByRegion);
  const titaniumSpongeMult = titaniumSpongeExportProductivityMultiplier(
    nationalTitaniumSponge,
    options?.titaniumSpongeExportPolicy ?? 'baseline',
  );
  const heatwaveRailSpeedRestrictionByRegion = computeHeatwaveRailSpeedRestrictionByRegion(ops, networkStress);
  const nationalHeatwaveRail = nationalHeatwaveRailSpeedRestrictionIndex(heatwaveRailSpeedRestrictionByRegion);
  const heatwaveRailSpeedRestrictionShare = computeHeatwaveRailSpeedRestrictionShare(
    ops,
    options?.heatwaveRailSpeedRestrictionPolicy ?? 'baseline',
  );
  const heatwaveRailMult = heatwaveRailSpeedRestrictionProductivityMultiplier(
    heatwaveRailSpeedRestrictionShare,
    options?.heatwaveRailSpeedRestrictionPolicy ?? 'baseline',
  );
  const automatedLivestockExportYardThroughputByRegion =
    computeAutomatedLivestockExportYardThroughputByRegion(ops);
  const nationalLivestockYard = nationalAutomatedLivestockExportYardThroughputIndex(
    automatedLivestockExportYardThroughputByRegion,
  );
  const automatedLivestockExportYardShare = computeAutomatedLivestockExportYardShare(
    ops,
    options?.automatedLivestockExportYardPolicy ?? 'baseline',
  );
  const livestockYardMult = automatedLivestockExportYardProductivityMultiplier(
    automatedLivestockExportYardShare,
    options?.automatedLivestockExportYardPolicy ?? 'baseline',
  );
  const siliconSolarWaferExportByRegion = computeSiliconSolarWaferExportByRegion(ops);
  const nationalSiliconWafer = nationalSiliconSolarWaferExportIndex(siliconSolarWaferExportByRegion);
  const siliconWaferMult = siliconSolarWaferExportProductivityMultiplier(
    nationalSiliconWafer,
    options?.siliconSolarWaferExportPolicy ?? 'baseline',
  );
  const railCoalPhaseoutStagingByRegion = computeRailCoalPhaseoutStagingByRegion(ops, networkStress);
  const nationalCoalPhaseout = nationalRailCoalPhaseoutStagingIndex(railCoalPhaseoutStagingByRegion);
  const railCoalPhaseoutStagingShare = computeRailCoalPhaseoutStagingShare(
    ops,
    options?.railCoalPhaseoutStagingPolicy ?? 'baseline',
  );
  const coalPhaseoutMult = railCoalPhaseoutStagingProductivityMultiplier(
    railCoalPhaseoutStagingShare,
    options?.railCoalPhaseoutStagingPolicy ?? 'baseline',
  );
  const airportBaggageRobotLogisticsThroughputByRegion =
    computeAirportBaggageRobotLogisticsThroughputByRegion(ops);
  const nationalBaggageRobot = nationalAirportBaggageRobotLogisticsThroughputIndex(
    airportBaggageRobotLogisticsThroughputByRegion,
  );
  const airportBaggageRobotLogisticsShare = computeAirportBaggageRobotLogisticsShare(
    ops,
    options?.airportBaggageRobotLogisticsPolicy ?? 'baseline',
  );
  const baggageRobotMult = airportBaggageRobotLogisticsProductivityMultiplier(
    airportBaggageRobotLogisticsShare,
    options?.airportBaggageRobotLogisticsPolicy ?? 'baseline',
  );
  const offshoreWindCableExportByRegion = computeOffshoreWindCableExportByRegion(ops);
  const nationalWindCable = nationalOffshoreWindCableExportIndex(offshoreWindCableExportByRegion);
  const windCableMult = offshoreWindCableExportProductivityMultiplier(
    nationalWindCable,
    options?.offshoreWindCableExportPolicy ?? 'baseline',
  );
  const medevacHelicopterStagingByRegion = computeMedevacHelicopterStagingByRegion(ops, networkStress);
  const nationalMedevacHeli = nationalMedevacHelicopterStagingIndex(medevacHelicopterStagingByRegion);
  const medevacHelicopterStagingShare = computeMedevacHelicopterStagingShare(
    ops,
    options?.medevacHelicopterStagingPolicy ?? 'baseline',
  );
  const medevacHeliMult = medevacHelicopterStagingProductivityMultiplier(
    medevacHelicopterStagingShare,
    options?.medevacHelicopterStagingPolicy ?? 'baseline',
  );
  const reefRestorationLogisticsThroughputByRegion =
    computeReefRestorationLogisticsThroughputByRegion(ops);
  const nationalReefLogistics = nationalReefRestorationLogisticsThroughputIndex(
    reefRestorationLogisticsThroughputByRegion,
  );
  const reefRestorationLogisticsShare = computeReefRestorationLogisticsShare(
    ops,
    options?.reefRestorationLogisticsPolicy ?? 'baseline',
  );
  const reefLogisticsMult = reefRestorationLogisticsProductivityMultiplier(
    reefRestorationLogisticsShare,
    options?.reefRestorationLogisticsPolicy ?? 'baseline',
  );
  const pumpedHydroRenewableExportByRegion = computePumpedHydroRenewableExportByRegion(ops);
  const nationalPumpedHydro = nationalPumpedHydroRenewableExportIndex(pumpedHydroRenewableExportByRegion);
  const pumpedHydroMult = pumpedHydroRenewableExportProductivityMultiplier(
    nationalPumpedHydro,
    options?.pumpedHydroRenewableExportPolicy ?? 'baseline',
  );
  const wildfireAirtankerStagingByRegion = computeWildfireAirtankerStagingByRegion(ops, networkStress);
  const nationalWildfireTanker = nationalWildfireAirtankerStagingIndex(wildfireAirtankerStagingByRegion);
  const wildfireAirtankerStagingShare = computeWildfireAirtankerStagingShare(
    ops,
    options?.wildfireAirtankerStagingPolicy ?? 'baseline',
  );
  const wildfireTankerMult = wildfireAirtankerStagingProductivityMultiplier(
    wildfireAirtankerStagingShare,
    options?.wildfireAirtankerStagingPolicy ?? 'baseline',
  );
  const suburbanMicroFulfillmentLogisticsThroughputByRegion =
    computeSuburbanMicroFulfillmentLogisticsThroughputByRegion(ops);
  const nationalSuburbanMicro = nationalSuburbanMicroFulfillmentLogisticsThroughputIndex(
    suburbanMicroFulfillmentLogisticsThroughputByRegion,
  );
  const suburbanMicroFulfillmentLogisticsShare = computeSuburbanMicroFulfillmentLogisticsShare(
    ops,
    options?.suburbanMicroFulfillmentLogisticsPolicy ?? 'baseline',
  );
  const suburbanMicroMult = suburbanMicroFulfillmentLogisticsProductivityMultiplier(
    suburbanMicroFulfillmentLogisticsShare,
    options?.suburbanMicroFulfillmentLogisticsPolicy ?? 'baseline',
  );
  const deepGeothermalExportByRegion = computeDeepGeothermalExportByRegion(ops);
  const nationalGeothermal = nationalDeepGeothermalExportIndex(deepGeothermalExportByRegion);
  const geothermalMult = deepGeothermalExportProductivityMultiplier(
    nationalGeothermal,
    options?.deepGeothermalExportPolicy ?? 'baseline',
  );
  const coastalFloodEvacStagingByRegion = computeCoastalFloodEvacStagingByRegion(ops, networkStress);
  const nationalFloodEvac = nationalCoastalFloodEvacStagingIndex(coastalFloodEvacStagingByRegion);
  const coastalFloodEvacStagingShare = computeCoastalFloodEvacStagingShare(
    ops,
    options?.coastalFloodEvacStagingPolicy ?? 'baseline',
  );
  const floodEvacMult = coastalFloodEvacStagingProductivityMultiplier(
    coastalFloodEvacStagingShare,
    options?.coastalFloodEvacStagingPolicy ?? 'baseline',
  );
  const warehouseRobotSortationLogisticsThroughputByRegion =
    computeWarehouseRobotSortationLogisticsThroughputByRegion(ops);
  const nationalRobotSortation = nationalWarehouseRobotSortationLogisticsThroughputIndex(
    warehouseRobotSortationLogisticsThroughputByRegion,
  );
  const warehouseRobotSortationLogisticsShare = computeWarehouseRobotSortationLogisticsShare(
    ops,
    options?.warehouseRobotSortationLogisticsPolicy ?? 'baseline',
  );
  const robotSortationMult = warehouseRobotSortationLogisticsProductivityMultiplier(
    warehouseRobotSortationLogisticsShare,
    options?.warehouseRobotSortationLogisticsPolicy ?? 'baseline',
  );
  const offshoreWaveEnergyExportByRegion = computeOffshoreWaveEnergyExportByRegion(ops);
  const nationalWaveEnergy = nationalOffshoreWaveEnergyExportIndex(offshoreWaveEnergyExportByRegion);
  const waveEnergyMult = offshoreWaveEnergyExportProductivityMultiplier(
    nationalWaveEnergy,
    options?.offshoreWaveEnergyExportPolicy ?? 'baseline',
  );
  const remoteSchoolSupplyStagingByRegion = computeRemoteSchoolSupplyStagingByRegion(ops, networkStress);
  const nationalSchoolSupply = nationalRemoteSchoolSupplyStagingIndex(remoteSchoolSupplyStagingByRegion);
  const remoteSchoolSupplyStagingShare = computeRemoteSchoolSupplyStagingShare(
    ops,
    options?.remoteSchoolSupplyStagingPolicy ?? 'baseline',
  );
  const schoolSupplyMult = remoteSchoolSupplyStagingProductivityMultiplier(
    remoteSchoolSupplyStagingShare,
    options?.remoteSchoolSupplyStagingPolicy ?? 'baseline',
  );
  const portLithiumHydroxideLogisticsThroughputByRegion =
    computePortLithiumHydroxideLogisticsThroughputByRegion(ops);
  const nationalLithiumHydroxide = nationalPortLithiumHydroxideLogisticsThroughputIndex(
    portLithiumHydroxideLogisticsThroughputByRegion,
  );
  const portLithiumHydroxideLogisticsShare = computePortLithiumHydroxideLogisticsShare(
    ops,
    options?.portLithiumHydroxideLogisticsPolicy ?? 'baseline',
  );
  const lithiumHydroxideMult = portLithiumHydroxideLogisticsProductivityMultiplier(
    portLithiumHydroxideLogisticsShare,
    options?.portLithiumHydroxideLogisticsPolicy ?? 'baseline',
  );
  const desalinationBrineExportByRegion = computeDesalinationBrineExportByRegion(ops);
  const nationalDesalBrine = nationalDesalinationBrineExportIndex(desalinationBrineExportByRegion);
  const desalBrineMult = desalinationBrineExportProductivityMultiplier(
    nationalDesalBrine,
    options?.desalinationBrineExportPolicy ?? 'baseline',
  );
  const wildlifeRescueAirliftStagingByRegion = computeWildlifeRescueAirliftStagingByRegion(ops, networkStress);
  const nationalWildlifeRescue = nationalWildlifeRescueAirliftStagingIndex(wildlifeRescueAirliftStagingByRegion);
  const wildlifeRescueAirliftStagingShare = computeWildlifeRescueAirliftStagingShare(
    ops,
    options?.wildlifeRescueAirliftStagingPolicy ?? 'baseline',
  );
  const wildlifeRescueMult = wildlifeRescueAirliftStagingProductivityMultiplier(
    wildlifeRescueAirliftStagingShare,
    options?.wildlifeRescueAirliftStagingPolicy ?? 'baseline',
  );
  const urbanEvFreightChargingLogisticsThroughputByRegion =
    computeUrbanEvFreightChargingLogisticsThroughputByRegion(ops);
  const nationalEvFreightCharging = nationalUrbanEvFreightChargingLogisticsThroughputIndex(
    urbanEvFreightChargingLogisticsThroughputByRegion,
  );
  const urbanEvFreightChargingLogisticsShare = computeUrbanEvFreightChargingLogisticsShare(
    ops,
    options?.urbanEvFreightChargingLogisticsPolicy ?? 'baseline',
  );
  const evFreightChargingMult = urbanEvFreightChargingLogisticsProductivityMultiplier(
    urbanEvFreightChargingLogisticsShare,
    options?.urbanEvFreightChargingLogisticsPolicy ?? 'baseline',
  );
  const moltenSaltSolarExportByRegion = computeMoltenSaltSolarExportByRegion(ops);
  const nationalMoltenSalt = nationalMoltenSaltSolarExportIndex(moltenSaltSolarExportByRegion);
  const moltenSaltMult = moltenSaltSolarExportProductivityMultiplier(
    nationalMoltenSalt,
    options?.moltenSaltSolarExportPolicy ?? 'baseline',
  );
  const alpineSkiResortSupplyStagingByRegion = computeAlpineSkiResortSupplyStagingByRegion(ops, networkStress);
  const nationalAlpineSki = nationalAlpineSkiResortSupplyStagingIndex(alpineSkiResortSupplyStagingByRegion);
  const alpineSkiResortSupplyStagingShare = computeAlpineSkiResortSupplyStagingShare(
    ops,
    options?.alpineSkiResortSupplyStagingPolicy ?? 'baseline',
  );
  const alpineSkiMult = alpineSkiResortSupplyStagingProductivityMultiplier(
    alpineSkiResortSupplyStagingShare,
    options?.alpineSkiResortSupplyStagingPolicy ?? 'baseline',
  );
  const railAutonomousShuntingLogisticsThroughputByRegion =
    computeRailAutonomousShuntingLogisticsThroughputByRegion(ops);
  const nationalRailShunting = nationalRailAutonomousShuntingLogisticsThroughputIndex(
    railAutonomousShuntingLogisticsThroughputByRegion,
  );
  const railAutonomousShuntingLogisticsShare = computeRailAutonomousShuntingLogisticsShare(
    ops,
    options?.railAutonomousShuntingLogisticsPolicy ?? 'baseline',
  );
  const railShuntingMult = railAutonomousShuntingLogisticsProductivityMultiplier(
    railAutonomousShuntingLogisticsShare,
    options?.railAutonomousShuntingLogisticsPolicy ?? 'baseline',
  );
  const biomethaneGridExportByRegion = computeBiomethaneGridExportByRegion(ops);
  const nationalBiomethane = nationalBiomethaneGridExportIndex(biomethaneGridExportByRegion);
  const biomethaneMult = biomethaneGridExportProductivityMultiplier(
    nationalBiomethane,
    options?.biomethaneGridExportPolicy ?? 'baseline',
  );
  const miningCampResupplyStagingByRegion = computeMiningCampResupplyStagingByRegion(ops, networkStress);
  const nationalMiningCamp = nationalMiningCampResupplyStagingIndex(miningCampResupplyStagingByRegion);
  const miningCampResupplyStagingShare = computeMiningCampResupplyStagingShare(
    ops,
    options?.miningCampResupplyStagingPolicy ?? 'baseline',
  );
  const miningCampMult = miningCampResupplyStagingProductivityMultiplier(
    miningCampResupplyStagingShare,
    options?.miningCampResupplyStagingPolicy ?? 'baseline',
  );
  const portContainerReeferLogisticsThroughputByRegion =
    computePortContainerReeferLogisticsThroughputByRegion(ops);
  const nationalContainerReefer = nationalPortContainerReeferLogisticsThroughputIndex(
    portContainerReeferLogisticsThroughputByRegion,
  );
  const portContainerReeferLogisticsShare = computePortContainerReeferLogisticsShare(
    ops,
    options?.portContainerReeferLogisticsPolicy ?? 'baseline',
  );
  const containerReeferMult = portContainerReeferLogisticsProductivityMultiplier(
    portContainerReeferLogisticsShare,
    options?.portContainerReeferLogisticsPolicy ?? 'baseline',
  );
  const tidalLagoonExportByRegion = computeTidalLagoonExportByRegion(ops);
  const nationalTidalLagoon = nationalTidalLagoonExportIndex(tidalLagoonExportByRegion);
  const tidalLagoonMult = tidalLagoonExportProductivityMultiplier(
    nationalTidalLagoon,
    options?.tidalLagoonExportPolicy ?? 'baseline',
  );
  const remoteTelehealthSupplyStagingByRegion = computeRemoteTelehealthSupplyStagingByRegion(ops, networkStress);
  const nationalTelehealth = nationalRemoteTelehealthSupplyStagingIndex(remoteTelehealthSupplyStagingByRegion);
  const remoteTelehealthSupplyStagingShare = computeRemoteTelehealthSupplyStagingShare(
    ops,
    options?.remoteTelehealthSupplyStagingPolicy ?? 'baseline',
  );
  const telehealthMult = remoteTelehealthSupplyStagingProductivityMultiplier(
    remoteTelehealthSupplyStagingShare,
    options?.remoteTelehealthSupplyStagingPolicy ?? 'baseline',
  );
  const warehouseVerticalFulfillmentLogisticsThroughputByRegion =
    computeWarehouseVerticalFulfillmentLogisticsThroughputByRegion(ops);
  const nationalVerticalFulfillment = nationalWarehouseVerticalFulfillmentLogisticsThroughputIndex(
    warehouseVerticalFulfillmentLogisticsThroughputByRegion,
  );
  const warehouseVerticalFulfillmentLogisticsShare = computeWarehouseVerticalFulfillmentLogisticsShare(
    ops,
    options?.warehouseVerticalFulfillmentLogisticsPolicy ?? 'baseline',
  );
  const verticalFulfillmentMult = warehouseVerticalFulfillmentLogisticsProductivityMultiplier(
    warehouseVerticalFulfillmentLogisticsShare,
    options?.warehouseVerticalFulfillmentLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const offshoreBoost = (offshoreWindLogisticsByRegion[code] - 5) * 0.0053;
    const batteryBoost = (batterySupplyChainByRegion[code] - 16) * 0.0046;
    const cruiseBoost = (cruiseTurnaroundThroughputByRegion[code] - 2) * 0.0051;
    const subseaBoost = (subseaCableLandingByRegion[code] - 4) * 0.005;
    const ammoniaBoost = (greenAmmoniaExportByRegion[code] - 12) * 0.0045;
    const airportBoost = (airportExpressRailThroughputByRegion[code] - 2) * 0.0049;
    const lithiumBoost = (lithiumBrineExportByRegion[code] - 5) * 0.0048;
    const inlandExpressBoost = (inlandRailExpressByRegion[code] - 10) * 0.0044;
    const spaceLaunchBoost = (spaceLaunchLogisticsThroughputByRegion[code] - 1) * 0.0046;
    const rareEarthBoost = (rareEarthMagnetExportByRegion[code] - 5) * 0.0047;
    const reeferBoost = (transTasmanReeferExpressByRegion[code] - 8) * 0.0043;
    const zetBoost = (zeroEmissionTruckCorridorThroughputByRegion[code] - 2) * 0.0045;
    const ccsBoost = (offshoreCcsLogisticsByRegion[code] - 4) * 0.0046;
    const h2LngBoost = (hydrogenLngExportByRegion[code] - 11) * 0.0044;
    const microfreightBoost = (urbanMicrofreightHubThroughputByRegion[code] - 2) * 0.0042;
    const floatingWindBoost = (floatingOffshoreWindStagingByRegion[code] - 5) * 0.0045;
    const medicineAirliftBoost = (criticalMedicineAirliftByRegion[code] - 8) * 0.0041;
    const freightDroneBoost = (regionalFreightDroneThroughputByRegion[code] - 1.5) * 0.004;
    const gridBatteryBoost = (gridBatteryLogisticsByRegion[code] - 5) * 0.0044;
    const sealiftBoost = (pacificHumanitarianSealiftByRegion[code] - 8) * 0.004;
    const portTractorBoost = (autonomousPortTractorThroughputByRegion[code] - 2) * 0.0039;
    const heavyHaulBoost = (autonomousHeavyHaulByRegion[code] - 6) * 0.0043;
    const gbrBoost = (gbrBiosecurityLogisticsByRegion[code] - 8) * 0.0039;
    const nightFreightBoost = (nightUrbanFreightWindowThroughputByRegion[code] - 1.5) * 0.0038;
    const methanolBoost = (methanolBunkeringExportByRegion[code] - 5) * 0.0041;
    const antarcticBoost = (antarcticResupplyLogisticsByRegion[code] - 6) * 0.0037;
    const smartBorderBoost = (smartBorderPreclearanceThroughputByRegion[code] - 2) * 0.0036;
    const safBoost = (sustainableAviationFuelSupplyByRegion[code] - 4) * 0.004;
    const outbackDieselBoost = (outbackDieselSecurityByRegion[code] - 5) * 0.0038;
    const doubleStackBoost = (railDoubleStackContainerThroughputByRegion[code] - 1.8) * 0.0035;
    const greenSteelBoost = (greenSteelExportByRegion[code] - 5) * 0.0042;
    const indigenousAirliftBoost = (indigenousCommunityAirliftByRegion[code] - 5) * 0.0036;
    const berthSlotBoost = (portBerthSlotOptimizerThroughputByRegion[code] - 2) * 0.0034;
    const windTowBoost = (offshoreWindTowInstallByRegion[code] - 5) * 0.0041;
    const evBatteryBoost = (evBatteryRecyclingLogisticsByRegion[code] - 5) * 0.0037;
    const courierMicrohubBoost = (urbanCourierMicrohubThroughputByRegion[code] - 1.6) * 0.0033;
    const copperBoost = (copperConcentrateExportByRegion[code] - 5) * 0.004;
    const pharmaColdChainBoost = (pharmaceuticalColdChainByRegion[code] - 6) * 0.0036;
    const paxFreightPathBoost = (railPassengerFreightPathThroughputByRegion[code] - 1.7) * 0.0032;
    const aluminaBoost = (aluminaRefineryExportByRegion[code] - 5) * 0.0039;
    const reliefAirBoost = (disasterReliefAirBridgeByRegion[code] - 6) * 0.0035;
    const yardAutoBoost = (containerYardAutomationThroughputByRegion[code] - 2) * 0.0031;
    const nickelPrecursorBoost = (nickelCobaltBatteryPrecursorByRegion[code] - 5) * 0.0038;
    const remoteSealiftBoost = (remoteIslandSealiftByRegion[code] - 6) * 0.0034;
    const inlandTerminalAutoBoost = (railInlandTerminalAutomationThroughputByRegion[code] - 1.8) * 0.003;
    const graphiteAnodeBoost = (graphiteBatteryAnodeExportByRegion[code] - 5) * 0.0037;
    const cycloneCoastalBoost = (cycloneResilientCoastalFreightByRegion[code] - 6) * 0.0033;
    const ebusDepotBoost = (electricBusDepotChargingLogisticsThroughputByRegion[code] - 1.8) * 0.0029;
    const vanadiumFlowBoost = (vanadiumFlowBatteryExportByRegion[code] - 5) * 0.0036;
    const bushfireEvacBoost = (bushfireEvacuationRailBridgeByRegion[code] - 6) * 0.0032;
    const grainSiloAutoBoost = (automatedGrainSiloRailLoadoutThroughputByRegion[code] - 1.9) * 0.0028;
    const greenPelletBoost = (greenIronPelletExportByRegion[code] - 5) * 0.0035;
    const floodLeveeBoost = (floodLeveeRailProtectionByRegion[code] - 6) * 0.0031;
    const zeroDrayageBoost = (portZeroEmissionDrayageThroughputByRegion[code] - 2) * 0.0027;
    const titaniumSpongeBoost = (titaniumSpongeExportByRegion[code] - 5) * 0.0034;
    const heatwaveRailBoost = (heatwaveRailSpeedRestrictionByRegion[code] - 6) * 0.003;
    const livestockYardBoost = (automatedLivestockExportYardThroughputByRegion[code] - 2) * 0.0026;
    const siliconWaferBoost = (siliconSolarWaferExportByRegion[code] - 5) * 0.0033;
    const coalPhaseoutBoost = (railCoalPhaseoutStagingByRegion[code] - 6) * 0.0029;
    const baggageRobotBoost = (airportBaggageRobotLogisticsThroughputByRegion[code] - 2) * 0.0025;
    const windCableBoost = (offshoreWindCableExportByRegion[code] - 5) * 0.0032;
    const medevacHeliBoost = (medevacHelicopterStagingByRegion[code] - 6) * 0.0028;
    const reefLogisticsBoost = (reefRestorationLogisticsThroughputByRegion[code] - 2) * 0.0024;
    const pumpedHydroBoost = (pumpedHydroRenewableExportByRegion[code] - 5) * 0.0031;
    const wildfireTankerBoost = (wildfireAirtankerStagingByRegion[code] - 6) * 0.0027;
    const suburbanMicroBoost = (suburbanMicroFulfillmentLogisticsThroughputByRegion[code] - 2) * 0.0023;
    const geothermalBoost = (deepGeothermalExportByRegion[code] - 5) * 0.003;
    const floodEvacBoost = (coastalFloodEvacStagingByRegion[code] - 6) * 0.0026;
    const robotSortationBoost = (warehouseRobotSortationLogisticsThroughputByRegion[code] - 2) * 0.0022;
    const waveEnergyBoost = (offshoreWaveEnergyExportByRegion[code] - 5) * 0.0029;
    const schoolSupplyBoost = (remoteSchoolSupplyStagingByRegion[code] - 6) * 0.0025;
    const lithiumHydroxideBoost = (portLithiumHydroxideLogisticsThroughputByRegion[code] - 2) * 0.0021;
    const desalBrineBoost = (desalinationBrineExportByRegion[code] - 5) * 0.0028;
    const wildlifeRescueBoost = (wildlifeRescueAirliftStagingByRegion[code] - 6) * 0.0024;
    const evFreightChargingBoost = (urbanEvFreightChargingLogisticsThroughputByRegion[code] - 2) * 0.002;
    const moltenSaltBoost = (moltenSaltSolarExportByRegion[code] - 5) * 0.0027;
    const alpineSkiBoost = (alpineSkiResortSupplyStagingByRegion[code] - 6) * 0.0023;
    const railShuntingBoost = (railAutonomousShuntingLogisticsThroughputByRegion[code] - 2) * 0.0019;
    const biomethaneBoost = (biomethaneGridExportByRegion[code] - 5) * 0.0026;
    const miningCampBoost = (miningCampResupplyStagingByRegion[code] - 6) * 0.0022;
    const containerReeferBoost = (portContainerReeferLogisticsThroughputByRegion[code] - 2) * 0.0018;
    const tidalLagoonBoost = (tidalLagoonExportByRegion[code] - 5) * 0.0025;
    const telehealthBoost = (remoteTelehealthSupplyStagingByRegion[code] - 6) * 0.0021;
    const verticalFulfillmentBoost = (warehouseVerticalFulfillmentLogisticsThroughputByRegion[code] - 2) * 0.0017;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus +
        offshoreBoost +
        batteryBoost +
        cruiseBoost +
        subseaBoost +
        ammoniaBoost +
        airportBoost +
        lithiumBoost +
        inlandExpressBoost +
        spaceLaunchBoost +
        rareEarthBoost +
        reeferBoost +
        zetBoost +
        ccsBoost +
        h2LngBoost +
        microfreightBoost +
        floatingWindBoost +
        medicineAirliftBoost +
        freightDroneBoost +
        gridBatteryBoost +
        sealiftBoost +
        portTractorBoost +
        heavyHaulBoost +
        gbrBoost +
        nightFreightBoost +
        methanolBoost +
        antarcticBoost +
        smartBorderBoost +
        safBoost +
        outbackDieselBoost +
        doubleStackBoost +
        greenSteelBoost +
        indigenousAirliftBoost +
        berthSlotBoost +
        windTowBoost +
        evBatteryBoost +
        courierMicrohubBoost +
        copperBoost +
        pharmaColdChainBoost +
        paxFreightPathBoost +
        aluminaBoost +
        reliefAirBoost +
        yardAutoBoost +
        nickelPrecursorBoost +
        remoteSealiftBoost +
        inlandTerminalAutoBoost +
        graphiteAnodeBoost +
        cycloneCoastalBoost +
        ebusDepotBoost +
        vanadiumFlowBoost +
        bushfireEvacBoost +
        grainSiloAutoBoost +
        greenPelletBoost +
        floodLeveeBoost +
        zeroDrayageBoost +
        titaniumSpongeBoost +
        heatwaveRailBoost +
        livestockYardBoost +
        siliconWaferBoost +
        coalPhaseoutBoost +
        baggageRobotBoost +
        windCableBoost +
        medevacHeliBoost +
        reefLogisticsBoost +
        pumpedHydroBoost +
        wildfireTankerBoost +
        suburbanMicroBoost +
        geothermalBoost +
        floodEvacBoost +
        robotSortationBoost +
        waveEnergyBoost +
        schoolSupplyBoost +
        lithiumHydroxideBoost +
        desalBrineBoost +
        wildlifeRescueBoost +
        evFreightChargingBoost +
        moltenSaltBoost +
        alpineSkiBoost +
        railShuntingBoost +
        biomethaneBoost +
        miningCampBoost +
        containerReeferBoost +
        tidalLagoonBoost +
        telehealthBoost +
        verticalFulfillmentBoost) *
      offshoreMult *
      batteryMult *
      cruiseMult *
      subseaMult *
      ammoniaMult *
      airportExpressMult *
      lithiumMult *
      inlandExpressMult *
      spaceLaunchMult *
      rareEarthMult *
      reeferMult *
      zetMult *
      ccsMult *
      h2LngMult *
      microfreightMult *
      floatingWindMult *
      medicineAirliftMult *
      freightDroneMult *
      gridBatteryMult *
      sealiftMult *
      portTractorMult *
      heavyHaulMult *
      gbrMult *
      nightFreightMult *
      methanolMult *
      antarcticMult *
      smartBorderMult *
      safMult *
      outbackDieselMult *
      doubleStackMult *
      greenSteelMult *
      indigenousAirliftMult *
      berthSlotMult *
      windTowMult *
      evBatteryMult *
      courierMicrohubMult *
      copperMult *
      pharmaColdChainMult *
      paxFreightPathMult *
      aluminaMult *
      reliefAirMult *
      yardAutoMult *
      nickelPrecursorMult *
      remoteSealiftMult *
      inlandTerminalAutoMult *
      graphiteAnodeMult *
      cycloneCoastalMult *
      ebusDepotMult *
      vanadiumFlowMult *
      bushfireEvacMult *
      grainSiloAutoMult *
      greenPelletMult *
      floodLeveeMult *
      zeroDrayageMult *
      titaniumSpongeMult *
      heatwaveRailMult *
      livestockYardMult *
      siliconWaferMult *
      coalPhaseoutMult *
      baggageRobotMult *
      windCableMult *
      medevacHeliMult *
      reefLogisticsMult *
      pumpedHydroMult *
      wildfireTankerMult *
      suburbanMicroMult *
      geothermalMult *
      floodEvacMult *
      robotSortationMult *
      waveEnergyMult *
      schoolSupplyMult *
      lithiumHydroxideMult *
      desalBrineMult *
      wildlifeRescueMult *
      evFreightChargingMult *
      moltenSaltMult *
      alpineSkiMult *
      railShuntingMult *
      biomethaneMult *
      miningCampMult *
      containerReeferMult *
      tidalLagoonMult *
      telehealthMult *
      verticalFulfillmentMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017 +
    nationalPacificFeeder * 0.019 +
    nationalDataCentreLogistics * 0.018 +
    nationalOffshoreWind * 0.017 +
    nationalBatterySupply * 0.016 +
    nationalCruiseTurnaround * 0.015 +
    nationalSubseaCable * 0.014 +
    nationalGreenAmmonia * 0.014 +
    nationalAirportExpress * 0.013 +
    nationalLithiumBrine * 0.012 +
    nationalInlandRailExpress * 0.012 +
    nationalSpaceLaunch * 0.011 +
    nationalRareEarthMagnet * 0.011 +
    nationalTransTasmanReefer * 0.01 +
    nationalZeroEmissionTruck * 0.01 +
    nationalOffshoreCcs * 0.009 +
    nationalHydrogenLng * 0.009 +
    nationalUrbanMicrofreight * 0.009 +
    nationalFloatingWindStaging * 0.008 +
    nationalCriticalMedicineAirlift * 0.008 +
    nationalRegionalFreightDrone * 0.008 +
    nationalGridBattery * 0.007 +
    nationalPacificSealift * 0.007 +
    nationalAutonomousPortTractor * 0.007 +
    nationalAutonomousHeavyHaul * 0.007 +
    nationalGbrBiosecurity * 0.006 +
    nationalNightUrbanFreight * 0.006 +
    nationalMethanolBunkering * 0.006 +
    nationalAntarcticResupply * 0.005 +
    nationalSmartBorderPreclearance * 0.005 +
    nationalSafSupply * 0.005 +
    nationalOutbackDiesel * 0.005 +
    nationalRailDoubleStack * 0.004 +
    nationalGreenSteel * 0.004 +
    nationalIndigenousAirlift * 0.004 +
    nationalPortBerthSlot * 0.004 +
    nationalWindTow * 0.004 +
    nationalEvBatteryRecycle * 0.004 +
    nationalUrbanCourierMicrohub * 0.003 +
    nationalCopperConcentrate * 0.003 +
    nationalPharmaColdChain * 0.003 +
    nationalPaxFreightPath * 0.003 +
    nationalAluminaRefinery * 0.003 +
    nationalDisasterReliefAir * 0.003 +
    nationalContainerYardAuto * 0.003 +
    nationalNickelPrecursor * 0.003 +
    nationalRemoteSealift * 0.003 +
    nationalInlandTerminalAuto * 0.003 +
    nationalGraphiteAnode * 0.003 +
    nationalCycloneCoastal * 0.003 +
    nationalEbusDepot * 0.003 +
    nationalVanadiumFlow * 0.003 +
    nationalBushfireEvac * 0.003 +
    nationalGrainSiloAuto * 0.003 +
    nationalGreenPellet * 0.003 +
    nationalFloodLevee * 0.003 +
    nationalZeroDrayage * 0.003 +
    nationalTitaniumSponge * 0.003 +
    nationalHeatwaveRail * 0.003 +
    nationalLivestockYard * 0.003 +
    nationalSiliconWafer * 0.003 +
    nationalCoalPhaseout * 0.003 +
    nationalBaggageRobot * 0.003 +
    nationalWindCable * 0.003 +
    nationalMedevacHeli * 0.003 +
    nationalReefLogistics * 0.003 +
    nationalPumpedHydro * 0.003 +
    nationalWildfireTanker * 0.003 +
    nationalSuburbanMicro * 0.003 +
    nationalGeothermal * 0.003 +
    nationalFloodEvac * 0.003 +
    nationalRobotSortation * 0.003 +
    nationalWaveEnergy * 0.003 +
    nationalSchoolSupply * 0.003 +
    nationalLithiumHydroxide * 0.003 +
    nationalDesalBrine * 0.003 +
    nationalWildlifeRescue * 0.003 +
    nationalEvFreightCharging * 0.003 +
    nationalMoltenSalt * 0.003 +
    nationalAlpineSki * 0.003 +
    nationalRailShunting * 0.003 +
    nationalBiomethane * 0.003 +
    nationalMiningCamp * 0.003 +
    nationalContainerReefer * 0.003 +
    nationalTidalLagoon * 0.003 +
    nationalTelehealth * 0.003 +
    nationalVerticalFulfillment * 0.003;

  const projectedBacklogNextTurn = projectMaintenanceBacklogNextTurn(
    options?.maintenanceBacklogByAssetId,
    baseInputs.operationalAssetIds,
    {
      networkStress: aggregateNetworkStress(inputs.networkUtilization),
      maintenanceSpendIndex: options?.maintenanceSpendIndex,
    },
  );

  const computeMs =
    (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0 + productivity.computeMs;

  return {
    schemaVersion: 'agent12/44',
    turn: baseInputs.turn,
    productivity,
    activeCorridors: corridorActivations,
    corridorSynergyPoints,
    intermodalSynergyByRegion,
    appliedScenarioIds,
    bottleneckAssetIds,
    maintenanceWarnings,
    resilienceScoreByRegion,
    portRailCouplingByRegion,
    investmentTierByRegion,
    scenarioStackFactor,
    projectedBacklogNextTurn,
    spilloverBonusByRegion,
    fleetCapacity,
    climateModifierFactor,
    pipelineUnlockPoints: pipeline.productivityPoints,
    activePipelineStageIds: pipeline.activeStageIds,
    freightLatencyByRegion,
    nationalFreightLatencyMedian,
    supplyChainResilienceIndex: supplyChain.nationalIndex,
    supplyChainResilienceByRegion: supplyChain.byRegion,
    weakestSupplyChainRegion: supplyChain.weakestRegion,
    disruptionRecoveryFactor: recovery.nationalRecoveryFactor,
    intercapitalConnectivityIndex,
    modalBalanceIndex,
    electrifiedFreightShare,
    lastMileCoverageByRegion,
    nationalLastMileCoverage: nationalLastMile,
    nationalContainerThroughputIndex: nationalContainerThroughput,
    containerThroughputByRegion,
    coldChainReliabilityIndex,
    coldChainReliabilityByRegion,
    greenFreightShare,
    nationalBulkExportThroughputIndex: nationalBulkExport,
    bulkExportThroughputByRegion,
    nationalIntermodalDwellMedian: nationalIntermodalDwell,
    intermodalDwellByRegion,
    nationalUrbanCongestionIndex: nationalUrbanCongestion,
    urbanCongestionByRegion,
    nationalAviationCargoThroughputIndex: nationalAviationCargo,
    aviationCargoThroughputByRegion,
    nationalCustomsClearanceIndex: nationalCustomsClearance,
    customsClearanceByRegion,
    hydrogenFreightShare,
    nationalHydrogenCorridorThroughputIndex: nationalHydrogenCorridor,
    hydrogenCorridorThroughputByRegion,
    nationalCoastalShippingThroughputIndex: nationalCoastalShipping,
    coastalShippingThroughputByRegion,
    nationalBiosecurityClearanceIndex: nationalBiosecurityClearance,
    biosecurityClearanceByRegion,
    autonomousFreightShare,
    nationalAutonomousCorridorThroughputIndex: nationalAutonomousCorridor,
    autonomousCorridorThroughputByRegion,
    nationalDeepSeaGatewayThroughputIndex: nationalDeepSeaGateway,
    deepSeaGatewayThroughputByRegion,
    nationalInfrastructurePermittingIndex: nationalInfrastructurePermitting,
    infrastructurePermittingByRegion,
    electricFreightShare,
    nationalElectricCorridorThroughputIndex: nationalElectricCorridor,
    electricCorridorThroughputByRegion,
    nationalDefenceLogisticsReadinessIndex: nationalDefenceLogistics,
    defenceLogisticsReadinessByRegion,
    nationalWeatherResilienceRoutingIndex: nationalWeatherResilience,
    weatherResilienceRoutingByRegion,
    digitalFreightVisibilityShare,
    nationalDigitalFreightThroughputIndex: nationalDigitalFreight,
    digitalFreightThroughputByRegion,
    nationalCriticalMineralsExportIndex: nationalCriticalMinerals,
    criticalMineralsExportByRegion,
    nationalChannelMaintenanceIndex: nationalChannelMaintenance,
    channelMaintenanceByRegion,
    indigenousRemoteSupplyShare,
    nationalIndigenousRemoteSupplyThroughputIndex: nationalIndigenousRemoteSupply,
    indigenousRemoteSupplyThroughputByRegion,
    nationalGaugeInteroperabilityIndex: nationalGaugeInteroperability,
    gaugeInteroperabilityByRegion,
    nationalDisasterRecoveryStagingIndex: nationalDisasterRecoveryStaging,
    disasterRecoveryStagingByRegion,
    circularFreightShare,
    nationalCircularFreightThroughputIndex: nationalCircularFreight,
    circularFreightThroughputByRegion,
    nationalAgriculturalExportThroughputIndex: nationalAgriculturalExport,
    agriculturalExportThroughputByRegion,
    nationalTrackPossessionEfficiencyIndex: nationalTrackPossession,
    trackPossessionEfficiencyByRegion,
    greenBunkeringShare,
    nationalGreenBunkeringThroughputIndex: nationalGreenBunkering,
    greenBunkeringThroughputByRegion,
    nationalPacificFeederThroughputIndex: nationalPacificFeeder,
    pacificFeederThroughputByRegion,
    nationalMedicalSupplyChainIndex: nationalMedicalSupply,
    medicalSupplyChainByRegion,
    dataCentreLogisticsShare,
    nationalDataCentreLogisticsThroughputIndex: nationalDataCentreLogistics,
    dataCentreLogisticsThroughputByRegion,
    nationalOffshoreWindLogisticsIndex: nationalOffshoreWind,
    offshoreWindLogisticsByRegion,
    nationalBatterySupplyChainIndex: nationalBatterySupply,
    batterySupplyChainByRegion,
    cruiseTurnaroundShare,
    nationalCruiseTurnaroundThroughputIndex: nationalCruiseTurnaround,
    cruiseTurnaroundThroughputByRegion,
    nationalSubseaCableLandingIndex: nationalSubseaCable,
    subseaCableLandingByRegion,
    nationalGreenAmmoniaExportIndex: nationalGreenAmmonia,
    greenAmmoniaExportByRegion,
    airportExpressRailShare,
    nationalAirportExpressRailThroughputIndex: nationalAirportExpress,
    airportExpressRailThroughputByRegion,
    nationalLithiumBrineExportIndex: nationalLithiumBrine,
    lithiumBrineExportByRegion,
    inlandRailExpressShare,
    nationalInlandRailExpressIndex: nationalInlandRailExpress,
    inlandRailExpressByRegion,
    spaceLaunchLogisticsShare,
    nationalSpaceLaunchLogisticsThroughputIndex: nationalSpaceLaunch,
    spaceLaunchLogisticsThroughputByRegion,
    nationalRareEarthMagnetExportIndex: nationalRareEarthMagnet,
    rareEarthMagnetExportByRegion,
    transTasmanReeferExpressShare,
    nationalTransTasmanReeferExpressIndex: nationalTransTasmanReefer,
    transTasmanReeferExpressByRegion,
    zeroEmissionTruckCorridorShare,
    nationalZeroEmissionTruckCorridorThroughputIndex: nationalZeroEmissionTruck,
    zeroEmissionTruckCorridorThroughputByRegion,
    nationalOffshoreCcsLogisticsIndex: nationalOffshoreCcs,
    offshoreCcsLogisticsByRegion,
    nationalHydrogenLngExportIndex: nationalHydrogenLng,
    hydrogenLngExportByRegion,
    urbanMicrofreightHubShare,
    nationalUrbanMicrofreightHubThroughputIndex: nationalUrbanMicrofreight,
    urbanMicrofreightHubThroughputByRegion,
    nationalFloatingOffshoreWindStagingIndex: nationalFloatingWindStaging,
    floatingOffshoreWindStagingByRegion,
    criticalMedicineAirliftShare,
    nationalCriticalMedicineAirliftIndex: nationalCriticalMedicineAirlift,
    criticalMedicineAirliftByRegion,
    regionalFreightDroneShare,
    nationalRegionalFreightDroneThroughputIndex: nationalRegionalFreightDrone,
    regionalFreightDroneThroughputByRegion,
    nationalGridBatteryLogisticsIndex: nationalGridBattery,
    gridBatteryLogisticsByRegion,
    pacificHumanitarianSealiftShare,
    nationalPacificHumanitarianSealiftIndex: nationalPacificSealift,
    pacificHumanitarianSealiftByRegion,
    autonomousPortTractorShare,
    nationalAutonomousPortTractorThroughputIndex: nationalAutonomousPortTractor,
    autonomousPortTractorThroughputByRegion,
    nationalAutonomousHeavyHaulIndex: nationalAutonomousHeavyHaul,
    autonomousHeavyHaulByRegion,
    gbrBiosecurityLogisticsShare,
    nationalGbrBiosecurityLogisticsIndex: nationalGbrBiosecurity,
    gbrBiosecurityLogisticsByRegion,
    nightUrbanFreightWindowShare,
    nationalNightUrbanFreightWindowThroughputIndex: nationalNightUrbanFreight,
    nightUrbanFreightWindowThroughputByRegion,
    nationalMethanolBunkeringExportIndex: nationalMethanolBunkering,
    methanolBunkeringExportByRegion,
    antarcticResupplyLogisticsShare,
    nationalAntarcticResupplyLogisticsIndex: nationalAntarcticResupply,
    antarcticResupplyLogisticsByRegion,
    smartBorderPreclearanceShare,
    nationalSmartBorderPreclearanceThroughputIndex: nationalSmartBorderPreclearance,
    smartBorderPreclearanceThroughputByRegion,
    nationalSustainableAviationFuelSupplyIndex: nationalSafSupply,
    sustainableAviationFuelSupplyByRegion,
    outbackDieselSecurityShare,
    nationalOutbackDieselSecurityIndex: nationalOutbackDiesel,
    outbackDieselSecurityByRegion,
    railDoubleStackContainerShare,
    nationalRailDoubleStackContainerThroughputIndex: nationalRailDoubleStack,
    railDoubleStackContainerThroughputByRegion,
    nationalGreenSteelExportIndex: nationalGreenSteel,
    greenSteelExportByRegion,
    indigenousCommunityAirliftShare,
    nationalIndigenousCommunityAirliftIndex: nationalIndigenousAirlift,
    indigenousCommunityAirliftByRegion,
    portBerthSlotOptimizerShare,
    nationalPortBerthSlotOptimizerThroughputIndex: nationalPortBerthSlot,
    portBerthSlotOptimizerThroughputByRegion,
    nationalOffshoreWindTowInstallIndex: nationalWindTow,
    offshoreWindTowInstallByRegion,
    evBatteryRecyclingLogisticsShare,
    nationalEvBatteryRecyclingLogisticsIndex: nationalEvBatteryRecycle,
    evBatteryRecyclingLogisticsByRegion,
    urbanCourierMicrohubShare,
    nationalUrbanCourierMicrohubThroughputIndex: nationalUrbanCourierMicrohub,
    urbanCourierMicrohubThroughputByRegion,
    nationalCopperConcentrateExportIndex: nationalCopperConcentrate,
    copperConcentrateExportByRegion,
    pharmaceuticalColdChainShare,
    nationalPharmaceuticalColdChainIndex: nationalPharmaColdChain,
    pharmaceuticalColdChainByRegion,
    railPassengerFreightPathShare,
    nationalRailPassengerFreightPathThroughputIndex: nationalPaxFreightPath,
    railPassengerFreightPathThroughputByRegion,
    nationalAluminaRefineryExportIndex: nationalAluminaRefinery,
    aluminaRefineryExportByRegion,
    disasterReliefAirBridgeShare,
    nationalDisasterReliefAirBridgeIndex: nationalDisasterReliefAir,
    disasterReliefAirBridgeByRegion,
    containerYardAutomationShare,
    nationalContainerYardAutomationThroughputIndex: nationalContainerYardAuto,
    containerYardAutomationThroughputByRegion,
    nationalNickelCobaltBatteryPrecursorIndex: nationalNickelPrecursor,
    nickelCobaltBatteryPrecursorByRegion,
    remoteIslandSealiftShare,
    nationalRemoteIslandSealiftIndex: nationalRemoteSealift,
    remoteIslandSealiftByRegion,
    railInlandTerminalAutomationShare,
    nationalRailInlandTerminalAutomationThroughputIndex: nationalInlandTerminalAuto,
    railInlandTerminalAutomationThroughputByRegion,
    nationalGraphiteBatteryAnodeExportIndex: nationalGraphiteAnode,
    graphiteBatteryAnodeExportByRegion,
    cycloneResilientCoastalFreightShare,
    nationalCycloneResilientCoastalFreightIndex: nationalCycloneCoastal,
    cycloneResilientCoastalFreightByRegion,
    electricBusDepotChargingLogisticsShare,
    nationalElectricBusDepotChargingLogisticsThroughputIndex: nationalEbusDepot,
    electricBusDepotChargingLogisticsThroughputByRegion,
    nationalVanadiumFlowBatteryExportIndex: nationalVanadiumFlow,
    vanadiumFlowBatteryExportByRegion,
    bushfireEvacuationRailBridgeShare,
    nationalBushfireEvacuationRailBridgeIndex: nationalBushfireEvac,
    bushfireEvacuationRailBridgeByRegion,
    automatedGrainSiloRailLoadoutShare,
    nationalAutomatedGrainSiloRailLoadoutThroughputIndex: nationalGrainSiloAuto,
    automatedGrainSiloRailLoadoutThroughputByRegion,
    nationalGreenIronPelletExportIndex: nationalGreenPellet,
    greenIronPelletExportByRegion,
    floodLeveeRailProtectionShare,
    nationalFloodLeveeRailProtectionIndex: nationalFloodLevee,
    floodLeveeRailProtectionByRegion,
    portZeroEmissionDrayageShare,
    nationalPortZeroEmissionDrayageThroughputIndex: nationalZeroDrayage,
    portZeroEmissionDrayageThroughputByRegion,
    nationalTitaniumSpongeExportIndex: nationalTitaniumSponge,
    titaniumSpongeExportByRegion,
    heatwaveRailSpeedRestrictionShare,
    nationalHeatwaveRailSpeedRestrictionIndex: nationalHeatwaveRail,
    heatwaveRailSpeedRestrictionByRegion,
    automatedLivestockExportYardShare,
    nationalAutomatedLivestockExportYardThroughputIndex: nationalLivestockYard,
    automatedLivestockExportYardThroughputByRegion,
    nationalSiliconSolarWaferExportIndex: nationalSiliconWafer,
    siliconSolarWaferExportByRegion,
    railCoalPhaseoutStagingShare,
    nationalRailCoalPhaseoutStagingIndex: nationalCoalPhaseout,
    railCoalPhaseoutStagingByRegion,
    airportBaggageRobotLogisticsShare,
    nationalAirportBaggageRobotLogisticsThroughputIndex: nationalBaggageRobot,
    airportBaggageRobotLogisticsThroughputByRegion,
    nationalOffshoreWindCableExportIndex: nationalWindCable,
    offshoreWindCableExportByRegion,
    medevacHelicopterStagingShare,
    nationalMedevacHelicopterStagingIndex: nationalMedevacHeli,
    medevacHelicopterStagingByRegion,
    reefRestorationLogisticsShare,
    nationalReefRestorationLogisticsThroughputIndex: nationalReefLogistics,
    reefRestorationLogisticsThroughputByRegion,
    nationalPumpedHydroRenewableExportIndex: nationalPumpedHydro,
    pumpedHydroRenewableExportByRegion,
    wildfireAirtankerStagingShare,
    nationalWildfireAirtankerStagingIndex: nationalWildfireTanker,
    wildfireAirtankerStagingByRegion,
    suburbanMicroFulfillmentLogisticsShare,
    nationalSuburbanMicroFulfillmentLogisticsThroughputIndex: nationalSuburbanMicro,
    suburbanMicroFulfillmentLogisticsThroughputByRegion,
    nationalDeepGeothermalExportIndex: nationalGeothermal,
    deepGeothermalExportByRegion,
    coastalFloodEvacStagingShare,
    nationalCoastalFloodEvacStagingIndex: nationalFloodEvac,
    coastalFloodEvacStagingByRegion,
    warehouseRobotSortationLogisticsShare,
    nationalWarehouseRobotSortationLogisticsThroughputIndex: nationalRobotSortation,
    warehouseRobotSortationLogisticsThroughputByRegion,
    nationalOffshoreWaveEnergyExportIndex: nationalWaveEnergy,
    offshoreWaveEnergyExportByRegion,
    remoteSchoolSupplyStagingShare,
    nationalRemoteSchoolSupplyStagingIndex: nationalSchoolSupply,
    remoteSchoolSupplyStagingByRegion,
    portLithiumHydroxideLogisticsShare,
    nationalPortLithiumHydroxideLogisticsThroughputIndex: nationalLithiumHydroxide,
    portLithiumHydroxideLogisticsThroughputByRegion,
    nationalDesalinationBrineExportIndex: nationalDesalBrine,
    desalinationBrineExportByRegion,
    wildlifeRescueAirliftStagingShare,
    nationalWildlifeRescueAirliftStagingIndex: nationalWildlifeRescue,
    wildlifeRescueAirliftStagingByRegion,
    urbanEvFreightChargingLogisticsShare,
    nationalUrbanEvFreightChargingLogisticsThroughputIndex: nationalEvFreightCharging,
    urbanEvFreightChargingLogisticsThroughputByRegion,
    nationalMoltenSaltSolarExportIndex: nationalMoltenSalt,
    moltenSaltSolarExportByRegion,
    alpineSkiResortSupplyStagingShare,
    nationalAlpineSkiResortSupplyStagingIndex: nationalAlpineSki,
    alpineSkiResortSupplyStagingByRegion,
    railAutonomousShuntingLogisticsShare,
    nationalRailAutonomousShuntingLogisticsThroughputIndex: nationalRailShunting,
    railAutonomousShuntingLogisticsThroughputByRegion,
    nationalBiomethaneGridExportIndex: nationalBiomethane,
    biomethaneGridExportByRegion,
    miningCampResupplyStagingShare,
    nationalMiningCampResupplyStagingIndex: nationalMiningCamp,
    miningCampResupplyStagingByRegion,
    portContainerReeferLogisticsShare,
    nationalPortContainerReeferLogisticsThroughputIndex: nationalContainerReefer,
    portContainerReeferLogisticsThroughputByRegion,
    nationalTidalLagoonExportIndex: nationalTidalLagoon,
    tidalLagoonExportByRegion,
    remoteTelehealthSupplyStagingShare,
    nationalRemoteTelehealthSupplyStagingIndex: nationalTelehealth,
    remoteTelehealthSupplyStagingByRegion,
    warehouseVerticalFulfillmentLogisticsShare,
    nationalWarehouseVerticalFulfillmentLogisticsThroughputIndex: nationalVerticalFulfillment,
    warehouseVerticalFulfillmentLogisticsThroughputByRegion,
    computeMs,
  };
}

export function defaultInfrastructureInputs(turn: number): TransportProductivityInputs {
  const assets = getAgent12TransportCatalog();
  return {
    turn,
    assets,
    operationalAssetIds: new Set(assets.map((a) => a.id)),
  };
}
