import type { EvolvingUiAccessPolicy } from '../../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../../types/progression.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../../types/access-policy.js';

export interface EvolvingUiStoryFixture {
  id: string;
  title: string;
  description: string;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  expectedVisibleNavTargets: string[];
  expectedLegacyNavAlwaysWorks: string[];
}

export const STORY_FRESH_PLAYER_SIMPLE: EvolvingUiStoryFixture = {
  id: 'fresh-player-simple',
  title: 'Fresh player — simple interface',
  description: 'Day 1 on Clean preset; core map/travel/help/settings visible; economy panels preview or hidden.',
  signals: {
    gameDay: 1,
    turnCount: 1,
    interfaceLevel: 'simple',
    layoutPreset: 'Clean',
    guidedConceptStatuses: {},
    completedMilestoneIds: [],
    playerIntentOnboardingEnabled: true,
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY },
  expectedVisibleNavTargets: ['map', 'travel', 'help', 'settings', 'challenges'],
  expectedLegacyNavAlwaysWorks: ['loans', 'investments', 'diplomacy'],
};

export const STORY_MID_GAME_GUIDED: EvolvingUiStoryFixture = {
  id: 'mid-game-guided',
  title: 'Mid game — guided progression',
  description: 'Day 6 guided player with capital_allocation introduced; contracts and investments unlock in rail.',
  signals: {
    gameDay: 6,
    turnCount: 6,
    interfaceLevel: 'guided',
    layoutPreset: 'Assisted',
    guidedConceptStatuses: { capital_allocation: 'introduced' },
    completedMilestoneIds: ['first_contract'],
    playerIntentOnboardingEnabled: true,
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, rememberedPanelIds: ['nav_market'] },
  expectedVisibleNavTargets: ['map', 'travel', 'workshop', 'market', 'contracts', 'progress'],
  expectedLegacyNavAlwaysWorks: ['sabotage', 'expeditions'],
};

export const STORY_EXPERT_SHOW_ALL: EvolvingUiStoryFixture = {
  id: 'expert-show-all',
  title: 'Expert — implicit show all',
  description: 'Expert interface level shows full rail without override toggle.',
  signals: {
    gameDay: 3,
    turnCount: 3,
    interfaceLevel: 'expert',
    layoutPreset: 'Developer',
    guidedConceptStatuses: {},
    completedMilestoneIds: [],
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY },
  expectedVisibleNavTargets: ['map', 'automation', 'diagnostics', 'replay', 'loans'],
  expectedLegacyNavAlwaysWorks: ['diagnostics'],
};

export const STORY_A11Y_HIGH_CONTRAST: EvolvingUiStoryFixture = {
  id: 'accessibility-high-contrast',
  title: 'Accessibility — high contrast focus',
  description: 'Policy unchanged; documents paired accessibility snapshot for UI snapshots.',
  signals: {
    gameDay: 4,
    turnCount: 4,
    interfaceLevel: 'guided',
    layoutPreset: 'Assisted',
  },
  policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
  expectedVisibleNavTargets: ['map', 'help', 'settings'],
  expectedLegacyNavAlwaysWorks: ['help'],
};

/** Scale wave: late guided player approaching expert tooling. */
export const STORY_SCALE_WAVE_LATE_GUIDED: EvolvingUiStoryFixture = {
  id: 'scale-wave-late-guided',
  title: 'Late guided — modal + coach depth',
  description: 'Day 9 guided with crisis milestone; infrastructure and fog intel in play.',
  signals: {
    gameDay: 9,
    turnCount: 9,
    interfaceLevel: 'guided',
    layoutPreset: 'Assisted',
    guidedConceptStatuses: { capital_allocation: 'mastered' },
    completedMilestoneIds: ['first_crisis', 'first_contract'],
  },
  policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY },
  expectedVisibleNavTargets: ['map', 'infrastructure', 'investments', 'contracts'],
  expectedLegacyNavAlwaysWorks: ['expeditions', 'diplomacy'],
};

export const ALL_STORY_FIXTURES: EvolvingUiStoryFixture[] = [
  STORY_FRESH_PLAYER_SIMPLE,
  STORY_MID_GAME_GUIDED,
  STORY_EXPERT_SHOW_ALL,
  STORY_A11Y_HIGH_CONTRAST,
  STORY_SCALE_WAVE_LATE_GUIDED,
];
