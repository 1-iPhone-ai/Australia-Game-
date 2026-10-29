import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { createDefaultEvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import {
  coachDismissalQuietCopy,
  isCoachDismissalQuiet,
  mergeCoachDismissalIntoPersisted,
  recordCoachDismissal,
  resolveCoachDismissalSnoozeDays,
  shouldAllowCoachSurface,
} from './coach-dismissal-backoff.js';
import {
  compareLandmarkReadingOrder,
  landmarkTargetForSurface,
  planLandmarkReadingOrder,
} from './landmark-reading-order.js';
import {
  highContrastChromeCssVars,
  mergeHighContrastChromeStyle,
  resolveHighContrastChromeProfile,
} from './high-contrast-chrome-policy.js';

export function runAgent22Round7SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r7_snooze_grows',
    'dismissal snooze grows with streak',
    resolveCoachDismissalSnoozeDays(1) < resolveCoachDismissalSnoozeDays(4)
  );

  check(
    'r7_snooze_cap',
    'snooze days capped at seven',
    resolveCoachDismissalSnoozeDays(99) === 7
  );

  check(
    'r7_quiet_blocks_coach',
    'quiet window blocks coach surfaces',
    (() => {
      const persisted = { coachDismissalQuietUntilDay: 8 };
      return !shouldAllowCoachSurface(5, persisted) && isCoachDismissalQuiet(persisted, 5);
    })()
  );

  check(
    'r7_record_merge',
    'record dismissal merges into persisted',
    (() => {
      const base = createDefaultEvolvingUiPersistedState();
      const record = recordCoachDismissal(base, 10);
      const merged = mergeCoachDismissalIntoPersisted(base, record);
      return merged.coachDismissalStreak === 1 && (merged.coachDismissalQuietUntilDay ?? 0) > 10;
    })()
  );

  check(
    'r7_quiet_copy',
    'quiet copy mentions remaining days',
    coachDismissalQuietCopy(12, 10).includes('2')
  );

  check(
    'r7_landmark_role_order',
    'status landmarks sort before navigation',
    compareLandmarkReadingOrder(
      landmarkTargetForSurface('coach_banner', 'Coach', true, 1),
      landmarkTargetForSurface('nav_rail', 'Nav', true, 1)
    ) < 0
  );

  check(
    'r7_landmark_plan_skip',
    'reading plan exposes skip labels for nav/main',
    (() => {
      const plan = planLandmarkReadingOrder({
        phase: 'human_turn',
        landmarks: [
          landmarkTargetForSurface('nav_primary', 'Primary nav', true, 1),
          landmarkTargetForSurface('main_map', 'Map', true, 2),
          landmarkTargetForSurface('widget_lane', 'Widgets', true, 3),
        ],
      });
      return plan.skipLinkLabels.length >= 2 && plan.skipLinkLabels[0].startsWith('Skip to');
    })()
  );

  check(
    'r7_main_menu_nav_first',
    'main menu phase pulls navigation earlier',
    (() => {
      const plan = planLandmarkReadingOrder({
        phase: 'main_menu',
        landmarks: [
          landmarkTargetForSurface('main_title', 'Title', true, 1),
          landmarkTargetForSurface('nav_menu', 'Menu', true, 2),
        ],
      });
      return plan.ordered[0]?.role === 'navigation';
    })()
  );

  check(
    'r7_hc_elevated_border',
    'high contrast elevates border width',
    (() => {
      const standard = resolveHighContrastChromeProfile({
        ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
        highContrastFocusRings: false,
        textScaleMultiplier: 1,
      });
      const elevated = resolveHighContrastChromeProfile({
        ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
        highContrastFocusRings: true,
      });
      return elevated.borderWidthPx > standard.borderWidthPx && elevated.elevated;
    })()
  );

  check(
    'r7_hc_css_vars',
    'chrome css vars exported',
    Object.keys(highContrastChromeCssVars(resolveHighContrastChromeProfile(DEFAULT_ACCESSIBILITY_SNAPSHOT))).length >= 3
  );

  check(
    'r7_hc_merge_style',
    'merge chrome style preserves base keys',
    (() => {
      const merged = mergeHighContrastChromeStyle(DEFAULT_ACCESSIBILITY_SNAPSHOT, { color: 'inherit' });
      return merged.color === 'inherit' && merged['--evolving-ui-chrome-border-px'] != null;
    })()
  );

  check(
    'r7_allow_after_quiet',
    'coach allowed after quiet window ends',
    shouldAllowCoachSurface(10, { coachDismissalQuietUntilDay: 10 })
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
