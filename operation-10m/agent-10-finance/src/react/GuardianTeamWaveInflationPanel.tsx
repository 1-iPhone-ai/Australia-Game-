import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessGuardianCopilotInflationPressureLatch,
  guardianCopilotInflationPressureLatchScoreAdjustment,
} from '../inflation/guardian-copilot-inflation-pressure-latch.js';
import {
  assessTeamBriefingConsensusInflationUnmooring,
  teamBriefingConsensusInflationUnmooringScoreAdjustment,
} from '../inflation/team-briefing-consensus-inflation-unmooring.js';
import type { Agent16GuardianSnapshot } from '../integration/agent16-guardian-bridge.js';
import type { Agent18TeamSnapshot } from '../integration/agent18-team-bridge.js';

export interface GuardianTeamWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent16?: Agent16GuardianSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function GuardianTeamWaveInflationPanel(props: GuardianTeamWaveInflationPanelProps) {
  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.fiscalPressure === 'critical' ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.publicStability < 40 ? ('high' as const) : ('medium' as const),
    wave41GuardianPressureLatch: props.inputs.householdInflationScenarioActive,
    copilotPressureEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('runaway' as const) : ('elevated' as const),
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('upside_risk' as const) : ('reacceleration' as const),
    briefingUrgencyBand: props.inputs.creditShockActive ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: 0.65,
    wave41TeamConsensusLatch: props.inputs.creditShockActive,
    briefingConsensusUnmoorBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('drifting' as const),
  };

  const pressure = assessGuardianCopilotInflationPressureLatch({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    wave41GuardianPressureLatch: guardian.wave41GuardianPressureLatch === true,
    copilotPressureEscalationBand: guardian.copilotPressureEscalationBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const unmooring = assessTeamBriefingConsensusInflationUnmooring({
    consensusInflationOutlook: team.consensusInflationOutlook,
    briefingUrgencyBand: team.briefingUrgencyBand,
    wave41TeamConsensusLatch: team.wave41TeamConsensusLatch === true,
    briefingConsensusUnmoorBand: team.briefingConsensusUnmoorBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-guardian-team-wave-inflation" data-testid="guardian-team-wave-inflation-panel">
      <h4>Guardian co-pilot latch & team consensus unmooring (round 41)</h4>
      <p>
        Guardian {pressure.latchBand} · index {pressure.pressureIndex.toFixed(0)} · score adj{' '}
        {guardianCopilotInflationPressureLatchScoreAdjustment(pressure.latchBand)}
      </p>
      <p>
        Team {unmooring.unmooringBand} · index {unmooring.consensusIndex.toFixed(0)} · score adj{' '}
        {teamBriefingConsensusInflationUnmooringScoreAdjustment(unmooring.unmooringBand)}
      </p>
      <p data-testid="guardian-team-wave-note">{pressure.narrative}</p>
      <p>{unmooring.narrative}</p>
    </div>
  );
}
