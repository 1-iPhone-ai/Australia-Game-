import {
  DEMOGRAPHIC_STRUCTURE_LABEL,
  EMPLOYMENT_LINKAGE_LABEL,
  MIGRATION_FLOW_LABEL,
  WAGE_PRESSURE_LABEL,
  type NationalLaborDemographicsState
} from './types';

export type LaborGiQueryTopic =
  | 'national_summary'
  | 'wage_pressure'
  | 'migration_flow'
  | 'employment_linkage'
  | 'demographics'
  | 'migration_shocks'
  | 'household_budget'
  | 'workforce_capacity'
  | 'labor_resilience'
  | 'participation_outlook'
  | 'dependency_ratio'
  | 'labor_velocity'
  | 'skill_mismatch'
  | 'supply_elasticity'
  | 'talent_mobility'
  | 'underemployment'
  | 'wage_competitiveness'
  | 'transition_friction'
  | 'youth_pipeline'
  | 'labor_tightness'
  | 'hybrid_participation'
  | 'senior_retention'
  | 'labor_absorption'
  | 'participation_equity'
  | 'credential_mobility'
  | 'household_participation_coupling'
  | 'rebalancing_stress'
  | 'automation_participation_resilience'
  | 'wage_participation_spillover'
  | 'migration_participation_buffer'
  | 'labor_market_stability'
  | 'intergenerational_balance'
  | 'capacity_participation_alignment'
  | 'participation_velocity_coupling'
  | 'skills_tightness_coherence'
  | 'integrated_labor_readiness'
  | 'hybrid_remote_participation'
  | 'corridor_capacity_stress'
  | 'steward_intervention_priority'
  | 'essential_worker_participation'
  | 'wage_automation_coupling'
  | 'national_labor_cohesion'
  | 'seasonal_participation_swing'
  | 'cohesion_corridor_coupling'
  | 'workforce_reliability'
  | 'retention_reliability_coupling'
  | 'upskilling_velocity'
  | 'subject_workforce_readiness'
  | 'workforce_sustainment'
  | 'sustainment_retention_coupling'
  | 'onboarding_velocity'
  | 'subject_assembly_continuity'
  | 'workforce_continuity'
  | 'continuity_coordination_coupling'
  | 'reengagement_momentum'
  | 'subject_wave_assembly'
  | 'workforce_durability'
  | 'durability_advocacy_coupling'
  | 'mentorship_endurance'
  | 'subject_tranche_readiness'
  | 'workforce_endurance'
  | 'endurance_flexibility_coupling'
  | 'inclusion_resilience'
  | 'subject_commit_readiness'
  | 'workforce_tenacity';

export interface LaborGiAnswer {
  topic: LaborGiQueryTopic;
  headline: string;
  fact: string;
  inference: string;
  projection: string;
}

