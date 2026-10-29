import { runAgent22Round63SelfTests } from '../src/engine/round63-self-tests.js';

describe('round63', () => {
  it('passes embedded round63 suite', () => {
    const r = runAgent22Round63SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
