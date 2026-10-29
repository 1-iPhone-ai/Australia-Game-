/**
 * V1032_TRES — telecom network resilience, state–federal transfer & exchange_zone (SECTION 20CB / O6K-68).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1032_TRES_SCHEMA_VERSION = '10.32.telecom_resilience.1' as const;

export type V1032TresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1032TresTelecomResilienceChannel =
  | 'fiber_backbone'
  | '5g_ran'
  | 'satellite_backhaul'
  | 'ixp_peering'
  | 'dns_anycast'
  | 'cdn_edge'
  | 'last_mile'
  | 'enterprise_circuit'
  | 'regional'
  | 'remote';

export type V1032TresTelecomResilienceChannelLegacy =
  | 'rent'
  | 'mortgage'
  | 'social'
  | 'build_to_rent'
  | 'student'
  | 'senior'
  | 'regional'
  | 'remote'
  | 'investor'
  | 'co_living';

export type V1032TresTelecomResilienceChannelLegacy =
  | 'freight'
  | 'energy'
  | 'water'
  | 'digital'
  | 'trade'
  | 'pharma'
  | 'food'
  | 'industrial'
  | 'telecom'
  | 'finance';

export type V1032TresTelecomResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1032TresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1032TresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1032TresRegionId, number>>;
  backboneBufferIndex: number;
}

export interface V1032TresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1032TresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  routingCascadeRisk: number;
}

export interface V1032TresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1032TresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation exchange-zone-node slice (SECTION 20BR). */
export interface V1032TresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1032TresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1032TresWaterSecurity20bwSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Grid resilience slice (SECTION 20BZ — V1030 heatwave / arid-buffer bridge). */
export interface V1032TresInlandHeat20bzSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1032TresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance exchange-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1032TresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1032TresBackboneBufferEdge {
  fromChannel: V1032TresTelecomResilienceChannel;
  toChannel: V1032TresTelecomResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1032TresFailoverSnapshot {
  scenarioId: string;
  regionId: V1032TresRegionId;
  telecomResilienceChannel: V1032TresTelecomResilienceChannel;
  telecomResilienceBand: V1032TresTelecomResilienceBand;
  telecomStressExposureIndex: number;
  backboneBufferDelayTurns: number;
  telecomResilienceScore: number;
  telecomResilienceBand: V1032TresTelecomResilienceBand;
}

export interface V1032TresPersisted {
  schemaVersion: typeof V1032_TRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  failoverSnapshots: Record<string, V1032TresFailoverSnapshot>;
  backboneBufferGraphRevision: number;
  regionalBackboneBuffer: Partial<
    Record<
      V1032TresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateTelecomStressExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1032TresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1032TresV1014SupplySlice;
  trade20ba: V1032TresV1014TradeSlice;
  energy20bc: V1032TresV1014EnergySlice;
  workforce20bf: V1032TresV1014WorkforceSlice;
  publicServices20az: V1032TresPublicServices20azSlice;
  climateAdaptation20br: V1032TresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1032TresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1032TresBiodiversityStewardship20buSlice;
  reserveHeadroom: number;
  telecomResiliencePolicyFocus: number;
  activeFailoverScenarioIds: string[];
  activeExchangeZoneIds: string[];
  persisted: V1032TresPersisted | null;
}

export interface V1032TresRuntimeState {
  turn: number;
  aggregateTelecomStressExposureIndex: number;
  aggregateTelecomResilienceScore: number;
  telecomNetworkHarmonyScore: number;
  backboneBufferPressure: number;
  backboneBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1032TresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1032TresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  gridResilienceDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1032TresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1032TresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1032TresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1032TresTurnResult {
  state: V1032TresRuntimeState;
  persisted: V1032TresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1032TresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
