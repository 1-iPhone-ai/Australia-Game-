# Agent 12 — Transportation & Infrastructure

Roads, rail, ports, and logistics nodes with **measurable productivity effects**:

- Regional `productivityIndexBonus` (additive points)
- `logisticsCostMultiplier` (lower is cheaper freight)
- `freightCapacityIndex` (normalized throughput)
- `travelTimeFactor` (crew / passenger travel friction)

## Layout

| Path | Role |
|------|------|
| `catalog/` | Baseline AU transport assets (roads, rail, ports, logistics) |
| `productivity/` | Deterministic formulas + national aggregation |
| `integration/v94-productivity-bridge.ts` | Maps active V9.4 infra projects → catalog boosts |
| `tests/` | Node test suite |
| `run-self-checks.ts` | Fast CI self-check runner |

## Commands

```bash
npm run test:agent12
npm run selfcheck:agent12
npm run build:agent12-chunk
```

Generated assembly artifact: `operation-10m/modules/agent-12-infrastructure/chunk.tsx` (`OP10M_MODULE_BEGIN agent-12-infrastructure`).

## Scale wave round 49

- Schema **`agent12/50`**: advanced semiconductor packaging export throughput, remote burn-unit supply staging readiness, port wind-assisted ship berthing logistics share (`advancedSemiconductorPackagingExportPolicy`, `remoteBurnUnitSupplyStagingPolicy`, `portWindAssistedShipBerthingLogisticsPolicy`)
- Catalog: **673** assets, **161** corridors, **263** scenarios
- Systems: `network/advanced-semiconductor-packaging-export-index.ts`, `operations/remote-burn-unit-supply-staging-index.ts`, `productivity/port-wind-assisted-ship-berthing-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 48

- Schema **`agent12/49`**: green hydrogen electrolyzer export throughput, remote organ transplant supply staging readiness, port shore-power cold ironing logistics share (`greenHydrogenElectrolyzerExportPolicy`, `remoteOrganTransplantSupplyStagingPolicy`, `portShorePowerColdIroningLogisticsPolicy`)
- Catalog: **658** assets, **158** corridors, **258** scenarios
- Systems: `network/green-hydrogen-electrolyzer-export-index.ts`, `operations/remote-organ-transplant-supply-staging-index.ts`, `productivity/port-shore-power-cold-ironing-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 47

- Schema **`agent12/48`**: e-waste critical minerals recovery export throughput, regional oncology radiotherapy supply staging readiness, port autonomous tug berthing logistics share (`eWasteCriticalMineralsRecoveryExportPolicy`, `regionalOncologyRadiotherapySupplyStagingPolicy`, `portAutonomousTugBerthingLogisticsPolicy`)
- Catalog: **643** assets, **155** corridors, **253** scenarios
- Systems: `network/e-waste-critical-minerals-recovery-export-index.ts`, `operations/regional-oncology-radiotherapy-supply-staging-index.ts`, `productivity/port-autonomous-tug-berthing-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 46

- Schema **`agent12/47`**: recycled steel export throughput, remote pathology supply staging readiness, airport drone cargo logistics share (`recycledSteelExportPolicy`, `remotePathologySupplyStagingPolicy`, `airportDroneCargoLogisticsPolicy`)
- Catalog: **628** assets, **152** corridors, **248** scenarios
- Systems: `network/recycled-steel-export-index.ts`, `operations/remote-pathology-supply-staging-index.ts`, `productivity/airport-drone-cargo-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 45

- Schema **`agent12/46`**: floating solar array export throughput, coastal rescue helicopter staging readiness, port battery swapping logistics share (`floatingSolarArrayExportPolicy`, `coastalRescueHelicopterStagingPolicy`, `portBatterySwappingLogisticsPolicy`)
- Catalog: **615** assets, **149** corridors, **243** scenarios
- Systems: `network/floating-solar-array-export-index.ts`, `operations/coastal-rescue-helicopter-staging-index.ts`, `productivity/port-battery-swapping-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 44

- Schema **`agent12/45`**: marine kelp export throughput, remote dialysis supply staging readiness, rail automated inspection logistics share (`marineKelpExportPolicy`, `remoteDialysisSupplyStagingPolicy`, `railAutomatedInspectionLogisticsPolicy`)
- Catalog: **602** assets, **146** corridors, **238** scenarios
- Systems: `network/marine-kelp-export-index.ts`, `operations/remote-dialysis-supply-staging-index.ts`, `productivity/rail-automated-inspection-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 43

