import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessEducationTuitionInflation,
  educationTuitionInflationScoreAdjustment,
} from '../inflation/education-tuition-inflation.js';
import {
  assessCommunicationsServicesInflation,
  communicationsServicesInflationScoreAdjustment,
} from '../inflation/communications-services-inflation.js';
import type { Agent04ModesSnapshot } from '../integration/agent04-modes-bridge.js';
import type { Agent16GuardianSnapshot } from '../integration/agent16-guardian-bridge.js';

export interface EducationCommunicationsInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent04?: Agent04ModesSnapshot | null;
  agent16?: Agent16GuardianSnapshot | null;
}

export function EducationCommunicationsInflationPanel(props: EducationCommunicationsInflationPanelProps) {
  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('inflationary' as const) : ('neutral' as const),
    sandboxStressModeActive: false,
    difficultyCostMultiplier: 1.05,
  };

  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand: props.inputs.publicStability < 42 ? ('urgent' as const) : ('advisory' as const),
    narrativeShockSeverity: props.inputs.fiscalPressure === 'critical' ? ('high' as const) : ('medium' as const),
  };

  const education = assessEducationTuitionInflation({
    enrollmentPressureBand: modes.scenarioInflationBias === 'extreme' ? 'high' : 'moderate',
    subsidyCutActive: props.inputs.fiscalPressure === 'critical',
    wageIndexationBand: guardian.inflationGuardrailTripped ? 'strong' : 'normal',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const comms = assessCommunicationsServicesInflation({
    bandwidthDemandBand: modes.sandboxStressModeActive ? 'surge' : 'normal',
    regulatedTariffShock: guardian.stabilityInterventionBand === 'urgent',
    platformFeePassThrough: modes.scenarioInflationBias === 'inflationary' ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-education-comms-inflation" data-testid="education-comms-inflation-panel">
      <h4>Education, comms & modes (round 11)</h4>
      <p>
        Education {education.pressureBand} · index {education.tuitionIndex.toFixed(0)} · score adj{' '}
        {educationTuitionInflationScoreAdjustment(education.pressureBand)}
      </p>
      <p>
        Comms {comms.pressureBand} · index {comms.commsIndex.toFixed(0)} · score adj{' '}
        {communicationsServicesInflationScoreAdjustment(comms.pressureBand)}
      </p>
      <p data-testid="education-comms-edu-note">{education.narrative}</p>
      <p>{comms.narrative}</p>
    </div>
  );
}
