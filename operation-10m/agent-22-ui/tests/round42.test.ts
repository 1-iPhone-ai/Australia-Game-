import { describe, expect, it } from 'vitest';
import { runAgent22Round42SelfTests } from '../src/engine/round42-self-tests.js';

describe('round42', () => {
  it('passes embedded round42 suite', () => {
    const r = runAgent22Round42SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
