import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateStabilizationCalmStreak,
  stepTurnsWithBudgetStabilizationCapture,
  summarizeBatchOrchestratedAdvanceReport,
  compareBatchOrchestratedReports,
  stepTurnsWithBudgetOrchestratedAuditedAdvance,
  stepTurnsWithBudgetOrchestratedAdvance,
} from '../src/index.js';

describe('stabilization calm streak gate', () => {
  it('flags sustained calm across a queue rebound', () => {
    const engine = new TurnTimeEngine();
    const { batch } = stepTurnsWithBudgetStabilizationCapture(engine, 2, createTurnAdvanceBudget(3));
    const gate = gateStabilizationCalmStreak(
      batch,
      {
        queueBeforeByTurn: {
          1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
          2: { pendingEventDueCount: 0, pendingObligationDueCount: 1 },
        },
        queueAfterByTurn: {
          1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
          2: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
        },
      },
      {
        1: { postQueueCalm: true, pendingStabilizationWave: false },
        2: { postQueueCalm: true, pendingStabilizationWave: false },
      },
    );
    assert.equal(gate.ok, false);
    assert.equal(gate.violations[0]?.code, 'sustained_calm_over_rebound');
  });
});

describe('orchestrated advance summary', () => {
  it('projects key metrics from orchestrated report', () => {
    const engine = new TurnTimeEngine();
    const run = stepTurnsWithBudgetOrchestratedAdvance(engine, 1, createTurnAdvanceBudget(2), {
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    const summary = summarizeBatchOrchestratedAdvanceReport(run.report, run.orchestratedDigest);
    assert.equal(summary.completedSteps, 1);
    assert.equal(summary.orchestratedDigest, run.orchestratedDigest);
    assert.equal(summary.alignmentRatio, 1);
  });
});

describe('orchestrated report compare', () => {
  it('detects identical replay runs', () => {
    const engine = new TurnTimeEngine();
    const input = { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } };
    const a = stepTurnsWithBudgetOrchestratedAdvance(engine, 1, createTurnAdvanceBudget(2), input);
    const b = stepTurnsWithBudgetOrchestratedAdvance(new TurnTimeEngine(), 1, createTurnAdvanceBudget(2), input);
    const cmp = compareBatchOrchestratedReports(a.report, b.report);
    assert.equal(cmp.completedDelta, 0);
    assert.equal(cmp.alignmentDelta, 0);
  });
});

describe('orchestrated audited advance (round 13)', () => {
  it('includes calm streak gate and audit digest', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'a13', dueTurn: 1, kind: 'n' });
    const run = stepTurnsWithBudgetOrchestratedAuditedAdvance(engine, 1, createTurnAdvanceBudget(2), {
      externalByTurn: { 1: ['a13'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
    });
    assert.equal(run.report.ok, true);
    assert.equal(run.summary.ok, true);
    assert.match(run.auditDigest, /^[0-9a-f]{16}$/);
    assert.equal(run.report.calmStreak?.ok, true);
  });
});