- Schema **`agent12/44`**: tidal lagoon export throughput, remote telehealth supply staging readiness, warehouse vertical fulfillment logistics share (`tidalLagoonExportPolicy`, `remoteTelehealthSupplyStagingPolicy`, `warehouseVerticalFulfillmentLogisticsPolicy`)
- Catalog: **589** assets, **143** corridors, **233** scenarios
- Systems: `network/tidal-lagoon-export-index.ts`, `operations/remote-telehealth-supply-staging-index.ts`, `productivity/warehouse-vertical-fulfillment-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 42

- Schema **`agent12/43`**: biomethane grid export throughput, mining camp resupply staging readiness, port container reefer logistics share (`biomethaneGridExportPolicy`, `miningCampResupplyStagingPolicy`, `portContainerReeferLogisticsPolicy`)
- Catalog: **576** assets, **140** corridors, **228** scenarios
- Systems: `network/biomethane-grid-export-index.ts`, `operations/mining-camp-resupply-staging-index.ts`, `productivity/port-container-reefer-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 41

- Schema **`agent12/42`**: molten salt solar export throughput, alpine ski resort supply staging readiness, rail autonomous shunting logistics share (`moltenSaltSolarExportPolicy`, `alpineSkiResortSupplyStagingPolicy`, `railAutonomousShuntingLogisticsPolicy`)
- Catalog: **563** assets, **137** corridors, **223** scenarios
- Systems: `network/molten-salt-solar-export-index.ts`, `operations/alpine-ski-resort-supply-staging-index.ts`, `productivity/rail-autonomous-shunting-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 40

- Schema **`agent12/41`**: desalination brine export throughput, wildlife rescue airlift staging readiness, urban EV freight charging logistics share (`desalinationBrineExportPolicy`, `wildlifeRescueAirliftStagingPolicy`, `urbanEvFreightChargingLogisticsPolicy`)
- Catalog: **550** assets, **134** corridors, **218** scenarios
- Systems: `network/desalination-brine-export-index.ts`, `operations/wildlife-rescue-airlift-staging-index.ts`, `productivity/urban-ev-freight-charging-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 39

- Schema **`agent12/40`**: offshore wave energy export throughput, remote school supply staging readiness, port lithium hydroxide logistics share (`offshoreWaveEnergyExportPolicy`, `remoteSchoolSupplyStagingPolicy`, `portLithiumHydroxideLogisticsPolicy`)
- Catalog: **537** assets, **131** corridors, **213** scenarios
- Systems: `network/offshore-wave-energy-export-index.ts`, `operations/remote-school-supply-staging-index.ts`, `productivity/port-lithium-hydroxide-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 38

- Schema **`agent12/39`**: deep geothermal export throughput, coastal flood evac staging readiness, warehouse robot sortation logistics share (`deepGeothermalExportPolicy`, `coastalFloodEvacStagingPolicy`, `warehouseRobotSortationLogisticsPolicy`)
- Catalog: **523** assets, **128** corridors, **208** scenarios
- Systems: `network/deep-geothermal-export-index.ts`, `operations/coastal-flood-evac-staging-index.ts`, `productivity/warehouse-robot-sortation-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 37

- Schema **`agent12/38`**: pumped hydro renewable export throughput, wildfire airtanker staging readiness, suburban micro-fulfillment logistics share (`pumpedHydroRenewableExportPolicy`, `wildfireAirtankerStagingPolicy`, `suburbanMicroFulfillmentLogisticsPolicy`)
- Catalog: **510** assets, **125** corridors, **203** scenarios
- Systems: `network/pumped-hydro-renewable-export-index.ts`, `operations/wildfire-airtanker-staging-index.ts`, `productivity/suburban-micro-fulfillment-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 36

- Schema **`agent12/37`**: offshore wind cable export throughput, medevac helicopter staging readiness, reef restoration logistics share (`offshoreWindCableExportPolicy`, `medevacHelicopterStagingPolicy`, `reefRestorationLogisticsPolicy`)
- Catalog: **497** assets, **122** corridors, **198** scenarios
- Systems: `network/offshore-wind-cable-export-index.ts`, `operations/medevac-helicopter-staging-index.ts`, `productivity/reef-restoration-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 35

