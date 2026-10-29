import { runAgent22Round53SelfTests } from '../src/engine/round53-self-tests.js';

describe('round53', () => {
  it('passes embedded round53 suite', () => {
    const r = runAgent22Round53SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
