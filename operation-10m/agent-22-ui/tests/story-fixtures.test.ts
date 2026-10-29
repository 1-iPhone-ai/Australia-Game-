import { describe, expect, it } from 'vitest';
import { ALL_STORY_FIXTURES } from '../src/fixtures/stories/index.js';
import { listPanelsForNavTarget } from '../src/registry/panel-definitions.js';
import { resolveEvolvingPanelVisibility } from '../src/engine/resolve-panel-visibility.js';
import { resolveLegacyUiAccess } from '../src/engine/legacy-access.js';

describe('story fixtures', () => {
  for (const story of ALL_STORY_FIXTURES) {
    it(`${story.id} — legacy nav targets always accessible`, () => {
      for (const target of story.expectedLegacyNavAlwaysWorks) {
        const access = resolveLegacyUiAccess({ target, source: 'deep_link' }, story.policy);
        expect(access.allowed, `${story.id}:${target}`).toBe(true);
        expect(Object.keys(access.uiPatch).length).toBeGreaterThan(0);
      }
    });

    it(`${story.id} — expected visible nav targets resolve visible in rail`, () => {
      for (const target of story.expectedVisibleNavTargets) {
        const panels = listPanelsForNavTarget(target);
        expect(panels.length, `missing panel for ${target}`).toBeGreaterThan(0);
        const vis = resolveEvolvingPanelVisibility(panels[0].id, story.signals, story.policy);
        expect(vis.state, `${story.id}:${target} got ${vis.reason}`).toBe('visible');
      }
    });
  }
});
