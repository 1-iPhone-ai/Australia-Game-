import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildGuidedLearningPanelDayCoach } from './guided-learning-panel-day-coach.js';
import { buildCalmRecoveryStatusDayCoach } from './calm-recovery-status-day-coach.js';
import { buildPhaseShellAttentionDayCoach } from './phase-shell-attention-day-coach.js';
import { buildModalFocusTrapDayCoach } from './modal-focus-trap-day-coach.js';

export function runAgent22Round26SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r26_guided_panel',
    'guided learning panel day coach with concept',
    (() => {
      const coach = buildGuidedLearningPanelDayCoach({
        signals: {
          gameDay: 4,
          turnCount: 4,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { capital_allocation: 'introduced' },
        },
        nextGameDay: 4,
      });
      return coach.hintCount > 0 && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r26_calm_recovery',
    'calm recovery status day coach when active',
    (() => {
      const coach = buildCalmRecoveryStatusDayCoach({
        persisted: { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 10 },
        nextGameDay: 5,
      });
      return coach.active && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r26_calm_inactive',
    'calm recovery status day coach null when inactive',
    (() => {
      const coach = buildCalmRecoveryStatusDayCoach({
        persisted: createDefaultEvolvingUiPersistedState(),
        nextGameDay: 3,
      });
      return !coach.active && coach.coachCopy === null;
    })()
  );

  check(
    'r26_phase_attention',
    'phase shell attention day coach on save_load',
    (() => {
      const coach = buildPhaseShellAttentionDayCoach({
        phase: 'save_load',
        band: 'moderate',
        persisted: createDefaultEvolvingUiPersistedState(),
        nextGameDay: 6,
      });
      return Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r26_modal_trap',
    'modal focus trap day coach when modal open',
    (() => {
      const coach = buildModalFocusTrapDayCoach({
        openModalId: 'investments_modal',
        nextGameDay: 7,
      });
      return coach.trapActive && Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r26_modal_clear',
    'modal focus trap day coach null without modal',
    (() => {
      const coach = buildModalFocusTrapDayCoach({ openModalId: null, nextGameDay: 2 });
      return !coach.trapActive && coach.coachCopy === null;
    })()
  );

  check(
    'r26_tick_guided_panel_field',
    'day advance exposes guided learning panel day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        {
          gameDay: 4,
          turnCount: 4,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { liquidity: 'mastered' },
        },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.guidedLearningPanelDayCoachCopy === 'string' || r.guidedLearningPanelDayCoachCopy === null;
    })()
  );

  check(
    'r26_tick_calm_field',
    'day advance exposes calm recovery status day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 5 },
        { phase: 'human_turn' }
      );
      return Boolean(r.calmRecoveryStatusDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r26_tick_attention_day_field',
    'day advance exposes phase shell attention day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return Boolean(r.phaseShellAttentionDayCoachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r26_tick_modal_field',
    'day advance exposes modal focus trap day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 8, turnCount: 8, interfaceLevel: 'expert' },
        { gameDay: 9, turnCount: 9, interfaceLevel: 'expert' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', openModalId: 'loans_modal' }
      );
      return Boolean(r.modalFocusTrapDayCoachCopy?.includes('Day 9'));
    })()
  );

  check(
    'r26_tick_guided_panel_active',
    'guided panel day coach copy when concept introduced',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        {
          gameDay: 7,
          turnCount: 7,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { opportunity_cost: 'introduced' },
        },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.guidedLearningPanelDayCoachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r26_guided_panel_empty',
    'guided learning panel day coach null without concepts',
    (() => {
      const coach = buildGuidedLearningPanelDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
      });
      return coach.hintCount === 0 && coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
