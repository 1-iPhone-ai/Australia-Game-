import type {
  Op10mConsequenceMutation,
  Op10mNarrativeEngineState,
  Op10mPersistentModifier,
  Op10mSimulationSlice,
} from './types.ts';

function clampStability(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function applyPersistentModifiers(
  sim: Op10mSimulationSlice,
  narrative: Op10mNarrativeEngineState
): { simulation: Op10mSimulationSlice; narrative: Op10mNarrativeEngineState; log: string[] } {
  const log: string[] = [];
  let money = sim.money;
  let nationalStability = sim.nationalStability;
  const regionalStability = { ...sim.regionalStability };
  const sectorActivity = { ...sim.sectorActivity };
  const remaining: Op10mPersistentModifier[] = [];

  for (const mod of narrative.persistentModifiers) {
    if (mod.expiresDay < sim.day) continue;
    money += mod.moneyDeltaPerTurn;
    nationalStability = clampStability(nationalStability + mod.stabilityDeltaPerTurn);
    if (mod.sectorKey && mod.sectorDeltaPerTurn) {
      sectorActivity[mod.sectorKey] = (sectorActivity[mod.sectorKey] ?? 0) + mod.sectorDeltaPerTurn;
    }
    remaining.push(mod);
    log.push(`modifier ${mod.id} tick`);
  }

  return {
    simulation: {
      ...sim,
      money,
      nationalStability,
      regionalStability,
      sectorActivity,
    },
    narrative: { ...narrative, persistentModifiers: remaining },
    log,
  };
}

export function applyConsequenceMutation(
  sim: Op10mSimulationSlice,
  narrative: Op10mNarrativeEngineState,
  chainId: string,
  mutation: Op10mConsequenceMutation
): { simulation: Op10mSimulationSlice; narrative: Op10mNarrativeEngineState; log: string[] } {
  const log: string[] = [];
  const flags = { ...sim.flags };
  let money = sim.money;
  let nationalStability = sim.nationalStability;
  const regionalStability = { ...sim.regionalStability };
  const sectorActivity = { ...sim.sectorActivity };
  let activeCrisisCount = sim.activeCrisisCount;
  let nextNarrative = { ...narrative };

  if (mutation.moneyDelta) {
    money += mutation.moneyDelta;
    log.push(`money ${mutation.moneyDelta >= 0 ? '+' : ''}${mutation.moneyDelta}`);
  }
  if (mutation.stabilityDelta) {
    nationalStability = clampStability(nationalStability + mutation.stabilityDelta);
    log.push(`stability ${mutation.stabilityDelta >= 0 ? '+' : ''}${mutation.stabilityDelta}`);
  }
  if (mutation.regionalStabilityDelta) {
    for (const [region, delta] of Object.entries(mutation.regionalStabilityDelta)) {
      regionalStability[region] = clampStability((regionalStability[region] ?? 50) + delta);
    }
    log.push('regional stability adjusted');
  }
  if (mutation.sectorActivityDelta) {
    for (const [sector, delta] of Object.entries(mutation.sectorActivityDelta)) {
      sectorActivity[sector] = (sectorActivity[sector] ?? 0) + delta;
    }
    log.push('sector activity adjusted');
  }
  if (mutation.setFlags) {
    Object.assign(flags, mutation.setFlags);
    log.push(`flags set: ${Object.keys(mutation.setFlags).join(',')}`);
  }
  if (mutation.clearFlags) {
    for (const key of mutation.clearFlags) delete flags[key];
    log.push(`flags cleared: ${mutation.clearFlags.join(',')}`);
  }
  if (mutation.incrementActiveCrises) {
    activeCrisisCount = Math.max(0, activeCrisisCount + mutation.incrementActiveCrises);
    log.push(`activeCrises ${mutation.incrementActiveCrises >= 0 ? '+' : ''}${mutation.incrementActiveCrises}`);
  }
  if (mutation.spawnModifier) {
    const id = `${chainId}_mod_${sim.day}_${nextNarrative.persistentModifiers.length}`;
    const expiresDay =
      mutation.spawnModifier.expiresDay > 0
        ? mutation.spawnModifier.expiresDay
        : sim.day + 5;
    nextNarrative = {
      ...nextNarrative,
      persistentModifiers: [
        ...nextNarrative.persistentModifiers,
        {
          ...mutation.spawnModifier,
          id,
          sourceChainId: chainId,
          expiresDay,
        },
      ],
    };
    log.push(`spawn modifier ${id}`);
  }

  if (mutation.escalateToPhase && nextNarrative.activeChains[chainId]) {
    nextNarrative = {
      ...nextNarrative,
      activeChains: {
        ...nextNarrative.activeChains,
        [chainId]: {
          ...nextNarrative.activeChains[chainId],
          phase: mutation.escalateToPhase,
          lastAdvancedDay: sim.day,
        },
      },
    };
    log.push(`phase -> ${mutation.escalateToPhase}`);
  }

  if (mutation.resolveChain) {
    const resolved = new Set(nextNarrative.resolvedChainIds);
    resolved.add(chainId);
    const activeChains = { ...nextNarrative.activeChains };
    delete activeChains[chainId];
    nextNarrative = {
      ...nextNarrative,
      activeChains,
      resolvedChainIds: [...resolved],
    };
    log.push(`chain resolved ${chainId}`);
  }

  nextNarrative = {
    ...nextNarrative,
    telemetry: {
      ...nextNarrative.telemetry,
      consequencesApplied: nextNarrative.telemetry.consequencesApplied + 1,
    },
  };

  return {
    simulation: {
      ...sim,
      money,
      nationalStability,
      regionalStability,
      sectorActivity,
      flags,
      activeCrisisCount,
    },
    narrative: nextNarrative,
    log,
  };
}
