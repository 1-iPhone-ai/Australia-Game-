import type { BusinessCyclePhase } from '../types.ts';
import type { MacroEvidenceSink, MacroScoreBundle } from '../shocks.ts';
import { composeStackedShockDeltas } from '../shock-composition.ts';

export type CyclicalShockKind =
  | 'demand'
  | 'supply'
  | 'financial'
  | 'external'
  | 'policy'
  | 'legacy_flag';

export interface CyclicalMacroShockDefinition {
  id: string;
  label: string;
  kind: CyclicalShockKind;
  /** Typical cycle phases when this shock is most likely (informational). */
  typicalPhases: BusinessCyclePhase[];
  productivityDelta: number;
  investmentDelta: number;
  cycleDelta: number;
  evidenceFactor: string;
  evidenceContribution: number;
  sourceSystem: string;
  sourceId: string;
  /** Optional regional bias (multiplier on weight rows only — not player cash). */
  biasedRegionIds?: string[];
  description: string;
}

export const CYCLICAL_MACRO_SHOCK_CATALOG: Record<string, CyclicalMacroShockDefinition> = {
  high_inflation: {
    id: 'high_inflation',
    label: 'High inflation scenario',
    kind: 'legacy_flag',
    typicalPhases: ['peak', 'slowdown'],
    productivityDelta: -4,
    investmentDelta: -6,
    cycleDelta: -5,
    evidenceFactor: 'inflation_scenario',
    evidenceContribution: -0.04,
    sourceSystem: 'scenario',
    sourceId: 'high_inflation',
    description: 'Broad price pressure erodes real investment and cycle momentum.'
  },
  credit_contraction: {
    id: 'credit_contraction',
    label: 'Credit contraction',
    kind: 'legacy_flag',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: 0,
    investmentDelta: -10,
    cycleDelta: -8,
    evidenceFactor: 'credit_shock',
    evidenceContribution: -0.1,
    sourceSystem: 'crisis',
    sourceId: 'credit',
    description: 'Tighter lending conditions freeze gross investment.'
  },
  commodity_bust: {
    id: 'commodity_bust',
    label: 'Commodity price bust',
    kind: 'supply',
    typicalPhases: ['contraction', 'trough'],
    productivityDelta: -3,
    investmentDelta: -8,
    cycleDelta: -10,
    evidenceFactor: 'commodity_bust',
    evidenceContribution: -0.08,
    sourceSystem: 'external',
    sourceId: 'commodity_cycle',
    biasedRegionIds: ['WA', 'QLD', 'NT'],
    description: 'Resource export terms weaken; mining-intensive regions lose share momentum.'
  },
  terms_of_trade_squeeze: {
    id: 'terms_of_trade_squeeze',
    label: 'Terms-of-trade squeeze',
    kind: 'external',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: -2,
    investmentDelta: -5,
    cycleDelta: -6,
    evidenceFactor: 'tot_squeeze',
    evidenceContribution: -0.05,
    sourceSystem: 'external',
    sourceId: 'trade',
    description: 'Import price shock without matching export uplift.'
  },
  housing_correction: {
    id: 'housing_correction',
    label: 'Housing correction',
    kind: 'financial',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: -1,
    investmentDelta: -7,
    cycleDelta: -5,
    evidenceFactor: 'housing_correction',
    evidenceContribution: -0.06,
    sourceSystem: 'financial',
    sourceId: 'housing',
    biasedRegionIds: ['NSW', 'VIC'],
    description: 'Construction and household wealth channels weaken domestic demand.'
  },
  global_slowdown: {
    id: 'global_slowdown',
    label: 'Global growth slowdown',
    kind: 'external',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: -2,
    investmentDelta: -4,
    cycleDelta: -7,
    evidenceFactor: 'global_slowdown',
    evidenceContribution: -0.07,
    sourceSystem: 'external',
    sourceId: 'global',
    description: 'External demand softens export-oriented production.'
  },
  stimulus_bounce: {
    id: 'stimulus_bounce',
    label: 'Infrastructure stimulus bounce',
    kind: 'policy',
    typicalPhases: ['trough', 'recovery', 'expansion'],
    productivityDelta: 1,
    investmentDelta: 6,
    cycleDelta: 5,
    evidenceFactor: 'stimulus_bounce',
    evidenceContribution: 0.05,
    sourceSystem: 'policy',
    sourceId: 'stimulus',
    description: 'Public capital injection lifts investment climate without mutating player cash.'
  },
  mining_supercycle: {
    id: 'mining_supercycle',
    label: 'Mining investment supercycle',
    kind: 'supply',
    typicalPhases: ['expansion', 'peak'],
    productivityDelta: 2,
    investmentDelta: 8,
    cycleDelta: 6,
    evidenceFactor: 'mining_supercycle',
    evidenceContribution: 0.07,
    sourceSystem: 'industries',
    sourceId: 'mining',
    biasedRegionIds: ['WA', 'QLD'],
    description: 'Resource capex wave concentrates in western and northern regions.'
  },
  drought_ag_cycle: {
    id: 'drought_ag_cycle',
    label: 'Agricultural drought cycle',
    kind: 'supply',
    typicalPhases: ['contraction', 'slowdown'],
    productivityDelta: -5,
    investmentDelta: -2,
    cycleDelta: -4,
    evidenceFactor: 'drought_cycle',
    evidenceContribution: -0.04,
    sourceSystem: 'climate',
    sourceId: 'drought',
    biasedRegionIds: ['SA', 'NSW', 'QLD'],
    description: 'Rainfall deficit hits farm productivity and regional weights.'
  }
};

export const CYCLICAL_MACRO_SHOCK_IDS = Object.keys(CYCLICAL_MACRO_SHOCK_CATALOG);

export function resolveActiveCyclicalShockIds(inputs: {
  highInflationScenarioActive?: boolean;
  creditShockActive?: boolean;
  activeCyclicalShockIds?: string[];
}): string[] {
  const ids = new Set<string>(inputs.activeCyclicalShockIds ?? []);
  if (inputs.highInflationScenarioActive) ids.add('high_inflation');
  if (inputs.creditShockActive) ids.add('credit_contraction');
  return [...ids].filter(id => CYCLICAL_MACRO_SHOCK_CATALOG[id]).sort();
}

export function applyCyclicalShockLibrary(
  activeIds: string[],
  base: MacroScoreBundle,
  pushEv: MacroEvidenceSink
): MacroScoreBundle {
  const stacked = composeStackedShockDeltas(activeIds, CYCLICAL_MACRO_SHOCK_CATALOG);
  for (const id of activeIds) {
    const shock = CYCLICAL_MACRO_SHOCK_CATALOG[id];
    if (!shock) continue;
    pushEv(
      shock.evidenceFactor,
      shock.evidenceContribution,
      shock.sourceSystem,
      shock.sourceId,
      shock.biasedRegionIds
    );
  }
  return {
    productivityScore: base.productivityScore + stacked.productivityDelta,
    investmentScore: base.investmentScore + stacked.investmentDelta,
    cycleScore: base.cycleScore + stacked.cycleDelta
  };
}

export function cyclicalShockRegionalWeightMultiplier(
  activeIds: string[],
  regionId: string
): number {
  let mult = 1;
  for (const id of activeIds) {
    const shock = CYCLICAL_MACRO_SHOCK_CATALOG[id];
    if (!shock?.biasedRegionIds?.includes(regionId)) continue;
    if (shock.cycleDelta < 0) mult *= 0.96;
    if (shock.cycleDelta > 0) mult *= 1.04;
  }
  return mult;
}
