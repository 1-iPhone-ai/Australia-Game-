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

export interface StrategicGameplaySaveV9 extends Omit<StrategicGameplaySaveV8, 'version'> {
  version: 9;
  integratedCoalitionMaturityStreakDays: number;
}

export interface StrategicGameplaySaveV10 extends Omit<StrategicGameplaySaveV9, 'version'> {
  version: 10;
  coalitionStewardshipStreakDays: number;
}

export interface StrategicGameplaySaveV11 extends Omit<StrategicGameplaySaveV10, 'version'> {
  version: 11;
  coalitionAnchoredGovernanceStreakDays: number;
}

export interface StrategicGameplaySaveV12 extends Omit<StrategicGameplaySaveV11, 'version'> {
  version: 12;
  coalitionInstitutionalPermanenceStreakDays: number;
}

export interface StrategicGameplaySaveV13 extends Omit<StrategicGameplaySaveV12, 'version'> {
  version: 13;
  coalitionGenerationalContinuityStreakDays: number;
}

export interface StrategicGameplaySaveV14 extends Omit<StrategicGameplaySaveV13, 'version'> {
  version: 14;
  coalitionCivilizationalEnduranceStreakDays: number;
}

export interface StrategicGameplaySaveV15 extends Omit<StrategicGameplaySaveV14, 'version'> {
  version: 15;
  coalitionTranscendentLegacyStreakDays: number;
}

export interface StrategicGameplaySaveV16 extends Omit<StrategicGameplaySaveV15, 'version'> {
  version: 16;
  coalitionSovereignContinuumStreakDays: number;
}

export interface StrategicGameplaySaveV17 extends Omit<StrategicGameplaySaveV16, 'version'> {
  version: 17;
  coalitionEternalAscendanceStreakDays: number;
}

export interface StrategicGameplaySaveV18 extends Omit<StrategicGameplaySaveV17, 'version'> {
  version: 18;
  coalitionInfinitePersistenceStreakDays: number;
}

export interface StrategicGameplaySaveV19 extends Omit<StrategicGameplaySaveV18, 'version'> {
  version: 19;
  coalitionPrimordialContinuityStreakDays: number;
}

export interface StrategicGameplaySaveV20 extends Omit<StrategicGameplaySaveV19, 'version'> {
  version: 20;
  coalitionAbsoluteSanctityStreakDays: number;
}

export interface StrategicGameplaySaveV21 extends Omit<StrategicGameplaySaveV20, 'version'> {
  version: 21;
  coalitionUniversalImmortalityStreakDays: number;
}

export interface StrategicGameplaySaveV22 extends Omit<StrategicGameplaySaveV21, 'version'> {
  version: 22;
  coalitionCosmicPerpetuityStreakDays: number;
}

export interface StrategicGameplaySaveV23 extends Omit<StrategicGameplaySaveV22, 'version'> {
  version: 23;
  coalitionGalacticInfinityStreakDays: number;
}

export interface StrategicGameplaySaveV24 extends Omit<StrategicGameplaySaveV23, 'version'> {
  version: 24;
  coalitionStellarTranscendenceStreakDays: number;
}

export interface StrategicGameplaySaveV25 extends Omit<StrategicGameplaySaveV24, 'version'> {
  version: 25;
  coalitionQuantumOmnipresenceStreakDays: number;
}

export type StrategicGameplaySaveBlob =
  | StrategicGameplaySaveV1
  | StrategicGameplaySaveV2
  | StrategicGameplaySaveV3
  | StrategicGameplaySaveV4
  | StrategicGameplaySaveV5
  | StrategicGameplaySaveV6
  | StrategicGameplaySaveV7
  | StrategicGameplaySaveV8
  | StrategicGameplaySaveV9
  | StrategicGameplaySaveV10
  | StrategicGameplaySaveV11
  | StrategicGameplaySaveV12
  | StrategicGameplaySaveV13
  | StrategicGameplaySaveV14
  | StrategicGameplaySaveV15
  | StrategicGameplaySaveV16
  | StrategicGameplaySaveV17
  | StrategicGameplaySaveV18
  | StrategicGameplaySaveV19
  | StrategicGameplaySaveV20
  | StrategicGameplaySaveV21
  | StrategicGameplaySaveV22
  | StrategicGameplaySaveV23
  | StrategicGameplaySaveV24
  | StrategicGameplaySaveV25;

export function serializeStrategicGameplayState(
  state: StrategicGameplayState,
): StrategicGameplaySaveV25 {
  return {
    version: 25,
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
    integratedCoalitionMaturityStreakDays: state.integratedCoalitionMaturityStreakDays ?? 0,
    coalitionStewardshipStreakDays: state.coalitionStewardshipStreakDays ?? 0,
    coalitionAnchoredGovernanceStreakDays: state.coalitionAnchoredGovernanceStreakDays ?? 0,
    coalitionInstitutionalPermanenceStreakDays: state.coalitionInstitutionalPermanenceStreakDays ?? 0,
    coalitionGenerationalContinuityStreakDays: state.coalitionGenerationalContinuityStreakDays ?? 0,
    coalitionCivilizationalEnduranceStreakDays: state.coalitionCivilizationalEnduranceStreakDays ?? 0,
    coalitionTranscendentLegacyStreakDays: state.coalitionTranscendentLegacyStreakDays ?? 0,
    coalitionSovereignContinuumStreakDays: state.coalitionSovereignContinuumStreakDays ?? 0,
    coalitionEternalAscendanceStreakDays: state.coalitionEternalAscendanceStreakDays ?? 0,
    coalitionInfinitePersistenceStreakDays: state.coalitionInfinitePersistenceStreakDays ?? 0,
    coalitionPrimordialContinuityStreakDays: state.coalitionPrimordialContinuityStreakDays ?? 0,
    coalitionAbsoluteSanctityStreakDays: state.coalitionAbsoluteSanctityStreakDays ?? 0,
    coalitionUniversalImmortalityStreakDays: state.coalitionUniversalImmortalityStreakDays ?? 0,
    coalitionCosmicPerpetuityStreakDays: state.coalitionCosmicPerpetuityStreakDays ?? 0,
    coalitionGalacticInfinityStreakDays: state.coalitionGalacticInfinityStreakDays ?? 0,
    coalitionStellarTranscendenceStreakDays: state.coalitionStellarTranscendenceStreakDays ?? 0,
    coalitionQuantumOmnipresenceStreakDays: state.coalitionQuantumOmnipresenceStreakDays ?? 0,
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
    };
  }
  if (save.version === 8) {
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
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
    };
  }
  if (save.version === 9) {
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
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
    };
  }
  if (save.version === 10) {
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
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
    };
  }
  if (save.version === 11) {
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
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
      coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
    };
  }
  if (save.version === 12) {
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
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
      coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
      coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
      coalitionGenerationalContinuityStreakDays: 0,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
    };
  }
  if (save.version === 13) {
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
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
      coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
      coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
      coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
    };
  }
  if (save.version === 14) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: 0,
    coalitionSovereignContinuumStreakDays: 0,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 15) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: 0,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 16) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 17) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 18) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 19) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 20) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 21) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 22) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 23) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version === 24) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: 0,
  };
  }
  if (save.version !== 25) {
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
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
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
