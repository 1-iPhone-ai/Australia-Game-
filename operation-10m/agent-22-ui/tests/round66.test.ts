import { runAgent22Round66SelfTests } from '../src/engine/round66-self-tests.js';

describe('round66', () => {
  it('passes embedded round66 suite', () => {
    const r = runAgent22Round66SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
