import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { isCoalitionStabilizationReady } from '../engine/coalition-stabilization.ts';
import { isElevatedCoalitionVolatility } from '../engine/coalition-volatility-pressure.ts';

/** Inbound flags mirrored from Agent 05 pending-response / Agent 02 batch stabilization exports. */
export interface StrategicCrossModuleInbound {
  postQueueCalm?: boolean;
  pendingStabilizationWave?: boolean;
}

export function normalizeStrategicCrossModuleInbound(
  raw: StrategicCrossModuleInbound | undefined,
): Required<StrategicCrossModuleInbound> {
  return {
    postQueueCalm: raw?.postQueueCalm ?? false,
    pendingStabilizationWave: raw?.pendingStabilizationWave ?? false,
  };
}

export function crossModuleStabilizationAligned(
  state: StrategicGameplayState,
  inbound: StrategicCrossModuleInbound | undefined,
): boolean {
  const flags = normalizeStrategicCrossModuleInbound(inbound);
  if (!flags.postQueueCalm || !flags.pendingStabilizationWave) return false;
  if (isElevatedCoalitionVolatility(state)) return false;
  return (
    isCoalitionStabilizationReady(state) ||
    (state.coalitionStabilizationStreakDays ?? 0) >= 1
  );
}

export function advanceCrossModuleSyncStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
  inbound: StrategicCrossModuleInbound | undefined,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!crossModuleStabilizationAligned(state, inbound)) {
    if ((state.crossModuleSyncStreakDays ?? 0) === 0) return state;
    return { ...state, crossModuleSyncStreakDays: 0 };
  }
  return {
    ...state,
    crossModuleSyncStreakDays: (state.crossModuleSyncStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCrossModuleSyncStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, crossModuleSyncStreakDays: 0 };
}
