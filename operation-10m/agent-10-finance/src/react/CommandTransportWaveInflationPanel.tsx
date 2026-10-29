import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessCommandCenterInflationAlertPressureLatch,
  commandCenterInflationAlertPressureLatchScoreAdjustment,
} from '../inflation/command-center-inflation-alert-pressure-latch.js';
import {
  assessTransportFreightInflationGridlockSurge,
  transportFreightInflationGridlockSurgeScoreAdjustment,
} from '../inflation/transport-freight-inflation-gridlock-surge.js';
import type { Agent17CommandSnapshot } from '../integration/agent17-command-bridge.js';
import type { Agent12TransportSnapshot } from '../integration/agent12-transport-bridge.js';

export interface CommandTransportWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent12?: Agent12TransportSnapshot | null;
}

export function CommandTransportWaveInflationPanel(props: CommandTransportWaveInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: 0.75,
    coordinatedTighteningSuggested: props.inputs.creditShockActive,
    wave44CommandAlertLatch: props.inputs.householdInflationScenarioActive,
    commandAlertPressureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const transport = props.agent12 ?? {
    turn: props.inputs.turn,
    freightCapacityBand: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('tight' as const),
    fuelSurchargeActive: props.inputs.creditShockActive,
    portBacklogBand: props.inputs.highInflationScenario ? ('severe' as const) : ('moderate' as const),
    logisticsInflationScenarioActive: props.inputs.highInflationScenario,
    wave44FreightGridlockLatch: props.inputs.creditShockActive,
    freightGridlockSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const alert = assessCommandCenterInflationAlertPressureLatch({
    macroAlertLevel: command.macroAlertLevel,
    inflationFusionScore: command.inflationFusionScore,
    wave44CommandAlertLatch: command.wave44CommandAlertLatch === true,
    commandAlertPressureBand: command.commandAlertPressureBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const gridlock = assessTransportFreightInflationGridlockSurge({
    freightCapacityBand: transport.freightCapacityBand,
    fuelSurchargeActive: transport.fuelSurchargeActive,
    wave44FreightGridlockLatch: transport.wave44FreightGridlockLatch === true,
    freightGridlockSurgeBand: transport.freightGridlockSurgeBand ?? 'clear',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-command-transport-wave-inflation" data-testid="command-transport-wave-inflation-panel">
      <h4>Command alert latch & freight gridlock surge (round 44)</h4>
      <p>
        Command {alert.latchBand} · index {alert.alertIndex.toFixed(0)} · score adj{' '}
        {commandCenterInflationAlertPressureLatchScoreAdjustment(alert.latchBand)}
      </p>
      <p>
        Freight {gridlock.surgeBand} · index {gridlock.gridlockIndex.toFixed(0)} · score adj{' '}
        {transportFreightInflationGridlockSurgeScoreAdjustment(gridlock.surgeBand)}
      </p>
      <p data-testid="command-transport-wave-note">{alert.narrative}</p>
      <p>{gridlock.narrative}</p>
    </div>
  );
}
