import { describe, expect, it } from 'vitest';
import { runAgent22Round46SelfTests } from '../src/engine/round46-self-tests.js';

describe('round46', () => {
  it('passes embedded round46 suite', () => {
    const r = runAgent22Round46SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
