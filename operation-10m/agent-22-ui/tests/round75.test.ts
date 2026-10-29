import { runAgent22Round75SelfTests } from '../src/engine/round75-self-tests.js';

describe('round75', () => {
  it('passes embedded round75 suite', () => {
    const r = runAgent22Round75SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
