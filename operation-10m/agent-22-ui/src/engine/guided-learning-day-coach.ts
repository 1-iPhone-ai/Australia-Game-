import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  buildGuidedLearningPanelHints,
  guidedLearningPanelCoachCopy,
} from './guided-learning-panel-bridge.js';

export interface GuidedLearningDayCoach {
  hintCount: number;
  coachCopy: string | null;
}

export function buildGuidedLearningDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): GuidedLearningDayCoach {
  const hints = buildGuidedLearningPanelHints(input.signals);
  const base = guidedLearningPanelCoachCopy(hints);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;

  return {
    hintCount: hints.length,
    coachCopy,
  };
}
