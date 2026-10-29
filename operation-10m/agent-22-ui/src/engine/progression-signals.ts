import type { InterfaceExperienceLevel, ProgressionSignalSnapshot } from '../types/progression.js';

/** Minimal game settings shape for bridging without importing V9.4. */
export interface V94GameSettingsSlice {
  smartSettingsProfile?: {
    interfaceLevel?: InterfaceExperienceLevel;
    guidance?: string;
  };
  presetSettings?: { activePreset?: string };
  playerIntentOnboardingEnabled?: boolean;
  accessibilitySettings?: Record<string, unknown>;
  evolvingUi?: {
    showAllPanelsOverride?: boolean;
    rememberedPanelIds?: string[];
  };
}

export interface V94GameStateSlice {
  gameDay?: number;
  turnCount?: number;
  day?: number;
}

export interface V94GuidedLearningSlice {
  concepts?: Record<string, { status?: string } | string>;
}

export function extractProgressionSignals(
  gameState: V94GameStateSlice | null | undefined,
  gameSettings: V94GameSettingsSlice | null | undefined,
  guidedLearning?: V94GuidedLearningSlice | null
): ProgressionSignalSnapshot {
  const day = Number(gameState?.gameDay ?? gameState?.day ?? 1);
  const turn = Number(gameState?.turnCount ?? day);
  const level = gameSettings?.smartSettingsProfile?.interfaceLevel ?? 'guided';
  const conceptStatuses: Record<string, 'locked' | 'introduced' | 'mastered'> = {};
  const rawConcepts = guidedLearning?.concepts ?? {};
  for (const [key, val] of Object.entries(rawConcepts)) {
    const status = typeof val === 'string' ? val : val?.status;
    if (status === 'introduced' || status === 'mastered' || status === 'locked') {
      conceptStatuses[key] = status;
    }
  }
  return {
    gameDay: Number.isFinite(day) ? day : 1,
    turnCount: Number.isFinite(turn) ? turn : 1,
    interfaceLevel: level,
    layoutPreset: gameSettings?.presetSettings?.activePreset,
    guidedConceptStatuses: conceptStatuses,
    completedMilestoneIds: [],
    playerIntentOnboardingEnabled: gameSettings?.playerIntentOnboardingEnabled !== false,
  };
}

export function deriveInterfaceLevelFromLayoutPreset(preset: string | undefined): InterfaceExperienceLevel | null {
  switch (preset) {
    case 'Clean':
      return 'simple';
    case 'Assisted':
      return 'guided';
    case 'Advanced':
      return 'advanced';
    case 'Developer':
      return 'expert';
    default:
      return null;
  }
}