export function detectLaborDemographicsQuery(raw: string): LaborGiQueryTopic | null {
  const q = raw.toLowerCase();
  if (/\b(youth pipeline|youth entry|apprentice pipeline)/.test(q)) return 'youth_pipeline';
  if (/\b(senior retention|aged workforce retention|elder workforce)/.test(q)) return 'senior_retention';
  if (/\b(labor absorption|regional absorption|absorption headroom)/.test(q)) return 'labor_absorption';
  if (/\b(participation equity|equity gap|inclusion equity)/.test(q)) return 'participation_equity';
  if (/\b(credential mobility|portable credential|skills portability)/.test(q)) return 'credential_mobility';
  if (/\b(household participation coupling|budget participation link)/.test(q)) return 'household_participation_coupling';
  if (/\b(rebalancing stress|corridor stress|interregional stress)/.test(q)) return 'rebalancing_stress';
  if (/\b(automation participation resilience|automation resilience participation)/.test(q)) {
    return 'automation_participation_resilience';
  }
  if (/\b(wage participation spillover|wage spillover participation)/.test(q)) return 'wage_participation_spillover';
  if (/\b(migration shock buffer|migration participation buffer|shock buffer)/.test(q)) {
    return 'migration_participation_buffer';
  }
  if (/\b(labor market stability|market stability outlook)/.test(q)) return 'labor_market_stability';
  if (/\b(intergenerational balance|youth senior balance|generational workforce)/.test(q)) {
    return 'intergenerational_balance';
  }
  if (/\b(capacity participation alignment|capacity alignment participation)/.test(q)) {
    return 'capacity_participation_alignment';
  }
  if (/\b(participation velocity coupling|velocity participation sync)/.test(q)) {
    return 'participation_velocity_coupling';
  }
  if (/\b(skills tightness coherence|skill tightness alignment)/.test(q)) return 'skills_tightness_coherence';
  if (/\b(integrated labor readiness|labor readiness outlook)/.test(q)) return 'integrated_labor_readiness';
  if (/\b(hybrid remote participation|remote work participation outlook)/.test(q)) return 'hybrid_remote_participation';
  if (/\b(corridor capacity stress|corridor stress capacity)/.test(q)) return 'corridor_capacity_stress';
  if (/\b(steward intervention priority|intervention priority steward)/.test(q)) return 'steward_intervention_priority';
  if (/\b(essential worker participation|essential services participation)/.test(q)) {
    return 'essential_worker_participation';
  }
  if (/\b(wage automation coupling|automation wage coupling)/.test(q)) return 'wage_automation_coupling';
  if (/\b(national labor cohesion|labor cohesion index)/.test(q)) return 'national_labor_cohesion';
  if (/\b(seasonal participation swing|seasonal swing outlook)/.test(q)) return 'seasonal_participation_swing';
  if (/\b(cohesion corridor coupling|corridor cohesion link)/.test(q)) return 'cohesion_corridor_coupling';
  if (/\b(workforce reliability|reliability index labor)/.test(q)) return 'workforce_reliability';
  if (/\b(retention reliability|retention-reliability coupling)/.test(q)) return 'retention_reliability_coupling';
  if (/\b(upskilling velocity|skills velocity outlook)/.test(q)) return 'upskilling_velocity';
  if (/\b(subject workforce readiness|subject readiness labor)/.test(q)) return 'subject_workforce_readiness';
  if (/\b(workforce sustainment|sustainment index labor)/.test(q)) return 'workforce_sustainment';
  if (/\b(sustainment retention|sustainment-retention coupling)/.test(q)) return 'sustainment_retention_coupling';
  if (/\b(onboarding velocity|onboarding pipeline velocity)/.test(q)) return 'onboarding_velocity';
  if (/\b(subject assembly continuity|assembly continuity subject)/.test(q)) return 'subject_assembly_continuity';
  if (/\b(workforce continuity|continuity index labor)/.test(q)) return 'workforce_continuity';
  if (/\b(continuity coordination|continuity-coordination coupling)/.test(q)) return 'continuity_coordination_coupling';
  if (/\b(reengagement momentum|reengagement pipeline momentum)/.test(q)) return 'reengagement_momentum';
  if (/\b(subject wave assembly|wave assembly subject)/.test(q)) return 'subject_wave_assembly';
  if (/\b(workforce durability|durability index labor)/.test(q)) return 'workforce_durability';
  if (/\b(durability advocacy|durability-advocacy coupling)/.test(q)) return 'durability_advocacy_coupling';
  if (/\b(mentorship endurance|mentorship pipeline endurance)/.test(q)) return 'mentorship_endurance';
  if (/\b(subject tranche readiness|tranche readiness subject)/.test(q)) return 'subject_tranche_readiness';
  if (/\b(workforce endurance|endurance index labor)/.test(q)) return 'workforce_endurance';
  if (/\b(endurance flexibility|endurance-flexibility coupling)/.test(q)) return 'endurance_flexibility_coupling';
  if (/\b(inclusion resilience|inclusion labor resilience)/.test(q)) return 'inclusion_resilience';
  if (/\b(subject commit readiness|commit readiness subject)/.test(q)) return 'subject_commit_readiness';
  if (/\b(workforce tenacity|tenacity index labor)/.test(q)) return 'workforce_tenacity';
  if (/\b(labor market tight|market tightness|tightness brief)/.test(q)) return 'labor_tightness';
  if (/\b(hybrid participation|remote friction|work from home friction)/.test(q)) return 'hybrid_participation';
  if (/\b(migration shock|shock.*migrat)/.test(q)) return 'migration_shocks';
  if (/\b(household budget|affordability|cost of living)/.test(q)) return 'household_budget';
  if (/\b(wage compet|cost burden|competitiveness)/.test(q)) return 'wage_competitiveness';
  if (/\b(wage|pay pressure|salary pressure)/.test(q)) return 'wage_pressure';
  if (/\b(migrat|inflow|outflow|relocate)/.test(q)) return 'migration_flow';
  if (/\b(employment link|jobs.*output)/.test(q)) return 'employment_linkage';
  if (/\b(dependency ratio|aging dependency|aged pressure)/.test(q)) return 'dependency_ratio';
  if (/\b(demograph|aging)/.test(q)) return 'demographics';
  if (/\b(workforce capacity|capacity gap|labor shortage)/.test(q)) return 'workforce_capacity';
  if (/\b(labor resilience|resilience score)/.test(q)) return 'labor_resilience';
  if (/\b(participation|labor force participation)/.test(q)) return 'participation_outlook';
  if (/\b(labor velocity|market churn|turnover pressure)/.test(q)) return 'labor_velocity';
  if (/\b(skill mismatch|skills gap|misaligned skills)/.test(q)) return 'skill_mismatch';
  if (/\b(supply elasticity|inelastic labor|labor supply response)/.test(q)) return 'supply_elasticity';
  if (/\b(talent mobility|mobile talent|talent flow)/.test(q)) return 'talent_mobility';
  if (/\b(underemploy|hidden slack|labor slack)/.test(q)) return 'underemployment';
  if (/\b(transition friction|sticky transition|workforce transition)/.test(q)) return 'transition_friction';
  if (/\b(labor demo|workforce structure|v10\.14)/.test(q)) return 'national_summary';
  return null;
}

