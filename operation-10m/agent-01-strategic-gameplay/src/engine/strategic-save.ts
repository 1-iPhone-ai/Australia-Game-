import type { MandateProgress, StakeholderSentiment } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';
import { createEmptyMandateProgress } from './strategic-mandate.ts';

export interface StrategicGameplaySaveV1 {
  version: 1;
  day: number;
  completedActionIds: string[];
  pendingDelayed: StrategicGameplayState['pendingDelayed'];
  journal: StrategicGameplayState['journal'];
  priorityMomentum: StrategicGameplayState['priorityMomentum'];
  actionCooldowns: StrategicGameplayState['actionCooldowns'];
  activeChoice: StrategicGameplayState['activeChoice'];
}

export interface StrategicGameplaySaveV2 extends Omit<StrategicGameplaySaveV1, 'version'> {
  version: 2;
  mandateProgress: MandateProgress;
  stakeholderSentiment: StakeholderSentiment;
}

export interface StrategicGameplaySaveV3 extends Omit<StrategicGameplaySaveV2, 'version'> {
  version: 3;
  lastAlignedActionDay: number;
}

export interface StrategicGameplaySaveV4 extends Omit<StrategicGameplaySaveV3, 'version'> {
  version: 4;
  coalitionCrisisStreakDays: number;
}

export interface StrategicGameplaySaveV5 extends Omit<StrategicGameplaySaveV4, 'version'> {
  version: 5;
  coalitionRecoveryStreakDays: number;
}

export interface StrategicGameplaySaveV6 extends Omit<StrategicGameplaySaveV5, 'version'> {
  version: 6;
  coalitionVolatilityEvents: number;
}

export interface StrategicGameplaySaveV7 extends Omit<StrategicGameplaySaveV6, 'version'> {
  version: 7;
  coalitionStabilizationStreakDays: number;
}

export interface StrategicGameplaySaveV8 extends Omit<StrategicGameplaySaveV7, 'version'> {
  version: 8;
  coalitionLockInStreakDays: number;
  crossModuleSyncStreakDays: number;
}

export type StrategicGameplaySaveBlob =
  | StrategicGameplaySaveV1
  | StrategicGameplaySaveV2
  | StrategicGameplaySaveV3
  | StrategicGameplaySaveV4
  | StrategicGameplaySaveV5
  | StrategicGameplaySaveV6
  | StrategicGameplaySaveV7
  | StrategicGameplaySaveV8;

export function serializeStrategicGameplayState(
  state: StrategicGameplayState,
): StrategicGameplaySaveV8 {
  return {
    version: 8,
    day: state.day,
    completedActionIds: [...state.completedActionIds],
    pendingDelayed: state.pendingDelayed.map((p) => ({ ...p, effects: { ...p.effects } })),
    journal: state.journal.slice(),
    priorityMomentum: { ...state.priorityMomentum },
    actionCooldowns: { ...state.actionCooldowns },
    activeChoice: state.activeChoice ? { ...state.activeChoice } : null,
    mandateProgress: { ...(state.mandateProgress ?? createEmptyMandateProgress()) },
    stakeholderSentiment: {
      ...(state.stakeholderSentiment ?? createDefaultStakeholderSentiment()),
    },
    lastAlignedActionDay: state.lastAlignedActionDay ?? state.day,
    coalitionCrisisStreakDays: state.coalitionCrisisStreakDays ?? 0,
    coalitionRecoveryStreakDays: state.coalitionRecoveryStreakDays ?? 0,
    coalitionVolatilityEvents: state.coalitionVolatilityEvents ?? 0,
    coalitionStabilizationStreakDays: state.coalitionStabilizationStreakDays ?? 0,
    coalitionLockInStreakDays: state.coalitionLockInStreakDays ?? 0,
    crossModuleSyncStreakDays: state.crossModuleSyncStreakDays ?? 0,
  };
}

export function deserializeStrategicGameplayState(
  save: StrategicGameplaySaveBlob,
): StrategicGameplayState {
  if (save.version === 1) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: createEmptyMandateProgress(),
      stakeholderSentiment: createDefaultStakeholderSentiment(),
      lastAlignedActionDay: save.day,
      coalitionCrisisStreakDays: 0,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
    };
  }
  if (save.version === 2) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.day,
      coalitionCrisisStreakDays: 0,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
    };
  }
  if (save.version === 3) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: 0,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
    };
  }
  if (save.version === 4) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
    };
  }
  if (save.version === 5) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
    };
  }
  if (save.version === 6) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
    };
  }
  if (save.version === 7) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
    };
  }
  if (save.version !== 8) {
    throw new Error(`Unsupported strategic save version: ${(save as { version: number }).version}`);
  }
  return {
    day: save.day,
    completedActionIds: [...save.completedActionIds],
    pendingDelayed: save.pendingDelayed.slice(),
    journal: save.journal.slice(),
    priorityMomentum: { ...save.priorityMomentum },
    actionCooldowns: { ...save.actionCooldowns },
    activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
    mandateProgress: { ...save.mandateProgress },
    stakeholderSentiment: { ...save.stakeholderSentiment },
    lastAlignedActionDay: save.lastAlignedActionDay,
    coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
    coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
    coalitionVolatilityEvents: save.coalitionVolatilityEvents,
    coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
    coalitionLockInStreakDays: save.coalitionLockInStreakDays,
    crossModuleSyncStreakDays: save.crossModuleSyncStreakDays,
  };
}

export function mergeStrategicSaveIntoState(
  base: StrategicGameplayState,
  save: StrategicGameplaySaveBlob,
): StrategicGameplayState {
  const loaded = deserializeStrategicGameplayState(save);
  return {
    ...base,
    ...loaded,
    day: Math.max(base.day, loaded.day),
  };
}
