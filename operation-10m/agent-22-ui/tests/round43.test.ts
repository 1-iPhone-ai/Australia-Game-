import { describe, expect, it } from 'vitest';
import { runAgent22Round43SelfTests } from '../src/engine/round43-self-tests.js';

describe('round43', () => {
  it('passes embedded round43 suite', () => {
    const r = runAgent22Round43SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
