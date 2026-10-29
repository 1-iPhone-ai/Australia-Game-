import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessMemoryRealmInflationPersistenceLatch,
  memoryRealmInflationPersistenceLatchScoreAdjustment,
} from '../inflation/memory-realm-inflation-persistence-latch.js';
import {
  assessAutomationSynthesisInflationCascadeSurge,
  automationSynthesisInflationCascadeSurgeScoreAdjustment,
} from '../inflation/automation-synthesis-inflation-cascade-surge.js';
import type { Agent19MemorySnapshot } from '../integration/agent19-memory-bridge.js';
import type { Agent20AutomationSnapshot } from '../integration/agent20-automation-bridge.js';

export interface MemoryAutomationWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent19?: Agent19MemorySnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function MemoryAutomationWaveInflationPanel(props: MemoryAutomationWaveInflationPanelProps) {
  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: props.inputs.highInflationScenario ? 0.82 : 0.55,
    narrativeDriftTowardHigherInflation: props.inputs.highInflationScenario,
    explainabilityAlertActive: props.inputs.creditShockActive,
    wave42MemoryRecallLatch: props.inputs.householdInflationScenarioActive,
    realmPersistenceGateBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('slipping' as const),
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: 0.4,
    wave42SynthesisCascadeLatch: props.inputs.creditShockActive,
    autopilotStackSurgeBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('surge' as const) : ('stacking' as const),
  };

  const realm = assessMemoryRealmInflationPersistenceLatch({
    recalledInflationRegimeConfidence: memory.recalledInflationRegimeConfidence,
    narrativeDriftTowardHigherInflation: memory.narrativeDriftTowardHigherInflation,
    wave42MemoryRecallLatch: memory.wave42MemoryRecallLatch === true,
    realmPersistenceGateBand: memory.realmPersistenceGateBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessAutomationSynthesisInflationCascadeSurge({
    macroAutopilotInflationBias: automation.macroAutopilotInflationBias,
    unattendedShockDriftActive: automation.unattendedShockDriftActive,
    wave42SynthesisCascadeLatch: automation.wave42SynthesisCascadeLatch === true,
    autopilotStackSurgeBand: automation.autopilotStackSurgeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-memory-automation-wave-inflation" data-testid="memory-automation-wave-inflation-panel">
      <h4>Memory realm latch & automation cascade surge (round 42)</h4>
      <p>
        Memory {realm.latchBand} · index {realm.persistenceIndex.toFixed(0)} · score adj{' '}
        {memoryRealmInflationPersistenceLatchScoreAdjustment(realm.latchBand)}
      </p>
      <p>
        Automation {cascade.surgeBand} · index {cascade.cascadeIndex.toFixed(0)} · score adj{' '}
        {automationSynthesisInflationCascadeSurgeScoreAdjustment(cascade.surgeBand)}
      </p>
      <p data-testid="memory-automation-wave-note">{realm.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}
