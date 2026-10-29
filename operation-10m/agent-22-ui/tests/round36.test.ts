import { describe, expect, it } from 'vitest';
import { runAgent22Round36SelfTests } from '../src/engine/round36-self-tests.js';

describe('round36', () => {
  it('passes embedded round36 suite', () => {
    const r = runAgent22Round36SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThan(0);
  });
});
