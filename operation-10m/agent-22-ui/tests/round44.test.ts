import { describe, expect, it } from 'vitest';
import { runAgent22Round44SelfTests } from '../src/engine/round44-self-tests.js';

describe('round44', () => {
  it('passes embedded round44 suite', () => {
    const r = runAgent22Round44SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
