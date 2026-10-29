import type { InflationConditionsBand } from '../definitions/types.js';
import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { assessPhillipsSlack } from './phillips-slack.js';
import { assessWagePriceSpiral } from './wage-price-spiral.js';
import { finRound } from '../compute/math.js';
import type { Agent06MacroSnapshot } from '../integration/agent06-macro-bridge.js';

export type InflationShockDriver = 'demand_pull' | 'cost_push' | 'mixed' | 'disinflationary';

export interface InflationShockClassification {
  driver: InflationShockDriver;
  demandScore: number;
  supplyScore: number;
  confidence: 'low' | 'medium' | 'high';
  summary: string;
}

export function classifyInflationShockDrivers(
  inflationBand: InflationConditionsBand,
  inputs: MacroFinancialSystemInputs,
  agent06: Agent06MacroSnapshot | null | undefined,
): InflationShockClassification {
  const phillips = assessPhillipsSlack(inflationBand, agent06);
  const spiral = assessWagePriceSpiral({
    inflationBand,
    householdAffordability: inputs.householdAffordability,
    fiscalPressure: inputs.fiscalPressure,
    wageGrowthPressureScore: 45 + (inputs.inflationSettingMultiplier ?? 1) * 12,
    turn: inputs.turn,
  });

  let demandScore = 0;
  let supplyScore = 0;

  if (phillips.slackBand === 'overheated') demandScore += 0.35;
  if ((inputs.inflationSettingMultiplier ?? 1) > 1.15) demandScore += 0.22;
  if (inputs.highInflationScenario) demandScore += 0.12;

  if (spiral.spiralRisk === 'critical' || spiral.spiralRisk === 'elevated') supplyScore += 0.28;
  if (inputs.householdAffordability === 'severe_pressure') supplyScore += 0.18;
  if (inputs.fiscalPressure === 'critical') supplyScore += 0.1;

  if (phillips.slackBand === 'deep_slack') {
    demandScore -= 0.2;
    supplyScore -= 0.05;
  }

  demandScore = finRound(Math.max(0, demandScore), 3);
  supplyScore = finRound(Math.max(0, supplyScore), 3);

  const margin = Math.abs(demandScore - supplyScore);
  const confidence: InflationShockClassification['confidence'] =
    margin >= 0.2 ? 'high' : margin >= 0.08 ? 'medium' : 'low';

  let driver: InflationShockDriver = 'mixed';
  if (demandScore < 0.08 && supplyScore < 0.08 && phillips.slackBand === 'deep_slack') {
    driver = 'disinflationary';
  } else if (demandScore > supplyScore + 0.08) {
    driver = 'demand_pull';
  } else if (supplyScore > demandScore + 0.08) {
    driver = 'cost_push';
  }

  const summary =
    driver === 'demand_pull'
      ? 'Inflation looks demand-led (slack/overheat channel).'
      : driver === 'cost_push'
        ? 'Inflation looks cost-push (services/wage/fiscal spillover).'
        : driver === 'disinflationary'
          ? 'Slack dominates — disinflationary bias in macro CPI scoring.'
          : 'Mixed demand and supply contributions — monitor both channels.';

  return { driver, demandScore, supplyScore, confidence, summary };
}
