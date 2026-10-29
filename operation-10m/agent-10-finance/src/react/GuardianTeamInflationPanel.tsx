import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessGuardianInflationInterventionInflation,
  guardianInflationInterventionScoreAdjustment,
} from '../inflation/guardian-inflation-intervention-inflation.js';
import {
  assessTeamIntelligenceConsensusInflation,
  teamIntelligenceConsensusInflationScoreAdjustment,
} from '../inflation/team-intelligence-consensus-inflation.js';
import type { Agent16GuardianSnapshot } from '../integration/agent16-guardian-bridge.js';
import type { Agent18TeamSnapshot } from '../integration/agent18-team-bridge.js';

export interface GuardianTeamInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function GuardianTeamInflationPanel(props: GuardianTeamInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand:
      props.inputs.publicStability < 40 ? ('urgent' as const) : props.inputs.fiscalPressure === 'critical' ? ('advisory' as const) : ('none' as const),
    narrativeShockSeverity: props.inputs.publicStability < 45 ? ('high' as const) : ('medium' as const),
    copilotInflationEscalationActive: props.inputs.householdInflationScenarioActive,
    guardrailNarrativeCascadeBand: props.inputs.creditShockActive ? ('urgent' as const) : ('building' as const),
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('upside_risk' as const) : ('reacceleration' as const),
    briefingUrgencyBand: props.inputs.publicStability < 42 ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: props.inputs.actorCreditStressIndex,
    teamForecastDeanchoringFlag: props.inputs.householdInflationScenarioActive && props.inputs.highInflationScenario,
    briefingInflationSalienceBand: props.inputs.publicStability < 38 ? ('critical' as const) : ('elevated' as const),
  };

  const intervention = assessGuardianInflationInterventionInflation({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    narrativeShockSeverity: guardian.narrativeShockSeverity,
    copilotInflationEscalationActive: guardian.copilotInflationEscalationActive === true,
    guardrailNarrativeCascadeBand: guardian.guardrailNarrativeCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const consensus = assessTeamIntelligenceConsensusInflation({
    consensusInflationOutlook: team.consensusInflationOutlook,
    briefingUrgencyBand: team.briefingUrgencyBand,
    crossDomainStressScore: team.crossDomainStressScore,
    teamForecastDeanchoringFlag: team.teamForecastDeanchoringFlag === true,
    briefingInflationSalienceBand: team.briefingInflationSalienceBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-guardian-team-inflation" data-testid="guardian-team-inflation-panel">
      <h4>Guardian intervention & team consensus (round 23)</h4>
      <p>
        Guardian {intervention.interventionBand} · index {intervention.guardrailIndex.toFixed(0)} · score adj{' '}
        {guardianInflationInterventionScoreAdjustment(intervention.interventionBand)}
      </p>
      <p>
        Team {consensus.consensusBand} · index {consensus.briefingIndex.toFixed(0)} · score adj{' '}
        {teamIntelligenceConsensusInflationScoreAdjustment(consensus.consensusBand)}
      </p>
      <p data-testid="guardian-team-note">{intervention.narrative}</p>
      <p>{consensus.narrative}</p>
    </div>
  );
}
