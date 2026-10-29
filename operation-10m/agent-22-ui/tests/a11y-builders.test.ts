import { describe, expect, it } from 'vitest';
import { buildFocusRingClassName, buildProgressionPanelAria, buildShowAllToggleAria } from '../src/a11y/aria-builders.js';
import { nextFocusIndex } from '../src/a11y/focus-management.js';
import { LiveRegionController } from '../src/a11y/live-region-controller.js';

describe('aria builders', () => {
  it('marks preview panels as disabled for assistive tech', () => {
    const aria = buildProgressionPanelAria({
      panelLabel: 'Investments',
      visibility: 'preview',
      unlockHint: 'day≥4',
    });
    expect(aria['aria-disabled']).toBe(true);
  });

  it('builds show-all switch semantics', () => {
    expect(buildShowAllToggleAria(true)['aria-checked']).toBe(true);
  });

  it('includes high contrast ring modifier', () => {
    const cls = buildFocusRingClassName({ highContrast: true, style: 'cyan' });
    expect(cls).toContain('ring-cyan');
    expect(cls).toContain('ring-4');
  });
});

describe('focus management', () => {
  it('cycles forward at end when cycle true', () => {
    expect(nextFocusIndex(2, 3, false, true)).toBe(0);
  });
});

describe('live region', () => {
  it('respects off verbosity', () => {
    const c = new LiveRegionController('off');
    expect(c.announce('hello')).toBeNull();
  });

  it('stores polite announcements', () => {
    const c = new LiveRegionController('polite');
    const msg = c.announce('Panel unlocked');
    expect(msg?.text).toBe('Panel unlocked');
  });
});
