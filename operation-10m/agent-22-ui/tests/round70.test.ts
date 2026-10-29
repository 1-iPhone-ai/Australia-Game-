import { runAgent22Round70SelfTests } from '../src/engine/round70-self-tests.js';

describe('round70', () => {
  it('passes embedded round70 suite', () => {
    const r = runAgent22Round70SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
