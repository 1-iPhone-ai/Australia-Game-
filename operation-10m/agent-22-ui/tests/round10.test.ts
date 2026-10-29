import { describe, expect, it } from 'vitest';
import { runAgent22Round10SelfTests } from '../src/engine/round10-self-tests.js';
import { flushDeferredAnnouncementQueue } from '../src/engine/deferred-announcement-flush.js';
import { resolveAccessibleChromeShellProfile } from '../src/engine/accessible-chrome-shell.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../src/types/accessibility.js';
import { resolveUiDensityProfile } from '../src/engine/ui-density-progression.js';

describe('round 10 self-tests bundle', () => {
  it('passes embedded round10 suite', () => {
    const r = runAgent22Round10SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('deferred announcement flush', () => {
  it('reduces queue on flush', () => {
    const density = resolveUiDensityProfile({ interfaceLevel: 'advanced' });
    const flush = flushDeferredAnnouncementQueue(['a', 'b', 'c', 'd'], DEFAULT_ACCESSIBILITY_SNAPSHOT, density);
    expect(flush.remainingQueue.length).toBeLessThan(4);
  });
});

describe('accessible chrome shell', () => {
  it('exposes touch and motion data attributes', () => {
    const shell = resolveAccessibleChromeShellProfile({
      accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      interfaceLevel: 'simple',
    });
    expect(shell.dataAttributes['data-touch-tier']).toBeDefined();
  });
});
