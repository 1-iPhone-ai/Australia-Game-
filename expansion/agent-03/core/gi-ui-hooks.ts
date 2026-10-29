/**
 * GI + UI hook registry (strings consumed by merge into detectInnovationQuery / PLAY copy).
 */

export interface Agent03GiHook {
  id: string;
  patterns: RegExp[];
  capabilityId?: string;
  commercialization?: boolean;
  answerShape: 'explanation' | 'diagnosis' | 'fact';
  composeKey: string;
}

export const AGENT03_GI_HOOKS: Agent03GiHook[] = [
  {
    id: 'commercialization_blockers',
    patterns: [/\bwhy (is|are) commerciali[sz]ation (stalled|blocked)\b/, /\bcommerciali[sz]ation blockers?\b/],
    commercialization: true,
    answerShape: 'diagnosis',
    composeKey: 'innovation.commercialization_blockers',
  },
  {
    id: 'quantum_sensing_blockers',
    patterns: [/\bquantum sensing\b/, /\bwhy (can't|cannot) (we|i) (deploy|use) quantum\b/],
    capabilityId: 'quantum_sensing_industry',
    answerShape: 'diagnosis',
    composeKey: 'innovation.quantum_sensing_blockers',
  },
  {
    id: 'sovereign_platform_blockers',
    patterns: [/\bsovereign ai platform\b/, /\bsovereign platform readiness\b/],
    capabilityId: 'sovereign_ai_platforms',
    answerShape: 'diagnosis',
    composeKey: 'innovation.sovereign_platform_blockers',
  },
  {
    id: 'productivity_from_capabilities',
    patterns: [/\bhow (does|do) (innovation|capabilities) affect (productivity|industry)\b/, /\bcapability productivity\b/],
    answerShape: 'explanation',
    composeKey: 'innovation.productivity_explainer',
  },
];

export interface Agent03UiSurface {
  id: string;
  panel: 'PLAY' | 'LAB' | 'GI';
  testId: string;
  visibleWhenUnlock: string;
  copy: string;
}

export const AGENT03_UI_SURFACES: Agent03UiSurface[] = [
  {
    id: 'play_innovation_momentum',
    panel: 'PLAY',
    testId: 'play-innovation-momentum',
    visibleWhenUnlock: 'unlock_play_innovation_hint',
    copy: 'Innovation momentum reflects what you built — not a research bar.',
  },
  {
    id: 'lab_institution_acceleration',
    panel: 'LAB',
    testId: 'lab-institution-acceleration',
    visibleWhenUnlock: 'unlock_lab_institution_tab',
    copy: 'Institutions accelerate evidence for emerging capabilities (derived readiness).',
  },
  {
    id: 'gi_commercialization',
    panel: 'GI',
    testId: 'gi-commercialization',
    visibleWhenUnlock: 'unlock_gi_commercialization_blocker',
    copy: 'Commercialization stages gate contracts; they do not grant science points.',
  },
];

export function matchGiHook(query: string): Agent03GiHook | null {
  const q = ` ${query.toLowerCase()} `;
  return AGENT03_GI_HOOKS.find(h => h.patterns.some(p => p.test(q))) || null;
}
