import type { CognitiveLoadBand } from './cognitive-load-governor.js';

export interface CognitiveLoadBandDayCoach {
  band: CognitiveLoadBand;
  coachCopy: string | null;
}

export function buildCognitiveLoadBandDayCoach(input: {
  band: CognitiveLoadBand;
  nextGameDay: number;
}): CognitiveLoadBandDayCoach {
  if (input.band === 'light') {
    return { band: input.band, coachCopy: null };
  }
  return {
    band: input.band,
    coachCopy: `Day ${input.nextGameDay}: Cognitive load is ${input.band} — defer non-essential coaching surfaces.`,
  };
}
