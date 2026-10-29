import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CATALOG_TRANCHE5_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  createDefaultOp10mTurnComputeLedger,
  enqueueDeferredNarrativeMutation,
  evaluateRequirements,
  executeOp10mNarrativeComputeTurnHook,
  getDeferredQueueDepth,
  getTurnComputePassCount,
} from '../src/index.ts';

describe('Tranche 5 compute-turn catalog', () => {
  it('adds 280 compute-turn chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE5_STATS.chainCount, 280);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche5Chains, 280);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 4040);
  });

  it('uses op10m_t5 ids without colliding', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 4040);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5) {
      assert.match(c.chainId, /^op10m_t5_/);
    }
  });

  it('pressure requires min turn compute passes', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5.find((c) =>
      c.chainId.includes('pipeline_stall')
    )!;
    const pressure = chain.phases.find((p) => p.phase === 'pressure')!;
    const runtime = {
      chainId: chain.chainId,
      phase: 'pressure' as const,
      startedDay: 40,
      lastAdvancedDay: 45,
      stageCooldownUntilDay: 0,
    };
    const sim = createDefaultOp10mSimulationSlice({ day: 50, activeCrisisCount: 2 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    assert.equal(evaluateRequirements(pressure.requires, sim, runtime, { narrative }).ok, false);
    narrative = {
      ...narrative,
      turnCompute: { ...createDefaultOp10mTurnComputeLedger(), computePassCount: 3 },
    };
    assert.equal(getTurnComputePassCount(narrative), 3);
    assert.equal(evaluateRequirements(pressure.requires, sim, runtime, { narrative }).ok, true);
  });

  it('rupture requires deferred queue depth', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5[0];
    const rupture = chain.phases.find((p) => p.phase === 'rupture')!;
    const runtime = {
      chainId: chain.chainId,
      phase: 'rupture' as const,
      startedDay: 50,
      lastAdvancedDay: 55,
      stageCooldownUntilDay: 0,
    };
    const sim = createDefaultOp10mSimulationSlice({ day: 60, money: 50000 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = {
      ...narrative,
      turnCompute: {
        lastTurn: 4,
        lastDay: 60,
        computePassCount: 4,
        turnComputeDigest: 'test',
        deferredMutations: [],
        lastStages: [],
      },
    };
    assert.equal(
      evaluateRequirements(rupture.requires, sim, runtime, { narrative }).ok,
      false
    );
    narrative = enqueueDeferredNarrativeMutation(narrative, {
      chainId: chain.chainId,
      firesOnTurn: 6,
      enqueuedDay: 60,
      mutation: { stabilityDelta: -1 },
    });
    assert.equal(getDeferredQueueDepth(narrative), 1);
    assert.equal(
      evaluateRequirements(rupture.requires, sim, runtime, { narrative }).ok,
      true
    );
  });
});

describe('Compute turn hook pipeline', () => {
  it('runs four stages and increments compute passes', () => {
    const result = executeOp10mNarrativeComputeTurnHook({
      turn: 2,
      day: 15,
      simulation: createDefaultOp10mSimulationSlice({ day: 15 }),
      narrative: createDefaultOp10mNarrativeEngineState(),
      catalog: OP10M_AGENT05_CHAIN_CATALOG.slice(0, 10),
    });
    assert.equal(result.ok, true);
    assert.equal(result.stagesRun.length, 4);
    assert.equal(result.narrative.telemetry.computeTurnPasses, 1);
    assert.match(String(result.simulation.flags.op10m_turn_compute_digest), /^t2\|d15\|/);
  });

  it('drains deferred mutations on a later turn', () => {
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative = enqueueDeferredNarrativeMutation(narrative, {
      chainId: 'test_chain',
      firesOnTurn: 3,
      enqueuedDay: 10,
      mutation: { moneyDelta: -500, stabilityDelta: -3 },
    });
    const sim = createDefaultOp10mSimulationSlice({ day: 12, money: 20000 });
    const result = executeOp10mNarrativeComputeTurnHook({
      turn: 3,
      day: 12,
      simulation: sim,
      narrative,
      catalog: [],
    });
    assert.equal(getDeferredQueueDepth(result.narrative), 0);
    assert.equal(result.narrative.telemetry.deferredMutationsFired, 1);
    assert.equal(result.simulation.money, 19500);
  });
});
