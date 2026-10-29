import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  assessCognitiveLoad,
  shouldShowCognitiveLoadCoach,
  snoozeCognitiveLoadCoachUntilDay,
} from './cognitive-load-governor.js';
import {
  flattenPacedAnnouncements,
  paceUnlockAnnouncements,
} from './announcement-pacing-policy.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';
import { motionTimingCssVars, resolveMotionTimingProfile } from './motion-timing-profile.js';

export function runAgent22Round5SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r5_motion_reduced_zero',
    'reduced motion zeroes transition duration',
    (() => {
      const density = resolveUiDensityProfile({ interfaceLevel: 'guided' });
      const profile = resolveMotionTimingProfile(
        { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: true },
        density
      );
      return profile.transitionDurationMs === 0 && profile.dataAttributes['data-motion-reduced'] === 'true';
    })()
  );

  check(
    'r5_motion_spacious_slower',
    'spacious density allows longer transitions than compact',
    (() => {
      const a11y = { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: false };
      const compact = resolveMotionTimingProfile(
        a11y,
        resolveUiDensityProfile({ interfaceLevel: 'expert', preferredTier: 'compact' })
      );
      const spacious = resolveMotionTimingProfile(
        a11y,
        resolveUiDensityProfile({ interfaceLevel: 'simple', preferredTier: 'spacious' })
      );
      return spacious.transitionDurationMs > compact.transitionDurationMs;
    })()
  );

  check(
    'r5_motion_css_vars',
    'motionTimingCssVars exposes stagger and transition',
    (() => {
      const vars = motionTimingCssVars(
        resolveMotionTimingProfile(
          DEFAULT_ACCESSIBILITY_SNAPSHOT,
          resolveUiDensityProfile({ interfaceLevel: 'guided' })
        )
      );
      return Number(vars['--evolving-ui-transition-ms']) > 0 && Number(vars['--evolving-ui-stagger-ms']) >= 0;
    })()
  );

  check(
    'r5_pace_batches',
    'announcement pacing splits long unlock lists',
    (() => {
      const batches = paceUnlockAnnouncements(
        ['a', 'b', 'c', 'd'],
        { reducedMotion: false, announceVerbosity: 'polite' }
      );
      return batches.length >= 2 && flattenPacedAnnouncements(batches).length === 4;
    })()
  );

  check(
    'r5_pace_off',
    'verbosity off schedules nothing',
    paceUnlockAnnouncements(['x'], { reducedMotion: false, announceVerbosity: 'off' }).length === 0
  );

  check(
    'r5_pace_minimal',
    'minimal verbosity uses single-item batches',
    (() => {
      const batches = paceUnlockAnnouncements(['one', 'two'], {
        reducedMotion: false,
        announceVerbosity: 'minimal',
      });
      return batches.length === 2 && batches.every(b => b.items.length === 1);
    })()
  );

  check(
    'r5_cognitive_early_guided',
    'early guided turn tends toward moderate/heavy load when many lanes active',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        pendingCoachAnnouncements: 3,
      });
      return assessment.score >= 30 && assessment.activeNotificationLanes >= 3;
    })()
  );

  check(
    'r5_cognitive_focus_relief',
    'focus session flag lowers score',
    (() => {
      const base = assessCognitiveLoad({
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      const focused = assessCognitiveLoad({
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        focusSessionActive: true,
      });
      return focused.score <= base.score;
    })()
  );

  check(
    'r5_cognitive_coach_heavy',
    'heavy band recommends deferring coach when backlog',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 8, turnCount: 8, interfaceLevel: 'advanced' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        pendingCoachAnnouncements: 4,
      });
      return assessment.band === 'heavy' && assessment.recommendDeferCoach;
    })()
  );

  check(
    'r5_coach_snooze',
    'snoozed coach hidden until day',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        pendingCoachAnnouncements: 2,
      });
      return (
        shouldShowCognitiveLoadCoach(assessment, 3, snoozeCognitiveLoadCoachUntilDay(3)) === false &&
        shouldShowCognitiveLoadCoach(assessment, 6, 5) === true
      );
    })()
  );

  check(
    'r5_snooze_day_math',
    'snoozeCognitiveLoadCoachUntilDay advances calendar',
    snoozeCognitiveLoadCoachUntilDay(2, 3) === 5
  );

  check(
    'r5_pace_stagger_motion',
    'pacing honors motion timing stagger',
    (() => {
      const batches = paceUnlockAnnouncements(['a', 'b', 'c'], {
        reducedMotion: false,
        announceVerbosity: 'polite',
        motionTiming: { staggerStepMs: 200 },
      });
      return batches.length >= 2 && (batches[1]?.delayMs ?? 0) >= 200;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
