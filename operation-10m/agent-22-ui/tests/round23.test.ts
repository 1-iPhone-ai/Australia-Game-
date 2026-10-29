import { describe, expect, it } from 'vitest';
import { runAgent22Round23SelfTests } from '../src/engine/round23-self-tests.js';

describe('Agent 22 round 23 self tests', () => {
  it('passes embedded round23 suite', () => {
    const r = runAgent22Round23SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});
