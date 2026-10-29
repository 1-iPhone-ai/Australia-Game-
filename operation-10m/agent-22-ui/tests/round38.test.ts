import { describe, expect, it } from 'vitest';
import { runAgent22Round38SelfTests } from '../src/engine/round38-self-tests.js';

describe('round38', () => {
  it('passes embedded round38 suite', () => {
    const r = runAgent22Round38SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
