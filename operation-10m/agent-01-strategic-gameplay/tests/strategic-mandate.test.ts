import { describe, expect, it } from 'vitest';
import {
  advanceMandateOnAction,
  createInitialStrategicState,
  mandateRankingBonus,
  summarizeMandateProgress,
} from '../src/index.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';

describe('strategic mandate', () => {
  it('accumulates points and unlocks milestones on aligned actions', () => {
    const action = getStrategicAction('sga_water_grid_upgrade')!;
    let state = createInitialStrategicState(1);
    for (let i = 0; i < 7; i += 1) {
      state = advanceMandateOnAction(state, action);
    }
    const track = state.mandateProgress?.water_security;
    expect(track?.points).toBe(84);
    expect(track?.milestonesUnlocked).toContain('mandate_priority_leadership');
    expect(summarizeMandateProgress(state)).toMatch(/water_security/);
  });

  it('adds ranking bonus when milestones exist', () => {
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    let state = createInitialStrategicState(1);
    for (let i = 0; i < 3; i += 1) {
      state = advanceMandateOnAction(state, action);
    }
    expect(mandateRankingBonus(state, action)).toBeGreaterThan(0);
  });
});
