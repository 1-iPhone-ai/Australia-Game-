import { runAgent22Round50SelfTests } from '../src/engine/round50-self-tests.js';

describe('round50', () => {
  it('passes embedded round50 suite', () => {
    const r = runAgent22Round50SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
