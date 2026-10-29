import type { BusinessCyclePhase, MacroInvestmentClimateBand, MacroProductivityBand, MacroSectorId } from './types.ts';

export const V1014_MACRO_CORE_REGIONS: readonly string[] = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT'
] as const;

export const V1014_MACRO_LIMITS = {
  maxEvidence: 10,
  maxTransitions: 16,
  maxHistory: 24,
  maxRegionalRows: 8,
  hysteresisDeadband: 2.0,
  accountingTolerance: 1e-5
} as const;

export const BUSINESS_CYCLE_LABEL: Record<BusinessCyclePhase, string> = {
  expansion: 'EXPANSION',
  peak: 'PEAK',
  slowdown: 'SLOWDOWN',
  contraction: 'CONTRACTION',
  trough: 'TROUGH',
  recovery: 'RECOVERY'
};

export const V1014_MACRO_PRODUCTIVITY_LABEL: Record<MacroProductivityBand, string> = {
  critical: 'CRITICAL',
  weak: 'WEAK',
  moderate: 'MODERATE',
  strong: 'STRONG',
  leading: 'LEADING'
};

export const V1014_MACRO_INVESTMENT_LABEL: Record<MacroInvestmentClimateBand, string> = {
  frozen: 'FROZEN',
  cautious: 'CAUTIOUS',
  balanced: 'BALANCED',
  active: 'ACTIVE',
  overheating: 'OVERHEATING'
};

export const V1014_MACRO_REGION_BASE_WEIGHT: Record<string, number> = {
  NSW: 0.32,
  VIC: 0.26,
  QLD: 0.19,
  WA: 0.16,
  SA: 0.04,
  TAS: 0.01,
  NT: 0.01,
  ACT: 0.01
};

export const V1014_MACRO_SECTOR_PRODUCTIVITY_PRIORS: Record<MacroSectorId, number> = {
  mining: 57,
  energy: 53,
  manufacturing: 64,
  agriculture: 61,
  services: 66,
  technology: 54,
  tourism: 67,
  construction: 66,
  trade_logistics: 60
};

export const V1014_MACRO_SECTOR_KEYS: MacroSectorId[] = [
  'mining',
  'energy',
  'manufacturing',
  'agriculture',
  'services',
  'technology',
  'tourism',
  'construction',
  'trade_logistics'
];

/** LAB reference profiles (one entry per region × sector). */
export const V1014_MACRO_REF_PROFILES: Record<string, readonly string[]> = Object.fromEntries(
  V1014_MACRO_CORE_REGIONS.map(code => [
    code,
    V1014_MACRO_SECTOR_KEYS.map(s => `${code}:${s}`)
  ])
);
