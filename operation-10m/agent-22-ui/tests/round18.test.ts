import { describe, expect, it } from 'vitest';
import { runAgent22Round18SelfTests } from '../src/engine/round18-self-tests.js';

describe('Agent 22 round 18 self tests', () => {
  it('passes embedded round18 suite', () => {
    const r = runAgent22Round18SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});
