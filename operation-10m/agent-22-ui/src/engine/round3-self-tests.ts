import { listAvailableKeyboardShortcuts } from './keyboard-shortcut-progression.js';
import { suggestLayoutPresetForInterfaceLevel, isPanelTagEnabledForPreset } from './layout-preset-evolution.js';
import { listContextualQuickActions } from './contextual-quick-actions.js';
import { resolveEvolvingPanelVisibilityWithLayout } from './layout-aware-visibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { listActiveOnboardingSteps, applyOnboardingDismissal } from '../sim/onboarding-funnel.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export function runAgent22Round3SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r3_layout_suggest',
    'suggest Assisted for guided level',
    suggestLayoutPresetForInterfaceLevel('guided') === 'Assisted'
  );

  check(
    'r3_layout_tag',
    'Clean suppresses launcher tag panels',
    isPanelTagEnabledForPreset(['launcher'], 'Clean') === false
  );

  check(
    'r3_keyboard_expert_diag',
    'diagnostics shortcut expert-only',
    listAvailableKeyboardShortcuts('expert', 'human_turn').some(s => s.id === 'kb_open_diagnostics')
  );

  check(
    'r3_keyboard_simple_no_invest',
    'investments shortcut hidden on simple',
    !listAvailableKeyboardShortcuts('simple', 'human_turn').some(s => s.navTarget === 'investments')
  );

  check(
    'r3_contextual_qa',
    'day 6 human turn includes workshop action',
    listContextualQuickActions('human_turn', 6).some(a => a.navTarget === 'workshop')
  );

  check(
    'r3_layout_visibility',
    'Clean preset downgrades quick_actions launcher to preview',
    (() => {
      const vis = resolveEvolvingPanelVisibilityWithLayout(
        'quick_actions',
        'Clean',
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      return vis.state === 'preview' && vis.reason.includes('layout');
    })()
  );

  check(
    'r3_onboarding_funnel',
    'dismissal remembers economy panels',
    (() => {
      const r = applyOnboardingDismissal('funnel_economy_basics', [], []);
      return r.rememberedPanelIds.includes('nav_market');
    })()
  );

  check(
    'r3_onboarding_active',
    'day 3 shows standing funnel step',
    listActiveOnboardingSteps(3, []).some(s => s.id === 'funnel_economy_basics')
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
