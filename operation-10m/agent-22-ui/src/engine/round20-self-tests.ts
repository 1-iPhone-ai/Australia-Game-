import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { createDefaultSessionUiMemory, recordNavSelection } from '../sim/session-ui-memory.js';
import { buildAnnouncementDedupDayHint } from './announcement-dedup-day-hint.js';
import { buildLayoutPresetDensityDayCoach } from './layout-preset-density-day-coach.js';
import { buildMotionTimingDayCoach } from './motion-timing-day-coach.js';
import { buildMemoryQuickActionDayCoach } from './memory-quick-action-day-coach.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';

export function runAgent22Round20SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r20_dedup_hint',
    'announcement dedup day hint mentions day',
    (() => {
      const hint = buildAnnouncementDedupDayHint({ suppressedCount: 2, nextGameDay: 4 });
      return hint.suppressedCount === 2 && Boolean(hint.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r20_dedup_empty',
    'announcement dedup day hint null when none suppressed',
    (() => {
      const hint = buildAnnouncementDedupDayHint({ suppressedCount: 0, nextGameDay: 2 });
      return hint.coachCopy === null;
    })()
  );

  check(
    'r20_layout_mismatch',
    'layout preset density mismatch day coach',
    (() => {
      const coach = buildLayoutPresetDensityDayCoach({
        layoutPreset: 'Advanced',
        interfaceLevel: 'advanced',
        activeDensity: 'spacious',
        nextGameDay: 5,
      });
      return Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r20_layout_early_day',
    'layout preset density early day coach',
    (() => {
      const coach = buildLayoutPresetDensityDayCoach({
        interfaceLevel: 'simple',
        activeDensity: 'comfortable',
        nextGameDay: 2,
      });
      return Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r20_motion_reduced',
    'motion timing day coach under reduced motion',
    (() => {
      const coach = buildMotionTimingDayCoach({
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: true },
        densityTier: 'comfortable',
        interfaceLevel: 'guided',
        nextGameDay: 3,
      });
      return coach.reducedMotion && Boolean(coach.coachCopy?.includes('reduced-motion'));
    })()
  );

  check(
    'r20_motion_standard',
    'motion timing day coach off at defaults',
    (() => {
      const coach = buildMotionTimingDayCoach({
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: false, textScaleMultiplier: 1.0 },
        densityTier: 'compact',
        interfaceLevel: 'simple',
        nextGameDay: 6,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r20_memory_quick_action',
    'memory quick action day coach from session',
    (() => {
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const coach = buildMemoryQuickActionDayCoach({
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        phase: 'human_turn',
        sessionMemory: memory,
        nextGameDay: 3,
      });
      return Boolean(coach.coachCopy?.includes('Day 3') && coach.boostedNavTarget === 'map');
    })()
  );

  check(
    'r20_memory_empty',
    'memory quick action day coach null without memory',
    (() => {
      const coach = buildMemoryQuickActionDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        phase: 'human_turn',
        sessionMemory: createDefaultSessionUiMemory(),
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r20_tick_dedup_field',
    'day advance exposes announcement dedup day hint copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.announcementDedupDayHintCopy === 'string' || r.announcementDedupDayHintCopy === null;
    })()
  );

  check(
    'r20_tick_layout_field',
    'day advance exposes layout preset density day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', layoutPreset: 'Assisted' }
      );
      return typeof r.layoutPresetDensityDayCoachCopy === 'string' || r.layoutPresetDensityDayCoachCopy === null;
    })()
  );

  check(
    'r20_tick_motion_field',
    'day advance exposes motion timing day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        {
          phase: 'human_turn',
          accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: true },
        }
      );
      return typeof r.motionTimingDayCoachCopy === 'string' || r.motionTimingDayCoachCopy === null;
    })()
  );

  check(
    'r20_tick_memory_field',
    'day advance exposes memory quick action day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        {
          phase: 'human_turn',
          sessionMemory: recordNavSelection(createDefaultSessionUiMemory(), 'map'),
        }
      );
      return typeof r.memoryQuickActionDayCoachCopy === 'string' || r.memoryQuickActionDayCoachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
