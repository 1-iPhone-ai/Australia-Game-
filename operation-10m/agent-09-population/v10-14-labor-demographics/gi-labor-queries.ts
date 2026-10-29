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
  | 'talent_mobility';

export interface LaborGiAnswer {
  topic: LaborGiQueryTopic;
  headline: string;
  fact: string;
  inference: string;
  projection: string;
}

export function detectLaborDemographicsQuery(raw: string): LaborGiQueryTopic | null {
  const q = raw.toLowerCase();
  if (/\b(migration shock|shock.*migrat)/.test(q)) return 'migration_shocks';
  if (/\b(household budget|affordability|cost of living)/.test(q)) return 'household_budget';
  if (/\b(wage|pay pressure|salary pressure)/.test(q)) return 'wage_pressure';
  if (/\b(migrat|inflow|outflow|relocate)/.test(q)) return 'migration_flow';
  if (/\b(employment link|jobs.*output|labor market tight)/.test(q)) return 'employment_linkage';
  if (/\b(dependency ratio|aging dependency|aged pressure)/.test(q)) return 'dependency_ratio';
  if (/\b(demograph|aging|youth)/.test(q)) return 'demographics';
  if (/\b(workforce capacity|capacity gap|labor shortage)/.test(q)) return 'workforce_capacity';
  if (/\b(labor resilience|resilience score)/.test(q)) return 'labor_resilience';
  if (/\b(participation|labor force participation)/.test(q)) return 'participation_outlook';
  if (/\b(labor velocity|market churn|turnover pressure)/.test(q)) return 'labor_velocity';
  if (/\b(skill mismatch|skills gap|misaligned skills)/.test(q)) return 'skill_mismatch';
  if (/\b(supply elasticity|inelastic labor|labor supply response)/.test(q)) return 'supply_elasticity';
  if (/\b(talent mobility|mobile talent|talent flow)/.test(q)) return 'talent_mobility';
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
