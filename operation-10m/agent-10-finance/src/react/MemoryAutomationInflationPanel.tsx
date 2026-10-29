import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessMemoryCommonwealthInflationRecallGate,
  memoryCommonwealthInflationRecallGateScoreAdjustment,
} from '../inflation/memory-commonwealth-inflation-recall-gate.js';
import {
  assessAutomationSynthesisInflationCascadeDrift,
  automationSynthesisInflationCascadeDriftScoreAdjustment,
} from '../inflation/automation-synthesis-inflation-cascade-drift.js';
import type { Agent19MemorySnapshot } from '../integration/agent19-memory-bridge.js';
import type { Agent20AutomationSnapshot } from '../integration/agent20-automation-bridge.js';

export interface MemoryAutomationInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent19?: Agent19MemorySnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function MemoryAutomationInflationPanel(props: MemoryAutomationInflationPanelProps) {
  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: props.inputs.highInflationScenario ? 0.82 : 0.45,
    narrativeDriftTowardHigherInflation: props.inputs.creditShockActive,
    explainabilityAlertActive: props.inputs.householdInflationScenarioActive,
    memoryCommonwealthInflationLatch: props.inputs.highInflationScenario,
    realmRecallGateBand: props.inputs.fiscalPressure === 'critical' ? ('breached' as const) : ('opening' as const),
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: props.inputs.publicStability < 40 ? 0.35 : 0.6,
    synthesisAutopilotInflationLatch: props.inputs.householdInflationScenarioActive,
    cascadeStackDriftBand: props.inputs.systemicLiquidityBand === 'critical' ? ('runaway' as const) : ('stacking' as const),
  };

  const recallGate = assessMemoryCommonwealthInflationRecallGate({
    recalledInflationRegimeConfidence: memory.recalledInflationRegimeConfidence,
    narrativeDriftTowardHigherInflation: memory.narrativeDriftTowardHigherInflation,
    explainabilityAlertActive: memory.explainabilityAlertActive,
    memoryCommonwealthInflationLatch: memory.memoryCommonwealthInflationLatch === true,
    realmRecallGateBand: memory.realmRecallGateBand ?? 'sealed',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascadeDrift = assessAutomationSynthesisInflationCascadeDrift({
    macroAutopilotInflationBias: automation.macroAutopilotInflationBias,
    unattendedShockDriftActive: automation.unattendedShockDriftActive,
    automationConfidenceScore: automation.automationConfidenceScore,
    synthesisAutopilotInflationLatch: automation.synthesisAutopilotInflationLatch === true,
    cascadeStackDriftBand: automation.cascadeStackDriftBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-memory-automation-inflation" data-testid="memory-automation-inflation-panel">
      <h4>Commonwealth recall gate & synthesis cascade (round 34)</h4>
      <p>
        Memory {recallGate.gateBand} · index {recallGate.recallIndex.toFixed(0)} · score adj{' '}
        {memoryCommonwealthInflationRecallGateScoreAdjustment(recallGate.gateBand)}
      </p>
      <p>
        Automation {cascadeDrift.driftBand} · index {cascadeDrift.synthesisIndex.toFixed(0)} · score adj{' '}
        {automationSynthesisInflationCascadeDriftScoreAdjustment(cascadeDrift.driftBand)}
      </p>
      <p data-testid="memory-automation-note">{recallGate.narrative}</p>
      <p>{cascadeDrift.narrative}</p>
    </div>
  );
}
