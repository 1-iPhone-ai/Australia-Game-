import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessEventsNarrativeInflationPersistence,
  eventsNarrativeInflationPersistenceScoreAdjustment,
} from '../inflation/events-narrative-inflation-persistence.js';
import {
  assessMacroDemandOverheatInflationSlippage,
  macroDemandOverheatInflationSlippageScoreAdjustment,
} from '../inflation/macro-demand-overheat-inflation-slippage.js';
import type { Agent05EventsSnapshot } from '../integration/agent05-events-bridge.js';
import type { Agent06MacroSnapshot } from '../integration/agent06-macro-bridge.js';

export interface EventsMacroInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent05?: Agent05EventsSnapshot | null;
  agent06?: Agent06MacroSnapshot | null;
}

export function EventsMacroInflationPanel(props: EventsMacroInflationPanelProps) {
  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.creditShockActive,
    supplyDisruptionSeverity: props.inputs.highInflationScenario ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('uneasy' as const),
    dynamicEventInflationLatch: props.inputs.householdInflationScenarioActive,
    supplyShockPersistenceBand: props.inputs.fiscalPressure === 'critical' ? ('entrenched' as const) : ('building' as const),
  };

  const macro = props.agent06 ?? {
    turn: props.inputs.turn,
    gdpGrowthBand: props.inputs.highInflationScenario ? ('strong' as const) : ('steady' as const),
    unemploymentBand: 'moderate' as const,
    outputGap: props.inputs.highInflationScenario ? 0.42 : 0.12,
    nominalDemandPressure: props.inputs.creditShockActive ? 0.68 : 0.35,
    transmissionStabilityFragile: props.inputs.creditShockActive,
    macroRecoveryRankStressActive: false,
    macroDemandOverheatLatch: props.inputs.highInflationScenario,
    transmissionSlippageBand: props.inputs.fiscalPressure === 'critical' ? ('dislocated' as const) : ('slipping' as const),
  };

  const persistence = assessEventsNarrativeInflationPersistence({
    inflationShockEventActive: events.inflationShockEventActive,
    supplyDisruptionSeverity: events.supplyDisruptionSeverity,
    confidenceShockBand: events.confidenceShockBand,
    dynamicEventInflationLatch: events.dynamicEventInflationLatch === true,
    supplyShockPersistenceBand: events.supplyShockPersistenceBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const slippage = assessMacroDemandOverheatInflationSlippage({
    gdpGrowthBand: macro.gdpGrowthBand,
    nominalDemandPressure: macro.nominalDemandPressure,
    outputGap: macro.outputGap,
    macroDemandOverheatLatch: macro.macroDemandOverheatLatch === true,
    transmissionSlippageBand: macro.transmissionSlippageBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-events-macro-inflation" data-testid="events-macro-inflation-panel">
      <h4>Events persistence & macro slippage (round 27)</h4>
      <p>
        Events {persistence.persistenceBand} · index {persistence.eventsIndex.toFixed(0)} · score adj{' '}
        {eventsNarrativeInflationPersistenceScoreAdjustment(persistence.persistenceBand)}
      </p>
      <p>
        Macro {slippage.slippageBand} · index {slippage.macroIndex.toFixed(0)} · score adj{' '}
        {macroDemandOverheatInflationSlippageScoreAdjustment(slippage.slippageBand)}
      </p>
      <p data-testid="events-macro-note">{persistence.narrative}</p>
      <p>{slippage.narrative}</p>
    </div>
  );
}
