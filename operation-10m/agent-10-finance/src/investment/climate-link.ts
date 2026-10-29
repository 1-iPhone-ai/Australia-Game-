import type { CreditConditionsBand, InflationConditionsBand } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

export type InvestmentClimateBand =
  | 'crisis_defensive'
  | 'cautious'
  | 'selective'
  | 'expansionary'
  | 'transformative';

export interface InvestmentClimateLinkAssessment {
  climate: InvestmentClimateBand;
  credit: CreditConditionsBand;
  inflation: InflationConditionsBand;
  readinessScore: number;
  deferMegaproject: boolean;
  rationale: string;
}

const CLIMATE_BASE: Record<InvestmentClimateBand, number> = {
  crisis_defensive: 25,
  cautious: 40,
  selective: 55,
  expansionary: 72,
  transformative: 85,
};

export function assessInvestmentClimateLink(
  climate: InvestmentClimateBand,
  credit: CreditConditionsBand,
  inflation: InflationConditionsBand,
): InvestmentClimateLinkAssessment {
  let score = CLIMATE_BASE[climate];
  if (credit === 'accommodative') score += 8;
  if (credit === 'tight' || credit === 'restricted') score -= 10;
  if (credit === 'frozen') score -= 18;
  if (inflation === 'high' || inflation === 'scenario_runaway') score -= 12;
  if (inflation === 'disinflation') score += 4;
  score = finClamp(score, 0, 100);
  const deferMegaproject =
    score < 45 || credit === 'frozen' || inflation === 'scenario_runaway' || climate === 'crisis_defensive';
  let rationale = 'Investment climate aligns with macro credit and inflation bands.';
  if (deferMegaproject) rationale = 'Defer discretionary megaproject capex until stability and credit normalize.';
  else if (score >= 70) rationale = 'Expansionary window — megaproject readiness elevated (metadata only).';
  return { climate, credit, inflation, readinessScore: score, deferMegaproject, rationale };
}
