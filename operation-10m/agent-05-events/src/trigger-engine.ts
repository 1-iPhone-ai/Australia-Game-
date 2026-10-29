import type {
  Op10mActiveChainRuntime,
  Op10mChainDescriptor,
  Op10mChainStageTemplate,
  Op10mCooldownEntry,
  Op10mNarrativeEngineState,
  Op10mSimulationSlice,
  Op10mTriggerRequirement,
} from './types.ts';

export function seasonForDay(day: number): Op10mSimulationSlice['season'] {
  const slot = Math.floor(((day - 1) % 360) / 90);
  return (['Spring', 'Summer', 'Autumn', 'Winter'] as const)[slot];
}

export function evaluateRequirements(
  requires: Op10mTriggerRequirement[],
  sim: Op10mSimulationSlice,
  chainRuntime: Op10mActiveChainRuntime | null
): { ok: boolean; reason: string } {
  for (const req of requires) {
    switch (req.k) {
      case 'season':
        if (!req.seasons.includes(sim.season)) {
          return { ok: false, reason: `season ${sim.season}` };
        }
        break;
      case 'sector': {
        const v = sim.sectorActivity[req.sector] ?? 0;
        if (v < req.min) return { ok: false, reason: `sector ${req.sector} ${v}<${req.min}` };
        break;
      }
      case 'stability':
        if (req.max !== undefined && sim.nationalStability > req.max) {
          return { ok: false, reason: `stability>${req.max}` };
        }
        if (req.min !== undefined && sim.nationalStability < req.min) {
          return { ok: false, reason: `stability<${req.min}` };
        }
        break;
      case 'money':
        if (req.max !== undefined && sim.money > req.max) {
          return { ok: false, reason: `money>${req.max}` };
        }
        if (req.min !== undefined && sim.money < req.min) {
          return { ok: false, reason: `money<${req.min}` };
        }
        break;
      case 'flag': {
        const val = sim.flags[req.key];
        if (req.equals !== undefined && val !== req.equals) {
          return { ok: false, reason: `flag ${req.key}` };
        }
        if (req.equals === undefined && !val) {
          return { ok: false, reason: `missing flag ${req.key}` };
        }
        break;
      }
      case 'no_flag':
        if (sim.flags[req.key]) return { ok: false, reason: `flag set ${req.key}` };
        break;
      case 'min_day':
        if (sim.day < req.day) return { ok: false, reason: `day<${req.day}` };
        break;
      case 'chain_phase':
        if (!chainRuntime || chainRuntime.phase !== req.phase) {
          return { ok: false, reason: `phase!=${req.phase}` };
        }
        break;
      default:
        break;
    }
  }
  return { ok: true, reason: 'ok' };
}

export function findStageForPhase(
  descriptor: Op10mChainDescriptor,
  phase: Op10mChainStageTemplate['phase']
): Op10mChainStageTemplate | undefined {
  return descriptor.phases.find((p) => p.phase === phase);
}

export function isCooldownReady(
  cooldowns: Op10mCooldownEntry[],
  key: string,
  day: number
): boolean {
  const entry = cooldowns.find((c) => c.key === key);
  if (!entry) return true;
  return day - entry.lastFiredDay >= entry.cooldownTurns;
}

export function recordCooldown(
  narrative: Op10mNarrativeEngineState,
  key: string,
  day: number,
  cooldownTurns: number
): Op10mCooldownEntry[] {
  const without = narrative.cooldowns.filter((c) => c.key !== key);
  return [...without, { key, lastFiredDay: day, cooldownTurns }];
}

export function nextPhase(current: Op10mChainStageTemplate['phase']): Op10mChainStageTemplate['phase'] | null {
  const order: Op10mChainStageTemplate['phase'][] = ['signal', 'pressure', 'rupture', 'recovery'];
  const idx = order.indexOf(current);
  if (idx < 0 || idx >= order.length - 1) return null;
  return order[idx + 1];
}
