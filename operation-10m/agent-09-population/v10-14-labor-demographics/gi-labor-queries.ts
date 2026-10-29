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
  | 'workforce_tenacity'
  | 'tenacity_care_coupling'
  | 'safety_cohesion'
  | 'subject_release_readiness'
  | 'workforce_steadfast'
  | 'steadfast_scheduling_coupling'
  | 'retention_anchor'
  | 'subject_seal_readiness'
  | 'workforce_resolve'
  | 'resolve_upskilling_coupling'
  | 'coordination_bind'
  | 'subject_bind_readiness'
  | 'workforce_fortitude'
  | 'fortitude_inclusion_coupling'
  | 'hybrid_anchor'
  | 'subject_crown_readiness'
  | 'workforce_culmination'
  | 'culmination_mentorship_coupling'
  | 'onboarding_sustain'
  | 'subject_apex_readiness'
  | 'workforce_apex'
  | 'apex_advocacy_coupling'
  | 'reengagement_thrust'
  | 'subject_pinnacle_readiness'
  | 'workforce_pinnacle'
  | 'pinnacle_retention_coupling'
  | 'retention_crest'
  | 'subject_summit_readiness'
  | 'workforce_summit'
  | 'summit_coordination_coupling'
  | 'coordination_horizon'
  | 'subject_zenith_readiness'
  | 'workforce_zenith'
  | 'zenith_flexibility_coupling'
  | 'flexibility_ascent'
  | 'subject_apogee_readiness'
  | 'workforce_apogee'
  | 'apogee_inclusion_coupling'
  | 'inclusion_orbit'
  | 'subject_orbit_readiness'
  | 'workforce_orbit'
  | 'orbit_care_coupling'
  | 'care_equilibrium'
  | 'subject_nexus_readiness'
  | 'workforce_nexus'
  | 'nexus_scheduling_coupling'
  | 'scheduling_resonance'
  | 'subject_convergence_readiness'
  | 'workforce_convergence'
  | 'convergence_safety_coupling'
  | 'safety_harmony'
  | 'subject_unification_readiness'
  | 'workforce_unification'
  | 'unification_upskilling_coupling'
  | 'upskilling_synthesis'
  | 'subject_synthesis_readiness'
  | 'workforce_synthesis'
  | 'synthesis_onboarding_coupling'
  | 'onboarding_integration'
  | 'subject_integration_readiness'
  | 'workforce_integration'
  | 'integration_retention_coupling'
  | 'retention_cohesion'
  | 'subject_retention_readiness'
  | 'workforce_retention'
  | 'retention_reengagement_coupling'
  | 'reengagement_alignment'
  | 'subject_reengagement_readiness'
  | 'workforce_reengagement'
  | 'reengagement_mentorship_coupling'
  | 'mentorship_sustain'
  | 'subject_mentorship_readiness'
  | 'workforce_mentorship'
  | 'mentorship_advocacy_coupling'
  | 'advocacy_resonance'
  | 'subject_advocacy_readiness'
  | 'workforce_advocacy'
  | 'advocacy_inclusion_coupling'
  | 'inclusion_equity'
  | 'subject_inclusion_readiness'
  | 'workforce_inclusion'
  | 'inclusion_flexibility_coupling'
  | 'flexibility_flow'
  | 'subject_flexibility_readiness'
  | 'workforce_flexibility'
  | 'flexibility_coordination_coupling'
  | 'coordination_mesh'
  | 'subject_coordination_readiness'
  | 'workforce_coordination'
  | 'coordination_scheduling_coupling'
  | 'scheduling_pulse'
  | 'subject_scheduling_readiness'
  | 'workforce_scheduling'
  | 'scheduling_safety_coupling'
  | 'safety_calibration'
  | 'subject_safety_readiness'
  | 'workforce_safety'
  | 'safety_care_coupling'
  | 'care_balance'
  | 'subject_care_readiness'
  | 'workforce_care';

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
  if (/\b(participation equity|equity gap)/.test(q)) return 'participation_equity';
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
  if (/\b(tenacity care|tenacity-care coupling)/.test(q)) return 'tenacity_care_coupling';
  if (/\b(safety cohesion|labor safety cohesion)/.test(q)) return 'safety_cohesion';
  if (/\b(subject release readiness|release readiness subject)/.test(q)) return 'subject_release_readiness';
  if (/\b(workforce steadfast|steadfast index labor)/.test(q)) return 'workforce_steadfast';
  if (/\b(steadfast scheduling|steadfast-scheduling coupling)/.test(q)) return 'steadfast_scheduling_coupling';
  if (/\b(retention anchor|labor retention anchor)/.test(q)) return 'retention_anchor';
  if (/\b(subject seal readiness|seal readiness subject)/.test(q)) return 'subject_seal_readiness';
  if (/\b(workforce resolve|resolve index labor)/.test(q)) return 'workforce_resolve';
  if (/\b(resolve upskilling|resolve-upskilling coupling)/.test(q)) return 'resolve_upskilling_coupling';
  if (/\b(coordination bind|labor coordination bind)/.test(q)) return 'coordination_bind';
  if (/\b(subject bind readiness|bind readiness subject)/.test(q)) return 'subject_bind_readiness';
  if (/\b(workforce fortitude|fortitude index labor)/.test(q)) return 'workforce_fortitude';
  if (/\b(fortitude inclusion|fortitude-inclusion coupling)/.test(q)) return 'fortitude_inclusion_coupling';
  if (/\b(hybrid anchor|hybrid work anchor)/.test(q)) return 'hybrid_anchor';
  if (/\b(subject crown readiness|crown readiness subject)/.test(q)) return 'subject_crown_readiness';
  if (/\b(workforce culmination|culmination index labor)/.test(q)) return 'workforce_culmination';
  if (/\b(culmination mentorship|culmination-mentorship coupling)/.test(q)) return 'culmination_mentorship_coupling';
  if (/\b(onboarding sustain|onboarding pipeline sustain)/.test(q)) return 'onboarding_sustain';
  if (/\b(subject apex readiness|apex readiness subject)/.test(q)) return 'subject_apex_readiness';
  if (/\b(workforce apex|apex index labor)/.test(q)) return 'workforce_apex';
  if (/\b(apex advocacy|apex-advocacy coupling)/.test(q)) return 'apex_advocacy_coupling';
  if (/\b(reengagement thrust|reengagement pipeline thrust)/.test(q)) return 'reengagement_thrust';
  if (/\b(subject pinnacle readiness|pinnacle readiness subject)/.test(q)) return 'subject_pinnacle_readiness';
  if (/\b(workforce pinnacle|pinnacle index labor)/.test(q)) return 'workforce_pinnacle';
  if (/\b(pinnacle retention|pinnacle-retention coupling)/.test(q)) return 'pinnacle_retention_coupling';
  if (/\b(retention crest|retention pipeline crest)/.test(q)) return 'retention_crest';
  if (/\b(subject summit readiness|summit readiness subject)/.test(q)) return 'subject_summit_readiness';
  if (/\b(workforce summit|summit index labor)/.test(q)) return 'workforce_summit';
  if (/\b(summit coordination|summit-coordination coupling)/.test(q)) return 'summit_coordination_coupling';
  if (/\b(coordination horizon|coordination pipeline horizon)/.test(q)) return 'coordination_horizon';
  if (/\b(subject zenith readiness|zenith readiness subject)/.test(q)) return 'subject_zenith_readiness';
  if (/\b(workforce zenith|zenith index labor)/.test(q)) return 'workforce_zenith';
  if (/\b(zenith flexibility|zenith-flexibility coupling)/.test(q)) return 'zenith_flexibility_coupling';
  if (/\b(flexibility ascent|flexibility pipeline ascent)/.test(q)) return 'flexibility_ascent';
  if (/\b(subject apogee readiness|apogee readiness subject)/.test(q)) return 'subject_apogee_readiness';
  if (/\b(workforce apogee|apogee index labor)/.test(q)) return 'workforce_apogee';
  if (/\b(apogee inclusion|apogee-inclusion coupling)/.test(q)) return 'apogee_inclusion_coupling';
  if (/\b(inclusion orbit|inclusion pipeline orbit)/.test(q)) return 'inclusion_orbit';
  if (/\b(subject orbit readiness|orbit readiness subject)/.test(q)) return 'subject_orbit_readiness';
  if (/\b(workforce orbit|orbit index labor)/.test(q)) return 'workforce_orbit';
  if (/\b(orbit care|orbit-care coupling)/.test(q)) return 'orbit_care_coupling';
  if (/\b(care equilibrium|care pipeline equilibrium)/.test(q)) return 'care_equilibrium';
  if (/\b(subject nexus readiness|nexus readiness subject)/.test(q)) return 'subject_nexus_readiness';
  if (/\b(workforce nexus|nexus index labor)/.test(q)) return 'workforce_nexus';
  if (/\b(nexus scheduling|nexus-scheduling coupling)/.test(q)) return 'nexus_scheduling_coupling';
  if (/\b(scheduling resonance|scheduling pipeline resonance)/.test(q)) return 'scheduling_resonance';
  if (/\b(subject convergence readiness|convergence readiness subject)/.test(q)) {
    return 'subject_convergence_readiness';
  }
  if (/\b(workforce convergence|convergence index labor)/.test(q)) return 'workforce_convergence';
  if (/\b(convergence safety|convergence-safety coupling)/.test(q)) return 'convergence_safety_coupling';
  if (/\b(safety harmony|safety pipeline harmony)/.test(q)) return 'safety_harmony';
  if (/\b(subject unification readiness|unification readiness subject)/.test(q)) {
    return 'subject_unification_readiness';
  }
  if (/\b(workforce unification|unification index labor)/.test(q)) return 'workforce_unification';
  if (/\b(unification upskilling|unification-upskilling coupling)/.test(q)) return 'unification_upskilling_coupling';
  if (/\b(upskilling synthesis|upskilling pipeline synthesis)/.test(q)) return 'upskilling_synthesis';
  if (/\b(subject synthesis readiness|synthesis readiness subject)/.test(q)) return 'subject_synthesis_readiness';
  if (/\b(workforce synthesis|synthesis index labor)/.test(q)) return 'workforce_synthesis';
  if (/\b(synthesis onboarding|synthesis-onboarding coupling)/.test(q)) return 'synthesis_onboarding_coupling';
  if (/\b(onboarding integration|onboarding pipeline integration)/.test(q)) return 'onboarding_integration';
  if (/\b(subject integration readiness|integration readiness subject)/.test(q)) {
    return 'subject_integration_readiness';
  }
  if (/\b(workforce integration|integration index labor)/.test(q)) return 'workforce_integration';
  if (/\b(integration retention|integration-retention coupling)/.test(q)) return 'integration_retention_coupling';
  if (/\b(retention cohesion|retention pipeline cohesion)/.test(q)) return 'retention_cohesion';
  if (/\b(subject retention readiness|retention readiness subject)/.test(q)) {
    return 'subject_retention_readiness';
  }
  if (/\b(workforce retention|retention index labor)/.test(q)) return 'workforce_retention';
  if (/\b(retention reengagement|retention-reengagement coupling)/.test(q)) return 'retention_reengagement_coupling';
  if (/\b(reengagement alignment|reengagement pipeline alignment)/.test(q)) return 'reengagement_alignment';
  if (/\b(subject reengagement readiness|reengagement readiness subject)/.test(q)) {
    return 'subject_reengagement_readiness';
  }
  if (/\b(workforce reengagement|reengagement index labor workforce)/.test(q)) return 'workforce_reengagement';
  if (/\b(reengagement mentorship|reengagement-mentorship coupling)/.test(q)) return 'reengagement_mentorship_coupling';
  if (/\b(mentorship sustain|mentorship pipeline sustain)/.test(q)) return 'mentorship_sustain';
  if (/\b(subject mentorship readiness|mentorship readiness subject)/.test(q)) {
    return 'subject_mentorship_readiness';
  }
  if (/\b(workforce mentorship|mentorship index labor workforce)/.test(q)) return 'workforce_mentorship';
  if (/\b(mentorship advocacy|mentorship-advocacy coupling)/.test(q)) return 'mentorship_advocacy_coupling';
  if (/\b(advocacy resonance|advocacy pipeline resonance)/.test(q)) return 'advocacy_resonance';
  if (/\b(subject advocacy readiness|advocacy readiness subject)/.test(q)) {
    return 'subject_advocacy_readiness';
  }
  if (/\b(workforce advocacy|advocacy index labor workforce)/.test(q)) return 'workforce_advocacy';
  if (/\b(advocacy inclusion|advocacy-inclusion coupling)/.test(q)) return 'advocacy_inclusion_coupling';
  if (/\b(inclusion equity|inclusion pipeline equity)/.test(q)) return 'inclusion_equity';
  if (/\b(subject inclusion readiness|inclusion readiness subject)/.test(q)) {
    return 'subject_inclusion_readiness';
  }
  if (/\b(workforce inclusion|inclusion index labor workforce)/.test(q)) return 'workforce_inclusion';
  if (/\b(inclusion flexibility|inclusion-flexibility coupling)/.test(q)) return 'inclusion_flexibility_coupling';
  if (/\b(flexibility flow|flexibility pipeline flow)/.test(q)) return 'flexibility_flow';
  if (/\b(subject flexibility readiness|flexibility readiness subject)/.test(q)) {
    return 'subject_flexibility_readiness';
  }
  if (/\b(workforce flexibility|flexibility index labor workforce)/.test(q)) return 'workforce_flexibility';
  if (/\b(flexibility coordination|flexibility-coordination coupling)/.test(q)) {
    return 'flexibility_coordination_coupling';
  }
  if (/\b(coordination mesh|coordination pipeline mesh)/.test(q)) return 'coordination_mesh';
  if (/\b(subject coordination readiness|coordination readiness subject)/.test(q)) {
    return 'subject_coordination_readiness';
  }
  if (/\b(workforce coordination|coordination index labor workforce)/.test(q)) return 'workforce_coordination';
  if (/\b(coordination scheduling|coordination-scheduling coupling)/.test(q)) {
    return 'coordination_scheduling_coupling';
  }
  if (/\b(scheduling pulse|scheduling pipeline pulse)/.test(q)) return 'scheduling_pulse';
  if (/\b(subject scheduling readiness|scheduling readiness subject)/.test(q)) {
    return 'subject_scheduling_readiness';
  }
  if (/\b(workforce scheduling|scheduling index labor workforce)/.test(q)) return 'workforce_scheduling';
  if (/\b(scheduling safety|scheduling-safety coupling)/.test(q)) return 'scheduling_safety_coupling';
  if (/\b(safety calibration|safety pipeline calibration)/.test(q)) return 'safety_calibration';
  if (/\b(subject safety readiness|safety readiness subject)/.test(q)) {
    return 'subject_safety_readiness';
  }
  if (/\b(workforce safety|safety index labor workforce)/.test(q)) return 'workforce_safety';
  if (/\b(safety care|safety-care coupling)/.test(q)) return 'safety_care_coupling';
  if (/\b(care balance|care pipeline balance)/.test(q)) return 'care_balance';
  if (/\b(subject care readiness|care readiness subject)/.test(q)) return 'subject_care_readiness';
  if (/\b(workforce care|care index labor workforce)/.test(q)) return 'workforce_care';
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
    case 'tenacity_care_coupling':
      return {
        topic,
        headline: state.tenacityCareCouplingBrief?.summary || 'Tenacity-care coupling unavailable.',
        fact: `Coupling band ${state.tenacityCareCouplingBrief?.band ?? 'unknown'}; tenacity drag ${Math.round(state.tenacityCareCouplingBrief?.tenacityDrag ?? 0)}.`,
        inference: state.tenacityCareCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce tenacity with care levers — bounded indices only.'
      };
    case 'safety_cohesion':
      return {
        topic,
        headline: state.safetyCohesionOutlook?.summary || 'Safety cohesion unavailable.',
        fact: `Cohesion band ${state.safetyCohesionOutlook?.band ?? 'unknown'}; resilience drag ${Math.round(state.safetyCohesionOutlook?.resilienceDrag ?? 0)}.`,
        inference: state.safetyCohesionOutlook?.stewardNote || state.outlook,
        projection: 'Cohesion blends safety levers with inclusion resilience — not literal incident counts.'
      };
    case 'subject_release_readiness':
      return {
        topic,
        headline: state.subjectReleaseReadinessBrief?.summary || 'Subject release readiness unavailable.',
        fact: `Release band ${state.subjectReleaseReadinessBrief?.band ?? 'unknown'}; release drag ${Math.round(state.subjectReleaseReadinessBrief?.releaseDrag ?? 0)}.`,
        inference: state.subjectReleaseReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject release readiness gates commit against tenacity for O10-175 scale release.'
      };
    case 'workforce_steadfast':
      return {
        topic,
        headline: state.nationalWorkforceSteadfastIndex?.summary || 'Workforce steadfast unavailable.',
        fact: `Steadfast band ${state.nationalWorkforceSteadfastIndex?.band ?? 'unknown'}; release drag ${Math.round(state.nationalWorkforceSteadfastIndex?.releaseDrag ?? 0)}.`,
        inference: state.nationalWorkforceSteadfastIndex?.stewardNote || state.summary,
        projection: 'Steadfast synthesizes care coupling, safety cohesion, and subject release readiness.'
      };
    case 'steadfast_scheduling_coupling':
      return {
        topic,
        headline: state.steadfastSchedulingCouplingBrief?.summary || 'Steadfast-scheduling coupling unavailable.',
        fact: `Coupling band ${state.steadfastSchedulingCouplingBrief?.band ?? 'unknown'}; steadfast drag ${Math.round(state.steadfastSchedulingCouplingBrief?.steadfastDrag ?? 0)}.`,
        inference: state.steadfastSchedulingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce steadfast with scheduling levers — bounded indices only.'
      };
    case 'retention_anchor':
      return {
        topic,
        headline: state.retentionAnchorOutlook?.summary || 'Retention anchor unavailable.',
        fact: `Anchor band ${state.retentionAnchorOutlook?.band ?? 'unknown'}; cohesion drag ${Math.round(state.retentionAnchorOutlook?.cohesionDrag ?? 0)}.`,
        inference: state.retentionAnchorOutlook?.stewardNote || state.outlook,
        projection: 'Anchor blends retention levers with safety cohesion — not literal headcount.'
      };
    case 'subject_seal_readiness':
      return {
        topic,
        headline: state.subjectSealReadinessBrief?.summary || 'Subject seal readiness unavailable.',
        fact: `Seal band ${state.subjectSealReadinessBrief?.band ?? 'unknown'}; seal drag ${Math.round(state.subjectSealReadinessBrief?.sealDrag ?? 0)}.`,
        inference: state.subjectSealReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject seal readiness gates release against steadfast for O10-177 wave seal.'
      };
    case 'workforce_resolve':
      return {
        topic,
        headline: state.nationalWorkforceResolveIndex?.summary || 'Workforce resolve unavailable.',
        fact: `Resolve band ${state.nationalWorkforceResolveIndex?.band ?? 'unknown'}; seal drag ${Math.round(state.nationalWorkforceResolveIndex?.sealDrag ?? 0)}.`,
        inference: state.nationalWorkforceResolveIndex?.stewardNote || state.summary,
        projection: 'Resolve synthesizes scheduling coupling, retention anchor, and subject seal readiness.'
      };
    case 'resolve_upskilling_coupling':
      return {
        topic,
        headline: state.resolveUpskillingCouplingBrief?.summary || 'Resolve-upskilling coupling unavailable.',
        fact: `Coupling band ${state.resolveUpskillingCouplingBrief?.band ?? 'unknown'}; resolve drag ${Math.round(state.resolveUpskillingCouplingBrief?.resolveDrag ?? 0)}.`,
        inference: state.resolveUpskillingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce resolve with upskilling velocity and program levers.'
      };
    case 'coordination_bind':
      return {
        topic,
        headline: state.coordinationBindOutlook?.summary || 'Coordination bind unavailable.',
        fact: `Bind band ${state.coordinationBindOutlook?.band ?? 'unknown'}; scheduling drag ${Math.round(state.coordinationBindOutlook?.schedulingDrag ?? 0)}.`,
        inference: state.coordinationBindOutlook?.stewardNote || state.outlook,
        projection: 'Bind blends coordination levers with steadfast-scheduling coupling.'
      };
    case 'subject_bind_readiness':
      return {
        topic,
        headline: state.subjectBindReadinessBrief?.summary || 'Subject bind readiness unavailable.',
        fact: `Bind band ${state.subjectBindReadinessBrief?.band ?? 'unknown'}; bind drag ${Math.round(state.subjectBindReadinessBrief?.bindDrag ?? 0)}.`,
        inference: state.subjectBindReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject bind readiness gates seal against resolve for O10-179 wave bind.'
      };
    case 'workforce_fortitude':
      return {
        topic,
        headline: state.nationalWorkforceFortitudeIndex?.summary || 'Workforce fortitude unavailable.',
        fact: `Fortitude band ${state.nationalWorkforceFortitudeIndex?.band ?? 'unknown'}; bind drag ${Math.round(state.nationalWorkforceFortitudeIndex?.bindDrag ?? 0)}.`,
        inference: state.nationalWorkforceFortitudeIndex?.stewardNote || state.summary,
        projection: 'Fortitude synthesizes upskilling coupling, coordination bind, and subject bind readiness.'
      };
    case 'fortitude_inclusion_coupling':
      return {
        topic,
        headline: state.fortitudeInclusionCouplingBrief?.summary || 'Fortitude-inclusion coupling unavailable.',
        fact: `Coupling band ${state.fortitudeInclusionCouplingBrief?.band ?? 'unknown'}; fortitude drag ${Math.round(state.fortitudeInclusionCouplingBrief?.fortitudeDrag ?? 0)}.`,
        inference: state.fortitudeInclusionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce fortitude with inclusion levers — bounded indices only.'
      };
    case 'hybrid_anchor':
      return {
        topic,
        headline: state.hybridAnchorOutlook?.summary || 'Hybrid anchor unavailable.',
        fact: `Anchor band ${state.hybridAnchorOutlook?.band ?? 'unknown'}; bind drag ${Math.round(state.hybridAnchorOutlook?.bindDrag ?? 0)}.`,
        inference: state.hybridAnchorOutlook?.stewardNote || state.outlook,
        projection: 'Hybrid anchor blends flexibility levers with coordination bind depth.'
      };
    case 'subject_crown_readiness':
      return {
        topic,
        headline: state.subjectCrownReadinessBrief?.summary || 'Subject crown readiness unavailable.',
        fact: `Crown band ${state.subjectCrownReadinessBrief?.band ?? 'unknown'}; crown drag ${Math.round(state.subjectCrownReadinessBrief?.crownDrag ?? 0)}.`,
        inference: state.subjectCrownReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject crown readiness gates bind against fortitude for O10-181 wave culmination.'
      };
    case 'workforce_culmination':
      return {
        topic,
        headline: state.nationalWorkforceCulminationIndex?.summary || 'Workforce culmination unavailable.',
        fact: `Culmination band ${state.nationalWorkforceCulminationIndex?.band ?? 'unknown'}; crown drag ${Math.round(state.nationalWorkforceCulminationIndex?.crownDrag ?? 0)}.`,
        inference: state.nationalWorkforceCulminationIndex?.stewardNote || state.summary,
        projection: 'Culmination synthesizes inclusion coupling, hybrid anchor, and subject crown for Agent 25 merge.'
      };
    case 'culmination_mentorship_coupling':
      return {
        topic,
        headline: state.culminationMentorshipCouplingBrief?.summary || 'Culmination-mentorship coupling unavailable.',
        fact: `Coupling band ${state.culminationMentorshipCouplingBrief?.band ?? 'unknown'}; culmination drag ${Math.round(state.culminationMentorshipCouplingBrief?.culminationDrag ?? 0)}.`,
        inference: state.culminationMentorshipCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce culmination with mentorship levers — wave 26 / O10-183 depth.'
      };
    case 'onboarding_sustain':
      return {
        topic,
        headline: state.onboardingSustainOutlook?.summary || 'Onboarding sustain unavailable.',
        fact: `Sustain band ${state.onboardingSustainOutlook?.band ?? 'unknown'}; anchor drag ${Math.round(state.onboardingSustainOutlook?.anchorDrag ?? 0)}.`,
        inference: state.onboardingSustainOutlook?.stewardNote || state.outlook,
        projection: 'Onboarding sustain blends onboarding levers with hybrid anchor — bounded indices only.'
      };
    case 'subject_apex_readiness':
      return {
        topic,
        headline: state.subjectApexReadinessBrief?.summary || 'Subject apex readiness unavailable.',
        fact: `Apex band ${state.subjectApexReadinessBrief?.band ?? 'unknown'}; apex drag ${Math.round(state.subjectApexReadinessBrief?.apexDrag ?? 0)}.`,
        inference: state.subjectApexReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject apex readiness gates crown against culmination for O10-183 wave 26.'
      };
    case 'workforce_apex':
      return {
        topic,
        headline: state.nationalWorkforceApexIndex?.summary || 'Workforce apex unavailable.',
        fact: `Apex band ${state.nationalWorkforceApexIndex?.band ?? 'unknown'}; apex drag ${Math.round(state.nationalWorkforceApexIndex?.apexDrag ?? 0)}.`,
        inference: state.nationalWorkforceApexIndex?.stewardNote || state.summary,
        projection: 'Workforce apex synthesizes mentorship coupling, onboarding sustain, and subject apex readiness.'
      };
    case 'apex_advocacy_coupling':
      return {
        topic,
        headline: state.apexAdvocacyCouplingBrief?.summary || 'Apex-advocacy coupling unavailable.',
        fact: `Coupling band ${state.apexAdvocacyCouplingBrief?.band ?? 'unknown'}; apex drag ${Math.round(state.apexAdvocacyCouplingBrief?.apexDrag ?? 0)}.`,
        inference: state.apexAdvocacyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce apex with advocacy levers — wave 27 / O10-185 depth.'
      };
    case 'reengagement_thrust':
      return {
        topic,
        headline: state.reengagementThrustOutlook?.summary || 'Reengagement thrust unavailable.',
        fact: `Thrust band ${state.reengagementThrustOutlook?.band ?? 'unknown'}; sustain drag ${Math.round(state.reengagementThrustOutlook?.sustainDrag ?? 0)}.`,
        inference: state.reengagementThrustOutlook?.stewardNote || state.outlook,
        projection: 'Thrust blends reengagement levers with onboarding sustain — bounded indices only.'
      };
    case 'subject_pinnacle_readiness':
      return {
        topic,
        headline: state.subjectPinnacleReadinessBrief?.summary || 'Subject pinnacle readiness unavailable.',
        fact: `Pinnacle band ${state.subjectPinnacleReadinessBrief?.band ?? 'unknown'}; pinnacle drag ${Math.round(state.subjectPinnacleReadinessBrief?.pinnacleDrag ?? 0)}.`,
        inference: state.subjectPinnacleReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject pinnacle readiness gates subject apex against workforce apex for O10-185 wave 27.'
      };
    case 'workforce_pinnacle':
      return {
        topic,
        headline: state.nationalWorkforcePinnacleIndex?.summary || 'Workforce pinnacle unavailable.',
        fact: `Pinnacle band ${state.nationalWorkforcePinnacleIndex?.band ?? 'unknown'}; pinnacle drag ${Math.round(state.nationalWorkforcePinnacleIndex?.pinnacleDrag ?? 0)}.`,
        inference: state.nationalWorkforcePinnacleIndex?.stewardNote || state.summary,
        projection: 'Workforce pinnacle synthesizes advocacy coupling, reengagement thrust, and subject pinnacle.'
      };
    case 'pinnacle_retention_coupling':
      return {
        topic,
        headline: state.pinnacleRetentionCouplingBrief?.summary || 'Pinnacle-retention coupling unavailable.',
        fact: `Coupling band ${state.pinnacleRetentionCouplingBrief?.band ?? 'unknown'}; pinnacle drag ${Math.round(state.pinnacleRetentionCouplingBrief?.pinnacleDrag ?? 0)}.`,
        inference: state.pinnacleRetentionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce pinnacle with retention levers — wave 28 / O10-187 depth.'
      };
    case 'retention_crest':
      return {
        topic,
        headline: state.retentionCrestOutlook?.summary || 'Retention crest unavailable.',
        fact: `Crest band ${state.retentionCrestOutlook?.band ?? 'unknown'}; thrust drag ${Math.round(state.retentionCrestOutlook?.thrustDrag ?? 0)}.`,
        inference: state.retentionCrestOutlook?.stewardNote || state.outlook,
        projection: 'Crest blends retention levers with reengagement thrust — bounded indices only.'
      };
    case 'subject_summit_readiness':
      return {
        topic,
        headline: state.subjectSummitReadinessBrief?.summary || 'Subject summit readiness unavailable.',
        fact: `Summit band ${state.subjectSummitReadinessBrief?.band ?? 'unknown'}; summit drag ${Math.round(state.subjectSummitReadinessBrief?.summitDrag ?? 0)}.`,
        inference: state.subjectSummitReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject summit readiness gates subject pinnacle against workforce pinnacle for O10-187 wave 28.'
      };
    case 'workforce_summit':
      return {
        topic,
        headline: state.nationalWorkforceSummitIndex?.summary || 'Workforce summit unavailable.',
        fact: `Summit band ${state.nationalWorkforceSummitIndex?.band ?? 'unknown'}; summit drag ${Math.round(state.nationalWorkforceSummitIndex?.summitDrag ?? 0)}.`,
        inference: state.nationalWorkforceSummitIndex?.stewardNote || state.summary,
        projection: 'Workforce summit synthesizes retention coupling, retention crest, and subject summit.'
      };
    case 'summit_coordination_coupling':
      return {
        topic,
        headline: state.summitCoordinationCouplingBrief?.summary || 'Summit-coordination coupling unavailable.',
        fact: `Coupling band ${state.summitCoordinationCouplingBrief?.band ?? 'unknown'}; summit drag ${Math.round(state.summitCoordinationCouplingBrief?.summitDrag ?? 0)}.`,
        inference: state.summitCoordinationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce summit with coordination levers — wave 29 / O10-189 depth.'
      };
    case 'coordination_horizon':
      return {
        topic,
        headline: state.coordinationHorizonOutlook?.summary || 'Coordination horizon unavailable.',
        fact: `Horizon band ${state.coordinationHorizonOutlook?.band ?? 'unknown'}; crest drag ${Math.round(state.coordinationHorizonOutlook?.crestDrag ?? 0)}.`,
        inference: state.coordinationHorizonOutlook?.stewardNote || state.outlook,
        projection: 'Horizon blends coordination levers with retention crest — bounded indices only.'
      };
    case 'subject_zenith_readiness':
      return {
        topic,
        headline: state.subjectZenithReadinessBrief?.summary || 'Subject zenith readiness unavailable.',
        fact: `Zenith band ${state.subjectZenithReadinessBrief?.band ?? 'unknown'}; zenith drag ${Math.round(state.subjectZenithReadinessBrief?.zenithDrag ?? 0)}.`,
        inference: state.subjectZenithReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject zenith readiness gates subject summit against workforce summit for O10-189 wave 29.'
      };
    case 'workforce_zenith':
      return {
        topic,
        headline: state.nationalWorkforceZenithIndex?.summary || 'Workforce zenith unavailable.',
        fact: `Zenith band ${state.nationalWorkforceZenithIndex?.band ?? 'unknown'}; zenith drag ${Math.round(state.nationalWorkforceZenithIndex?.zenithDrag ?? 0)}.`,
        inference: state.nationalWorkforceZenithIndex?.stewardNote || state.summary,
        projection: 'Workforce zenith synthesizes coordination coupling, coordination horizon, and subject zenith.'
      };
    case 'zenith_flexibility_coupling':
      return {
        topic,
        headline: state.zenithFlexibilityCouplingBrief?.summary || 'Zenith-flexibility coupling unavailable.',
        fact: `Coupling band ${state.zenithFlexibilityCouplingBrief?.band ?? 'unknown'}; zenith drag ${Math.round(state.zenithFlexibilityCouplingBrief?.zenithDrag ?? 0)}.`,
        inference: state.zenithFlexibilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce zenith with flexibility levers — wave 30 / O10-191 depth.'
      };
    case 'flexibility_ascent':
      return {
        topic,
        headline: state.flexibilityAscentOutlook?.summary || 'Flexibility ascent unavailable.',
        fact: `Ascent band ${state.flexibilityAscentOutlook?.band ?? 'unknown'}; horizon drag ${Math.round(state.flexibilityAscentOutlook?.horizonDrag ?? 0)}.`,
        inference: state.flexibilityAscentOutlook?.stewardNote || state.outlook,
        projection: 'Ascent blends flexibility levers with coordination horizon — bounded indices only.'
      };
    case 'subject_apogee_readiness':
      return {
        topic,
        headline: state.subjectApogeeReadinessBrief?.summary || 'Subject apogee readiness unavailable.',
        fact: `Apogee band ${state.subjectApogeeReadinessBrief?.band ?? 'unknown'}; apogee drag ${Math.round(state.subjectApogeeReadinessBrief?.apogeeDrag ?? 0)}.`,
        inference: state.subjectApogeeReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject apogee readiness gates subject zenith against workforce zenith for O10-191 wave 30.'
      };
    case 'workforce_apogee':
      return {
        topic,
        headline: state.nationalWorkforceApogeeIndex?.summary || 'Workforce apogee unavailable.',
        fact: `Apogee band ${state.nationalWorkforceApogeeIndex?.band ?? 'unknown'}; apogee drag ${Math.round(state.nationalWorkforceApogeeIndex?.apogeeDrag ?? 0)}.`,
        inference: state.nationalWorkforceApogeeIndex?.stewardNote || state.summary,
        projection: 'Workforce apogee synthesizes flexibility coupling, flexibility ascent, and subject apogee.'
      };
    case 'apogee_inclusion_coupling':
      return {
        topic,
        headline: state.apogeeInclusionCouplingBrief?.summary || 'Apogee-inclusion coupling unavailable.',
        fact: `Coupling band ${state.apogeeInclusionCouplingBrief?.band ?? 'unknown'}; apogee drag ${Math.round(state.apogeeInclusionCouplingBrief?.apogeeDrag ?? 0)}.`,
        inference: state.apogeeInclusionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce apogee with inclusion levers — wave 31 / O10-193 depth.'
      };
    case 'inclusion_orbit':
      return {
        topic,
        headline: state.inclusionOrbitOutlook?.summary || 'Inclusion orbit unavailable.',
        fact: `Orbit band ${state.inclusionOrbitOutlook?.band ?? 'unknown'}; ascent drag ${Math.round(state.inclusionOrbitOutlook?.ascentDrag ?? 0)}.`,
        inference: state.inclusionOrbitOutlook?.stewardNote || state.outlook,
        projection: 'Orbit blends inclusion levers with flexibility ascent — bounded indices only.'
      };
    case 'subject_orbit_readiness':
      return {
        topic,
        headline: state.subjectOrbitReadinessBrief?.summary || 'Subject orbit readiness unavailable.',
        fact: `Orbit band ${state.subjectOrbitReadinessBrief?.band ?? 'unknown'}; orbit drag ${Math.round(state.subjectOrbitReadinessBrief?.orbitDrag ?? 0)}.`,
        inference: state.subjectOrbitReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject orbit readiness gates subject apogee against workforce apogee for O10-193 wave 31.'
      };
    case 'workforce_orbit':
      return {
        topic,
        headline: state.nationalWorkforceOrbitIndex?.summary || 'Workforce orbit unavailable.',
        fact: `Orbit band ${state.nationalWorkforceOrbitIndex?.band ?? 'unknown'}; orbit drag ${Math.round(state.nationalWorkforceOrbitIndex?.orbitDrag ?? 0)}.`,
        inference: state.nationalWorkforceOrbitIndex?.stewardNote || state.summary,
        projection: 'Workforce orbit synthesizes inclusion coupling, inclusion orbit, and subject orbit.'
      };
    case 'orbit_care_coupling':
      return {
        topic,
        headline: state.orbitCareCouplingBrief?.summary || 'Orbit-care coupling unavailable.',
        fact: `Coupling band ${state.orbitCareCouplingBrief?.band ?? 'unknown'}; orbit drag ${Math.round(state.orbitCareCouplingBrief?.orbitDrag ?? 0)}.`,
        inference: state.orbitCareCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce orbit with care levers — wave 32 / O10-195 depth.'
      };
    case 'care_equilibrium':
      return {
        topic,
        headline: state.careEquilibriumOutlook?.summary || 'Care equilibrium unavailable.',
        fact: `Equilibrium band ${state.careEquilibriumOutlook?.band ?? 'unknown'}; orbit drag ${Math.round(state.careEquilibriumOutlook?.orbitDrag ?? 0)}.`,
        inference: state.careEquilibriumOutlook?.stewardNote || state.outlook,
        projection: 'Equilibrium blends care levers with inclusion orbit — bounded indices only.'
      };
    case 'subject_nexus_readiness':
      return {
        topic,
        headline: state.subjectNexusReadinessBrief?.summary || 'Subject nexus readiness unavailable.',
        fact: `Nexus band ${state.subjectNexusReadinessBrief?.band ?? 'unknown'}; nexus drag ${Math.round(state.subjectNexusReadinessBrief?.nexusDrag ?? 0)}.`,
        inference: state.subjectNexusReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject nexus readiness gates subject orbit against workforce orbit for O10-195 wave 32.'
      };
    case 'workforce_nexus':
      return {
        topic,
        headline: state.nationalWorkforceNexusIndex?.summary || 'Workforce nexus unavailable.',
        fact: `Nexus band ${state.nationalWorkforceNexusIndex?.band ?? 'unknown'}; nexus drag ${Math.round(state.nationalWorkforceNexusIndex?.nexusDrag ?? 0)}.`,
        inference: state.nationalWorkforceNexusIndex?.stewardNote || state.summary,
        projection: 'Workforce nexus synthesizes care coupling, care equilibrium, and subject nexus.'
      };
    case 'nexus_scheduling_coupling':
      return {
        topic,
        headline: state.nexusSchedulingCouplingBrief?.summary || 'Nexus-scheduling coupling unavailable.',
        fact: `Coupling band ${state.nexusSchedulingCouplingBrief?.band ?? 'unknown'}; nexus drag ${Math.round(state.nexusSchedulingCouplingBrief?.nexusDrag ?? 0)}.`,
        inference: state.nexusSchedulingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce nexus with scheduling levers — wave 33 / O10-197 depth.'
      };
    case 'scheduling_resonance':
      return {
        topic,
        headline: state.schedulingResonanceOutlook?.summary || 'Scheduling resonance unavailable.',
        fact: `Resonance band ${state.schedulingResonanceOutlook?.band ?? 'unknown'}; equilibrium drag ${Math.round(state.schedulingResonanceOutlook?.equilibriumDrag ?? 0)}.`,
        inference: state.schedulingResonanceOutlook?.stewardNote || state.outlook,
        projection: 'Resonance blends scheduling levers with care equilibrium — bounded indices only.'
      };
    case 'subject_convergence_readiness':
      return {
        topic,
        headline: state.subjectConvergenceReadinessBrief?.summary || 'Subject convergence readiness unavailable.',
        fact: `Convergence band ${state.subjectConvergenceReadinessBrief?.band ?? 'unknown'}; convergence drag ${Math.round(state.subjectConvergenceReadinessBrief?.convergenceDrag ?? 0)}.`,
        inference: state.subjectConvergenceReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject convergence readiness gates subject nexus against workforce nexus for O10-197 wave 33.'
      };
    case 'workforce_convergence':
      return {
        topic,
        headline: state.nationalWorkforceConvergenceIndex?.summary || 'Workforce convergence unavailable.',
        fact: `Convergence band ${state.nationalWorkforceConvergenceIndex?.band ?? 'unknown'}; convergence drag ${Math.round(state.nationalWorkforceConvergenceIndex?.convergenceDrag ?? 0)}.`,
        inference: state.nationalWorkforceConvergenceIndex?.stewardNote || state.summary,
        projection: 'Workforce convergence synthesizes scheduling coupling, scheduling resonance, and subject convergence.'
      };
    case 'convergence_safety_coupling':
      return {
        topic,
        headline: state.convergenceSafetyCouplingBrief?.summary || 'Convergence-safety coupling unavailable.',
        fact: `Coupling band ${state.convergenceSafetyCouplingBrief?.band ?? 'unknown'}; convergence drag ${Math.round(state.convergenceSafetyCouplingBrief?.convergenceDrag ?? 0)}.`,
        inference: state.convergenceSafetyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce convergence with safety levers — wave 34 / O10-199 depth.'
      };
    case 'safety_harmony':
      return {
        topic,
        headline: state.safetyHarmonyOutlook?.summary || 'Safety harmony unavailable.',
        fact: `Harmony band ${state.safetyHarmonyOutlook?.band ?? 'unknown'}; resonance drag ${Math.round(state.safetyHarmonyOutlook?.resonanceDrag ?? 0)}.`,
        inference: state.safetyHarmonyOutlook?.stewardNote || state.outlook,
        projection: 'Harmony blends safety levers with scheduling resonance — bounded indices only.'
      };
    case 'subject_unification_readiness':
      return {
        topic,
        headline: state.subjectUnificationReadinessBrief?.summary || 'Subject unification readiness unavailable.',
        fact: `Unification band ${state.subjectUnificationReadinessBrief?.band ?? 'unknown'}; unification drag ${Math.round(state.subjectUnificationReadinessBrief?.unificationDrag ?? 0)}.`,
        inference: state.subjectUnificationReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject unification readiness gates subject convergence against workforce convergence for O10-199 wave 34.'
      };
    case 'workforce_unification':
      return {
        topic,
        headline: state.nationalWorkforceUnificationIndex?.summary || 'Workforce unification unavailable.',
        fact: `Unification band ${state.nationalWorkforceUnificationIndex?.band ?? 'unknown'}; unification drag ${Math.round(state.nationalWorkforceUnificationIndex?.unificationDrag ?? 0)}.`,
        inference: state.nationalWorkforceUnificationIndex?.stewardNote || state.summary,
        projection: 'Workforce unification synthesizes safety coupling, safety harmony, and subject unification.'
      };
    case 'unification_upskilling_coupling':
      return {
        topic,
        headline: state.unificationUpskillingCouplingBrief?.summary || 'Unification-upskilling coupling unavailable.',
        fact: `Coupling band ${state.unificationUpskillingCouplingBrief?.band ?? 'unknown'}; unification drag ${Math.round(state.unificationUpskillingCouplingBrief?.unificationDrag ?? 0)}.`,
        inference: state.unificationUpskillingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce unification with upskilling programs — wave 35 / O10-201 depth.'
      };
    case 'upskilling_synthesis':
      return {
        topic,
        headline: state.upskillingSynthesisOutlook?.summary || 'Upskilling synthesis unavailable.',
        fact: `Synthesis band ${state.upskillingSynthesisOutlook?.band ?? 'unknown'}; harmony drag ${Math.round(state.upskillingSynthesisOutlook?.harmonyDrag ?? 0)}.`,
        inference: state.upskillingSynthesisOutlook?.stewardNote || state.outlook,
        projection: 'Synthesis blends upskilling programs with safety harmony — bounded indices only.'
      };
    case 'subject_synthesis_readiness':
      return {
        topic,
        headline: state.subjectSynthesisReadinessBrief?.summary || 'Subject synthesis readiness unavailable.',
        fact: `Synthesis band ${state.subjectSynthesisReadinessBrief?.band ?? 'unknown'}; synthesis drag ${Math.round(state.subjectSynthesisReadinessBrief?.synthesisDrag ?? 0)}.`,
        inference: state.subjectSynthesisReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject synthesis readiness gates subject unification against workforce unification for O10-201 wave 35.'
      };
    case 'workforce_synthesis':
      return {
        topic,
        headline: state.nationalWorkforceSynthesisIndex?.summary || 'Workforce synthesis unavailable.',
        fact: `Synthesis band ${state.nationalWorkforceSynthesisIndex?.band ?? 'unknown'}; synthesis drag ${Math.round(state.nationalWorkforceSynthesisIndex?.synthesisDrag ?? 0)}.`,
        inference: state.nationalWorkforceSynthesisIndex?.stewardNote || state.summary,
        projection: 'Workforce synthesis synthesizes upskilling coupling, upskilling synthesis, and subject synthesis.'
      };
    case 'synthesis_onboarding_coupling':
      return {
        topic,
        headline: state.synthesisOnboardingCouplingBrief?.summary || 'Synthesis-onboarding coupling unavailable.',
        fact: `Coupling band ${state.synthesisOnboardingCouplingBrief?.band ?? 'unknown'}; synthesis drag ${Math.round(state.synthesisOnboardingCouplingBrief?.synthesisDrag ?? 0)}.`,
        inference: state.synthesisOnboardingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce synthesis with onboarding levers — wave 36 / O10-203 depth.'
      };
    case 'onboarding_integration':
      return {
        topic,
        headline: state.onboardingIntegrationOutlook?.summary || 'Onboarding integration unavailable.',
        fact: `Integration band ${state.onboardingIntegrationOutlook?.band ?? 'unknown'}; synthesis drag ${Math.round(state.onboardingIntegrationOutlook?.synthesisDrag ?? 0)}.`,
        inference: state.onboardingIntegrationOutlook?.stewardNote || state.outlook,
        projection: 'Integration blends onboarding levers with upskilling synthesis — bounded indices only.'
      };
    case 'subject_integration_readiness':
      return {
        topic,
        headline: state.subjectIntegrationReadinessBrief?.summary || 'Subject integration readiness unavailable.',
        fact: `Integration band ${state.subjectIntegrationReadinessBrief?.band ?? 'unknown'}; integration drag ${Math.round(state.subjectIntegrationReadinessBrief?.integrationDrag ?? 0)}.`,
        inference: state.subjectIntegrationReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject integration readiness gates subject synthesis against workforce synthesis for O10-203 wave 36.'
      };
    case 'workforce_integration':
      return {
        topic,
        headline: state.nationalWorkforceIntegrationIndex?.summary || 'Workforce integration unavailable.',
        fact: `Integration band ${state.nationalWorkforceIntegrationIndex?.band ?? 'unknown'}; integration drag ${Math.round(state.nationalWorkforceIntegrationIndex?.integrationDrag ?? 0)}.`,
        inference: state.nationalWorkforceIntegrationIndex?.stewardNote || state.summary,
        projection: 'Workforce integration synthesizes onboarding coupling, onboarding integration, and subject integration.'
      };
    case 'integration_retention_coupling':
      return {
        topic,
        headline: state.integrationRetentionCouplingBrief?.summary || 'Integration-retention coupling unavailable.',
        fact: `Coupling band ${state.integrationRetentionCouplingBrief?.band ?? 'unknown'}; integration drag ${Math.round(state.integrationRetentionCouplingBrief?.integrationDrag ?? 0)}.`,
        inference: state.integrationRetentionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce integration with retention levers — wave 37 / O10-205 depth.'
      };
    case 'retention_cohesion':
      return {
        topic,
        headline: state.retentionCohesionOutlook?.summary || 'Retention cohesion unavailable.',
        fact: `Cohesion band ${state.retentionCohesionOutlook?.band ?? 'unknown'}; integration drag ${Math.round(state.retentionCohesionOutlook?.integrationDrag ?? 0)}.`,
        inference: state.retentionCohesionOutlook?.stewardNote || state.outlook,
        projection: 'Cohesion blends retention levers with onboarding integration — bounded indices only.'
      };
    case 'subject_retention_readiness':
      return {
        topic,
        headline: state.subjectRetentionReadinessBrief?.summary || 'Subject retention readiness unavailable.',
        fact: `Retention band ${state.subjectRetentionReadinessBrief?.band ?? 'unknown'}; retention drag ${Math.round(state.subjectRetentionReadinessBrief?.retentionDrag ?? 0)}.`,
        inference: state.subjectRetentionReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject retention readiness gates subject integration against workforce integration for O10-205 wave 37.'
      };
    case 'workforce_retention':
      return {
        topic,
        headline: state.nationalWorkforceRetentionIndex?.summary || 'Workforce retention unavailable.',
        fact: `Retention band ${state.nationalWorkforceRetentionIndex?.band ?? 'unknown'}; retention drag ${Math.round(state.nationalWorkforceRetentionIndex?.retentionDrag ?? 0)}.`,
        inference: state.nationalWorkforceRetentionIndex?.stewardNote || state.summary,
        projection: 'Workforce retention synthesizes integration-retention coupling, retention cohesion, and subject retention.'
      };
    case 'retention_reengagement_coupling':
      return {
        topic,
        headline: state.retentionReengagementCouplingBrief?.summary || 'Retention-reengagement coupling unavailable.',
        fact: `Coupling band ${state.retentionReengagementCouplingBrief?.band ?? 'unknown'}; retention drag ${Math.round(state.retentionReengagementCouplingBrief?.retentionDrag ?? 0)}.`,
        inference: state.retentionReengagementCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce retention with reengagement levers — wave 38 / O10-207 depth.'
      };
    case 'reengagement_alignment':
      return {
        topic,
        headline: state.reengagementAlignmentOutlook?.summary || 'Reengagement alignment unavailable.',
        fact: `Alignment band ${state.reengagementAlignmentOutlook?.band ?? 'unknown'}; retention drag ${Math.round(state.reengagementAlignmentOutlook?.retentionDrag ?? 0)}.`,
        inference: state.reengagementAlignmentOutlook?.stewardNote || state.outlook,
        projection: 'Alignment blends reengagement levers with retention cohesion — bounded indices only.'
      };
    case 'subject_reengagement_readiness':
      return {
        topic,
        headline: state.subjectReengagementReadinessBrief?.summary || 'Subject reengagement readiness unavailable.',
        fact: `Reengagement band ${state.subjectReengagementReadinessBrief?.band ?? 'unknown'}; reengagement drag ${Math.round(state.subjectReengagementReadinessBrief?.reengagementDrag ?? 0)}.`,
        inference: state.subjectReengagementReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject reengagement readiness gates subject retention against workforce retention for O10-207 wave 38.'
      };
    case 'workforce_reengagement':
      return {
        topic,
        headline: state.nationalWorkforceReengagementIndex?.summary || 'Workforce reengagement unavailable.',
        fact: `Reengagement band ${state.nationalWorkforceReengagementIndex?.band ?? 'unknown'}; reengagement drag ${Math.round(state.nationalWorkforceReengagementIndex?.reengagementDrag ?? 0)}.`,
        inference: state.nationalWorkforceReengagementIndex?.stewardNote || state.summary,
        projection: 'Workforce reengagement synthesizes retention-reengagement coupling, reengagement alignment, and subject reengagement.'
      };
    case 'reengagement_mentorship_coupling':
      return {
        topic,
        headline: state.reengagementMentorshipCouplingBrief?.summary || 'Reengagement-mentorship coupling unavailable.',
        fact: `Coupling band ${state.reengagementMentorshipCouplingBrief?.band ?? 'unknown'}; reengagement drag ${Math.round(state.reengagementMentorshipCouplingBrief?.reengagementDrag ?? 0)}.`,
        inference: state.reengagementMentorshipCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce reengagement with mentorship levers — wave 39 / O10-209 depth.'
      };
    case 'mentorship_sustain':
      return {
        topic,
        headline: state.mentorshipSustainOutlook?.summary || 'Mentorship sustain unavailable.',
        fact: `Sustain band ${state.mentorshipSustainOutlook?.band ?? 'unknown'}; reengagement drag ${Math.round(state.mentorshipSustainOutlook?.reengagementDrag ?? 0)}.`,
        inference: state.mentorshipSustainOutlook?.stewardNote || state.outlook,
        projection: 'Sustain blends mentorship levers with reengagement alignment — bounded indices only.'
      };
    case 'subject_mentorship_readiness':
      return {
        topic,
        headline: state.subjectMentorshipReadinessBrief?.summary || 'Subject mentorship readiness unavailable.',
        fact: `Mentorship band ${state.subjectMentorshipReadinessBrief?.band ?? 'unknown'}; mentorship drag ${Math.round(state.subjectMentorshipReadinessBrief?.mentorshipDrag ?? 0)}.`,
        inference: state.subjectMentorshipReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject mentorship readiness gates subject reengagement against workforce reengagement for O10-209 wave 39.'
      };
    case 'workforce_mentorship':
      return {
        topic,
        headline: state.nationalWorkforceMentorshipIndex?.summary || 'Workforce mentorship unavailable.',
        fact: `Mentorship band ${state.nationalWorkforceMentorshipIndex?.band ?? 'unknown'}; mentorship drag ${Math.round(state.nationalWorkforceMentorshipIndex?.mentorshipDrag ?? 0)}.`,
        inference: state.nationalWorkforceMentorshipIndex?.stewardNote || state.summary,
        projection: 'Workforce mentorship synthesizes reengagement-mentorship coupling, mentorship sustain, and subject mentorship.'
      };
    case 'mentorship_advocacy_coupling':
      return {
        topic,
        headline: state.mentorshipAdvocacyCouplingBrief?.summary || 'Mentorship-advocacy coupling unavailable.',
        fact: `Coupling band ${state.mentorshipAdvocacyCouplingBrief?.band ?? 'unknown'}; mentorship drag ${Math.round(state.mentorshipAdvocacyCouplingBrief?.mentorshipDrag ?? 0)}.`,
        inference: state.mentorshipAdvocacyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce mentorship with advocacy levers — wave 40 / O10-211 depth.'
      };
    case 'advocacy_resonance':
      return {
        topic,
        headline: state.advocacyResonanceOutlook?.summary || 'Advocacy resonance unavailable.',
        fact: `Resonance band ${state.advocacyResonanceOutlook?.band ?? 'unknown'}; mentorship drag ${Math.round(state.advocacyResonanceOutlook?.mentorshipDrag ?? 0)}.`,
        inference: state.advocacyResonanceOutlook?.stewardNote || state.outlook,
        projection: 'Resonance blends advocacy levers with mentorship sustain — bounded indices only.'
      };
    case 'subject_advocacy_readiness':
      return {
        topic,
        headline: state.subjectAdvocacyReadinessBrief?.summary || 'Subject advocacy readiness unavailable.',
        fact: `Advocacy band ${state.subjectAdvocacyReadinessBrief?.band ?? 'unknown'}; advocacy drag ${Math.round(state.subjectAdvocacyReadinessBrief?.advocacyDrag ?? 0)}.`,
        inference: state.subjectAdvocacyReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject advocacy readiness gates subject mentorship against workforce mentorship for O10-211 wave 40.'
      };
    case 'workforce_advocacy':
      return {
        topic,
        headline: state.nationalWorkforceAdvocacyIndex?.summary || 'Workforce advocacy unavailable.',
        fact: `Advocacy band ${state.nationalWorkforceAdvocacyIndex?.band ?? 'unknown'}; advocacy drag ${Math.round(state.nationalWorkforceAdvocacyIndex?.advocacyDrag ?? 0)}.`,
        inference: state.nationalWorkforceAdvocacyIndex?.stewardNote || state.summary,
        projection: 'Workforce advocacy synthesizes mentorship-advocacy coupling, advocacy resonance, and subject advocacy.'
      };
    case 'advocacy_inclusion_coupling':
      return {
        topic,
        headline: state.advocacyInclusionCouplingBrief?.summary || 'Advocacy-inclusion coupling unavailable.',
        fact: `Coupling band ${state.advocacyInclusionCouplingBrief?.band ?? 'unknown'}; advocacy drag ${Math.round(state.advocacyInclusionCouplingBrief?.advocacyDrag ?? 0)}.`,
        inference: state.advocacyInclusionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce advocacy with inclusion levers — wave 41 / O10-213 depth.'
      };
    case 'inclusion_equity':
      return {
        topic,
        headline: state.inclusionEquityOutlook?.summary || 'Inclusion equity unavailable.',
        fact: `Equity band ${state.inclusionEquityOutlook?.band ?? 'unknown'}; advocacy drag ${Math.round(state.inclusionEquityOutlook?.advocacyDrag ?? 0)}.`,
        inference: state.inclusionEquityOutlook?.stewardNote || state.outlook,
        projection: 'Equity blends inclusion levers with advocacy resonance — bounded indices only.'
      };
    case 'subject_inclusion_readiness':
      return {
        topic,
        headline: state.subjectInclusionReadinessBrief?.summary || 'Subject inclusion readiness unavailable.',
        fact: `Inclusion band ${state.subjectInclusionReadinessBrief?.band ?? 'unknown'}; inclusion drag ${Math.round(state.subjectInclusionReadinessBrief?.inclusionDrag ?? 0)}.`,
        inference: state.subjectInclusionReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject inclusion readiness gates subject advocacy against workforce advocacy for O10-213 wave 41.'
      };
    case 'workforce_inclusion':
      return {
        topic,
        headline: state.nationalWorkforceInclusionIndex?.summary || 'Workforce inclusion unavailable.',
        fact: `Inclusion band ${state.nationalWorkforceInclusionIndex?.band ?? 'unknown'}; inclusion drag ${Math.round(state.nationalWorkforceInclusionIndex?.inclusionDrag ?? 0)}.`,
        inference: state.nationalWorkforceInclusionIndex?.stewardNote || state.summary,
        projection: 'Workforce inclusion synthesizes advocacy-inclusion coupling, inclusion equity, and subject inclusion.'
      };
    case 'inclusion_flexibility_coupling':
      return {
        topic,
        headline: state.inclusionFlexibilityCouplingBrief?.summary || 'Inclusion-flexibility coupling unavailable.',
        fact: `Coupling band ${state.inclusionFlexibilityCouplingBrief?.band ?? 'unknown'}; inclusion drag ${Math.round(state.inclusionFlexibilityCouplingBrief?.inclusionDrag ?? 0)}.`,
        inference: state.inclusionFlexibilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce inclusion with flexibility levers — wave 42 / O10-215 depth.'
      };
    case 'flexibility_flow':
      return {
        topic,
        headline: state.flexibilityFlowOutlook?.summary || 'Flexibility flow unavailable.',
        fact: `Flow band ${state.flexibilityFlowOutlook?.band ?? 'unknown'}; inclusion drag ${Math.round(state.flexibilityFlowOutlook?.inclusionDrag ?? 0)}.`,
        inference: state.flexibilityFlowOutlook?.stewardNote || state.outlook,
        projection: 'Flow blends flexibility levers with inclusion equity — bounded indices only.'
      };
    case 'subject_flexibility_readiness':
      return {
        topic,
        headline: state.subjectFlexibilityReadinessBrief?.summary || 'Subject flexibility readiness unavailable.',
        fact: `Flexibility band ${state.subjectFlexibilityReadinessBrief?.band ?? 'unknown'}; flexibility drag ${Math.round(state.subjectFlexibilityReadinessBrief?.flexibilityDrag ?? 0)}.`,
        inference: state.subjectFlexibilityReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject flexibility readiness gates subject inclusion against workforce inclusion for O10-215 wave 42.'
      };
    case 'workforce_flexibility':
      return {
        topic,
        headline: state.nationalWorkforceFlexibilityIndex?.summary || 'Workforce flexibility unavailable.',
        fact: `Flexibility band ${state.nationalWorkforceFlexibilityIndex?.band ?? 'unknown'}; flexibility drag ${Math.round(state.nationalWorkforceFlexibilityIndex?.flexibilityDrag ?? 0)}.`,
        inference: state.nationalWorkforceFlexibilityIndex?.stewardNote || state.summary,
        projection: 'Workforce flexibility synthesizes inclusion-flexibility coupling, flexibility flow, and subject flexibility.'
      };
    case 'flexibility_coordination_coupling':
      return {
        topic,
        headline: state.flexibilityCoordinationCouplingBrief?.summary || 'Flexibility-coordination coupling unavailable.',
        fact: `Coupling band ${state.flexibilityCoordinationCouplingBrief?.band ?? 'unknown'}; flexibility drag ${Math.round(state.flexibilityCoordinationCouplingBrief?.flexibilityDrag ?? 0)}.`,
        inference: state.flexibilityCoordinationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce flexibility with coordination levers — wave 43 / O10-217 depth.'
      };
    case 'coordination_mesh':
      return {
        topic,
        headline: state.coordinationMeshOutlook?.summary || 'Coordination mesh unavailable.',
        fact: `Mesh band ${state.coordinationMeshOutlook?.band ?? 'unknown'}; flexibility drag ${Math.round(state.coordinationMeshOutlook?.flexibilityDrag ?? 0)}.`,
        inference: state.coordinationMeshOutlook?.stewardNote || state.outlook,
        projection: 'Mesh blends coordination levers with flexibility flow — bounded indices only.'
      };
    case 'subject_coordination_readiness':
      return {
        topic,
        headline: state.subjectCoordinationReadinessBrief?.summary || 'Subject coordination readiness unavailable.',
        fact: `Coordination band ${state.subjectCoordinationReadinessBrief?.band ?? 'unknown'}; coordination drag ${Math.round(state.subjectCoordinationReadinessBrief?.coordinationDrag ?? 0)}.`,
        inference: state.subjectCoordinationReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject coordination readiness gates subject flexibility against workforce flexibility for O10-217 wave 43.'
      };
    case 'workforce_coordination':
      return {
        topic,
        headline: state.nationalWorkforceCoordinationIndex?.summary || 'Workforce coordination unavailable.',
        fact: `Coordination band ${state.nationalWorkforceCoordinationIndex?.band ?? 'unknown'}; coordination drag ${Math.round(state.nationalWorkforceCoordinationIndex?.coordinationDrag ?? 0)}.`,
        inference: state.nationalWorkforceCoordinationIndex?.stewardNote || state.summary,
        projection: 'Workforce coordination synthesizes flexibility-coordination coupling, coordination mesh, and subject coordination.'
      };
    case 'coordination_scheduling_coupling':
      return {
        topic,
        headline: state.coordinationSchedulingCouplingBrief?.summary || 'Coordination-scheduling coupling unavailable.',
        fact: `Coupling band ${state.coordinationSchedulingCouplingBrief?.band ?? 'unknown'}; coordination drag ${Math.round(state.coordinationSchedulingCouplingBrief?.coordinationDrag ?? 0)}.`,
        inference: state.coordinationSchedulingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce coordination with scheduling levers — wave 44 / O10-219 depth.'
      };
    case 'scheduling_pulse':
      return {
        topic,
        headline: state.schedulingPulseOutlook?.summary || 'Scheduling pulse unavailable.',
        fact: `Pulse band ${state.schedulingPulseOutlook?.band ?? 'unknown'}; coordination drag ${Math.round(state.schedulingPulseOutlook?.coordinationDrag ?? 0)}.`,
        inference: state.schedulingPulseOutlook?.stewardNote || state.outlook,
        projection: 'Pulse blends scheduling levers with coordination mesh — bounded indices only.'
      };
    case 'subject_scheduling_readiness':
      return {
        topic,
        headline: state.subjectSchedulingReadinessBrief?.summary || 'Subject scheduling readiness unavailable.',
        fact: `Scheduling band ${state.subjectSchedulingReadinessBrief?.band ?? 'unknown'}; scheduling drag ${Math.round(state.subjectSchedulingReadinessBrief?.schedulingDrag ?? 0)}.`,
        inference: state.subjectSchedulingReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject scheduling readiness gates subject coordination against workforce coordination for O10-219 wave 44.'
      };
    case 'workforce_scheduling':
      return {
        topic,
        headline: state.nationalWorkforceSchedulingIndex?.summary || 'Workforce scheduling unavailable.',
        fact: `Scheduling band ${state.nationalWorkforceSchedulingIndex?.band ?? 'unknown'}; scheduling drag ${Math.round(state.nationalWorkforceSchedulingIndex?.schedulingDrag ?? 0)}.`,
        inference: state.nationalWorkforceSchedulingIndex?.stewardNote || state.summary,
        projection: 'Workforce scheduling synthesizes coordination-scheduling coupling, scheduling pulse, and subject scheduling.'
      };
    case 'scheduling_safety_coupling':
      return {
        topic,
        headline: state.schedulingSafetyCouplingBrief?.summary || 'Scheduling-safety coupling unavailable.',
        fact: `Coupling band ${state.schedulingSafetyCouplingBrief?.band ?? 'unknown'}; scheduling drag ${Math.round(state.schedulingSafetyCouplingBrief?.schedulingDrag ?? 0)}.`,
        inference: state.schedulingSafetyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce scheduling with safety levers — wave 45 / O10-221 depth.'
      };
    case 'safety_calibration':
      return {
        topic,
        headline: state.safetyCalibrationOutlook?.summary || 'Safety calibration unavailable.',
        fact: `Calibration band ${state.safetyCalibrationOutlook?.band ?? 'unknown'}; scheduling drag ${Math.round(state.safetyCalibrationOutlook?.schedulingDrag ?? 0)}.`,
        inference: state.safetyCalibrationOutlook?.stewardNote || state.outlook,
        projection: 'Calibration blends safety levers with scheduling pulse — bounded indices only.'
      };
    case 'subject_safety_readiness':
      return {
        topic,
        headline: state.subjectSafetyReadinessBrief?.summary || 'Subject safety readiness unavailable.',
        fact: `Safety band ${state.subjectSafetyReadinessBrief?.band ?? 'unknown'}; safety drag ${Math.round(state.subjectSafetyReadinessBrief?.safetyDrag ?? 0)}.`,
        inference: state.subjectSafetyReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject safety readiness gates subject scheduling against workforce scheduling for O10-221 wave 45.'
      };
    case 'workforce_safety':
      return {
        topic,
        headline: state.nationalWorkforceSafetyIndex?.summary || 'Workforce safety unavailable.',
        fact: `Safety band ${state.nationalWorkforceSafetyIndex?.band ?? 'unknown'}; safety drag ${Math.round(state.nationalWorkforceSafetyIndex?.safetyDrag ?? 0)}.`,
        inference: state.nationalWorkforceSafetyIndex?.stewardNote || state.summary,
        projection: 'Workforce safety synthesizes scheduling-safety coupling, safety calibration, and subject safety.'
      };
    case 'safety_care_coupling':
      return {
        topic,
        headline: state.safetyCareCouplingBrief?.summary || 'Safety-care coupling unavailable.',
        fact: `Coupling band ${state.safetyCareCouplingBrief?.band ?? 'unknown'}; safety drag ${Math.round(state.safetyCareCouplingBrief?.safetyDrag ?? 0)}.`,
        inference: state.safetyCareCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce safety with care levers — wave 46 / O10-223 depth.'
      };
    case 'care_balance':
      return {
        topic,
        headline: state.careBalanceOutlook?.summary || 'Care balance unavailable.',
        fact: `Balance band ${state.careBalanceOutlook?.band ?? 'unknown'}; safety drag ${Math.round(state.careBalanceOutlook?.safetyDrag ?? 0)}.`,
        inference: state.careBalanceOutlook?.stewardNote || state.outlook,
        projection: 'Care balance blends care levers with safety calibration — bounded indices only.'
      };
    case 'subject_care_readiness':
      return {
        topic,
        headline: state.subjectCareReadinessBrief?.summary || 'Subject care readiness unavailable.',
        fact: `Care band ${state.subjectCareReadinessBrief?.band ?? 'unknown'}; care drag ${Math.round(state.subjectCareReadinessBrief?.careDrag ?? 0)}.`,
        inference: state.subjectCareReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject care readiness gates subject safety against workforce safety for O10-223 wave 46.'
      };
    case 'workforce_care':
      return {
        topic,
        headline: state.nationalWorkforceCareIndex?.summary || 'Workforce care unavailable.',
        fact: `Care band ${state.nationalWorkforceCareIndex?.band ?? 'unknown'}; care drag ${Math.round(state.nationalWorkforceCareIndex?.careDrag ?? 0)}.`,
        inference: state.nationalWorkforceCareIndex?.stewardNote || state.summary,
        projection: 'Workforce care synthesizes safety-care coupling, care balance, and subject care.'
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
