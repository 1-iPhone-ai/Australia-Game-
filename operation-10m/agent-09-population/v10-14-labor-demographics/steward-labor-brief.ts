import type { IntegratedLaborMarketBrief, NationalLaborDemographicsState } from './types';

export interface StewardLaborBrief {
  priority: 'watch' | 'nudge' | 'intervene';
  headline: string;
  hints: string[];
}

export function buildStewardLaborBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  eventLines: string[]
): StewardLaborBrief {
  if (!state.enabled || !brief) {
    return {
      priority: 'watch',
      headline: 'Labor steward idle — layer off',
      hints: ['Enable labor demographics before steward labor guidance.']
    };
  }

  const hints: string[] = [];
  if (brief.pressureBand === 'critical' || brief.pressureBand === 'elevated') {
    hints.push('Prioritize household affordability and workforce transition actions in strain hubs.');
  }
  if ((state.activeMigrationShocks?.length ?? 0) >= 2) {
    hints.push('Multiple migration shocks — avoid stacking auto commits in shocked regions.');
  }
  if (state.interregionalRebalancingPlan.moves.some(m => m.priority === 'high')) {
    hints.push('High-priority interregional rebalancing — review corridor moves before auto workforce commits.');
  }
  if (state.laborResilienceScorecard?.band === 'fragile') {
    hints.push(state.laborResilienceScorecard.stewardNote);
  }
  if (state.participationPressureBrief?.band === 'shrinking' || state.participationPressureBrief?.band === 'constrained') {
    hints.push(state.participationPressureBrief.stewardNote);
  }
  if (state.laborMarketVelocityIndex?.nationalBand === 'volatile') {
    hints.push('Volatile labor market velocity — avoid stacked auto commits until migration bands stabilize.');
  }
  if (
    state.skillMismatchIndex?.nationalBand === 'critical_mismatch' ||
    state.skillMismatchIndex?.nationalBand === 'elevated_gap'
  ) {
    hints.push(state.skillMismatchIndex.stewardNote);
  }
  if (state.laborSupplyElasticityBrief?.band === 'rigid' || state.laborSupplyElasticityBrief?.band === 'inelastic') {
    hints.push(state.laborSupplyElasticityBrief.stewardNote);
  }
  if (state.talentMobilityOutlook?.band === 'hyper_mobile') {
    hints.push(state.talentMobilityOutlook.stewardNote);
  }
  if (
    state.underemploymentPressureBrief?.band === 'severe_underuse' ||
    state.underemploymentPressureBrief?.band === 'tight_hidden'
  ) {
    hints.push(state.underemploymentPressureBrief.stewardNote);
  }
  if (state.wageCompetitivenessIndex?.band === 'cost_burden' || state.wageCompetitivenessIndex?.band === 'stretched') {
    hints.push(state.wageCompetitivenessIndex.stewardNote);
  }
  if (
    state.workforceTransitionFrictionOutlook?.band === 'bottleneck' ||
    state.workforceTransitionFrictionOutlook?.band === 'sticky'
  ) {
    hints.push(state.workforceTransitionFrictionOutlook.stewardNote);
  }
  if (state.youthEntryPipelineOutlook?.band === 'constricted' || state.youthEntryPipelineOutlook?.band === 'narrow') {
    hints.push(state.youthEntryPipelineOutlook.stewardNote);
  }
  if (
    state.laborMarketTightnessBrief?.band === 'critical_shortage' ||
    state.laborMarketTightnessBrief?.band === 'tight'
  ) {
    hints.push(state.laborMarketTightnessBrief.stewardNote);
  }
  if (
    state.hybridParticipationFrictionOutlook?.band === 'binding' ||
    state.hybridParticipationFrictionOutlook?.band === 'elevated'
  ) {
    hints.push(state.hybridParticipationFrictionOutlook.stewardNote);
  }
  if (
    state.seniorWorkforceRetentionOutlook?.band === 'fragile' ||
    state.seniorWorkforceRetentionOutlook?.band === 'strained'
  ) {
    hints.push(state.seniorWorkforceRetentionOutlook.stewardNote);
  }
  if (
    state.regionalLaborAbsorptionBrief?.band === 'saturated' ||
    state.regionalLaborAbsorptionBrief?.band === 'constrained'
  ) {
    hints.push(state.regionalLaborAbsorptionBrief.stewardNote);
  }
  if (
    state.participationEquityGapBrief?.band === 'wide_gap' ||
    state.participationEquityGapBrief?.band === 'uneven'
  ) {
    hints.push(state.participationEquityGapBrief.stewardNote);
  }
  if (state.credentialMobilityOutlook?.band === 'blocked' || state.credentialMobilityOutlook?.band === 'narrow') {
    hints.push(state.credentialMobilityOutlook.stewardNote);
  }
  if (
    state.householdParticipationCouplingBrief?.band === 'decoupled' ||
    state.householdParticipationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.householdParticipationCouplingBrief.stewardNote);
  }
  if (
    state.laborRebalancingStressBrief?.band === 'critical' ||
    state.laborRebalancingStressBrief?.band === 'acute'
  ) {
    hints.push(state.laborRebalancingStressBrief.stewardNote);
  }
  if (state.nationalWagePressure === 'surging' || state.nationalWagePressure === 'elevated') {
    hints.push('Elevated wage pressure — review high-output regions before automation expansions.');
  }
  hints.push(...eventLines.filter(e => e.length < 120).slice(0, 2));

  const priority: StewardLaborBrief['priority'] =
    brief.pressureBand === 'critical'
      ? 'intervene'
      : brief.pressureBand === 'elevated'
        ? 'nudge'
        : 'watch';

  return {
    priority,
    headline: brief.narrative.slice(0, 160),
    hints: hints.slice(0, 4)
  };
}
