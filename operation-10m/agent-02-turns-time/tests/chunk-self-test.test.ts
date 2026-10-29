import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runOp10mAgent02TurnsTimeSelfTests } from '../chunk.tsx';

describe('assembly chunk.tsx', () => {
  it('includes OP10M markers and passing embedded self-tests', () => {
    const result = runOp10mAgent02TurnsTimeSelfTests();
    assert.equal(result.failed, 0, JSON.stringify(result.results));
    assert.equal(result.passed, result.results.length);
  });
});
