import { describe, expect, it } from 'vitest';
import { LAUNCHER_PANELS, listLauncherPanelsForNavTarget } from '../src/registry/launcher-panel-definitions.js';
import {
  listSuppressedNotificationCategories,
  shouldShowNotificationLaneCategory,
} from '../src/engine/notification-lane-progression.js';

describe('launcher panels', () => {
  it('registers ask game launcher with nav target', () => {
    expect(listLauncherPanelsForNavTarget('ask_game').length).toBeGreaterThan(0);
  });

  it('has unique launcher ids', () => {
    const ids = LAUNCHER_PANELS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('notification lane progression', () => {
  it('always allows critical lane', () => {
    expect(
      shouldShowNotificationLaneCategory('critical', { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' })
    ).toBe(true);
  });

  it('suppresses automation lane on day 1 simple', () => {
    const suppressed = listSuppressedNotificationCategories({
      gameDay: 1,
      turnCount: 1,
      interfaceLevel: 'simple',
    });
    expect(suppressed).toContain('automation');
  });
});
