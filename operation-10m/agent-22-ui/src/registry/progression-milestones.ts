import type { ProgressionUnlockRule } from '../types/progression.js';

export interface UiProgressionMilestone {
  id: string;
  title: string;
  description: string;
  unlocksPanelIds: string[];
  rule: ProgressionUnlockRule;
  coachCopy: string;
}

/** Milestones bridge campaign/onboarding ids to panel unlock expectations. */
export const UI_PROGRESSION_MILESTONES: UiProgressionMilestone[] = [
  {
    id: 'first_market_visit',
    title: 'First market visit',
    description: 'Player opened the market at least once.',
    unlocksPanelIds: ['nav_market', 'modal_market'],
    rule: { minDay: 1 },
    coachCopy: 'Markets unlock after your first day of play.',
  },
  {
    id: 'first_contract',
    title: 'First regional contract',
    description: 'Completed or accepted first contract flow.',
    unlocksPanelIds: ['nav_contracts', 'modal_regional_contracts'],
    rule: { minDay: 3, minInterfaceLevel: 'guided' },
    coachCopy: 'Contracts appear once you understand regional standing.',
  },
  {
    id: 'capital_allocation_intro',
    title: 'Capital allocation lesson',
    description: 'Guided learning introduced capital allocation.',
    unlocksPanelIds: ['nav_investments', 'modal_investments'],
    rule: { requiredConceptIds: ['capital_allocation'], minDay: 4 },
    coachCopy: 'Investments unlock after the capital allocation lesson.',
  },
  {
    id: 'first_crisis',
    title: 'First crisis response',
    description: 'Player entered crisis management flow.',
    unlocksPanelIds: ['modal_crisis_management'],
    rule: { minDay: 5, requiredMilestoneIds: ['first_crisis'] },
    coachCopy: 'Crisis tools stay available once a crisis begins.',
  },
  {
    id: 'advanced_interface',
    title: 'Advanced interface',
    description: 'Player switched to Advanced layout or interface level.',
    unlocksPanelIds: ['widget_strategy_planner', 'widget_ai_command', 'nav_expeditions'],
    rule: { minInterfaceLevel: 'advanced', minDay: 6 },
    coachCopy: 'Advanced tools unlock in the Advanced interface profile.',
  },
  {
    id: 'expert_diagnostics',
    title: 'Expert diagnostics',
    description: 'Expert player accessing replay/determinism tooling.',
    unlocksPanelIds: ['nav_diagnostics', 'nav_replay', 'modal_determinism_audit', 'modal_what_if_timelines'],
    rule: { minInterfaceLevel: 'expert' },
    coachCopy: 'Diagnostics surfaces are grouped under Expert settings.',
  },
];

export const UI_MILESTONE_BY_ID: Record<string, UiProgressionMilestone> = Object.fromEntries(
  UI_PROGRESSION_MILESTONES.map(m => [m.id, m])
);