export function answerLaborDemographicsQuestion(
  state: NationalLaborDemographicsState | null | undefined,
  topic: LaborGiQueryTopic
): LaborGiAnswer {
  if (!state || !state.enabled) {
    return {
      topic,
      headline: 'Labor demographics unavailable',
      fact: 'The V10.14 labor demographics layer is disabled or not computed.',
      inference: 'Enable National Systems, Industries, and Labor Demographics to answer.',
      projection: 'No projection until the layer is active.'
    };
  }

  switch (topic) {
    case 'wage_pressure':
      return {
        topic,
        headline: WAGE_PRESSURE_LABEL[state.nationalWagePressure],
        fact: `National wage pressure score ${Math.round(state.wagePressureScore)} on turn ${state.turn}. ${state.summary}`,
        inference: state.outlook,
        projection: 'Wage bands move with workforce strain and industry output momentum (bounded indices only).'
      };
    case 'migration_flow':
      return {
        topic,
        headline: MIGRATION_FLOW_LABEL[state.nationalMigrationFlow],
        fact: `Migration flow score ${Math.round(state.migrationFlowScore)}; ${(state.activeMigrationShocks || []).length} active shock(s).`,
        inference: state.outlook,
        projection: 'Attractiveness differentials shift flow bands — not literal population counts.'
      };
    case 'employment_linkage':
      return {
        topic,
        headline: EMPLOYMENT_LINKAGE_LABEL[state.nationalEmploymentLinkage],
        fact: `Employment linkage score ${Math.round(state.employmentLinkageScore)} tied to industry effectiveOutput.`,
        inference: state.summary,
        projection: 'Dominant industry shares in industryLinks drive national linkage narrative.'
      };
    case 'demographics':
      return {
        topic,
        headline: DEMOGRAPHIC_STRUCTURE_LABEL[state.nationalDemographicStructure],
        fact: `Demographic structure score ${Math.round(state.demographicScore)}.`,
        inference: 'Structure derives from industry mix and Living Regions momentum — not census data.',
        projection: 'Hysteresis dampens rapid band flips.'
      };
    case 'migration_shocks':
      return {
        topic,
        headline: 'Active migration shocks',
        fact:
          (state.activeMigrationShocks || [])
            .map(s => `${s.regionId}: ${s.label} (${s.magnitude >= 0 ? '+' : ''}${Math.round(s.magnitude)})`)
            .join('; ') || 'No active migration shocks.',
        inference: 'Shocks decay over turns when persisted.',
        projection: 'Resource booms and household strain are primary shock detectors.'
      };
    case 'household_budget':
      return {
        topic,
        headline: 'Household budget pressure (labor lens)',
        fact: state.householdBudgetSummary || 'Household budget detail not attached.',
        inference: 'Budget pressure adjusts wages and migration attractiveness without currency fields.',
        projection: 'Severe affordability increases outflow shock risk.'
      };
    case 'workforce_capacity':
      return {
        topic,
        headline: state.workforceCapacityBridge?.summary || 'Workforce capacity bridge unavailable.',
        fact: `National gap band ${state.workforceCapacityBridge?.nationalBand ?? 'unknown'}; dominant industry ${state.workforceCapacityBridge?.dominantShortageIndustry ?? 'n/a'}.`,
        inference: state.workforceCapacityBridge?.regions.NSW?.narrative || state.summary,
        projection: 'Demand vs supply indices use output linkage — not literal headcount.'
      };
    case 'labor_resilience':
      return {
        topic,
        headline: state.laborResilienceScorecard?.headline || 'Labor resilience scorecard unavailable.',
        fact:
          state.laborResilienceScorecard?.dimensions.map(d => `${d.label}: ${Math.round(d.score)}`).join('; ') ||
          'No resilience dimensions.',
        inference: state.laborResilienceScorecard?.stewardNote || state.outlook,
        projection: 'Resilience blends shocks, budget, automation, and capacity margin.'
      };
    case 'participation_outlook':
      return {
        topic,
        headline: state.participationPressureBrief?.summary || 'Participation outlook unavailable.',
        fact: `Participation band ${state.participationPressureBrief?.band ?? 'unknown'}; index ${Math.round(state.participationPressureBrief?.participationIndex ?? 50)}.`,
        inference:
          state.participationPressureBrief?.headwinds.join(' ') ||
          state.participationPressureBrief?.tailwinds.join(' ') ||
          state.outlook,
        projection: state.participationPressureBrief?.stewardNote || 'Participation indices are bounded — not literal LFPR.'
      };
    case 'dependency_ratio':
      return {
        topic,
        headline: state.dependencyRatioSnapshot?.summary || 'Dependency snapshot unavailable.',
        fact: `National dependency band ${state.dependencyRatioSnapshot?.nationalBand ?? 'unknown'}; aged-pressure regions: ${(state.dependencyRatioSnapshot?.agedPressureRegions ?? []).join(', ') || 'none'}.`,
        inference: state.dependencyRatioSnapshot?.regions.NSW?.narrative || state.summary,
        projection: 'Dependency indices proxy demographic structure — not census ratios.'
      };
    case 'labor_velocity':
      return {
        topic,
        headline: state.laborMarketVelocityIndex?.summary || 'Labor velocity index unavailable.',
        fact: `National velocity ${state.laborMarketVelocityIndex?.nationalBand ?? 'unknown'}; hottest region ${state.laborMarketVelocityIndex?.hottestRegion ?? 'n/a'}.`,
        inference: state.laborMarketVelocityIndex?.regions.NSW?.narrative || state.outlook,
        projection: 'Velocity blends migration and wage churn — not literal turnover counts.'
      };
    case 'skill_mismatch':
      return {
        topic,
        headline: state.skillMismatchIndex?.summary || 'Skill mismatch index unavailable.',
        fact: `National mismatch band ${state.skillMismatchIndex?.nationalBand ?? 'unknown'}; worst region ${state.skillMismatchIndex?.worstRegion ?? 'n/a'}.`,
        inference: state.skillMismatchIndex?.stewardNote || state.summary,
        projection: 'Mismatch indices proxy capacity vs upskilling — not credential surveys.'
      };
    case 'supply_elasticity':
      return {
        topic,
        headline: state.laborSupplyElasticityBrief?.summary || 'Supply elasticity unavailable.',
        fact: `Elasticity band ${state.laborSupplyElasticityBrief?.band ?? 'unknown'}; index ${Math.round(state.laborSupplyElasticityBrief?.elasticityIndex ?? 50)}.`,
        inference: state.laborSupplyElasticityBrief?.stewardNote || state.outlook,
        projection: 'Elasticity blends wage and participation sensitivity — bounded indices only.'
      };
    case 'talent_mobility':
      return {
        topic,
        headline: state.talentMobilityOutlook?.summary || 'Talent mobility outlook unavailable.',
        fact: `Mobility band ${state.talentMobilityOutlook?.band ?? 'unknown'}; corridor ${state.talentMobilityOutlook?.corridorHighlight ?? 'n/a'}.`,
        inference: state.talentMobilityOutlook?.stewardNote || state.outlook,
        projection: 'Mobility blends velocity, retention, and pathways — not literal relocation counts.'
      };
    case 'underemployment':
      return {
        topic,
        headline: state.underemploymentPressureBrief?.summary || 'Underemployment outlook unavailable.',
        fact: `Underemployment band ${state.underemploymentPressureBrief?.band ?? 'unknown'}; gap ${Math.round(state.underemploymentPressureBrief?.linkageParticipationGap ?? 0)}.`,
        inference: state.underemploymentPressureBrief?.stewardNote || state.summary,
        projection: 'Underemployment indices proxy linkage-participation slack — not literal U6 rates.'
      };
    case 'wage_competitiveness':
      return {
        topic,
        headline: state.wageCompetitivenessIndex?.summary || 'Wage competitiveness unavailable.',
        fact: `Competitiveness band ${state.wageCompetitivenessIndex?.band ?? 'unknown'}; index ${Math.round(state.wageCompetitivenessIndex?.competitivenessIndex ?? 50)}.`,
        inference: state.wageCompetitivenessIndex?.stewardNote || state.outlook,
        projection: 'Competitiveness blends wage pressure, mismatch, and capacity — bounded indices only.'
      };
    case 'transition_friction':
      return {
        topic,
        headline: state.workforceTransitionFrictionOutlook?.summary || 'Transition friction unavailable.',
        fact: `Friction band ${state.workforceTransitionFrictionOutlook?.band ?? 'unknown'}; automation drag ${Math.round(state.workforceTransitionFrictionOutlook?.automationDrag ?? 0)}.`,
        inference: state.workforceTransitionFrictionOutlook?.stewardNote || state.outlook,
        projection: 'Friction blends velocity, elasticity, and automation — not literal retraining counts.'
      };
    case 'youth_pipeline':
      return {
        topic,
        headline: state.youthEntryPipelineOutlook?.summary || 'Youth entry pipeline unavailable.',
        fact: `Pipeline band ${state.youthEntryPipelineOutlook?.band ?? 'unknown'}; dependency headwind ${Math.round(state.youthEntryPipelineOutlook?.dependencyHeadwind ?? 0)}.`,
        inference: state.youthEntryPipelineOutlook?.stewardNote || state.summary,
        projection: 'Youth pipeline blends dependency, participation, and upskilling — bounded indices only.'
      };
    case 'labor_tightness':
      return {
        topic,
        headline: state.laborMarketTightnessBrief?.summary || 'Labor market tightness unavailable.',
        fact: `Tightness band ${state.laborMarketTightnessBrief?.band ?? 'unknown'}; capacity drag ${Math.round(state.laborMarketTightnessBrief?.capacityGapDrag ?? 0)}.`,
        inference: state.laborMarketTightnessBrief?.stewardNote || state.outlook,
        projection: 'Tightness blends capacity gaps, wage pressure, and underemployment slack — not literal vacancy counts.'
      };
    case 'hybrid_participation':
      return {
        topic,
        headline: state.hybridParticipationFrictionOutlook?.summary || 'Hybrid participation friction unavailable.',
        fact: `Hybrid band ${state.hybridParticipationFrictionOutlook?.band ?? 'unknown'}; care relief ${Math.round((state.hybridParticipationFrictionOutlook?.careReliefLift ?? 0) * 100)}%.`,
        inference: state.hybridParticipationFrictionOutlook?.stewardNote || state.outlook,
        projection: 'Hybrid friction blends transition, mobility, and care levers — not literal remote-work counts.'
      };
    case 'senior_retention':
      return {
        topic,
        headline: state.seniorWorkforceRetentionOutlook?.summary || 'Senior retention outlook unavailable.',
        fact: `Retention band ${state.seniorWorkforceRetentionOutlook?.band ?? 'unknown'}; aged drag ${Math.round(state.seniorWorkforceRetentionOutlook?.agedPressureDrag ?? 0)}.`,
        inference: state.seniorWorkforceRetentionOutlook?.stewardNote || state.summary,
        projection: 'Senior retention blends dependency, participation, and retention levers — bounded indices only.'
      };
    case 'labor_absorption':
      return {
        topic,
        headline: state.regionalLaborAbsorptionBrief?.summary || 'Regional labor absorption unavailable.',
        fact: `Absorption band ${state.regionalLaborAbsorptionBrief?.band ?? 'unknown'}; migration load drag ${Math.round(state.regionalLaborAbsorptionBrief?.migrationLoadDrag ?? 0)}.`,
        inference: state.regionalLaborAbsorptionBrief?.stewardNote || state.outlook,
        projection: 'Absorption blends migration load, capacity headroom, and tightness — not literal housing counts.'
      };
    case 'participation_equity':
      return {
        topic,
        headline: state.participationEquityGapBrief?.summary || 'Participation equity gap unavailable.',
        fact: `Equity band ${state.participationEquityGapBrief?.band ?? 'unknown'}; inclusion ease ${Math.round((state.participationEquityGapBrief?.inclusionEaseLift ?? 0) * 100)}%.`,
        inference: state.participationEquityGapBrief?.stewardNote || state.outlook,
        projection: 'Equity blends inclusion, flexibility, and underemployment slack — not literal demographic gaps.'
      };
    case 'credential_mobility':
      return {
        topic,
        headline: state.credentialMobilityOutlook?.summary || 'Credential mobility unavailable.',
        fact: `Credential band ${state.credentialMobilityOutlook?.band ?? 'unknown'}; pathway lift ${Math.round((state.credentialMobilityOutlook?.pathwayLift ?? 0) * 100)}%.`,
        inference: state.credentialMobilityOutlook?.stewardNote || state.summary,
        projection: 'Credential mobility blends pathways, mismatch, and talent flow — bounded indices only.'
      };
    case 'household_participation_coupling':
      return {
        topic,
        headline: state.householdParticipationCouplingBrief?.summary || 'Household-participation coupling unavailable.',
        fact: `Coupling band ${state.householdParticipationCouplingBrief?.band ?? 'unknown'}; budget drag ${Math.round(state.householdParticipationCouplingBrief?.budgetPressureDrag ?? 0)}.`,
        inference: state.householdParticipationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling blends budget pressure, participation, equity, and reengagement — not literal income data.'
      };
    case 'rebalancing_stress':
      return {
        topic,
        headline: state.laborRebalancingStressBrief?.summary || 'Rebalancing stress unavailable.',
        fact: `Stress band ${state.laborRebalancingStressBrief?.band ?? 'unknown'}; high-priority moves ${state.laborRebalancingStressBrief?.highPriorityMoves ?? 0}.`,
        inference: state.laborRebalancingStressBrief?.stewardNote || state.outlook,
        projection: 'Stress blends corridor moves, absorption, and tightness — not literal relocation counts.'
      };
    case 'automation_participation_resilience':
      return {
        topic,
        headline:
          state.automationParticipationResilienceOutlook?.summary ||
          'Automation-participation resilience unavailable.',
        fact: `Resilience band ${state.automationParticipationResilienceOutlook?.band ?? 'unknown'}; automation drag ${Math.round(state.automationParticipationResilienceOutlook?.automationPressureDrag ?? 0)}.`,
        inference: state.automationParticipationResilienceOutlook?.stewardNote || state.summary,
        projection: 'Resilience blends automation pressure, participation, and transition — bounded indices only.'
      };
    case 'wage_participation_spillover':
      return {
        topic,
        headline: state.wageParticipationSpilloverBrief?.summary || 'Wage-participation spillover unavailable.',
        fact: `Spillover band ${state.wageParticipationSpilloverBrief?.band ?? 'unknown'}; wage drag ${Math.round(state.wageParticipationSpilloverBrief?.wagePressureDrag ?? 0)}.`,
        inference: state.wageParticipationSpilloverBrief?.stewardNote || state.outlook,
        projection: 'Spillover blends competitiveness, wage pressure, and household coupling — not literal payroll data.'
      };
    case 'migration_participation_buffer':
      return {
        topic,
        headline:
          state.migrationShockParticipationBufferOutlook?.summary ||
          'Migration-shock participation buffer unavailable.',
        fact: `Buffer band ${state.migrationShockParticipationBufferOutlook?.band ?? 'unknown'}; shock drag ${Math.round(state.migrationShockParticipationBufferOutlook?.activeShockDrag ?? 0)}.`,
        inference: state.migrationShockParticipationBufferOutlook?.stewardNote || state.outlook,
        projection: 'Buffer blends shocks, absorption, onboarding, and participation — not literal migrant counts.'
      };
    case 'labor_market_stability':
      return {
        topic,
        headline: state.laborMarketStabilityOutlook?.summary || 'Labor market stability unavailable.',
        fact: `Stability band ${state.laborMarketStabilityOutlook?.band ?? 'unknown'}; stress drag ${Math.round(state.laborMarketStabilityOutlook?.stressDrag ?? 0)}.`,
        inference: state.laborMarketStabilityOutlook?.stewardNote || state.summary,
        projection: 'Stability blends pressure, rebalancing stress, automation resilience, and coordination — bounded indices only.'
      };
    case 'intergenerational_balance':
      return {
        topic,
        headline:
          state.intergenerationalWorkforceBalanceOutlook?.summary || 'Intergenerational balance unavailable.',
        fact: `Balance band ${state.intergenerationalWorkforceBalanceOutlook?.band ?? 'unknown'}; pipeline gap ${Math.round(state.intergenerationalWorkforceBalanceOutlook?.pipelineGap ?? 0)}.`,
        inference: state.intergenerationalWorkforceBalanceOutlook?.stewardNote || state.outlook,
        projection: 'Balance blends youth pipeline and senior retention — not literal age cohort counts.'
      };
    case 'capacity_participation_alignment':
      return {
        topic,
        headline: state.capacityParticipationAlignmentBrief?.summary || 'Capacity-participation alignment unavailable.',
        fact: `Alignment band ${state.capacityParticipationAlignmentBrief?.band ?? 'unknown'}; capacity drag ${Math.round(state.capacityParticipationAlignmentBrief?.capacityGapDrag ?? 0)}.`,
        inference: state.capacityParticipationAlignmentBrief?.stewardNote || state.outlook,
        projection: 'Alignment blends capacity gaps, equity, absorption, and linkage — not literal headcount targets.'
      };
    case 'participation_velocity_coupling':
      return {
        topic,
        headline: state.participationVelocityCouplingBrief?.summary || 'Participation-velocity coupling unavailable.',
        fact: `Coupling band ${state.participationVelocityCouplingBrief?.band ?? 'unknown'}; velocity drag ${Math.round(state.participationVelocityCouplingBrief?.velocityDrag ?? 0)}.`,
        inference: state.participationVelocityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling blends participation, velocity, and advocacy — not literal churn counts.'
      };
    case 'skills_tightness_coherence':
      return {
        topic,
        headline: state.skillsTightnessCoherenceOutlook?.summary || 'Skills-tightness coherence unavailable.',
        fact: `Coherence band ${state.skillsTightnessCoherenceOutlook?.band ?? 'unknown'}; mismatch drag ${Math.round(state.skillsTightnessCoherenceOutlook?.mismatchDrag ?? 0)}.`,
        inference: state.skillsTightnessCoherenceOutlook?.stewardNote || state.summary,
        projection: 'Coherence blends mismatch, tightness, and credential mobility — bounded indices only.'
      };
    case 'integrated_labor_readiness':
      return {
        topic,
        headline: state.integratedLaborReadinessOutlook?.summary || 'Integrated labor readiness unavailable.',
        fact: `Readiness band ${state.integratedLaborReadinessOutlook?.band ?? 'unknown'}; stability drag ${Math.round(state.integratedLaborReadinessOutlook?.stabilityDrag ?? 0)}.`,
        inference: state.integratedLaborReadinessOutlook?.stewardNote || state.outlook,
        projection: 'Readiness blends stability, alignment, buffers, and resilience — steward guidance only.'
      };
    case 'hybrid_remote_participation':
      return {
        topic,
        headline: state.hybridRemoteParticipationOutlook?.summary || 'Hybrid-remote participation unavailable.',
        fact: `Remote band ${state.hybridRemoteParticipationOutlook?.band ?? 'unknown'}; friction drag ${Math.round(state.hybridRemoteParticipationOutlook?.frictionDrag ?? 0)}.`,
        inference: state.hybridRemoteParticipationOutlook?.stewardNote || state.outlook,
        projection: 'Remote outlook blends hybrid friction, flexibility, and mentorship — not literal remote headcounts.'
      };
    case 'corridor_capacity_stress':
      return {
        topic,
        headline: state.corridorCapacityStressBrief?.summary || 'Corridor capacity stress unavailable.',
        fact: `Stress band ${state.corridorCapacityStressBrief?.band ?? 'unknown'}; move drag ${Math.round(state.corridorCapacityStressBrief?.corridorMoveDrag ?? 0)}.`,
        inference: state.corridorCapacityStressBrief?.stewardNote || state.outlook,
        projection: 'Corridor stress blends moves, absorption, rebalancing, and tightness — not literal infrastructure counts.'
      };
    case 'steward_intervention_priority':
      return {
        topic,
        headline: state.stewardInterventionPriorityBrief?.summary || 'Steward intervention priority unavailable.',
        fact: `Priority band ${state.stewardInterventionPriorityBrief?.band ?? 'unknown'}; readiness drag ${Math.round(state.stewardInterventionPriorityBrief?.readinessDrag ?? 0)}.`,
        inference: state.stewardInterventionPriorityBrief?.stewardNote || state.summary,
        projection: 'Intervention priority synthesizes readiness, stability, and rebalancing stress for steward nudges.'
      };
    case 'essential_worker_participation':
      return {
        topic,
        headline: state.essentialWorkerParticipationOutlook?.summary || 'Essential-worker participation unavailable.',
        fact: `Essential band ${state.essentialWorkerParticipationOutlook?.band ?? 'unknown'}; shock drag ${Math.round(state.essentialWorkerParticipationOutlook?.shockDrag ?? 0)}.`,
        inference: state.essentialWorkerParticipationOutlook?.stewardNote || state.outlook,
        projection: 'Essential outlook blends access shocks, buffers, safety, and participation — bounded indices only.'
      };
    case 'wage_automation_coupling':
      return {
        topic,
        headline: state.wageAutomationCouplingBrief?.summary || 'Wage-automation coupling unavailable.',
        fact: `Coupling band ${state.wageAutomationCouplingBrief?.band ?? 'unknown'}; automation drag ${Math.round(state.wageAutomationCouplingBrief?.automationDrag ?? 0)}.`,
        inference: state.wageAutomationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling blends spillover, competitiveness, and automation resilience — not literal payroll automation counts.'
      };
    case 'national_labor_cohesion':
      return {
        topic,
        headline: state.nationalLaborCohesionIndex?.summary || 'National labor cohesion unavailable.',
        fact: `Cohesion band ${state.nationalLaborCohesionIndex?.band ?? 'unknown'}; stability drag ${Math.round(state.nationalLaborCohesionIndex?.stabilityDrag ?? 0)}.`,
        inference: state.nationalLaborCohesionIndex?.stewardNote || state.summary,
        projection: 'Cohesion synthesizes stability, intergenerational balance, alignment, and coordination — steward guidance only.'
      };
    case 'seasonal_participation_swing':
      return {
        topic,
        headline: state.seasonalParticipationSwingOutlook?.summary || 'Seasonal participation swing unavailable.',
        fact: `Swing band ${state.seasonalParticipationSwingOutlook?.band ?? 'unknown'}; seasonal drag ${Math.round(state.seasonalParticipationSwingOutlook?.seasonalDrag ?? 0)}.`,
        inference: state.seasonalParticipationSwingOutlook?.stewardNote || state.outlook,
        projection: 'Seasonal swing blends essential participation, tightness, and scheduling levers — not literal seasonal headcounts.'
      };
    case 'cohesion_corridor_coupling':
      return {
        topic,
        headline: state.cohesionCorridorCouplingBrief?.summary || 'Cohesion-corridor coupling unavailable.',
        fact: `Coupling band ${state.cohesionCorridorCouplingBrief?.band ?? 'unknown'}; corridor drag ${Math.round(state.cohesionCorridorCouplingBrief?.corridorDrag ?? 0)}.`,
        inference: state.cohesionCorridorCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links national cohesion with corridor stress — bounded indices only.'
      };
    case 'workforce_reliability':
      return {
        topic,
        headline: state.nationalWorkforceReliabilityIndex?.summary || 'Workforce reliability unavailable.',
        fact: `Reliability band ${state.nationalWorkforceReliabilityIndex?.band ?? 'unknown'}; coupling drag ${Math.round(state.nationalWorkforceReliabilityIndex?.couplingDrag ?? 0)}.`,
        inference: state.nationalWorkforceReliabilityIndex?.stewardNote || state.summary,
        projection: 'Reliability synthesizes seasonal swing, scheduling, safety, and cohesion-corridor coupling.'
      };
    case 'retention_reliability_coupling':
      return {
        topic,
        headline: state.retentionReliabilityCouplingBrief?.summary || 'Retention-reliability coupling unavailable.',
        fact: `Coupling band ${state.retentionReliabilityCouplingBrief?.band ?? 'unknown'}; reliability drag ${Math.round(state.retentionReliabilityCouplingBrief?.reliabilityDrag ?? 0)}.`,
        inference: state.retentionReliabilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links retention levers with workforce reliability — bounded indices only.'
      };
    case 'upskilling_velocity':
      return {
        topic,
        headline: state.upskillingVelocityOutlook?.summary || 'Upskilling velocity unavailable.',
        fact: `Velocity band ${state.upskillingVelocityOutlook?.band ?? 'unknown'}; mismatch drag ${Math.round(state.upskillingVelocityOutlook?.mismatchDrag ?? 0)}.`,
        inference: state.upskillingVelocityOutlook?.stewardNote || state.outlook,
        projection: 'Velocity blends upskilling program levers with skills tightness coherence — not literal training counts.'
      };
    case 'subject_workforce_readiness':
      return {
        topic,
        headline: state.subjectWorkforceReadinessBrief?.summary || 'Subject workforce readiness unavailable.',
        fact: `Subject band ${state.subjectWorkforceReadinessBrief?.band ?? 'unknown'}; readiness drag ${Math.round(state.subjectWorkforceReadinessBrief?.readinessDrag ?? 0)}.`,
        inference: state.subjectWorkforceReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject readiness gates retention coupling against integrated labor readiness for assembly waves.'
      };
    case 'workforce_sustainment':
      return {
        topic,
        headline: state.nationalWorkforceSustainmentIndex?.summary || 'Workforce sustainment unavailable.',
        fact: `Sustainment band ${state.nationalWorkforceSustainmentIndex?.band ?? 'unknown'}; subject drag ${Math.round(state.nationalWorkforceSustainmentIndex?.subjectDrag ?? 0)}.`,
        inference: state.nationalWorkforceSustainmentIndex?.stewardNote || state.summary,
        projection: 'Sustainment synthesizes reliability, upskilling velocity, and subject readiness — steward guidance only.'
      };
    case 'sustainment_retention_coupling':
      return {
        topic,
        headline: state.sustainmentRetentionCouplingBrief?.summary || 'Sustainment-retention coupling unavailable.',
        fact: `Coupling band ${state.sustainmentRetentionCouplingBrief?.band ?? 'unknown'}; sustainment drag ${Math.round(state.sustainmentRetentionCouplingBrief?.sustainmentDrag ?? 0)}.`,
        inference: state.sustainmentRetentionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce sustainment with retention-reliability depth — bounded indices only.'
      };
    case 'onboarding_velocity':
      return {
        topic,
        headline: state.onboardingVelocityOutlook?.summary || 'Onboarding velocity unavailable.',
        fact: `Onboarding band ${state.onboardingVelocityOutlook?.band ?? 'unknown'}; pipeline drag ${Math.round(state.onboardingVelocityOutlook?.pipelineDrag ?? 0)}.`,
        inference: state.onboardingVelocityOutlook?.stewardNote || state.outlook,
        projection: 'Onboarding velocity blends onboarding levers with upskilling velocity — not literal hire counts.'
      };
    case 'subject_assembly_continuity':
      return {
        topic,
        headline: state.subjectAssemblyContinuityBrief?.summary || 'Subject assembly continuity unavailable.',
        fact: `Continuity band ${state.subjectAssemblyContinuityBrief?.band ?? 'unknown'}; assembly drag ${Math.round(state.subjectAssemblyContinuityBrief?.assemblyDrag ?? 0)}.`,
        inference: state.subjectAssemblyContinuityBrief?.stewardNote || state.summary,
        projection: 'Subject assembly continuity gates readiness against sustainment for scale-wave commits.'
      };
    case 'workforce_continuity':
      return {
        topic,
        headline: state.nationalWorkforceContinuityIndex?.summary || 'Workforce continuity unavailable.',
        fact: `Continuity band ${state.nationalWorkforceContinuityIndex?.band ?? 'unknown'}; assembly drag ${Math.round(state.nationalWorkforceContinuityIndex?.assemblyDrag ?? 0)}.`,
        inference: state.nationalWorkforceContinuityIndex?.stewardNote || state.summary,
        projection: 'Continuity synthesizes sustainment-retention, onboarding velocity, and subject assembly — steward guidance only.'
      };
    case 'continuity_coordination_coupling':
      return {
        topic,
        headline: state.continuityCoordinationCouplingBrief?.summary || 'Continuity-coordination coupling unavailable.',
        fact: `Coupling band ${state.continuityCoordinationCouplingBrief?.band ?? 'unknown'}; continuity drag ${Math.round(state.continuityCoordinationCouplingBrief?.continuityDrag ?? 0)}.`,
        inference: state.continuityCoordinationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce continuity with coordination levers — bounded indices only.'
      };
    case 'reengagement_momentum':
      return {
        topic,
        headline: state.reengagementMomentumOutlook?.summary || 'Reengagement momentum unavailable.',
        fact: `Momentum band ${state.reengagementMomentumOutlook?.band ?? 'unknown'}; pipeline drag ${Math.round(state.reengagementMomentumOutlook?.pipelineDrag ?? 0)}.`,
        inference: state.reengagementMomentumOutlook?.stewardNote || state.outlook,
        projection: 'Momentum blends reengagement levers with onboarding velocity — not literal return-to-work counts.'
      };
    case 'subject_wave_assembly':
      return {
        topic,
        headline: state.subjectWaveAssemblyBrief?.summary || 'Subject wave assembly unavailable.',
        fact: `Wave band ${state.subjectWaveAssemblyBrief?.band ?? 'unknown'}; wave drag ${Math.round(state.subjectWaveAssemblyBrief?.waveDrag ?? 0)}.`,
        inference: state.subjectWaveAssemblyBrief?.stewardNote || state.summary,
        projection: 'Subject wave assembly gates continuity stack for O10-168 scale-wave commits.'
      };
    case 'workforce_durability':
      return {
        topic,
        headline: state.nationalWorkforceDurabilityIndex?.summary || 'Workforce durability unavailable.',
        fact: `Durability band ${state.nationalWorkforceDurabilityIndex?.band ?? 'unknown'}; wave drag ${Math.round(state.nationalWorkforceDurabilityIndex?.waveDrag ?? 0)}.`,
        inference: state.nationalWorkforceDurabilityIndex?.stewardNote || state.summary,
        projection: 'Durability synthesizes coordination coupling, reengagement momentum, and subject wave assembly.'
      };
    case 'durability_advocacy_coupling':
      return {
        topic,
        headline: state.durabilityAdvocacyCouplingBrief?.summary || 'Durability-advocacy coupling unavailable.',
        fact: `Coupling band ${state.durabilityAdvocacyCouplingBrief?.band ?? 'unknown'}; durability drag ${Math.round(state.durabilityAdvocacyCouplingBrief?.durabilityDrag ?? 0)}.`,
        inference: state.durabilityAdvocacyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce durability with advocacy levers — bounded indices only.'
      };
    case 'mentorship_endurance':
      return {
        topic,
        headline: state.mentorshipEnduranceOutlook?.summary || 'Mentorship endurance unavailable.',
        fact: `Endurance band ${state.mentorshipEnduranceOutlook?.band ?? 'unknown'}; momentum drag ${Math.round(state.mentorshipEnduranceOutlook?.momentumDrag ?? 0)}.`,
        inference: state.mentorshipEnduranceOutlook?.stewardNote || state.outlook,
        projection: 'Endurance blends mentorship levers with reengagement momentum — not literal mentor counts.'
      };
    case 'subject_tranche_readiness':
      return {
        topic,
        headline: state.subjectTrancheReadinessBrief?.summary || 'Subject tranche readiness unavailable.',
        fact: `Tranche band ${state.subjectTrancheReadinessBrief?.band ?? 'unknown'}; tranche drag ${Math.round(state.subjectTrancheReadinessBrief?.trancheDrag ?? 0)}.`,
        inference: state.subjectTrancheReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject tranche readiness gates wave assembly against durability for O10-170 commits.'
      };
    case 'workforce_endurance':
      return {
        topic,
        headline: state.nationalWorkforceEnduranceIndex?.summary || 'Workforce endurance unavailable.',
        fact: `Endurance band ${state.nationalWorkforceEnduranceIndex?.band ?? 'unknown'}; tranche drag ${Math.round(state.nationalWorkforceEnduranceIndex?.trancheDrag ?? 0)}.`,
        inference: state.nationalWorkforceEnduranceIndex?.stewardNote || state.summary,
        projection: 'Endurance synthesizes advocacy coupling, mentorship endurance, and subject tranche readiness.'
      };
    case 'endurance_flexibility_coupling':
      return {
        topic,
        headline: state.enduranceFlexibilityCouplingBrief?.summary || 'Endurance-flexibility coupling unavailable.',
        fact: `Coupling band ${state.enduranceFlexibilityCouplingBrief?.band ?? 'unknown'}; endurance drag ${Math.round(state.enduranceFlexibilityCouplingBrief?.enduranceDrag ?? 0)}.`,
        inference: state.enduranceFlexibilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce endurance with flexibility levers — bounded indices only.'
      };
    case 'inclusion_resilience':
      return {
        topic,
        headline: state.inclusionResilienceOutlook?.summary || 'Inclusion resilience unavailable.',
        fact: `Resilience band ${state.inclusionResilienceOutlook?.band ?? 'unknown'}; endurance drag ${Math.round(state.inclusionResilienceOutlook?.enduranceDrag ?? 0)}.`,
        inference: state.inclusionResilienceOutlook?.stewardNote || state.outlook,
        projection: 'Resilience blends inclusion levers with mentorship endurance — not literal headcount.'
      };
    case 'subject_commit_readiness':
      return {
        topic,
        headline: state.subjectCommitReadinessBrief?.summary || 'Subject commit readiness unavailable.',
        fact: `Commit band ${state.subjectCommitReadinessBrief?.band ?? 'unknown'}; commit drag ${Math.round(state.subjectCommitReadinessBrief?.commitDrag ?? 0)}.`,
        inference: state.subjectCommitReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject commit readiness gates tranche against endurance for O10-173 scale commits.'
      };
    case 'workforce_tenacity':
      return {
        topic,
        headline: state.nationalWorkforceTenacityIndex?.summary || 'Workforce tenacity unavailable.',
        fact: `Tenacity band ${state.nationalWorkforceTenacityIndex?.band ?? 'unknown'}; commit drag ${Math.round(state.nationalWorkforceTenacityIndex?.commitDrag ?? 0)}.`,
        inference: state.nationalWorkforceTenacityIndex?.stewardNote || state.summary,
        projection: 'Tenacity synthesizes flexibility coupling, inclusion resilience, and subject commit readiness.'
      };
    default:
      return {
        topic: 'national_summary',
        headline: 'National labor market & demographics',
        fact: `${state.summary} ${state.automationFeedbackSummary || ''}`.trim(),
        inference: state.outlook,
        projection: state.evidence.slice(0, 2).join(' · ') || 'Stable industry-linked outlook.'
      };
  }
}