- Schema **`agent12/36`**: silicon solar wafer export throughput, rail coal phase-out staging readiness, airport baggage robot logistics share (`siliconSolarWaferExportPolicy`, `railCoalPhaseoutStagingPolicy`, `airportBaggageRobotLogisticsPolicy`)
- Catalog: **484** assets, **119** corridors, **193** scenarios
- Systems: `network/silicon-solar-wafer-export-index.ts`, `operations/rail-coal-phaseout-staging-index.ts`, `productivity/airport-baggage-robot-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 34

- Schema **`agent12/35`**: titanium sponge export throughput, heatwave rail speed-restriction readiness, automated livestock export yard share (`titaniumSpongeExportPolicy`, `heatwaveRailSpeedRestrictionPolicy`, `automatedLivestockExportYardPolicy`)
- Catalog: **471** assets, **116** corridors, **188** scenarios
- Systems: `network/titanium-sponge-export-index.ts`, `operations/heatwave-rail-speed-restriction-index.ts`, `productivity/automated-livestock-export-yard-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 33

- Schema **`agent12/34`**: green iron pellet export throughput, flood levee rail protection readiness, port zero-emission drayage share (`greenIronPelletExportPolicy`, `floodLeveeRailProtectionPolicy`, `portZeroEmissionDrayagePolicy`)
- Catalog: **458** assets, **113** corridors, **183** scenarios
- Systems: `network/green-iron-pellet-export-index.ts`, `operations/flood-levee-rail-protection-index.ts`, `productivity/port-zero-emission-drayage-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 32

- Schema **`agent12/33`**: vanadium flow-battery export throughput, bushfire evacuation rail bridge readiness, automated grain silo rail loadout share (`vanadiumFlowBatteryExportPolicy`, `bushfireEvacuationRailBridgePolicy`, `automatedGrainSiloRailLoadoutPolicy`)
- Catalog: **445** assets, **110** corridors, **178** scenarios
- Systems: `network/vanadium-flow-battery-export-index.ts`, `operations/bushfire-evacuation-rail-bridge-index.ts`, `productivity/automated-grain-silo-rail-loadout-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 31

- Schema **`agent12/32`**: synthetic graphite battery anode export throughput, cyclone-resilient coastal freight readiness, electric bus depot charging logistics share (`graphiteBatteryAnodeExportPolicy`, `cycloneResilientCoastalFreightPolicy`, `electricBusDepotChargingLogisticsPolicy`)
- Catalog: **432** assets, **107** corridors, **173** scenarios
- Systems: `network/graphite-battery-anode-export-index.ts`, `operations/cyclone-resilient-coastal-freight-index.ts`, `productivity/electric-bus-depot-charging-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 30

- Schema **`agent12/31`**: nickel–cobalt battery precursor export throughput, remote island sealift readiness, rail inland terminal automation share (`nickelCobaltBatteryPrecursorPolicy`, `remoteIslandSealiftPolicy`, `railInlandTerminalAutomationPolicy`)
- Catalog: **419** assets, **104** corridors, **168** scenarios
- Systems: `network/nickel-cobalt-battery-precursor-index.ts`, `operations/remote-island-sealift-index.ts`, `productivity/rail-inland-terminal-automation-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 29

- Schema **`agent12/30`**: alumina refinery export throughput, disaster relief air-bridge readiness, container yard automation share (`aluminaRefineryExportPolicy`, `disasterReliefAirBridgePolicy`, `containerYardAutomationPolicy`)
- Catalog: **406** assets, **101** corridors, **163** scenarios
- Systems: `network/alumina-refinery-export-index.ts`, `operations/disaster-relief-air-bridge-index.ts`, `productivity/container-yard-automation-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 28

- Schema **`agent12/29`**: copper concentrate export throughput, pharmaceutical cold-chain readiness, rail passenger–freight path share (`copperConcentrateExportPolicy`, `pharmaceuticalColdChainPolicy`, `railPassengerFreightPathPolicy`)
- Catalog: **393** assets, **98** corridors, **158** scenarios
- Systems: `network/copper-concentrate-export-index.ts`, `operations/pharmaceutical-cold-chain-index.ts`, `productivity/rail-passenger-freight-path-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 27

- Schema **`agent12/28`**: offshore wind tow install throughput, EV battery recycling logistics readiness, urban courier microhub share (`offshoreWindTowInstallPolicy`, `evBatteryRecyclingLogisticsPolicy`, `urbanCourierMicrohubPolicy`)
- Catalog: **380** assets, **95** corridors, **153** scenarios
- Systems: `network/offshore-wind-tow-install-index.ts`, `operations/ev-battery-recycling-logistics-index.ts`, `productivity/urban-courier-microhub-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 26

- Schema **`agent12/27`**: green steel export throughput, indigenous community airlift readiness, port berth slot optimizer share (`greenSteelExportPolicy`, `indigenousCommunityAirliftPolicy`, `portBerthSlotOptimizerPolicy`)
- Catalog: **367** assets, **92** corridors, **148** scenarios
- Systems: `network/green-steel-export-index.ts`, `operations/indigenous-community-airlift-index.ts`, `productivity/port-berth-slot-optimizer-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 25

