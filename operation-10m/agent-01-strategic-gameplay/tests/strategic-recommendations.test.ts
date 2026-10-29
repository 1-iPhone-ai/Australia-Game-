import { describe, expect, it } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { listStrategicActions } from '../src/catalog/strategic-action-catalog.ts';
import { createInitialStrategicState } from '../src/engine/strategic-gameplay-engine.ts';
import { rankStrategicActions } from '../src/engine/strategic-recommendations.ts';

describe('rankStrategicActions', () => {
  it('prefers feasible actions aligned with primary priority', () => {
    const contracts = createMemoryStrategicContracts();
    const state = createInitialStrategicState(1);
    const ranked = rankStrategicActions(
      listStrategicActions(),
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      {
        day: 1,
        playerFocusId: 'freight_modernization',
        priorities: [
          {
            id: 'freight_modernization',
            title: 'Freight Modernization',
            urgency: 'urgent',
            progress: 20,
            isPrimary: true,
          },
        ],
      },
      state,
    );
    const freight = ranked.find((r) => r.actionId === 'sga_freight_corridor_modernization');
    expect(freight?.feasible).toBe(true);
    expect(freight?.alignmentBand).toBe('strong');
    expect(freight?.alignmentScore).toBeGreaterThan(15);
  });

  it('demotes actions when pending trade-off queue is saturated', () => {
    const contracts = createMemoryStrategicContracts();
    const saturated = createInitialStrategicState(1);
    saturated.pendingDelayed = Array.from({ length: 8 }, (_, i) => ({
      id: `p${i}`,
      firesOnDay: 9,
      sourceActionId: 'sga_supply_chain_buffer',
      label: 'queued',
      warning: 'w',
      effects: {},
    }));
    const ranked = rankStrategicActions(
      listStrategicActions(),
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
      saturated,
      { maxPendingTradeOffs: 8 },
    );
    const energy = ranked.find((r) => r.actionId === 'sga_energy_resilience_reserve');
    expect(energy?.feasible).toBe(false);
    expect(energy?.blockerCodes).toContain('TOO_MANY_PENDING_TRADEOFFS');
  });
});
