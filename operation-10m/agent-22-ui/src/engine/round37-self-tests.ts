import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { buildProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';
import { forecastUpcomingMilestones } from './milestone-forecast-coach.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildCalmRecoveryAutoAppliedDayCoach } from './calm-recovery-auto-applied-day-coach.js';
import { buildTextScaleDensityAppliedDayCoach } from './text-scale-density-applied-day-coach.js';
import { buildMilestoneForecastRosterDayCoach } from './milestone-forecast-roster-day-coach.js';
import { buildPreviewHeavyCoverageDayCoach } from './preview-heavy-coverage-day-coach.js';

export function runAgent22Round37SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r37_calm_applied',
    'calm recovery auto applied day coach',
    (() => {
      const coach = buildCalmRecoveryAutoAppliedDayCoach({ applied: true, nextGameDay: 5 });
      return coach.applied && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r37_text_scale_applied',
    'text scale density applied day coach',
    (() => {
      const coach = buildTextScaleDensityAppliedDayCoach({ applied: true, nextGameDay: 6 });
      return coach.applied && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r37_milestone_roster',
    'milestone forecast roster day coach',
    (() => {
      const entries = forecastUpcomingMilestones(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        2
      );
      const coach = buildMilestoneForecastRosterDayCoach({
        entries,
        nextGameDay: 2,
      });
      return entries.length === 0 || Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r37_preview_heavy',
    'preview heavy coverage day coach',
    (() => {
      const coach = buildPreviewHeavyCoverageDayCoach({
        snapshot: { preview: 5, visible: 2 },
        nextGameDay: 7,
      });
      return Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r37_tick_calm',
    'tick exposes calm recovery auto applied day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.calmRecoveryAutoAppliedDayCoachCopy === 'string' || r.calmRecoveryAutoAppliedDayCoachCopy === null;
    })()
  );

  check(
    'r37_tick_text_scale',
    'tick exposes text scale density applied day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', autoApplyTextScaleDensity: true }
      );
      return typeof r.textScaleDensityAppliedDayCoachCopy === 'string' || r.textScaleDensityAppliedDayCoachCopy === null;
    })()
  );

  check(
    'r37_tick_milestone',
    'tick exposes milestone forecast roster day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.milestoneForecastRosterDayCoachCopy === 'string' || r.milestoneForecastRosterDayCoachCopy === null;
    })()
  );

  check(
    'r37_tick_preview',
    'tick exposes preview heavy coverage day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.previewHeavyCoverageDayCoachCopy === 'string' || r.previewHeavyCoverageDayCoachCopy === null;
    })()
  );

  check(
    'r37_calm_not_applied',
    'calm applied null when false',
    (() => {
      const coach = buildCalmRecoveryAutoAppliedDayCoach({ applied: false, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r37_preview_balanced',
    'preview heavy null when balanced',
    (() => {
      const coach = buildPreviewHeavyCoverageDayCoach({
        snapshot: { preview: 1, visible: 4 },
        nextGameDay: 3,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r37_roster_empty',
    'milestone roster null when empty',
    (() => {
      const coach = buildMilestoneForecastRosterDayCoach({ entries: [], nextGameDay: 4 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r37_coverage_snapshot',
    'preview heavy uses snapshot from progression coverage',
    (() => {
      const snapshot = buildProgressionCoverageSnapshot(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const coach = buildPreviewHeavyCoverageDayCoach({ snapshot, nextGameDay: 3 });
      return coach.previewCount === snapshot.preview;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
