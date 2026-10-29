import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { buildProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildProgressionCoveragePercentDayCoach } from './progression-coverage-percent-day-coach.js';
import { buildCalmRecoveryActiveStatusDayCoach } from './calm-recovery-active-status-day-coach.js';
import { buildTextScaleHintPendingDayCoach } from './text-scale-hint-pending-day-coach.js';
import { buildShowAllPhaseRiskDayCoach } from './show-all-phase-risk-day-coach.js';

export function runAgent22Round39SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r39_coverage_percent',
    'progression coverage percent day coach early day',
    (() => {
      const coach = buildProgressionCoveragePercentDayCoach({
        coverageRatio: 0.25,
        nextGameDay: 3,
      });
      return coach.coveragePercent === 25 && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r39_calm_active',
    'calm recovery active status day coach',
    (() => {
      const coach = buildCalmRecoveryActiveStatusDayCoach({
        persisted: { calmRecoveryUntilDay: 10 },
        nextGameDay: 5,
      });
      return coach.active && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r39_text_hint_pending',
    'text scale hint pending day coach',
    (() => {
      const coach = buildTextScaleHintPendingDayCoach({
        hint: {
          activeDensity: 'compact',
          coachCopy: 'Consider spacious density for readability.',
          shouldSuggestDensityChange: true,
        },
        applied: false,
        nextGameDay: 4,
      });
      return coach.pendingSuggestion && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r39_show_all_phase',
    'show all phase risk day coach',
    (() => {
      const coach = buildShowAllPhaseRiskDayCoach({
        persisted: { showAllPanelsOverride: true },
        phase: 'main_menu',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'expert' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return coach.riskyPhase && Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r39_tick_coverage_percent',
    'tick exposes progression coverage percent day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.progressionCoveragePercentDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r39_tick_calm_status',
    'tick exposes calm recovery active status day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { calmRecoveryUntilDay: 8 },
        { phase: 'human_turn' }
      );
      return typeof r.calmRecoveryActiveStatusDayCoachCopy === 'string' || r.calmRecoveryActiveStatusDayCoachCopy === null;
    })()
  );

  check(
    'r39_tick_text_hint',
    'tick exposes text scale hint pending day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', autoApplyTextScaleDensity: false }
      );
      return typeof r.textScaleHintPendingDayCoachCopy === 'string' || r.textScaleHintPendingDayCoachCopy === null;
    })()
  );

  check(
    'r39_tick_phase_risk',
    'tick exposes show all phase risk day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'expert' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'expert' },
        { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        createDefaultEvolvingUiPersistedState(),
        { phase: 'main_menu' }
      );
      return Boolean(r.showAllPhaseRiskDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r39_percent_late',
    'coverage percent null late game',
    (() => {
      const coach = buildProgressionCoveragePercentDayCoach({
        coverageRatio: 0.5,
        nextGameDay: 20,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r39_calm_inactive',
    'calm active status null when inactive',
    (() => {
      const coach = buildCalmRecoveryActiveStatusDayCoach({
        persisted: {},
        nextGameDay: 3,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r39_hint_applied',
    'text hint pending null when applied',
    (() => {
      const coach = buildTextScaleHintPendingDayCoach({
        hint: { activeDensity: 'comfortable', coachCopy: 'x', shouldSuggestDensityChange: true },
        applied: true,
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r39_snapshot_percent',
    'coverage percent uses snapshot ratio',
    (() => {
      const snapshot = buildProgressionCoverageSnapshot(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const coach = buildProgressionCoveragePercentDayCoach({
        coverageRatio: snapshot.coverageRatio,
        nextGameDay: 4,
      });
      return coach.coveragePercent === Math.round(snapshot.coverageRatio * 100);
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
