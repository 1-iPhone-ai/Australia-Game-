import { describe, expect, it } from 'vitest';
import { runAgent22Round34SelfTests } from '../src/engine/round34-self-tests.js';

describe('round34', () => {
  it('passes embedded round34 suite', () => {
    const r = runAgent22Round34SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
