import { describe, expect, it } from 'vitest';
import { runAgent22Round24SelfTests } from '../src/engine/round24-self-tests.js';

describe('round24', () => {
  it('passes embedded round24 suite', () => {
    const r = runAgent22Round24SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
