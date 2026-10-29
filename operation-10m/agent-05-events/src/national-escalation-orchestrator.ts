import { applyConsequenceMutation } from './consequence-applier.ts';
import {
  OP10M_CROSS_SYSTEM_SYNERGIES,
  getCrossSystemCouplingLevel,
} from './cross-system-orchestrator.ts';
import { OP10M_AU_REGIONS, getContagionLevel } from './regional-graph.ts';
import type { Op10mContentTheme, Op10mNarrativeEngineState, Op10mSimulationSlice } from './types.ts';

export const OP10M_NATIONAL_ESCALATION_TIER_FLAG = 'op10m_national_escalation_tier';
export const OP10M_MULTI_REGION_CONTAGION_COUNT_FLAG = 'op10m_multi_region_contagion_regions';

const CONTAGION_THEMES: Op10mContentTheme[] = [
  'mining',
  'agriculture',
  'energy',
  'renewables',
  'technology',
  'research',
  'trade',
  'logistics',
  'finance',
  'tourism',
  'water',
  'manufacturing',
  'governance',
  'environment',
  'exploration',
];

export function getNationalEscalationTier(sim: Op10mSimulationSlice): number {
  const raw = sim.flags[OP10M_NATIONAL_ESCALATION_TIER_FLAG];
  return typeof raw === 'number' ? raw : 0;
}

export function countRegionsWithContagionAtLeast(
  sim: Op10mSimulationSlice,
  minPerRegion: number
): number {
  let regionsHit = 0;
  for (const region of OP10M_AU_REGIONS) {
    let hit = false;
    for (const theme of CONTAGION_THEMES) {
      if (getContagionLevel(sim, region, theme) >= minPerRegion) {
        hit = true;
        break;
      }
    }
    if (hit) regionsHit += 1;
  }
  return regionsHit;
}

export function computeNationalEscalationScore(
  sim: Op10mSimulationSlice,
  narrative: Op10mNarrativeEngineState
): number {
  let couplingSum = 0;
  for (const region of OP10M_AU_REGIONS) {
    for (const synergy of OP10M_CROSS_SYSTEM_SYNERGIES) {
      couplingSum += getCrossSystemCouplingLevel(sim, region, synergy.synergyId);
    }
  }
  const contagionRegions = countRegionsWithContagionAtLeast(sim, 1);
  const resolved = narrative.resolvedChainIds.length;
  let score = 0;
  score += Math.floor(couplingSum / 4);
  score += Math.floor(sim.activeCrisisCount / 2);
  score += Math.floor(contagionRegions / 2);
  score += Math.floor(resolved / 3);
  if (sim.nationalStability < 45) score += 2;
  if (sim.nationalStability < 30) score += 1;
  return Math.min(5, Math.max(0, score));
}

export interface NationalEscalationTickResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

export function evaluateNationalEscalationLattice(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState
): NationalEscalationTickResult {
  let simulation = { ...simulationIn };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  const targetTier = computeNationalEscalationScore(simulation, narrative);
  const currentTier = getNationalEscalationTier(simulation);
  const contagionRegions = countRegionsWithContagionAtLeast(simulation, 1);

  simulation = {
    ...simulation,
    flags: {
      ...simulation.flags,
      [OP10M_MULTI_REGION_CONTAGION_COUNT_FLAG]: contagionRegions,
    },
  };

  if (targetTier <= currentTier) {
    return { simulation, narrative, log };
  }

  for (let step = currentTier + 1; step <= targetTier; step += 1) {
    const applied = applyConsequenceMutation(simulation, narrative, `national_escalation_${step}`, {
      setFlags: { [OP10M_NATIONAL_ESCALATION_TIER_FLAG]: step },
      stabilityDelta: -step,
      moneyDelta: -250 * step,
      incrementActiveCrises: step >= 3 ? 1 : 0,
    });
    simulation = applied.simulation;
    narrative = {
      ...applied.narrative,
      telemetry: {
        ...applied.narrative.telemetry,
        nationalEscalationSteps: (applied.narrative.telemetry.nationalEscalationSteps ?? 0) + 1,
      },
    };
    log.push(`national escalation tier ${step}`);
  }

  return { simulation, narrative, log };
}
