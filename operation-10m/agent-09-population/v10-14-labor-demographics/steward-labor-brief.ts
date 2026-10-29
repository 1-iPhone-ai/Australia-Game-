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
  if (
    state.culminationMentorshipCouplingBrief?.band === 'decoupled' ||
    state.culminationMentorshipCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.culminationMentorshipCouplingBrief.stewardNote);
  }
  if (
    state.onboardingSustainOutlook?.band === 'depleted' ||
    state.onboardingSustainOutlook?.band === 'thin'
  ) {
    hints.push(state.onboardingSustainOutlook.stewardNote);
  }
  if (
    state.subjectApexReadinessBrief?.band === 'below_apex' ||
    state.subjectApexReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectApexReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceApexIndex?.band === 'fragile' ||
    state.nationalWorkforceApexIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceApexIndex.stewardNote);
  }
  if (
    state.apexAdvocacyCouplingBrief?.band === 'decoupled' ||
    state.apexAdvocacyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.apexAdvocacyCouplingBrief.stewardNote);
  }
  if (
    state.reengagementThrustOutlook?.band === 'stalled' ||
    state.reengagementThrustOutlook?.band === 'patchy'
  ) {
    hints.push(state.reengagementThrustOutlook.stewardNote);
  }
  if (
    state.subjectPinnacleReadinessBrief?.band === 'below_pinnacle' ||
    state.subjectPinnacleReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectPinnacleReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforcePinnacleIndex?.band === 'fragile' ||
    state.nationalWorkforcePinnacleIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforcePinnacleIndex.stewardNote);
  }
  if (
    state.pinnacleRetentionCouplingBrief?.band === 'decoupled' ||
    state.pinnacleRetentionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.pinnacleRetentionCouplingBrief.stewardNote);
  }
  if (
    state.retentionCrestOutlook?.band === 'ebbing' ||
    state.retentionCrestOutlook?.band === 'patchy'
  ) {
    hints.push(state.retentionCrestOutlook.stewardNote);
  }
  if (
    state.subjectSummitReadinessBrief?.band === 'below_summit' ||
    state.subjectSummitReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectSummitReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSummitIndex?.band === 'fragile' ||
    state.nationalWorkforceSummitIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSummitIndex.stewardNote);
  }
  if (
    state.summitCoordinationCouplingBrief?.band === 'decoupled' ||
    state.summitCoordinationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.summitCoordinationCouplingBrief.stewardNote);
  }
  if (
    state.coordinationHorizonOutlook?.band === 'ebbing' ||
    state.coordinationHorizonOutlook?.band === 'patchy'
  ) {
    hints.push(state.coordinationHorizonOutlook.stewardNote);
  }
  if (
    state.subjectZenithReadinessBrief?.band === 'below_zenith' ||
    state.subjectZenithReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectZenithReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceZenithIndex?.band === 'fragile' ||
    state.nationalWorkforceZenithIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceZenithIndex.stewardNote);
  }
  if (
    state.zenithFlexibilityCouplingBrief?.band === 'decoupled' ||
    state.zenithFlexibilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.zenithFlexibilityCouplingBrief.stewardNote);
  }
  if (
    state.flexibilityAscentOutlook?.band === 'ebbing' ||
    state.flexibilityAscentOutlook?.band === 'patchy'
  ) {
    hints.push(state.flexibilityAscentOutlook.stewardNote);
  }
  if (
    state.subjectApogeeReadinessBrief?.band === 'below_apogee' ||
    state.subjectApogeeReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectApogeeReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceApogeeIndex?.band === 'fragile' ||
    state.nationalWorkforceApogeeIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceApogeeIndex.stewardNote);
  }
  if (
    state.apogeeInclusionCouplingBrief?.band === 'decoupled' ||
    state.apogeeInclusionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.apogeeInclusionCouplingBrief.stewardNote);
  }
  if (
    state.inclusionOrbitOutlook?.band === 'ebbing' ||
    state.inclusionOrbitOutlook?.band === 'patchy'
  ) {
    hints.push(state.inclusionOrbitOutlook.stewardNote);
  }
  if (
    state.subjectOrbitReadinessBrief?.band === 'below_orbit' ||
    state.subjectOrbitReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectOrbitReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceOrbitIndex?.band === 'fragile' ||
    state.nationalWorkforceOrbitIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceOrbitIndex.stewardNote);
  }
  if (
    state.orbitCareCouplingBrief?.band === 'decoupled' ||
    state.orbitCareCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.orbitCareCouplingBrief.stewardNote);
  }
  if (
    state.careEquilibriumOutlook?.band === 'ebbing' ||
    state.careEquilibriumOutlook?.band === 'patchy'
  ) {
    hints.push(state.careEquilibriumOutlook.stewardNote);
  }
  if (
    state.subjectNexusReadinessBrief?.band === 'below_nexus' ||
    state.subjectNexusReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectNexusReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceNexusIndex?.band === 'fragile' ||
    state.nationalWorkforceNexusIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceNexusIndex.stewardNote);
  }
  if (
    state.nexusSchedulingCouplingBrief?.band === 'decoupled' ||
    state.nexusSchedulingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.nexusSchedulingCouplingBrief.stewardNote);
  }
  if (
    state.schedulingResonanceOutlook?.band === 'ebbing' ||
    state.schedulingResonanceOutlook?.band === 'patchy'
  ) {
    hints.push(state.schedulingResonanceOutlook.stewardNote);
  }
  if (
    state.subjectConvergenceReadinessBrief?.band === 'below_convergence' ||
    state.subjectConvergenceReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectConvergenceReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceConvergenceIndex?.band === 'fragile' ||
    state.nationalWorkforceConvergenceIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceConvergenceIndex.stewardNote);
  }
  if (
    state.convergenceSafetyCouplingBrief?.band === 'decoupled' ||
    state.convergenceSafetyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.convergenceSafetyCouplingBrief.stewardNote);
  }
  if (
    state.safetyHarmonyOutlook?.band === 'ebbing' ||
    state.safetyHarmonyOutlook?.band === 'patchy'
  ) {
    hints.push(state.safetyHarmonyOutlook.stewardNote);
  }
  if (
    state.subjectUnificationReadinessBrief?.band === 'below_unification' ||
    state.subjectUnificationReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectUnificationReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceUnificationIndex?.band === 'fragile' ||
    state.nationalWorkforceUnificationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceUnificationIndex.stewardNote);
  }
  if (
    state.unificationUpskillingCouplingBrief?.band === 'decoupled' ||
    state.unificationUpskillingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.unificationUpskillingCouplingBrief.stewardNote);
  }
  if (
    state.upskillingSynthesisOutlook?.band === 'ebbing' ||
    state.upskillingSynthesisOutlook?.band === 'patchy'
  ) {
    hints.push(state.upskillingSynthesisOutlook.stewardNote);
  }
  if (
    state.subjectSynthesisReadinessBrief?.band === 'below_synthesis' ||
    state.subjectSynthesisReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectSynthesisReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSynthesisIndex?.band === 'fragile' ||
    state.nationalWorkforceSynthesisIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSynthesisIndex.stewardNote);
  }
  if (
    state.synthesisOnboardingCouplingBrief?.band === 'decoupled' ||
    state.synthesisOnboardingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.synthesisOnboardingCouplingBrief.stewardNote);
  }
  if (
    state.onboardingIntegrationOutlook?.band === 'ebbing' ||
    state.onboardingIntegrationOutlook?.band === 'patchy'
  ) {
    hints.push(state.onboardingIntegrationOutlook.stewardNote);
  }
  if (
    state.subjectIntegrationReadinessBrief?.band === 'below_integration' ||
    state.subjectIntegrationReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectIntegrationReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceIntegrationIndex?.band === 'fragile' ||
    state.nationalWorkforceIntegrationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceIntegrationIndex.stewardNote);
  }
  if (
    state.integrationRetentionCouplingBrief?.band === 'decoupled' ||
    state.integrationRetentionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.integrationRetentionCouplingBrief.stewardNote);
  }
  if (
    state.retentionCohesionOutlook?.band === 'ebbing' ||
    state.retentionCohesionOutlook?.band === 'patchy'
  ) {
    hints.push(state.retentionCohesionOutlook.stewardNote);
  }
  if (
    state.subjectRetentionReadinessBrief?.band === 'below_retention' ||
    state.subjectRetentionReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectRetentionReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceRetentionIndex?.band === 'fragile' ||
    state.nationalWorkforceRetentionIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceRetentionIndex.stewardNote);
  }
  if (
    state.retentionReengagementCouplingBrief?.band === 'decoupled' ||
    state.retentionReengagementCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.retentionReengagementCouplingBrief.stewardNote);
  }
  if (
    state.reengagementAlignmentOutlook?.band === 'ebbing' ||
    state.reengagementAlignmentOutlook?.band === 'patchy'
  ) {
    hints.push(state.reengagementAlignmentOutlook.stewardNote);
  }
  if (
    state.subjectReengagementReadinessBrief?.band === 'below_reengagement' ||
    state.subjectReengagementReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectReengagementReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceReengagementIndex?.band === 'fragile' ||
    state.nationalWorkforceReengagementIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceReengagementIndex.stewardNote);
  }
  if (
    state.reengagementMentorshipCouplingBrief?.band === 'decoupled' ||
    state.reengagementMentorshipCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.reengagementMentorshipCouplingBrief.stewardNote);
  }
  if (
    state.mentorshipSustainOutlook?.band === 'ebbing' ||
    state.mentorshipSustainOutlook?.band === 'patchy'
  ) {
    hints.push(state.mentorshipSustainOutlook.stewardNote);
  }
  if (
    state.subjectMentorshipReadinessBrief?.band === 'below_mentorship' ||
    state.subjectMentorshipReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectMentorshipReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceMentorshipIndex?.band === 'fragile' ||
    state.nationalWorkforceMentorshipIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceMentorshipIndex.stewardNote);
  }
  if (
    state.mentorshipAdvocacyCouplingBrief?.band === 'decoupled' ||
    state.mentorshipAdvocacyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.mentorshipAdvocacyCouplingBrief.stewardNote);
  }
  if (
    state.advocacyResonanceOutlook?.band === 'ebbing' ||
    state.advocacyResonanceOutlook?.band === 'patchy'
  ) {
    hints.push(state.advocacyResonanceOutlook.stewardNote);
  }
  if (
    state.subjectAdvocacyReadinessBrief?.band === 'below_advocacy' ||
    state.subjectAdvocacyReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectAdvocacyReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceAdvocacyIndex?.band === 'fragile' ||
    state.nationalWorkforceAdvocacyIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceAdvocacyIndex.stewardNote);
  }
  if (
    state.advocacyInclusionCouplingBrief?.band === 'decoupled' ||
    state.advocacyInclusionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.advocacyInclusionCouplingBrief.stewardNote);
  }
  if (
    state.inclusionEquityOutlook?.band === 'ebbing' ||
    state.inclusionEquityOutlook?.band === 'patchy'
  ) {
    hints.push(state.inclusionEquityOutlook.stewardNote);
  }
  if (
    state.subjectInclusionReadinessBrief?.band === 'below_inclusion' ||
    state.subjectInclusionReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectInclusionReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceInclusionIndex?.band === 'fragile' ||
    state.nationalWorkforceInclusionIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceInclusionIndex.stewardNote);
  }
  if (
    state.inclusionFlexibilityCouplingBrief?.band === 'decoupled' ||
    state.inclusionFlexibilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.inclusionFlexibilityCouplingBrief.stewardNote);
  }
  if (
    state.flexibilityFlowOutlook?.band === 'ebbing' ||
    state.flexibilityFlowOutlook?.band === 'patchy'
  ) {
    hints.push(state.flexibilityFlowOutlook.stewardNote);
  }
  if (
    state.subjectFlexibilityReadinessBrief?.band === 'below_flexibility' ||
    state.subjectFlexibilityReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectFlexibilityReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceFlexibilityIndex?.band === 'fragile' ||
    state.nationalWorkforceFlexibilityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceFlexibilityIndex.stewardNote);
  }
  if (
    state.flexibilityCoordinationCouplingBrief?.band === 'decoupled' ||
    state.flexibilityCoordinationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.flexibilityCoordinationCouplingBrief.stewardNote);
  }
  if (
    state.coordinationMeshOutlook?.band === 'ebbing' ||
    state.coordinationMeshOutlook?.band === 'patchy'
  ) {
    hints.push(state.coordinationMeshOutlook.stewardNote);
  }
  if (
    state.subjectCoordinationReadinessBrief?.band === 'below_coordination' ||
    state.subjectCoordinationReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectCoordinationReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceCoordinationIndex?.band === 'fragile' ||
    state.nationalWorkforceCoordinationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceCoordinationIndex.stewardNote);
  }
  if (
    state.coordinationSchedulingCouplingBrief?.band === 'decoupled' ||
    state.coordinationSchedulingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.coordinationSchedulingCouplingBrief.stewardNote);
  }
  if (
    state.schedulingPulseOutlook?.band === 'ebbing' ||
    state.schedulingPulseOutlook?.band === 'patchy'
  ) {
    hints.push(state.schedulingPulseOutlook.stewardNote);
  }
  if (
    state.subjectSchedulingReadinessBrief?.band === 'below_scheduling' ||
    state.subjectSchedulingReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectSchedulingReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSchedulingIndex?.band === 'fragile' ||
    state.nationalWorkforceSchedulingIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSchedulingIndex.stewardNote);
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
