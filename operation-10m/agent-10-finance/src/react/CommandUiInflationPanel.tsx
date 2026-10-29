import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessCommandCenterInflationFusionEscalation,
  commandCenterInflationFusionEscalationScoreAdjustment,
} from '../inflation/command-center-inflation-fusion-escalation.js';
import {
  assessUiPlayerInflationSalienceNudge,
  uiPlayerInflationSalienceNudgeScoreAdjustment,
} from '../inflation/ui-player-inflation-salience-nudge.js';
import type { Agent17CommandSnapshot } from '../integration/agent17-command-bridge.js';
import type { Agent22UiSnapshot } from '../integration/agent22-ui-bridge.js';

export interface CommandUiInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent22?: Agent22UiSnapshot | null;
}

export function CommandUiInflationPanel(props: CommandUiInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: props.inputs.creditShockActive ? 0.78 : 0.55,
    coordinatedTighteningSuggested: props.inputs.fiscalPressure === 'critical',
    macroInflationFusionLatch: props.inputs.householdInflationScenarioActive,
    commandAlertCascadeBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const ui = props.agent22 ?? {
    turn: props.inputs.turn,
    inflationDashboardStressHighlight: props.inputs.highInflationScenario,
    playerAttentionOnCostOfLiving: props.inputs.publicStability < 45 ? ('high' as const) : ('medium' as const),
    uiNudgeInflationExpectationsUp: props.inputs.householdInflationScenarioActive,
    playerInflationSalienceLatch: props.inputs.creditShockActive,
    uiExpectationsNudgeBand: props.inputs.fiscalPressure === 'critical' ? ('sharp' as const) : ('building' as const),
  };

  const fusion = assessCommandCenterInflationFusionEscalation({
    macroAlertLevel: command.macroAlertLevel,
    inflationFusionScore: command.inflationFusionScore,
    coordinatedTighteningSuggested: command.coordinatedTighteningSuggested,
    macroInflationFusionLatch: command.macroInflationFusionLatch === true,
    commandAlertCascadeBand: command.commandAlertCascadeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const nudge = assessUiPlayerInflationSalienceNudge({
    inflationDashboardStressHighlight: ui.inflationDashboardStressHighlight,
    playerAttentionOnCostOfLiving: ui.playerAttentionOnCostOfLiving,
    uiNudgeInflationExpectationsUp: ui.uiNudgeInflationExpectationsUp,
    playerInflationSalienceLatch: ui.playerInflationSalienceLatch === true,
    uiExpectationsNudgeBand: ui.uiExpectationsNudgeBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-command-ui-inflation" data-testid="command-ui-inflation-panel">
      <h4>Command fusion & UI salience (round 29)</h4>
      <p>
        Fusion {fusion.escalationBand} · index {fusion.fusionIndex.toFixed(0)} · score adj{' '}
        {commandCenterInflationFusionEscalationScoreAdjustment(fusion.escalationBand)}
      </p>
      <p>
        UI nudge {nudge.nudgeBand} · index {nudge.salienceIndex.toFixed(0)} · score adj{' '}
        {uiPlayerInflationSalienceNudgeScoreAdjustment(nudge.nudgeBand)}
      </p>
      <p data-testid="command-ui-note">{fusion.narrative}</p>
      <p>{nudge.narrative}</p>
    </div>
  );
}
