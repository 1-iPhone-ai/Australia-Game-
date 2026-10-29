import type { InterfaceExperienceLevel } from './progression.js';

/** Policy flags — default preserves legacy direct navigation. */
export interface EvolvingUiAccessPolicy {
  /** Expert toggle / settings: show every panel in default chrome. */
  showAllPanelsOverride: boolean;
  /** Panel ids the player has opened at least once — stay visible in guided mode. */
  rememberedPanelIds: string[];
  /** When true, nav deep-links and resolveIntentNavToUiPatch always apply (canonical behavior). */
  preserveLegacyNavPatches: boolean;
  /** When true, essential panels ignore tier gates. */
  honorEssentialPanels: boolean;
  /** Interface levels that implicitly enable show-all for chrome (not nav). */
  implicitShowAllLevels: InterfaceExperienceLevel[];
}

export const DEFAULT_EVOLVING_UI_ACCESS_POLICY: EvolvingUiAccessPolicy = {
  showAllPanelsOverride: false,
  rememberedPanelIds: [],
  preserveLegacyNavPatches: true,
  honorEssentialPanels: true,
  implicitShowAllLevels: ['expert', 'advanced'],
};

export interface LegacyNavRequest {
  target: string;
  source: 'intent_nav' | 'deep_link' | 'keyboard' | 'onboarding';
}

export interface LegacyAccessResult {
  allowed: boolean;
  uiPatch: Record<string, boolean | string>;
  announce?: string;
}
