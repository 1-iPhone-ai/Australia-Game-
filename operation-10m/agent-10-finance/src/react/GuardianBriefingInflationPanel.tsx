import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessGuardianGuardrailInflationEscalation,
  guardianGuardrailInflationEscalationScoreAdjustment,
} from '../inflation/guardian-guardrail-inflation-escalation.js';
import {
  assessTeamConsensusInflationBriefingDrift,
  teamConsensusInflationBriefingDriftScoreAdjustment,
} from '../inflation/team-consensus-inflation-briefing-drift.js';
import type { Agent16GuardianSnapshot } from '../integration/agent16-guardian-bridge.js';
import type { Agent18TeamSnapshot } from '../integration/agent18-team-bridge.js';

export interface GuardianBriefingInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function GuardianBriefingInflationPanel(props: GuardianBriefingInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.publicStability < 42 ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.creditShockActive ? ('high' as const) : ('medium' as const),
    guardrailInflationLatch: props.inputs.householdInflationScenarioActive,
    copilotEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('upside_risk' as const) : ('reacceleration' as const),
    briefingUrgencyBand: props.inputs.publicStability < 40 ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: props.inputs.actorCreditStressIndex ?? 0.55,
    teamBriefingInflationLatch: props.inputs.creditShockActive,
    consensusDriftBand: props.inputs.fiscalPressure === 'critical' ? ('unmoored' as const) : ('drifting' as const),
  };

  const escalation = assessGuardianGuardrailInflationEscalation({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    narrativeShockSeverity: guardian.narrativeShockSeverity,
    guardrailInflationLatch: guardian.guardrailInflationLatch === true,
    copilotEscalationBand: guardian.copilotEscalationBand ?? 'calm',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const drift = assessTeamConsensusInflationBriefingDrift({
    consensusInflationOutlook: team.consensusInflationOutlook,
    briefingUrgencyBand: team.briefingUrgencyBand,
    crossDomainStressScore: team.crossDomainStressScore,
    teamBriefingInflationLatch: team.teamBriefingInflationLatch === true,
    consensusDriftBand: team.consensusDriftBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-guardian-briefing-inflation" data-testid="guardian-briefing-inflation-panel">
      <h4>Guardrail escalation & briefing drift (round 33)</h4>
      <p>
        Guardian {escalation.escalationBand} · index {escalation.guardrailIndex.toFixed(0)} · score adj{' '}
        {guardianGuardrailInflationEscalationScoreAdjustment(escalation.escalationBand)}
      </p>
      <p>
        Team {drift.driftBand} · index {drift.briefingIndex.toFixed(0)} · score adj{' '}
        {teamConsensusInflationBriefingDriftScoreAdjustment(drift.driftBand)}
      </p>
      <p data-testid="guardian-briefing-note">{escalation.narrative}</p>
      <p>{drift.narrative}</p>
    </div>
  );
}
