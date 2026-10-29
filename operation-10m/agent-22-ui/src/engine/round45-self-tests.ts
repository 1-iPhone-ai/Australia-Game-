import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildSixthUnlockHeadlineDayCoach } from './sixth-unlock-headline-day-coach.js';
import { buildQuadDeferredQueueDayCoach } from './quad-deferred-queue-day-coach.js';
import { buildCoverageVisibleBreadthDayCoach } from './coverage-visible-breadth-day-coach.js';
import { buildPacingImmediateBatchDayCoach } from './pacing-immediate-batch-day-coach.js';

export function runAgent22Round45SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const sixIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 6).map(p => p.id);

  check(
    'r45_sixth_unlock',
    'sixth unlock headline day coach',
    (() => {
      const coach = buildSixthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: sixIds,
        signals: { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        nextGameDay: 8,
      });
      return coach.panelId === sixIds[5] && Boolean(coach.coachCopy?.includes('Day 8'));
    })()
  );

  check(
    'r45_quad_deferred',
    'quad deferred queue day coach',
    (() => {
      const coach = buildQuadDeferredQueueDayCoach({ combinedQueueDepth: 4, nextGameDay: 9 });
      return coach.queueDepth === 4 && Boolean(coach.coachCopy?.includes('Day 9'));
    })()
  );

  check(
    'r45_visible_breadth',
    'coverage visible breadth day coach',
    (() => {
      const coach = buildCoverageVisibleBreadthDayCoach({
        snapshot: {
          visible: 7,
          preview: 2,
          hidden: 4,
          total: 13,
          coverageRatio: 0.5,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 10,
      });
      return coach.visibleCount === 7 && Boolean(coach.coachCopy?.includes('Day 10'));
    })()
  );

  check(
    'r45_pacing_immediate',
    'pacing immediate batch day coach',
    (() => {
      const coach = buildPacingImmediateBatchDayCoach({ immediateAnnouncementCount: 3, nextGameDay: 5 });
      return coach.immediateCount === 3 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r45_tick_sixth_unlock',
    'tick exposes sixth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.sixthUnlockHeadlineDayCoachCopy === 'string' || r.sixthUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r45_tick_quad_deferred',
    'tick exposes quad deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.quadDeferredQueueDayCoachCopy === 'string' || r.quadDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r45_tick_visible_breadth',
    'tick exposes coverage visible breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.coverageVisibleBreadthDayCoachCopy === 'string' || r.coverageVisibleBreadthDayCoachCopy === null;
    })()
  );

  check(
    'r45_tick_pacing_immediate',
    'tick exposes pacing immediate batch day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingImmediateBatchDayCoachCopy === 'string' || r.pacingImmediateBatchDayCoachCopy === null;
    })()
  );

  check(
    'r45_sixth_unlock_short',
    'sixth unlock null with fewer than six unlocks',
    (() => {
      const coach = buildSixthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: sixIds.slice(0, 5),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r45_quad_not_four',
    'quad deferred null when depth not four',
    (() => {
      const coach = buildQuadDeferredQueueDayCoach({ combinedQueueDepth: 3, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r45_visible_low',
    'visible breadth null when visible below threshold',
    (() => {
      const coach = buildCoverageVisibleBreadthDayCoach({
        snapshot: {
          visible: 3,
          preview: 1,
          hidden: 9,
          total: 13,
          coverageRatio: 0.2,
          coachCopy: null,
          tierLabel: 'early',
        },
        nextGameDay: 8,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r45_pacing_single',
    'pacing immediate null when count below two',
    (() => {
      const coach = buildPacingImmediateBatchDayCoach({ immediateAnnouncementCount: 1, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
