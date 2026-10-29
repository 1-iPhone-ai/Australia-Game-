import { describe, expect, it } from 'vitest';
import { runAgent22Round29SelfTests } from '../src/engine/round29-self-tests.js';

describe('round29', () => {
  it('passes embedded round29 suite', () => {
    const r = runAgent22Round29SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
