import { runAgent22Round56SelfTests } from '../src/engine/round56-self-tests.js';

describe('round56', () => {
  it('passes embedded round56 suite', () => {
    const r = runAgent22Round56SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
