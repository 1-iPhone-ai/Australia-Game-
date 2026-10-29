import { DEFAULT_EVOLVING_UI_ACCESS_POLICY, type EvolvingUiAccessPolicy } from '../types/access-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT, type AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import { deriveInterfaceLevelFromLayoutPreset, extractProgressionSignals, type V94GameSettingsSlice } from '../engine/progression-signals.js';

export interface BridgedEvolvingUiState {
  signals: ReturnType<typeof extractProgressionSignals>;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
}

export function bridgeV94GameSettingsToEvolvingUi(
  gameState: Parameters<typeof extractProgressionSignals>[0],
  gameSettings: V94GameSettingsSlice | null | undefined,
  guidedLearning?: Parameters<typeof extractProgressionSignals>[2]
): BridgedEvolvingUiState {
  const signals = extractProgressionSignals(gameState, gameSettings, guidedLearning);
  const presetLevel = deriveInterfaceLevelFromLayoutPreset(signals.layoutPreset);
  if (presetLevel && presetLevel !== signals.interfaceLevel) {
    signals.interfaceLevel = mergeInterfaceLevel(signals.interfaceLevel, presetLevel);
  }
  const evolving = gameSettings?.evolvingUi;
  const policy: EvolvingUiAccessPolicy = {
    ...DEFAULT_EVOLVING_UI_ACCESS_POLICY,
    showAllPanelsOverride: Boolean(evolving?.showAllPanelsOverride),
    rememberedPanelIds: Array.isArray(evolving?.rememberedPanelIds) ? [...evolving!.rememberedPanelIds!] : [],
  };
  const accessibility = sanitizeAccessibilityFromSettings(gameSettings?.accessibilitySettings);
  return { signals, policy, accessibility };
}

function mergeInterfaceLevel(a: InterfaceExperienceLevel, b: InterfaceExperienceLevel): InterfaceExperienceLevel {
  const order: InterfaceExperienceLevel[] = ['simple', 'guided', 'advanced', 'expert'];
  return order[Math.max(order.indexOf(a), order.indexOf(b))] ?? a;
}

function sanitizeAccessibilityFromSettings(raw: Record<string, unknown> | undefined): AccessibilitySettingsSnapshot {
  if (!raw) return { ...DEFAULT_ACCESSIBILITY_SNAPSHOT };
  return {
    ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
    highContrastFocusRings:
      typeof raw.highContrastFocusRings === 'boolean' ? raw.highContrastFocusRings : DEFAULT_ACCESSIBILITY_SNAPSHOT.highContrastFocusRings,
    reducedMotion:
      typeof raw.reducedMotion === 'boolean'
        ? raw.reducedMotion
        : typeof raw.reduceMotion === 'boolean'
          ? raw.reduceMotion
          : DEFAULT_ACCESSIBILITY_SNAPSHOT.reducedMotion,
    announceVerbosity:
      raw.announceVerbosity === 'off' ||
      raw.announceVerbosity === 'minimal' ||
      raw.announceVerbosity === 'polite' ||
      raw.announceVerbosity === 'assertive'
        ? raw.announceVerbosity
        : DEFAULT_ACCESSIBILITY_SNAPSHOT.announceVerbosity,
    textScaleMultiplier:
      typeof raw.textScaleMultiplier === 'number' && raw.textScaleMultiplier >= 0.8 && raw.textScaleMultiplier <= 1.5
        ? raw.textScaleMultiplier
        : DEFAULT_ACCESSIBILITY_SNAPSHOT.textScaleMultiplier,
  };
}
