import { describe, expect, it } from 'vitest';
import { runAgent22Round28SelfTests } from '../src/engine/round28-self-tests.js';

describe('round28', () => {
  it('passes embedded round28 suite', () => {
    const r = runAgent22Round28SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
