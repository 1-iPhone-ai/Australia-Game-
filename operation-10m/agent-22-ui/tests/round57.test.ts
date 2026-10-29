import { runAgent22Round57SelfTests } from '../src/engine/round57-self-tests.js';

describe('round57', () => {
  it('passes embedded round57 suite', () => {
    const r = runAgent22Round57SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