- Schema **`agent12/26`**: sustainable aviation fuel supply throughput, outback diesel security readiness, rail double-stack container share (`sustainableAviationFuelSupplyPolicy`, `outbackDieselSecurityPolicy`, `railDoubleStackContainerPolicy`)
- Catalog: **354** assets, **89** corridors, **143** scenarios
- Systems: `network/sustainable-aviation-fuel-supply-index.ts`, `operations/outback-diesel-security-logistics-index.ts`, `productivity/rail-double-stack-container-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 24

- Schema **`agent12/25`**: methanol bunkering export throughput, Antarctic resupply logistics readiness, smart border preclearance share (`methanolBunkeringExportPolicy`, `antarcticResupplyLogisticsPolicy`, `smartBorderPreclearancePolicy`)
- Catalog: **341** assets, **86** corridors, **138** scenarios
- Systems: `network/methanol-bunkering-export-index.ts`, `operations/antarctic-resupply-logistics-index.ts`, `productivity/smart-border-preclearance-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 23

- Schema **`agent12/24`**: autonomous heavy haul throughput, GBR biosecurity logistics readiness, night urban freight window share (`autonomousHeavyHaulPolicy`, `gbrBiosecurityLogisticsPolicy`, `nightUrbanFreightWindowPolicy`)
- Catalog: **328** assets, **83** corridors, **133** scenarios
- Systems: `network/autonomous-heavy-haul-index.ts`, `operations/gbr-biosecurity-logistics-index.ts`, `productivity/night-urban-freight-window-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 22

- Schema **`agent12/23`**: grid BESS logistics throughput, Pacific humanitarian sealift readiness, autonomous port tractor share (`gridBatteryLogisticsPolicy`, `pacificHumanitarianSealiftPolicy`, `autonomousPortTractorPolicy`)
- Catalog: **313** assets, **80** corridors, **128** scenarios
- Systems: `network/grid-battery-logistics-index.ts`, `operations/pacific-humanitarian-sealift-index.ts`, `productivity/autonomous-port-tractor-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 21

- Schema **`agent12/22`**: floating offshore wind staging throughput, critical medicine airlift readiness, regional freight drone share (`floatingOffshoreWindStagingPolicy`, `criticalMedicineAirliftPolicy`, `regionalFreightDronePolicy`)
- Catalog: **300** assets, **77** corridors, **123** scenarios
- Systems: `network/floating-offshore-wind-staging-index.ts`, `operations/critical-medicine-airlift-index.ts`, `productivity/regional-freight-drone-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 20

- Schema **`agent12/21`**: offshore CCS logistics throughput, hydrogen LNG export readiness, urban microfreight hub share (`offshoreCcsLogisticsPolicy`, `hydrogenLngExportPolicy`, `urbanMicrofreightHubPolicy`)
- Catalog: **287** assets, **74** corridors, **118** scenarios
- Systems: `network/offshore-ccs-logistics-index.ts`, `operations/hydrogen-lng-export-index.ts`, `productivity/urban-microfreight-hub-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 19

- Schema **`agent12/20`**: rare-earth magnet export throughput, trans-Tasman reefer express readiness, zero-emission truck corridor share (`rareEarthMagnetExportPolicy`, `transTasmanReeferExpressPolicy`, `zeroEmissionTruckCorridorPolicy`)
- Catalog: **273** assets, **71** corridors, **113** scenarios
- Systems: `network/rare-earth-magnet-export-index.ts`, `operations/trans-tasman-reefer-express-index.ts`, `productivity/zero-emission-truck-corridor-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 18

- Schema **`agent12/19`**: lithium brine export throughput, inland rail express readiness, space launch logistics share (`lithiumBrineExportPolicy`, `inlandRailExpressPolicy`, `spaceLaunchLogisticsPolicy`)
- Catalog: **260** assets, **68** corridors, **108** scenarios
- Systems: `network/lithium-brine-export-index.ts`, `operations/inland-rail-express-index.ts`, `productivity/space-launch-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 17

- Schema **`agent12/18`**: subsea cable landing throughput, green ammonia export readiness, airport express rail share (`subseaCableLandingPolicy`, `greenAmmoniaExportPolicy`, `airportExpressRailPolicy`)
- Catalog: **247** assets, **65** corridors, **103** scenarios
- Systems: `network/subsea-cable-landing-index.ts`, `operations/green-ammonia-export-index.ts`, `productivity/airport-express-rail-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 16

- Schema **`agent12/17`**: offshore wind logistics throughput, battery supply chain readiness, cruise turnaround share (`offshoreWindLogisticsPolicy`, `batterySupplyChainPolicy`, `cruiseTurnaroundPolicy`)
- Catalog: **234** assets, **62** corridors, **98** scenarios
- Systems: `network/offshore-wind-logistics-index.ts`, `operations/battery-supply-chain-index.ts`, `productivity/cruise-turnaround-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 15

