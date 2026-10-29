import { runAgent22Round48SelfTests } from '../src/engine/round48-self-tests.js';

describe('round48', () => {
  it('passes embedded round48 suite', () => {
    const r = runAgent22Round48SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
