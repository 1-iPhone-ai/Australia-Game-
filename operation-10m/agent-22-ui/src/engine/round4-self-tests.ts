import { resolveUiDensityProfile, cycleUiDensityTier, listEligibleDensityTiers } from './ui-density-progression.js';
import {
  shouldActivateFocusSession,
  listPanelsSuppressedByFocusSession,
  snoozeFocusSessionUntilDay,
  resolveEvolvingPanelVisibilityWithFocusSession,
} from './focus-session-policy.js';
import { classifyViewportWidth, deriveResponsiveLayoutHints } from './responsive-layout-hints.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultSessionUiMemory,
  recordNavSelection,
  suggestResumeNavTarget,
  mergeSessionMemoryIntoPersisted,
} from '../sim/session-ui-memory.js';
import { createDefaultEvolvingUiPersistedState } from '../sim/evolution-hooks.js';

export function runAgent22Round4SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r4_density_simple',
    'simple level defaults to spacious density',
    resolveUiDensityProfile({ interfaceLevel: 'simple' }).tier === 'spacious'
  );

  check(
    'r4_density_cycle',
    'density cycles within eligible tiers',
    cycleUiDensityTier('spacious', 'simple') === 'comfortable'
  );

  check(
    'r4_density_expert_compact',
    'Developer preset implies compact when unset',
    resolveUiDensityProfile({ interfaceLevel: 'expert', layoutPreset: 'Developer' }).tier === 'compact'
  );

  check(
    'r4_focus_early_turn',
    'focus session active on early guided human turn',
    shouldActivateFocusSession({
      phase: 'human_turn',
      signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
      policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
    })
  );

  check(
    'r4_focus_snooze',
    'snooze disables focus until day',
    !shouldActivateFocusSession({
      phase: 'human_turn',
      signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
      policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      focusSessionSnoozedUntilDay: 5,
    })
  );

  check(
    'r4_focus_suppress',
    'focus session suppresses launcher panels',
    (() => {
      const suppressed = listPanelsSuppressedByFocusSession(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        'human_turn'
      );
      return suppressed.some(id => id === 'quick_actions' || id.includes('ask_game'));
    })()
  );

  check(
    'r4_responsive_narrow',
    'narrow viewport collapses nav rail',
    deriveResponsiveLayoutHints({ viewportWidthPx: 640 }).collapseNavRail === true
  );

  check(
    'r4_viewport_band',
    'classifyViewportWidth medium band',
    classifyViewportWidth(900) === 'medium'
  );

  check(
    'r4_session_resume',
    'session memory resumes last visible nav',
    (() => {
      const mem = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      return suggestResumeNavTarget(
        mem,
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      ) === 'map';
    })()
  );

  check(
    'r4_session_persist_merge',
    'merge session memory into persisted slice',
    (() => {
      const merged = mergeSessionMemoryIntoPersisted(createDefaultEvolvingUiPersistedState(), {
        ...recordNavSelection(createDefaultSessionUiMemory(), 'market'),
        preferredDensity: 'compact',
      });
      return merged.lastNavTarget === 'market' && merged.preferredDensity === 'compact';
    })()
  );

  check(
    'r4_focus_visibility_hook',
    'resolve with focus downgrades non-essential visible panels',
    (() => {
      const vis = resolveEvolvingPanelVisibilityWithFocusSession(
        'ask_game',
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { phase: 'human_turn' }
      );
      return vis.reason.includes('focus_session') || vis.state !== 'visible';
    })()
  );

  check(
    'r4_snooze_day',
    'snoozeFocusSessionUntilDay advances calendar',
    snoozeFocusSessionUntilDay(3, 2) === 5
  );

  check(
    'r4_eligible_density',
    'simple cannot select compact',
    !listEligibleDensityTiers('simple').includes('compact')
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
