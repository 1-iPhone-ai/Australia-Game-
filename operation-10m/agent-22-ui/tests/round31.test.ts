import { describe, expect, it } from 'vitest';
import { runAgent22Round31SelfTests } from '../src/engine/round31-self-tests.js';

describe('round31', () => {
  it('passes embedded round31 suite', () => {
    const r = runAgent22Round31SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
