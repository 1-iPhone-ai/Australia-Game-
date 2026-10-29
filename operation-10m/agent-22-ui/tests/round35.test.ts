import { describe, expect, it } from 'vitest';
import { runAgent22Round35SelfTests } from '../src/engine/round35-self-tests.js';

describe('round35', () => {
  it('passes embedded round35 suite', () => {
    const r = runAgent22Round35SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
