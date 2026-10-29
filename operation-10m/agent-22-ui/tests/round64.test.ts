import { runAgent22Round64SelfTests } from '../src/engine/round64-self-tests.js';

describe('round64', () => {
  it('passes embedded round64 suite', () => {
    const r = runAgent22Round64SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
