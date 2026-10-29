import { runAgent22Round67SelfTests } from '../src/engine/round67-self-tests.js';

describe('round67', () => {
  it('passes embedded round67 suite', () => {
    const r = runAgent22Round67SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
