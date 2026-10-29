import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_PENDING_ARBITRATION_FLAG,
  OP10M_PENDING_BACKLOG_FLAG,
  countPendingResponses,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluatePendingResponseOrchestration,
  maxPendingInSingleRegion,
} from '../src/index.ts';

function seedPending(count: number, regionId = 'NSW') {
  let narrative = createDefaultOp10mNarrativeEngineState();
  for (let i = 0; i < count; i++) {
    narrative.pendingResponses.push({
      id: `pr_${i}`,
      chainId: `chain_${i}`,
      stagePhase: 'pressure',
      regionId,
      choiceIds: ['commit', 'defer'],
      openedDay: 5,
      expiresDay: 15,
      snapshot: { day: 5, money: 5000, nationalStability: 70, activeCrisisCount: 1 },
    });
  }
  return narrative;
}

describe('Pending response orchestrator', () => {
  it('sets backlog flag when queue is deep', () => {
    const narrative = seedPending(4);
    assert.equal(countPendingResponses(narrative), 4);
    const pass = evaluatePendingResponseOrchestration(
      createDefaultOp10mSimulationSlice({ day: 10 }),
      narrative,
      10
    );
    assert.ok(pass.simulation.flags[OP10M_PENDING_BACKLOG_FLAG]);
    assert.equal(pass.narrative.telemetry.pendingBacklogSurges, 1);
  });

  it('sets arbitration when a region has multiple pending dilemmas', () => {
    const narrative = seedPending(2, 'VIC');
    const pass = evaluatePendingResponseOrchestration(
      createDefaultOp10mSimulationSlice({ day: 8 }),
      narrative,
      8
    );
    assert.equal(maxPendingInSingleRegion(narrative), 2);
    assert.ok(pass.simulation.flags[OP10M_PENDING_ARBITRATION_FLAG]);
    assert.equal(pass.narrative.telemetry.responsesArbitrated, 1);
  });

  it('runs after compute turn hook narrative tick', () => {
    const narrative = seedPending(6);
    const pass = evaluatePendingResponseOrchestration(
      createDefaultOp10mSimulationSlice({ day: 12, money: 10000 }),
      narrative,
      12
    );
    assert.ok(pass.simulation.flags[OP10M_PENDING_BACKLOG_FLAG]);
    assert.ok(pass.simulation.money < 10000);
  });
});
