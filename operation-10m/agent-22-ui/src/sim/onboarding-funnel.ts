export interface OnboardingFunnelStep {
  id: string;
  title: string;
  dismissKey: string;
  unlocksPanelIds: string[];
  minDay: number;
  coachMessage: string;
}

export const UI_ONBOARDING_FUNNEL: OnboardingFunnelStep[] = [
  {
    id: 'funnel_welcome_map',
    title: 'Explore the map',
    dismissKey: 'onboarding_map',
    unlocksPanelIds: ['nav_map', 'modal_travel'],
    minDay: 1,
    coachMessage: 'The map is always available — travel unlocks adjacent regions.',
  },
  {
    id: 'funnel_economy_basics',
    title: 'Markets and workshop',
    dismissKey: 'onboarding_economy',
    unlocksPanelIds: ['nav_market', 'nav_workshop', 'quick_actions'],
    minDay: 2,
    coachMessage: 'Craft and trade once you have action points to spend.',
  },
  {
    id: 'funnel_standing',
    title: 'Regional standing',
    dismissKey: 'onboarding_standing',
    unlocksPanelIds: ['nav_challenges', 'nav_contracts'],
    minDay: 4,
    coachMessage: 'Challenges and contracts depend on regional standing.',
  },
  {
    id: 'funnel_finance_depth',
    title: 'Credit and investments',
    dismissKey: 'onboarding_finance',
    unlocksPanelIds: ['nav_loans', 'nav_investments'],
    minDay: 6,
    coachMessage: 'Long-horizon tools unlock after liquidity basics.',
  },
  {
    id: 'funnel_automation',
    title: 'Assistance tools',
    dismissKey: 'onboarding_automation',
    unlocksPanelIds: ['widget_guardian', 'ai_command'],
    minDay: 8,
    coachMessage: 'Guardian and command tools appear for advanced assistance.',
  },
];

export function listActiveOnboardingSteps(
  gameDay: number,
  dismissedKeys: string[]
): OnboardingFunnelStep[] {
  const dismissed = new Set(dismissedKeys);
  return UI_ONBOARDING_FUNNEL.filter(s => gameDay >= s.minDay && !dismissed.has(s.dismissKey));
}

export function applyOnboardingDismissal(
  stepId: string,
  dismissedKeys: string[],
  rememberedPanelIds: string[]
): { dismissedKeys: string[]; rememberedPanelIds: string[] } {
  const step = UI_ONBOARDING_FUNNEL.find(s => s.id === stepId);
  if (!step) return { dismissedKeys, rememberedPanelIds };
  const nextDismissed = dismissedKeys.includes(step.dismissKey)
    ? dismissedKeys
    : [...dismissedKeys, step.dismissKey];
  const remember = new Set(rememberedPanelIds);
  for (const pid of step.unlocksPanelIds) remember.add(pid);
  return { dismissedKeys: nextDismissed, rememberedPanelIds: [...remember] };
}

export function panelsHighlightedByOnboarding(
  gameDay: number,
  dismissedKeys: string[]
): string[] {
  const active = listActiveOnboardingSteps(gameDay, dismissedKeys);
  return [...new Set(active.flatMap(s => s.unlocksPanelIds))];
}
