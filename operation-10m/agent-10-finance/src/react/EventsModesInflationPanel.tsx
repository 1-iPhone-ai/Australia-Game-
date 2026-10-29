import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessEventsStagedInflationShockPersistence,
  eventsStagedInflationShockPersistenceScoreAdjustment,
} from '../inflation/events-staged-inflation-shock-persistence.js';
import {
  assessModesSandboxInflationStressCascade,
  modesSandboxInflationStressCascadeScoreAdjustment,
} from '../inflation/modes-sandbox-inflation-stress-cascade.js';
import type { Agent05EventsSnapshot } from '../integration/agent05-events-bridge.js';
import type { Agent04ModesSnapshot } from '../integration/agent04-modes-bridge.js';

export interface EventsModesInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent04?: Agent04ModesSnapshot | null;
}

export function EventsModesInflationPanel(props: EventsModesInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.creditShockActive ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('uneasy' as const),
    wave37EventInflationLatch: props.inputs.creditShockActive,
    stagedShockPersistenceBand: props.inputs.fiscalPressure === 'critical' ? ('entrenched' as const) : ('building' as const),
  };

  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('extreme' as const) : ('inflationary' as const),
    sandboxStressModeActive: props.inputs.householdInflationScenarioActive,
    difficultyCostMultiplier: props.inputs.inflationSettingMultiplier ?? 1.1,
    wave37SandboxInflationLatch: props.inputs.householdInflationScenarioActive,
    scenarioBiasCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('runaway' as const) : ('stressed' as const),
  };

  const persistence = assessEventsStagedInflationShockPersistence({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    confidenceShockBand: events.confidenceShockBand,
    wave37EventInflationLatch: events.wave37EventInflationLatch === true,
    stagedShockPersistenceBand: events.stagedShockPersistenceBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessModesSandboxInflationStressCascade({
    scenarioInflationBias: modes.scenarioInflationBias,
    sandboxStressModeActive: modes.sandboxStressModeActive,
    difficultyCostMultiplier: modes.difficultyCostMultiplier,
    wave37SandboxInflationLatch: modes.wave37SandboxInflationLatch === true,
    scenarioBiasCascadeBand: modes.scenarioBiasCascadeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-modes-inflation" data-testid="events-modes-inflation-panel">
      <h4>Event shock persistence & sandbox stress (round 37)</h4>
      <p>
        Events {persistence.persistenceBand} · index {persistence.shockIndex.toFixed(0)} · score adj{' '}
        {eventsStagedInflationShockPersistenceScoreAdjustment(persistence.persistenceBand)}
      </p>
      <p>
        Modes {cascade.cascadeBand} · index {cascade.stressIndex.toFixed(0)} · score adj{' '}
        {modesSandboxInflationStressCascadeScoreAdjustment(cascade.cascadeBand)}
      </p>
      <p data-testid="events-modes-note">{persistence.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}
