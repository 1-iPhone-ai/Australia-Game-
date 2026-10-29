import type { InflationForecastPath } from './inflation-forecast.js';
import type { InflationRegimeSnapshot } from './inflation-regime-tracker.js';
import type { InflationShockClassification } from '../inflation/supply-demand-shock.js';
import type { FiscalDominanceAssessment } from '../fiscal/fiscal-dominance.js';
import type { InflationTargetBreach } from '../rates/inflation-target-breach.js';
import { finRound } from '../compute/math.js';

/** Contract surface for Agent 21 forecasting fusion (read-only bundle). */
export interface Agent21InflationForecastBundle {
  schemaVersion: '10.14.agent10.r5';
  horizonTurns: number;
  terminalBand: InflationForecastPath['terminalBand'];
  maxCostMultiplier: number;
  meanAnchoringScore: number;
  regime: InflationRegimeSnapshot | null;
  shockDriver: InflationShockClassification['driver'];
  fiscalDominanceBand: FiscalDominanceAssessment['band'];
  targetBreachSeverity: InflationTargetBreach['breachSeverity'];
  integrationNote: string;
}

export function buildAgent21InflationForecastBundle(input: {
  path: InflationForecastPath;
  regime: InflationRegimeSnapshot | null;
  shock: InflationShockClassification;
  fiscalDominance: FiscalDominanceAssessment;
  targetBreach: InflationTargetBreach;
}): Agent21InflationForecastBundle {
  const meanAnchoring =
    input.path.points.length === 0
      ? 0
      : finRound(
          input.path.points.reduce((s, p) => s + p.anchoringScore, 0) / input.path.points.length,
          1,
        );

  return {
    schemaVersion: '10.14.agent10.r5',
    horizonTurns: input.path.points.length,
    terminalBand: input.path.terminalBand,
    maxCostMultiplier: input.path.maxCostMultiplier,
    meanAnchoringScore: meanAnchoring,
    regime: input.regime,
    shockDriver: input.shock.driver,
    fiscalDominanceBand: input.fiscalDominance.band,
    targetBreachSeverity: input.targetBreach.breachSeverity,
    integrationNote: 'Agent 10 macro CPI bundle — commodity resourcePrices excluded.',
  };
}

export function agent21ForecastBridgeIntegrationNote(): string {
  return 'Agent 21 may consume Agent21InflationForecastBundle for inflation fusion; no RNG.';
}
