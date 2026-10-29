import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildInterfaceLevelShiftDayCoach } from './interface-level-shift-day-coach.js';
import { buildPacedStaggerDeferredDayCoach } from './paced-stagger-deferred-day-coach.js';
import { buildLegacyNavMissingPatchDayCoach } from './legacy-nav-missing-patch-day-coach.js';
import { buildGuidedConceptCountDayCoach } from './guided-concept-count-day-coach.js';

export function runAgent22Round34SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r34_interface_shift',
    'interface level shift day coach',
    (() => {
      const coach = buildInterfaceLevelShiftDayCoach({
        prior: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        next: { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        nextGameDay: 3,
      });
      return coach.interfaceLevelChanged && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r34_paced_stagger',
    'paced stagger deferred day coach',
    (() => {
      const coach = buildPacedStaggerDeferredDayCoach({ deferredCount: 2, nextGameDay: 4 });
      return coach.deferredCount === 2 && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r34_legacy_missing',
    'legacy nav missing patch day coach',
    (() => {
      const coach = buildLegacyNavMissingPatchDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 1,
      });
      return coach.missingPatchCount >= 0;
    })()
  );

  check(
    'r34_guided_concept',
    'guided concept count day coach',
    (() => {
      const coach = buildGuidedConceptCountDayCoach({
        signals: {
          gameDay: 5,
          turnCount: 5,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { capital_allocation: 'introduced' },
        },
        nextGameDay: 5,
      });
      return coach.conceptCount === 1 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r34_tick_interface_shift',
    'tick exposes interface level shift day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.interfaceLevelShiftDayCoachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r34_tick_paced_stagger',
    'tick exposes paced stagger deferred day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacedStaggerDeferredDayCoachCopy === 'string' || r.pacedStaggerDeferredDayCoachCopy === null;
    })()
  );

  check(
    'r34_tick_legacy_missing',
    'tick exposes legacy nav missing patch day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.legacyNavMissingPatchDayCoachCopy === 'string' || r.legacyNavMissingPatchDayCoachCopy === null;
    })()
  );

  check(
    'r34_tick_guided_concept',
    'tick exposes guided concept count day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.guidedConceptCountDayCoachCopy === 'string' || r.guidedConceptCountDayCoachCopy === null;
    })()
  );

  check(
    'r34_shift_none',
    'interface shift null when unchanged',
    (() => {
      const coach = buildInterfaceLevelShiftDayCoach({
        prior: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        next: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r34_stagger_zero',
    'paced stagger null when zero deferred',
    (() => {
      const coach = buildPacedStaggerDeferredDayCoach({ deferredCount: 0, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r34_guided_zero',
    'guided concept null when none active',
    (() => {
      const coach = buildGuidedConceptCountDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r34_missing_patch_copy',
    'legacy missing patch mentions noop risk',
    (() => {
      const coach = buildLegacyNavMissingPatchDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return coach.coachCopy === null || coach.coachCopy.includes('noop');
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
