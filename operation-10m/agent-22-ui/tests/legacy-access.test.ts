import { describe, expect, it } from 'vitest';
import { resolveLegacyUiAccess, resolveIntentNavToUiPatch, rememberPanelOpen } from '../src/engine/legacy-access.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('resolveLegacyUiAccess', () => {
  it('always allows canonical nav patches when preserveLegacyNavPatches is true', () => {
    const res = resolveLegacyUiAccess({ target: 'loans', source: 'intent_nav' }, DEFAULT_EVOLVING_UI_ACCESS_POLICY);
    expect(res.allowed).toBe(true);
    expect(res.uiPatch).toEqual({ showAdvancedLoans: true });
    expect(res.announce).toContain('Loans');
  });

  it('matches V9.4 patch for travel', () => {
    expect(resolveIntentNavToUiPatch('travel')).toEqual({ showTravelModal: true, showMap: true });
  });

  it('rememberPanelOpen appends id once', () => {
    const next = rememberPanelOpen('nav_market', DEFAULT_EVOLVING_UI_ACCESS_POLICY);
    expect(next.rememberedPanelIds).toContain('nav_market');
    const again = rememberPanelOpen('nav_market', next);
    expect(again.rememberedPanelIds.filter(x => x === 'nav_market').length).toBe(1);
  });
});
