import type { NationalMacroFinancialState } from '../definitions/types.js';
import { decomposeMacroCpiBasket } from '../inflation/cpi-basket.js';
import { assessWagePriceSpiral } from '../inflation/wage-price-spiral.js';
import { recommendMonetaryStance } from '../rates/monetary-reaction.js';
import { stepInflationExpectations, initialInflationAnchoringScore } from '../inflation/expectations-anchor.js';

export interface InflationDiagnosticsPanelProps {
  state: NationalMacroFinancialState;
  inflationScore: number;
  creditScore: number;
  turn: number;
  householdAffordability?: 'healthy' | 'strained' | 'severe_pressure' | null;
  fiscalPressure?: 'healthy' | 'tight' | 'strained' | 'critical' | null;
}

export function InflationDiagnosticsPanel(props: InflationDiagnosticsPanelProps) {
  const { state, inflationScore, creditScore, turn } = props;
  const cpi = decomposeMacroCpiBasket(state.inflation, turn, 0);
  const spiral = assessWagePriceSpiral({
    inflationBand: state.inflation,
    householdAffordability: props.householdAffordability,
    fiscalPressure: props.fiscalPressure,
    turn,
  });
  const stance = recommendMonetaryStance({
    inflationBand: state.inflation,
    creditBand: state.credit,
    inflationScore,
    creditScore,
  });
  const expectations = stepInflationExpectations({
    currentBand: state.inflation,
    priorAnchoringScore: initialInflationAnchoringScore(),
    fiscalPressure: props.fiscalPressure,
    turn,
  });

  return (
    <div className="op10m-inflation-diagnostics" data-testid="inflation-diagnostics-panel">
      <h4>Inflation diagnostics (macro CPI)</h4>
      <p>
        Headline index {cpi.headlineIndex.toFixed(1)} · services {Math.round(cpi.servicesShare * 100)}% · spiral{' '}
        {spiral.spiralRisk}
      </p>
      <p>
        Recommended stance {stance.recommendedStance} · anchoring {expectations.anchoringScore.toFixed(0)} (
        {expectations.deanchoringRisk})
      </p>
      <ul>
        {cpi.categories.slice(0, 4).map((c) => (
          <li key={c.categoryId}>
            {c.label}: {c.contribution.toFixed(2)} ({c.band})
          </li>
        ))}
      </ul>
    </div>
  );
}
