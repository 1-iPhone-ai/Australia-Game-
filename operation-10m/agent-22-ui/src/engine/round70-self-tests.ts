import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildSixteenthUnlockHeadlineDayCoach } from './sixteenth-unlock-headline-day-coach.js';
import { buildQuattuordecimDeferredQueueDayCoach } from './quattuordecim-deferred-queue-day-coach.js';
import { buildPreviewCoverageBreadthDayCoach } from './preview-coverage-breadth-day-coach.js';
import { buildPacingDeferredJanDayCoach } from './pacing-deferred-jan-day-coach.js';

export function runAgent22Round70SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const twelveIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 16).map(p => p.id);

  check(
    'r55_sixteenth_unlock',
    'sixteenth unlock headline day coach',
    (() => {
      const coach = buildSixteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds,
        signals: { gameDay: 19, turnCount: 19, interfaceLevel: 'guided' },
        nextGameDay: 18,
      });
      return coach.panelId === twelveIds[15] && Boolean(coach.coachCopy?.includes('Day 18'));
    })()
  );

  check(
    'r55_quattuordecim_deferred',
    'quattuordecim deferred queue day coach',
    (() => {
      const coach = buildQuattuordecimDeferredQueueDayCoach({ combinedQueueDepth: 14, nextGameDay: 18 });
      return coach.queueDepth === 14 && Boolean(coach.coachCopy?.includes('Day 18'));
    })()
  );

  check(
    'r55_preview_fraction_breadth',
    'preview fraction breadth day coach',
    (() => {
      const coach = buildPreviewCoverageBreadthDayCoach({
        snapshot: {
          visible: 4,
          preview: 3,
          hidden: 3,
          total: 10,
          coverageRatio: 0.6,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 13,
      });
      return coach.coverageRatio === 0.6 && Boolean(coach.coachCopy?.includes('Day 13'));
    })()
  );

  check(
    'r55_pacing_deferred_dec',
    'pacing deferred jan day coach',
    (() => {
      const coach = buildPacingDeferredJanDayCoach({ pacingDeferredCount: 8, nextGameDay: 12 });
      return coach.deferredCount === 8 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r55_tick_sixteenth_unlock',
    'tick exposes sixteenth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.sixteenthUnlockHeadlineDayCoachCopy === 'string' ||
        r.sixteenthUnlockHeadlineDayCoachCopy === null
      );
    })()
  );

  check(
    'r55_tick_quattuordecim_deferred',
    'tick exposes quattuordecim deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.quattuordecimDeferredQueueDayCoachCopy === 'string' || r.quattuordecimDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r55_tick_preview_fraction_breadth',
    'tick exposes preview fraction breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.previewCoverageBreadthDayCoachCopy === 'string' ||
        r.previewCoverageBreadthDayCoachCopy === null
      );
    })()
  );

  check(
    'r55_tick_pacing_dec',
    'tick exposes pacing deferred jan day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredJanDayCoachCopy === 'string' || r.pacingDeferredJanDayCoachCopy === null;
    })()
  );

  check(
    'r55_sixteenth_unlock_short',
    'sixteenth unlock null with fewer than twelve unlocks',
    (() => {
      const coach = buildSixteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds.slice(0, 15),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r55_quattuordecim_not_ten',
    'quattuordecim deferred null when depth not ten',
    (() => {
      const coach = buildQuattuordecimDeferredQueueDayCoach({ combinedQueueDepth: 9, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r55_preview_fraction_low',
    'preview fraction breadth null when fraction below threshold',
    (() => {
      const coach = buildPreviewCoverageBreadthDayCoach({
        snapshot: {
          visible: 4,
          preview: 2,
          hidden: 4,
          total: 10,
          coverageRatio: 0.5,
          coachCopy: null,
          tierLabel: 'early',
        },
        nextGameDay: 10,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r55_pacing_not_dec',
    'pacing deferred jan null when count not seven',
    (() => {
      const coach = buildPacingDeferredJanDayCoach({ pacingDeferredCount: 6, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
