import { applyConsequenceMutation } from './consequence-applier.ts';
import type {
  Op10mChainDescriptor,
  Op10mContentTheme,
  Op10mNarrativeEngineState,
  Op10mRegionId,
  Op10mSimulationSlice,
} from './types.ts';

export interface Op10mCrossSystemSynergyDef {
  synergyId: string;
  primaryTheme: Op10mContentTheme;
  secondaryTheme: Op10mContentTheme;
  primarySector: string;
  secondarySector: string;
}

export const OP10M_CROSS_SYSTEM_SYNERGIES: Op10mCrossSystemSynergyDef[] = [
  { synergyId: 'mining_water', primaryTheme: 'mining', secondaryTheme: 'water', primarySector: 'mining', secondarySector: 'agriculture' },
  { synergyId: 'energy_trade', primaryTheme: 'energy', secondaryTheme: 'trade', primarySector: 'energy', secondarySector: 'trade' },
  { synergyId: 'finance_governance', primaryTheme: 'finance', secondaryTheme: 'governance', primarySector: 'finance', secondarySector: 'finance' },
  { synergyId: 'agriculture_environment', primaryTheme: 'agriculture', secondaryTheme: 'environment', primarySector: 'agriculture', secondarySector: 'renewables' },
  { synergyId: 'technology_research', primaryTheme: 'technology', secondaryTheme: 'research', primarySector: 'technology', secondarySector: 'research' },
  { synergyId: 'logistics_manufacturing', primaryTheme: 'logistics', secondaryTheme: 'manufacturing', primarySector: 'logistics', secondarySector: 'manufacturing' },
  { synergyId: 'tourism_renewables', primaryTheme: 'tourism', secondaryTheme: 'renewables', primarySector: 'tourism', secondarySector: 'renewables' },
  { synergyId: 'exploration_energy', primaryTheme: 'exploration', secondaryTheme: 'energy', primarySector: 'mining', secondarySector: 'energy' },
  { synergyId: 'governance_finance', primaryTheme: 'governance', secondaryTheme: 'finance', primarySector: 'finance', secondarySector: 'finance' },
];

export function crossSystemCouplingFlagKey(region: string, synergyId: string): string {
  return `op10m_xsys_${region}_${synergyId}`;
}

export function getCrossSystemCouplingLevel(
  sim: Op10mSimulationSlice,
  region: string,
  synergyId: string
): number {
  const raw = sim.flags[crossSystemCouplingFlagKey(region, synergyId)];
  return typeof raw === 'number' ? raw : raw ? 1 : 0;
}

const PHASE_RANK = { signal: 0, pressure: 1, rupture: 2, recovery: 3 } as const;

export function hasPeerChainAtPhase(
  narrative: Op10mNarrativeEngineState,
  catalog: Op10mChainDescriptor[],
  region: string,
  theme: Op10mContentTheme,
  minPhase: keyof typeof PHASE_RANK
): boolean {
  const minRank = PHASE_RANK[minPhase];
  for (const [chainId, runtime] of Object.entries(narrative.activeChains)) {
    const desc = catalog.find((c) => c.chainId === chainId);
    if (!desc || desc.region !== region || desc.theme !== theme) continue;
    if (PHASE_RANK[runtime.phase] >= minRank) return true;
  }
  return false;
}

export interface CrossSystemTickResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

export function evaluateCrossSystemCouplings(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  catalog: Op10mChainDescriptor[]
): CrossSystemTickResult {
  let simulation = { ...simulationIn };
  let narrative = { ...narrativeIn };
  const log: string[] = [];

  for (const region of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as Op10mRegionId[]) {
    for (const synergy of OP10M_CROSS_SYSTEM_SYNERGIES) {
      const primaryRupture = hasPeerChainAtPhase(narrative, catalog, region, synergy.primaryTheme, 'rupture');
      const secondaryPressure = hasPeerChainAtPhase(
        narrative,
        catalog,
        region,
        synergy.secondaryTheme,
        'pressure'
      );
      if (!primaryRupture || !secondaryPressure) continue;

      const current = getCrossSystemCouplingLevel(simulation, region, synergy.synergyId);
      if (current >= 5) continue;
      const flagKey = crossSystemCouplingFlagKey(region, synergy.synergyId);
      const nextLevel = current + 1;
      const applied = applyConsequenceMutation(simulation, narrative, `xsys_${region}_${synergy.synergyId}`, {
        setFlags: { [flagKey]: nextLevel },
        stabilityDelta: -1,
        sectorActivityDelta: {
          [synergy.primarySector]: -1,
          [synergy.secondarySector]: -1,
        },
      });
      simulation = applied.simulation;
      narrative = {
        ...applied.narrative,
        telemetry: {
          ...applied.narrative.telemetry,
          crossSystemCouplings: (applied.narrative.telemetry.crossSystemCouplings ?? 0) + 1,
        },
      };
      log.push(`cross-system ${synergy.synergyId}@${region} level ${nextLevel}`);
    }
  }

  return { simulation, narrative, log };
}

export function phaseRankAtLeast(
  phase: keyof typeof PHASE_RANK,
  minPhase: keyof typeof PHASE_RANK
): boolean {
  return PHASE_RANK[phase] >= PHASE_RANK[minPhase];
}
