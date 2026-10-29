import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import { buildProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildFourthUnlockHeadlineDayCoach } from './fourth-unlock-headline-day-coach.js';
import { buildDualDeferredQueueDayCoach } from './dual-deferred-queue-day-coach.js';
import { buildInterfaceLevelStableDayCoach } from './interface-level-stable-day-coach.js';
import { buildPreviewPanelSnapshotDayCoach } from './preview-panel-snapshot-day-coach.js';

export function runAgent22Round43SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const fourIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 4).map(p => p.id);

  check(
    'r43_fourth_unlock',
    'fourth unlock headline day coach',
    (() => {
      const coach = buildFourthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: fourIds,
        signals: { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        nextGameDay: 6,
      });
      return coach.panelId === fourIds[3] && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r43_dual_deferred',
    'dual deferred queue day coach',
    (() => {
      const coach = buildDualDeferredQueueDayCoach({ combinedQueueDepth: 2, nextGameDay: 7 });
      return coach.queueDepth === 2 && Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r43_interface_stable',
    'interface level stable day coach',
    (() => {
      const coach = buildInterfaceLevelStableDayCoach({
        priorLevel: 'simple',
        nextLevel: 'simple',
        nextGameDay: 5,
      });
      return Boolean(coach.coachCopy?.includes('Day 5')) && Boolean(coach.coachCopy?.includes('simple'));
    })()
  );

  check(
    'r43_preview_snapshot',
    'preview panel snapshot day coach',
    (() => {
      const snapshot = buildProgressionCoverageSnapshot(
        { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const coach = buildPreviewPanelSnapshotDayCoach({
        snapshot: { ...snapshot, preview: Math.max(snapshot.preview, 2) },
        nextGameDay: 8,
      });
      return coach.previewCount >= 2 && Boolean(coach.coachCopy?.includes('Day 8'));
    })()
  );

  check(
    'r43_tick_fourth_unlock',
    'tick exposes fourth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.fourthUnlockHeadlineDayCoachCopy === 'string' || r.fourthUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r43_tick_dual_deferred',
    'tick exposes dual deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.dualDeferredQueueDayCoachCopy === 'string' || r.dualDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r43_tick_interface_stable',
    'tick exposes interface level stable day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.interfaceLevelStableDayCoachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r43_tick_preview_snapshot',
    'tick exposes preview panel snapshot day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        { gameDay: 7, turnCount: 7, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.previewPanelSnapshotDayCoachCopy === 'string' || r.previewPanelSnapshotDayCoachCopy === null;
    })()
  );

  check(
    'r43_fourth_unlock_short',
    'fourth unlock null with fewer than four unlocks',
    (() => {
      const coach = buildFourthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: fourIds.slice(0, 3),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r43_dual_not_two',
    'dual deferred null when depth not two',
    (() => {
      const coach = buildDualDeferredQueueDayCoach({ combinedQueueDepth: 1, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r43_interface_shift',
    'interface stable null on level shift',
    (() => {
      const coach = buildInterfaceLevelStableDayCoach({
        priorLevel: 'simple',
        nextLevel: 'guided',
        nextGameDay: 4,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r43_preview_low',
    'preview snapshot null when preview below threshold',
    (() => {
      const coach = buildPreviewPanelSnapshotDayCoach({
        snapshot: {
          visible: 2,
          preview: 1,
          hidden: 10,
          total: 13,
          coverageRatio: 0.2,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 8,
      });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
