import { applyConsequenceMutation, applyPersistentModifiers } from './consequence-applier.ts';
import { hasArmedBypass } from './deep-chain-orchestrator.ts';
import { createDefaultRegionalContagionLedger, evaluateRegionalNarrativeHooks, sanitizeRegionalContagionLedger } from './regional-hook-engine.ts';
import {
  evaluateRequirements,
  findStageForPhase,
  isCooldownReady,
  recordCooldown,
  seasonForDay,
} from './trigger-engine.ts';
import type {
  Op10mChainDescriptor,
  Op10mNarrativeEngineState,
  Op10mRegionalNarrativeHook,
  Op10mResolveResult,
  Op10mSimulationSlice,
  Op10mTickResult,
} from './types.ts';

export function createDefaultOp10mSimulationSlice(partial?: Partial<Op10mSimulationSlice>): Op10mSimulationSlice {
  const day = partial?.day ?? 1;
  return {
    day,
    money: partial?.money ?? 10000,
    nationalStability: partial?.nationalStability ?? 75,
    regionalStability: partial?.regionalStability ?? {
      NSW: 75,
      VIC: 75,
      QLD: 75,
      SA: 75,
      WA: 75,
      TAS: 75,
      NT: 75,
      ACT: 75,
    },
    season: partial?.season ?? seasonForDay(day),
    sectorActivity: partial?.sectorActivity ?? {
      mining: 10,
      agriculture: 10,
      energy: 10,
      renewables: 10,
      technology: 10,
      research: 10,
      trade: 10,
      logistics: 10,
      finance: 10,
      tourism: 10,
      manufacturing: 10,
    },
    flags: { ...(partial?.flags ?? {}) },
    activeCrisisCount: partial?.activeCrisisCount ?? 0,
  };
}

export function createDefaultOp10mNarrativeEngineState(): Op10mNarrativeEngineState {
  return {
    version: 1,
    activeChains: {},
    pendingResponses: [],
    resolvedChainIds: [],
    cooldowns: [],
    persistentModifiers: [],
    telemetry: {
      eligibilityChecks: 0,
      chainsAdvanced: 0,
      responsesOpened: 0,
      responsesResolved: 0,
      consequencesApplied: 0,
      regionalHooksFired: 0,
      deepFollowUpsArmed: 0,
    },
    regional: createDefaultRegionalContagionLedger(),
  };
}

export function sanitizeOp10mNarrativeEngineState(raw: unknown): Op10mNarrativeEngineState {
  const base = createDefaultOp10mNarrativeEngineState();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;

  if (r.activeChains && typeof r.activeChains === 'object') {
    for (const [chainId, v] of Object.entries(r.activeChains as Record<string, unknown>)) {
      if (!v || typeof v !== 'object') continue;
      const o = v as Record<string, unknown>;
      const phase = o.phase;
      if (phase !== 'signal' && phase !== 'pressure' && phase !== 'rupture' && phase !== 'recovery') continue;
      base.activeChains[chainId] = {
        chainId,
        phase,
        startedDay: Number(o.startedDay) || 1,
        lastAdvancedDay: Number(o.lastAdvancedDay) || Number(o.startedDay) || 1,
        stageCooldownUntilDay: Number(o.stageCooldownUntilDay) || 0,
      };
    }
  }

  base.pendingResponses = (Array.isArray(r.pendingResponses) ? r.pendingResponses : [])
    .filter((p): p is Op10mNarrativeEngineState['pendingResponses'][number] => {
      return !!p && typeof p === 'object' && typeof (p as { id?: unknown }).id === 'string';
    })
    .slice(0, 12);

  base.resolvedChainIds = (Array.isArray(r.resolvedChainIds) ? r.resolvedChainIds : [])
    .map(String)
    .slice(-80);

  base.cooldowns = (Array.isArray(r.cooldowns) ? r.cooldowns : [])
    .filter((c): c is Op10mNarrativeEngineState['cooldowns'][number] => {
      return !!c && typeof c === 'object' && typeof (c as { key?: unknown }).key === 'string';
    })
    .slice(-200);

  base.persistentModifiers = (Array.isArray(r.persistentModifiers) ? r.persistentModifiers : [])
    .filter((m): m is Op10mNarrativeEngineState['persistentModifiers'][number] => {
      return !!m && typeof m === 'object' && typeof (m as { id?: unknown }).id === 'string';
    })
    .slice(-40);

  if (r.telemetry && typeof r.telemetry === 'object') {
    const t = r.telemetry as Record<string, unknown>;
    base.telemetry.eligibilityChecks = Math.max(0, Number(t.eligibilityChecks) || 0);
    base.telemetry.chainsAdvanced = Math.max(0, Number(t.chainsAdvanced) || 0);
    base.telemetry.responsesOpened = Math.max(0, Number(t.responsesOpened) || 0);
    base.telemetry.responsesResolved = Math.max(0, Number(t.responsesResolved) || 0);
    base.telemetry.consequencesApplied = Math.max(0, Number(t.consequencesApplied) || 0);
    base.telemetry.regionalHooksFired = Math.max(0, Number(t.regionalHooksFired) || 0);
    base.telemetry.deepFollowUpsArmed = Math.max(0, Number(t.deepFollowUpsArmed) || 0);
  }

  base.regional = sanitizeRegionalContagionLedger(r.regional);

  return base;
}

