import { describe, expect, it } from 'vitest';
import { runAgent22Round40SelfTests } from '../src/engine/round40-self-tests.js';

describe('round40', () => {
  it('passes embedded round40 suite', () => {
    const r = runAgent22Round40SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
