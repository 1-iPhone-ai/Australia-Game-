import { describe, expect, it } from 'vitest';
import { runAgent22Round19SelfTests } from '../src/engine/round19-self-tests.js';

describe('Agent 22 round 19 self tests', () => {
  it('passes embedded round19 suite', () => {
    const r = runAgent22Round19SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});
