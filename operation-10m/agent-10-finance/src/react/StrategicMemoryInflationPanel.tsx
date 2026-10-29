import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessStrategicGeopoliticalInflationPremium,
  strategicGeopoliticalInflationPremiumScoreAdjustment,
} from '../inflation/strategic-geopolitical-inflation-premium.js';
import {
  assessAiMemoryInflationRecallInflation,
  aiMemoryInflationRecallScoreAdjustment,
} from '../inflation/ai-memory-inflation-recall-inflation.js';
import type { Agent01StrategicSnapshot } from '../integration/agent01-strategic-bridge.js';
import type { Agent19MemorySnapshot } from '../integration/agent19-memory-bridge.js';

export interface StrategicMemoryInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent01?: Agent01StrategicSnapshot | null;
  agent19?: Agent19MemorySnapshot | null;
}

export function StrategicMemoryInflationPanel(props: StrategicMemoryInflationPanelProps) {
  const strategic = props.agent01 ?? {
    turn: props.inputs.turn,
    nationalPriorityInflationBias: props.inputs.highInflationScenario ? ('expansionary' as const) : ('neutral' as const),
    strategicStockpileStress: props.inputs.creditShockActive,
    geopoliticalRiskPremium: props.inputs.fiscalPressure === 'critical' ? 0.72 : 0.45,
    expansionaryPriorityCascadeActive: props.inputs.highInflationScenario && props.inputs.creditShockActive,
    strategicInflationRiskBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const memory = props.agent19 ?? {
    turn: props.inputs.turn,
    recalledInflationRegimeConfidence: props.inputs.highInflationScenario ? 0.82 : 0.55,
    narrativeDriftTowardHigherInflation: props.inputs.householdInflationScenarioActive,
    explainabilityAlertActive: props.inputs.publicStability < 45,
    memoryInflationRecallCascade: props.inputs.highInflationScenario && props.inputs.householdInflationScenarioActive,
    explainabilityInflationSalienceBand: props.inputs.publicStability < 40 ? ('critical' as const) : ('elevated' as const),
  };

  const premium = assessStrategicGeopoliticalInflationPremium({
    nationalPriorityInflationBias: strategic.nationalPriorityInflationBias,
    strategicStockpileStress: strategic.strategicStockpileStress,
    geopoliticalRiskPremium: strategic.geopoliticalRiskPremium,
    expansionaryPriorityCascadeActive: strategic.expansionaryPriorityCascadeActive === true,
    strategicInflationRiskBand: strategic.strategicInflationRiskBand ?? 'low',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const recall = assessAiMemoryInflationRecallInflation({
    recalledInflationRegimeConfidence: memory.recalledInflationRegimeConfidence,
    narrativeDriftTowardHigherInflation: memory.narrativeDriftTowardHigherInflation,
    explainabilityAlertActive: memory.explainabilityAlertActive,
    memoryInflationRecallCascade: memory.memoryInflationRecallCascade === true,
    explainabilityInflationSalienceBand: memory.explainabilityInflationSalienceBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-strategic-memory-inflation" data-testid="strategic-memory-inflation-panel">
      <h4>Strategic premium & AI memory recall (round 24)</h4>
      <p>
        Strategic {premium.premiumBand} · index {premium.strategicIndex.toFixed(0)} · score adj{' '}
        {strategicGeopoliticalInflationPremiumScoreAdjustment(premium.premiumBand)}
      </p>
      <p>
        Memory {recall.recallBand} · index {recall.memoryIndex.toFixed(0)} · score adj{' '}
        {aiMemoryInflationRecallScoreAdjustment(recall.recallBand)}
      </p>
      <p data-testid="strategic-memory-note">{premium.narrative}</p>
      <p>{recall.narrative}</p>
    </div>
  );
}
