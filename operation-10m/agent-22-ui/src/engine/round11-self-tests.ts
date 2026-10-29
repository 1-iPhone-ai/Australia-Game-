import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import {
  dismissOnboardingStepInPersisted,
  listActiveOnboardingStepsForPersisted,
  mergeOnboardingDismissalsIntoPersisted,
  onboardingFunnelStatusCopy,
  onboardingHighlightedPanelIds,
} from './onboarding-persist-bridge.js';
import { planNavRailVisibleItems } from './responsive-nav-rail-plan.js';
import { createDefaultSessionUiMemory, recordNavSelection } from '../sim/session-ui-memory.js';
import { NAV_TARGET_PANELS } from '../registry/panel-definitions.js';
import { sortPanelsForRail } from './resolve-panel-visibility.js';
import { buildCoachLiveRegionDeliveryPlan, coachLiveRegionDeliveryCopy } from './coach-live-region-scheduler.js';
import {
  buildLayoutOnboardingVisibilityHints,
  layoutOnboardingCoachCopy,
} from './layout-onboarding-visibility.js';

export function runAgent22Round11SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r11_onboarding_persist_merge',
    'merge onboarding dismiss keys into persisted',
    (() => {
      const merged = mergeOnboardingDismissalsIntoPersisted(createDefaultEvolvingUiPersistedState(), ['onboarding_map']);
      return Boolean(merged.onboardingDismissedKeys?.includes('onboarding_map'));
    })()
  );

  check(
    'r11_onboarding_dismiss_step',
    'dismiss step updates remembered panels',
    (() => {
      const next = dismissOnboardingStepInPersisted(createDefaultEvolvingUiPersistedState(), 'funnel_welcome_map');
      return Boolean(
        next.onboardingDismissedKeys?.includes('onboarding_map') && next.rememberedPanelIds?.includes('nav_map')
      );
    })()
  );

  check(
    'r11_onboarding_status_copy',
    'funnel status copy mentions step title',
    (() => {
      const steps = listActiveOnboardingStepsForPersisted(2, createDefaultEvolvingUiPersistedState());
      return Boolean(onboardingFunnelStatusCopy(steps)?.includes('Onboarding'));
    })()
  );

  check(
    'r11_onboarding_highlights_tick',
    'day advance remembers onboarding highlight panels',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      const highlights = onboardingHighlightedPanelIds(2, createDefaultEvolvingUiPersistedState());
      return highlights.length > 0 && (r.updatedPersisted.rememberedPanelIds?.length ?? 0) >= highlights.length;
    })()
  );

  check(
    'r11_nav_rail_overflow',
    'narrow viewport caps visible nav items',
    (() => {
      const signals = { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' as const };
      const ordered = sortPanelsForRail(
        NAV_TARGET_PANELS.map(p => p.id),
        signals,
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const plan = planNavRailVisibleItems({
        orderedPanelIds: ordered,
        viewportWidthPx: 360,
      });
      return plan.visiblePanelIds.length <= plan.hints.maxVisibleRailItems && plan.overflowCount >= 0;
    })()
  );

  check(
    'r11_nav_rail_pins_recent',
    'nav plan keeps recent session target visible',
    (() => {
      const signals = { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' as const };
      const ordered = sortPanelsForRail(
        NAV_TARGET_PANELS.map(p => p.id),
        signals,
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const memory = recordNavSelection(createDefaultSessionUiMemory(), 'map');
      const plan = planNavRailVisibleItems({
        orderedPanelIds: ordered,
        viewportWidthPx: 400,
        sessionMemory: memory,
      });
      const mapPanel = NAV_TARGET_PANELS.find(p => p.navTarget === 'map');
      return mapPanel ? plan.visiblePanelIds.includes(mapPanel.id) : false;
    })()
  );

  check(
    'r11_coach_live_region_plan',
    'coach lines become live region messages',
    (() => {
      const plan = buildCoachLiveRegionDeliveryPlan(['Panel unlocked'], DEFAULT_ACCESSIBILITY_SNAPSHOT);
      return plan.messages.length === 1 && plan.politeCount === 1;
    })()
  );

  check(
    'r11_coach_live_region_copy',
    'live region delivery copy mentions queue',
    Boolean(coachLiveRegionDeliveryCopy(buildCoachLiveRegionDeliveryPlan(['a', 'b'], DEFAULT_ACCESSIBILITY_SNAPSHOT))?.includes('screen reader'))
  );

  check(
    'r11_tick_live_region_count',
    'day advance reports live region message count',
    (() => {
      const persisted = {
        ...createDefaultEvolvingUiPersistedState(),
        announcementPacingQueue: ['queued one', 'queued two', 'queued three'],
      };
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted
      );
      return r.coachLiveRegionMessageCount >= 1;
    })()
  );

  check(
    'r11_layout_onboarding_hints',
    'layout hints mark onboarding highlights',
    (() => {
      const hints = buildLayoutOnboardingVisibilityHints({
        panelIds: ['nav_map', 'nav_market'],
        layoutPreset: 'Assisted',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
      });
      return hints.some(h => h.onboardingHighlight);
    })()
  );

  check(
    'r11_layout_onboarding_copy',
    'layout onboarding copy references preview',
    (() => {
      const hints = buildLayoutOnboardingVisibilityHints({
        panelIds: ['widget_guardian', 'ai_command'],
        layoutPreset: 'Clean',
        signals: { gameDay: 10, turnCount: 10, interfaceLevel: 'advanced' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
      });
      const copy = layoutOnboardingCoachCopy(hints);
      return copy == null || copy.includes('preview');
    })()
  );

  check(
    'r11_live_region_off_when_sr_disabled',
    'live region plan empty when SR off',
    buildCoachLiveRegionDeliveryPlan(['x'], { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, screenReaderAnnouncements: false })
      .messages.length === 0
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
