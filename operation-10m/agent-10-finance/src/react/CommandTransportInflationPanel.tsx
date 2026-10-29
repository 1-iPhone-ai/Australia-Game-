import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessCommandCenterInflationFusionLatch,
  commandCenterInflationFusionLatchScoreAdjustment,
} from '../inflation/command-center-inflation-fusion-latch.js';
import {
  assessTransportFreightInflationCongestionCascade,
  transportFreightInflationCongestionCascadeScoreAdjustment,
} from '../inflation/transport-freight-inflation-congestion-cascade.js';
import type { Agent17CommandSnapshot } from '../integration/agent17-command-bridge.js';
import type { Agent12TransportSnapshot } from '../integration/agent12-transport-bridge.js';

export interface CommandTransportInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function CommandTransportInflationPanel(props: CommandTransportInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: props.inputs.actorCreditStressIndex ?? 0.55,
    coordinatedTighteningSuggested: props.inputs.creditShockActive,
    wave36FusionLatch: props.inputs.householdInflationScenarioActive,
    commandInflationEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.creditShockActive,
    portBacklogBand: props.inputs.publicStability < 42 ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    wave36LogisticsInflationLatch: props.inputs.householdInflationScenarioActive,
    freightCascadeCongestionBand: props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const fusion = assessCommandCenterInflationFusionLatch({
    macroAlertLevel: command.macroAlertLevel,
    inflationFusionScore: command.inflationFusionScore,
    coordinatedTighteningSuggested: command.coordinatedTighteningSuggested,
    wave36FusionLatch: command.wave36FusionLatch === true,
    commandInflationEscalationBand: command.commandInflationEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const cascade = assessTransportFreightInflationCongestionCascade({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    portBacklogBand: transport.portBacklogBand,
    wave36LogisticsInflationLatch: transport.wave36LogisticsInflationLatch === true,
    freightCascadeCongestionBand: transport.freightCascadeCongestionBand ?? 'clear',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-command-transport-inflation" data-testid="command-transport-inflation-panel">
      <h4>Command fusion latch & freight congestion (round 36)</h4>
      <p>
        Command {fusion.latchBand} · index {fusion.fusionIndex.toFixed(0)} · score adj{' '}
        {commandCenterInflationFusionLatchScoreAdjustment(fusion.latchBand)}
      </p>
      <p>
        Transport {cascade.cascadeBand} · index {cascade.congestionIndex.toFixed(0)} · score adj{' '}
        {transportFreightInflationCongestionCascadeScoreAdjustment(cascade.cascadeBand)}
      </p>
      <p data-testid="command-transport-note">{fusion.narrative}</p>
      <p>{cascade.narrative}</p>
    </div>
  );
}
