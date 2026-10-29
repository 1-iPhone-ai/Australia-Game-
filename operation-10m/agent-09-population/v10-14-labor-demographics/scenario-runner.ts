import type { LaborStressScenarioId } from './catalog/labor-stress-scenarios';
import { lookupLaborStressScenario } from './catalog/labor-stress-scenarios';
import { computeNationalLaborDemographics } from './compute';
import { createInitialLaborDemographicsPersisted } from './persistence';
import type { LaborDemographicsInputs, NationalLaborDemographicsState } from './types';

export interface LaborScenarioRunDelta {
  employmentLinkageScore: number;
  wagePressureScore: number;
  migrationFlowScore: number;
}

export interface LaborStressScenarioRunResult {
  scenarioId: LaborStressScenarioId;
  title: string;
  baseline: NationalLaborDemographicsState;
  stressed: NationalLaborDemographicsState;
  delta: LaborScenarioRunDelta;
  narrative: string;
}

function v1014MinimalIndustries(): any {
  const baseOut = { mining: 120, technology: 40, manufacturing: 40, agriculture: 40, energy: 40, research: 40, tourism: 40, trade: 40 };
  const mk = (mining: number, tech: number) => ({
    industries: {
      mining: { effectiveOutput: mining },
      technology: { effectiveOutput: tech },
      manufacturing: { effectiveOutput: 12 },
      agriculture: { effectiveOutput: 12 },
      energy: { effectiveOutput: 12 },
      research: { effectiveOutput: 12 },
      tourism: { effectiveOutput: 12 },
      trade: { effectiveOutput: 12 }
    }
  });
  return {
    national: { output: { ...baseOut } },
    regions: {
      NSW: mk(12, 40),
      VIC: mk(12, 35),
      QLD: mk(40, 12),
      WA: mk(55, 12),
      SA: mk(12, 12),
      TAS: mk(12, 12),
      NT: mk(12, 12),
      ACT: mk(12, 12)
    }
  };
}

function applyScenarioBiasesToInputs(
  inputs: LaborDemographicsInputs,
  scenarioId: LaborStressScenarioId
): LaborDemographicsInputs {
  const sc = lookupLaborStressScenario(scenarioId);
  if (!sc) return inputs;
  const industries = inputs.industries ? JSON.parse(JSON.stringify(inputs.industries)) : v1014MinimalIndustries();
  if (scenarioId === 'ld_sc_mining_supercycle') {
    industries.national.output.mining = (industries.national.output.mining || 40) * 2.2;
    industries.regions.WA.industries.mining.effectiveOutput = 65;
    industries.regions.QLD.industries.mining.effectiveOutput = 58;
  }
  if (scenarioId === 'ld_sc_metro_talent_war') {
    industries.regions.NSW.industries.technology.effectiveOutput = 48;
    industries.regions.VIC.industries.technology.effectiveOutput = 44;
  }
  if (scenarioId === 'ld_sc_automation_displacement') {
    return {
      ...inputs,
      industries,
      capabilities: [{ id: 'auto_wave', active: true, automationShift: 92 }]
    };
  }
  if (
    scenarioId === 'ld_sc_housing_affordability_crunch' ||
    scenarioId === 'ld_sc_essential_access_crisis'
  ) {
    const households: any = {
      national: { affordability: 'strained', financialResilience: 'fragile', housingPressure: 'high' },
      regions: {}
    };
    sc.primaryRegions.forEach(r => {
      households.regions[r] = {
        affordability: 'severe_pressure',
        essentialAccess: scenarioId.includes('essential') ? 'critical' : 'strained',
        resilience: 'fragile',
        employmentOpportunity: 'weak'
      };
    });
    return { ...inputs, industries, households };
  }
  return { ...inputs, industries };
}

export function runLaborStressScenario(
  scenarioId: LaborStressScenarioId,
  baseInputs: LaborDemographicsInputs
): LaborStressScenarioRunResult | null {
  const sc = lookupLaborStressScenario(scenarioId);
  if (!sc) return null;
  const baseline = computeNationalLaborDemographics(baseInputs, createInitialLaborDemographicsPersisted(), null).state;
  const stressedInputs = applyScenarioBiasesToInputs(baseInputs, scenarioId);
  const stressed = computeNationalLaborDemographics(
    stressedInputs,
    createInitialLaborDemographicsPersisted(),
    null
  ).state;
  const delta: LaborScenarioRunDelta = {
    employmentLinkageScore: stressed.employmentLinkageScore - baseline.employmentLinkageScore,
    wagePressureScore: stressed.wagePressureScore - baseline.wagePressureScore,
    migrationFlowScore: stressed.migrationFlowScore - baseline.migrationFlowScore
  };
  return {
    scenarioId,
    title: sc.title,
    baseline,
    stressed,
    delta,
    narrative: sc.narrative
  };
}
