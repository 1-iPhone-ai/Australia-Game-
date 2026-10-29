import { describe, expect, it } from 'vitest';
import { runAgent22Round20SelfTests } from '../src/engine/round20-self-tests.js';

describe('Agent 22 round 20 self tests', () => {
  it('passes embedded round20 suite', () => {
    const r = runAgent22Round20SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});
