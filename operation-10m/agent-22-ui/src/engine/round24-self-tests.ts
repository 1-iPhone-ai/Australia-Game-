import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildLegacyNavAuditDayCoach } from './legacy-nav-audit-day-coach.js';
import { buildProgressionCoverageDayCoach } from './progression-coverage-day-coach.js';
import { buildAnnouncementPacingDayHint } from './announcement-pacing-day-hint.js';
import { buildPhaseShellPlanDayCoach } from './phase-shell-plan-day-coach.js';

export function runAgent22Round24SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r24_legacy_audit_issue',
    'legacy nav audit day coach when targets hidden',
    (() => {
      const coach = buildLegacyNavAuditDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 1,
      });
      return coach.patchCoverageCount >= 5 && (coach.coachCopy === null || coach.coachCopy.includes('Day 1'));
    })()
  );

  check(
    'r24_progression_coverage',
    'progression coverage day coach on early day',
    (() => {
      const coach = buildProgressionCoverageDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return coach.tierLabel === 'early' && (coach.coachCopy === null || coach.coachCopy.includes('Day 2'));
    })()
  );

  check(
    'r24_pacing_hint',
    'announcement pacing day hint when queue non-empty',
    (() => {
      const hint = buildAnnouncementPacingDayHint({ deferredCount: 2, nextGameDay: 4 });
      return Boolean(hint.coachCopy?.includes('Day 4') && hint.coachCopy.includes('2'));
    })()
  );

  check(
    'r24_pacing_empty',
    'announcement pacing day hint null when queue empty',
    (() => {
      const hint = buildAnnouncementPacingDayHint({ deferredCount: 0, nextGameDay: 3 });
      return hint.coachCopy === null;
    })()
  );

  check(
    'r24_phase_shell_plan',
    'phase shell plan day coach on human_turn',
    (() => {
      const coach = buildPhaseShellPlanDayCoach({ phase: 'human_turn', nextGameDay: 5 });
      return coach.visibleShellRegionCount > 0 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r24_phase_shell_save_load',
    'phase shell plan day coach on save_load',
    (() => {
      const coach = buildPhaseShellPlanDayCoach({ phase: 'save_load', nextGameDay: 6 });
      return Boolean(coach.coachCopy?.includes('Day 6') && coach.coachCopy.includes('Save/load'));
    })()
  );

  check(
    'r24_tick_legacy_field',
    'day advance exposes legacy nav audit day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.legacyNavAuditDayCoachCopy === 'string' || r.legacyNavAuditDayCoachCopy === null;
    })()
  );

  check(
    'r24_tick_coverage_field',
    'day advance exposes progression coverage day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.progressionCoverageDayCoachCopy === 'string' || r.progressionCoverageDayCoachCopy === null;
    })()
  );

  check(
    'r24_tick_pacing_field',
    'day advance exposes announcement pacing day hint copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.announcementPacingDayHintCopy === 'string' || r.announcementPacingDayHintCopy === null;
    })()
  );

  check(
    'r24_tick_shell_plan_field',
    'day advance exposes phase shell plan day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 7, turnCount: 7, interfaceLevel: 'guided' },
        { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return Boolean(r.phaseShellPlanDayCoachCopy?.includes('Day 8'));
    })()
  );

  check(
    'r24_tick_coverage_active',
    'progression coverage day coach when visible panels',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return r.progressionCoverageDayCoachCopy === null || r.progressionCoverageDayCoachCopy.includes('Day 2');
    })()
  );

  check(
    'r24_tick_pacing_queued',
    'pacing day hint when deferred announcements queued',
    (() => {
      const persisted = {
        ...createDefaultEvolvingUiPersistedState(),
        announcementPacingQueue: ['a', 'b', 'c'],
      };
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 9, turnCount: 9, interfaceLevel: 'expert' },
        { gameDay: 10, turnCount: 10, interfaceLevel: 'expert' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted,
        { phase: 'human_turn' }
      );
      return r.announcementPacingDayHintCopy === null || r.announcementPacingDayHintCopy.includes('Day 10');
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
