import { describe, expect, it } from 'vitest';
import { runAgent22Round25SelfTests } from '../src/engine/round25-self-tests.js';

describe('round25', () => {
  it('passes embedded round25 suite', () => {
    const r = runAgent22Round25SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
