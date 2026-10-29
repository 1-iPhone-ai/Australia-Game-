/**
 * V10.14 — Macroeconomic cycles, productivity, investment & national accounting (Agent 06)
 * Serializable types only; no imports from canonical TSX.
 */

export const V1014_MACRO_SCHEMA_VERSION = '10.14.0';

export type BusinessCyclePhase =
  | 'expansion'
  | 'peak'
  | 'slowdown'
  | 'contraction'
  | 'trough'
  | 'recovery';

export type MacroProductivityBand = 'critical' | 'weak' | 'moderate' | 'strong' | 'leading';
export type MacroInvestmentClimateBand = 'frozen' | 'cautious' | 'balanced' | 'active' | 'overheating';
export type MacroUtilizationBand = 'slack' | 'below_potential' | 'balanced' | 'tight' | 'overextended';
export type RegionalContributionRole = 'anchor' | 'driver' | 'balanced' | 'lagging' | 'volatile';

export type MacroSectorId =
  | 'mining'
  | 'energy'
  | 'manufacturing'
  | 'agriculture'
  | 'services'
  | 'technology'
  | 'tourism'
  | 'construction'
  | 'trade_logistics';

export interface MacroEconomyEvidence {
  id: string;
  sourceSystem: string;
  sourceId: string;
  factor: string;
  contribution: number;
  regionIds: string[];
  turn: number;
  visibility: 'public' | 'actor_visible';
}

export interface RegionalMacroContribution {
  regionId: string;
  share: number;
  role: RegionalContributionRole;
  productivityIndex: number;
  investmentIntensity: number;
  utilizationIndex: number;
  primarySector: string;
  contributionTags: string[];
  evidence: MacroEconomyEvidence[];
}

export interface NationalAccountingLedger {
  grossOutputIndex: number;
  productivityComponent: number;
  utilizationComponent: number;
  investmentComponent: number;
  regionalSumShare: number;
  identityResidual: number;
  identityOk: boolean;
  provenance: string[];
}

export interface NationalMacroEconomyState {
  schemaVersion: string;
  revision: number;
  turn: number;
  inputHash: string;
  cyclePhase: BusinessCyclePhase;
  cycleMomentum: number;
  cycleDurationTurns: number;
  productivityBand: MacroProductivityBand;
  productivityIndex: number;
  investmentClimate: MacroInvestmentClimateBand;
  grossInvestmentIndex: number;
  utilizationBand: MacroUtilizationBand;
  utilizationIndex: number;
  regionalContributions: RegionalMacroContribution[];
  accounting: NationalAccountingLedger;
  sectorProductivity: Record<string, number>;
  evidence: MacroEconomyEvidence[];
  outlook: {
    phase: BusinessCyclePhase;
    productivity: MacroProductivityBand;
    investment: MacroInvestmentClimateBand;
  };
}

export interface MacroEconomyPersisted {
  schemaVersion: string;
  revision: number;
  initializedTurn: number | null;
  lastUpdatedTurn: number;
  lastInputHash: string;
  cycleHysteresis: BusinessCyclePhase;
  cycleScore: number;
  productivityHysteresis: MacroProductivityBand;
  productivityScore: number;
  investmentHysteresis: MacroInvestmentClimateBand;
  investmentScore: number;
  transitions: Array<{ id: string; turn: number; kind: string; summary: string }>;
  history: Array<{ id: string; turn: number; summary: string }>;
}

export interface MacroEconomyInputs {
  turn: number;
  enabled?: boolean;
  livingRegions?: any;
  nationalSystems?: any;
  industries?: any;
  innovation?: any;
  workforce?: any;
  publicFinance?: any;
  households?: any;
  economicGeography?: any;
  highInflationScenarioActive?: boolean;
  creditShockActive?: boolean;
  regions?: Record<string, { economyScore?: number; momentumBand?: string; developmentScore?: number }>;
}

export interface MacroSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface GuardianEvaluationContext {
  isReplay?: boolean;
  gameState?: any;
  gameSettings?: any;
  actorId?: string;
  turn?: number;
}

export interface GuardianDetectedRisk {
  id: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  evidence: string[];
  assumptions: string[];
  probability: number;
  estimatedImpact: number;
  confidence: number;
  reversible: boolean;
  immediate: boolean;
  triggeredSettingKeys: string[];
  systemIds: string[];
}
