import type { AccessibilitySettingsSnapshot, MotionPolicy } from '../types/accessibility.js';

export function deriveMotionPolicy(settings: AccessibilitySettingsSnapshot): MotionPolicy {
  const reduced = settings.reducedMotion;
  return {
    allowTransitions: !reduced,
    allowTransformAnimations: !reduced,
    allowParallax: !reduced,
  };
}

export function motionSafeClassName(policy: MotionPolicy, animatedClass: string, staticClass = ''): string {
  return policy.allowTransformAnimations ? animatedClass : staticClass;
}

export function shouldTrapFocusInModal(settings: AccessibilitySettingsSnapshot): boolean {
  return settings.trapFocusInModals !== false;
}

export function shouldRestoreFocusOnClose(settings: AccessibilitySettingsSnapshot): boolean {
  return settings.restoreFocusOnClose !== false;
}

export function focusableSelector(): string {
  return [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
}

export function getFocusableElements(container: { querySelectorAll(sel: string): Iterable<Element> }): Element[] {
  return Array.from(container.querySelectorAll(focusableSelector())).filter(el => {
    const tabIndex = el.getAttribute('tabindex');
    if (tabIndex === '-1') return false;
    return true;
  });
}

/** Minimal focus trap step for tests (DOM optional). */
export function nextFocusIndex(current: number, length: number, backward: boolean, cycle: boolean): number {
  if (length <= 0) return -1;
  if (backward) {
    if (current <= 0) return cycle ? length - 1 : 0;
    return current - 1;
  }
  if (current >= length - 1) return cycle ? 0 : length - 1;
  return current + 1;
}