export interface Op10mTickOptions {
  enabled?: boolean;
  maxNewResponsesPerTick?: number;
  regionalHooks?: Op10mRegionalNarrativeHook[];
}

export function evaluateOp10mNarrativeTick(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState | null | undefined,
  catalog: Op10mChainDescriptor[],
  options?: Op10mTickOptions
): Op10mTickResult {
  const enabled = options?.enabled !== false;
  let simulation = { ...simulationIn, season: simulationIn.season ?? seasonForDay(simulationIn.day) };
  let narrative = sanitizeOp10mNarrativeEngineState(narrativeIn);
  const log: string[] = [];

  if (!enabled) {
    return { simulation, narrative, log };
  }

  const modifierPass = applyPersistentModifiers(simulation, narrative);
  simulation = modifierPass.simulation;
  narrative = modifierPass.narrative;
  log.push(...modifierPass.log);

  narrative = {
    ...narrative,
    telemetry: {
      ...narrative.telemetry,
      eligibilityChecks: narrative.telemetry.eligibilityChecks + catalog.length,
    },
  };

  const maxNew = options?.maxNewResponsesPerTick ?? 3;
  let openedThisTick = 0;

  for (const descriptor of catalog) {
    if (narrative.resolvedChainIds.includes(descriptor.chainId)) continue;
    if (simulation.flags[descriptor.exitFlag]) continue;

    const runtime = narrative.activeChains[descriptor.chainId] ?? null;
    const targetPhase = runtime?.phase ?? 'signal';
    const stage = findStageForPhase(descriptor, targetPhase);
    if (!stage) continue;

    const cooldownKey = `${descriptor.chainId}:${stage.phase}`;
    if (!isCooldownReady(narrative.cooldowns, cooldownKey, simulation.day)) continue;
    if (runtime && simulation.day < runtime.stageCooldownUntilDay) continue;

    const eligibility = evaluateRequirements(stage.requires, simulation, runtime, {
      armedBypass: hasArmedBypass(narrative, descriptor.chainId),
      chainId: descriptor.chainId,
      narrative,
    });
    if (!eligibility.ok) continue;

    if (!runtime) {
      narrative = {
        ...narrative,
        activeChains: {
          ...narrative.activeChains,
          [descriptor.chainId]: {
            chainId: descriptor.chainId,
            phase: 'signal',
            startedDay: simulation.day,
            lastAdvancedDay: simulation.day,
            stageCooldownUntilDay: simulation.day + stage.cooldownTurns,
          },
        },
        cooldowns: recordCooldown(narrative, cooldownKey, simulation.day, stage.cooldownTurns),
      };
      const enterMutation = {
        setFlags: { [descriptor.entryFlag]: true },
        incrementActiveCrises: 1,
      };
      const applied = applyConsequenceMutation(simulation, narrative, descriptor.chainId, enterMutation);
      simulation = applied.simulation;
      narrative = applied.narrative;
      log.push(`chain entered ${descriptor.chainId}`);
    }

    const hasPending = narrative.pendingResponses.some((p) => p.chainId === descriptor.chainId);
    if (!hasPending && openedThisTick < maxNew) {
      narrative = {
        ...narrative,
        pendingResponses: [
          ...narrative.pendingResponses,
          {
            id: `${descriptor.chainId}_pr_${simulation.day}_${stage.phase}`,
            chainId: descriptor.chainId,
            stagePhase: stage.phase,
            regionId: descriptor.region,
            choiceIds: stage.choices.map((c) => c.id),
            openedDay: simulation.day,
            expiresDay: simulation.day + 3,
            snapshot: {
              day: simulation.day,
              money: simulation.money,
              nationalStability: simulation.nationalStability,
              activeCrisisCount: simulation.activeCrisisCount,
            },
          },
        ],
        telemetry: {
          ...narrative.telemetry,
          responsesOpened: narrative.telemetry.responsesOpened + 1,
        },
      };
      openedThisTick += 1;
      log.push(`response opened ${descriptor.chainId}/${stage.phase}`);
    }

    if (stage.passiveTick) {
      const passive = applyConsequenceMutation(simulation, narrative, descriptor.chainId, stage.passiveTick);
      simulation = passive.simulation;
      narrative = passive.narrative;
      log.push(...passive.log);
    }
  }

  narrative = {
    ...narrative,
    pendingResponses: narrative.pendingResponses.filter((p) => p.expiresDay >= simulation.day),
  };

  const regionalHooks = options?.regionalHooks ?? [];
  if (regionalHooks.length > 0) {
    const regionalPass = evaluateRegionalNarrativeHooks(
      simulation,
      narrative,
      catalog,
      regionalHooks
    );
    simulation = regionalPass.simulation;
    narrative = regionalPass.narrative;
    log.push(...regionalPass.log);
  }

  return { simulation, narrative, log };
}

