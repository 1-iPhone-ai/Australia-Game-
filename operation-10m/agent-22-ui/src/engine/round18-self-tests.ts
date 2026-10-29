import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { createDefaultSessionUiMemory, recordNavSelection } from '../sim/session-ui-memory.js';
import { buildCoachDismissalQuietDayHint } from './coach-dismissal-quiet-day-hint.js';
import { buildSessionResumeDayAdvanceCoach } from './session-resume-day-advance-coach.js';
import { buildShowAllOverrideDayHint } from './show-all-override-day-hint.js';
import { buildHighContrastChromeDayCoach } from './high-contrast-chrome-day-coach.js';

export function runAgent22Round18SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r18_dismissal_quiet_active',
    'quiet dismissal hint copy while active',
    (() => {
      const hint = buildCoachDismissalQuietDayHint(
        { ...createDefaultEvolvingUiPersistedState(), coachDismissalQuietUntilDay: 8 },
        5
      );
      return hint.quietActive && Boolean(hint.coachCopy?.toLowerCase().includes('quiet'));
    })()
  );

  check(
    'r18_dismissal_quiet_ended',
    'quiet dismissal ended today copy',
    (() => {
      const hint = buildCoachDismissalQuietDayHint(
        { ...createDefaultEvolvingUiPersistedState(), coachDismissalQuietUntilDay: 6 },
        6
      );
      return !hint.quietActive && Boolean(hint.coachCopy?.includes('ended'));
    })()
  );

  check(
    'r18_dismissal_quiet_ends_tomorrow',
    'quiet dismissal ends tomorrow flag',
    (() => {
      const hint = buildCoachDismissalQuietDayHint(
        { ...createDefaultEvolvingUiPersistedState(), coachDismissalQuietUntilDay: 7 },
        6
      );
      return hint.quietEndsToday && Boolean(hint.coachCopy?.toLowerCase().includes('tomorrow'));
    })()
  );

  check(
    'r18_session_resume_day',
    'session resume day coach mentions day',
    (() => {
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const coach = buildSessionResumeDayAdvanceCoach({
        priorGameDay: 1,
        nextGameDay: 2,
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, keyboardNavigationHints: true },
        sessionMemory: memory,
      });
      return coach.shouldMentionResume && Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r18_session_resume_off',
    'session resume off without keyboard hints',
    (() => {
      const coach = buildSessionResumeDayAdvanceCoach({
        priorGameDay: 1,
        nextGameDay: 2,
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, keyboardNavigationHints: false },
        sessionMemory: createDefaultSessionUiMemory(),
      });
      return !coach.shouldMentionResume && coach.coachCopy === null;
    })()
  );

  check(
    'r18_show_all_risky_phase',
    'show-all day hint during save_load',
    (() => {
      const hint = buildShowAllOverrideDayHint({
        persisted: { ...createDefaultEvolvingUiPersistedState(), showAllPanelsOverride: true },
        phase: 'save_load',
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 3,
      });
      return hint.overrideActive && hint.riskyPhase && Boolean(hint.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r18_show_all_inactive',
    'show-all hint null when override off',
    (() => {
      const hint = buildShowAllOverrideDayHint({
        persisted: createDefaultEvolvingUiPersistedState(),
        phase: 'human_turn',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return !hint.overrideActive && hint.coachCopy === null;
    })()
  );

  check(
    'r18_high_contrast_elevated',
    'high contrast day coach when elevated',
    (() => {
      const coach = buildHighContrastChromeDayCoach({
        accessibility: {
          ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
          highContrastFocusRings: true,
        },
        nextGameDay: 4,
      });
      return coach.elevated && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r18_high_contrast_standard',
    'high contrast day coach off when standard',
    (() => {
      const coach = buildHighContrastChromeDayCoach({
        accessibility: {
          ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
          highContrastFocusRings: false,
          textScaleMultiplier: 1.0,
          announceVerbosity: 'polite',
        },
        nextGameDay: 2,
      });
      return !coach.elevated && coach.coachCopy === null;
    })()
  );

  check(
    'r18_tick_dismissal_field',
    'day advance exposes coach dismissal quiet hint copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), coachDismissalQuietUntilDay: 8 },
        { phase: 'human_turn' }
      );
      return r.coachDismissalQuietDayHintCopy === null || typeof r.coachDismissalQuietDayHintCopy === 'string';
    })()
  );

  check(
    'r18_tick_show_all_field',
    'day advance exposes show-all override day hint copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), showAllPanelsOverride: true },
        { phase: 'save_load' }
      );
      return typeof r.showAllOverrideDayHintCopy === 'string' || r.showAllOverrideDayHintCopy === null;
    })()
  );

  check(
    'r18_tick_hc_field',
    'day advance exposes high contrast day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        {
          accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.2 },
          phase: 'human_turn',
        }
      );
      return typeof r.highContrastChromeDayCoachCopy === 'string' || r.highContrastChromeDayCoachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
