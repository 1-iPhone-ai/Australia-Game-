import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildSeventhUnlockHeadlineDayCoach } from './seventh-unlock-headline-day-coach.js';
import { buildPentDeferredQueueDayCoach } from './pent-deferred-queue-day-coach.js';
import { buildPreviewPanelBreadthDayCoach } from './preview-panel-breadth-day-coach.js';
import { buildPacingDeferredPairDayCoach } from './pacing-deferred-pair-day-coach.js';

export function runAgent22Round46SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const sevenIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 7).map(p => p.id);

  check(
    'r46_seventh_unlock',
    'seventh unlock headline day coach',
    (() => {
      const coach = buildSeventhUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: sevenIds,
        signals: { gameDay: 9, turnCount: 9, interfaceLevel: 'guided' },
        nextGameDay: 9,
      });
      return coach.panelId === sevenIds[6] && Boolean(coach.coachCopy?.includes('Day 9'));
    })()
  );

  check(
    'r46_pent_deferred',
    'pent deferred queue day coach',
    (() => {
      const coach = buildPentDeferredQueueDayCoach({ combinedQueueDepth: 5, nextGameDay: 10 });
      return coach.queueDepth === 5 && Boolean(coach.coachCopy?.includes('Day 10'));
    })()
  );

  check(
    'r46_preview_breadth',
    'preview panel breadth day coach',
    (() => {
      const coach = buildPreviewPanelBreadthDayCoach({
        snapshot: {
          visible: 4,
          preview: 3,
          hidden: 6,
          total: 13,
          coverageRatio: 0.3,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 11,
      });
      return coach.previewCount === 3 && Boolean(coach.coachCopy?.includes('Day 11'));
    })()
  );

  check(
    'r46_pacing_deferred_pair',
    'pacing deferred pair day coach',
    (() => {
      const coach = buildPacingDeferredPairDayCoach({ pacingDeferredCount: 2, nextGameDay: 6 });
      return coach.deferredCount === 2 && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r46_tick_seventh_unlock',
    'tick exposes seventh unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.seventhUnlockHeadlineDayCoachCopy === 'string' || r.seventhUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r46_tick_pent_deferred',
    'tick exposes pent deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pentDeferredQueueDayCoachCopy === 'string' || r.pentDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r46_tick_preview_breadth',
    'tick exposes preview panel breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.previewPanelBreadthDayCoachCopy === 'string' || r.previewPanelBreadthDayCoachCopy === null;
    })()
  );

  check(
    'r46_tick_pacing_pair',
    'tick exposes pacing deferred pair day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredPairDayCoachCopy === 'string' || r.pacingDeferredPairDayCoachCopy === null;
    })()
  );

  check(
    'r46_seventh_unlock_short',
    'seventh unlock null with fewer than seven unlocks',
    (() => {
      const coach = buildSeventhUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: sevenIds.slice(0, 6),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r46_pent_not_five',
    'pent deferred null when depth not five',
    (() => {
      const coach = buildPentDeferredQueueDayCoach({ combinedQueueDepth: 4, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r46_preview_low',
    'preview breadth null when preview below threshold',
    (() => {
      const coach = buildPreviewPanelBreadthDayCoach({
        snapshot: {
          visible: 2,
          preview: 2,
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
    'r46_pacing_not_pair',
    'pacing deferred pair null when count not two',
    (() => {
      const coach = buildPacingDeferredPairDayCoach({ pacingDeferredCount: 1, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
