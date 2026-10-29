import { describe, expect, it } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';
import { validateAction } from '../src/engine/validation.ts';

describe('validateAction', () => {
  it('rejects when action points are exhausted', () => {
    const contracts = createMemoryStrategicContracts();
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    const issues = validateAction(action, contracts, {
      actionsUsedThisTurn: 3,
      actionsPerTurn: 3,
    });
    expect(issues.some((i) => i.code === 'AP_EXHAUSTED')).toBe(true);
  });

  it('rejects when treasury cannot fund water upgrade', () => {
    const contracts = createMemoryStrategicContracts({
      economy: { treasuryReserve: 10_000, cashOnHand: 500_000 },
    });
    const action = getStrategicAction('sga_water_grid_upgrade')!;
    const issues = validateAction(action, contracts, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(issues.some((i) => i.code === 'INSUFFICIENT_FUNDS')).toBe(true);
  });

  it('passes for affordable supply chain action', () => {
    const contracts = createMemoryStrategicContracts();
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    const issues = validateAction(action, contracts, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(issues).toHaveLength(0);
  });
});

describe('scoreNationalPriorityAlignment', () => {
  it('marks conflict when action undermines primary priority', async () => {
    const { scoreNationalPriorityAlignment } = await import('../src/engine/validation.ts');
    const action = getStrategicAction('sga_tech_accelerator')!;
    const alignment = scoreNationalPriorityAlignment(action, {
      day: 1,
      playerFocusId: 'water_security',
      priorities: [
        {
          id: 'water_security',
          title: 'Water Security',
          urgency: 'critical',
          progress: 40,
          isPrimary: true,
        },
      ],
    });
    expect(alignment?.band).toBe('conflict');
  });
});
