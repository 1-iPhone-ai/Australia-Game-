import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { advanceTurnPhases, createInitialClock } from '../src/index.js';

describe('turn-sequence unit', () => {
  it('partial phases do not roll until end', () => {
    const initial = createInitialClock(10, 10);
    const mainOnly = advanceTurnPhases(initial, { phases: ['start', 'main'] });
    assert.equal(mainOnly.clock.turnIndex, 10);
    assert.equal(mainOnly.rolledTurn, false);

    const withEnd = advanceTurnPhases(mainOnly.clock, { phases: ['end'] });
    assert.equal(withEnd.clock.turnIndex, 11);
    assert.equal(withEnd.rolledTurn, true);
  });
});
