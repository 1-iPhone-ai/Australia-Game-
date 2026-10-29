import { describe, expect, it } from 'vitest';
import { runAgent22Round33SelfTests } from '../src/engine/round33-self-tests.js';

describe('round33', () => {
  it('passes embedded round33 suite', () => {
    const r = runAgent22Round33SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
