import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildAttentionSurfaceDayCoach } from './attention-surface-day-coach.js';
import { buildGuidedLearningDayCoach } from './guided-learning-day-coach.js';
import { buildKeyboardShortcutConflictDayCoach } from './keyboard-shortcut-conflict-day-coach.js';
import { buildContextualWidgetDayCoach } from './contextual-widget-day-coach.js';

export function runAgent22Round23SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r23_attention_deferral',
    'attention surface day coach when budget tight',
    (() => {
      const coach = buildAttentionSurfaceDayCoach({
        band: 'heavy',
        phase: 'save_load',
        nextGameDay: 4,
        cognitiveLoadCoachRequested: true,
        panelUnlockCoachRequested: true,
        simEvolutionBridgeRequested: true,
        keyboardHintsRequested: true,
        focusSessionBannerRequested: true,
      });
      return coach.deferredSurfaceCount > 0 && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r23_attention_clear',
    'attention surface day coach null when nothing deferred',
    (() => {
      const coach = buildAttentionSurfaceDayCoach({
        band: 'light',
        phase: 'human_turn',
        nextGameDay: 2,
        cognitiveLoadCoachRequested: false,
        panelUnlockCoachRequested: false,
        simEvolutionBridgeRequested: false,
        keyboardHintsRequested: false,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r23_guided_learning',
    'guided learning day coach with introduced concept',
    (() => {
      const coach = buildGuidedLearningDayCoach({
        signals: {
          gameDay: 5,
          turnCount: 5,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { capital_allocation: 'introduced' },
        },
        nextGameDay: 5,
      });
      return coach.hintCount > 0 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r23_guided_empty',
    'guided learning day coach null without concepts',
    (() => {
      const coach = buildGuidedLearningDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
      });
      return coach.hintCount === 0 && coach.coachCopy === null;
    })()
  );

  check(
    'r23_shortcut_conflict',
    'keyboard shortcut conflict day coach copy shape',
    (() => {
      const coach = buildKeyboardShortcutConflictDayCoach({
        interfaceLevel: 'expert',
        phase: 'human_turn',
        nextGameDay: 8,
      });
      return coach.conflictCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 8'));
    })()
  );

  check(
    'r23_contextual_widget',
    'contextual widget day coach on early day',
    (() => {
      const coach = buildContextualWidgetDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 1,
        contextualShouldShowByWidget: { guardian_floating_button: true },
      });
      return coach.hiddenWidgetCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 1'));
    })()
  );

  check(
    'r23_tick_attention_field',
    'day advance exposes attention surface day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        { gameDay: 6, turnCount: 6, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return typeof r.attentionSurfaceDayCoachCopy === 'string' || r.attentionSurfaceDayCoachCopy === null;
    })()
  );

  check(
    'r23_tick_guided_field',
    'day advance exposes guided learning day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        {
          gameDay: 5,
          turnCount: 5,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { liquidity: 'mastered' },
        },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.guidedLearningDayCoachCopy === 'string' || r.guidedLearningDayCoachCopy === null;
    })()
  );

  check(
    'r23_tick_shortcut_field',
    'day advance exposes keyboard conflict day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'expert' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'expert' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.keyboardShortcutConflictDayCoachCopy === 'string' || r.keyboardShortcutConflictDayCoachCopy === null;
    })()
  );

  check(
    'r23_tick_widget_field',
    'day advance exposes contextual widget day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.contextualWidgetDayCoachCopy === 'string' || r.contextualWidgetDayCoachCopy === null;
    })()
  );

  check(
    'r23_tick_guided_active',
    'day advance guided learning copy when concept mastered',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        {
          gameDay: 7,
          turnCount: 7,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { capital_allocation: 'mastered' },
        },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.guidedLearningDayCoachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r23_tick_attention_deferred',
    'save_load day advance may defer attention surfaces',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        { gameDay: 9, turnCount: 9, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return r.attentionSurfaceDayCoachCopy === null || r.attentionSurfaceDayCoachCopy.includes('Day 9');
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
