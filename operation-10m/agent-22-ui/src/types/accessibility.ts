/** Subset of V9.4 AccessibilitySettings for standalone module tests. */
export type FocusRingStyle = 'emerald' | 'cyan' | 'amber' | 'white';
export type ScreenReaderAnnounceVerbosity = 'off' | 'minimal' | 'polite' | 'assertive';

export interface AccessibilitySettingsSnapshot {
  highContrastFocusRings: boolean;
  focusRingStyle: FocusRingStyle;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  announceVerbosity: ScreenReaderAnnounceVerbosity;
  keyboardNavigationHints: boolean;
  trapFocusInModals: boolean;
  restoreFocusOnClose: boolean;
  cycleFocusWithTab: boolean;
  arrowKeyNavigationEnabled: boolean;
  textScaleMultiplier: number;
}

export const DEFAULT_ACCESSIBILITY_SNAPSHOT: AccessibilitySettingsSnapshot = {
  highContrastFocusRings: true,
  focusRingStyle: 'emerald',
  reducedMotion: false,
  screenReaderAnnouncements: true,
  announceVerbosity: 'polite',
  keyboardNavigationHints: true,
  trapFocusInModals: true,
  restoreFocusOnClose: true,
  cycleFocusWithTab: true,
  arrowKeyNavigationEnabled: true,
  textScaleMultiplier: 1.0,
};

export interface FocusRingClassOptions {
  highContrast: boolean;
  style: FocusRingStyle;
}

export interface LiveRegionMessage {
  id: string;
  text: string;
  politeness: 'polite' | 'assertive';
  createdAt: number;
}

export interface MotionPolicy {
  allowTransitions: boolean;
  allowTransformAnimations: boolean;
  allowParallax: boolean;
}
