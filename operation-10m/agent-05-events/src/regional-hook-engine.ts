import { applyConsequenceMutation } from './consequence-applier.ts';
import { findRegionalFollowUpChainId } from './deep-chain-orchestrator.ts';
import { listNeighborRegions, getContagionLevel, contagionFlagKey } from './regional-graph.ts';
import { isCooldownReady, recordCooldown } from './trigger-engine.ts';
import type {
  Op10mArmedDeepChainFollowUp,
  Op10mChainDescriptor,
  Op10mChainPhase,
  Op10mNarrativeEngineState,
  Op10mRegionalContagionLedger,
  Op10mRegionalNarrativeHook,
  Op10mSimulationSlice,
} from './types.ts';

const PHASE_RANK: Record<Op10mChainPhase, number> = {
  signal: 0,
  pressure: 1,
  rupture: 2,
  recovery: 3,
};

export function createDefaultRegionalContagionLedger(): Op10mRegionalContagionLedger {
  return {
    pressureByRegion: {},
    firedHookIds: [],
    armedFollowUps: [],
    armedBypassChainIds: [],
  };
}

export function sanitizeRegionalContagionLedger(raw: unknown): Op10mRegionalContagionLedger {
  const base = createDefaultRegionalContagionLedger();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;

  if (r.pressureByRegion && typeof r.pressureByRegion === 'object') {
    for (const [k, v] of Object.entries(r.pressureByRegion as Record<string, unknown>)) {
      base.pressureByRegion[k] = Math.max(0, Number(v) || 0);
    }
  }

  base.firedHookIds = (Array.isArray(r.firedHookIds) ? r.firedHookIds : []).map(String).slice(-400);

  base.armedFollowUps = (Array.isArray(r.armedFollowUps) ? r.armedFollowUps : [])
    .filter((item): item is Op10mArmedDeepChainFollowUp => {
      if (!item || typeof item !== 'object') return false;
      const o = item as Record<string, unknown>;
      return (
        typeof o.id === 'string' &&
        typeof o.sourceChainId === 'string' &&
        typeof o.targetChainId === 'string' &&
        typeof o.targetRegion === 'string' &&
        typeof o.theme === 'string' &&
        typeof o.armedDay === 'number' &&
        typeof o.expiresDay === 'number'
      );
    })
    .slice(-80);

  base.armedBypassChainIds = (Array.isArray(r.armedBypassChainIds) ? r.armedBypassChainIds : [])
    .map(String)
    .slice(-80);

  return base;
}

function hookCooldownKey(hookId: string): string {
  return `regional_hook:${hookId}`;
}

export interface RegionalHookTickResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

export function evaluateRegionalNarrativeHooks(
  simulationIn: Op10mSimulationSlice,
  narrativeIn: Op10mNarrativeEngineState,
  catalog: Op10mChainDescriptor[],
  hooks: Op10mRegionalNarrativeHook[]
): RegionalHookTickResult {
  let simulation = { ...simulationIn };
  let narrative: Op10mNarrativeEngineState = {
    ...narrativeIn,
    regional: sanitizeRegionalContagionLedger(narrativeIn.regional),
  };
  const log: string[] = [];
  const regional = narrative.regional!;

  const activeById = narrative.activeChains;
  const activeDescriptors = catalog.filter((c) => activeById[c.chainId]);

  for (const hook of hooks) {
    const cooldownKey = hookCooldownKey(hook.hookId);
    if (!isCooldownReady(narrative.cooldowns, cooldownKey, simulation.day)) continue;

    const sources = activeDescriptors.filter(
      (c) =>
        c.region === hook.sourceRegion &&
        c.theme === hook.theme &&
        PHASE_RANK[activeById[c.chainId].phase] >= PHASE_RANK[hook.watchPhase]
    );
    if (sources.length === 0) continue;

    const sourceChain = sources[0];
    const targets = hook.targetRegions.length > 0 ? hook.targetRegions : listNeighborRegions(hook.sourceRegion);

    const regionalStabilityDelta: Record<string, number> = {};
    const flagUpdates: Record<string, number> = {};
    const newFollowUps: Op10mArmedDeepChainFollowUp[] = [];
    const bypassIds: string[] = [];

    for (const targetRegion of targets) {
      regional.pressureByRegion[targetRegion] =
        (regional.pressureByRegion[targetRegion] ?? 0) + hook.contagionDelta;
      regionalStabilityDelta[targetRegion] = hook.neighborStabilityDelta;

      if (hook.setsContagionFlag) {
        const key = contagionFlagKey(targetRegion, hook.theme);
        flagUpdates[key] = getContagionLevel(simulation, targetRegion, hook.theme) + hook.contagionDelta;
      }

      if (hook.armNeighborFollowUp) {
        const targetChainId = findRegionalFollowUpChainId(catalog, targetRegion, hook.theme);
        if (targetChainId && !narrative.resolvedChainIds.includes(targetChainId)) {
          newFollowUps.push({
            id: `${hook.hookId}_arm_${targetChainId}_${simulation.day}`,
            sourceChainId: sourceChain.chainId,
            targetChainId,
            targetRegion,
            theme: hook.theme,
            armedDay: simulation.day,
            expiresDay: simulation.day + 8,
          });
          bypassIds.push(targetChainId);
        }
      }
    }

    const applied = applyConsequenceMutation(simulation, narrative, sourceChain.chainId, {
      regionalStabilityDelta,
      setFlags: flagUpdates,
      stabilityDelta: Math.floor(hook.neighborStabilityDelta / 2),
    });
    simulation = applied.simulation;
    narrative = applied.narrative;

    narrative = {
      ...narrative,
      cooldowns: recordCooldown(narrative, cooldownKey, simulation.day, hook.cooldownTurns),
      regional: {
        ...sanitizeRegionalContagionLedger(narrative.regional),
        firedHookIds: [...(narrative.regional?.firedHookIds ?? []), hook.hookId].slice(-400),
        armedFollowUps: [...(narrative.regional?.armedFollowUps ?? []), ...newFollowUps].slice(-80),
        armedBypassChainIds: [
          ...new Set([...(narrative.regional?.armedBypassChainIds ?? []), ...bypassIds]),
        ].slice(-80),
        pressureByRegion: regional.pressureByRegion,
      },
      telemetry: {
        ...narrative.telemetry,
        regionalHooksFired: (narrative.telemetry.regionalHooksFired ?? 0) + 1,
        deepFollowUpsArmed:
          (narrative.telemetry.deepFollowUpsArmed ?? 0) + newFollowUps.length,
      },
    };

    log.push(`regional hook ${hook.hookId} (${hook.narrativeBeat})`);
  }

  narrative = {
    ...narrative,
    regional: {
      ...sanitizeRegionalContagionLedger(narrative.regional),
      armedFollowUps: (narrative.regional?.armedFollowUps ?? []).filter(
        (f) => f.expiresDay >= simulation.day
      ),
      armedBypassChainIds: (narrative.regional?.armedBypassChainIds ?? []).filter((chainId) => {
        const stillArmed = (narrative.regional?.armedFollowUps ?? []).some(
          (f) => f.targetChainId === chainId && f.expiresDay >= simulation.day
        );
        return stillArmed;
      }),
    },
  };

  return { simulation, narrative, log };
}

export function phaseMeetsWatch(
  phase: Op10mChainPhase,
  watchPhase: Op10mChainPhase
): boolean {
  return PHASE_RANK[phase] >= PHASE_RANK[watchPhase];
}