- Schema **`agent12/16`**: Pacific feeder tradelane throughput, medical supply chain readiness, data-centre logistics share (`pacificFeederPolicy`, `medicalSupplyPolicy`, `dataCentreLogisticsPolicy`)
- Catalog: **221** assets, **59** corridors, **93** scenarios
- Systems: `network/pacific-feeder-tradelane-index.ts`, `operations/medical-supply-chain-index.ts`, `productivity/data-centre-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 14

- Schema **`agent12/15`**: agricultural export throughput, track possession efficiency, green bunkering share (`agriculturalExportPolicy`, `trackPossessionPolicy`, `greenBunkeringPolicy`)
- Catalog: **208** assets, **56** corridors, **88** scenarios
- Systems: `network/agricultural-export-throughput-index.ts`, `operations/track-possession-efficiency-index.ts`, `productivity/green-bunkering-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 13

- Schema **`agent12/14`**: gauge interoperability, disaster recovery staging, circular freight share (`gaugeInteroperabilityPolicy`, `disasterRecoveryStagingPolicy`, `circularFreightPolicy`)
- Catalog: **194** assets, **53** corridors, **83** scenarios
- Systems: `network/gauge-interoperability-index.ts`, `operations/disaster-recovery-staging-index.ts`, `productivity/circular-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 12

- Schema **`agent12/13`**: critical-minerals export throughput, channel maintenance readiness, indigenous remote supply share (`criticalMineralsPolicy`, `channelMaintenancePolicy`, `indigenousRemoteSupplyPolicy`)
- Catalog: **181** assets, **50** corridors, **78** scenarios
- Systems: `network/critical-minerals-export-index.ts`, `operations/channel-maintenance-index.ts`, `productivity/indigenous-remote-supply-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 11

- Schema **`agent12/12`**: defence logistics readiness, weather-resilience routing, digital freight visibility (`defenceMobilityPolicy`, `weatherResiliencePolicy`, `digitalFreightPolicy`)
- Catalog: **168** assets, **47** corridors, **73** scenarios
- Systems: `network/defence-logistics-readiness-index.ts`, `operations/weather-resilience-routing-index.ts`, `productivity/digital-freight-visibility-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 10

- Schema **`agent12/11`**: deep-sea gateway throughput, infrastructure permitting velocity, electric freight corridor share (`deepSeaGatewayPolicy`, `permittingStreamlinePolicy`, `electricFreightPolicy`)
- Catalog: **155** assets, **44** corridors, **68** scenarios
- Systems: `network/deep-sea-gateway-throughput-index.ts`, `operations/infrastructure-permitting-index.ts`, `productivity/electric-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 9

- Schema **`agent12/10`**: coastal shipping throughput, biosecurity clearance efficiency, autonomous freight share (`coastalShippingPolicy`, `biosecurityStreamlinePolicy`, `autonomousFreightPolicy`)
- Catalog: **142** assets, **41** corridors, **63** scenarios
- Systems: `network/coastal-shipping-throughput-index.ts`, `operations/biosecurity-clearance-index.ts`, `productivity/autonomous-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 8

- Schema **`agent12/9`**: aviation cargo throughput, customs clearance efficiency, hydrogen corridor share (`hydrogenFreightPolicy`, `customsModernizationPolicy`)
- Catalog: **129** assets, **38** corridors, **58** scenarios
- Systems: `network/aviation-cargo-throughput-index.ts`, `operations/customs-clearance-index.ts`, `productivity/hydrogen-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 7

- Schema **`agent12/8`**: bulk export throughput, intermodal dwell median, urban congestion relief (`congestionReliefPolicy`)
- Catalog: **116** assets, **35** corridors, **53** scenarios
- Systems: `network/bulk-export-throughput-index.ts`, `operations/intermodal-dwell-index.ts`, `productivity/congestion-relief-index.ts`
- Verify: `npm run test:agent12` (**60/60**), `npm run build:agent12-chunk` (**5464** lines)

## Assembly

Agent 25 merges this tree into `(V9.4) australia-game-with-ai.tsx` near **SECTION 20U** / **V10.14** macro productivity inputs. See `INTEGRATION.md`.
