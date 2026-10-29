import type { NationalMacroFinancialState } from '../definitions/types.js';
import {
  stepInflationRegimeTracker,
  createInitialInflationRegimeTracker,
  inflationRegimePersistenceHalfLifeTurns,
} from '../integration/inflation-regime-tracker.js';
import { classifyInflationShockDrivers } from '../inflation/supply-demand-shock.js';
import { assessFiscalDominance } from '../fiscal/fiscal-dominance.js';
import { assessInflationTargetBreach } from '../rates/inflation-target-breach.js';
import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import type { Agent06MacroSnapshot } from '../integration/agent06-macro-bridge.js';

export interface InflationRegimePanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  inflationScore: number;
  agent06?: Agent06MacroSnapshot | null;
}

export function InflationRegimePanel(props: InflationRegimePanelProps) {
  const tracker = stepInflationRegimeTracker(createInitialInflationRegimeTracker(), props.inputs.turn, props.state.inflation, {
    creditStressed: props.state.credit === 'restricted' || props.state.credit === 'frozen',
    fiscalCritical: props.inputs.fiscalPressure === 'critical',
  });
  const snap = tracker.history[tracker.history.length - 1];
  const shock = classifyInflationShockDrivers(props.state.inflation, props.inputs, props.agent06 ?? null);
  const fiscal = assessFiscalDominance(props.inputs);
  const target = assessInflationTargetBreach(props.inflationScore);
  const halfLife = inflationRegimePersistenceHalfLifeTurns(tracker.persistenceScore);

  return (
    <div className="op10m-inflation-regime" data-testid="inflation-regime-panel">
      <h4>Inflation regime (round 5)</h4>
      <p>
        Regime {snap?.regime ?? 'anchored_soft'} · persistence {tracker.persistenceScore.toFixed(0)} · half-life ~
        {halfLife.toFixed(1)} turns
      </p>
      <p>
        Driver {shock.driver} ({shock.confidence}) · fiscal dominance {fiscal.band} · target breach{' '}
        {target.breachSeverity}
      </p>
      <p>{shock.summary}</p>
    </div>
  );
}
