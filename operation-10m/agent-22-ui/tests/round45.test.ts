import { describe, expect, it } from 'vitest';
import { runAgent22Round45SelfTests } from '../src/engine/round45-self-tests.js';

describe('round45', () => {
  it('passes embedded round45 suite', () => {
    const r = runAgent22Round45SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
