import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessResearchProductivityInflationOffset,
  researchProductivityInflationOffsetScoreAdjustment,
} from '../inflation/research-productivity-inflation-offset.js';
import {
  assessScenarioSandboxInflationBias,
  scenarioSandboxInflationBiasScoreAdjustment,
} from '../inflation/scenario-sandbox-inflation-bias.js';
import type { Agent03ResearchSnapshot } from '../integration/agent03-research-bridge.js';
import type { Agent04ModesSnapshot } from '../integration/agent04-modes-bridge.js';

export interface ResearchModesInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent03?: Agent03ResearchSnapshot | null;
  agent04?: Agent04ModesSnapshot | null;
}

export function ResearchModesInflationPanel(props: ResearchModesInflationPanelProps) {
  const research = props.agent03 ?? {
    turn: props.inputs.turn,
    productivityGainBand: props.inputs.highInflationScenario ? ('flat' as const) : ('moderate' as const),
    supplySideReliefActive: !props.inputs.creditShockActive,
    innovationInflationOffsetScore: props.inputs.householdInflationScenarioActive ? 0.35 : 0.58,
    techTreeInflationLatch: props.inputs.creditShockActive,
    supplySideOffsetBand: props.inputs.fiscalPressure === 'critical' ? ('weak' as const) : ('building' as const),
  };

  const modes = props.agent04 ?? {
    turn: props.inputs.turn,
    scenarioInflationBias: props.inputs.highInflationScenario ? ('extreme' as const) : ('inflationary' as const),
    sandboxStressModeActive: props.inputs.creditShockActive,
    difficultyCostMultiplier: props.inputs.fiscalPressure === 'critical' ? 1.22 : 1.08,
    difficultyInflationCascade: props.inputs.householdInflationScenarioActive,
    sandboxStressInflationBand: props.inputs.publicStability < 42 ? ('extreme' as const) : ('stressed' as const),
  };

  const offset = assessResearchProductivityInflationOffset({
    productivityGainBand: research.productivityGainBand,
    supplySideReliefActive: research.supplySideReliefActive,
    innovationInflationOffsetScore: research.innovationInflationOffsetScore,
    techTreeInflationLatch: research.techTreeInflationLatch === true,
    supplySideOffsetBand: research.supplySideOffsetBand ?? 'building',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const bias = assessScenarioSandboxInflationBias({
    scenarioInflationBias: modes.scenarioInflationBias,
    sandboxStressModeActive: modes.sandboxStressModeActive,
    difficultyCostMultiplier: modes.difficultyCostMultiplier,
    difficultyInflationCascade: modes.difficultyInflationCascade === true,
    sandboxStressInflationBand: modes.sandboxStressInflationBand ?? 'routine',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-research-modes-inflation" data-testid="research-modes-inflation-panel">
      <h4>Research offset & scenario bias (round 26)</h4>
      <p>
        Productivity {offset.offsetBand} · index {offset.productivityIndex.toFixed(0)} · score adj{' '}
        {researchProductivityInflationOffsetScoreAdjustment(offset.offsetBand)}
      </p>
      <p>
        Scenario {bias.biasBand} · index {bias.scenarioIndex.toFixed(0)} · score adj{' '}
        {scenarioSandboxInflationBiasScoreAdjustment(bias.biasBand)}
      </p>
      <p data-testid="research-modes-note">{offset.narrative}</p>
      <p>{bias.narrative}</p>
    </div>
  );
}