export function resolveOp10mNarrativeResponse(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  catalog: Op10mChainDescriptor[],
  responseId: string,
  choiceId: string
): Op10mResolveResult {
  let simulation = { ...simulationIn };
  let narrative = sanitizeOp10mNarrativeEngineState(narrativeIn);
  const log: string[] = [];

  const pending = narrative.pendingResponses.find((p) => p.id === responseId);
  if (!pending) {
    return { simulation, narrative, log, error: 'Unknown narrative response' };
  }

  const descriptor = catalog.find((c) => c.chainId === pending.chainId);
  if (!descriptor) {
    return { simulation, narrative, log, error: 'Missing chain descriptor' };
  }

  const stage = findStageForPhase(descriptor, pending.stagePhase);
  if (!stage) {
    return { simulation, narrative, log, error: 'Missing stage template' };
  }

  const choice = stage.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return { simulation, narrative, log, error: 'Invalid choice' };
  }

  if (choice.costMoney > 0 && simulation.money < choice.costMoney) {
    return { simulation, narrative, log, error: 'Insufficient funds' };
  }

  const mutation =
    choiceId === 'defer' && choice.onDefer ? choice.onDefer : choice.onSelect;

  if (choice.costMoney > 0) {
    simulation = { ...simulation, money: simulation.money - choice.costMoney };
  }

  const applied = applyConsequenceMutation(simulation, narrative, descriptor.chainId, mutation);
  simulation = applied.simulation;
  narrative = applied.narrative;
  log.push(...applied.log);

  narrative = {
    ...narrative,
    pendingResponses: narrative.pendingResponses.filter((p) => p.id !== responseId),
    telemetry: {
      ...narrative.telemetry,
      responsesResolved: narrative.telemetry.responsesResolved + 1,
    },
  };

  return { simulation, narrative, log, error: null };
}

export function runOp10mNarrativeSelfTests(catalog: Op10mChainDescriptor[]): {
  passed: number;
  total: number;
  failures: string[];
} {
  const failures: string[] = [];
  const ok = (name: string, cond: boolean | string) => {
    if (cond !== true) failures.push(`${name}: ${cond}`);
  };

  ok('catalog non-empty', catalog.length > 0);
  ok('unique chain ids', new Set(catalog.map((c) => c.chainId)).size === catalog.length);

  let sim = createDefaultOp10mSimulationSlice({ day: 12, sectorActivity: { mining: 20 } });
  let narrative = createDefaultOp10mNarrativeEngineState();
  const tick = evaluateOp10mNarrativeTick(sim, narrative, catalog.slice(0, 5));
  ok('tick returns narrative', tick.narrative.version === 1);
  ok('tick eligibility counted', tick.narrative.telemetry.eligibilityChecks >= 5);

  const sample = catalog[0];
  if (sample) {
    sim = createDefaultOp10mSimulationSlice({
      day: 20,
      flags: { [sample.entryFlag]: true },
      sectorActivity: { [sample.theme === 'water' ? 'agriculture' : sample.theme]: 25 },
    });
    narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[sample.chainId] = {
      chainId: sample.chainId,
      phase: 'recovery',
      startedDay: 18,
      lastAdvancedDay: 19,
      stageCooldownUntilDay: 0,
    };
    narrative.pendingResponses.push({
      id: 'test_pr',
      chainId: sample.chainId,
      stagePhase: 'recovery',
      regionId: sample.region,
      choiceIds: ['commit', 'defer'],
      openedDay: 20,
      expiresDay: 23,
      snapshot: {
        day: 20,
        money: sim.money,
        nationalStability: sim.nationalStability,
        activeCrisisCount: 0,
      },
    });
    const resolved = resolveOp10mNarrativeResponse(sim, narrative, catalog, 'test_pr', 'commit');
    ok('resolve commit', resolved.error === null);
    ok('resolved chain tracked', resolved.narrative.resolvedChainIds.includes(sample.chainId));
  }

  const total = 7;
  return { passed: total - failures.length, total, failures };
}
