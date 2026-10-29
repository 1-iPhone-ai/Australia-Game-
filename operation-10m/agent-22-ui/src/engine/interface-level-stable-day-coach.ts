import type { InterfaceExperienceLevel } from '../types/progression.js';

export interface InterfaceLevelStableDayCoach {
  interfaceLevel: InterfaceExperienceLevel;
  coachCopy: string | null;
}

export function buildInterfaceLevelStableDayCoach(input: {
  priorLevel: InterfaceExperienceLevel;
  nextLevel: InterfaceExperienceLevel;
  nextGameDay: number;
}): InterfaceLevelStableDayCoach {
  if (input.priorLevel !== input.nextLevel || input.nextGameDay > 10) {
    return { interfaceLevel: input.nextLevel, coachCopy: null };
  }
  return {
    interfaceLevel: input.nextLevel,
    coachCopy: `Day ${input.nextGameDay}: Interface level stays on ${input.nextLevel} — coach hints match yesterday's density.`,
  };
}
