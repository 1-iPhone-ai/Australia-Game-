import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TurnTimeEngine, snapshotDigest } from '../src/index.js';

describe('defer schedule', () => {
  it('defers pending obligation without skipping integrity', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'tax', dueTurn: 2, kind: 'tax' });
    engine.deferObligation('tax', 5);
    engine.stepFullTurn();
    engine.stepFullTurn();
    assert.equal(engine.snapshot().obligations[0]?.status, 'pending');
    assert.ok(engine.validate().ok);
    engine.stepFullTurn();
    engine.stepFullTurn();
    engine.stepFullTurn();
    assert.equal(engine.snapshot().obligations[0]?.status, 'fired');
  });

  it('defer after pause keeps single fire', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'due', dueTurn: 1, kind: 'x' });
    engine.setPaused('ui');
    engine.stepFullTurn();
    engine.deferObligation('due', 2);
    engine.clearPaused();
    engine.stepFullTurn();
    engine.stepFullTurn();
    assert.equal(engine.snapshot().obligations.filter((o) => o.status === 'fired').length, 1);
  });
});

describe('turn audit digest', () => {
  it('produces stable snapshot digest', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'a', dueTurn: 3, kind: 'k' });
    const d1 = engine.getSnapshotDigest();
    const d2 = snapshotDigest(engine.snapshot());
    assert.equal(d1, d2);
    assert.match(d1, /^[0-9a-f]{16}$/);
    const report = engine.getAuditReport();
    assert.equal(report.pendingObligations, 1);
    assert.equal(report.armedFollowUps, 0);
  });
});
