import { runAgent22Round58SelfTests } from '../src/engine/round58-self-tests.js';

describe('round58', () => {
  it('passes embedded round58 suite', () => {
    const r = runAgent22Round58SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
