import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildAnnouncementQueueDepthDayCoach } from './announcement-queue-depth-day-coach.js';
import { buildDedupSuppressedBatchDayCoach } from './dedup-suppressed-batch-day-coach.js';
import { buildLegacyNavRememberAppliedDayCoach } from './legacy-nav-remember-applied-day-coach.js';
import { buildCoachAnnouncementVolumeDayCoach } from './coach-announcement-volume-day-coach.js';

export function runAgent22Round36SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r36_queue_depth',
    'announcement queue depth day coach',
    (() => {
      const coach = buildAnnouncementQueueDepthDayCoach({ combinedQueueDepth: 3, nextGameDay: 4 });
      return coach.queueDepth === 3 && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r36_dedup_suppressed',
    'dedup suppressed batch day coach',
    (() => {
      const coach = buildDedupSuppressedBatchDayCoach({ suppressedCount: 2, nextGameDay: 5 });
      return coach.suppressedCount === 2 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r36_legacy_remember',
    'legacy nav remember applied day coach',
    (() => {
      const coach = buildLegacyNavRememberAppliedDayCoach({
        rememberedCount: 2,
        applied: true,
        nextGameDay: 6,
      });
      return coach.rememberedCount === 2 && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r36_announcement_volume',
    'coach announcement volume day coach',
    (() => {
      const coach = buildCoachAnnouncementVolumeDayCoach({
        coachAnnouncementCount: 3,
        nextGameDay: 7,
      });
      return coach.announcementCount === 3 && Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r36_tick_queue',
    'tick exposes announcement queue depth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.announcementQueueDepthDayCoachCopy === 'string' || r.announcementQueueDepthDayCoachCopy === null;
    })()
  );

  check(
    'r36_tick_dedup',
    'tick exposes dedup suppressed batch day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.dedupSuppressedBatchDayCoachCopy === 'string' || r.dedupSuppressedBatchDayCoachCopy === null;
    })()
  );

  check(
    'r36_tick_legacy_remember',
    'tick exposes legacy nav remember applied day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', autoRememberLegacyNav: true }
      );
      return typeof r.legacyNavRememberAppliedDayCoachCopy === 'string' || r.legacyNavRememberAppliedDayCoachCopy === null;
    })()
  );

  check(
    'r36_tick_volume',
    'tick exposes coach announcement volume day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.coachAnnouncementVolumeDayCoachCopy === 'string' || r.coachAnnouncementVolumeDayCoachCopy === null;
    })()
  );

  check(
    'r36_queue_shallow',
    'queue depth null when shallow',
    (() => {
      const coach = buildAnnouncementQueueDepthDayCoach({ combinedQueueDepth: 1, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r36_dedup_zero',
    'dedup suppressed null when zero',
    (() => {
      const coach = buildDedupSuppressedBatchDayCoach({ suppressedCount: 0, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r36_remember_not_applied',
    'legacy remember null when not applied',
    (() => {
      const coach = buildLegacyNavRememberAppliedDayCoach({
        rememberedCount: 1,
        applied: false,
        nextGameDay: 3,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r36_volume_low',
    'announcement volume null for single announcement',
    (() => {
      const coach = buildCoachAnnouncementVolumeDayCoach({ coachAnnouncementCount: 1, nextGameDay: 4 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
