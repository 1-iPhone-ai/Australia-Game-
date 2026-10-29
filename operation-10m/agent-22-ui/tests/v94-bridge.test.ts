import { describe, expect, it } from 'vitest';
import { bridgeV94GameSettingsToEvolvingUi } from '../src/adapters/v94-settings-bridge.js';
import { resolveV94GamePhase, shouldShowEvolvingRailForPhase } from '../src/adapters/v94-phase-bridge.js';

describe('v94 settings bridge', () => {
  it('merges Clean preset toward simple interface level', () => {
    const bridged = bridgeV94GameSettingsToEvolvingUi(
      { gameDay: 2 },
      { presetSettings: { activePreset: 'Clean' }, smartSettingsProfile: { interfaceLevel: 'guided' } }
    );
    expect(bridged.signals.interfaceLevel).toBe('guided');
  });

  it('loads showAllPanelsOverride from evolvingUi settings slice', () => {
    const bridged = bridgeV94GameSettingsToEvolvingUi(
      { gameDay: 1 },
      { evolvingUi: { showAllPanelsOverride: true, rememberedPanelIds: ['nav_map'] } }
    );
    expect(bridged.policy.showAllPanelsOverride).toBe(true);
    expect(bridged.policy.rememberedPanelIds).toContain('nav_map');
  });
});

describe('v94 phase bridge', () => {
  it('detects human turn', () => {
    expect(resolveV94GamePhase({ gameState: { gameStarted: true } })).toBe('human_turn');
  });

  it('shows rail during human turn only', () => {
    expect(shouldShowEvolvingRailForPhase('human_turn')).toBe(true);
    expect(shouldShowEvolvingRailForPhase('main_menu')).toBe(false);
  });
});
