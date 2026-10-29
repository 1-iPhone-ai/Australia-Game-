import { describe, expect, it } from 'vitest';
import { runAgent22Round21SelfTests } from '../src/engine/round21-self-tests.js';

describe('Agent 22 round 21 self tests', () => {
  it('passes embedded round21 suite', () => {
    const r = runAgent22Round21SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});
