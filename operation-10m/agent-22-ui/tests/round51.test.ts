import { runAgent22Round51SelfTests } from '../src/engine/round51-self-tests.js';

describe('round51', () => {
  it('passes embedded round51 suite', () => {
    const r = runAgent22Round51SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
