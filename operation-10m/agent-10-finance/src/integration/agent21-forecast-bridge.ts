import type { InflationForecastPath } from './inflation-forecast.js';
import type { InflationRegimeSnapshot } from './inflation-regime-tracker.js';
import type { InflationShockClassification } from '../inflation/supply-demand-shock.js';
import type { FiscalDominanceAssessment } from '../fiscal/fiscal-dominance.js';
import type { InflationTargetBreach } from '../rates/inflation-target-breach.js';
import type { InflationMomentumSnapshot } from '../inflation/inflation-momentum.js';
import type { RealRateGapAssessment } from '../rates/real-rate-gap.js';
import type { CreditInflationFeedbackAssessment } from '../credit/credit-inflation-feedback.js';
import { finRound } from '../compute/math.js';

/** Contract surface for Agent 21 forecasting fusion (read-only bundle). */
export interface Agent21InflationForecastBundle {
  schemaVersion: '10.14.agent10.r6';
  horizonTurns: number;
  terminalBand: InflationForecastPath['terminalBand'];
  maxCostMultiplier: number;
  meanAnchoringScore: number;
  terminalMomentumDirection: InflationMomentumSnapshot['direction'];
  realRateGapBand: RealRateGapAssessment['gapBand'];
  creditInflationFeedback: CreditInflationFeedbackAssessment['feedbackLoop'];
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
  momentum?: InflationMomentumSnapshot | null;
  realRateGap?: RealRateGapAssessment | null;
  creditFeedback?: CreditInflationFeedbackAssessment | null;
}): Agent21InflationForecastBundle {
  const meanAnchoring =
    input.path.points.length === 0
      ? 0
      : finRound(
          input.path.points.reduce((s, p) => s + p.anchoringScore, 0) / input.path.points.length,
          1,
        );

  const lastPoint = input.path.points[input.path.points.length - 1];

  return {
    schemaVersion: '10.14.agent10.r6',
    horizonTurns: input.path.points.length,
    terminalBand: input.path.terminalBand,
    maxCostMultiplier: input.path.maxCostMultiplier,
    meanAnchoringScore: meanAnchoring,
    terminalMomentumDirection: input.momentum?.direction ?? lastPoint?.momentumDirection ?? 'stable',
    realRateGapBand: input.realRateGap?.gapBand ?? 'neutral',
    creditInflationFeedback: input.creditFeedback?.feedbackLoop ?? 'neutral',
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
