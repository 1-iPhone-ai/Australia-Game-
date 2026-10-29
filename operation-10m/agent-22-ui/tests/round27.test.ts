import { describe, expect, it } from 'vitest';
import { runAgent22Round27SelfTests } from '../src/engine/round27-self-tests.js';

describe('round27', () => {
  it('passes embedded round27 suite', () => {
    const r = runAgent22Round27SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
