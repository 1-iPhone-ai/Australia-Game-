/**
 * V10.14 energy depth (SECTION 20AY) — core types.
 * Prefix: V1014_ENERGY_DEPTH_*
 */

export const V1014_ENERGY_DEPTH_SCHEMA_VERSION = '10.14.1' as const;
export const V1014_ENERGY_DEPTH_MODULE_ID = 'v1014_energy_depth' as const;

export const V1014_ENERGY_DEPTH_REGIONS = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export type V1014EnergyDepthRegionId = (typeof V1014_ENERGY_DEPTH_REGIONS)[number];

export type V1014EnergyDepthGridBand =
  | 'secure'
  | 'comfortable'
  | 'strained'
  | 'critical'
  | 'blackout_risk';

export type V1014EnergyDepthDepletionBand =
  | 'pristine'
  | 'developing'
  | 'mature'
  | 'depleted'
  | 'exhausted';

export type V1014EnergyDepthIntermittencyBand =
  | 'stable'
  | 'variable'
  | 'volatile'
  | 'extreme';

export type V1014EnergyDepthCarbonBand =
  | 'within_budget'
  | 'tight'
  | 'overshoot'
  | 'critical_overshoot';

export interface V1014EnergyDepthGridNodeCatalogEntry {
  id: string;
  regionId: V1014EnergyDepthRegionId;
  zoneIndex: number;
  hourBucket: number;
  baseLoadMw: number;
  firmCapacityMw: number;
  renewableCapacityMw: number;
  storageMw: number;
  transmissionImportMw: number;
  reserveTargetPct: number;
  documentation: string;
}

export interface V1014EnergyDepthDepletionCurveEntry {
  id: string;
  regionId: V1014EnergyDepthRegionId;
  resourceKind: string;
  siteRef: string;
  initialReservesMt: number;
  recoveryRatePct: number;
  waterPenalty: number;
  emissionsFactor: number;
  couplingIndustry: 'mining' | 'energy' | 'manufacturing';
  documentation: string;
}

export interface V1014EnergyDepthRenewableProfileEntry {
  id: string;
  regionId: V1014EnergyDepthRegionId;
  technology: string;
  hourBucket: number;
  capacityFactor: number;
  forecastErrorSigma: number;
  gridCoupling: 'weak' | 'moderate' | 'strong';
  documentation: string;
}

export interface V1014EnergyDepthCarbonBudgetEntry {
  id: string;
  scope: 'national' | V1014EnergyDepthRegionId;
  pathwayLabel: string;
  annualBudgetMtCO2e: number;
  cumulativeBudgetMtCO2e: number;
  sectorWeights: Record<string, number>;
  documentation: string;
}

export interface V1014EnergyDepthRegionalSlice {
  regionId: V1014EnergyDepthRegionId;
  gridBand: V1014EnergyDepthGridBand;
  reserveMarginPct: number;
  loadMw: number;
  generationMw: number;
  intermittencyBand: V1014EnergyDepthIntermittencyBand;
  depletionBand: V1014EnergyDepthDepletionBand;
  carbonBand: V1014EnergyDepthCarbonBand;
  cumulativeEmissionsMt: number;
  extractionPressure: number;
  renewableShare: number;
  modifierEnergy: number;
  modifierMining: number;
  evidence: string[];
}

export interface V1014EnergyDepthState {
  schemaVersion: typeof V1014_ENERGY_DEPTH_SCHEMA_VERSION;
  revision: number;
  turn: number;
  enabled: boolean;
  nationalGridBand: V1014EnergyDepthGridBand;
  nationalCarbonBand: V1014EnergyDepthCarbonBand;
  regions: Record<V1014EnergyDepthRegionId, V1014EnergyDepthRegionalSlice>;
  inputHash: string;
  computeMs: number;
  crisisHints: V1014EnergyDepthCrisisHint[];
}

export interface V1014EnergyDepthCrisisHint {
  id: string;
  category: 'energy' | 'environment' | 'supply';
  severity: 'watch' | 'elevated' | 'critical';
  regionIds: V1014EnergyDepthRegionId[];
  reason: string;
}

export interface V1014EnergyDepthPersisted {
  schemaVersion: typeof V1014_ENERGY_DEPTH_SCHEMA_VERSION;
  revision: number;
  initializedTurn: number | null;
  lastInputHash: string;
  cumulativeExtractionBySite: Record<string, number>;
  cumulativeEmissionsMt: number;
  gridHysteresis: Partial<Record<V1014EnergyDepthRegionId, V1014EnergyDepthGridBand>>;
  carbonPathwayId: string;
  history: Array<{ turn: number; nationalGridBand: V1014EnergyDepthGridBand; hash: string }>;
}

export interface V1014EnergyDepthInputs {
  turn: number;
  enabled: boolean;
  hourBucket: number;
  industrialEnergy: {
    regionalScores?: Record<string, { extractionScore?: number; renewableShare?: number; constraintPressure?: number }>;
    nationalRenewableShare?: number;
  } | null;
  industries: {
    regions?: Record<
      string,
      { industries?: Record<string, { strength?: number; condition?: string }> }
    >;
  } | null;
  infrastructure: {
    networks?: Record<string, { spareCapacity?: number; utilization?: number }>;
  } | null;
  systemicRisk: {
    domains?: Record<string, { exposure?: number; condition?: string }>;
  } | null;
  activeCrises: Array<{ id: string; category: string; status: string; affectedRegions: string[] }>;
}

export interface V1014EnergyDepthSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface V1014EnergyDepthSelfTestReport {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: V1014EnergyDepthSelfTestResult[];
}
