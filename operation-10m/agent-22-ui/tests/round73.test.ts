import { runAgent22Round73SelfTests } from '../src/engine/round73-self-tests.js';

describe('round73', () => {
  it('passes embedded round73 suite', () => {
    const r = runAgent22Round73SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
