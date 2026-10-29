import { describe, expect, it } from 'vitest';
import { runAgent22Round22SelfTests } from '../src/engine/round22-self-tests.js';

describe('Agent 22 round 22 self tests', () => {
  it('passes embedded round22 suite', () => {
    const r = runAgent22Round22SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});
