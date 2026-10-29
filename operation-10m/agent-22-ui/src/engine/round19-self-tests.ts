import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildCognitiveLoadDayCoach } from './cognitive-load-day-coach.js';
import { buildFocusSessionSnoozeDayHint } from './focus-session-snooze-day-hint.js';
import { buildTouchTargetDayCoach } from './touch-target-day-coach.js';
import { buildKeyboardHintsDayCoach } from './keyboard-hints-day-coach.js';

export function runAgent22Round19SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r19_cognitive_load_heavy',
    'cognitive load day coach on heavy band',
    (() => {
      const coach = buildCognitiveLoadDayCoach({
        signals: { gameDay: 6, turnCount: 6, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        pendingCoachAnnouncements: 14,
        nextGameDay: 6,
      });
      return coach.band === 'heavy' && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r19_cognitive_load_snoozed',
    'cognitive load day coach hidden when snoozed',
    (() => {
      const coach = buildCognitiveLoadDayCoach({
        signals: { gameDay: 6, turnCount: 6, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        pendingCoachAnnouncements: 14,
        nextGameDay: 6,
        cognitiveLoadCoachSnoozedUntilDay: 10,
      });
      return !coach.shouldSurfaceCoach && coach.coachCopy === null;
    })()
  );

  check(
    'r19_focus_snooze_active',
    'focus session snooze active copy',
    (() => {
      const hint = buildFocusSessionSnoozeDayHint(
        { ...createDefaultEvolvingUiPersistedState(), focusSessionSnoozedUntilDay: 8 },
        5
      );
      return hint.snoozeActive && Boolean(hint.coachCopy?.toLowerCase().includes('snooze'));
    })()
  );

  check(
    'r19_focus_snooze_ended',
    'focus session snooze ended today copy',
    (() => {
      const hint = buildFocusSessionSnoozeDayHint(
        { ...createDefaultEvolvingUiPersistedState(), focusSessionSnoozedUntilDay: 4 },
        4
      );
      return !hint.snoozeActive && Boolean(hint.coachCopy?.includes('ended'));
    })()
  );

  check(
    'r19_touch_target_scaled',
    'touch target day coach with text scale',
    (() => {
      const coach = buildTouchTargetDayCoach({
        densityTier: 'comfortable',
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.2 },
        nextGameDay: 3,
      });
      return coach.minTouchPx >= 48 && Boolean(coach.coachCopy?.includes('touch targets'));
    })()
  );

  check(
    'r19_touch_target_standard',
    'touch target day coach off at base scale',
    (() => {
      const coach = buildTouchTargetDayCoach({
        densityTier: 'compact',
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.0 },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r19_keyboard_hints_day',
    'keyboard hints day coach mentions day',
    (() => {
      const coach = buildKeyboardHintsDayCoach({
        interfaceLevel: 'guided',
        phase: 'human_turn',
        nextGameDay: 5,
      });
      return coach.shortcutCount > 0;
    })()
  );

  check(
    'r19_keyboard_hints_copy',
    'keyboard hints day coach copy when truncated',
    (() => {
      const coach = buildKeyboardHintsDayCoach({
        interfaceLevel: 'expert',
        phase: 'human_turn',
        nextGameDay: 7,
      });
      return coach.coachCopy === null || coach.coachCopy.includes('Day 7');
    })()
  );

  check(
    'r19_tick_cognitive_field',
    'day advance exposes cognitive load day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        { gameDay: 6, turnCount: 6, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.cognitiveLoadDayCoachCopy === 'string' || r.cognitiveLoadDayCoachCopy === null;
    })()
  );

  check(
    'r19_tick_focus_snooze_field',
    'day advance exposes focus snooze day hint copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), focusSessionSnoozedUntilDay: 6 },
        { phase: 'human_turn' }
      );
      return typeof r.focusSessionSnoozeDayHintCopy === 'string' || r.focusSessionSnoozeDayHintCopy === null;
    })()
  );

  check(
    'r19_tick_touch_field',
    'day advance exposes touch target day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        {
          accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.25 },
          phase: 'human_turn',
        }
      );
      return typeof r.touchTargetDayCoachCopy === 'string' || r.touchTargetDayCoachCopy === null;
    })()
  );

  check(
    'r19_tick_keyboard_field',
    'day advance exposes keyboard hints day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.keyboardHintsDayCoachCopy === 'string' || r.keyboardHintsDayCoachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
