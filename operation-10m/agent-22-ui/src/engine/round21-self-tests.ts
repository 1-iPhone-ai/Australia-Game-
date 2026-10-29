import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import { buildDeferredAnnouncementFlushDayHint } from './deferred-announcement-flush-day-hint.js';
import { buildTextScaleReadabilityDayCoach } from './text-scale-readability-day-coach.js';
import { buildResponsiveNavRailDayCoach } from './responsive-nav-rail-day-coach.js';
import { buildOnboardingFunnelDayHint } from './onboarding-funnel-day-hint.js';

export function runAgent22Round21SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r21_deferred_flush',
    'deferred flush day hint mentions day',
    (() => {
      const hint = buildDeferredAnnouncementFlushDayHint({
        flushedCount: 2,
        remainingCount: 1,
        nextGameDay: 5,
      });
      return Boolean(hint.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r21_deferred_empty',
    'deferred flush day hint null when idle',
    (() => {
      const hint = buildDeferredAnnouncementFlushDayHint({
        flushedCount: 0,
        remainingCount: 0,
        nextGameDay: 3,
      });
      return hint.coachCopy === null;
    })()
  );

  check(
    'r21_text_scale_readability',
    'text scale readability day coach on compact + large scale',
    (() => {
      const coach = buildTextScaleReadabilityDayCoach({
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.2 },
        activeDensity: 'compact',
        nextGameDay: 4,
      });
      return coach.needsSpaciousDensity && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r21_text_scale_ok',
    'text scale readability day coach null when balanced',
    (() => {
      const coach = buildTextScaleReadabilityDayCoach({
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.0, highContrastFocusRings: false },
        activeDensity: 'comfortable',
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r21_nav_rail_overflow',
    'responsive nav rail day coach on narrow viewport',
    (() => {
      const ordered = [...EVOLVING_UI_PANEL_REGISTRY]
        .sort((a, b) => (a.railOrder ?? 999) - (b.railOrder ?? 999))
        .map(p => p.id);
      const coach = buildResponsiveNavRailDayCoach({
        orderedPanelIds: ordered,
        viewportWidthPx: 480,
        nextGameDay: 6,
      });
      return coach.overflowCount > 0 && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r21_onboarding_funnel',
    'onboarding funnel day hint on day 2',
    (() => {
      const hint = buildOnboardingFunnelDayHint({ nextGameDay: 2, dismissedKeys: [] });
      return hint.activeStepCount > 0 && Boolean(hint.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r21_onboarding_dismissed',
    'onboarding funnel day hint respects dismiss keys',
    (() => {
      const hint = buildOnboardingFunnelDayHint({
        nextGameDay: 2,
        dismissedKeys: ['onboarding_map', 'onboarding_economy'],
      });
      return hint.coachCopy === null || !hint.coachCopy.includes('map is always');
    })()
  );

  check(
    'r21_tick_deferred_field',
    'day advance exposes deferred flush day hint copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.deferredAnnouncementFlushDayHintCopy === 'string' || r.deferredAnnouncementFlushDayHintCopy === null;
    })()
  );

  check(
    'r21_tick_readability_field',
    'day advance exposes text scale readability day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), preferredDensity: 'compact' },
        {
          phase: 'human_turn',
          accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.25 },
        }
      );
      return typeof r.textScaleReadabilityDayCoachCopy === 'string' || r.textScaleReadabilityDayCoachCopy === null;
    })()
  );

  check(
    'r21_tick_nav_rail_field',
    'day advance exposes responsive nav rail day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', viewportWidthPx: 520 }
      );
      return typeof r.responsiveNavRailDayCoachCopy === 'string' || r.responsiveNavRailDayCoachCopy === null;
    })()
  );

  check(
    'r21_tick_onboarding_field',
    'day advance exposes onboarding funnel day hint copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.onboardingFunnelDayHintCopy === 'string' || r.onboardingFunnelDayHintCopy === null;
    })()
  );

  check(
    'r21_tick_onboarding_active',
    'day advance onboarding funnel copy on day 2',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.onboardingFunnelDayHintCopy?.includes('Day 2'));
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
