import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { createDefaultEvolvingUiPersistedState, tickEvolvingUiOnDayAdvance } from '../sim/evolution-hooks.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';
import {
  buildPacedAnnouncementSchedule,
  mergePacingDeferredIntoPersisted,
  pacingStatusCopy,
} from './paced-announcement-scheduler.js';
import {
  detectKeyboardShortcutConflicts,
  planKeyboardShortcutConflicts,
  shortcutConflictWarningCopy,
} from './keyboard-shortcut-conflict-guard.js';
import {
  coalesceDuplicateLiveRegionText,
  drainLiveRegionQueue,
  enqueueLiveRegionMessage,
  liveRegionQueueSummaryCopy,
} from './live-region-priority-queue.js';
import { motionTimingCssVars, resolveMotionTimingProfile } from './motion-timing-profile.js';
import { EVOLVING_UI_KEYBOARD_SHORTCUTS } from './keyboard-shortcut-progression.js';

export function runAgent22Round9SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r9_pacing_defers_overflow',
    'pacing defers announcements beyond first batch',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const schedule = buildPacedAnnouncementSchedule(
        ['one', 'two', 'three', 'four'],
        DEFAULT_ACCESSIBILITY_SNAPSHOT,
        density
      );
      return schedule.immediateAnnouncements.length >= 1 && schedule.deferredCount >= 1;
    })()
  );

  check(
    'r9_pacing_copy',
    'pacing status copy mentions deferred count',
    Boolean(pacingStatusCopy(3)?.includes('3'))
  );

  check(
    'r9_tick_sets_deferred',
    'day advance exposes deferred coach count',
    (() => {
      const prior = { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' as const };
      const next = { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' as const };
      const r = tickEvolvingUiOnDayAdvance(prior, next, DEFAULT_EVOLVING_UI_ACCESS_POLICY, createDefaultEvolvingUiPersistedState());
      return typeof r.deferredCoachAnnouncementCount === 'number';
    })()
  );

  check(
    'r9_persist_merge_deferred',
    'merge pacing deferred into persisted',
    (() => {
      const merged = mergePacingDeferredIntoPersisted(createDefaultEvolvingUiPersistedState(), 2);
      return merged.announcementPacingDeferredCount === 2;
    })()
  );

  check(
    'r9_conflict_detect',
    'detects duplicate key bindings',
    (() => {
      const sample = [
        EVOLVING_UI_KEYBOARD_SHORTCUTS[0],
        { ...EVOLVING_UI_KEYBOARD_SHORTCUTS[0], id: 'dup', actionLabel: 'Duplicate' },
      ];
      return detectKeyboardShortcutConflicts(sample).length === 1;
    })()
  );

  check(
    'r9_conflict_plan_empty_simple',
    'simple human turn has no shortcut conflicts',
    planKeyboardShortcutConflicts('simple', 'human_turn').length === 0
  );

  check(
    'r9_conflict_warning_copy',
    'conflict warning mentions rebind',
    (() => {
      const conflicts = detectKeyboardShortcutConflicts([
        EVOLVING_UI_KEYBOARD_SHORTCUTS[0],
        { ...EVOLVING_UI_KEYBOARD_SHORTCUTS[0], id: 'dup', actionLabel: 'Other' },
      ]);
      return Boolean(shortcutConflictWarningCopy(conflicts)?.includes('Rebind'));
    })()
  );

  check(
    'r9_live_region_priority',
    'assertive messages drain before polite',
    (() => {
      let q = enqueueLiveRegionMessage([], {
        id: 'p1',
        text: 'polite',
        politeness: 'polite',
        priority: 'polite',
      });
      q = enqueueLiveRegionMessage(q, {
        id: 'a1',
        text: 'urgent',
        politeness: 'assertive',
        priority: 'assertive',
      });
      const { drained } = drainLiveRegionQueue(q, 1);
      return drained[0]?.priority === 'assertive';
    })()
  );

  check(
    'r9_live_region_coalesce',
    'coalesce drops duplicate text',
    (() => {
      const q = coalesceDuplicateLiveRegionText([
        {
          id: '1',
          text: 'Hello',
          politeness: 'polite',
          priority: 'polite',
          createdAt: 1,
        },
        {
          id: '2',
          text: 'hello',
          politeness: 'polite',
          priority: 'polite',
          createdAt: 2,
        },
      ]);
      return q.length === 1;
    })()
  );

  check(
    'r9_live_region_summary',
    'queue summary mentions count',
    Boolean(liveRegionQueueSummaryCopy([
      {
        id: '1',
        text: 'x',
        politeness: 'assertive',
        priority: 'assertive',
        createdAt: 1,
      },
    ])?.includes('priority'))
  );

  check(
    'r9_motion_chrome_vars',
    'motion timing css vars include transition ms',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'simple' });
      const profile = resolveMotionTimingProfile(DEFAULT_ACCESSIBILITY_SNAPSHOT, density);
      return Boolean(motionTimingCssVars(profile)['--evolving-ui-transition-ms']);
    })()
  );

  check(
    'r9_reduced_motion_zero_transition',
    'reduced motion zeroes transition duration',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const profile = resolveMotionTimingProfile(
        { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: true },
        density
      );
      return profile.transitionDurationMs === 0;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
