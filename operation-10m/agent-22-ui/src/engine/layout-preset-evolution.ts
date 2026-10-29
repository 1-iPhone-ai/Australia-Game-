import type { InterfaceExperienceLevel } from '../types/progression.js';

export type V94LayoutPreset = 'Clean' | 'Assisted' | 'Advanced' | 'Developer' | 'Current/Custom';

export interface LayoutPresetEvolutionStep {
  preset: V94LayoutPreset;
  impliedInterfaceLevel: InterfaceExperienceLevel;
  enablesPanelTags: string[];
  suppressesPanelTags: string[];
  coachSummary: string;
}

export const LAYOUT_PRESET_EVOLUTION: LayoutPresetEvolutionStep[] = [
  {
    preset: 'Clean',
    impliedInterfaceLevel: 'simple',
    enablesPanelTags: ['navigation', 'core'],
    suppressesPanelTags: ['launcher', 'automation', 'diagnostics'],
    coachSummary: 'Clean layout hides advanced launchers until you need them.',
  },
  {
    preset: 'Assisted',
    impliedInterfaceLevel: 'guided',
    enablesPanelTags: ['navigation', 'core', 'launcher', 'crafting'],
    suppressesPanelTags: ['diagnostics'],
    coachSummary: 'Assisted layout adds coaching launchers and economy shortcuts.',
  },
  {
    preset: 'Advanced',
    impliedInterfaceLevel: 'advanced',
    enablesPanelTags: ['navigation', 'core', 'launcher', 'strategic', 'automation'],
    suppressesPanelTags: [],
    coachSummary: 'Advanced layout exposes strategy and automation widgets.',
  },
  {
    preset: 'Developer',
    impliedInterfaceLevel: 'expert',
    enablesPanelTags: ['navigation', 'core', 'launcher', 'strategic', 'automation', 'diagnostics'],
    suppressesPanelTags: [],
    coachSummary: 'Developer layout includes diagnostics and replay tooling.',
  },
];

export function resolveLayoutPresetEvolution(preset: V94LayoutPreset | undefined): LayoutPresetEvolutionStep {
  const found = LAYOUT_PRESET_EVOLUTION.find(s => s.preset === preset);
  return found ?? LAYOUT_PRESET_EVOLUTION[1];
}

export function isPanelTagEnabledForPreset(
  panelTags: string[] | undefined,
  preset: V94LayoutPreset | undefined
): boolean {
  const step = resolveLayoutPresetEvolution(preset);
  const tags = panelTags ?? [];
  if (tags.some(t => step.suppressesPanelTags.includes(t))) return false;
  if (tags.length === 0) return true;
  return tags.some(t => step.enablesPanelTags.includes(t));
}

export function suggestLayoutPresetForInterfaceLevel(level: InterfaceExperienceLevel): V94LayoutPreset {
  switch (level) {
    case 'simple':
      return 'Clean';
    case 'guided':
      return 'Assisted';
    case 'advanced':
      return 'Advanced';
    case 'expert':
      return 'Developer';
    default:
      return 'Assisted';
  }
}
