import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { createDefaultSessionUiMemory, recordNavSelection } from '../sim/session-ui-memory.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';
import {
  appendToAnnouncementPacingQueue,
  deferredFlushStatusCopy,
  flushDeferredAnnouncementQueue,
  mergeAnnouncementPacingQueueIntoPersisted,
} from './deferred-announcement-flush.js';
import {
  buildSessionResumeCoachPlan,
  sessionResumeSkipLinkLabel,
} from './session-resume-coach.js';
import {
  listContextualQuickActions,
} from './contextual-quick-actions.js';
import {
  memoryQuickActionCoachCopy,
  rankContextualQuickActionsWithMemory,
} from './memory-weighted-quick-actions.js';
import { resolveAccessibleChromeShellProfile } from './accessible-chrome-shell.js';
import { meetsMinimumTouchTarget, resolveTouchTargetProfile } from './touch-target-scaling.js';

export function runAgent22Round10SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r10_flush_delivers_batch',
    'flush delivers first paced batch from queue',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const flush = flushDeferredAnnouncementQueue(
        ['one', 'two', 'three', 'four'],
        DEFAULT_ACCESSIBILITY_SNAPSHOT,
        density
      );
      return flush.flushedAnnouncements.length >= 1 && flush.remainingCount >= 1;
    })()
  );

  check(
    'r10_flush_copy',
    'flush status copy mentions delivered count',
    Boolean(deferredFlushStatusCopy(2, 1)?.includes('Delivered'))
  );

  check(
    'r10_queue_persist',
    'merge queue into persisted slice',
    (() => {
      const merged = mergeAnnouncementPacingQueueIntoPersisted(createDefaultEvolvingUiPersistedState(), ['a', 'b']);
      return merged.announcementPacingQueue?.length === 2 && merged.announcementPacingDeferredCount === 2;
    })()
  );

  check(
    'r10_tick_flushes_prior_queue',
    'day advance exposes flushed deferred count',
    (() => {
      const persisted = mergeAnnouncementPacingQueueIntoPersisted(createDefaultEvolvingUiPersistedState(), [
        'queued coach line one',
        'queued coach line two',
        'queued coach line three',
      ]);
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted
      );
      return r.flushedDeferredAnnouncementCount >= 1;
    })()
  );

  check(
    'r10_append_queue',
    'append extends pacing queue',
    appendToAnnouncementPacingQueue(['a'], ['b']).length === 2
  );

  check(
    'r10_resume_plan',
    'session resume plan suggests last nav target',
    (() => {
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const plan = buildSessionResumeCoachPlan({
        memory,
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      });
      return plan.shouldShow && plan.navTarget === 'map';
    })()
  );

  check(
    'r10_resume_skip_label',
    'resume skip link references panel label',
    (() => {
      const plan = buildSessionResumeCoachPlan({
        memory: recordNavSelection(createDefaultSessionUiMemory(), 'map'),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      });
      return Boolean(sessionResumeSkipLinkLabel(plan)?.includes('Skip'));
    })()
  );

  check(
    'r10_memory_rank_boost',
    'memory ranking promotes recent nav action',
    (() => {
      const base = listContextualQuickActions('human_turn', 5);
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const ranked = rankContextualQuickActionsWithMemory(base, memory);
      return ranked[0]?.navTarget === 'map';
    })()
  );

  check(
    'r10_memory_coach_copy',
    'memory quick action copy mentions pin',
    Boolean(memoryQuickActionCoachCopy('map')?.includes('Pinned'))
  );

  check(
    'r10_accessible_shell_vars',
    'accessible chrome shell merges motion and touch vars',
    (() => {
      const shell = resolveAccessibleChromeShellProfile({
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        interfaceLevel: 'guided',
      });
      return (
        Boolean(shell.style['--evolving-ui-transition-ms']) &&
        Boolean(shell.style['--evolving-ui-touch-min-px'])
      );
    })()
  );

  check(
    'r10_touch_meets_minimum',
    'touch profile meets scaled minimum',
    (() => {
      const profile = resolveTouchTargetProfile('spacious', DEFAULT_ACCESSIBILITY_SNAPSHOT);
      return meetsMinimumTouchTarget(profile, profile.minHeightPx);
    })()
  );

  check(
    'r10_resume_hidden_without_hints',
    'resume coach hidden when keyboard hints off',
    (() => {
      const plan = buildSessionResumeCoachPlan({
        memory: recordNavSelection(createDefaultSessionUiMemory(), 'map'),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, keyboardNavigationHints: false },
      });
      return !plan.shouldShow;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
