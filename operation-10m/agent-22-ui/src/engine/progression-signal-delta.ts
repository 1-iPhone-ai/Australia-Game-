import type { InterfaceExperienceLevel, ProgressionSignalSnapshot } from '../types/progression.js';

export interface ProgressionSignalDelta {
  dayDelta: number;
  interfaceLevelChanged: boolean;
  priorInterfaceLevel: InterfaceExperienceLevel;
  nextInterfaceLevel: InterfaceExperienceLevel;
  coachCopy: string | null;
}

export function computeProgressionSignalDelta(
  prior: ProgressionSignalSnapshot,
  next: ProgressionSignalSnapshot
): ProgressionSignalDelta {
  const dayDelta = next.gameDay - prior.gameDay;
  const interfaceLevelChanged = prior.interfaceLevel !== next.interfaceLevel;

  let coachCopy: string | null = null;
  if (interfaceLevelChanged) {
    coachCopy = `Interface experience shifted from ${prior.interfaceLevel} to ${next.interfaceLevel}.`;
  } else if (dayDelta >= 3) {
    coachCopy = `Large time jump (+${dayDelta} days) — review newly unlocked panels.`;
  }

  return {
    dayDelta,
    interfaceLevelChanged,
    priorInterfaceLevel: prior.interfaceLevel,
    nextInterfaceLevel: next.interfaceLevel,
    coachCopy,
  };
}

export function mergeLastInterfaceLevelIntoPersisted<
  T extends { lastInterfaceLevel?: InterfaceExperienceLevel },
>(persisted: T, level: InterfaceExperienceLevel): T {
  return { ...persisted, lastInterfaceLevel: level };
}
