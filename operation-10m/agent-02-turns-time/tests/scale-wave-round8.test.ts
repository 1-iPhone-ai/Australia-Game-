import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  buildPipelineCoverageGapReport,
  computeBatchObservabilityDigest,
  gateExternalDayPlanForBatch,
  buildAdvanceBudgetBatchReport,
  gateBatchAdvanceReadiness,
  stepTurnsWithBudgetReadinessGate,
} from '../src/index.js';

describe('pipeline coverage gap report', () => {
  it('tracks missing stages before any turns', () => {
    const engine = new TurnTimeEngine();
    const gap = buildPipelineCoverageGapReport(engine.snapshot());
    assert.equal(gap.coverage.registeredStageCount, 9);
    assert.equal(gap.observedCount, 0);
    assert.equal(gap.ok, false);
    assert.equal(gap.missingStageIds.length, 9);
  });

  it('increases observed count after a full obligation turn', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'g', dueTurn: 1, kind: 'k' });
    engine.stepFullTurn();
    const gap = engine.buildPipelineCoverageGapReport();
    assert.ok(gap.observedCount >= 3);
    assert.ok(gap.coverageRatio > 0);
  });
});

describe('batch observability digest', () => {
  it('is stable for identical rollups', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'd', dueTurn: 1, kind: 'k' });
    const run = engine.stepTurnsWithBudgetObservability(1, createTurnAdvanceBudget(2));
    const a = computeBatchObservabilityDigest(run.rollup);
    const b = engine.computeBatchObservabilityDigest(run.rollup);
    assert.equal(a, b);
    assert.match(a, /^[0-9a-f]{16}$/);
  });
});

describe('external day plan batch gate', () => {
  it('passes when each stepped turn aligns', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'e1', dueTurn: 1, kind: 'n' });
    engine.registerObligation({ id: 'o2', dueTurn: 2, kind: 'k' });
    const batch = engine.stepTurnsWithBudget(2, createTurnAdvanceBudget(3));
    const gate = gateExternalDayPlanForBatch(batch, { 1: ['e1'], 2: [] });
    assert.deepEqual(gate.steppedTurns, [1, 2]);
    assert.equal(gate.ok, true);
  });

  it('flags drift on a stepped turn', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'real', dueTurn: 1, kind: 'n' });
    const batch = engine.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));
    const gate = engine.gateExternalDayPlanForBatch(batch, { 1: ['ghost'] });
    assert.equal(gate.ok, false);
    assert.deepEqual(gate.failingTurns, [1]);
  });
});

describe('advance budget batch report', () => {
  it('marks budget exhaustion when batch stops early', () => {
    const engine = new TurnTimeEngine();
    const batch = engine.stepTurnsWithBudget(5, createTurnAdvanceBudget(1));
    const report = buildAdvanceBudgetBatchReport(batch);
    assert.equal(report.consumed, 1);
    assert.equal(report.exhausted, true);
    assert.equal(report.stoppedForBudget, true);
  });
});

describe('batch advance readiness gate', () => {
  it('combines observability, XS-02 batch merge, and digest', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'xs', dueTurn: 1, kind: 'xs' });
    engine.registerObligation({ id: 'ob', dueTurn: 1, kind: 'k' });
    const run = stepTurnsWithBudgetReadinessGate(engine, 1, createTurnAdvanceBudget(2), { 1: ['xs'] });
    assert.equal(run.readiness.ok, true);
    assert.equal(run.readiness.observabilityOk, true);
    assert.equal(run.readiness.externalBatchOk, true);
    assert.ok(run.readiness.digest.length === 16);
  });

  it('fails readiness when external batch merge fails', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'ev', dueTurn: 1, kind: 'n' });
    const { rollup, batch } = engine.stepTurnsWithBudgetObservability(1, createTurnAdvanceBudget(2));
    const readiness = gateBatchAdvanceReadiness(engine.snapshot(), rollup, { 1: ['wrong'] });
    assert.equal(readiness.externalBatchOk, false);
    assert.equal(readiness.ok, false);
    assert.equal(batch.completed, 1);
  });
});
