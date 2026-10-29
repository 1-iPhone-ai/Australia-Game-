import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessHousingMortgageEssentialInflation,
  housingMortgageEssentialInflationScoreAdjustment,
} from '../inflation/housing-mortgage-essential-inflation.js';
import {
  assessMacroTransmissionMergeInflation,
  macroTransmissionMergeInflationScoreAdjustment,
} from '../inflation/macro-transmission-merge-inflation.js';
import type { Agent14HousingSnapshot } from '../integration/agent14-housing-bridge.js';
import type { Agent06MacroSnapshot } from '../integration/agent06-macro-bridge.js';

export interface HousingMacroMergeInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent14?: Agent14HousingSnapshot | null;
  agent06?: Agent06MacroSnapshot | null;
}

export function HousingMacroMergeInflationPanel(props: HousingMacroMergeInflationPanelProps) {
  const housing = props.agent14 ?? {
    turn: props.inputs.turn,
    mortgageStressBand:
      props.inputs.householdAffordability === 'severe_pressure'
        ? ('severe' as const)
        : props.inputs.householdAffordability === 'strained'
          ? ('elevated' as const)
          : ('low' as const),
    wellbeingCostBand:
      props.inputs.householdInflationScenarioActive && props.inputs.publicStability < 45
        ? ('critical' as const)
        : props.inputs.householdInflationScenarioActive
          ? ('strained' as const)
          : ('stable' as const),
    essentialServicesInflationFlag: props.inputs.householdInflationScenarioActive,
    inlineMergeTrajectoryBand: props.inputs.fiscalPressure === 'critical' ? ('blocked' as const) : ('lagging' as const),
    inlineActivationBoundaryCritical: props.inputs.publicStability < 40,
  };

  const macro = props.agent06 ?? {
    turn: props.inputs.turn,
    gdpGrowthBand: props.inputs.fiscalPressure === 'critical' ? ('contraction' as const) : ('slow' as const),
    unemploymentBand: props.inputs.actorCreditStressIndex > 0.55 ? ('elevated' as const) : ('moderate' as const),
    outputGap: props.inputs.highInflationScenario ? 0.3 : -0.05,
    nominalDemandPressure: props.inputs.inflationSettingMultiplier ? props.inputs.inflationSettingMultiplier - 1 : 0.1,
    transmissionStabilityFragile: props.inputs.systemicLiquidityBand === 'strained',
    macroRecoveryRankStressActive: props.inputs.creditShockActive,
  };

  const essential = assessHousingMortgageEssentialInflation({
    mortgageStressBand: housing.mortgageStressBand,
    wellbeingCostBand: housing.wellbeingCostBand,
    essentialServicesInflationFlag: housing.essentialServicesInflationFlag,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const merge = assessMacroTransmissionMergeInflation({
    transmissionStabilityFragile: macro.transmissionStabilityFragile === true,
    macroRecoveryRankStressActive: macro.macroRecoveryRankStressActive === true,
    outputGap: macro.outputGap,
    nominalDemandPressure: macro.nominalDemandPressure,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-housing-macro-merge-inflation" data-testid="housing-macro-merge-inflation-panel">
      <h4>Housing essential & macro merge (round 18)</h4>
      <p>
        Essential {essential.essentialBand} · index {essential.servicesIndex.toFixed(0)} · score adj{' '}
        {housingMortgageEssentialInflationScoreAdjustment(essential.essentialBand)}
      </p>
      <p>
        Merge {merge.mergeBand} · index {merge.transmissionIndex.toFixed(0)} · score adj{' '}
        {macroTransmissionMergeInflationScoreAdjustment(merge.mergeBand)}
      </p>
      <p data-testid="housing-macro-merge-note">{essential.narrative}</p>
      <p>{merge.narrative}</p>
    </div>
  );
}
