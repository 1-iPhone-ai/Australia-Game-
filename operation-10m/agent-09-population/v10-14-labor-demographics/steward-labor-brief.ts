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
  if (
    state.automationParticipationResilienceOutlook?.band === 'fragile' ||
    state.automationParticipationResilienceOutlook?.band === 'strained'
  ) {
    hints.push(state.automationParticipationResilienceOutlook.stewardNote);
  }
  if (
    state.wageParticipationSpilloverBrief?.band === 'suppressive' ||
    state.wageParticipationSpilloverBrief?.band === 'mixed'
  ) {
    hints.push(state.wageParticipationSpilloverBrief.stewardNote);
  }
  if (
    state.migrationShockParticipationBufferOutlook?.band === 'depleted' ||
    state.migrationShockParticipationBufferOutlook?.band === 'thin'
  ) {
    hints.push(state.migrationShockParticipationBufferOutlook.stewardNote);
  }
  if (
    state.laborMarketStabilityOutlook?.band === 'volatile' ||
    state.laborMarketStabilityOutlook?.band === 'fragile'
  ) {
    hints.push(state.laborMarketStabilityOutlook.stewardNote);
  }
  if (
    state.intergenerationalWorkforceBalanceOutlook?.band === 'skewed_aged' ||
    state.intergenerationalWorkforceBalanceOutlook?.band === 'narrow_youth'
  ) {
    hints.push(state.intergenerationalWorkforceBalanceOutlook.stewardNote);
  }
  if (
    state.capacityParticipationAlignmentBrief?.band === 'misaligned' ||
    state.capacityParticipationAlignmentBrief?.band === 'strained'
  ) {
    hints.push(state.capacityParticipationAlignmentBrief.stewardNote);
  }
  if (
    state.participationVelocityCouplingBrief?.band === 'divergent' ||
    state.participationVelocityCouplingBrief?.band === 'lagging'
  ) {
    hints.push(state.participationVelocityCouplingBrief.stewardNote);
  }
  if (
    state.skillsTightnessCoherenceOutlook?.band === 'incoherent' ||
    state.skillsTightnessCoherenceOutlook?.band === 'strained'
  ) {
    hints.push(state.skillsTightnessCoherenceOutlook.stewardNote);
  }
  if (
    state.integratedLaborReadinessOutlook?.band === 'unprepared' ||
    state.integratedLaborReadinessOutlook?.band === 'caution'
  ) {
    hints.push(state.integratedLaborReadinessOutlook.stewardNote);
  }
  if (
    state.hybridRemoteParticipationOutlook?.band === 'constrained' ||
    state.hybridRemoteParticipationOutlook?.band === 'mixed'
  ) {
    hints.push(state.hybridRemoteParticipationOutlook.stewardNote);
  }
  if (
    state.corridorCapacityStressBrief?.band === 'stressed' ||
    state.corridorCapacityStressBrief?.band === 'overloaded'
  ) {
    hints.push(state.corridorCapacityStressBrief.stewardNote);
  }
  if (
    state.stewardInterventionPriorityBrief?.band === 'act' ||
    state.stewardInterventionPriorityBrief?.band === 'urgent'
  ) {
    hints.push(state.stewardInterventionPriorityBrief.stewardNote);
  }
  if (
    state.essentialWorkerParticipationOutlook?.band === 'strained' ||
    state.essentialWorkerParticipationOutlook?.band === 'mixed'
  ) {
    hints.push(state.essentialWorkerParticipationOutlook.stewardNote);
  }
  if (
    state.wageAutomationCouplingBrief?.band === 'disruptive' ||
    state.wageAutomationCouplingBrief?.band === 'tense'
  ) {
    hints.push(state.wageAutomationCouplingBrief.stewardNote);
  }
  if (
    state.nationalLaborCohesionIndex?.band === 'fragmented' ||
    state.nationalLaborCohesionIndex?.band === 'patchy'
  ) {
    hints.push(state.nationalLaborCohesionIndex.stewardNote);
  }
  if (
    state.seasonalParticipationSwingOutlook?.band === 'volatile' ||
    state.seasonalParticipationSwingOutlook?.band === 'uneven'
  ) {
    hints.push(state.seasonalParticipationSwingOutlook.stewardNote);
  }
  if (
    state.cohesionCorridorCouplingBrief?.band === 'decoupled' ||
    state.cohesionCorridorCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.cohesionCorridorCouplingBrief.stewardNote);
  }
  if (
    state.nationalWorkforceReliabilityIndex?.band === 'fragile' ||
    state.nationalWorkforceReliabilityIndex?.band === 'patchy'
  ) {
    hints.push(state.nationalWorkforceReliabilityIndex.stewardNote);
  }
  if (
    state.retentionReliabilityCouplingBrief?.band === 'fragile' ||
    state.retentionReliabilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.retentionReliabilityCouplingBrief.stewardNote);
  }
  if (
    state.upskillingVelocityOutlook?.band === 'stalled' ||
    state.upskillingVelocityOutlook?.band === 'uneven'
  ) {
    hints.push(state.upskillingVelocityOutlook.stewardNote);
  }
  if (
    state.subjectWorkforceReadinessBrief?.band === 'unready' ||
    state.subjectWorkforceReadinessBrief?.band === 'caution'
  ) {
    hints.push(state.subjectWorkforceReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSustainmentIndex?.band === 'depleted' ||
    state.nationalWorkforceSustainmentIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSustainmentIndex.stewardNote);
  }
  if (
    state.sustainmentRetentionCouplingBrief?.band === 'decoupled' ||
    state.sustainmentRetentionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.sustainmentRetentionCouplingBrief.stewardNote);
  }
  if (
    state.onboardingVelocityOutlook?.band === 'stalled' ||
    state.onboardingVelocityOutlook?.band === 'uneven'
  ) {
    hints.push(state.onboardingVelocityOutlook.stewardNote);
  }
  if (
    state.subjectAssemblyContinuityBrief?.band === 'broken' ||
    state.subjectAssemblyContinuityBrief?.band === 'gapped'
  ) {
    hints.push(state.subjectAssemblyContinuityBrief.stewardNote);
  }
  if (
    state.nationalWorkforceContinuityIndex?.band === 'fragile' ||
    state.nationalWorkforceContinuityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceContinuityIndex.stewardNote);
  }
  if (
    state.continuityCoordinationCouplingBrief?.band === 'decoupled' ||
    state.continuityCoordinationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.continuityCoordinationCouplingBrief.stewardNote);
  }
  if (
    state.reengagementMomentumOutlook?.band === 'stalled' ||
    state.reengagementMomentumOutlook?.band === 'patchy'
  ) {
    hints.push(state.reengagementMomentumOutlook.stewardNote);
  }
  if (
    state.subjectWaveAssemblyBrief?.band === 'blocked' ||
    state.subjectWaveAssemblyBrief?.band === 'gapped'
  ) {
    hints.push(state.subjectWaveAssemblyBrief.stewardNote);
  }
  if (
    state.nationalWorkforceDurabilityIndex?.band === 'brittle' ||
    state.nationalWorkforceDurabilityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceDurabilityIndex.stewardNote);
  }
  if (
    state.durabilityAdvocacyCouplingBrief?.band === 'decoupled' ||
    state.durabilityAdvocacyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.durabilityAdvocacyCouplingBrief.stewardNote);
  }
  if (
    state.mentorshipEnduranceOutlook?.band === 'depleted' ||
    state.mentorshipEnduranceOutlook?.band === 'thin'
  ) {
    hints.push(state.mentorshipEnduranceOutlook.stewardNote);
  }
  if (
    state.subjectTrancheReadinessBrief?.band === 'blocked' ||
    state.subjectTrancheReadinessBrief?.band === 'caution'
  ) {
    hints.push(state.subjectTrancheReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceEnduranceIndex?.band === 'fragile' ||
    state.nationalWorkforceEnduranceIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceEnduranceIndex.stewardNote);
  }
  if (
    state.enduranceFlexibilityCouplingBrief?.band === 'decoupled' ||
    state.enduranceFlexibilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.enduranceFlexibilityCouplingBrief.stewardNote);
  }
  if (
    state.inclusionResilienceOutlook?.band === 'fragile' ||
    state.inclusionResilienceOutlook?.band === 'patchy'
  ) {
    hints.push(state.inclusionResilienceOutlook.stewardNote);
  }
  if (
    state.subjectCommitReadinessBrief?.band === 'held' ||
    state.subjectCommitReadinessBrief?.band === 'review'
  ) {
    hints.push(state.subjectCommitReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceTenacityIndex?.band === 'brittle' ||
    state.nationalWorkforceTenacityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceTenacityIndex.stewardNote);
  }
  if (
    state.tenacityCareCouplingBrief?.band === 'decoupled' ||
    state.tenacityCareCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.tenacityCareCouplingBrief.stewardNote);
  }
  if (
    state.safetyCohesionOutlook?.band === 'exposed' ||
    state.safetyCohesionOutlook?.band === 'uneven'
  ) {
    hints.push(state.safetyCohesionOutlook.stewardNote);
  }
  if (
    state.subjectReleaseReadinessBrief?.band === 'held' ||
    state.subjectReleaseReadinessBrief?.band === 'staged'
  ) {
    hints.push(state.subjectReleaseReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSteadfastIndex?.band === 'fragile' ||
    state.nationalWorkforceSteadfastIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSteadfastIndex.stewardNote);
  }
  if (
    state.steadfastSchedulingCouplingBrief?.band === 'decoupled' ||
    state.steadfastSchedulingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.steadfastSchedulingCouplingBrief.stewardNote);
  }
  if (
    state.retentionAnchorOutlook?.band === 'drifting' ||
    state.retentionAnchorOutlook?.band === 'loose'
  ) {
    hints.push(state.retentionAnchorOutlook.stewardNote);
  }
  if (
    state.subjectSealReadinessBrief?.band === 'open' ||
    state.subjectSealReadinessBrief?.band === 'pending'
  ) {
    hints.push(state.subjectSealReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceResolveIndex?.band === 'fragile' ||
    state.nationalWorkforceResolveIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceResolveIndex.stewardNote);
  }
  if (
    state.resolveUpskillingCouplingBrief?.band === 'decoupled' ||
    state.resolveUpskillingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.resolveUpskillingCouplingBrief.stewardNote);
  }
  if (
    state.coordinationBindOutlook?.band === 'loose' ||
    state.coordinationBindOutlook?.band === 'patchy'
  ) {
    hints.push(state.coordinationBindOutlook.stewardNote);
  }
  if (
    state.subjectBindReadinessBrief?.band === 'unbound' ||
    state.subjectBindReadinessBrief?.band === 'tension'
  ) {
    hints.push(state.subjectBindReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceFortitudeIndex?.band === 'fragile' ||
    state.nationalWorkforceFortitudeIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceFortitudeIndex.stewardNote);
  }
  if (
    state.fortitudeInclusionCouplingBrief?.band === 'decoupled' ||
    state.fortitudeInclusionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.fortitudeInclusionCouplingBrief.stewardNote);
  }
  if (
    state.hybridAnchorOutlook?.band === 'drifting' ||
    state.hybridAnchorOutlook?.band === 'mixed'
  ) {
    hints.push(state.hybridAnchorOutlook.stewardNote);
  }
  if (
    state.subjectCrownReadinessBrief?.band === 'uncrowned' ||
    state.subjectCrownReadinessBrief?.band === 'pending'
  ) {
    hints.push(state.subjectCrownReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceCulminationIndex?.band === 'fragile' ||
    state.nationalWorkforceCulminationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceCulminationIndex.stewardNote);
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
