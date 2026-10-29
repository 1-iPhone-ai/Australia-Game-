import type { NationalMacroFinancialState } from '../definitions/types.js';
import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import {
  createInitialInflationMomentumState,
  stepInflationMomentum,
} from '../inflation/inflation-momentum.js';
import { estimateDisinflationSacrifice } from '../inflation/disinflation-sacrifice.js';
import { assessRealRateGap } from '../rates/real-rate-gap.js';
import { assessCreditInflationFeedback } from '../credit/credit-inflation-feedback.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';
import type { Agent09HouseholdSnapshot } from '../integration/agent09-household-bridge.js';

export interface InflationMomentumPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  inflationScore: number;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function InflationMomentumPanel(props: InflationMomentumPanelProps) {
  const { snapshot } = stepInflationMomentum(
    createInitialInflationMomentumState(),
    props.inputs.turn,
    props.state.inflation,
  );
  const sacrifice = estimateDisinflationSacrifice(props.state.inflation, props.inflationScore, snapshot);
  const realGap = assessRealRateGap(props.inflationScore, props.state.stance, props.state.inflation);
  const feedback = assessCreditInflationFeedback(
    props.state.inflation,
    props.state.credit,
    props.inputs.creditShockActive,
  );

  return (
    <div className="op10m-inflation-momentum" data-testid="inflation-momentum-panel">
      <h4>Inflation momentum (round 6)</h4>
      <p>
        Momentum {snapshot.momentumScore.toFixed(0)} · {snapshot.direction} · real rate gap {realGap.gapBand}
      </p>
      <p>
        Credit–inflation {feedback.feedbackLoop} · sacrifice ratio {sacrifice.sacrificeRatio.toFixed(2)} (
        {sacrifice.outputCostBand})
      </p>
      <p>{realGap.narrative}</p>
      {(props.agent07 || props.agent09) && (
        <p data-testid="inflation-momentum-bridges">
          Bridges: {props.agent07 ? 'Agent07 fiscal' : ''}
          {props.agent07 && props.agent09 ? ' · ' : ''}
          {props.agent09 ? 'Agent09 household' : ''}
        </p>
      )}
    </div>
  );
}
