import { describe, expect, it } from 'vitest';
import { runAgent22Round37SelfTests } from '../src/engine/round37-self-tests.js';

describe('round37', () => {
  it('passes embedded round37 suite', () => {
    const r = runAgent22Round37SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
