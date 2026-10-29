import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessEventsNarrativeInflationShockLatch,
  eventsNarrativeInflationShockLatchScoreAdjustment,
} from '../inflation/events-narrative-inflation-shock-latch.js';
import {
  assessModesSandboxInflationPressureSurge,
  modesSandboxInflationPressureSurgeScoreAdjustment,
} from '../inflation/modes-sandbox-inflation-pressure-surge.js';
import type { Agent05EventsSnapshot } from '../integration/agent05-events-bridge.js';
import type { Agent04ModesSnapshot } from '../integration/agent04-modes-bridge.js';

export interface EventsModesWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent04?: Agent04ModesSnapshot | null;
}

export function EventsModesWaveInflationPanel(props: EventsModesWaveInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.fiscalPressure === 'critical' ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.creditShockActive ? ('severe' as const) : ('uneasy' as const),
    wave45EventShockLatch: props.inputs.householdInflationScenarioActive,
    narrativeShockEntrenchBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('entrenched' as const) : ('building' as const),
  };

  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('extreme' as const) : ('inflationary' as const),
    sandboxStressModeActive: props.inputs.householdInflationScenarioActive,
    difficultyCostMultiplier: props.inputs.inflationSettingMultiplier ?? 1.1,
    wave45SandboxPressureLatch: props.inputs.creditShockActive,
    scenarioStressSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('surge' as const) : ('stressed' as const),
  };

  const shock = assessEventsNarrativeInflationShockLatch({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    wave45EventShockLatch: events.wave45EventShockLatch === true,
    narrativeShockEntrenchBand: events.narrativeShockEntrenchBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const pressure = assessModesSandboxInflationPressureSurge({
    scenarioInflationBias: modes.scenarioInflationBias,
    sandboxStressModeActive: modes.sandboxStressModeActive,
    wave45SandboxPressureLatch: modes.wave45SandboxPressureLatch === true,
    scenarioStressSurgeBand: modes.scenarioStressSurgeBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-modes-wave-inflation" data-testid="events-modes-wave-inflation-panel">
      <h4>Events shock latch & modes pressure surge (round 45)</h4>
      <p>
        Events {shock.latchBand} · index {shock.shockIndex.toFixed(0)} · score adj{' '}
        {eventsNarrativeInflationShockLatchScoreAdjustment(shock.latchBand)}
      </p>
      <p>
        Modes {pressure.surgeBand} · index {pressure.pressureIndex.toFixed(0)} · score adj{' '}
        {modesSandboxInflationPressureSurgeScoreAdjustment(pressure.surgeBand)}
      </p>
      <p data-testid="events-modes-wave-note">{shock.narrative}</p>
      <p>{pressure.narrative}</p>
    </div>
  );
}
