import { runAgent22Round65SelfTests } from '../src/engine/round65-self-tests.js';

describe('round65', () => {
  it('passes embedded round65 suite', () => {
    const r = runAgent22Round65SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
