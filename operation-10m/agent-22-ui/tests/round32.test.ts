import { describe, expect, it } from 'vitest';
import { runAgent22Round32SelfTests } from '../src/engine/round32-self-tests.js';

describe('round32', () => {
  it('passes embedded round32 suite', () => {
    const r = runAgent22Round32SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
