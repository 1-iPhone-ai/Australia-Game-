import { runAgent22Round72SelfTests } from '../src/engine/round72-self-tests.js';

describe('round72', () => {
  it('passes embedded round72 suite', () => {
    const r = runAgent22Round72SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
