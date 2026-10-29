import type { MacroEconomyEvidence, MacroEconomyInputs } from './types.ts';

export type MacroScoreBundle = {
  productivityScore: number;
  investmentScore: number;
  cycleScore: number;
};

export type MacroEvidenceSink = (
  factor: string,
  contribution: number,
  sourceSystem: string,
  sourceId: string,
  regionIds?: string[]
) => void;

/** Apply innovation, workforce, household demand, inflation, and credit shocks to macro scores. */
export function applyMacroStructuralAdjustments(
  inputs: MacroEconomyInputs,
  base: MacroScoreBundle,
  pushEv: MacroEvidenceSink
): MacroScoreBundle {
  let { productivityScore, investmentScore, cycleScore } = base;

  if (inputs.innovation?.nationalProductivityBonus) productivityScore += 2;
  if (inputs.workforce?.nationalReadinessBand === 'strong') productivityScore += 3;

  const hhDemand = inputs.households?.domesticDemand?.level ?? inputs.households?.domesticDemand?.band;
  if (hhDemand === 'strong' || hhDemand === 'very_strong' || hhDemand === 'surging') cycleScore += 4;
  if (hhDemand === 'contracting' || hhDemand === 'soft') cycleScore -= 4;

  return { productivityScore, investmentScore, cycleScore };
}

export function applyMacroShockAdjustments(
  inputs: MacroEconomyInputs,
  base: MacroScoreBundle,
  pushEv: MacroEvidenceSink
): MacroScoreBundle {
  let { productivityScore, investmentScore, cycleScore } = base;

  if (inputs.highInflationScenarioActive) {
    productivityScore -= 4;
    investmentScore -= 6;
    cycleScore -= 5;
    pushEv('inflation_scenario', -0.04, 'scenario', 'high_inflation');
  }
  if (inputs.creditShockActive) {
    investmentScore -= 10;
    cycleScore -= 8;
    pushEv('credit_shock', -0.1, 'crisis', 'credit');
  }

  return { productivityScore, investmentScore, cycleScore };
}

export function createMacroEvidencePush(
  evidence: MacroEconomyEvidence[],
  turn: number
): MacroEvidenceSink {
  return (factor, contribution, sourceSystem, sourceId, regionIds = []) => {
    evidence.push({
      id: `me:${sourceSystem}:${sourceId}:${factor}`,
      sourceSystem,
      sourceId,
      factor,
      contribution,
      regionIds,
      turn,
      visibility: 'public'
    });
  };
}
