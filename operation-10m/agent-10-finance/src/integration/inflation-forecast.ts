import type { InflationConditionsBand } from '../definitions/types.js';
import { makeDefaultMacroFinancialTestInputs, computeNationalMacroFinancialConditions } from '../compute/national-macro-financial.js';
import { stepInflationExpectations, initialInflationAnchoringScore } from '../inflation/expectations-anchor.js';
import { assessWagePriceSpiral } from '../inflation/wage-price-spiral.js';
import { decomposeMacroCpiBasket } from '../inflation/cpi-basket.js';
import { serviceCostPassThroughFromAffordability } from '../inflation/pass-through.js';
import { computeCoreHeadlineSpread } from '../inflation/core-headline-spread.js';
import {
  stepInflationRegimeTracker,
  createInitialInflationRegimeTracker,
  type InflationRegimeLabel,
} from './inflation-regime-tracker.js';

export interface InflationForecastPoint {
  turn: number;
  inflationBand: InflationConditionsBand;
  costMultiplier: number;
  anchoringScore: number;
  spiralRisk: ReturnType<typeof assessWagePriceSpiral>['spiralRisk'];
  headlineCpiIndex: number;
  coreCpiIndex: number;
  regime: InflationRegimeLabel;
}

export interface InflationForecastPath {
  points: InflationForecastPoint[];
  terminalBand: InflationConditionsBand;
  maxCostMultiplier: number;
}

/** Deterministic forward path for dashboards / Agent 21 hooks (no RNG). */
export function projectInflationForecastPath(
  horizonTurns: number,
  seedInputs?: ReturnType<typeof makeDefaultMacroFinancialTestInputs>,
): InflationForecastPath {
  const points: InflationForecastPoint[] = [];
  let anchoring = initialInflationAnchoringScore();
  let maxCost = 1;
  let regimeState = createInitialInflationRegimeTracker();

  for (let t = 1; t <= horizonTurns; t++) {
    const inputs = { ...(seedInputs ?? makeDefaultMacroFinancialTestInputs()), turn: t };
    const r = computeNationalMacroFinancialConditions(inputs, null, null);
    const pass = serviceCostPassThroughFromAffordability(inputs.householdAffordability);
    const spiral = assessWagePriceSpiral({
      inflationBand: r.state.inflation,
      householdAffordability: inputs.householdAffordability,
      fiscalPressure: inputs.fiscalPressure,
      wageGrowthPressureScore: 40 + t * 2,
      turn: t,
    });
    const exp = stepInflationExpectations({
      currentBand: r.state.inflation,
      priorAnchoringScore: anchoring,
      fiscalPressure: inputs.fiscalPressure,
      highInflationScenario: inputs.highInflationScenario,
      turn: t,
    });
    anchoring = exp.anchoringScore;
    const cpi = decomposeMacroCpiBasket(r.state.inflation, t, pass);
    const coreSpread = computeCoreHeadlineSpread(r.state.inflation, t, pass);
    regimeState = stepInflationRegimeTracker(regimeState, t, r.state.inflation, {
      creditStressed: r.state.credit === 'restricted' || r.state.credit === 'frozen',
      fiscalCritical: inputs.fiscalPressure === 'critical',
    });
    const regimeSnap = regimeState.history[regimeState.history.length - 1];
    maxCost = Math.max(maxCost, r.state.modifiers.costOfLivingMultiplier);
    points.push({
      turn: t,
      inflationBand: r.state.inflation,
      costMultiplier: r.state.modifiers.costOfLivingMultiplier,
      anchoringScore: anchoring,
      spiralRisk: spiral.spiralRisk,
      headlineCpiIndex: cpi.headlineIndex,
      coreCpiIndex: coreSpread.coreIndex,
      regime: regimeSnap?.regime ?? 'anchored_soft',
    });
  }

  return {
    points,
    terminalBand: points[points.length - 1]?.inflationBand ?? 'anchored',
    maxCostMultiplier: maxCost,
  };
}
