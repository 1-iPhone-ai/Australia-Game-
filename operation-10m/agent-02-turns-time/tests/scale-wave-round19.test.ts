import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  exportBatchNationalTickSessionWaveScorecard,
  compareBatchNationalTickSessionWaveScorecards,
  runNationalTickSessionWaveAssembly,
  exportBatchNationalTickSessionWaveAssembly,
  verifyBatchNationalTickSessionWaveAssemblyReplayParity,
  runNationalTickOrchestratedSessionWave,
} from '../src/index.js';

describe('national tick session wave scorecard compare (round 19)', () => {
  it('matches scorecards from identical tick specs on fresh engines', () => {
    const ticks = [
      {
        maxSteps: 1,
        input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      },
    ] as const;
    const a = exportBatchNationalTickSessionWaveScorecard(
      runNationalTickOrchestratedSessionWave(new TurnTimeEngine(), createTurnAdvanceBudget(2), ticks),
    );
    const b = exportBatchNationalTickSessionWaveScorecard(
      runNationalTickOrchestratedSessionWave(new TurnTimeEngine(), createTurnAdvanceBudget(2), ticks),
    );
    const cmp = compareBatchNationalTickSessionWaveScorecards(a, b);
    assert.equal(cmp.ok, true);
    assert.equal(cmp.scorecardDigestMatch, true);
  });
});

describe('national tick session wave assembly run (round 19)', () => {
  it('produces digest when gate passes', () => {
    const engine = new TurnTimeEngine();
    const budget = createTurnAdvanceBudget(2);
    const ticks = [
      {
        maxSteps: 1,
        input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      },
    ] as const;
    const run = runNationalTickSessionWaveAssembly(engine, budget, ticks);
    const exp = exportBatchNationalTickSessionWaveAssembly(run);
    assert.equal(exp.ok, true);
    assert.match(exp.assemblyDigest, /^[0-9a-f]{16}$/);
    assert.equal(exp.assemblyDigest, run.assemblyDigest);
  });
});

describe('national tick session wave assembly replay parity (round 19)', () => {
  it('matches assembly digest on replay from snapshot', () => {
    const engine = new TurnTimeEngine();
    const budget = createTurnAdvanceBudget(2);
    const ticks = [
      {
        maxSteps: 1,
        input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      },
    ] as const;
    const parity = verifyBatchNationalTickSessionWaveAssemblyReplayParity(engine, budget, ticks);
    assert.equal(parity.parityOk, true);
    assert.equal(parity.baseline.assemblyDigest, parity.replay.assemblyDigest);
  });
});
