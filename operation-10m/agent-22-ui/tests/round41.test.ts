import { describe, expect, it } from 'vitest';
import { runAgent22Round41SelfTests } from '../src/engine/round41-self-tests.js';

describe('round41', () => {
  it('passes embedded round41 suite', () => {
    const r = runAgent22Round41SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
