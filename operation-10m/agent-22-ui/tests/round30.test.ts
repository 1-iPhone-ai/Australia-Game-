import { describe, expect, it } from 'vitest';
import { runAgent22Round30SelfTests } from '../src/engine/round30-self-tests.js';

describe('round30', () => {
  it('passes embedded round30 suite', () => {
    const r = runAgent22Round30SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
