import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessCalendarSeasonInflationCarryover,
  calendarSeasonInflationCarryoverScoreAdjustment,
} from '../inflation/calendar-season-inflation-carryover.js';
import {
  assessAutomationAutopilotInflationDrift,
  automationAutopilotInflationDriftScoreAdjustment,
} from '../inflation/automation-autopilot-inflation-drift.js';
import type { Agent02TurnsSnapshot } from '../integration/agent02-turns-bridge.js';
import type { Agent20AutomationSnapshot } from '../integration/agent20-automation-bridge.js';

export interface TurnsAutomationInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent02?: Agent02TurnsSnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function TurnsAutomationInflationPanel(props: TurnsAutomationInflationPanelProps) {
  const turns = props.agent02 ?? {
    turn: props.inputs.turn,
    calendarSeasonBand: props.inputs.highInflationScenario ? ('peak_demand' as const) : ('normal' as const),
    policyReviewWindowOpen: props.inputs.fiscalPressure === 'critical',
    multiTurnInflationCarryover: props.inputs.householdInflationScenarioActive ? 0.32 : 0.12,
    fiscalCalendarInflationLatch: props.inputs.creditShockActive,
    multiTurnCarryoverBand: props.inputs.highInflationScenario ? ('persistent' as const) : ('building' as const),
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: props.inputs.publicStability < 45 ? 0.38 : 0.62,
    idleMacroInflationEscalation: props.inputs.householdInflationScenarioActive,
    autopilotDriftCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('runaway' as const) : ('drifting' as const),
  };

  const calendar = assessCalendarSeasonInflationCarryover({
    calendarSeasonBand: turns.calendarSeasonBand,
    policyReviewWindowOpen: turns.policyReviewWindowOpen,
    multiTurnInflationCarryover: turns.multiTurnInflationCarryover,
    fiscalCalendarInflationLatch: turns.fiscalCalendarInflationLatch === true,
    multiTurnCarryoverBand: turns.multiTurnCarryoverBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const drift = assessAutomationAutopilotInflationDrift({
    macroAutopilotInflationBias: automation.macroAutopilotInflationBias,
    unattendedShockDriftActive: automation.unattendedShockDriftActive,
    automationConfidenceScore: automation.automationConfidenceScore,
    idleMacroInflationEscalation: automation.idleMacroInflationEscalation === true,
    autopilotDriftCascadeBand: automation.autopilotDriftCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-turns-automation-inflation" data-testid="turns-automation-inflation-panel">
      <h4>Calendar carryover & automation drift (round 25)</h4>
      <p>
        Calendar {calendar.carryoverBand} · index {calendar.calendarIndex.toFixed(0)} · score adj{' '}
        {calendarSeasonInflationCarryoverScoreAdjustment(calendar.carryoverBand)}
      </p>
      <p>
        Autopilot {drift.driftBand} · index {drift.autopilotIndex.toFixed(0)} · score adj{' '}
        {automationAutopilotInflationDriftScoreAdjustment(drift.driftBand)}
      </p>
      <p data-testid="turns-automation-note">{calendar.narrative}</p>
      <p>{drift.narrative}</p>
    </div>
  );
}
