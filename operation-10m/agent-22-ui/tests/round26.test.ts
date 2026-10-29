import { describe, expect, it } from 'vitest';
import { runAgent22Round26SelfTests } from '../src/engine/round26-self-tests.js';

describe('round26', () => {
  it('passes embedded round26 suite', () => {
    const r = runAgent22Round26SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
