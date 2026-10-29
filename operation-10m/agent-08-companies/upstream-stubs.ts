/**
 * Minimal upstream shapes for standalone Agent 08 module development.
 * Drop this file on merge — canonical V9.4 types replace these stubs.
 */

export type StrategicIndustryKind =
  | 'mining'
  | 'agriculture'
  | 'energy'
  | 'manufacturing'
  | 'technology'
  | 'research'
  | 'tourism'
  | 'trade';

export type StrategicSupplyKind =
  | 'minerals'
  | 'agricultural_goods'
  | 'energy'
  | 'manufactured_goods'
  | 'technology_capability'
  | 'research_capability'
  | 'tourism_capacity';

export type IndustrialResilience = 'exposed' | 'moderate' | 'robust';
export type IndustryDiversityBand = 'highly_specialized' | 'specialized' | 'mixed' | 'diversified';
export type IndustryCondition =
  | 'weak'
  | 'developing'
  | 'healthy'
  | 'strong'
  | 'booming'
  | 'constrained'
  | 'disrupted';

export type LRSector =
  | 'mining'
  | 'agriculture'
  | 'technology'
  | 'finance'
  | 'manufacturing'
  | 'energy'
  | 'renewables'
  | 'tourism'
  | 'trade'
  | 'logistics'
  | 'research'
  | 'defense'
  | 'infrastructure';

export type LRMomentumBand =
  | 'declining'
  | 'weakening'
  | 'stable'
  | 'growing'
  | 'rapid_growth'
  | 'booming';

export const LR_MOM_RANK: Record<LRMomentumBand, number> = {
  declining: 0,
  weakening: 1,
  stable: 2,
  growing: 3,
  rapid_growth: 4,
  booming: 5,
};

export const SUPPLY_LABEL: Record<StrategicSupplyKind, string> = {
  minerals: 'Minerals',
  agricultural_goods: 'Agricultural goods',
  energy: 'Energy',
  manufactured_goods: 'Manufactured goods',
  technology_capability: 'Technology capability',
  research_capability: 'Research capability',
  tourism_capacity: 'Tourism capacity',
};

export const REGIONS: Record<string, { name: string }> = {
  NSW: { name: 'New South Wales' },
  VIC: { name: 'Victoria' },
  QLD: { name: 'Queensland' },
  WA: { name: 'Western Australia' },
  SA: { name: 'South Australia' },
  TAS: { name: 'Tasmania' },
  NT: { name: 'Northern Territory' },
  ACT: { name: 'Australian Capital Territory' },
};

export interface GameSettingsState {
  nationalSystemsEnabled?: boolean;
  industriesEnabled?: boolean;
  privateSectorEnabled?: boolean;
  workforceHumanCapitalEnabled?: boolean;
  publicFinanceEnabled?: boolean;
}

export interface IndustryOutputStatus {
  supply: StrategicSupplyKind;
  amount: number;
}

export interface IndustryState {
  industry: StrategicIndustryKind;
  strength: number;
  effectiveOutput: number;
  utilization: number;
  constraint: { kind: string; text?: string } | null;
  outputs: IndustryOutputStatus[];
}

export interface SupplyDependency {
  id: string;
  providerRegionId: string;
  supply: StrategicSupplyKind;
  share: number;
  fragile: boolean;
  reason: string;
}

export interface RegionalIndustryState {
  regionId: string;
  industries: Partial<Record<StrategicIndustryKind, IndustryState>>;
  suppliedBy: SupplyDependency[];
  primaryIndustrialConstraint: string | null;
  resilience: IndustrialResilience;
}

export interface SupplyChainBottleneck {
  id: string;
  importance?: string;
}

export interface NationalIndustrySummary {
  strongestIndustries: StrategicIndustryKind[];
}

export interface IndustriesSupplyChainsState {
  revision: number;
  regions: Record<string, RegionalIndustryState>;
  dependencies: Array<{ id: string; importance: string }>;
}

export interface DynamicRegionalState {
  momentum: { band: LRMomentumBand };
  sectors: Partial<Record<LRSector, number>>;
}

export interface LivingRegionsState {
  revision: number;
  regions: Record<string, DynamicRegionalState>;
}

export interface EconomicGeographyState {
  revision: number;
}

export interface StrategicInfrastructureState {
  revision: number;
}

export interface NationalSystemsState {
  revision: number;
}

export interface NationalWorkforceState {
  revision: number;
  regions?: Record<
    string,
    {
      employmentRate?: number;
      wagePressure?: number;
      skillsGap?: number;
    }
  >;
}

export interface LRObserverMap {
  [key: string]: unknown;
}

export interface StrategicWorldEvent {
  id: string;
  turn: number;
  kind: string;
  text: string;
}

export interface V9SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
